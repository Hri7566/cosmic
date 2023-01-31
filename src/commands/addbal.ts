import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";

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
