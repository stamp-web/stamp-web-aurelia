import {LogManager/* hack fix #178*/, ObserverLocator} from 'aurelia-framework';
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

    /* hack fix #178 */
    if (Object.observe) {
        let obj = {
            x: ''
        };
        aurelia.container.get(ObserverLocator).getObserver(obj, 'x');

        console.log(obj.__observer__.__proto__.handleChanges = handleChanges);
        console.log(obj.__observer__.__proto__.unsubscribe = unsubscribe);

    }
    aurelia.start().then(a => a.setRoot('app', document.body));

}


/* hack fix #178 */
var temp = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

export function invokeCallbacks(callbacks, newValue, oldValue) {
    var length, i = length = callbacks.length
    while (i--) {
        temp[i] = callbacks[i];
    }
    for (i = 0; i < length; i++) {
        temp[i](newValue, oldValue);
        temp[i] = null;
    }
}

function unsubscribe(propertyName, callback) {
    var callbacks = this.callbacks[propertyName];
    if( !callbacks || callbacks.length === 0) {
        console.log("property " + propertyName + " had no callbacks, count is " + this.callbackCount);
        try {
            Object.unobserve(this.obj, this.handler);
        } catch (_) {}
        this.callbackCount = 0;
        return;
    }
    var index = callbacks.indexOf(callback);
    if (index === -1) {
        return;
    }

    callbacks.splice(index, 1);
    if (callbacks.length === 0) {
        callbacks.oldValue = null;
        this.callbacks[propertyName] = null;
    }

    this.callbackCount--;
    if (this.callbackCount === 0) {
        try {
            Object.unobserve(this.obj, this.handler);
        } catch (_) {}
    }
};

function handleChanges(changes) {
    var properties = {}, i, ii, change, propertyName, oldValue, newValue, callbacks;
    for (i = 0, ii = changes.length; i < ii; i++) {
        change = changes[i];
        properties[change.name] = change;
    }

    for (name in properties) {
        callbacks = this.callbacks[name];
        if (!callbacks) {
            continue;
        }
        change = properties[name];
        newValue = change.object[name];
        oldValue = change.oldValue;

        invokeCallbacks(callbacks, newValue, oldValue);
    }
}

