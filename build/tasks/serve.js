var gulp = require('gulp');
var browserSync = require('browser-sync');
var paths = require('../paths');
var express = require('express');

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var app = express();
var http = require('http').Server(app);

var launchServer = function(baseDir, done) {
    var webServices = 'http://localhost:9001/stamp-webservices';
    var port = 9000;

    var router = express.Router();
    app.use('/stamp-webservices', router);
    app.use(express.static(baseDir));

    router.all('/rest/*', function(req, res) {
        proxy.web(req, res, {target: webServices, secure: false});
    });

    proxy.on('error', function(err, req, res) {
        console.log('stamp-webservices proxy error... %s', err);
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Error connecting to stamp-webservices.');
    });

    http.listen(port, function listening() {
        var opts = {
            ui: false,
            proxy: 'localhost:' + port,
            port: port + 5,
            notify: false,
            open: false,
            ghostmode: false,
            reloadDebounce: 15000
        };
        setTimeout(function() {
            browserSync(opts, done);
        }, 1000);
    });
};

gulp.task('serve', ['build'], function(done) {
    console.log("serving stamp-web from " + paths.baseDir);
    launchServer(paths.baseDir, done);
});
