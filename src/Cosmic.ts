/**
 * COSMIC PROJECT
 * 
 * Main Cosmic module
 */

/**
 * Global module imports
 */

const Client = require('mppclone-client');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
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
        CosmicData.start();
        
        this.logger.log('Starting clients...');

        if (ENABLE_MPP == 'true') {
            for (const uri of Object.keys(channels)) {
                for (const ch of channels[uri]) {
                    CosmicClientHandler.startMPPClient(uri, ch);
                }
            }
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
    }
}

/**
 * Module-level exports
 */

export {
    Cosmic
}
