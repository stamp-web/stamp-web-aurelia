var path = require('path');

var appRoot = 'src/';

module.exports = {
	root: appRoot,
	source: appRoot + '**/*.js',
	html: appRoot + '**/*.html',
	style: 'resources/styles/**/*.css',
	less: appRoot + 'components/**/*.less',
	appLess: appRoot + '**/*.less',
	lessOut: 'resources/styles',
	output: 'dist/',
	doc: './doc',
	templates: 'templates',
	e2eSpecsSrc: 'test/e2e/src/*.js',
	e2eSpecsDist: 'test/e2e/dist/'
};
