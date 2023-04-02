import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import type { CosmicClientMPP } from "../MPP/CosmicClientMPP";

CosmicCommandHandler.registerCommand(
    new Command(
        "follow",
        ["follow", "f"],
        "%PREFIX%follow <userId>",
        `Follow another user's cursor.`,
        ["default"],
        true,
        "fun",
        async (msg, cl) => {
            if (!msg.argv[1]) {
                msg.argv[1] = msg.sender._id;
            }

            let p = (cl as CosmicClientMPP).getPart(msg.argv[1]);

            if (p) {
                (cl as CosmicClientMPP).cursor.follow = p._id;
                (cl as CosmicClientMPP).cursor.scale = 5;
                (cl as CosmicClientMPP).cursor.speed = 2;

                return `Now following ${p.name}.`;
            } else {
                return `Could not find user '${msg.argv[1]}'.`;
            }
        },
        "mpp"
    )
);
