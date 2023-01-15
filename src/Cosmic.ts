/**
 * COSMIC PROJECT
 * 
 * Main Cosmic module
 * 
 * This file itself really isn't that large, but it loads everything else.
 */

/**
 * Global module imports
 */

const fs = require('fs');
import * as path from 'path';
import * as YAML from 'yaml';
const { EventEmitter } = require('events');

/**
 * Local module imports
 */

import { CosmicClientHandler } from './CosmicClientHandler';
import { CosmicData } from './CosmicData';
const { CosmicLogger, magenta } = require('./CosmicLogger');
const { CosmicAPI } = require('./CosmicAPI');

/**
 * Module-level declarations
 */

const ENABLE_MPP = process.env.ENABLE_MPP || 'true';
const ENABLE_DISCORD = process.env.ENABLE_DISCORD || 'true';

const channelsFile = fs.readFileSync(path.resolve(__dirname, '../../config/mpp_channels.yml')).toString();
const channels = YAML.parse(channelsFile);

class Cosmic {
    // magenta is beautiful space colors :D
    public static logger = new CosmicLogger('Cosmic', magenta);

    // event emitter prototypal
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static startTime: number;

    public static started: boolean = false;

    /**
     * Start Cosmic
     */
    public static async start(): Promise<void> {
        if (this.started) return;
        this.started = true;
        this.startTime = Date.now();

        this.bindEventListeners();

        // connect to database
        await CosmicData.start();
        
        this.logger.log('Starting clients...');

        if (ENABLE_MPP == 'true') {
            this.startMPPClients();
        }
        
        if (ENABLE_DISCORD == 'true') {
            CosmicClientHandler.startDiscordClient();
        }

        CosmicAPI.start();

        this.emit('ready');
    }

    /**
     * Stop Cosmic
     */
    public static async stop() {
        if (!this.started) return;
        this.started = false;

        this.logger.log("Stopping...");
        CosmicClientHandler.stopAllClients();
        await CosmicData.stop();
        this.logger.log("Stopped.");
    }

    // used for bindEventListeners
    private static alreadyBound: boolean = false;

    private static bindEventListeners(): void {
        if (this.alreadyBound) return;
        this.alreadyBound = true;

        this.on('ready', () => {
            this.logger.log('Ready');
        });

        this.on('log', (msg: any) => {
            this.logger.log(msg.message);
        });

        this.on('hi', () => {
            this.logger.debug('hi!');
            this.emit('hello');
        });

        this.on('bonk', (msg: any) => {
            this.emit('log', { message: 'bonked' });
            try {
                msg.r.emit('bonk', {
                    m: 'bonk',
                    from: 'Cosmic'
                });
            } catch(err) {}
        });
    }

    private static startMPPClients() {
        for (const uri of Object.keys(channels)) {
            for (const ch of channels[uri]) {
                CosmicClientHandler.startMPPClient(uri, ch);
            }
        }
    }
}

/**
 * Module-level exports
 */

export {
    Cosmic
}
