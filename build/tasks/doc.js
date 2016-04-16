var gulp = require('gulp');
var paths = require('../paths');
var path = require('path');

gulp.task('doc', () => {
    gulp.src(paths.root).pipe(require("gulp-esdoc")({
        index: path.join(paths.doc, 'api/index.md'),
        destination: path.join(paths.doc, 'api'),
        plugins: [
            {
                name: 'esdoc-es7-plugin'
            }
        ]
    }));
});

