import { runCLI } from '@jest/core';
import path from 'path';
import { CLIOptions } from 'aurelia-cli';

export default (cb) => {
    let options = {};

    if (CLIOptions.hasFlag('watch')) {
        Object.assign(options, { watchAll: true});
    }

    runCLI(options, [path.resolve(__dirname, '../../')]).then(({ results }) => {
        if (results.numFailedTests || results.numFailedTestSuites) {
            cb('Tests Failed');
        } else {
            cb();
        }
    });
};
