import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";

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
