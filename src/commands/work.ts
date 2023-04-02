import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicWork } from "../work";

CosmicCommandHandler.registerCommand(
    new Command(
        "work",
        ["work"],
        "%PREFIX%work",
        undefined,
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
            return await CosmicWork.startWorking(cl, user, isDM);
        }
    )
);
