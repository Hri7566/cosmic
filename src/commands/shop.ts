import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../data";
import { CosmicShop } from "../shop/CosmicShop";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "shop",
        ["shop", "s"],
        "%PREFIX%shop",
        "Show items in the shop.",
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            let emoji = CosmicShop.emoji ? CosmicShop.emoji : "";
            let out = `${emoji} Items:`;
            let shopItems = CosmicShop.getListings();

            if (shopItems.length > 0) {
                for (let ls of shopItems) {
                    out += ` ${ls.item.displayName}: ${CosmicData.formatBalance(
                        CosmicShop.getItemPrice(ls.item.id)
                    )} | `;
                }

                out = CosmicUtil.trimListString(out);
            } else {
                out += ` (none)`;
            }

            return out;
        }
    )
);
