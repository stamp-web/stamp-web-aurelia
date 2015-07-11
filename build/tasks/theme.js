var gulp = require('gulp');
var paths = require('../paths');
var path = require('path');
var runSequence = require('run-sequence');
var themeConfig = require('../theme');

require('gulp-grunt')(gulp, {
    base: path.join(__dirname, '../../' + paths.bootswatch)
});

gulp.task('theme-prepare', function() {
    console.log(__dirname);
    console.log(themeConfig.bootstrapTheme);
    console.log(path.join(__dirname, '../../' + paths.bootswatch + '/' + themeConfig.bootstrapTheme));
    return gulp.src(path.join(__dirname, '../../' + paths.theme + '/*.less'))
        .pipe(gulp.dest(path.join(__dirname, '../../' + paths.bootswatch + '/' + themeConfig.bootstrapTheme)));
});

gulp.task('theme-copy', function() {
    return gulp.src(path.join(__dirname, '../../' + paths.bootswatch + '/' + themeConfig.bootstrapTheme + '/*.css'))
        .pipe(gulp.dest(path.join(__dirname, '../../' + paths.lessOut)));
});

gulp.task('theme-generate', function () {
    return runSequence(
        'theme-prepare',
        'grunt-swatch:custom',
        'theme-copy'
    );


});
