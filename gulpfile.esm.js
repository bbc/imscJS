import gulp from "gulp";
const rollup = require('rollup');
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";

//no unit tests or jshint or anything, just piggyback on the grunt ones and assume it'll be run together.

function bundle(debug) {
    const inConfig = {
        input: './src/main/js/main.js',
        format: "es",
        plugins: [
            resolve(),
            commonjs()
        ]
    };

    if (!debug) {
        inConfig.plugins.push(terser());
    }

    const outConfig = {
        format: 'esm',
        file: 'dist/imsc.all.' + (debug ? 'debug' : 'min') + '.mjs'
    };

    return rollup.rollup(inConfig)
        .then(bundle => {
            return bundle.write(outConfig)
        });
};


exports.both = gulp.parallel(bundle.bind(null, true), bundle.bind(null, false));
exports.default = exports.both;

