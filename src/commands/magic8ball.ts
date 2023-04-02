import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import * as crypto from "crypto";

CosmicCommandHandler.registerCommand(
    new Command(
        "magic8ball",
        ["magic8ball", "8ball", "8"],
        "%PREFIX%magic8ball <question>",
        `Ask the magic 8-ball a question.`,
        ["default"],
        true,
        "fun",
        (msg, cl) => {
            if (!msg.argv[1]) return `Please ask a question.`;
            const magic8ballAnswers = [
                "It is certain",
                "It is decidedly so",
                "Without a doubt",
                "Yes, definitely",
                "You may rely on it",
                "As I see it, yes",
                "Most likely",
                "Outlook good",
                "Yes",
                "Signs point to yes",
                "Reply hazy, try again",
                "Ask again later",
                "Better not tell you now",
                "Cannot predict now",
                "Concentrate and ask again",
                `Don't count on it`,
                "My reply is no",
                "My sources say no",
                "Outlook not so good",
                "Very doubtful",
            ];

            let hash = crypto.createHash("sha256");
            hash.update(
                msg.argv.join(" ").substring(msg.argv[1].length).trim()
            );
            let hex = hash.digest().toString("hex");
            let lastChar = parseInt(hex[hex.length - 1], 16);
            let r = magic8ballAnswers[lastChar % magic8ballAnswers.length];
            return `${r}, ${msg.sender.name}.`;
        }
    )
);
