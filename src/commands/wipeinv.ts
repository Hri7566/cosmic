import { Command, CosmicCommandHandler } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "wipeinv",
        ["wipeinv"],
        "%PREFIX%wipeinv",
        `Wipe all inventory data.`,
        ["admin"],
        false,
        "info",
        async (msg, cl) => {
            await CosmicData.purgeInventories();
            return `Inventories purged successfully.`;
        }
    )
);
