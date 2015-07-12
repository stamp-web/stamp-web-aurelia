var gulp = require('gulp');
var paths = require('../paths');
var path = require('path');
var runSequence = require('run-sequence');
var themeConfig = require('../theme');
require('../../config-gulp-grunt');

gulp.task('theme-prepare', function() {
    return gulp.src(paths.theme + '/*.less')
        .pipe(gulp.dest(paths.bootswatch + '/' + themeConfig.bootstrapTheme));
});

gulp.task('theme-copy', function() {
    return gulp.src(paths.bootswatch + '/' + themeConfig.bootstrapTheme + '/*.css')
        .pipe(gulp.dest(paths.lessOut));
});

gulp.task('theme-generate', function () {
    return runSequence(
        'theme-prepare',
        'grunt-swatch:custom',
        'theme-copy'
    );


});
