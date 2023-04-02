import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicCakeFactory } from "../cakes/CosmicCakeFactory";

CosmicCommandHandler.registerCommand(
    new Command(
        "rcake",
        ["rcake"],
        "%PREFIX%rcake",
        `Generate a random cake.`,
        ["admin"],
        false,
        "cake",
        async (msg, cl) => {
            let c = await CosmicCakeFactory.generateRandomCake();

            let res = await CosmicData.addItem(msg.sender._id, c);
            // console.debug(res);

            let displayName = (c.emoji ? `${c.emoji}` : "") + c.displayName;
            return `Cake: ${displayName}`;
        }
    )
);
