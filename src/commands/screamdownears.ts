import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import type { CosmicClientMPP } from "../MPP/CosmicClientMPP";

CosmicCommandHandler.registerCommand(
    new Command(
        "screamdownears",
        ["screamdownears"],
        "%PREFIX%screamdownears <user>",
        `Scream down another user's ears.`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            if (!msg.argv[1]) {
                return `Please type a user's name or ID.`;
            }

            let p = (cl as CosmicClientMPP).getPart(msg.argv[1]);

            if (p) {
                return `${msg.sender.name} screams down ${p.name}'s ears.`;
            } else {
                return `User '${msg.argv[1]}' not found.`;
            }
        },
        "mpp"
    )
);
