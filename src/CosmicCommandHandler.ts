/**
 * COSMIC PROJECT
 * 
 * Cosmic command handler module
 */

const { EventEmitter } = require('events');
const { Message, CommandMessage, Prefix, PermissionGroupIdentifier } = require('./CosmicTypes');
const { CosmicClient } = require('./CosmicClient');
const { CosmicUtil } = require('./CosmicUtil');

export interface Command {
    id: string;
    accessors: string[];
    callback: (msg: typeof Message, cl: typeof CosmicClient) => string | undefined;
    usage?: string;
    description?: string;
    permissionGroups: typeof PermissionGroupIdentifier[];
}

class CosmicCommandHandler {
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static prefixes: typeof Prefix[];

    /**
     * Check a chat message for commands
     * @param cmsg Chat message
     */
     public static checkCommand(cmsg: typeof Message, cl: typeof CosmicClient): void {
        let msg: typeof CommandMessage = {
            type: 'command',
            argv: cmsg.message.split(' '),
            sender: cmsg.sender,
            timestamp: cmsg.timestamp
        };
    }

    /**
     * Check a string for prefixes
     * @param str Input string
     */
    public static hasPrefix(str: string): boolean {
        for (let p of this.prefixes) {
            if (CosmicUtil.stringHasPrefix(str, p.prefix)) return true;
        }

        return false;
    }
}

export {
    CosmicCommandHandler
}
