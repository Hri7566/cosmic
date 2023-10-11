import { Command, CosmicCommandHandler } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "groups",
        ["groups", "g"],
        "%PREFIX%groups",
        `Lists the user's groups.`,
        ["default"],
        true,
        "info",
        async (msg, cl) => {
            const groups = await CosmicData.getGroups(msg.sender._id);
            return `Groups: ${groups.groups.join(", ")}`;
        }
    )
);
