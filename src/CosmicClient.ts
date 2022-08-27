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
const { Token, ChatMessage } = require('./CosmicTypes');
const { CosmicFFI } = require('./CosmicFFI');
const { CosmicLogger, white, hex } = require('./CosmicLogger');
const { CosmicForeignMessageHandler } = require('./CosmicForeignMessageHandler');

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

    public logger = new CosmicLogger("Cosmic Client", white);

    constructor() {
        
    }

    public alreadyBound: boolean = false;

    public bindEventListeners() {
        if (this.alreadyBound == true) return;
        this.alreadyBound = true;

        this.on('chat message', msg => {
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

export class CosmicClientMPP extends CosmicClientToken {
    private started: boolean = false;
    private desiredChannel: ChannelConstructionPreset;
    
    private desiredUser = {
        name: '. ✧ * Cosmic * ✧ .',
        color: '#1d0054'
    };
    
    public client: typeof Client;

    constructor(uri: string, channel: ChannelConstructionPreset, token: string) {
        super();
        this.client = new Client(uri, token);
        this.bindEventListeners();
        this.desiredChannel = channel;
    }

    /**
     * Start the client
     * @returns undefined
     */
    public start(): void {
        if (this.started == true) return;

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
        });

        setInterval(() => {
            if (!this.client.isConnected()) return;
            
            let set = this.client.getOwnParticipant()._id;
            
            if (set.name !== this.desiredUser.name || set.color !== this.desiredUser.color) {
                this.client.sendArray([{
                    m: 'userset',
                    set: this.desiredUser
                }]);
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
}
