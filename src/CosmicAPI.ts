/**
 * COSMIC PROJECT
 * 
 * Express API module
 */

import { readFile, readFileSync } from "fs";
import { resolve } from "path";
import * as http from 'http';
import * as https from 'https';
import { CosmicClientHandler } from "./CosmicClientHandler";
import { Cosmic } from "./Cosmic";
import { CosmicShop } from "./CosmicShop";
import { CosmicSeasonDetection } from "./CosmicSeasonDetection";
import { CosmicUtil } from "./CosmicUtil";

const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const { CosmicData } = require('./CosmicData');
const { CosmicLogger, yellow } = require('./CosmicLogger');

const PORT = process.env.PORT || 3000;
const SSL = process.env.SSL || 'false';

let cert;
let key;

if (SSL == 'true') {
    try {
        cert = readFileSync(resolve(__dirname, '../../ssl/cert.pem'));
    } catch (err) {
        console.error(`Couldn't load SSL certificate:`, err);
        process.exit(4);
    }

    try {
        key = readFileSync(resolve(__dirname, '../../ssl/key.pem'));
    } catch (err) {
        console.error(`Couldn't read SSL key:`, err);
        process.exit(5);
    }
}

class CosmicAPI {
    public static app = express();
    public static api = express.Router();
    public static server: http.Server;
    public static wss: typeof WebSocket.Server;

    public static logger = new CosmicLogger('Cosmic API', yellow);

    public static start() {
        this.logger.log('Starting...');

        this.api.get('/', async (req, res) => {
            res.json({
                status: 'online',
                environment: process.env.NODE_ENV,
                clients: CosmicClientHandler.getClientCount(),
                uptime: Date.now() - Cosmic.startTime
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

        this.api.get('/shop', async (req, res) => {
            res.json(CosmicShop.getListings());
        });

        this.api.get('/season', async (req, res) => {
            res.json({
                season: CosmicSeasonDetection.getSeason(req.query.t),
                holiday: CosmicSeasonDetection.getHoliday(req.query.t)
            });
        });

        this.api.get('/utilget', async (req, res) => {
            res.json(CosmicUtil.get(req.key, req._id));
        });

        this.app.use('/api', this.api);

        this.app.use(express.static(path.resolve(__dirname, '../../frontend')));
        this.app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));

        this.app.get('*', (req, res) => {
            readFile(resolve(__dirname, '../../frontend/index.html'), (err, data) => {
                if (err) {
                    res.end('502 oops');
                    return;
                }

                try {
                    res.send(data.toString());
                } catch (err) {
                    res.end('502 really bad things happened :(');
                }
            });
        });
        
        if (SSL == 'true') {
            this.server = https.createServer({
                cert, key
            }, this.app);
        } else {
            this.server = http.createServer(this.app);
        }
        this.server.listen(PORT, () => {
            this.logger.log(`Listening on port ${PORT}`);
        });

        this.wss = new WebSocket.Server({
            // noServer: true
            server: this.server
        });

        this.wss.on('error', (err: Error) => { this.logger.error(err) });
        this.wss.on('connection', (ws: WebSocket, req: http.ClientRequest) => {
            // console.log('websocket connection');
            // let cl: {
            //     ws: WebSocket;
            //     send: (s: any) => void;
            //     connected: boolean;
            // }

            // cl.ws = ws;
            // cl.connected = true;

            // cl.send = (s: any) => {
            //     if (!cl.connected) return;
            //     cl.ws.send(JSON.stringify(s));
            // }

            // cl.ws.addEventListener('message', data => {
            //     if (!cl.connected) return;
            //     try {
            //         let msg = JSON.parse(data.toString());
                    
            //         switch (msg.m) {
            //             case 'hi':
            //                 cl.send({ m: 'hi' });
            //                 break;
            //             case 'bye':
            //                 cl.ws.close();
            //                 delete cl.ws;
            //                 cl.connected = false;
            //                 break;
            //         }
            //     } catch (err) {}
            // });
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
