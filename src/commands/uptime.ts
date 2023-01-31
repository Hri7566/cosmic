import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";
import { CosmicUtil } from "../util/CosmicUtil";

CosmicCommandHandler.registerCommand(new Command(
    'uptime',
    [ 'uptime', 'u' ],
    '%PREFIX%uptime',
    `Check the uptime of the bot.`,
    [ 'default', 'mod' ],
    false,
    'info',
    async (msg, cl) => {
        const ms = CosmicUtil.getUptime();
        const s = ms / 1000;
        const m = s / 60;
        const h = m / 60;
        
        const hh = Math.floor(h);
        const mm = Math.floor(m) % 60;
        const ss = Math.floor(s) % 60;

        return `Uptime: ${hh}h ${mm}m ${ss}s`;
    }
));
