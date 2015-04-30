var gulp = require('gulp');
var replace = require('gulp-replace-task');
var paths = require('../paths');
var themes = require('../theme');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');

gulp.task('replace-theme', function() {
	return gulp.src(paths.templates +'/*')
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
		.pipe(gulp.dest(paths.temp));
});

gulp.task('setup-theme', function (callback) {
	return runSequence(
		'replace-theme',
		'copy-theme',
		['generate-theme'],
		callback
	);
});

gulp.task('copy-theme', function() {

	return gulp.src(paths.temp + "/*.less").pipe(gulp.dest(paths.generated + '/'));
});

gulp.task('generate-theme', function() {
	return gulp.src(paths.temp + "/*.js")
		.pipe(plumber())
		.pipe(changed(paths.output, {extension: '.js'}))
		.pipe(sourcemaps.init())
		.pipe(to5(assign({}, compilerOptions, {modules:'system'})))
		.pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + paths.root }))
		.pipe(gulp.dest(paths.output))
});
