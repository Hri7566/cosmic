/**
 * COSMIC PROJECT
 * 
 * Express API module
 */

const express = require('express');
const path = require('path');

const { CosmicData } = require('./CosmicData');
const { CosmicLogger, yellow } = require('./CosmicLogger');

const PORT = process.env.PORT || 3000;

class CosmicAPI {
    public static app = express();
    public static api = express.Router();
    public static server;

    public static logger = new CosmicLogger('Cosmic API', yellow);

    public static start() {
        this.logger.log('Starting...');

        this.api.get('/', async (req, res) => {
            const cursor = await CosmicData.users.find();
            let users = [];

            for await (let user of cursor) {
                users.push(user);
            }

            res.json(users);
        });

        this.app.use('/api', this.api);

        this.app.use(express.static(path.resolve(__dirname, '../../frontend')));
        this.app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));
        
        this.server = this.app.listen(PORT, '0.0.0.0', () => {
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
