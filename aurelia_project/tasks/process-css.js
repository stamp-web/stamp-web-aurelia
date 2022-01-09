import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import project from '../aurelia.json';
import path from 'path';
import {build} from 'aurelia-cli';

export default function processCSS() {

    let theme = path.join(process.cwd(), 'src', 'theme');
    let bootstrap = path.join(process.cwd(), 'node_modules', 'bootstrap', 'scss');

    return gulp.src(project.cssProcessor.source, {sourcemaps: true})
        .pipe(sass({
            includePaths: [
                theme,
                bootstrap
            ]
        }).on('error', sass.logError))
        .pipe(build.bundle());
}
