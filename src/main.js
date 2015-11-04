import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {TWBootstrapViewStrategy} from 'aurelia-validation';


LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.info);

if (window.location.href.indexOf('debug=true') >= 0) {
    LogManager.setLevel(LogManager.logLevel.debug);
}

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        //.developmentLogging()
        .feature('global-resources')
        .plugin('aurelia-i18n', (instance) => {
            instance.setup({
                resGetPath: 'locale/__lng__/__ns__.json',
                lng: 'en',
                attributes: ['t', 'i18n'],
                getAsync: true,
                sendMissing: false,
                fallbackLng: 'en',
                debug: true
            });
        })
        .plugin('aurelia-dialog')
        .plugin('aurelia-validation', (config) => {
            config.useDebounceTimeout(250);
            config.useViewStrategy(TWBootstrapViewStrategy.AppendToInput);
        });

    aurelia.start().then(a => a.setRoot('app', document.body));

}

