import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";

CosmicCommandHandler.registerCommand(new Command(
    'additemcount',
    [ 'additemcount' ],
    '%PREFIX%additemcount [user_id] [item_id] [count]',
    undefined,
    [ 'default' ],
    false,
    'info',
    async (msg, cl) => {
        const userID = msg.argv[1];
        const itemID: string = msg.argv[2];
        let count = msg.argv[3];

        if (!userID) {
            return 'No user ID given';
        }

        if (!itemID) {
            return 'No item ID given';
        }

        count = parseInt(count);

        if (!count || isNaN(count)) {
            return 'No count given';
        }

        if (await CosmicData.hasItem(userID, itemID)) {
            const res = await CosmicData.addItem(userID, ({ id: itemID, count } as any));
            return `Added ${count} to item ${itemID} at inventory ${userID}`;
        } else {
            return `Epic fail`;
        }
    }
));
