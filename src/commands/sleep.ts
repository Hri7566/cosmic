import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicExperience } from "../exp/CosmicExperience";

CosmicCommandHandler.registerCommand(
    new Command(
        "sleep",
        ["sleep"],
        "%PREFIX%sleep",
        `sleep`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            return;
            let sleeping = false;

            try {
                sleeping = (await CosmicData.utilGet(
                    "sleeping~" + msg.sender._id
                )) as boolean;
            } catch (err) {}

            if (!sleeping) sleeping = false;
            let out = `${msg.sender.name} woke up on the chromatic ribbon.`;

            if (sleeping == false) {
                out = `${msg.sender.name} went to sleep.`;
            }

            // CosmicCommandHandler.logger.debug("sleeping:", sleeping);

            const res = await CosmicData.utilSet(
                "sleep~" + msg.sender._id,
                !sleeping
            );

            // CosmicCommandHandler.logger.debug("Output of utilSet:", res);

            return out;
        }
    )
);
