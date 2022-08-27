/**
 * COSMIC PROJECT
 * 
 * Cosmic commands
 */

const { Command, CosmicCommandHandler } = require('./CosmicCommandHandler');

CosmicCommandHandler.registerCommand(new Command(
    'help',
    ['help', 'h', 'cmds', 'cmd'],
    `%PREFIX%help [command]`,
    `List all commands or get information about commands.`,
    [
        'default'
    ],
    true, // visible
    (msg, cl) => {
        if (!msg.argv[1]) {
            let out = '🌠 Commands:';

            for (let cmd of CosmicCommandHandler.commands) {
                if (cmd.visible == false) continue;
                out += ` ${msg.prefix.prefix}${cmd.accessors[0]}, `;
            }

            out = out.trim();
            out = out.substring(0, out.length - 1);

            return out;
        } else {
            let out = `There is no help for '${msg.argv[1]}'.`;
            
            bigLoop:
            for (let cmd of CosmicCommandHandler.commands) {
                littleLoop:
                for (let acc of cmd.accessors) {
                    if (msg.argv[1] == acc) {
                        out = `Description: ${cmd.description} ⭐ Usage: ${Command.replaceUsageVars(cmd.usage, msg.prefix.prefix)}`;
                    }
                }
            }
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'about',
    ['about', 'a'],
    `%PREFIX%about`,
    `Get information about the bot.`,
    [
        'default'
    ],
    true, // visible
    (msg, cl) => {
        let ms = Date.now() - new (Date as any)("Sun Jul 31 06:17:45 2022 -0400");
        let ss = ms / 1000;
        let mm = ss / 60;
        let hh = mm / 60;
        let dd = hh / 24;
        return `✨ This outer space-themed bot was made by Hri7566#3409. This bot was created ${Math.floor(dd)} days, ${Math.floor(hh % 24)} hours, ${Math.floor(mm % 60)} minutes, and ${Math.floor(ss % 60)} seconds ago`;
    }
));
