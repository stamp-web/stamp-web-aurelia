import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
//import {ValidateCustomAttributeViewStrategy} from 'aurelia-validation';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.info);

if (window.location.href.indexOf('debug=true') >= 0) {
    LogManager.setLevel(LogManager.logLevel.debug);
}

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        // .developmentLogging()
        .plugin('./global-resources/index')
        .plugin('aurelia-validation', (config) => {
            config.useDebounceTimeout(250);
         //   config.useViewStrategy(ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput);
        });

    aurelia.start().then(a => a.setRoot());
}
