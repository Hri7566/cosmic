import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicCakeFactory } from "../cakes/CosmicCakeFactory";

CosmicCommandHandler.registerCommand(
    new Command(
        "stopbaking",
        ["stopbaking", "stopbake", "stop"],
        "%PREFIX%stopbaking",
        `Stop baking a cake. (WIP)`,
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            const response = CosmicCakeFactory.stopBaking(msg.sender._id);
            return response;
        }
    )
);
