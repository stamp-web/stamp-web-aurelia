import {build} from 'aurelia-cli';
import gulp from 'gulp';
import project from '../aurelia.json';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

export default function processMarkup() {
  return gulp.src(project.markupProcessor.source, {sourcemaps: true, since: gulp.lastRun(processMarkup)})
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          ignoreCustomFragments: [/\${.*?}/g] // ignore interpolation expressions
      }))
      .pipe(build.bundle());
}
