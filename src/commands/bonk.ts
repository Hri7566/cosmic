import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicData } from "../CosmicData";
import { ITEMS } from "../CosmicItems";

CosmicCommandHandler.registerCommand(new Command(
    'bonk',
    [ 'bonk' ],
    '%PREFIX%bonk <user>',
    undefined,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        let user = await CosmicData.getUser(msg.sender._id);
        
        if (!(await CosmicData.hasItem(user._id, ITEMS.HAMMER.id))) {
            return `You have no hammer.`;
        }

        let p = cl.getPart(msg.argv[1]);
        
        if (p) {
            return `${msg.sender.name} bonks ${p.name} on the head with a hammer.`;
        } else {
            return `User '${msg.argv[1]}' not found.`;
        }
    },
    'mpp'
));
