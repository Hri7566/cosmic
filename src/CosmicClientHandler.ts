/**
 * COSMIC PROJECT
 * 
 * Cosmic client handler
 */

/**
 * Local module imports
 */

const { CosmicClient, CosmicClientMPP, ChannelConstructionPreset } = require('./CosmicClient');

/**
 * Module-level declarations
 */

const HARD_CLIENT_LIMIT: number = 4;
const MPPCLONE_TOKEN: string = process.env.MPPCLONE_TOKEN;

type CosmicClientList = {
    [key: string]: typeof CosmicClient;
}

class CosmicClientHandler {
    private static clients = [];

    public static startClient(uri: string, channel: typeof ChannelConstructionPreset): boolean {
        if (this.clients.length > HARD_CLIENT_LIMIT) return false;

        let cl = new CosmicClientMPP(uri, channel, MPPCLONE_TOKEN);
        this.clients.push();
        cl.start();

        return true;
    }

    public static stopClient(channel: string): boolean {
        for (let cl of this.clients) {
            // if (!cl.client.isConnected()) continue;
            // if (cl.channel._id == channel) {
                this.clients.splice(this.clients.indexOf(cl), 1);
                cl.stop();
                return true;
            // }
        }

        return false;
    }

    public static stopAllClients(): void {
        for (let cl of this.clients) {
            cl.stop();
        }
    }
}

/**
 * Module export
 */

export {
    CosmicClientHandler
}
