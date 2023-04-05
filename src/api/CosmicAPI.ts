/**
 * COSMIC PROJECT
 *
 * Express API module
 *
 * This is a mess.
 */

import { readFile, readFileSync } from "fs";
import { dirname, resolve } from "path";
import * as http from "http";
import * as https from "https";
import { CosmicClientHandler } from "../CosmicClientHandler";
import { Cosmic } from "../Cosmic";
import { CosmicShop } from "../shop/CosmicShop";
import { CosmicSeasonDetection } from "../util/CosmicSeasonDetection";
import { CosmicUtil } from "../util/CosmicUtil";
import * as YAML from "yaml";
import { EventEmitter } from "events";
import * as crypto from "crypto";
import { CosmicAPIWebSocketClient } from "./CosmicAPIWebSocketClient";
import { CosmicData } from "../CosmicData";

import * as express from "express";
import * as path from "path";
import { WebSocket, WebSocketServer } from "ws";
import { CosmicLogger, yellow } from "../CosmicLogger";

const PORT = process.env.PORT || 3000;
const SSL = process.env.SSL || "false";

let cert;
let key;

if (SSL == "true") {
    try {
        cert = readFileSync(resolve(__dirname, "../../../ssl/cert.pem"));
    } catch (err) {
        console.error(`Couldn't load SSL certificate:`, err);
        process.exit(4);
    }

    try {
        key = readFileSync(resolve(__dirname, "../../../ssl/key.pem"));
    } catch (err) {
        console.error(`Couldn't read SSL key:`, err);
        process.exit(5);
    }
}

class CosmicAPI {
    public static logger = new CosmicLogger("Cosmic API", yellow);

    public static app = express();
    public static api = express.Router();
    public static server: http.Server;
    public static wss: WebSocketServer;
    public static wsClients = [];
    public static keyLimit = 5;
    public static permissionGroups: Record<string, Record<string, boolean>>;

    public static validPermissions = {
        canSetPermissions: "boolean",
        canSetAllPermissions: "boolean",
        canGenerateKeys: "boolean",
        canGenerateInfiniteKeys: "boolean"
    };

    public static messages = {
        ERROR_PERMISSION_DENIED: {
            error: "Permission denied"
        }
    };

    public static start() {
        this.logger.log("Starting...");

        //* use req.ip
        this.app.set("trust proxy", true);

        this.setupRoutes();

        if (SSL == "true") {
            this.server = https.createServer(
                {
                    cert,
                    key
                },
                this.app
            );
        } else {
            this.server = http.createServer(this.app);
        }
        this.server.listen(PORT, () => {
            this.logger.log(`Listening on port ${PORT}`);
        });

        this.wss = new WebSocketServer({
            noServer: true
            // server: this.server
        });

        this.server.on("upgrade", (req, socket, head) => {
            this.wss.handleUpgrade(req, socket, head, ws => {
                this.wss.emit("connection", ws, req);
            });
        });

        this.server.on("connection", sock => {
            sock.on("data", d => {
                try {
                    // console.log(d.toString());
                } catch (err) {}
            });
        });

        this.wss.on("error", (err: Error) => {
            this.logger.error(err);
        });

        this.wss.on("connection", (ws: WebSocket, req: http.ClientRequest) => {
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
        this.logger.log("Stopping server...");
        this.server.close();
        this.logger.log("Stopped.");
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

    public static async getAvailableKeyCount(ip: string): Promise<number> {
        try {
            let keys = await CosmicData.getAPIKeys(ip);
            return this.keyLimit - keys.length;
        } catch (err) {
            return 0;
        }
    }

    public static permissionIsValid(
        permissionName: string,
        value: any
    ): boolean {
        for (let key of Object.keys(this.validPermissions)) {
            let type = this.validPermissions[key];
            if (permissionName !== key) continue;
            if (typeof value == type) return true;
        }

        return false;
    }

    public static async verifyKey(req): Promise<boolean> {
        let key = req.query.key;
        if (!key) return;
        let validKeys = await CosmicData.getAPIKeys(req.ip);
        if (validKeys.indexOf(key) == -1) return false;
        return true;
    }

    public static async permissionGroupHasPermission(
        grp: string,
        permission: string
    ): Promise<boolean> {
        let group = this.permissionGroups[grp];
        if (!group) return false;

        let hasPermission = false;

        // console.log(group);

        for (let perm of Object.keys(group as any)) {
            if (perm == permission) {
                if (this.validPermissions[perm] == "boolean") {
                    if (group[perm] == true) {
                        hasPermission = true;
                        break;
                    }
                } else if (typeof this.validPermissions[perm] == "function") {
                    try {
                        if (this.validPermissions[perm]()) {
                            hasPermission = true;
                            break;
                        }
                    } catch (err) {
                        hasPermission = false;
                        break;
                    }
                }
            }
        }

        return hasPermission;
    }

    public static async hasPermission(
        ip: string,
        permission: string
    ): Promise<boolean> {
        let permissions = await CosmicData.getAPIPermissions(ip);
        let permissionGroups = await CosmicData.getAPIPermissionGroups(ip);

        if (!permissions) return false;

        let hasPermission = false;

        if (permissionGroups) {
            // check group permission
            for (let group of permissionGroups) {
                hasPermission = await this.permissionGroupHasPermission(
                    group,
                    permission
                );
                if (hasPermission) break;
            }
        }

        // check normal permissions
        for (let perm of permissions) {
            if (perm == permission) {
                if (this.validPermissions[perm] == "boolean") {
                    if (perm == true) {
                        hasPermission = true;
                        break;
                    }
                } else if (typeof this.validPermissions[perm] == "function") {
                    try {
                        if (this.validPermissions[perm]()) {
                            hasPermission = true;
                            break;
                        }
                    } catch (err) {
                        hasPermission = false;
                        break;
                    }
                }
            }
        }

        return hasPermission;
    }

    private static setupRoutes(): void {
        this.api.get("/", async (req, res) => {
            res.json({
                status: "online",
                environment: process.env.NODE_ENV,
                clients: CosmicClientHandler.getClientCount(),
                uptime: Date.now() - Cosmic.startTime
            });
        });

        this.api.get("/uptime", async (req, res) => {
            res.json({
                uptime: Date.now() - Cosmic.startTime
            });
        });

        this.api.get("/users", async (req, res) => {
            const cursor = await CosmicData.users.find();
            let users = [];

            for await (let user of cursor) {
                users.push(user);
            }

            res.json(users);
        });

        this.api.get("/user", async (req, res) => {
            if (!req.query.id) return;
            let user = await CosmicData.getUser(req.query.id);
            if (!user) {
                res.json({
                    error: "user not found"
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
                    error: "inventory not found"
                });
            } else {
                res.json(inventory);
            }
        });

        this.api.get("/shop", async (req, res) => {
            res.json(CosmicShop.getListings());
        });

        this.api.get("/season", async (req, res) => {
            res.json({
                season: CosmicSeasonDetection.getSeason(req.query.t),
                holiday: CosmicSeasonDetection.getHoliday(req.query.t)
            });
        });

        this.api.get("/utilget", async (req, res) => {
            res.json(CosmicUtil.get(req.key, req._id));
        });

        this.api.get("/genkey", async (req, res) => {
            await CosmicData.getAPIKeyProfile(req.ip);

            let canGenerateKeys = false;
            canGenerateKeys = await this.hasPermission(
                req.ip,
                "canGenerateKeys"
            );

            let canGenerateInfiniteKeys = await this.hasPermission(
                req.ip,
                "canGenerateInfiniteKeys"
            );
            if (!canGenerateInfiniteKeys) {
                let keys = await CosmicData.getAPIKeys(req.ip);
                if (typeof keys !== "undefined") {
                    let amountOfKeys = keys.length;
                    if (amountOfKeys > this.keyLimit) canGenerateKeys = false;
                }
            }

            if (!canGenerateKeys) {
                return res.json({
                    error: "Key request denied",
                    canGenerateKey: canGenerateKeys,
                    ip: req.ip
                });
            }

            // console.log(req.ip);
            let key = this.generateAPIKey();

            // save key
            CosmicData.addAPIKey(req.ip, key);

            res.json({
                key: key,
                canGenerateKey: canGenerateKeys,
                ip: req.ip
            });
        });

        this.api.get("/wipekeys", async (req, res) => {
            let result = await CosmicData.removeAllAPIKeys(req.ip);
            res.json({ result });
        });

        this.api.get("/keyprofile", async (req, res) => {
            let result = await CosmicData.getAPIKeyProfile(req.ip);
            res.json({ result });
        });

        this.api.get("/tool", async (req, res) => {
            let answers: any = {
                // 'What?': `I don't know`,
                "Where am I?": `Under the Newmaker Plane`,
                "Who am I?": `Newmaker`,
                "Who are you?": `TOOL`,
                "Remember being born?": `I'm not Tiara`,
                "Where is my house?": `You'll never go home`,
                "Where is the school?": `You can't go back in time`,
                "What month is it?": `📅`,
                "What year is it?": `📆`,
                "Where was the windmill?": `█████`
            };

            if (!req.query.q) req.query.q = "What?";

            if (!req.query.q.endsWith("?")) req.query.q = `${req.query.q}?`;
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

        this.api.get(/\/set(permission|perm)/, async (req, res) => {
            if (!(await this.verifyKey(req))) return;

            if (!(await this.hasPermission(req.ip, "canSetPermissions"))) {
                res.json(this.messages.ERROR_PERMISSION_DENIED);
                return;
            }

            let perm = req.query.permission;
            if (!perm) {
                res.json({
                    error: "No permission"
                });

                return;
            }

            let value = req.query.value;
            if (!value) {
                res.json({
                    error: "No value"
                });

                return;
            }

            if (!this.permissionIsValid(perm, value)) {
                res.json({
                    error: "Invalid permission"
                });

                return;
            }

            let given_ip = req.query.ip;
            if (!given_ip) {
                given_ip = req.ip;
            } else {
                if (!this.hasPermission(req.ip, "canChangeAllPermissions")) {
                    res.json(this.messages.ERROR_PERMISSION_DENIED);
                }
            }

            // set ip's permission
            let result;
            if (value == true) {
                result = await CosmicData.addAPIPermission(given_ip, perm);
            } else {
                result = await CosmicData.removeAPIPermission(given_ip, perm);
            }

            res.json({ result });
        });

        this.api.get(/\/get(permission|perm)/, (req, res) => {
            return res.json({
                error: "unfinished"
            });
        });

        this.api.get("*", async (req, res) => {
            // res.status(404).json({ error: 'SORRY NOTHING' });
            res.status(404).json({ error: "invalid request" });
        });

        this.app.use(express.static(path.resolve(__dirname, "../../frontend")));
        this.app.use(
            "/assets",
            express.static(path.resolve(__dirname, "../../assets"))
        );
        this.app.use("/api", this.api);

        this.app.get("*", (req, res) => {
            readFile(
                resolve(__dirname, "../../frontend/index.html"),
                (err, data) => {
                    if (err) {
                        res.status(502).end("oops");
                        return;
                    }

                    try {
                        res.send(data.toString());
                    } catch (err) {
                        res.status(502).end("really bad things happened :(");
                    }
                }
            );
        });
    }
}

try {
    CosmicAPI.permissionGroups = YAML.parse(
        readFileSync(
            resolve(__dirname, "../../../config/apiPermissionGroups.yml")
        ).toString()
    );
} catch (err) {
    CosmicAPI.logger.error(
        "Unable to read permission group configuration, using default configuration instead"
    );

    CosmicAPI.permissionGroups = {
        default: {
            canSetPermissions: false,
            canSetAllPermissions: false,
            canGenerateKeys: false
        },
        admin: {
            canSetPermissions: true,
            canSetAllPermissions: true,
            canGenerateKeys: true
        }
    };
}

export { CosmicAPI };
