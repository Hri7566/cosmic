/**
 * COSMIC PROJECT
 * 
 * Express API module
 */

const express = require('express');

const { CosmicData } = require('./CosmicData');
const { CosmicLogger, yellow } = require('./CosmicLogger');

const PORT = process.env.PORT || 3000;

class CosmicAPI {
    public static app = express();
    public static server;

    public static logger = new CosmicLogger('Cosmic API', yellow);

    public static start() {
        this.logger.log('Starting...');

        this.server = this.app.listen(PORT, () => {
            this.logger.log(`Listening on port ${PORT}`);
        });
    }

    public static stop() {
        this.logger.log('Stopping server...');
        this.server.close();
        this.logger.log('Stopped.');
    }
}

export {
    CosmicAPI
}
