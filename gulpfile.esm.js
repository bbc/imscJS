import gulp from "gulp";
const rollup = require('rollup');
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-node-polyfills';

//no unit tests or jshint or anything, just piggyback on the grunt ones and assume it'll be run together.

// Split the code between a webworker that will do fromXML, and a nonwebworker that will generateISD and renderHTML.
function webworker(debug) {
    const plugins = [
        resolve({browser: true, preferBuiltins: false}),
        commonjs(),
        nodePolyfills()
    ];

    if (!debug) {
        plugins.push(terser());
    }

    const webworkerInConfig = {
        input: './src/main/js/webworker.js',
        plugins
    };

    const nonworkerInConfig = {
        input: './src/main/js/non-worker.js',    
        plugins
    };

    const webworkerOutConfig = {
        format: "iife",
        file: 'dist/imsc.webworker.' + (debug ? 'debug' : 'min') + '.js'
    };

    const nonworkerOutConfig = {
        format: "esm",
        file: 'dist/imsc.nonworker.' + (debug ? 'debug' : 'min') + '.mjs'
    }

    return Promise.all([write(webworkerInConfig, webworkerOutConfig), write(nonworkerInConfig, nonworkerOutConfig)]);
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

    return write(inConfig, outConfig);
};


function write(inConfig, outConfig) {
    return rollup.rollup(inConfig)
        .then(bundle => {
            return bundle.write(outConfig)
        });
}

exports.webworker = gulp.parallel(webworker.bind(null, true, true), webworker.bind(null, false, true));
exports.both = gulp.parallel(bundle.bind(null, true), bundle.bind(null, false));
exports.default = exports.both;

