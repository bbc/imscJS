import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from "gulp";
import {rollup} from 'rollup';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-node-polyfills';
import yargs from 'yargs';
import pjson from './package.json' with { type: "json" };
import {rimraf} from 'rimraf';

const gzip = require('gulp-gzip');

//no unit tests or jshint or anything, just piggyback on the grunt ones and assume it'll be run together.

const yargv = yargs(process.argv.slice(2)).parse();

function cleanDeploy() {
    return rimraf("deploy");
}

function bundle(debug) {
    const inConfig = {
        input: './src/main/js/main.js',
        plugins: [
            resolve({browser: true, preferBuiltins: false}),
            commonjs(),
            nodePolyfills()
        ]
    };

    if (!debug) {
        inConfig.plugins.push(terser());
    }

    const outConfig = {
        format: "esm",
        file: 'dist/imsc.all.' + (debug ? 'debug' : 'min') + '.mjs'
    };

    return rollup(inConfig)
        .then(bundle => {
            return bundle.write(outConfig)
        });
};

function moveFiles() {

    const version = (yargv.env === 'int') ? 'int' : pjson.version;

    return gulp.src('dist/**').pipe(gzip({
        append: false,
        gzipOptions: { level: 9 }
    })).pipe(gulp.dest('deploy/imsc/' + version + '/'));

}

const release = gulp.parallel(bundle.bind(null, true), bundle.bind(null, false));

const deploy = gulp.series(cleanDeploy, moveFiles);

export {release, deploy};
