import { env } from "process";
import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicUtil } from "../util/CosmicUtil";

const { NODE_ENV } = env;

CosmicCommandHandler.registerCommand(
    new Command(
        "aliases",
        ["aliases", "accessors"],
        `%PREFIX%aliases <command>`,
        `List a command's aliases.`,
        ["default"],
        true, // visible,
        "info",
        (msg, cl) => {
            if (!msg.argv[1]) return "Incorrect usage. (see help)";
            let foundCommand: Command;

            for (const command of CosmicCommandHandler.commands) {
                for (const alias of command.accessors) {
                    if (alias == msg.argv[1]) {
                        foundCommand = command;
                    }
                }
            }

            if (!foundCommand) {
                return "No command found.";
            } else {
                return `Aliases: ${foundCommand.accessors.join(", ")}`;
            }
        }
    )
);
