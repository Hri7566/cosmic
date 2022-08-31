/**
 * COSMIC PROJECT
 * 
 * Cosmic client module
 */

const normalize = require('normalize-strings');
const Client = require('mppclone-client');
const YAML = require('yaml');
const { EventEmitter } = require('events');

import { Cosmic } from './Cosmic';
import { CosmicCommandHandler } from './CosmicCommandHandler';
const { Token, ChatMessage, Vector2, Participant } = require('./CosmicTypes');
const { CosmicFFI } = require('./CosmicFFI');
const { CosmicLogger, white, blue, hex } = require('./CosmicLogger');
const { CosmicForeignMessageHandler } = require('./CosmicForeignMessageHandler');
const { CosmicData } = require('./CosmicData');

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

    public logger = new CosmicLogger("Cosmic Client", blue);

    public platform: string;

    constructor() {
        
    }

    public alreadyBound: boolean = false;

    public bindEventListeners() {
        if (this.alreadyBound == true) return;
        this.alreadyBound = true;

        this.on('chat message', async msg => {
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

    start() {
        this.sendInterval = setInterval(() => {
            this.cl.setCursorPos(this.pos.x, this.pos.y);
        }, 1000 / CURSOR_SEND_RATE);

        this.updateInterval = setInterval(() => {
            let followPos: typeof Vector2 = {
                x: 50,
                y: 50
            }

            if (this.follow) {
                followPos = {
                    x: parseFloat(this.cl.getPart(this.follow).x),
                    y: parseFloat(this.cl.getPart(this.follow).y)
                }
            }

            this.angle += this.speed;
            if (this.angle > 360) this.angle -= 360;
            this.pos.y = (Math.cos(this.angle * (Math.PI/180) * 3) * this.scale) + followPos.y;
            this.pos.x = (Math.sin(this.angle * (Math.PI / 180)) * this.scale) + followPos.x;
        }, 1000 / CURSOR_UPDATE_RATE);
    }

    stop() {
        clearInterval(this.sendInterval);
        clearInterval(this.updateInterval);
    }
}

export class CosmicClientMPP extends CosmicClientToken {
    private started: boolean = false;
    private desiredChannel: ChannelConstructionPreset;
    
    private desiredUser = {
        name: `🟇 Cosmic (${CosmicCommandHandler.prefixes[0].prefix}help)`,
        color: '#1d0054'
    };
    
    public client: typeof Client;
    public cursor: Cursor;
    public platform: string = 'mpp';

    constructor(uri: string, channel: ChannelConstructionPreset, token: string) {
        super();
        this.client = new Client(uri, token);
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
        
        this.logger.log(`Starting in ${this.desiredChannel}...`);
        this.started = true;
        this.client.start();
    }

    /**
     * Stop the client
     */
    public stop(): void {
        this.started = false;
        this.client.stop();
    }

    public bindEventListeners() {
        super.bindEventListeners();

        this.client.on('a', msg => {
            // process.stdout.write(`[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}\n`);
            // ffi broke :(
            // console.log(CosmicFFI.clib.red(msg.a));

            let newmsg = CosmicForeignMessageHandler.convertMessage('chat', msg);
            this.emit('chat message', newmsg);
        });

        this.client.on('hi', msg => {
            this.client.setChannel(this.desiredChannel._id, this.desiredChannel.set);
            this.cursor.start();

            this.logger.log(`Connected to ${this.client.uri}`);
        });

        setInterval(() => {
            if (!this.client.isConnected()) return;
            
            let set = this.client.getOwnParticipant();
            
            if (set.name !== this.desiredUser.name || set.color !== this.desiredUser.color) {
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

    private previousCursorPos: typeof Vector2 = {
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

    public getPart(str: string) {
        let p: typeof Participant;
        for (p of Object.values(this.client.ppl)) {
            if (p.name.toLowerCase().includes(str.toLowerCase()) || p._id.toLowerCase().includes(str.toLowerCase())) {
                return p;
            }
        }
    }
}
