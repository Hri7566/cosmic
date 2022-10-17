/**
 * COSMIC PROJECT
 * 
 * Cosmic client module
 */

/**
 * Global module imports
 */

const normalize = require('normalize-strings');
const Client = require('mppclone-client');
const YAML = require('yaml');
const { EventEmitter } = require('events');
const Discord = require('discord.js');

/**
 * Local module imports
 */

const { Cosmic } = require('./Cosmic');
import { CosmicCommandHandler } from './CosmicCommandHandler';
import { CosmicSeasonDetection } from './CosmicSeasonDetection';
import { Cosmic } from './CosmicTypes';
const { Token, ChatMessage, Vector2, Participant } = require('./CosmicTypes');
const { CosmicFFI } = require('./CosmicFFI');
const { CosmicLogger, white, magenta, hex } = require('./CosmicLogger');
const { CosmicForeignMessageHandler } = require('./CosmicForeignMessageHandler');
const { CosmicData } = require('./CosmicData');

/**
 * Module-level declarations
 */

const CURSOR_SEND_RATE = 20;
const CURSOR_UPDATE_RATE = 60;

export interface ChannelConstructionPreset {
    _id: string;
    set: {
        [key: string]: any;
    }
}

export abstract class CosmicClient {
    public on = EventEmitter.prototype.on;
    public off = EventEmitter.prototype.off;
    public once = EventEmitter.prototype.once;
    public emit = EventEmitter.prototype.emit;

    public logger: typeof CosmicLogger = new CosmicLogger("Cosmic Client", magenta);

    public platform: string;

    constructor() {
        
    }

    public alreadyBound: boolean = false;

    protected bindEventListeners() {
        if (this.alreadyBound == true) return;
        this.alreadyBound = true;

        this.on('chat', async (msg: Cosmic.ChatMessage) => {
            let res = await CosmicData.updateUser(msg.sender._id, msg.sender);
            if (typeof res == 'object') {
                if (res.upsertedId == null) {
                    let res2 = await CosmicData.insertUser(msg.sender);
                }
            }
            
            // check all chat messages for commands
            CosmicCommandHandler.checkCommand(msg, this);

            // log messages to console
            this.logger.log(`[${msg.sender._id.substring(0, 6)}] <${hex(msg.sender.color, `${normalize(msg.sender.name)}`)}> ${normalize(msg.message)}`);
        });
    }

    public sendChat(str: string): void {

    }

    public emitMessage(msg): void {
        this.emit(msg.type, msg);
    }
}

export abstract class CosmicClientToken extends CosmicClient {
    private token: typeof Token;

    constructor() {
        super();
    }
}

class Cursor {
    public cl: typeof Client;

    public sendInterval: any;
    public updateInterval: any;
    public pos: typeof Vector2;
    public vel: typeof Vector2;
    public angle: typeof Vector2;
    public follow: string | undefined;
    public scale: number;
    public speed: number;
    
    constructor(cl: CosmicClientMPP) {
        this.cl = cl;
        this.pos = { x: 50, y: 50 };
        this.vel = { x: 0, y: 0 };
        this.angle = 0;
        this.scale = 10;
        this.speed = 1;
    }
    
    public started: boolean = false;
    
    start() {
        if (this.started) return;
        this.started = true;
        this.sendInterval = setInterval(() => {
            this.cl.setCursorPos(this.pos.x, this.pos.y);
        }, 1000 / CURSOR_SEND_RATE);

        this.updateInterval = setInterval(() => {
            let followPos: typeof Vector2 = {
                x: 50,
                y: 50
            }

            try {
                if (this.cl.getPart(this.follow)) {
                    followPos = {
                        x: parseFloat(this.cl.getPart(this.follow).x),
                        y: parseFloat(this.cl.getPart(this.follow).y)
                    }
                }
            } finally {
                this.angle += this.speed;
                if (this.angle > 360) this.angle -= 360;
                this.pos.y = (Math.cos(this.angle * (Math.PI/180) * 3) * this.scale) + followPos.y;
                this.pos.x = (Math.sin(this.angle * (Math.PI / 180)) * this.scale) + followPos.x;
            }
        }, 1000 / CURSOR_UPDATE_RATE);
    }

    stop() {
        clearInterval(this.sendInterval);
        clearInterval(this.updateInterval);
    }
}

export class CosmicClientMPP extends CosmicClientToken {
    protected started: boolean = false;
    protected desiredChannel: ChannelConstructionPreset;
    
    protected desiredUser = {
        name: `🟇 Cosmic (${CosmicCommandHandler.prefixes[0].prefix}help)`,
        color: '#1d0054'
    };
    
    public client: typeof Client;
    public cursor: Cursor;
    public platform: string = 'mpp';

    constructor(uri: string, channel: ChannelConstructionPreset, token: string, ClientClass: any = Client) {
        super();
        this.client = new ClientClass(uri, token);
        this.bindEventListeners();
        this.desiredChannel = channel;
        this.cursor = new Cursor(this);
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

        this.client.on('hi', msg => {
            this.client.setChannel(this.desiredChannel._id, this.desiredChannel.set);
            this.cursor.start();

            this.logger.log(`Connected to ${this.client.uri}`);
        });

        setInterval(() => {
            if (!this.client.isConnected()) return;

            this.setSeasonalInfo();
            
            let set = this.client.getOwnParticipant();
            
            if (set.name !== this.desiredUser.name || set.color !== this.desiredUser.color) {
                this.logger.debug('sending userset');
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
            this.client.sendArray([{
                m: 'a',
                message: `\u034f${msg.message}`
            }]);
        });

        this.client.on('t', msg => {
            this.emit('heartbeat', {
                type: 'heartbeat',
                timestamp: msg.t,
                foreign_timestamp: msg.e
            });
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

    protected previousCursorPos: typeof Vector2 = {
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

    public getPart(str: string): typeof Participant | undefined {
        let p: typeof Participant;
        if (!str) return;
        for (p of Object.values(this.client.ppl)) {
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

export class CosmicClientDiscord extends CosmicClientToken {
    public platform: string = 'discord';
    public previousChannel: string;

    public client: typeof Discord.Client;

    constructor() {
        super();
        this.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMembers
            ]
        });
        this.bindEventListeners();
    }

    /**
     * Start Discord client
     * @param token Discord token
     */
    public start(token: string) {
        this.client.login(token);
    }
    
    /**
     * Stop Discord client
     */
    public stop() {
        this.client.destroy();
    }

    /**
     * Send a chat message in the last channel (or desired channel by passing an ID)
     * @param str Message
     * @param channel Optional channel ID
     */
    public async sendChat(str: string, channel?: string): Promise<void> {
        if (!str) return;

        let special_chars = [
            '/',
            '\\',
            '*',
            '_',
            '>',
            '-'
        ];
        
        for (const char of special_chars) {
            str = str.split(char).join(`\\${char}`);
        }

        try {
            if (channel) {
                (await this.client.channels.cache.get(channel)).send(`\u034f${str}`);
            } else {
                if (this.previousChannel) {
                    (await this.client.channels.cache.get(this.previousChannel)).send(`\u034f${str}`);
                }
            }
        } catch (err) {
            this.logger.error(err);
        }
    }

    protected bindEventListeners(): void {
        super.bindEventListeners();

        this.client.on('ready', () => {
            this.logger.log('Online on Discord');
        });

        this.client.on('messageCreate', msg => {
            let newmsg = CosmicForeignMessageHandler.convertMessage('chat', {
                a: msg.content,
                p: {
                    name: msg.author.username,
                    _id: msg.author.id,
                    color: msg.member.displayHexColor
                },
                original_channel: {
                    id: msg.channel.id,
                    _id: (msg.channel as any).name
                }
            });
            
            this.previousChannel = msg.channel.id;
            this.emit('chat', newmsg);
        });

        this.on('send chat message', msg => {
            let channel = this.previousChannel;
            if (msg.channel) channel = msg.channel;

            // console.log(msg);
            this.sendChat(msg.message, channel);
        });
    }
}
