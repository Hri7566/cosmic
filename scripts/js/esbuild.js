const path = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');

require('esbuild').build({
    entryPoints: [path.resolve(__dirname, '../../esbuild/index.jsx')],
    bundle: true,
    outdir: 'frontend/build/',
    plugins: [ sassPlugin() ],
    external: [
        '/assets/*'
    ]
}).catch(() => process.exit(1));
