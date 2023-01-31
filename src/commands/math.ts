import { evaluate } from "mathjs";
import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

CosmicCommandHandler.registerCommand(new Command(
    'math',
    [ 'math' ],
    '%PREFIX%math',
    `Evaluate a mathematical expression.`,
    [ 'default' ],
    true,
    'fun',
    async (msg, cl) => {
        if (!msg.argv[1]) return `Please submit an expression to evaluate.`;

        let out: string;

        try {
            let expr = msg.argv.join(' ').substring(msg.argv[0].length).trim();
            out = evaluate(expr);
        } catch(err) {
            out = err;
        }

        out = out.toString();
        
        return out.split('\n').join(' ');
    }
));
