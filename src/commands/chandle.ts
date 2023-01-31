import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicFFI } from "../foreign/CosmicFFI";

CosmicCommandHandler.registerCommand(new Command(
    'chandle',
    [ 'chandle' ],
    '%PREFIX%chandle',
    undefined,
    [ 'ctester' ],
    false,
    'fun',
    async (msg, cl) => {
        const output = CosmicFFI.clib.handleMessage(msg.argv.length, msg.argv);
        return output;
    }
));
