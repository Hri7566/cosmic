import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";

CosmicCommandHandler.registerCommand(
    new Command(
        "removegroup",
        ["removegroup", "rmg", "rmgroup", "grouprm"],
        "%PREFIX%removegroup <userID> <groupID>",
        `Remove a group from a user profile.`,
        ["admin"],
        false,
        "info",
        async (msg, cl) => {
            const userID = msg.argv[1];
            const groupID = msg.argv[2];

            try {
                await CosmicData.removeGroup(userID, groupID);
                const user = await CosmicData.getGroups(userID);
                return `Successfully removed \`${user._id}\` from group \`${groupID}\``;
            } catch (err) {
                return `Unable to remove user from group.`;
            }
        }
    )
);
