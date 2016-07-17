import gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import {processStaticCSS} from './process-static-css';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';

export default gulp.series(
    readProjectConfiguration,
    gulp.parallel(
        transpile,
        processMarkup,
        processCSS,
        processStaticCSS
    ),
    writeBundles
);

function readProjectConfiguration() {
    return build.src(project);
}

function writeBundles() {
    return build.dest();
}
