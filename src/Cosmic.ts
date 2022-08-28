/**
 * COSMIC PROJECT
 * 
 * Main Cosmic module
 */

/**
 * Module-level imports
 */

const Client = require('mppclone-client');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { EventEmitter } = require('events');

import { CosmicFFI } from './CosmicFFI';;
import { CosmicClientHandler } from './CosmicClientHandler';
import { ChannelConstructionPreset } from './CosmicClient';
import { CosmicUtil } from './CosmicUtil';
import { CosmicData } from './CosmicData';
const { CosmicLogger, magenta } = require('./CosmicLogger');
const { Message, CommandMessage, ChatMessage, Prefix } = require('./CosmicTypes');
const { CosmicAPI } = require('./CosmicAPI');

/**
 * Module-level declarations
 */

const MPPCLONE_TOKEN = process.env.MPPCLONE_TOKEN;
const channelsFile = fs.readFileSync(path.resolve(__dirname, '../../config/mpp_channels.yml')).toString();
const channels = YAML.parse(channelsFile);

class Cosmic {
    public static logger = new CosmicLogger('Cosmic', magenta);

    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    /**
     * Start Cosmic
     */
    public static async start() {
        this.bindEventListeners();

        CosmicData.start();
        
        this.logger.log('Starting clients...');

        for (const uri of Object.keys(channels)) {
            for (const ch of channels[uri]) {
                CosmicClientHandler.startClient(uri, ch);
            }
        }

        CosmicAPI.start();
    }

    /**
     * Stop Cosmic
     */
    public static stop() {
        this.logger.log("Stopping...");
        CosmicClientHandler.stopAllClients();
        CosmicData.stop();
        this.logger.log("Stopped.");
    }

    private static alreadyBound: boolean = false;

    private static bindEventListeners(): void {
        if (this.alreadyBound) return;
        this.alreadyBound = true;
    }
}

/**
 * Module-level script
 */



export {
    Cosmic
}
