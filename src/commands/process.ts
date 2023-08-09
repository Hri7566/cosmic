import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

const procCommands = {
    help: () => {
        return "Subcommands: " + Object.keys(procCommands).join(" | ");
    },
    stop: () => {
        process.exit();
    }
};

CosmicCommandHandler.registerCommand(
    new Command(
        "process",
        ["process", "proc"],
        "%PREFIX%process <subcommand>",
        `View memory usage.`,
        ["admin", "mod"],
        false,
        "info",
        async (msg, cl) => {
            if (!msg.argv[1]) return "See help subcommand";

            const subcommand = msg.argv[1];
            let callback = procCommands[subcommand];

            if (callback) {
                return callback(msg, cl);
            } else {
                return "Unknown command";
            }
        }
    )
);
