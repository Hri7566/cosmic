import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";

CosmicCommandHandler.registerCommand(
    new Command(
        "removeitem",
        ["removeitem", "rmitem", "rmi", "rm"],
        "%PREFIX%removeitem <inventory id> <item id>",
        `Remove an item from an inventory.`,
        ["admin"],
        false,
        "cake",
        async (msg, cl) => {
            if (!msg.argv[1]) return `Please specify a user ID and an item ID.`;
            if (!msg.argv[2]) return `Please specify an item ID.`;

            let res = await CosmicData.removeItem(msg.argv[1], msg.argv[2]);
            return `Removed item with ID '${msg.argv[2]}' successfuly.`;
        }
    )
);
