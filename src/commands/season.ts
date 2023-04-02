import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicSeasonDetection } from "../util/CosmicSeasonDetection";

CosmicCommandHandler.registerCommand(
    new Command(
        "season",
        ["season"],
        "%PREFIX%season",
        "Get the current season of the year.",
        ["default"],
        false,
        "info",
        async (msg, cl) => {
            let season = CosmicSeasonDetection.getSeason();

            if (season) {
                return `Season: ${season.emoji}${season.displayName}`;
            } else {
                return `Season: (none)`;
            }
        }
    )
);
