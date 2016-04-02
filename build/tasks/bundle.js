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
    'aurelia-dialog/resources/*.html!text',
    'aurelia-dialog',
    'aurelia-dialog/dialog.css!text',
    'i18next-xhr-backend'
];

var coreUi = [
    'bootstrap',
    'bootbox',
    'moment',
    'nprogress',
    'lodash',
    'jquery'
];

var stampWebSettings = [
    'resources/styles/views/preferences/*.css!text',
    'views/preferences/*.html!text',
    'views/preferences/*.js'
];

var stampWebCommon =  [
    'value-converters/**/*.js',
    'util/**/*.js',
    'events/**/*.js',
    'global-resources/**/*.js',
    'services/*.js',
    'resources/styles/components/nav/*.css!text',
    'components/nav/*.html!text',
    'components/nav/*.js',
    'resources/styles/components/loading-indicator.css!text',
    'components/loading-indicator.js',
    'components/editor-dialog.html!text',
    'components/editor-dialog.js'
];

var stampWebManage = [
    'resources/styles/views/manage/*.css!text',
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
    'views/catalogues/*.html!text',
    'views/catalogues/*.js'
];

var stampWebList = [
    'resources/styles/views/stamps/*.css!text',
    'views/stamps/*.html!text',
    'views/stamps/*.js',
    'resources/styles/components/stamps/*.css!text',
    'components/stamps/*.html!text',
    'components/stamps/*.js',
    'resources/styles/components/search/*.css!text',
    'components/search/*.html!text',
    'components/search/*.js',
    'resources/styles/components/catalogue-numbers/*.css!text',
    'components/catalogue-numbers/*.html!text',
    'components/catalogue-numbers/*.js',
    'resources/styles/components/ownerships/*.css!text',
    'components/ownerships/*.html!text',
    'components/ownerships/*.js',
    'resources/styles/components/stamp-card.css!text',
    'components/stamp-card.html!text',
    'components/stamp-card.js',
    'resources/styles/components/stamp-grid.css!text',
    'components/stamp-grid.html!text',
    'components/stamp-grid.js'
];

var stampWebWidgets = [
    'resources/styles/widgets/collapse-panel/*.css!text',
    'widgets/collapse-panel/*.html!text',
    'widgets/collapse-panel/*.js',
    'blueimp/JavaScript-Load-Image',
    'resources/styles/widgets/image-preview/*.css!text',
    'widgets/image-preview/*.html!text',
    'widgets/image-preview/*.js',
    'resources/styles/widgets/paging/*.css!text',
    'widgets/paging/*.html!text',
    'widgets/paging/*.js',
    'select2/select2/css/select2.css!text',
    'select2/select2/js/select2.js',
    'resources/styles/widgets/select-picker/*.css!text',
    'widgets/select-picker/*.html!text',
    'widgets/select-picker/*.js'
];

var datePicker = [
    'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css!text',
    'bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
    'widgets/date-picker/*.html!text',
    'resources/styles/widgets/date-picker/*.css!text',
    'widgets/date-picker/*.js'
];

var stampWebCSS = [
    'resources/styles/styles.css!text',
    'resources/styles/bootstrap.css!text'
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
        "dist/core-framework": {
            includes: dependent_libs,
            excludes: coreJs,
            options: {
                inject: true,
                minify: true,
				sourceMaps: true
            }
        },
        "dist/core-ui": {
            includes: coreUi,
            excludes: dependent_libs,
            options: {
                inject: true,
                minify: true,
                sourceMaps: true
            }
        },
        "dist/stampweb-css-styles": {
            includes: stampWebCSS,
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                cssminopts: {
                    // Supports all options here https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
                }
            }
        },
        "dist/datepicker": {
            includes: datePicker,
            excludes: dependent_libs.concat(coreJs, coreUi,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true
            }
        },
        "dist/stampweb-common": {
            includes: stampWebCommon,
            excludes: dependent_libs.concat(coreJs, coreUi,datePicker,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-manage": {
            includes: stampWebManage,
            excludes: dependent_libs.concat(stampWebCommon,stampWebWidgets,coreJs, coreUi,datePicker,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-widgets": {
            includes: stampWebWidgets,
            excludes: dependent_libs.concat(stampWebCommon,coreJs, coreUi,datePicker,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-settings": {
            includes: stampWebSettings,
            excludes: dependent_libs.concat(stampWebCommon, stampWebWidgets,coreJs, coreUi,datePicker,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
            }
        },
        "dist/stampweb-list": {
            includes: stampWebList,
            excludes: dependent_libs.concat(stampWebCommon,stampWebWidgets,coreJs, coreUi,datePicker,stampWebCSS),
            options: {
                inject: true,
                minify: minifyCode,
                sourceMaps: true,
                htmlminopts: htmlOpts
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
