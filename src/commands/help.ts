import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "help",
        ["help", "h", "cmds", "cmd"],
        `%PREFIX%help [command]`,
        `List all commands or get information about commands.`,
        ["default"],
        true, // visible
        "info",
        (msg, cl) => {
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

            if (!msg.argv[1]) {
                for (let group of CosmicCommandHandler.commandGroups) {
                    // let out = '🌠 Commands:';
                    let out = `${group.displayName}:`;

                    for (let cmd of CosmicCommandHandler.commands) {
                        if (cmd.platform) {
                            if (
                                cmd.platform !== cl.platform &&
                                cmd.platform !== "all"
                            )
                                continue;
                        }

                        if (cmd.commandGroup !== group.id) continue;
                        if (cmd.visible == false) continue;
                        // out += ` ${msg.prefix.prefix}${cmd.accessors[0]}, `;
                        out += ` ${cmd.accessors[0]}, `;
                    }

                    if (cl.platform == "mpp") {
                        out = out.replace(/\*.*?(\*)/, "\\*");
                    }

                    out = CosmicUtil.trimListString(out);
                    cl.emit("send chat message", {
                        dm: isDM ? msg.sender._id : undefined,
                        message: out
                    });
                }

                // return out;
            } else {
                let out = `There is no help for '${msg.argv[1]}'.`;

                bigLoop: for (let cmd of CosmicCommandHandler.commands) {
                    if (cmd.platform) {
                        if (
                            cmd.platform !== cl.platform &&
                            cmd.platform !== "all"
                        )
                            continue;
                    }

                    littleLoop: for (let acc of cmd.accessors) {
                        if (msg.argv[1] == acc) {
                            out = `Description: ${
                                cmd.description
                            } ⭐ Usage: ${Command.replaceUsageVars(
                                cmd.usage,
                                msg.prefix.prefix
                            )}`;
                        }
                    }
                }

                return out;
            }
        }
    )
);
