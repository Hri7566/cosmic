import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicLoitering } from "../loitering";

CosmicCommandHandler.registerCommand(
    new Command(
        "loiter",
        ["loiter"],
        "%PREFIX%loiter",
        "This command exists for broke people.",
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            let isDM = false;

            try {
                if (msg.original_message) {
                    if (msg.original_message.original_message) {
                        isDM = msg.original_message.original_message.m == "dm";
                    }
                }
            } catch (err) {
                isDM = false;
            }

            let user = await CosmicData.getUser(msg.sender._id);
            return CosmicLoitering.startLoitering(cl, user, isDM);
        }
    )
);
