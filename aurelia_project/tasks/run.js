import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import { createProxyMiddleware as proxy } from 'http-proxy-middleware';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';
import { CLIOptions } from 'aurelia-cli';
import proxySettings from './proxy.json';
import _ from 'lodash';
import Immutable from 'immutable';

function reload(done) {
    browserSync.reload();
    done();
}

let nonTLS = CLIOptions.hasFlag('httpOnly');
let proxyValue = _.get(proxySettings, ((nonTLS) ? 'http' : 'https') + '.stamp-webservices');

var stampWebServicesProxy = proxy('/stamp-webservices', {
    target: proxyValue,
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
            server: Immutable.fromJS({
                baseDir: ['.'],
                middleware: [
                    historyApiFallback(),
                    stampWebServicesProxy,
                    function (req, res, next) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        next();
                    }
                ]
            })
        }, function (err, bs) {
            let urls = bs.options.get('urls').toJS();
            console.log(`Application Available At: ${urls.local}`);
            console.log(`BrowserSync Available At: ${urls.ui}`);
            done();
        });
    }
);

let run;

if (CLIOptions.hasFlag('watch')) {
    run = gulp.series(
        serve,
        done => watch(reload)
    );
} else {
    run = serve;
}

export default run;

