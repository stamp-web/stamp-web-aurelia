import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import cleanCSS from 'gulp-clean-css';
import project from '../aurelia.json';
import path from 'path';

export function processStaticCSS() {

    let bootstrap = path.join(process.cwd(), 'node_modules', 'bootstrap', 'scss');
    let theme = path.join(process.cwd(), 'src', 'theme');

    return gulp.src(project.staticCSS.source, {sourcemaps: true})
        .pipe(sass({
            includePaths: [
                bootstrap,
                theme
            ]
        }).on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(project.paths.staticCSS));

};

export default processStaticCSS;
