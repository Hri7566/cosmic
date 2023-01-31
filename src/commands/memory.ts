import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(new Command(
    'memory',
    [ 'memory', 'mem' ],
    '%PREFIX%memory',
    `View memory usage.`,
    [ 'admin', 'mod' ],
    false,
    'info',
    async (msg, cl) => {
        return `Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
    }
));
