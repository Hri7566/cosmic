import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "leaderboard",
        ["leaderboard", "topbal"],
        "%PREFIX%leaderboard",
        `List the highest account balances.`,
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            let inventories = await CosmicData.getTopBalances();
            if (!inventories) {
                return "Error: Could not load inventory data";
            }
            let out = `Leaderboard: `;

            let user;
            let i = 0;

            for await (let inv of inventories) {
                if (i > 10) break;

                user = await CosmicData.getUser((inv as any)._id);
                if (!user) {
                    out += `${(inv as any)._id.substring(
                        0,
                        6
                    )}: ${CosmicData.formatBalance(inv.balance)} | `;
                } else {
                    if (user.name.length > 10) {
                        out += `[${user._id.substring(
                            0,
                            6
                        )}] ${user.name.substring(
                            0,
                            14
                        )}…: ${CosmicData.formatBalance(inv.balance)} | `;
                    } else {
                        out += `[${user._id.substring(0, 6)}] ${
                            user.name
                        }: ${CosmicData.formatBalance(inv.balance)} | `;
                    }
                }

                i++;
            }

            out = out.substring(0, out.length - 2).trim();

            return out;
        }
    )
);
