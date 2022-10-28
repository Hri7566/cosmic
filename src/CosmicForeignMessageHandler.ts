/**
 * COSMIC PROJECT
 * 
 * Foreign message handler module
 */

const { EventEmitter } = require('events');
const { Message, ChatMessage } = require('./CosmicTypes');

class CosmicForeignMessageHandler {
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static init(): void {
        this.bindEventListeners();
    }

    private static bindEventListeners(): void {

    }

    public static convertMessage(type: string, omsg: any): typeof Message | undefined {
        if (type == 'chat') {
            let msg: typeof ChatMessage = {
                type: 'chat',
                sender: omsg.p,
                message: omsg.a,
                timestamp: Date.now(),
                original_channel: omsg.original_channel
            }

            return msg;
        }
    }
}

export {
    CosmicForeignMessageHandler
}
