import { CosmicClientToken, ChannelConstructionPreset } from "../CosmicClient";
import { CosmicCommandHandler } from "../CosmicCommandHandler";
import { CosmicForeignMessageHandler } from "../foreign/CosmicForeignMessageHandler";
import { CosmicSeasonDetection } from "../util/CosmicSeasonDetection";
import { Vector2, Participant } from "../util/CosmicTypes";
import { Cursor } from './Cursor';
const Client = require('mppclone-client');
const cmapi = require('mppclone-cmapi');

// ANCHOR MPP Client
export class CosmicClientMPP extends CosmicClientToken {
    protected started: boolean = false;
    protected desiredChannel: ChannelConstructionPreset;
    
    protected desiredUser = {
        name: `🟇 Cosmic (${CosmicCommandHandler.prefixes[0].prefix}${CosmicCommandHandler.commands.find(cmd => cmd.id == 'help').accessors[0]})${process.env.NODE_ENV == 'production' ? '' : ' [non-production]'}`,
        color: '#1d0054'
    };
    
    public client: typeof Client;
    public cursor: Cursor;
    public platform: string = 'mpp';
    public cmapi: typeof cmapi;
    public dmOnlyCommands: string[];
    public disabledCommands: string[];

    constructor(uri: string, channel: ChannelConstructionPreset, token: string, ClientClass: any = Client) {
        super();
        this.client = new ClientClass(uri, token);
        this.cmapi = new cmapi(this.client);
        this.desiredChannel = channel;
        this.cursor = new Cursor(this);
        this.bindEventListeners();
    }
    
    /**
     * Start the client
     * @returns undefined
     */
    public start(): void {
        if (this.started == true) return;
        
        this.logger.log(`Starting in ${this.desiredChannel._id}...`);
        this.started = true;
        this.client.start();
    }

    /**
     * Stop the client
     */
    public stop(): void {
        this.started = false;
        this.client.stop();
        this.cursor.stop();
        this.logger.log('Stopping...');
    }

    public last_dm: string;

    protected bindEventListeners() {
        super.bindEventListeners();

        this.client.on('a', msg => {
            // process.stdout.write(`[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}\n`);
            // ffi broke :(
            // console.log(CosmicFFI.clib.red(msg.a));

            msg.original_channel = {
                _id: this.client.channel._id,
                id: this.client.channel._id
            }

            let newmsg = CosmicForeignMessageHandler.convertMessage('chat', msg);
            this.emit('chat', newmsg);
        });

        this.client.on('dm', msg => {
            msg.original_channel = {
                _id: this.client.channel._id,
                id: this.client.channel._id,
                dm_id: msg.sender._id
            }

            msg.p = msg.sender;

            this.last_dm = msg.p;

            let newmsg = CosmicForeignMessageHandler.convertMessage('chat', msg);
            this.emit('chat', newmsg);
        });

        this.client.on('hi', msg => {
            this.client.setChannel(this.desiredChannel._id, this.desiredChannel.set);
            this.cursor.start();

            this.logger.log(`Connected to ${this.client.uri}`);

            this.client.ws.on('error', err => {
                console.error(err);
            })
        });

        // TODO maybe move this setInterval to somewhere else?
        setInterval(() => {
            if (!this.client.isConnected()) return;

            this.setSeasonalInfo();
            
            let set = this.client.getOwnParticipant();
            
            if (set.name !== this.desiredUser.name || set.color !== this.desiredUser.color) {
                // this.logger.debug('sending userset');
                this.client.sendArray([{
                    m: 'userset',
                    set: this.desiredUser
                }]);
            }

            let ch = this.client.channel;

            if (ch) {
                if (ch._id !== this.desiredChannel._id) {
                    this.client.setChannel(this.desiredChannel._id);
                }
            } else {
                this.client.setChannel(this.desiredChannel._id);
            }
        }, 5000);

        this.on('send chat message', msg => {
            if (!msg.dm) {
                this.client.sendArray([{
                    m: 'a',
                    message: `\u034f${msg.message}`
                }]);
            } else {
                this.client.sendArray([{
                    m: 'dm',
                    message: `\u034f${msg.message}`,
                    _id: msg.dm
                }]);
            }
        });

        this.client.on('t', msg => {
            this.emit('heartbeat', {
                type: 'heartbeat',
                timestamp: msg.t,
                foreign_timestamp: msg.e
            });
        });

        this.cmapi.on('?hat', msg => {
            // this.logger.debug('cmapi hat');
            this.cmapi.sendArray([{
                m: 'update hat',
                url: 'minecraft/item/nether_star'
            }], { mode: 'id', id: msg._original_sender, global: false });
        });

        this.cmapi.on('cosmic', msg => {
            // TODO implement cosmic message
            //? for userscript?
        });
    }

    /**
     * Send a chat message
     * @param str Chat message
     */
    public sendChat(str: string): void {
        this.emit('send chat message', {
            type: 'chat',
            sender: this.client.getOwnParticipant(),
            platform: 'mpp',
            message: str
        });
    }

    protected previousCursorPos: Vector2 = {
        x: 100,
        y: 200
    };
    
    /**
     * Set the client's cursor position
     * @param x X position
     * @param y Y position
     */
    public setCursorPos(x: number, y: number) {
        if (this.previousCursorPos.x !== x || this.previousCursorPos.y !== y) {
            this.client.sendArray([{
                m: 'm', x, y
            }]);
        }

        this.previousCursorPos = { x, y };
    }

    public getPart(str: string): Participant | undefined {
        if (!str) return;
        for (let p of (Object.values(this.client.ppl as Record<string, Participant>))) {
            if (p.name.toLowerCase().includes(str.toLowerCase()) || p._id.toLowerCase().includes(str.toLowerCase())) {
                return p;
            }
        }
    }

    public setSeasonalInfo(): void {
        const season = CosmicSeasonDetection.getSeason();
        const holiday = CosmicSeasonDetection.getHoliday();

        let desiredSuffix: string = '';

        if (holiday) {
            if (this.desiredUser.name.endsWith(holiday.emoji)) return;
            desiredSuffix = ` ${holiday.emoji}`;
        } else {
            if (this.desiredUser.name.endsWith(season.emoji)) return;
            desiredSuffix = ` ${season.emoji}`;
        }

        this.desiredUser.name += desiredSuffix;
    }
}