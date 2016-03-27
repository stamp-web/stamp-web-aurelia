import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {TWBootstrapViewStrategy} from 'aurelia-validation';
import XHR from 'i18next-xhr-backend';


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
            instance.i18next.use(XHR);

            // adapt options to your needs (see http://i18next.com/docs/options/)
            instance.setup({
                backend: {                                  // <-- configure backend settings
                    loadPath: 'locales/{{lng}}/{{ns}}.json' // <-- XHR settings for where to get the files from
                },
                lng: 'en',
                attributes: ['t', 'i18n'],
                fallbackLng: 'en',
                debug: false // make true to see un-translated keys
            });
        })
        .plugin('aurelia-dialog', config => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
        .plugin('aurelia-html-import-template-loader')
        .plugin('aurelia-validation', (config) => {
            config.useDebounceTimeout(250);
            config.useViewStrategy(TWBootstrapViewStrategy.AppendToInput);
        });

    aurelia.start().then(a => a.setRoot('app', document.body));

}

