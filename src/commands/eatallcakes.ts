import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicCakeFactory } from "../cakes/CosmicCakeFactory";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(
    new Command(
        "eatallcakes",
        ["eatallcakes", "eatall", "eac", "ea"],
        "%PREFIX%eatallcakes",
        `Consume all cakes in the user's inventory.`,
        ["default"],
        true,
        "cake",
        async (msg, cl) => {
            const inv = await CosmicData.getInventory(msg.sender._id);
            let total = 0;

            let has_cakes =
                typeof inv.items.find(
                    it =>
                        it.id.startsWith("cake") || it.id.startsWith("cupcake")
                ) !== "undefined";

            if (!has_cakes) {
                const sad_answers = [
                    `You are sad because you have no cake.`,
                    `There is no cake in your inventory.`,
                    `Cake is missing from your inventory.`,
                    `Cake is something you don't have.`,
                    `Where is your cake?`,
                    `What happened to your cake?`,
                    `Did you forget to bake?`,
                    `From the looks of things, cake is 0.`,
                    `Cake? What cake?`,
                    `Cake?`,
                    `What cake?`,
                    `There is no cake for you to eat.`,
                    `No cake.`
                ];
                return await CosmicUtil.getRandomValueFromArray(sad_answers);
            }

            for (let it of inv.items) {
                if (it.id.startsWith("cake") || it.id.startsWith("cupcake")) {
                    total +=
                        it.count *
                        (it.value || CosmicCakeFactory.DEFAULT_CAKE_VALUE);
                    await CosmicData.removeItem(msg.sender._id, it.id);
                }
            }

            await CosmicData.addBalance(msg.sender._id, total);

            let randomMessages = [
                `You ate all of your cake and gained `,
                `You consumed your cake and it became `,
                `Your stomach turned your cake into `,
                `You fed yourself and your stomach returned `,
                `You ate cake and got `,
                `Your cake gave you `,
                `The cake you ate entered your stomach and came out as `,
                `Your mouth ate the cake and now you have `,
                `Your digestive system sends you `,
                `Cake = `,
                `The cake became `,
                `As you eat, your cake turns into `,
                `You didn't actually eat the cake, but it still became `,
                `You love cake and cake loves you. `,
                `Cake becomes `,
                `The cake returns to its original form as `,
                `You ate all of your cake and gained 0 star bits. Just kidding, it was `,
                `Your cake means `,
                `Cakes become `,
                `The cake becomes `,
                `Your cake happens to be worth `,
                `The cake eats you and you get `,
                `There is cake all over your face and you get `,
                `Your cake is `,
                `Cake taste good become `
            ];

            let randomMessage = await CosmicUtil.getRandomValueFromArray(
                randomMessages
            );
            return `${randomMessage}${CosmicData.formatBalance(total)}${
                total > 500 ? " and lots of weight" : ""
            }.`;
        }
    )
);
