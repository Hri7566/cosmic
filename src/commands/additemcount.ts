import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "additemcount",
        ["additemcount"],
        "%PREFIX%additemcount [user_id] [item_id] [count]",
        "Add a specific amount of items to an inventory (user must already have the item)",
        ["admin"],
        false,
        "info",
        async (msg, cl) => {
            // Add a specific amount of items to an inventory (admin only)
            const userID = msg.argv[1];
            const itemID: string = msg.argv[2];
            let countStr = msg.argv[3];

            if (!userID) {
                return "No user ID given";
            }

            if (!itemID) {
                return "No item ID given";
            }

            let count = parseInt(countStr);

            if (!countStr || isNaN(count)) {
                return "No count given";
            }

            if (await CosmicData.hasItem(userID, itemID)) {
                const res = await CosmicData.addItem(userID, {
                    id: itemID,
                    count: count
                } as any);
                return `Added ${count} to item ${itemID} at inventory ${userID}`;
            } else {
                return `Epic fail`;
            }
        }
    )
);
