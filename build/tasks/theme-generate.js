var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less-sourcemap');
var paths = require('../paths');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var concat = require('gulp-concat');

gulp.task('theme-generate', function () {

    return gulp.src(path.join(paths.theme, 'bootstrap.less'))
        .pipe(less({
            paths: [
                paths.theme,
                path.join(paths.bootstrap, 'less')
            ],
            sourceMap: {
                sourceMapFileInline: false,
                sourceMapRootpath: '/theme',
                debug: false
            }
        }).on('error', function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        })
    )
        .pipe(gulp.dest(paths.lessOut))
        .pipe(concat('bootstrap-min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.lessOut))

});
