import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicFFI } from "../foreign/CosmicFFI";
import * as random from "@sefinek/random-animals";

CosmicCommandHandler.registerCommand(
    new Command(
        "cat",
        ["cat"],
        "%PREFIX%cat",
        undefined,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            const res = await (random as any).cat();
            return (res as any).data.message;
        }
    )
);
