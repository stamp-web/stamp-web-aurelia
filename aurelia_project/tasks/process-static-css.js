import gulp from 'gulp';
import less from 'gulp-less';
import cleanCSS from 'gulp-clean-css';
import project from '../aurelia.json';

export function processStaticCSS() {
    return gulp.src(project.staticCSS.source)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest(project.paths.staticCSS));

};

export default processStaticCSS;
