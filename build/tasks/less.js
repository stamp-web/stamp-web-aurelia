var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var paths = require('../paths');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var replace = require('gulp-replace-task');

gulp.task('less', function () {

	return gulp.src(paths.appLess)
		.pipe(replace({
			patterns: [
				{
					match: 'theme',
					replacement: require('../theme').bootstrapTheme
				},
				{
					match: 'pathToTheme',
					replacement: require('../theme').pathToTheme
				}
			]
		}))

		.pipe(sourcemaps.init())
		.pipe(less({
            paths: [
                paths.baseDir,
            ],
            sourceMap: {
				sourceMapRootpath:paths.appLess
			}
		})
            .on('error', function (error) {
                gutil.log(gutil.colors.red(error.message));
                this.emit('end');
            }))

		.pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.lessOut))
        .pipe(concat('stamp-web-min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.lessOut));

});
