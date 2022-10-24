/**
 * COSMIC PROJECT
 * 
 * Cosmic client handler
 */

import { CosmicClientDiscord } from "./CosmicClient";
import { CosmicLogger, red } from "./CosmicLogger";

/**
 * Local module imports
 */

const { CosmicClient, CosmicClientMPP, ChannelConstructionPreset } = require('./CosmicClient');

/**
 * Module-level declarations
 */

const MPP_HARD_CLIENT_LIMIT: number = 4;
const MPPCLONE_TOKEN: string = process.env.MPPCLONE_TOKEN;
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN;

type CosmicClientList = {
    [key: string]: typeof CosmicClient;
}

class CosmicClientHandler {
    private static clients = [];
    public static logger = new CosmicLogger('Client Handler', red);

    public static startMPPClient(uri: string, channel: typeof ChannelConstructionPreset): boolean {
        if (this.clients.length > MPP_HARD_CLIENT_LIMIT) return false;

        let cl = new CosmicClientMPP(uri, channel, MPPCLONE_TOKEN);
        this.clients.push(cl);
        cl.start();

        return true;
    }

    public static stopAllClients(): void {
        this.logger.log("Stopping...");

        for (let cl of this.clients) {
            cl.stop();
        }
    }

    public static startDiscordClient(): void {
        let cl = new CosmicClientDiscord();
        
        cl.start(DISCORD_TOKEN);
        
        this.clients.push(cl);
    }

    public static getClientCount(): number {
        return this.clients.length;
    }
}

/**
 * Module export
 */

export {
    CosmicClientHandler
}
