import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(
    new Command(
        "hellothere",
        ["hellothere"],
        "%PREFIX%hellothere",
        `star wars`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            return `General Kenobi!`;
        }
    )
);
