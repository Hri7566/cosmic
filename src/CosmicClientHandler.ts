const { CosmicClient, ChannelConstructionPreset } = require('./CosmicClient');

const HARD_CLIENT_LIMIT: number = 4;
const MPPCLONE_TOKEN: string = process.env.MPPCLONE_TOKEN;

type CosmicClientList = {
    [key: string]: typeof CosmicClient;
}

class CosmicClientHandler {
    private static clients: typeof CosmicClient[] = [];

    public static startClient(uri: string, channel: typeof ChannelConstructionPreset): boolean {
        if (this.clients.length > HARD_CLIENT_LIMIT) return false;

        let cl = new CosmicClient(uri, channel, MPPCLONE_TOKEN);
        this.clients.push();
        cl.start();

        return true;
    }

    public static stopClient(channel: string): boolean {
        for (let cl of this.clients) {
            if (!cl.isConnected()) continue;
            if (cl.channel._id == channel) {
                cl.stop();
                this.clients.splice(cl.channel, 1);
                return true;
            }
        }

        return false;
    }

    public static stopAllClients(): void {
        for (let cl of this.clients) {
            cl.stop();
        }
    }
}

export {
    CosmicClientHandler
}
