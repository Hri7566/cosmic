import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicSeasonDetection } from "../util/CosmicSeasonDetection";

CosmicCommandHandler.registerCommand(
    new Command(
        "holiday",
        ["holiday"],
        "%PREFIX%holiday",
        "Get the current holiday.",
        ["default"],
        false,
        "info",
        async (msg, cl) => {
            let holiday = CosmicSeasonDetection.getHoliday();

            if (holiday) {
                return `Holiday: ${holiday.emoji}${holiday.displayName}`;
            } else {
                return `Holiday: (none)`;
            }
        }
    )
);
