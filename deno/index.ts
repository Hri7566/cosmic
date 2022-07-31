const proc = Deno.run({
    cmd: [
        'node', '.'
    ],
    stdout: 'piped',
    stderr: 'piped'
});

const { code } = await proc.status();
const rawOutput = await proc.output();
const rawError = await proc.stderrOutput();

await Deno.stdout.write(rawOutput);
await Deno.stderr.write(rawError);
