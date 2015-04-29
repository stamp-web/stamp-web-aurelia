var gulp = require('gulp');
var less = require('gulp-less');
var paths = require('../paths');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('less', function () {
	/*   gulp.src(paths.less)
	 .pipe(sourcemaps.init())
	 .pipe(less({
	 paths: [ path.join(__dirname, 'less', 'includes') ]
	 }))
	 .pipe(sourcemaps.write())
	 //   .pipe(concat('components.css'))
	 //    .pipe(minifyCSS())
	 .pipe(gulp.dest('./styles/components'));
	 */
	return gulp.src(paths.appLess)
		.pipe(sourcemaps.init())
		.pipe(less({
			//paths: [path.join(__dirname, 'less', 'includes'),
			//	paths: [ path.join("jspm_packages/github/thomaspark/bootswatch@3.3.4", paths.bootstrapTheme) ]
		}))
		.pipe(sourcemaps.write())
//    .pipe(concat('styles.css'))
//    .pipe(minifyCSS())
		.pipe(gulp.dest(paths.lessOut));

});
