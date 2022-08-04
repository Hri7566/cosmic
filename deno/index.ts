import * as child_process from "https://deno.land/x/proc@0.19.6/mod.ts";
import { asynciter } from "https://deno.land/x/asynciter@0.0.12/mod.ts";
import { Question, Answer } from './interop.ts';

// const proc = Deno.run({
//     cmd: [
//         'node', '.'
//     ],
//     stdout: 'piped',
//     stderr: 'piped'
// });

const it = new child_process.PushIterable<Question>();

(async () => {
    // try {
    //   for (let n = 1; n <= 3; n++) {
    //     console.error(`I am asking about ${n}.`);
  
    //     const question: Question = { n };
    //     await it.write(question);
  
    //     await child_process.sleep(1000);
    //   }
    // } finally {
    //   it.close();
    // }
})();

const proc = child_process.runner(
    child_process.stringAsyncIterableUnbufferedInput(),
    child_process.stringAsyncIterableUnbufferedOutput(async stderrLines => {
        for await (const line of stderrLines) {
            console.error(line);
        }
    })
)();

for await ( const answer: Answer of asynciter(
    proc.run({
        cmd: [
            'node', '.'
        ]
    }, asynciter(it).map(JSON.stringify))).map(JSON.parse)) {
    console.log(answer);
}

// const { code } = await proc.status();
// const rawOutput = await proc.output();
// const rawError = await proc.stderrOutput();

// proc.stdin?.write(new TextEncoder().encode("test from deno"));

// await Deno.stdout.write(rawOutput);
// await Deno.stderr.write(rawError);
