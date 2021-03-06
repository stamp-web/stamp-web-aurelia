import {Server as Karma} from 'karma';
import {CLIOptions} from 'aurelia-cli';
import {gulp} from 'gulp';
import {mocha} from 'gulp-mocha';

export function unit(done) {
    let browsers = CLIOptions.hasFlag('browsers') ? [CLIOptions.getFlagValue('browsers')] : ['ChromeHeadless', 'FirefoxHeadless'];
    new Karma({
        configFile: __dirname + '/../../karma.conf.js',
        browsers:   browsers,
        singleRun:  !CLIOptions.hasFlag('watch')
    }, done).start();
}

export function selenium(done) {
    gulp.task('default', () => {
            gulp.src(__dirname + '/../../test/selenium/**/*-test.js', {read: false})
            // gulp-mocha needs filepaths so you can't have any plugins before it 
                .pipe(mocha({reporter: 'nyan'}));
            done();
        });
}

export default unit
