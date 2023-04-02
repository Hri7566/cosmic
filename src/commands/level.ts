import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { CosmicExperience } from "../exp/CosmicExperience";

CosmicCommandHandler.registerCommand(
    new Command(
        "level",
        ["level"],
        "%PREFIX%level",
        `Get your current EXP level.`,
        ["default"],
        false,
        "fun",
        async (msg, cl) => {
            let exp = await CosmicData.getExperience(msg.sender._id);
            // try {
            //     exp = parseInt(msg.argv[1]);
            // } catch (err) { exp = 0; }

            let level = CosmicExperience.getLevelFromExperience(exp);
            let index = CosmicExperience.levels.indexOf(level);
            let nextLevel = CosmicExperience.levels[index + 1];

            return `EXP: ${exp} | Current Level: ${
                level.displayName
            } [${CosmicExperience.levels.indexOf(level)}]${
                nextLevel
                    ? ` | Next Level: ${
                          nextLevel.displayName
                      } [${CosmicExperience.levels.indexOf(nextLevel)}]`
                    : ""
            }`;
        }
    )
);
