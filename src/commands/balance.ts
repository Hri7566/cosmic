import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import type { CosmicClientMPP } from "../MPP/CosmicClientMPP";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "balance",
        ["balance", "bal", "money"],
        "%PREFIX%balance [user_id]",
        `Show a user's balance.`,
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            let _id = msg.sender._id;
            let argcat = msg.argv
                .join(" ")
                .substring(msg.argv[0].length)
                .trim();
            if (msg.argv[1]) {
                if (cl.platform == "mpp") {
                    _id = (cl as CosmicClientMPP).getPart(argcat)._id;
                    if (!_id) _id = argcat;
                } else {
                    _id = argcat;
                }
            }
            try {
                const inventory = await CosmicData.getInventory(_id);
                const user = await CosmicData.getUser(_id);
                if (_id !== msg.sender._id) {
                    return `${CosmicUtil.formatUserString(
                        user
                    )}'s Balance: ${CosmicData.formatBalance(
                        inventory.balance
                    )}`;
                } else {
                    return `Balance: ${CosmicData.formatBalance(
                        inventory.balance
                    )}`;
                }
            } catch (err) {
                return `Unable to find user '${_id}'.`;
            }
        }
    )
);
