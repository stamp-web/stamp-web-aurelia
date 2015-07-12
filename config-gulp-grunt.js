var gulp = require('gulp');
var paths = require('./build/paths');
var path = require('path');

require('gulp-grunt')(gulp, {
    base: paths.bootswatch
});

