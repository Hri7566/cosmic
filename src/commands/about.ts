import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(new Command(
    'about',
    [ 'about', 'a' ],
    `%PREFIX%about`,
    `Get information about the bot.`,
    [ 'default' ],
    true, // visible,
    'info',
    (msg, cl) => {
        let ms = CosmicUtil.getTimeSinceProjectCreation();
        let ss = ms / 1000;
        let mm = ss / 60;
        let hh = mm / 60;
        let dd = hh / 24;
        let isProd = process.env.NODE_ENV == 'production';
        return `${isProd ? '' : '[NON-PRODUCTION BUILD] '}✨ This outer space-themed bot was made by Hri7566#3409. This bot was created ${Math.floor(dd)} days, ${Math.floor(hh % 24)} hours, ${Math.floor(mm % 60)} minutes, and ${Math.floor(ss % 60)} seconds ago. https://cosmic.hri7566.info`;
    }
));
