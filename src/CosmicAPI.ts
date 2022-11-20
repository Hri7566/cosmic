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
import { JSONEncodable } from "discord.js";
import EventEmitter = require("events");
import crypto = require('crypto');

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
    public static wsClients = [];

    public static keyLimit = 5;

    public static start() {
        this.logger.log('Starting...');

        //* use req.ip
        this.app.set('trust proxy', true);

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

        this.api.get('/user', async (req, res) => {
            if (!req.query.id) return;
            let user = await CosmicData.getUser(req.query.id);
            if (!user) {
                res.json({
                    error: 'user not found'
                });
            } else {
                res.json(user);
            }
        });

        this.api.get(/\/(inv|inventory)/, async (req, res) => {
            if (!req.query.id) return;
            let inventory = await CosmicData.getInventory(req.query.id);
            if (!inventory) {
                res.json({
                    error: 'inventory not found'
                });
            } else {
                res.json(inventory);
            }
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

        this.api.get('/genkey', async (req, res) => {
            let canGenerateKey = false;

            console.log(req.ip);
            res.json({
                key: this.generateAPIKey()
            });
        });
        
        this.api.get('/tool', async (req, res) => {
            let answers: any = {
                // 'What?': `I don't know`,
                'Where am I?': `Under the Newmaker Plane`,
                'Who am I?': `Newmaker`,
                'Who are you?': `TOOL`,
                'Remember being born?': `I'm not Tiara`,
                'Where is my house?': `You'll never go home`,
                'Where is the school?': `You can't go back in time`,
                'What month is it?': `📅`,
                'What year is it?': `📆`,
                'Where was the windmill?': `█████`
            }
            if (!req.query.q.endsWith('?')) req.query.q = `${req.query.q}?`;
            // req.query.q = `${req.query.q.substring(0, 1).toUpperCase()}${req.query.q.substring(1).toLowerCase()}`;

            let answer = `I don't know`;

            for (let key of Object.keys(answers)) {
                if (key.toLowerCase() == req.query.q.toLowerCase()) {
                    answer = answers[key];
                    break;
                }
            }
            
            res.json(answer);
        });

        this.api.get('*', async (req, res) => {
            res.status(404).json({ error: 'SORRY NOTHING' });
        });

        this.app.use('/api', this.api);

        this.app.use(express.static(path.resolve(__dirname, '../../frontend')));
        this.app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));

        this.app.get('*', (req, res) => {
            readFile(resolve(__dirname, '../../frontend/index.html'), (err, data) => {
                if (err) {
                    res.status(502).end('oops');
                    return;
                }

                try {
                    res.send(data.toString());
                } catch (err) {
                    res.status(502).end('really bad things happened :(');
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
            noServer: true
            // server: this.server
        });

        this.server.on('upgrade', (req, socket, head) => {
            this.wss.handleUpgrade(req, socket, head, ws => {
                this.wss.emit('connection', ws, req);
            })
        });

        this.server.on('connection', sock => {
            sock.on('data', d => {
                try {
                    // console.log(d.toString());
                } catch (err) {};
            });
        });

        this.wss.on('error', (err: Error) => { this.logger.error(err) });

        this.wss.on('connection', (ws: WebSocket, req: http.ClientRequest) => {
            // console.log('websocket connection');
            // let cl: {
            //     ws: WebSocket;
            //     send: (s: any) => void;
            //     connected: boolean;
            // } = {
            //     ws: ws,
            //     connected: true,
            //     send: (s: any) => {
            //         if (!cl.connected) return;
            //         cl.ws.send(JSON.stringify(s));
            //     }
            // }

            let cl = new CosmicAPIWebSocketClient(ws, req);
            this.addClient(cl);
        });
    }

    public static stop() {
        this.logger.log('Stopping server...');
        this.server.close();
        this.logger.log('Stopped.');
    }

    public static addClient(cl: CosmicAPIWebSocketClient): void {
        this.wsClients.push(cl);
    }

    public static removeClient(cl: CosmicAPIWebSocketClient): void {
        this.wsClients.splice(this.wsClients.indexOf(cl), 1);
    }

    public static getClientByIP(ip: string): void {
        for (let cl of this.wsClients) {
            if (cl.ip == ip) return cl;
        }
    }

    public static generateAPIKey(): string {
        return crypto.randomUUID();
    }
}

class CosmicAPIWebSocketClient extends EventEmitter {
    public connected = false;
    public ip: string;

    constructor(
        public ws: WebSocket,
        req: http.ClientRequest
    ) {
        super();

        this.connected = true;
        this.bindEventListeners();
    }

    public send(data: Record<string, any>): void {
        if (!this.connected) return;
        
        this.ws.send(JSON.stringify(data));
    }

    public destroy(): boolean {
        try {
            if (!this.connected) return;
            this.ws.close();
            delete this.ws;
            this.connected = false;

            CosmicAPI.removeClient(this);

            return true;
        } catch (err) {
            return false;
        }
    }

    protected bindEventListeners() {
        this.ws.addEventListener('message', async (data: any) => {
            if (!this.connected) return;
                try {
                    let msg = JSON.parse(data.toString());
                    
                    switch (msg.m) {
                        case 'hi':
                            this.send({ m: 'hi' });
                            break;
                        case 'bye':
                            this.destroy();
                            break;
                        case 'inventory':
                            if (!msg.id) return;

                            let inventory = await CosmicData.getInventory(msg.id);
                            if (!inventory) {
                                return this.send({ m: 'error', error: 'inventory not found' });
                            }

                            this.send({ m: 'inventory', inventory });
                            break;
                    }
                } catch (err) {}
        });
    }

    public async verifyAPIKey(key: Uint8Array) {
        let keys = await CosmicData.getAPIKeys(this.ip);
        let hasKey = false;

        for (let k of keys) {
            if (key == k) {
                hasKey = true;
                break;
            }
        }

        return hasKey;
    }
}

export {
    CosmicAPI
}
