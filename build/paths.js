var path = require('path');

var appRoot = 'src/';
var basePath = path.join(__dirname , '/../');
console.log("paths="+ basePath);
module.exports = {
    baseDir: basePath,
	root: path.join(basePath,appRoot),
	source: path.join(basePath,appRoot + '**/*.js'),
    bootstrap: path.join(basePath, 'node_modules/bootstrap'),
	html: path.join(basePath,appRoot + '**/*.html'),
	style: path.join(basePath,'resources/styles/**/*.css'),
	less: path.join(basePath,appRoot + 'components/**/*.less'),
	appLess: path.join(basePath,appRoot + '**/*.less'),
	lessOut: path.join(basePath,'resources/styles'),
	output: path.join(basePath,'dist/'),
	doc: path.join(basePath,'./doc'),
	resources: path.join(basePath,'resources/**'),
	templates: path.join(basePath,'templates'),
	generated: path.join(basePath,'generated/'),
    theme: path.join(basePath,'theme'),
	temp: path.join(basePath,'temp'),
	e2eSpecsSrc: path.join(basePath,'test/e2e/src/*.js'),
	e2eSpecsDist: path.join(basePath,'test/e2e/dist/')
};
