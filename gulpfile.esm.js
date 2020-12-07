import gulp from "gulp";
const rollup = require('rollup');
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-node-polyfills';

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

    return rollup.rollup(inConfig)
        .then(bundle => {
            return bundle.write(outConfig)
        });
};


exports.both = gulp.parallel(bundle.bind(null, true), bundle.bind(null, false));
exports.default = exports.both;

