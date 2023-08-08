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

import { CosmicLogger, red } from "./CosmicLogger";
import { CosmicClient, ChannelConstructionPreset } from "./CosmicClient";
import { CosmicClientMPP } from "./MPP/CosmicClientMPP";
// import { CosmicClientDiscord } from "./Discord/CosmicClientDiscord";
import { Cosmic } from "./Cosmic";
import { CosmicClientStdin } from "./stdin/CosmicClientStdin";
import { env } from "./util/env";
import { CosmicClientSC } from "./switchchat/CosmicClientSC";

/**
 * Module-level declarations
 */

const MPP_HARD_CLIENT_LIMIT = 4;
const { MPPCLONE_TOKEN, DISCORD_TOKEN, SWITCHCHAT_TOKEN } = env;

type CosmicClientList = {
    [key: string]: typeof CosmicClient;
};

class CosmicClientHandler {
    private static clients = [];
    public static logger = new CosmicLogger("Client Handler", red);

    public static startMPPClient(
        uri: string,
        channel: ChannelConstructionPreset
    ): CosmicClient {
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

    // public static startDiscordClient(): void {
    //     let cl = new CosmicClientDiscord();

    //     cl.start(DISCORD_TOKEN);

    //     this.clients.push(cl);
    //     Cosmic.emit("client started", cl);
    // }

    public static startStdinClient(): void {
        let cl = new CosmicClientStdin();

        cl.start();

        this.clients.push(cl);
        Cosmic.emit("client started", cl);
    }

    public static getClientCount(): number {
        return this.clients.length;
    }

    public static startSwitchChatClient(): void {
        let cl = new CosmicClientSC(SWITCHCHAT_TOKEN);

        cl.start();

        this.clients.push(cl);
        Cosmic.emit("client started", cl);
    }
}

/**
 * Module export
 */

export { CosmicClientHandler };
