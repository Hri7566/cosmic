import { CosmicClient } from "../CosmicClient";
import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CommandMessage, Inventory, Item } from "../util/CosmicTypes";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "sell",
        ["sell"],
        "%PREFIX%sell <item>",
        `Sell an item.`,
        ["default"],
        true,
        "cake",
        async (msg: CommandMessage, cl: CosmicClient) => {
            const search = msg.argv[1];

            if (!search) {
                return `Please type the name of an item to sell.`;
            }

            const inv: Inventory = await CosmicData.getInventory(
                msg.sender._id
            );

            let found: Item;

            for (let it of inv.items) {
                if (
                    search == it.id ||
                    it.displayName.toLowerCase().includes(search.toLowerCase())
                ) {
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
                return `You sold ${CosmicUtil.formatItemString(
                    found.displayName,
                    found.emoji,
                    count
                )} and received ${CosmicData.formatBalance(balToAdd)}.`;
            } else {
                return `You can't sell ${CosmicUtil.formatItemString(
                    found.displayName,
                    found.emoji,
                    1
                )}.`;
            }
        }
    )
);
