import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicCakeFactory } from "../cakes/CosmicCakeFactory";

CosmicCommandHandler.registerCommand(
    new Command(
        "bake",
        ["bake", "b"],
        "%PREFIX%bake",
        `Bake a cake.`,
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            let response;
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

            response = await CosmicCakeFactory.startBaking(
                msg.sender,
                cl,
                isDM
            );
            // response = CosmicCakeFactory.startBaking(msg.sender, cl);
            return response;
        }
    )
);
