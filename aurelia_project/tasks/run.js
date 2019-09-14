import gulp from 'gulp';
import browserSync from 'browser-sync'
import historyApiFallback from 'connect-history-api-fallback/lib';
import proxy from 'http-proxy-middleware';
import project from '../aurelia.json';
import build from './build';
import {CLIOptions} from 'aurelia-cli';
import proxySettings from './proxy.json';
import processCSS from './process-css';

function onChange(path) {
    console.log(`File Changed: ${path}`);
}

function reload(done) {
    browserSync.reload();
    done();
}

var stampWebServicesProxy = proxy('/stamp-webservices', {
    target: proxySettings['stamp-webservices'],
    changeOrigin: true,
    logLevel: 'debug',
    secure: false
});

let serve = gulp.series(
    build,
    done => {
        browserSync({
            online: false,
            open: false,
            port: 9000,
            logLevel: 'silent',
            server: {
                baseDir: ['.'],
                middleware: [
                    historyApiFallback(),
                    stampWebServicesProxy,
                    function (req, res, next) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        next();
                    }
                ]
            }
        }, function (err, bs) {
            let urls = bs.options.get('urls').toJS();
            console.log(`Application Available At: ${urls.local}`);
            console.log(`BrowserSync Available At: ${urls.ui}`);
            done();
        });
    }
);

let refresh = gulp.series(
    build,
    reload
);

let refreshCSS = gulp.series(
    build,
    reload
);

let watch = function () {
    gulp.watch(project.transpiler.source, refresh).on('change', onChange);
    gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
    gulp.watch(project.cssProcessor.source, refreshCSS).on('change', onChange)
}

let run;

if (CLIOptions.hasFlag('watch')) {
    run = gulp.series(
        serve,
        watch
    );
} else {
    run = serve;
}

export default run;
