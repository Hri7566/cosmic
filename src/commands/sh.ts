import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(
    new Command(
        "sh",
        ["sh"],
        "%PREFIX%sh",
        `shell`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            return `There is no shell access, go away.`;
        }
    )
);
