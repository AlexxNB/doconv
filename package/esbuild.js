const esbuild = require('esbuild');
const pkg = require('./package.json')
const DEV = process.argv.includes('--dev');


esbuild.build({
    entryPoints: ['src/browser.js'],
    bundle: true,
    outfile: pkg.browser,
    format: 'esm',
    minify: true,
    watch: DEV,
    incremental: DEV
});

esbuild.build({
    entryPoints: ['src/node.js'],
    bundle: true,
    outfile: pkg.module,
    format: 'esm',
    platform: 'node',
    minify: true,
    watch: DEV,
    incremental: DEV,
    external:['form-data', 'multiparty']
});

!DEV && esbuild.build({
    entryPoints: ['src/browser.js'],
    bundle: true,
    outfile: pkg.cdn,
    format: 'iife',
    globalName:'doconv',
    minify: true
});


!DEV && esbuild.build({
    entryPoints: ['src/node.js'],
    bundle: true,
    outfile: pkg.main,
    format: 'cjs',
    platform: 'node',
    minify: true,
    external:['form-data', 'multiparty']
});

