var gulp = require('gulp');
var bundler = require('aurelia-bundler');

var dependent_libs = [
    'aurelia-framework',
    'aurelia-bootstrapper',
    'aurelia-animator-css',
    'aurelia-history-browser',
    'aurelia-history',
    'aurelia-i18n',
    'aurelia-http-client',
    'aurelia-loader',
    'aurelia-loader-default',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-pal',
    'aurelia-pal-browser',
    'aurelia-path',
    'aurelia-router',
    'aurelia-route-recognizer',
    'aurelia-task-queue',
    'aurelia-templating',
    'aurelia-templating-binding',
    'aurelia-templating-resources',
    'aurelia-templating-router',
    'aurelia-validation',
    'aurelia-dependency-injection',
    'aurelia-binding',
    'aurelia-event-aggregator',
    'aurelia-dialog',
    'bootstrap',
    'bootbox',
    'lodash',
    'jquery'
];

var config = {
    force: true,
    packagePath: '.',
    bundles: {
        "dist/stampweb-libs": {
            includes: dependent_libs,
            options: {
                inject: true,
                minify: true
            }
        }
    }
};

gulp.task('bundle', function() {
    return bundler.bundle(config);
});

gulp.task('unbundle', function() {
    return bundler.unbundle(config);
});
