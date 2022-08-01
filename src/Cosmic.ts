import { CosmicFFI } from './CosmicFFI';

const Client = require('mppclone-client');

class Cosmic {
    static client: typeof Client = new Client('wss://mppclone.com:8443', process.env.MPPCLONE_TOKEN);

    static desiredUser = {
        name: '. ✧ * Cosmic * ✧ .',
        color: '#1d0054'
    }

    static start() {
        this.client.start();

        this.bindEventListeners();
    }

    static stop() {
        this.client.stop();
    }

    static alreadyBound = false;

    static bindEventListeners() {
        if (this.alreadyBound) return;
        this.alreadyBound = true;

        this.client.on('hi', msg => {
            this.client.setChannel('✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧');
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
}

export {
    Cosmic
}
