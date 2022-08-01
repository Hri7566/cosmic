const Client = require('mppclone-client');

class CosmicClient {
    client: typeof Client;
    started: boolean = false;

    constructor(channel, token) {
        this.client = new Client();
        this.bindEventListeners();
    }

    start() {
        if (this.started == true) return;

        this.started = true;
        this.client.start();
    }

    stop() {
        this.started = false;
        this.client.stop();
    }

    bindEventListeners() {
        this.client.on('a', msg => {
            console.log(`[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}`);
        });
    }
}

export {
    CosmicClient
}
