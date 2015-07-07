var aurelia = require('aurelia-cli');

aurelia.command('bundle', {
    js: {
        app: {
            modules: [
                'stamp-web-aurelia/*',
            ],
            options: {
                inject: true
            }
        },
        'aurelia-bundle': {
            modules: [
                'aurelia-bootstrapper',
                'aurelia-router',
                'aurelia-http-client'
            ],
            options: {
                inject: false
            }
        }
    },
    template: {
        app: {
            pattern: 'dist/*.html',
            options: {
                inject: true
            }
        }
    }
});
