import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicCakeFactory } from "../cakes/CosmicCakeFactory";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(new Command(
    'eat',
    [ 'eat', 'e' ],
    '%PREFIX%eat [item] [amount]',
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
