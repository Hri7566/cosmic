const path = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');
const { writeFileSync, readFileSync } = require('fs');

const inPath = path.resolve(__dirname, '../../userscript/index.tsx');
const outPath = path.resolve(__dirname, '../../build/userscript/cosmic.user.js');
const userscriptHeaderPath = path.resolve(__dirname, '../../config/userscript-header.js');

require('esbuild').build({
    entryPoints: [ inPath ],
    bundle: true,
    outfile: outPath,
    plugins: [ sassPlugin() ],
    minify: false,
    legalComments: 'inline'
}).catch(() => process.exit(1)).then(() => {
    console.log(`Patching userscript header...`);

    let header = readFileSync(userscriptHeaderPath, { encoding: 'utf-8' });
    let orig = readFileSync(outPath, { encoding: 'utf-8' });

    writeFileSync(outPath, header + '\n' + orig);

    console.log(`Patching complete.`);
});
