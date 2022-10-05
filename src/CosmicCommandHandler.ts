/**
 * COSMIC PROJECT
 * 
 * Cosmic command handler module
 */

/**
 * Global module imports
 */

const { EventEmitter } = require('events');
const YAML = require('yaml');
const path = require('path');
const fs = require('fs');

/**
 * Local module imports
 */

const { Message, CommandMessage, Prefix, PermissionGroupIdentifier } = require('./CosmicTypes');
const { CosmicClient } = require('./CosmicClient');
const { CosmicUtil } = require('./CosmicUtil');
const { CosmicLogger, magenta } = require('./CosmicLogger');
const { CosmicData } = require('./CosmicData');

/**
 * Module-level declarations
 */

export interface CommandGroup {
    id: string;
    displayName: string;
}

export class Command {
    public id: string;
    public accessors: string[];
    public usage: string;
    public description: string;
    public permissionGroups: Array<typeof PermissionGroupIdentifier>;
    public commandGroup: string;
    public visible: boolean;
    public callback: (msg: typeof Message, cl: typeof CosmicClient) => string | undefined;
    public platform: string;

    constructor(id: string, accessors: string[], usage: string = 'No usage', description: string | 'No description', permissionGroups: string[], visible: boolean, commandGroup: string, callback: (msg: typeof Message, cl: typeof CosmicClient) => string | undefined, platform?: string) {
        this.id = id;
        this.accessors = accessors;
        this.usage = usage;
        this.description = description;
        this.permissionGroups = permissionGroups;
        this.visible = visible;
        this.commandGroup = commandGroup;
        this.callback = callback;
        this.platform = platform || 'all';
    }

    /**
     * Replace the placeholder text in command usage with actual text
     * @param usage Usage text
     * @param prefix Prefix
     */
    public static replaceUsageVars(usage: string, prefix: string): string {
        return usage.split('%PREFIX%').join(prefix);
    }
}

class CosmicCommandHandler {
    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;

    public static prefixes: typeof Prefix[] = [];
    public static commands: Array<Command> = [];

    public static logger: typeof CosmicLogger = new CosmicLogger('Command Handler', magenta);

    public static commandGroups: Array<CommandGroup> = [
        { id: 'info', displayName: '🌠 Info Commands' },
        { id: 'fun', displayName: '🎆 Fun Commands' },
        { id: 'cake', displayName: '🎂 Cake Commands' }
    ]

    /**
     * Check a chat message for commands
     * @param cmsg Chat message
     */
     public static async checkCommand(cmsg: typeof Message, cl: typeof CosmicClient): Promise<void> {
        let msg: typeof CommandMessage = {
            type: 'command',
            argv: cmsg.message.split(' '),
            sender: cmsg.sender,
            timestamp: cmsg.timestamp
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
            // console.log('** Loop start');
            // console.log('Command ID:', cmd.id);
            let enteredCommand = msg.argv[0].substring(prefix.prefix.length);
            let pass = false;

            accessorLoop:
            for (let acc of cmd.accessors) {
                // console.debug('Comparing:', enteredCommand, acc);
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
            if (cmd.platform !== cl.platform && cmd.platform !== 'all') continue;

            let out;
            
            try {
                out = await cmd.callback(msg, cl);
            } catch (err) {
                if (err == 'usage') {
                    let usage = Command.replaceUsageVars(cmd.usage, msg.prefix.prefix);
                    out = `Usage: ${usage}`;
                } else {
                    this.logger.error(err);
                    out = 'The cosmos have misaligned and an error has occurred, sorry for the inconvenience.';
                }
            }

            if (out) {
                if (typeof out !== 'string') return;
                out = out.trim();
                if (out == '') return;
                cl.emit('send chat message', {
                    type: 'chat',
                    sender: {
                        name: 'internal',
                        _id: 'internal',
                        color: '#ffffff'
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
    public static hasPrefix(str: string): typeof Prefix | undefined {
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

const prefixConfigFile = fs.readFileSync(path.resolve(__dirname, '../../config/prefixes.yml')).toString();
const prefixes = YAML.parse(prefixConfigFile);

for (let pre of prefixes.global) {
    CosmicCommandHandler.prefixes.push({
        prefix: pre
    });
}

require('./CosmicCommands');

/**
 * Module exports
 */

export {
    CosmicCommandHandler
}
