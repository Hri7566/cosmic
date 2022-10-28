/**
 * COSMIC PROJECT
 * 
 * Express API module
 */

import { CosmicClientHandler } from "./CosmicClientHandler";

const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const { CosmicData } = require('./CosmicData');
const { CosmicLogger, yellow } = require('./CosmicLogger');

const PORT = process.env.PORT || 3000;

class CosmicAPI {
    public static app = express();
    public static api = express.Router();
    public static server;
    public static wss;

    public static logger = new CosmicLogger('Cosmic API', yellow);

    public static start() {
        this.logger.log('Starting...');

        this.api.get('/', async (req, res) => {
            res.json({
                status: 'online',
                clients: CosmicClientHandler.getClientCount()
            });
        });

        this.api.get('/users', async (req, res) => {
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
        
        this.server = this.app.listen(PORT, () => {
            this.logger.log(`Listening on port ${PORT}`);
        });

        this.wss = new WebSocket.Server({
            noServer: true
        });

        this.wss.on('error', err => { this.logger.error(err) });
        this.wss.on('connection', (ws, req) => {
            
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
