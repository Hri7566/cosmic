import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(new Command(
    'michael',
    [ 'michael' ],
    '%PREFIX%michael',
    `https://youtube.com/michaelreeves`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        return `die forever bastard i hate you`
    }
));
