/**
 * COSMIC PROJECT
 * 
 * Cosmic commands
 */

/**
 * Global module imports
 */

const crypto = require('crypto');

/**
 * Local module imports
 */

import { CosmicCakeFactory } from "./CosmicCakeFactory";
import { CosmicShop } from "./CosmicShop";
import { CosmicUtil } from "./CosmicUtil";
import { Cosmic as CosmicColor } from './CosmicColor';
const { Command, CosmicCommandHandler } = require('./CosmicCommandHandler');
const { CosmicData } = require('./CosmicData');
const { Cosmic } = require('./Cosmic');

/**
 * Module-level declarations
 */

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
                    if (cmd.platform) {
                        if (cmd.platform !== cl.platform && cmd.platform !== 'all') continue;
                    }
                    
                    if (cmd.commandGroup !== group.id) continue;
                    if (cmd.visible == false) continue;
                    out += ` ${msg.prefix.prefix}${cmd.accessors[0]}, `;
                }

                out = CosmicUtil.trimListString(out);
                cl.sendChat(out);
            }

            // return out;
        } else {
            let out = `There is no help for '${msg.argv[1]}'.`;
            
            bigLoop:
            for (let cmd of CosmicCommandHandler.commands) {
                if (cmd.platform) {
                    if (cmd.platform !== cl.platform && cmd.platform !== 'all') continue;
                }

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
    'id',
    [ 'id' ],
    '%PREFIX%id',
    `Get the user's own ID.`,
    [ 'default' ],
    true,
    'info',
    async (msg, cl) => {
        return `ID: ${msg.sender._id}`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'color',
    [ 'color', 'c', 'colour' ],
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
                
                let c = new CosmicColor.Color(r, g, b);
                let outc = `${c.getName().replace('A', 'a')} [${c.toHexa()}]`;
                return `The RGB color ${r}, ${g}, ${b} is ${outc}`;
            } catch (e) {
                return `The color '${msg.argv[1]}, ${msg.argv[2]}, ${msg.argv[3]}' is not a valid RGB color. Reason: ${e}`
            }
        } else if (msg.argv[1]) {
            if (msg.argv[1].match(/#[0-9a-f]{6}/ig) !== null) {
                // definitely a hex string
                let c = new CosmicColor.Color(msg.argv[1]);
                let outc = `${c.getName().replace('A', 'a')} [${c.toHexa()}]`;
                return `The hex color '${msg.argv[1]}' is ${outc}`;
            } else {
                return `I don't think '${msg.argv[1]}' is a hex color.`;
            }
        } else {
            if (msg.sender.color) {
                let c = new CosmicColor.Color(msg.sender.color);
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

        let hash = crypto.createHash('sha256');
        hash.update(msg.argv.join(' ').substring(msg.argv[1].length).trim());
        let hex = hash.digest().toString('hex');
        let lastChar = parseInt(hex[hex.length - 1], 16);
        let r = magic8ballAnswers[lastChar % magic8ballAnswers.length];
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
        const response = CosmicCakeFactory.startBaking(msg.sender, cl);
        return response;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'stopbaking',
    [ 'stopbaking', 'stopbake', 'stop' ],
    '%PREFIX%stopbaking',
    `Stop baking a cake. (WIP)`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        const response = CosmicCakeFactory.stopBaking(msg.sender._id);
        return response;
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
    [ 'balance', 'bal', 'money' ],
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
        // console.debug(res);

        let displayName = (c.emoji ? `${c.emoji}` : '') + c.displayName;
        return `Cake: ${displayName}`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'addbal',
    [ 'addbal' ],
    '%PREFIX%addbal <userId> <amount>',
    `Add an amount to an account's balance.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        if (msg.argv[2]) {
            try {
                await CosmicData.addBalance(msg.argv[1], parseInt(msg.argv[2]));
                return `Successfully added ${parseInt(msg.argv[2])} to balance of account '${msg.argv[1]}'.`;
            } catch (err) {
                return `Addbal failed. (maybe NaN?)`;
            }
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'setbal',
    [ 'setbal' ],
    '%PREFIX%setbal <userId> <amount>',
    `Set an account's balance.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        if (msg.argv[2]) {
            try {
                await CosmicData.setBalance(msg.argv[1], parseInt(msg.argv[2]));
                return `Successfully set account ${msg.argv[1]}'s balance to ${parseInt(msg.argv[2])}`;
            } catch (err) {
                return `Subbal failed. (maybe NaN?)`;
            }
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'breatheonnose',
    [ 'breatheonnose' ],
    '%PREFIX%breatheonnose <user>',
    `Breathe on another user's nose.`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        if (!msg.argv[1]) {
            return `Please type a user's name or ID.`;
        }
        let p = cl.getPart(msg.argv[1]);
        if (p) {
            return `${msg.sender.name} breathes on ${p.name}'s nose`
        } else {
            return `User '${msg.argv[1]}' not found.`;
        }
    },
    'mpp'
));

CosmicCommandHandler.registerCommand(new Command(
    'js',
    [ 'js', 'eval' ],
    '%PREFIX%js <code>',
    `Run JavaScript directly.`,
    [ 'admin' ],
    false,
    'info',
    async (msg, cl) => {
        if (!msg.argv[1]) {
            return `Please type some code to run.`;
        }
        
        try {
            let argcat = msg.argv.join(' ').substring(msg.argv[0].length).trim();
            let out = eval(argcat);
            return `👍 ${out}`;
        } catch (err) {
            return `👎 ${err}`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'follow',
    [ 'follow', 'f' ],
    '%PREFIX%follow <userId>',
    `Follow another user's cursor.`,
    [ 'default' ],
    true,
    'fun',
    async (msg, cl) => {
        if (!msg.argv[1]) {
            msg.argv[1] = msg.sender._id;
        }

        let p = cl.getPart(msg.argv[1]);

        if (p) {
            cl.cursor.follow = p._id;
            cl.cursor.scale = 5;
            cl.cursor.speed = 2;

            return `Now following ${p.name}.`;
        } else {
            return `Could not find user '${msg.argv[1]}'.`;
        }
    },
    'mpp'
));

CosmicCommandHandler.registerCommand(new Command(
    'unfollow',
    [ 'unfollow', 'uf', 'unf', 'un' ],
    '%PREFIX%unfollow',
    `Stop the cursor from following somebody.`,
    [ 'default' ],
    true,
    'fun',
    async (msg, cl) => {
        if (!cl.cursor.follow) {
            return `The cursor is not following anybody.`;
        }

        cl.cursor.follow = undefined;
        cl.cursor.scale = 10;
        cl.cursor.speed = 1;

        return `Stopped following.`;
    },
    'mpp'
));

CosmicCommandHandler.registerCommand(new Command(
    'yousuckbitch',
    [ 'yousuckbitch' ],
    '%PREFIX%yousuckbitch',
    `You suck bitch.`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        return `No, you suck, bitch!`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'michael',
    [ 'michael' ],
    '%PREFIX%michael',
    `https://youtube.com/michaelreeves`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        return `die forever bastard i hate you`
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'hellothere',
    [ 'hellothere' ],
    '%PREFIX%hellothere',
    `star wars`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        return `General Kenobi!`
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'sh',
    [ 'sh' ],
    '%PREFIX%sh',
    `shell`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        return `There is no shell access, go away.`
    }
));

const startTime = Date.now();

CosmicCommandHandler.registerCommand(new Command(
    'uptime',
    [ 'uptime', 'u' ],
    '%PREFIX%uptime',
    `Check the uptime of the bot.`,
    [ 'default', 'mod' ],
    false,
    'info',
    async (msg, cl) => {
        const ms = Date.now() - startTime;
        const s = ms / 1000;
        const m = s / 60;
        const h = m / 60;
        
        const hh = Math.floor(h);
        const mm = Math.floor(m) % 60;
        const ss = Math.floor(s) % 60;

        return `Uptime: ${hh}h ${mm}m ${ss}s`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'eat',
    [ 'eat', 'e' ],
    '%PREFIX%eat [item]',
    `Eat an edible item.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        if (!msg.argv[1]) return `Please specify an item to eat.`;
        const inv = await CosmicData.getInventory(msg.sender._id);
        let argcat = msg.argv.join(' ').substring(msg.argv[0].length).trim();

        if (!inv) CosmicData.createInventory(msg.sender._id);

        let mod_it;
        let amount_to_remove;

        try {
            amount_to_remove = parseInt(msg.argv[msg.argv.length - 1]);
            if (typeof amount_to_remove !== 'undefined') {
                argcat = argcat.substring(0, argcat.length - msg.argv[msg.argv.length - 1].length).trim();
            }
        } finally {};

        
        for (const it of inv.items) {
            if (it.displayName.toLowerCase().includes(argcat.toLowerCase())) {
                mod_it = it;
                break;
            }
        }

        if (!mod_it) {
            const no_item_answers = [
                `You don't have ${(/^[aeiou]/).test(argcat) ? 'an' : 'a'} '${argcat}' that you can eat.`,
                `There is not ${(/^[aeiou]/).test(argcat) ? 'an' : 'a'} '${argcat}' here.`,
                `You don't have any '${argcat}'.`
            ]
            return no_item_answers[Math.floor(Math.random() * no_item_answers.length)];
        }

        if (amount_to_remove) {
            if (amount_to_remove < 1) {
                return `1 < Amount to eat < 100`;
            }
        } else {
            amount_to_remove = 1;
        }

        if (amount_to_remove > mod_it.count) {
            const not_enough_answers = [
                `Sadly, you can't eat more than you have.`,
                `It turns out you don't have that many.`,
                `Did you want to eat less?`,
                `There is not ${amount_to_remove} of that here.`
            ]
            // console.debug(amount_to_remove, mod_it.count);
            return not_enough_answers[Math.floor(Math.random() * not_enough_answers.length)];
        }

        if (mod_it) {
            const res1 = await CosmicData.removeOneItem(msg.sender._id, mod_it.id, amount_to_remove || 1);
            // CosmicCommandHandler.logger.debug(res1);
            if (mod_it.id.startsWith('cake') || mod_it.id.startsWith('cupcake')) {
                let bal_add = (mod_it.value || CosmicCakeFactory.DEFAULT_CAKE_VALUE) * amount_to_remove;
                await CosmicData.addBalance(msg.sender._id, bal_add);
                // CosmicCommandHandler.logger.debug(`addbal: ${bal_add}`);
                // CosmicCommandHandler.logger.debug(`amount: ${amount_to_remove}`);
                return `You ate ${amount_to_remove == 1 ? (/^[aeiou]/).test(mod_it.displayName) ? 'an' : 'a' : amount_to_remove + ' of'} ${mod_it.displayName} and got ${CosmicData.formatBalance(bal_add)}.`
            }
            return `You ate a ${mod_it.displayName}.`;
        } else {
            return `Could not find the item '${argcat}' in your inventory. Do you have one?`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'eatallcakes',
    [ 'eatallcakes', 'eatall', 'eac', 'ea' ],
    '%PREFIX%eatallcakes',
    `Consume all cakes in the user's inventory.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        const inv = await CosmicData.getInventory(msg.sender._id);
        let total = 0;

        let has_cakes = typeof inv.items.find(it => it.id.startsWith('cake') || it.id.startsWith('cupcake')) !== 'undefined';

        if (!has_cakes) {
            const sad_answers = [
                `You are sad because you have no cake.`,
                `There is no cake in your inventory.`,
                `Cake is missing from your inventory.`,
                `Cake is something you don't have.`,
                `Where is your cake?`,
                `What happened to your cake?`,
                `Did you forget to bake?`,
                `From the looks of things, cake is 0.`,
                `Cake? What cake?`,
                `Cake?`,
                `What cake?`,
                `There is no cake for you to eat.`,
                `No cake.`
            ]
            return sad_answers[Math.floor(Math.random() * sad_answers.length)];
        }

        for (let it of inv.items) {
            if (it.id.startsWith('cake') || it.id.startsWith('cupcake')) {
                total += it.count * (it.value || CosmicCakeFactory.DEFAULT_CAKE_VALUE);
                await CosmicData.removeItem(msg.sender._id, it.id);
            }
        }

        await CosmicData.addBalance(msg.sender._id, total);

        return `You ate all of your cake and gained ${CosmicData.formatBalance(total)}${total > 15 ? ' and lots of weight' : ''}.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'removeitem',
    [ 'removeitem', 'rmitem', 'rmi', 'rm' ],
    '%PREFIX%removeitem <inventory id> <item id>',
    `Remove an item from an inventory.`,
    [ 'admin' ],
    false,
    'cake',
    async (msg, cl) => {
        if (!msg.argv[1]) return `Please specify a user ID and an item ID.`;
        if (!msg.argv[2]) return `Please specify an item ID.`;

        let res = await CosmicData.removeItem(msg.argv[1], msg.argv[2]);
        return `Removed item with ID '${msg.argv[2]}' successfuly.`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'memory',
    [ 'memory', 'mem' ],
    '%PREFIX%memory',
    `View memory usage.`,
    [ 'admin', 'mod' ],
    false,
    'info',
    async (msg, cl) => {
        return `Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'shop',
    [ 'shop', 's' ],
    '%PREFIX%shop',
    'Show items in the shop.',
    [ 'default' ],
    false,
    'info',
    async (msg, cl) => {
        let out = `Items:`;
        let shopItems = CosmicShop.getListings();

        if (shopItems.length > 0) {
            for (let ls of shopItems) {
                out += ` ${ls.item.displayName}: ${CosmicShop.getItemPrice(ls.item.id)} | `;
            }

            out = CosmicUtil.trimListString(out);
        } else {
            out += ` (none)`;
        }

        return out;
    }
));
