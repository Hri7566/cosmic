import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { ITEMS } from "../CosmicItems";
import { Item } from "../util/CosmicTypes";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(new Command(
    'description',
    [ 'description', 'desc', 'itemdescription' ],
    '%PREFIX%description <item>',
    `Get the description of an item.`,
    [ 'default' ],
    true,
    'cake',
    async (msg, cl) => {
        if (!msg.argv[1]) return 'Type the name of an item to get a description.';
        
        let i: Item;
        for (let it of Object.values(ITEMS)) {
            if (msg.argv[1] == it.id || it.displayName.toLowerCase().includes(msg.argv[1].toLowerCase())) {
                i = it;
                break;
            }
        }

        if (i) {
            return `Name: ${CosmicUtil.formatItemString(i.displayName, i.emoji, i.count)} | Description: ${i.description ? i.description : 'No description.'}${i.value ? ` | Value: ${i.value}` : ''}`
        } else {
            return `Item '${msg.argv[1]}' not found.`;
        }
    }
));
