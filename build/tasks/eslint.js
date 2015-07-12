var gulp = require('gulp');
var eslint = require('gulp-eslint');
var paths = require('../paths');
var path = require('path');

gulp.task('eslint', function () {
	return gulp.src([paths.source])
		// eslint() attaches the lint output to the eslint property of the file object so it can be used by other modules.
		.pipe(eslint({
				configFile: path.join(paths.root, '../conf/.eslintrc')
		}))
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format());
		// To have the process exit with an error code (1) on lint error, return the stream and pipe to failOnError last.
		//.pipe(eslint.failOnError());
});

gulp.task('default', ['eslint'], function () {
	// This will only run if the lint task is successful...
});
