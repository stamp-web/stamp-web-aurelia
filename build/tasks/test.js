var gulp = require('gulp');
var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    var server = new Server({
        configFile: __dirname + '/../../conf/karma.conf.js',
        singleRun: true
    }, function(e) {
        done();
    });
    server.start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    var server = new Server({
        configFile: __dirname + '/../../conf/karma.conf.js',
        singleRun: false
    }, function(e) {
        done();
    });
    server.start();
});
