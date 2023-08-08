/**
 * COSMIC PROJECT
 *
 * Cosmic command handler module
 *
 * Command loader and interface
 */

/**
 * Global module imports
 */

import { EventEmitter } from "events";
import * as YAML from "yaml";
import * as path from "path";
import * as fs from "fs";

/**
 * Local module imports
 */

import type {
    CommandMessage,
    Prefix,
    PermissionGroupIdentifier,
    ChatMessage
} from "./util/CosmicTypes";
import { CosmicClient } from "./CosmicClient";
import { CosmicUtil } from "./util/CosmicUtil";
import { CosmicLogger, magenta } from "./CosmicLogger";
import { CosmicData } from "./CosmicData";

/**
 * Module-level declarations
 */

export interface CommandGroup {
    id: string;
    displayName: string;
}

export type CommandCallback = (
    msg: CommandMessage,
    cl: CosmicClient
) => Promise<string> | string | undefined;

export class Command {
    constructor(
        public id: string,
        public aliases: string[],
        public usage: string = "No usage",
        public description: string = "No description",
        public permissionGroups: string[],
        public visible: boolean,
        public commandGroup: string,
        public callback: CommandCallback,
        public platform: string = "all"
    ) {}

    /**
     * Replace the placeholder text in command usage with actual text
     * @param usage Usage text
     * @param prefix Prefix
     */
    public static replaceUsageVars(usage: string, prefix: string): string {
        return usage.split("%PREFIX%").join(prefix);
    }
}

class CosmicCommandHandler {
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static prefixes: Prefix[] = [];
    public static commands: Array<Command> = [];

    public static logger: CosmicLogger = new CosmicLogger(
        "Command Handler",
        magenta
    );

    public static commandGroups: Array<CommandGroup> = [
        { id: "info", displayName: "🌠 Info Commands" },
        { id: "fun", displayName: "🎆 Fun Commands" },
        { id: "cake", displayName: "🎂 Cake Commands" }
    ];

    /**
     * Check a chat message for commands
     * @param cmsg Chat message
     */
    public static async checkCommand(
        cmsg: ChatMessage,
        cl: CosmicClient
    ): Promise<void> {
        let msg: Partial<CommandMessage> = {
            type: "command",
            argv: cmsg.message.split(" "),
            sender: cmsg.sender,
            timestamp: cmsg.timestamp,
            original_message: cmsg
        };

        // check prefix
        let prefix = this.hasPrefix(msg.argv[0]);
        if (!prefix) {
            return;
        }

        msg.prefix = prefix;

        await CosmicData.createGroupProfile(msg.sender._id);
        await CosmicData.createInventory(msg.sender._id);

        // console.debug('--------DEBUG--------');
        for (let cmd of this.commands) {
            let enteredCommand = msg.argv[0].substring(prefix.prefix.length);
            let pass = false;

            accessorLoop: for (let acc of cmd.aliases) {
                if (acc == enteredCommand) {
                    pass = true;
                    break accessorLoop;
                }
            }

            // check permissions
            const groups = await CosmicData.getGroups(msg.sender._id);

            let hasPerms = false;

            for (let g of cmd.permissionGroups) {
                if (groups.groups.indexOf(g) !== -1) hasPerms = true;
            }

            if (!pass || !hasPerms) continue;

            // check platform
            if (cmd.platform !== cl.platform && cmd.platform !== "all")
                continue;

            let out;

            try {
                out = await cmd.callback(msg as CommandMessage, cl);
            } catch (err) {
                if (err == "usage") {
                    let usage = Command.replaceUsageVars(
                        cmd.usage,
                        msg.prefix.prefix
                    );
                    out = `Usage: ${usage}`;
                } else {
                    this.logger.error(err);
                    out =
                        "The cosmos have misaligned and an error has occurred, sorry for the inconvenience.";
                }
            }

            if (out) {
                if (typeof out !== "string") return;
                out = out.trim();
                if (out == "") return;
                if (cl.platform == "mpp") {
                    if (msg.original_message.original_message.m == "dm") {
                        cl.emit("send chat message", {
                            type: "chat",
                            sender: {
                                name: "internal",
                                _id: "internal",
                                color: "#ffffff"
                            },
                            dm: cmsg.sender._id,
                            message: out,
                            timestamp: Date.now()
                        });

                        return;
                    }
                }

                cl.emit("send chat message", {
                    type: "chat",
                    sender: {
                        name: "internal",
                        _id: "internal",
                        color: "#ffffff"
                    },
                    message: out,
                    timestamp: Date.now()
                });
            }

            return;
        }
    }

    /**
     * Check a string for prefixes
     * @param str Input string
     */
    public static hasPrefix(str: string): Prefix | undefined {
        for (let p of this.prefixes) {
            if (CosmicUtil.stringHasPrefix(str, p.prefix)) return p;
        }
    }

    public static alreadyBound = false;

    public static bindEventListeners() {
        if (this.alreadyBound) return;
        this.alreadyBound = true;
    }

    public static registerCommand(cmd: Command): void {
        this.commands.push(cmd);
    }
}

const prefixConfigFile = fs
    .readFileSync(path.resolve(__dirname, "../../config/prefixes.yml"))
    .toString();
const prefixes = YAML.parse(prefixConfigFile);

for (let pre of prefixes.global) {
    CosmicCommandHandler.prefixes.push({
        prefix: pre
    });
}

require("./commands/CosmicCommands");

/**
 * Module exports
 */

export { CosmicCommandHandler };
