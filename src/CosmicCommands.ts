/**
 * COSMIC PROJECT
 * 
 * Cosmic commands
 */

import { CosmicCakeFactory } from "./CosmicCakeFactory";

const { Command, CosmicCommandHandler } = require('./CosmicCommandHandler');
const { CosmicColor } = require('./CosmicColor');
const { CosmicData } = require('./CosmicData');

CosmicCommandHandler.registerCommand(new Command(
    'help',
    [ 'help', 'h', 'cmds', 'cmd' ],
    `%PREFIX%help [command]`,
    `List all commands or get information about commands.`,
    [ 'default' ],
    true, // visible
    'info',
    (msg, cl) => {
        if (!msg.argv[1]) {
            for (let group of CosmicCommandHandler.commandGroups) {
                // let out = '🌠 Commands:';
                let out = `${group.displayName}:`;

                for (let cmd of CosmicCommandHandler.commands) {
                    if (cmd.commandGroup !== group.id) continue;
                    if (cmd.visible == false) continue;
                    out += ` ${msg.prefix.prefix}${cmd.accessors[0]}, `;
                }

                out = out.trim();
                out = out.substring(0, out.length - 1);
                cl.sendChat(out);
            }

            // return out;
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

            return out;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'about',
    [ 'about', 'a' ],
    `%PREFIX%about`,
    `Get information about the bot.`,
    [ 'default' ],
    true, // visible,
    'info',
    (msg, cl) => {
        let ms = Date.now() - new (Date as any)("Sun Jul 31 06:17:45 2022 -0400");
        let ss = ms / 1000;
        let mm = ss / 60;
        let hh = mm / 60;
        let dd = hh / 24;
        return `✨ This outer space-themed bot was made by Hri7566#3409. This bot was created ${Math.floor(dd)} days, ${Math.floor(hh % 24)} hours, ${Math.floor(mm % 60)} minutes, and ${Math.floor(ss % 60)} seconds ago.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'color',
    [ 'color', 'c' ],
    `%PREFIX%color [<r> <g> <b> | <hex>]`,
    `Get information about a color or the user's color.`,
    [ 'default' ],
    true, // visible,
    'info',
    (msg, cl) => {
        if (msg.argv[3]) {
            // test for rgb
            try {
                let r = msg.argv[1];
                let g = msg.argv[2];
                let b = msg.argv[3];
                
                r = parseInt(r);
                g = parseInt(g);
                b = parseInt(b);
                
                if (r > 255 || g > 255 || b > 255) throw 'too large';
                if (r < 0 || g < 0 || b < 0) throw 'too small';
                
                let c = new CosmicColor(r, g, b);
                let outc = `${c.getName().replace('A', 'a')} [${c.toHexa()}]`;
                return `The RGB color ${r}, ${g}, ${b} is ${outc}`;
            } catch (e) {
                return `The color '${msg.argv[1]}, ${msg.argv[2]}, ${msg.argv[3]}' is not a valid RGB color. Reason: ${e}`
            }
        } else if (msg.argv[1]) {
            if (msg.argv[1].match(/#[0-9a-f]{6}/ig) !== null) {
                // definitely a hex string
                let c = new CosmicColor(msg.argv[1]);
                let outc = `${c.getName().replace('A', 'a')} [${c.toHexa()}]`;
                return `The hex color '${msg.argv[1]}' is ${outc}`;
            } else {
                return `I don't think '${msg.argv[1]}' is a hex color.`;
            }
        } else {
            if (msg.sender.color) {
                let c = new CosmicColor(msg.sender.color);
                let outc = `${c.getName().replace('A', 'a')} [${c.toHexa()}]`;
                return `${msg.sender.name}, your color is ${outc}`;
            }
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    '8ball',
    [ '8ball', '8' ],
    '%PREFIX%8ball <question>',
    `Ask the magic 8-ball a question.`,
    [ 'default' ],
    true,
    'fun',
    (msg, cl) => {
        if (!msg.argv[1]) return `Please ask a question.`;
        const magic8ballAnswers = [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes, definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy, try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            `Don't count on it`,
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful'
        ];

        let r = magic8ballAnswers[Math.floor(Math.random()*magic8ballAnswers.length)];

        return `${r}, ${msg.sender.name}.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'groups',
    [ 'groups', 'g' ],
    '%PREFIX%groups',
    `Lists the user's groups.`,
    [ 'default' ],
    true,
    'info',
    async (msg, cl) => {
        const groups = await CosmicData.getGroups(msg.sender._id);
        return `Groups: ${groups.groups.join(', ')}`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'bake',
    [ 'bake', 'b' ],
    '%PREFIX%bake',
    `Bake a cake. (WIP)`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        return `This command is a stub.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'stopbaking',
    [ 'stopbaking', 'stopbake', 'stop', 's' ],
    '%PREFIX%stopbaking',
    `Stop baking a cake. (WIP)`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        return `This command is a stub.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'inventory',
    [ 'inventory', 'inv', 'i' ],
    '%PREFIX%inventory',
    `List all items in the user's inventory.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        const inventory = await CosmicData.getInventory(msg.sender._id);
        let items = [];

        for (let it of inventory.items) {
            if (it.count > 0) {
                let dn = (it.emoji ? it.emoji : '') + it.displayName
                items.push(`${dn}${it.count > 1 ? ` (x${it.count})` : ``}`);
            }
        }

        if (items.length > 0) {
            return `Inventory: ${items.join(', ')}`;
        } else {
            return `Inventory: (empty)`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'balance',
    [ 'balance', 'bal', 'b' ],
    '%PREFIX%balance',
    `Show the user's balance.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        const inventory = await CosmicData.getInventory(msg.sender._id);
        return `Balance: ${CosmicData.formatBalance(inventory.balance)}`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'wipeinv',
    [ 'wipeinv' ],
    '%PREFIX%wipeinv',
    `Wipe all inventory data.`,
    [ 'admin' ],
    false,
    'info',
    async (msg, cl) => {
        await CosmicData.purgeInventories();
        return `Inventories purged successfully.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'rcake',
    [ 'rcake' ],
    '%PREFIX%rcake',
    `Generate a random cake.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        let c = CosmicCakeFactory.generateRandomCake();

        let res = await CosmicData.addItem(msg.sender._id, c);
        console.debug(res);

        let displayName = (c.emoji ? `${c.emoji}` : '') + c.displayName;
        return `Cake: ${displayName}`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'addbal',
    [ 'addbal' ],
    '%PREFIX%addbal <userId> <amount>',
    `Add an amount to a balance.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        if (msg.argv[2]) {
            try {
                await CosmicData.addBalance(msg.argv[1], parseInt(msg.argv[2]));
                return `Successfully added to balance of account '${msg.argv[1]}'.`;
            } catch (err) {
                return `Addbal failed. (maybe NaN?)`;
            }
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'subbal',
    [ 'subbal' ],
    '%PREFIX%subbal <userId> <amount>',
    `Add an amount to a balance.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        if (msg.argv[2]) {
            try {
                await CosmicData.removeBalance(msg.argv[1], parseInt(msg.argv[2]));
                return `Successfully removed from balance of account '${msg.argv[1]}'.`;
            } catch (err) {
                return `Addbal failed. (maybe NaN?)`;
            }
        }
    }
));
