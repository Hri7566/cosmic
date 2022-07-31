const Client = require('mppclone-client');

class Cosmic {
    static client: typeof Client = new Client('wss://mppclone.com:8443', process.env.MPPCLONE_TOKEN);
    static ffi = require('./ffi');

    static start() {
        
    }

    static stop() {

    }
}

export {
    Cosmic
}
