var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var paths = require('../paths');
var path = require('path');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var replace = require('gulp-replace-task');
var themes = require('../theme');

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function () {
    return gulp.src([paths.source])
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(replace({
            patterns: [
                {
                    match: 'theme',
                    replacement: themes.bootstrapTheme
                },
                {
                    match: 'pathToTheme',
                    replacement: themes.pathToTheme
                }
            ]
        }))

        .pipe(changed(paths.output, {extension: '.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(to5(assign({}, compilerOptions.system())))
        .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/src'}))
        .pipe(gulp.dest(paths.output))
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
	return runSequence(
		'clean',
		['less', 'theme-generate','build-system', 'build-html','eslint'],
		callback
	);
});
