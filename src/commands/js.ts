import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(new Command(
    'js',
    [ 'js', 'eval' ],
    '%PREFIX%js <code>',
    `Run JavaScript directly.`,
    [ 'admin' ],
    false,
    'info',
    async (msg, cl) => {
        if (!msg.argv[1]) {
            return `Please type some code to run.`;
        }
        
        try {
            let argcat = msg.argv.join(' ').substring(msg.argv[0].length).trim();
            let out = eval(argcat);
            return `👍 ${out}`;
        } catch (err) {
            return `👎 ${err}`;
        }
    }
));
