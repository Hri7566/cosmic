import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import type { CosmicClientMPP } from "../MPP/CosmicClientMPP";

CosmicCommandHandler.registerCommand(
    new Command(
        "unfollow",
        ["unfollow", "uf", "unf", "un"],
        "%PREFIX%unfollow",
        `Stop the cursor from following somebody.`,
        ["default"],
        true,
        "fun",
        async (msg, cl) => {
            if (!(cl as CosmicClientMPP).cursor.follow) {
                return `The cursor is not following anybody.`;
            }

            (cl as CosmicClientMPP).cursor.follow = undefined;
            (cl as CosmicClientMPP).cursor.scale = 10;
            (cl as CosmicClientMPP).cursor.speed = 1;

            return `Stopped following.`;
        },
        "mpp"
    )
);
