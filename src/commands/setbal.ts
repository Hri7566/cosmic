import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "setbal",
        ["setbal"],
        "%PREFIX%setbal <userId> <amount>",
        `Set an account's balance.`,
        ["admin"],
        false,
        "cake",
        async (msg, cl) => {
            if (msg.argv[2]) {
                try {
                    await CosmicData.setBalance(
                        msg.argv[1],
                        parseInt(msg.argv[2])
                    );
                    return `Successfully set account ${
                        msg.argv[1]
                    }'s balance to ${parseInt(msg.argv[2])}`;
                } catch (err) {
                    return `Subbal failed. (maybe NaN?)`;
                }
            }
        }
    )
);
