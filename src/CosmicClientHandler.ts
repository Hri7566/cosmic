/**
 * COSMIC PROJECT
 * 
 * Cosmic client handler
 * 
 * Loader for CosmicClient-type modules
 */

/**
 * Local module imports
*/

import { CosmicClientDiscord } from "./CosmicClient";
import { CosmicLogger, red } from "./CosmicLogger";
import { CosmicClient, CosmicClientMPP, ChannelConstructionPreset } from './CosmicClient';
import { Cosmic } from "./Cosmic";

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

    public static startMPPClient(uri: string, channel: ChannelConstructionPreset): CosmicClient {
        if (this.clients.length > MPP_HARD_CLIENT_LIMIT) return;

        let cl = new CosmicClientMPP(uri, channel, MPPCLONE_TOKEN);
        this.clients.push(cl);
        cl.start();

        return cl;
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
        Cosmic.emit('client started', cl);
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
