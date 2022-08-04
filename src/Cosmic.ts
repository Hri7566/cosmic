import { CosmicFFI } from './CosmicFFI';;
import { CosmicClientHandler } from './CosmicClientHandler';
import { ChannelConstructionPreset } from './CosmicClient';

const Client = require('mppclone-client');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const MPPCLONE_TOKEN = process.env.MPPCLONE_TOKEN;

const channelsFile = fs.readFileSync(path.resolve(__dirname, '../../config/channels.yaml')).toString();
const channels = YAML.parse(channelsFile);

class Cosmic {
    /**
     * Start Cosmic
     */
    public static start() {
        this.bindEventListeners();

        for (const uri of Object.keys(channels)) {
            for (const ch of channels[uri]) {
                CosmicClientHandler.startClient(uri, ch, );
            }
        }
    }

    /**
     * Stop Cosmic
     */
    public static stop() {

    }

    private static alreadyBound: boolean = false;

    private static bindEventListeners(): void {
        if (this.alreadyBound) return;
        this.alreadyBound = true;
    }
}

export {
    Cosmic
}
