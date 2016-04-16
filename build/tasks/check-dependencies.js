var gulp = require('gulp');
var checkDeps = require('check-dependencies');


gulp.task( 'check-dependencies', function(callback) {
    checkDeps( {
        verbose: true
    }, function() {
        callback();
    });
});
