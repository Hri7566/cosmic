/**
 * COSMIC PROJECT
 *
 * Foreign message handler module
 */

import { EventEmitter } from "events";
import { Message, ChatMessage } from "../util/CosmicTypes";

class CosmicForeignMessageHandler {
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static init(): void {
        this.bindEventListeners();
    }

    private static bindEventListeners(): void {}

    public static convertMessage(type: string, omsg: any): Message | undefined {
        if (type == "chat") {
            let msg: ChatMessage = {
                type: "chat",
                sender: omsg.p,
                message: omsg.a,
                timestamp: Date.now(),
                original_channel: omsg.original_channel,
                original_message: omsg,
                platform: "internal"
            };

            return msg;
        } else if (type == "interaction") {
            let msg: ChatMessage = {
                type: "chat",
                sender: omsg.p,
                message: omsg.a,
                timestamp: Date.now(),
                original_channel: omsg.original_channel,
                original_message: omsg,
                platform: "internal"
            };

            return msg;
        }
    }
}

export { CosmicForeignMessageHandler };
