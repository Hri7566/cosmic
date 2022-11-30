/**
 * COSMIC PROJECT
 * 
 * Cosmic commands
 */

/**
 * Global module imports
 */

const crypto = require('crypto');
import { evaluate } from 'mathjs';

/**
 * Local module imports
 */

import { CosmicCakeFactory } from "./CosmicCakeFactory";
import { CosmicShop } from "./CosmicShop";
import { CosmicUtil } from "./CosmicUtil";
import { Cosmic as CosmicColor } from './CosmicColor';
import { CosmicSeasonDetection } from "./CosmicSeasonDetection";
import { AnyItem, Cosmic, Cosmic as CosmicTypes, Inventory, Item, ShopListing } from "./CosmicTypes";
import { CosmicData } from './CosmicData';
import { ITEMS } from "./CosmicItems";
import { CosmicClient } from "./CosmicClient";
const { Command, CosmicCommandHandler } = require('./CosmicCommandHandler');

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
        let ms = CosmicUtil.getTimeSinceProjectCreation();
        let ss = ms / 1000;
        let mm = ss / 60;
        let hh = mm / 60;
        let dd = hh / 24;
        let isProd = process.env.NODE_ENV == 'production';
        return `${isProd ? '' : '[NON-PRODUCTION BUILD] '}✨ This outer space-themed bot was made by Hri7566#3409. This bot was created ${Math.floor(dd)} days, ${Math.floor(hh % 24)} hours, ${Math.floor(mm % 60)} minutes, and ${Math.floor(ss % 60)} seconds ago. https://cosmic.hri7566.info`;
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
        let c = await CosmicCakeFactory.generateRandomCake();

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
        return `hi dale!`;
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

CosmicCommandHandler.registerCommand(new Command(
    'uptime',
    [ 'uptime', 'u' ],
    '%PREFIX%uptime',
    `Check the uptime of the bot.`,
    [ 'default', 'mod' ],
    false,
    'info',
    async (msg, cl) => {
        const ms = CosmicUtil.getUptime();
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
            let arg_to_check = msg.argv[msg.argv.length - 1];
            if (arg_to_check !== 1) {
                amount_to_remove = parseInt(arg_to_check);
                if (!isNaN(amount_to_remove)) {
                    argcat = argcat.substring(0, arg_to_check).trim();
                }
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
            return CosmicUtil.getRandomValueFromArray(no_item_answers);
        }

        if (!mod_it.edible) {
            const not_edible_answers = [
                `You can't eat the ${mod_it.displayName}.`,
                `The ${mod_it.displayName} hurts your teeth, and you decide not to eat it.`,
                `Putting the ${mod_it.displayName} in your mouth, you realize that it is not edible, and decide to take it out.`,
                `Eating the ${mod_it.displayName} will yield no results.`
            ]
            return CosmicUtil.getRandomValueFromArray(not_edible_answers);
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
            return CosmicUtil.getRandomValueFromArray(not_enough_answers);
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

            let aOrAn = 'a';
            if (/^[aeiou]/i.test(mod_it.displayName)) aOrAn = 'an';

            return `You ate ${aOrAn} ${mod_it.displayName}.`;
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
            return CosmicUtil.getRandomValueFromArray(sad_answers);
        }

        for (let it of inv.items) {
            if (it.id.startsWith('cake') || it.id.startsWith('cupcake')) {
                total += it.count * (it.value || CosmicCakeFactory.DEFAULT_CAKE_VALUE);
                await CosmicData.removeItem(msg.sender._id, it.id);
            }
        }

        await CosmicData.addBalance(msg.sender._id, total);

        return `You ate all of your cake and gained ${CosmicData.formatBalance(total)}${total > 500 ? ' and lots of weight' : ''}.`;
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
    'season',
    [ 'season' ],
    '%PREFIX%season',
    'Get the current season of the year.',
    [ 'default' ],
    false,
    'info',
    async (msg, cl) => {
        let season = CosmicSeasonDetection.getSeason();

        if (season) {
            return `Season: ${season.emoji}${season.displayName}`;
        } else {
            return `Season: (none)`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'holiday',
    [ 'holiday' ],
    '%PREFIX%holiday',
    'Get the current holiday.',
    [ 'default' ],
    false,
    'info',
    async (msg, cl) => {
        let holiday = CosmicSeasonDetection.getHoliday();

        if (holiday) {
            return `Holiday: ${holiday.emoji}${holiday.displayName}`;
        } else {
            return `Holiday: (none)`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'shop',
    [ 'shop', 's' ],
    '%PREFIX%shop',
    'Show items in the shop.',
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        let emoji = CosmicShop.emoji ? CosmicShop.emoji : '';
        let out = `${emoji} Items:`;
        let shopItems = CosmicShop.getListings();

        if (shopItems.length > 0) {
            for (let ls of shopItems) {
                out += ` ${ls.item.displayName}: ${CosmicData.formatBalance(CosmicShop.getItemPrice(ls.item.id))} | `;
            }

            out = CosmicUtil.trimListString(out);
        } else {
            out += ` (none)`;
        }

        return out;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'buy',
    [ 'buy' ],
    '%PREFIX%buy <item>',
    'Buy an item from the item shop.',
    [ 'admin' ], // [ 'default' ],
    false, // true,
    'cake',
    async (msg, cl) => {
        const shopListings = CosmicShop.getListings();
        const search = msg.argv[1];

        if (!search) {
            return `Please type an item name from the item shop.`
        }
        
        let listing: ShopListing;

        for (const ls of shopListings) {
            if (ls.item.displayName.toLowerCase().includes(search)) {
                listing = ls;
            }
        }

        const balance = await CosmicData.getBalance(msg.sender._id);
        let price = listing.item.value;
        
        if (listing.overridePrice) {
            price = listing.overridePrice;
        }

        try {
            if (CosmicData.hasItem(msg.sender._id, listing.item.id)) {
                const inv: Inventory = await CosmicData.getInventory(msg.sender._id);
                let it: AnyItem;

                for (const i of inv.items) {
                    if (i.id == listing.item.id) {
                        it = i;
                        break;
                    }
                }

                if (it) {
                    if (it.count >= it.max_stack) {
                        return `You can't have any more of ${CosmicUtil.formatItemString(listing.item.displayName, listing.item.emoji, 1)}.`;
                    }
                }
            }

            if (balance < price) {
                let answers = [
                    `You can't afford ${listing.item.displayName} (x${listing.item.count}).`,
                    `You don't have enough money to buy ${listing.item.displayName} (x${listing.item.count}).`,
                    `You are too poor. Come back again with more for ${listing.item.displayName} (x${listing.item.count}).`,
                    `You bought ${CosmicUtil.formatItemString(listing.item.displayName, listing.item.emoji, listing.item.count)}. Wait, no. You can't afford that.`
                ]

                return CosmicUtil.getRandomValueFromArray(answers);
            }

            CosmicData.addItem(msg.sender._id, listing.item);
            CosmicData.addBalance(msg.sender._id, -price);
            
            return `You bought ${CosmicUtil.formatItemString(listing.item.displayName, listing.item.emoji, listing.item.count)} for ${CosmicData.formatBalance(price)} from the shop.`;
        } catch (err) {
            CosmicCommandHandler.logger.error(err);
            CosmicCommandHandler.logger.warn('Transaction error detected');
            return `A serious transaction error has occurred. Whoops :/`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'sell',
    [ 'sell' ],
    '%PREFIX%sell <item>',
    `Sell an item.`,
    [ 'default' ],
    true,
    'cake',
    async (msg: Cosmic.CommandMessage, cl: CosmicClient) => {
        const search = msg.argv[1];

        if (!search) {
            return `Please type the name of an item to sell.`;
        }

        const inv: Inventory = await CosmicData.getInventory(msg.sender._id);

        let found: Item;
        
        for (let it of inv.items) {
            if (search == it.id || it.displayName.toLowerCase().includes(search.toLowerCase())) {
                found = it;
                break;
            }
        }

        if (!found) {
            return `You don't have a '${search}' to sell.`;
        }

        let count = 1;
        let value = found.value || 0;

        if (found.sellable) {
            let balToAdd = count * value;
            CosmicData.removeOneItem(msg.sender._id, found.id, count);
            CosmicData.addBalance(msg.sender._id, balToAdd);
            return `You sold ${CosmicUtil.formatItemString(found.displayName, found.emoji, count)} and received ${CosmicData.formatBalance(balToAdd)}.`;
        } else {
            return `You can't sell ${CosmicUtil.formatItemString(found.displayName, found.emoji, 1)}.`
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'leaderboard',
    [ 'leaderboard', 'topbal' ],
    '%PREFIX%leaderboard',
    `List the highest account balances.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        let inventories = await CosmicData.getTopBalances();
        if (!inventories) {
            return 'Error: Could not load inventory data';
        }
        let out = `Leaderboard: `;

        let user;
        let i = 0;

        for await (let inv of inventories) {
            if (i > 10) break;
            
            user = await CosmicData.getUser((inv as any)._id);
            if (!user) {
                out += `${(inv as any)._id.substring(0, 6)}: ${CosmicData.formatBalance(inv.balance)} | `;
            } else {
                if (user.name.length > 10) {
                    out += `[${user._id.substring(0, 6)}] ${user.name.substring(0, 14)}…: ${CosmicData.formatBalance(inv.balance)} | `;
                } else {
                    out += `[${user._id.substring(0, 6)}] ${user.name}: ${CosmicData.formatBalance(inv.balance)} | `;
                }
            }

            i++;
        }

        out = out.substring(0, out.length - 2).trim();

        return out;
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'description',
    [ 'description', 'desc', 'itemdescription' ],
    '%PREFIX%description <item>',
    `Get the description of an item.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        if (!msg.argv[1]) return 'Type the name of an item to get a description.';
        
        let i: Item;
        for (let it of Object.values(ITEMS)) {
            if (msg.argv[1] == it.id || it.displayName.toLowerCase().includes(msg.argv[1].toLowerCase())) {
                i = it;
                break;
            }
        }

        if (i) {
            return `Name: ${CosmicUtil.formatItemString(i.displayName, i.emoji, i.count)} | Description: ${i.description ? i.description : 'No description.'}${i.value ? ` | Value: ${i.value}` : ''}`
        } else {
            return `Item '${msg.argv[1]}' not found.`;
        }
    }
));

CosmicCommandHandler.registerCommand(new Command(
    'math',
    [ 'math' ],
    '%PREFIX%math',
    `Evaluate a mathematical expression.`,
    [ 'default' ],
    true,
    'fun',
    async (msg, cl) => {
        if (!msg.argv[1]) return `Please submit an expression to evaluate.`;

        try {
            let expr = msg.a.substring(msg.argv[0].length).trim();
            return evaluate(expr);
        } catch(err) {
            return err;
        }
    }
));

let knockKnockJokes = [
    { q: 'Arthur', a: 'Arthur any more at home like you?' },
    { q: 'Jimmy', a: 'Jimmy a little kiss, will ya, huh?' },
    { q: 'Hyman', a: 'Hyman the mood for love' },
    { q: 'Avon', a: 'Avon to be alone' },
    { q: 'Boo', a: `Don't cry, little baby` },
    { q: 'Butcher', a: 'Butcher arms around me honey, hold me tight' },
    { q: 'Theresa', a: 'Theresa... nothing like a dame.' },
    { q: 'Dishes', a: 'Dishes the FBI. Open up.' },
    { q: 'Elba', a: 'Elba down to get you in a taxi, honey.' },
    { q: 'Accordion', a: `Accordion to the paper, it's gonna rain tonight.` },
    { q: 'Abie', a: 'Abie cdefg' },
    { q: 'Abyssinia', a: 'Abyssinia soon.' },
    { q: 'Major', a: `Major open the door, didn't I?` },
    { q: 'Evvie', a: 'Evviething I have is yours.' },
    { q: 'Manny', a: 'Manny are called but few are chosen.' },
    { q: 'Wendy', a: 'Wendy moon comes over the mountain.' },
    { q: 'Donna', a: 'Donna sit under the apple tree...' },
    { q: 'Yule', a: 'Yule never know who much I love you...' },
    { q: 'Marion', a: 'Marion haste, repent at leisure.' },
    { q: 'Minnie', a: 'Minnie brave hearts are asleep in the deep.' },
    { q: 'Mayer', a: 'Mayer days be filled with laughter.' },
    { q: 'Hugh', a: 'Yoo hoo yourself.' },
    { q: 'Hugo', a: 'Hugo to my head.' },
    { q: 'Gwen', a: 'Gwen my way?' },
    { q: 'Handsome', a: 'Handome pizza to me, please.' },
    { q: 'Humus', a: 'Humus remember this, a kiss is still a kiss...' },
    { q: 'Sony', a: 'Sony... a paper moon.' },
    { q: 'Ida', a: `Ida written if I'd known you were away.` },
    { q: 'Iowa', a: 'Iowa a lot of money on my income tax.' },
    { q: 'Isabelle', a: 'Isabelle ringing? I thought I heard one.' },
    { q: 'Jamaica', a: 'Jamaica passing grade in math?' },
    { q: 'Doughnut', a: 'Doughnut ask me silly questions.' },
    { q: 'Dr. Livingstone', a: 'Dr. Livingstone I. Presume.' },
    { q: 'Dwayne', a: `Dwayne the bathtub, I'm dwowning.`},
    { q: 'Elsie', a: 'Elsie you later, alligator.' },
    { q: 'Lil', a: 'Lil things mean a lot.' },
    { q: 'Madame', a: 'Madame foot is stuck in the door.' },
    { q: 'Leica', a: 'Leica bridge over troubled water...' },
    { q: 'Kershew', a: 'Kershew, Red Baron!' },
    { q: 'Olive', a: 'Olive my wife, but oh, you kid!' },
    { q: `O'Shea`, a: `O'Shea can you shee, by the dawn's early light?` },
    { q: 'Toby', a: 'Toby or not Toby, that is the question.' },
    { q: 'Sarah', a: 'Sarah doctor in the house?' },
    { q: 'Tuba', a: 'Tuba toothpaste, please.' },
    { q: 'Zebra', a: 'Zebra is too big for me.' },
    { q: 'Heather', a: 'Heather Georgy girl.' },
    { q: 'Ira', a: 'Ira...gret that I have but one life to give for my country.' },
    { q: 'Watson', a: 'Not much. Watson who with you?' },
    { q: 'Annie', a: 'Annie thing you can do, I can do better...' },
    { q: 'Wayne', a: 'Waynedwops keep fawing on my head.' },
    { q: 'Orange', a: `Orange you glad I didn't say banana?` },
    { q: 'Sam and Janet', a: 'Sam and Janet evening...' },
    { q: 'Thesis', a: 'Thesis... a recording.' },
    { q: 'Anita', a: 'Anita another kiss, baby.' },
    { q: 'Leif', a: 'Leif me alone.' },
    { q: 'Olaf', a: 'Olaf my heart in San Francisco.' },
    { q: 'Murray', a: 'Murray Christmas to all.' },
    { q: 'Philip', a: `Philip my glass, please. I'm thirsty.` },
    { q: 'Pizza', a: 'Pizza on earth, good will to men.' },
    { q: 'Atch', a: 'Gesundheit!' },
    { q: 'Thad', a: `Thad's all, folks!` }
];

let knockKnocking = false;
let joke: any;

CosmicCommandHandler.registerCommand(new Command(
    'knockknockjoke',
    [ 'knockknockjoke', 'kkj' ],
    '%PREFIX%knockknockjoke',
    `Tons of bad knock knock jokes.`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        if (knockKnocking) {
            // cl.client.off('a', listener1);
            // cl.client.off('a', listener2);
            // knockKnocking = false;

            return `There is already a knock knock joke in progress: ${joke.q}`;
        }

        
        let listener2 = function(msg) {
            if (msg.a.toLowerCase().endsWith('who') || msg.a.toLowerCase().endsWith('who?')) {
                cl.sendChat(joke.a);
                cl.client.off('a', listener2);
                knockKnocking = false;
            }
        }
        
        let listener1 = function(msg) {
            if (msg.a.toLowerCase() == `who's there` || msg.a.toLowerCase() == 'whos there' || msg.a.toLowerCase() == `who's there?` || msg.a.toLowerCase() == 'whos there?') {
                cl.sendChat(joke.q);
                cl.client.off('a', listener1);
                cl.client.on('a', listener2);
            }
        }

        knockKnocking = true;
        cl.sendChat('Knock knock');
        joke = knockKnockJokes[Math.floor(Math.random() * knockKnockJokes.length)];
        cl.client.on('a', listener1);
    }
));
