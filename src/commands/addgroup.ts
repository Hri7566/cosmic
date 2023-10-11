import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../data";

CosmicCommandHandler.registerCommand(
    new Command(
        "addgroup",
        ["addgroup", "ag", "groupadd"],
        "%PREFIX%addgroup <userID> <groupID>",
        `Add a group to a user profile.`,
        ["admin"],
        false,
        "info",
        async (msg, cl) => {
            // Add a user to a group (admin only)
            const userID = msg.argv[1];
            const groupID = msg.argv[2];

            try {
                await CosmicData.addGroup(userID, groupID);
                const user = await CosmicData.getGroups(userID);
                return `Successfully added \`${user._id}\` to group \`${groupID}\``;
            } catch (err) {
                return `Unable to add user to group.`;
            }
        }
    )
);
