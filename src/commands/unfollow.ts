import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(new Command(
    'unfollow',
    [ 'unfollow', 'uf', 'unf', 'un' ],
    '%PREFIX%unfollow',
    `Stop the cursor from following somebody.`,
    [ 'default' ],
    true,
    'fun',
    async (msg, cl) => {
        if (!cl.cursor.follow) {
            return `The cursor is not following anybody.`;
        }

        cl.cursor.follow = undefined;
        cl.cursor.scale = 10;
        cl.cursor.speed = 1;

        return `Stopped following.`;
    },
    'mpp'
));
