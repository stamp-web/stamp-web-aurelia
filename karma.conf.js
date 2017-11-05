"use strict";
const path = require('path');
const project = require('./aurelia_project/aurelia.json');

let testSrc = [
    {pattern: project.unitTestRunner.source, included: false},
    'test/aurelia-karma.js'
];

let output = project.platform.output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let files = [entryBundle].concat(testSrc).concat(appSrc);

module.exports = function (config) {
    config.set({
        basePath:                 '',
        frameworks:               [project.testFramework.id],
        browserNoActivityTimeout: 60000,
        files:                    files,
        exclude:                  [],
        remapIstanbulReporter:    {
            reports: {
                html: 'test/coverage/mapped'
            }
        },
        preprocessors:            {
            [project.unitTestRunner.source]: [project.transpiler.id],
            'scripts/app-bundle.js':         ['coverage']
        },

        coverageReporter:    {
            type: 'html',
            dir:  'test/coverage/bundled'
        },
        'babelPreprocessor': {options: project.transpiler.options},
        reporters:           ['progress', 'coverage', 'karma-remap-istanbul'],
        port:                9876,
        colors:              true,
        logLevel:            config.LOG_INFO,
        autoWatch:           true,
        browsers:            ['Chrome'],
        singleRun:           false
    });

};
