var gulp = require('gulp');
var bundler = require('aurelia-bundler');

var minifyCode = true;  // bug in v0.1.9 does not allow sourceMaps
var htmlOpts = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true
};

// for options see
// CSS  https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
// HTML https://github.com/kangax/html-minifier#options-quick-reference

var coreJs = [
    'core-js',
    'lodash',
    'css',
    'text'
];

var dependent_libs = [
    'aurelia-framework',
    'aurelia-bootstrapper',
    'aurelia-animator-css',
    'aurelia-history-browser',
    'aurelia-history',
    'aurelia-i18n',
    'aurelia-html-import-template-loader',
    'aurelia-http-client',
    'aurelia-loader',
    'aurelia-loader-default',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-path',
    'aurelia-polyfills',
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
    'aurelia-dialog/resources/*.html!text',
    'bootstrap',
    'bootbox',
	'moment',
	'nprogress',
    'jquery'
];

var stampWebSettings = [
    'views/preferences/*.js',
    'views/preferences/*.html!text'
];

var stampWebCommon =  [
    'value-converters/**/*.js',
    'util/**/*.js',
    'events/**/*.js',
    'global-resources/**/*.js',
    'services/*.js',
    'components/nav/*.js',
    'components/nav/*.html!text',
    'components/loading-indicator.js',
    'components/editor-dialog.js',
    'components/editor-dialog.html!text'
];

var stampWebManage = [
    'views/manage/*.js',
    'views/manage/*.html!text',
    'views/albums/*.js',
    'views/albums/*.html!text',
    'views/countries/*.js',
    'views/countries/*.html!text',
    'views/sellers/*.js',
    'views/sellers/*.html!text',
    'views/stamp-collections/*.js',
    'views/stamp-collections/*.html!text',
    'views/catalogues/*.js',
    'views/catalogues/*.html!text'
];

var stampWebList = [
    'views/stamps/*.js',
    'views/stamps/*.html!text',
    'components/stamps/*.js',
    'components/stamps/*.html!text',
    'components/search/*.js',
    'components/search/*.html!text',
    'components/catalogue-numbers/*.js',
    'components/catalogue-numbers/*.html!text',
    'components/ownerships/*.js',
    'components/ownerships/*.html!text',
    'components/stamp-card.js',
    'components/stamp-card.html!text',
    'components/stamp-grid.js',
    'components/stamp-grid.html!text',
    'components/stamps/*.html!text'
];

var stampWebWidgets = [
    'widgets/collapse-panel/*.html!text',
    'widgets/collapse-panel/*.js',
    'widgets/image-preview/*.html!text',
    'widgets/image-preview/*.js',
    'widgets/paging/*.html!text',
    'widgets/paging/*.js',
    'widgets/select-picker/*.html!text',
    'widgets/select-picker/*.js',
    'widgets/date-picker/*.html!text',
    'widgets/date-picker/*.js',
    'blueimp/JavaScript-Load-Image'
];

var config = {
    force: true,
    configPath: './config.js',
    //packagePath: '.',
    bundles: {
        "dist/core-lib": {
            includes: coreJs,
            options: {
                inject: true,
                minify: true
            }
        },
        "dist/framework-libs": {
            includes: dependent_libs,
            excludes: coreJs,
            options: {
                inject: true,
                minify: true,
				sourceMaps: true
            }
        },
        "dist/stampweb-common": {
            includes: stampWebCommon,
            excludes: dependent_libs.concat(coreJs),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-manage": {
            includes: stampWebManage,
            excludes: dependent_libs.concat(stampWebCommon,stampWebWidgets,coreJs),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-widgets": {
            includes: stampWebWidgets,
            excludes: dependent_libs.concat(stampWebCommon,coreJs),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-settings": {
            includes: stampWebSettings,
            excludes: dependent_libs.concat(stampWebCommon, stampWebWidgets,coreJs),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-list": {
            includes: stampWebList,
            excludes: dependent_libs.concat(stampWebCommon,stampWebWidgets,coreJs),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-css-styles": {
            includes: [
                'resources/css/jquery-ui/jquery-ui.structure.min.css!text',
                'resources/css/jquery-ui/jquery-ui.theme.min.css!text',
                'aurelia-dialog/dialog.css!text',
                'resources/styles/**/*.css!text',
                'resources/styles/styles.css!text',
                'resources/styles/bootstrap.css!text'
            ],
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                cssminopts: {
                    // Supports all options here https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
                }
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
