/**
 * COSMIC PROJECT
 *
 * Cosmic client module
 *
 * Client connections for outgoing services
 */

/**
 * Global module imports
 */

const normalize = require("normalize-strings");
const Client = require("mppclone-client");
// const cmapi = require("mppclone-cmapi");
import * as YAML from "yaml";
import { EventEmitter } from "events";
// import * as Discord from "discord.js";

/**
 * Local module imports
 */

import { Cosmic } from "./Cosmic";
import { CosmicCommandHandler } from "./CosmicCommandHandler";
import { CosmicSeasonDetection } from "./util/CosmicSeasonDetection";
import { Token, ChatMessage, Vector2, Participant } from "./util/CosmicTypes";
import { CosmicClientMPP } from "./MPP/CosmicClientMPP";
// import { CosmicClientDiscord } from "./Discord/CosmicClientDiscord";
import { CosmicFFI } from "./foreign/CosmicFFI";
import { CosmicLogger, white, magenta, hex } from "./CosmicLogger";
import { CosmicForeignMessageHandler } from "./foreign/CosmicForeignMessageHandler";
import { CosmicData } from "./CosmicData";

/**
 * Module-level declarations
 */

export interface ChannelConstructionPreset {
    _id: string;
    set: {
        [key: string]: any;
    };
}

export abstract class CosmicClient {
    get [Symbol.toStringTag]() {
        return "CosmicClient";
    }

    public on = EventEmitter.prototype.on;
    public off = EventEmitter.prototype.off;
    public once = EventEmitter.prototype.once;
    public emit = EventEmitter.prototype.emit;

    public logger: CosmicLogger = new CosmicLogger("Cosmic Client", magenta);

    public platform: string;

    constructor() {}

    public alreadyBound: boolean = false;

    protected bindEventListeners() {
        if (this.alreadyBound == true) return;
        this.alreadyBound = true;

        this.on("chat", async (msg: ChatMessage) => {
            let res = await CosmicData.updateUser(msg.sender._id, msg.sender);
            if (typeof res == "object") {
                if (res.upsertedId == null) {
                    let res2 = await CosmicData.insertUser(msg.sender);
                }
            }

            // check all chat messages for commands
            CosmicCommandHandler.checkCommand(msg, this);

            // log messages to console
            this.logger.log(
                `[${msg.original_channel}] [${msg.sender._id.substring(
                    0,
                    6
                )}] <${hex(
                    msg.sender.color,
                    `${normalize(msg.sender.name)}`
                )}> ${normalize(msg.message)}`
            );
        });
    }

    public abstract sendChat(str: string): void;

    public emitMessage(msg): void {
        this.emit(msg.type, msg);
    }
}

export abstract class CosmicClientToken extends CosmicClient {
    private token: Token;

    constructor() {
        super();
    }
}

export type CosmicClientAny = CosmicClient | CosmicClientMPP;
// | CosmicClientDiscord;
