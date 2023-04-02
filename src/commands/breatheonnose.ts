import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import type { CosmicClientMPP } from "../MPP/CosmicClientMPP";

CosmicCommandHandler.registerCommand(
    new Command(
        "breatheonnose",
        ["breatheonnose"],
        "%PREFIX%breatheonnose <user>",
        `Breathe on another user's nose.`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            if (!msg.argv[1]) {
                return `Please type a user's name or ID.`;
            }

            let p = (cl as CosmicClientMPP).getPart(msg.argv[1]);

            if (p) {
                return `${msg.sender.name} breathes on ${p.name}'s nose.`;
            } else {
                return `User '${msg.argv[1]}' not found.`;
            }
        },
        "mpp"
    )
);
