import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import project from '../aurelia.json';
import path from 'path';
import {build} from 'aurelia-cli';

export default function processCSS() {

    let bootstrap = path.join(process.cwd(), 'node_modules', 'bootstrap', 'scss');
    let theme = path.join(process.cwd(), 'src', 'theme');

    return gulp.src(project.cssProcessor.source)
        .pipe(changedInPlace({firstPass:true}))
        //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                bootstrap,
                theme
            ]
        }).on('error', sass.logError))
        .pipe(build.bundle());
}
