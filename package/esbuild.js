const esbuild = require('esbuild');
const pkg = require('./package.json');

esbuild.build({
    entryPoints: ['src/browser.js'],
    bundle: true,
    outfile: pkg.browser,
    format: 'iife',
    globalName:'doconvert',
    minify: true
});

esbuild.build({
    entryPoints: ['src/module.js'],
    bundle: true,
    outfile: pkg.module,
    format: 'esm',
    minify: true
});

esbuild.build({
    entryPoints: ['src/module.js'],
    bundle: true,
    outfile: pkg.main,
    format: 'cjs',
    minify: true
});