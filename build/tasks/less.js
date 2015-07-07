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
    gulp.src(paths.bootswatch + require('../theme').bootstrapTheme + '/*.css')
        .pipe(gulp.dest(paths.lessOut));

	var lessErrorHandler = function(err) {
		gutil.log('### FAILURE in .less file');
		gutil.log(err.message);
		this.emit('end');
	}

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
			sourceMap: {
				sourceMapRootpath: paths.appLess
			}
		}).on('error', lessErrorHandler))
		.pipe(sourcemaps.write())
//    .pipe(concat('styles.css'))
//    .pipe(minifyCSS())
		.pipe(gulp.dest(paths.lessOut));

});
