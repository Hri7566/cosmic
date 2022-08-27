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
const { CosmicLogger, white } = require('./CosmicLogger');
const { Message, CommandMessage, ChatMessage, Prefix } = require('./CosmicTypes');

/**
 * Module-level declarations
 */

const MPPCLONE_TOKEN = process.env.MPPCLONE_TOKEN;
const channelsFile = fs.readFileSync(path.resolve(__dirname, '../../config/mpp_channels.yml')).toString();
const channels = YAML.parse(channelsFile);

class Cosmic {
    public static logger = new CosmicLogger('Cosmic', white);

    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    /**
     * Start Cosmic
     */
    public static start() {
        this.bindEventListeners();

        this.logger.log('Starting channels...');

        for (const uri of Object.keys(channels)) {
            for (const ch of channels[uri]) {
                CosmicClientHandler.startClient(uri, ch);
            }
        }
    }

    /**
     * Stop Cosmic
     */
    public static stop() {
        CosmicClientHandler.stopAllClients();
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
