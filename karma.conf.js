const path = require('path');
const project = require('./aurelia_project/aurelia.json');
const _ = require('lodash');

const karmaConfig = project.unitTestRunner;

let testSrc = [
    { pattern: karmaConfig.source, included: false },
    'test/aurelia-karma.js'
];

let output = project.platform.output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let sourceMaps = [{pattern:'scripts/**/*.js.map', included: false}];
let files = [entryBundle].concat('scripts/dep-bundle.js')
    .concat({pattern: "node_modules/reflect-metadata/Reflect.js", include: true })
    .concat(testSrc)
    .concat(appSrc)
    .concat(sourceMaps);
let transpilerOptions = project.transpiler.options;
transpilerOptions.sourceMap = 'inline';

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: [project.testFramework.id],
        browserNoActivityTimeout: 60000,
        files: files,
        exclude: ['**/*.scss'],
        remapIstanbulReporter:    {
            reports: {
                'text-summary': null,
                json: 'test/coverage/coverage.json',
                lcovonly: 'test/coverage/lcov.info',
                //html: 'test/coverage/mapped'
            }
        },
        junitReporter: {
            outputDir: 'test/junit',
            useBrowserName: false
        },
        preprocessors: {
            [karmaConfig.source]: [project.transpiler.id],
            [appSrc]: ['sourcemap'],
            'scripts/app*.js': ['coverage']
        },
        coverageReporter:    {
            type: 'html',
            dir:  'test/coverage/bundled'
        },
        'babelPreprocessor': { options: transpilerOptions },
        reporters: ['progress', 'coverage',  'junit'/*'karma-remap-istanbul'*/],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            //'Chrome',
            'ChromeHeadless',
            'FirefoxHeadless'
        ],
        customLaunchers: {
            'ChromeHeadless': {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
            },
            'FirefoxHeadless': {
                base: 'Firefox',
                flags: [
                    '-headless'
                ]
            }
        },
        /** **************************************************************************** */

        /*
         * Continuous Integration mode
         * if true, Karma captures browsers, runs the tests and exits
         */
        singleRun: true,
        // client.args must be a array of string.
        // Leave 'aurelia-root', project.paths.root in this order so we can find
        // the root of the aurelia project.
        client: {
            args: ['aurelia-root', project.paths.root]
        }
    });
};
