import { CosmicColor } from "../CosmicColor";
import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(
    new Command(
        "color",
        ["color", "c", "colour"],
        `%PREFIX%color [<r> <g> <b> | <hex>]`,
        `Get information about a color or the user's color.`,
        ["default"],
        true, // visible,
        "info",
        (msg, cl) => {
            if (msg.argv[3]) {
                // test for rgb
                try {
                    let rstr = msg.argv[1];
                    let gstr = msg.argv[2];
                    let bstr = msg.argv[3];

                    let r = parseInt(rstr);
                    let g = parseInt(gstr);
                    let b = parseInt(bstr);

                    if (r > 255 || g > 255 || b > 255) throw "too large";
                    if (r < 0 || g < 0 || b < 0) throw "too small";

                    let c = new CosmicColor(r, g, b);
                    let outc = `${c
                        .getName()
                        .replace("A", "a")} [${c.toHexa()}]`;
                    return `The RGB color ${r}, ${g}, ${b} is ${outc}`;
                } catch (e) {
                    return `The color '${msg.argv[1]}, ${msg.argv[2]}, ${msg.argv[3]}' is not a valid RGB color. Reason: ${e}`;
                }
            } else if (msg.argv[1]) {
                if (msg.argv[1].match(/#[0-9a-f]{6}/gi) !== null) {
                    // definitely a hex string
                    let c = new CosmicColor(msg.argv[1]);
                    let outc = `${c
                        .getName()
                        .replace("A", "a")} [${c.toHexa()}]`;
                    return `The hex color '${msg.argv[1]}' is ${outc}`;
                } else {
                    return `I don't think '${msg.argv[1]}' is a hex color.`;
                }
            } else {
                if (msg.sender.color) {
                    let c = new CosmicColor(msg.sender.color);
                    let outc = `${c
                        .getName()
                        .replace("A", "a")} [${c.toHexa()}]`;
                    return `${msg.sender.name}, your color is ${outc}`;
                }
            }
        }
    )
);
