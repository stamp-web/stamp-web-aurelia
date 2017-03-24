import gulp from 'gulp';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import project from '../aurelia.json';

export function processStaticCSS() {
    return gulp.src(project.staticCSS.source)
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(project.paths.staticCSS));

};

export default processStaticCSS;
