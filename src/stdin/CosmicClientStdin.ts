/**
 * COSMIC PROJECT
 *
 * Discord client
 */

import { CosmicClient } from "../CosmicClient";
import { CosmicForeignMessageHandler } from "../foreign/CosmicForeignMessageHandler";
import type { ChatMessage } from "../util/CosmicTypes";
import * as readline from "readline";

export class CosmicClientStdin extends CosmicClient {
    public platform: string = "discord";
    public previousChannel: string;
    public rl: readline.ReadLine = readline.createInterface(
        process.stdin,
        process.stdout
    );

    constructor() {
        super();
        this.bindEventListeners();
    }

    protected started: boolean = false;

    /**
     * Start stdin client
     */
    public start() {
        this.started = true;
    }

    /**
     * Stop stdin client
     */
    public stop() {
        this.started = false;
    }

    /**
     * Send a chat message in the last channel (or desired channel by passing an ID)
     * @param str Message
     * @param channel Optional channel ID
     */
    public async sendChat(str: string): Promise<void> {
        if (!str) return;

        this.logger.log(str);
    }

    protected bindEventListeners(): void {
        super.bindEventListeners();

        this.rl.on("line", data => {
            if (!this.started) return;
            let str = data.toString();

            this.emit("chat", {
                type: "chat",
                message: str.split("\n").join(" "),
                platform: "stdin",
                sender: {
                    _id: "stdin",
                    name: "stdin",
                    color: "#ffffff",
                    id: "stdin"
                },
                timestamp: Date.now()
            } as ChatMessage);
        });

        this.on("send chat message", msg => {
            this.sendChat(msg.message);
        });
    }
}
