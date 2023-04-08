import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicShop } from "../shop/CosmicShop";
import { ShopListing, Inventory, AnyItem } from "../util/CosmicTypes";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "buy",
        ["buy"],
        "%PREFIX%buy <item>",
        "Buy an item from the item shop.",
        ["default"], // [ 'default' ],
        false, // true,
        "cake",
        async (msg, cl) => {
            const shopListings = CosmicShop.getListings();
            const search = msg.argv[1];

            if (!search) {
                return `Please type an item name from the item shop.`;
            }

            let listing: ShopListing;

            for (const ls of shopListings) {
                if (
                    ls.item.displayName
                        .toLowerCase()
                        .includes(search.toLowerCase())
                ) {
                    listing = ls;
                }
            }

            if (!listing) {
                let no_listing_answers = [
                    "That item is not in the shop.",
                    `We don't sell '${search}' here.`
                ];

                return CosmicUtil.getRandomValueFromArray(no_listing_answers);
            }

            const balance = await CosmicData.getBalance(msg.sender._id);
            let price = listing.item.value;

            if (listing.overridePrice) {
                price = listing.overridePrice;
            }

            try {
                if (CosmicData.hasItem(msg.sender._id, listing.item.id)) {
                    const inv: Inventory = await CosmicData.getInventory(
                        msg.sender._id
                    );
                    let it: AnyItem;

                    for (const i of inv.items) {
                        if (i.id == listing.item.id) {
                            it = i;
                            break;
                        }
                    }

                    if (it) {
                        if (it.count >= it.max_stack) {
                            return `You can't have any more of ${CosmicUtil.formatItemString(
                                listing.item.displayName,
                                listing.item.emoji,
                                1
                            )}.`;
                        }
                    }
                }

                if (balance < price) {
                    let answers = [
                        `You can't afford ${listing.item.displayName} (x${listing.item.count}).`,
                        `You don't have enough money to buy ${listing.item.displayName} (x${listing.item.count}).`,
                        `You are too poor. Come back again with more for ${listing.item.displayName} (x${listing.item.count}).`,
                        `You bought ${CosmicUtil.formatItemString(
                            listing.item.displayName,
                            listing.item.emoji,
                            listing.item.count
                        )}. Wait, no. You can't afford that.`
                    ];

                    return CosmicUtil.getRandomValueFromArray(answers);
                }

                CosmicData.addItem(msg.sender._id, listing.item);
                CosmicData.addBalance(msg.sender._id, -price);

                return `You bought ${CosmicUtil.formatItemString(
                    listing.item.displayName,
                    listing.item.emoji,
                    listing.item.count
                )} for ${CosmicData.formatBalance(price)} from the shop.`;
            } catch (err) {
                CosmicCommandHandler.logger.error(err);
                CosmicCommandHandler.logger.warn("Transaction error detected");
                return `A serious transaction error has occurred. Whoops :/`;
            }
        }
    )
);
