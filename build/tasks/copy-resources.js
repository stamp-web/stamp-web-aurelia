var gulp = require('gulp');
var paths = require('../paths');

gulp.task('copy-resources', function () {
	return gulp.src(paths.resources)
		.pipe(gulp.dest(paths.output + '/resources'));
});
