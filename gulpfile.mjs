import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from "gulp";
import {rollup} from 'rollup';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-node-polyfills';
const gzip = require('gulp-gzip');
const pjson = require('./package.json');

//no unit tests or jshint or anything, just piggyback on the grunt ones and assume it'll be run together.

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

function deploy() {
    return gulp.src('dist/**').pipe(gzip({
        append: false,
        gzipOptions: { level: 9 }
    })).pipe(gulp.dest('deploy/imsc/' + pjson.version + '/'));
}

const release = gulp.parallel(bundle.bind(null, true), bundle.bind(null, false));


export {release, deploy};
