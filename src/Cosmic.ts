/**
 * COSMIC PROJECT
 *
 * Main Cosmic module
 *
 * This file itself really isn't that large, but it loads everything else.
 */

/**
 * Global module imports
 */

const fs = require("fs");
import * as path from "path";
import * as YAML from "yaml";
const { EventEmitter } = require("events");

/**
 * Local module imports
 */

import { CosmicClientHandler } from "./CosmicClientHandler";
import { CosmicData } from "./CosmicData";
import { CosmicLogger, magenta } from "./CosmicLogger";
import { CosmicAPI } from "./api/CosmicAPI";

/**
 * Module-level declarations
 */

// const ENABLE_MPP = process.env.ENABLE_MPP || "true";
// const ENABLE_DISCORD = process.env.ENABLE_DISCORD || "true";

const channelsFile = fs.readFileSync("config/mpp_channels.yml").toString();
const channels = YAML.parse(channelsFile);

export interface ServicesConfig {
    discord: {
        enable: boolean;
    };
    mpp: {
        enable: boolean;
        userset: boolean;
    };
    stdin: {
        enable: boolean;
    };
}

const servicesFile = fs.readFileSync("config/services.yml").toString();
const services: ServicesConfig = YAML.parse(servicesFile);

class Cosmic {
    get [Symbol.toStringTag]() {
        return "Cosmic";
    }

    // magenta is a beautiful space color :D
    public static logger = new CosmicLogger("Cosmic", magenta);

    // event emitter prototypal
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static startTime: number;

    public static started: boolean = false;

    /**
     * Start Cosmic
     */
    public static async start(): Promise<void> {
        if (this.started) return;
        this.started = true;
        this.startTime = Date.now();

        this.bindEventListeners();

        // connect to database
        await CosmicData.start();

        this.logger.log("Starting clients...");

        if (services.mpp.enable) {
            this.startMPPClients();
        }

        // if (services.enableDiscord) {
        //     CosmicClientHandler.startDiscordClient();
        // }

        CosmicAPI.start();

        if (services.stdin.enable) {
            CosmicClientHandler.startStdinClient();
        }

        this.emit("ready");
    }

    /**
     * Stop Cosmic
     */
    public static async stop() {
        if (!this.started) return;
        this.started = false;

        this.logger.log("Stopping...");
        CosmicClientHandler.stopAllClients();
        await CosmicData.stop();
        this.logger.log("Stopped.");
    }

    // used for bindEventListeners
    private static alreadyBound: boolean = false;

    private static bindEventListeners(): void {
        if (this.alreadyBound) return;
        this.alreadyBound = true;

        this.on("ready", () => {
            this.logger.log("Ready");
        });

        this.on("log", (msg: any) => {
            this.logger.log(msg.message);
        });

        this.on("hi", () => {
            this.logger.debug("hi!");
            this.emit("hello");
        });

        this.on("bonk", (msg: any) => {
            this.emit("log", { message: "bonked" });
            try {
                msg.r.emit("bonk", {
                    m: "bonk",
                    from: "Cosmic"
                });
            } catch (err) {}
        });
    }

    private static startMPPClients() {
        for (const uri of Object.keys(channels)) {
            for (const ch of channels[uri]) {
                let cl = CosmicClientHandler.startMPPClient(uri, ch);
                if (!cl) continue;

                this.emit("client started", cl);
            }
        }
    }
}

/**
 * Module-level exports
 */

export { Cosmic };
