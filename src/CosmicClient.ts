const Client = require('mppclone-client');
const YAML = require('yaml');
const { CosmicFFI } = require('./CosmicFFI');

interface ChannelConstructionPreset {
    _id: string;
    set: {
        [key: string]: any;
    }
}

class CosmicClient {
    private started: boolean = false;
    private desiredChannel: ChannelConstructionPreset;
    private alreadyBound: boolean = false;
    
    private desiredUser = {
        name: '. ✧ * Cosmic * ✧ .',
        color: '#1d0054'
    }
    
    public client: typeof Client;

    constructor(uri: string, channel: ChannelConstructionPreset, token: string) {
        this.client = new Client(uri, token);
        this.bindEventListeners();
        this.desiredChannel = channel;
    }

    /**
     * Start the client
     * @returns undefined
     */
    public start(): void {
        if (this.started == true) return;

        this.started = true;
        this.client.start();
    }

    /**
     * Stop the client
     */
    public stop(): void {
        this.started = false;
        this.client.stop();
    }

    private bindEventListeners() {
        if (this.alreadyBound == true) return;
        this.alreadyBound = true;

        this.client.on('a', msg => {
            process.stdout.write(`[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}`);
            if (msg.a == '*test') {
                let str = CosmicFFI.clib.test();
                this.sendChat(str);
            }
        });

        this.client.on('hi', msg => {
            this.client.setChannel(this.desiredChannel._id, this.desiredChannel.set);
        });

        setInterval(() => {
            if (!this.client.isConnected()) return;
            
            let set = this.client.getOwnParticipant()._id;
            
            if (set.name !== this.desiredUser.name || set.color !== this.desiredUser.color) {
                this.client.sendArray([{
                    m: 'userset',
                    set: this.desiredUser
                }]);
            }
        }, 5000);
    }

    public sendChat(str: string): void {
        this.client.sendArray([{
            m: 'a',
            message: `\u034f${str}`
        }]);
    }
}

export {
    CosmicClient,
    ChannelConstructionPreset
}
