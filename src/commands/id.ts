import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(
    new Command(
        "id",
        ["id"],
        "%PREFIX%id",
        `Get the user's own ID.`,
        ["default"],
        true,
        "info",
        async (msg, cl) => {
            return `ID: ${msg.sender._id}`;
        }
    )
);
