/**
 Copyright 2022 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Preferences} from 'services/preferences';
import environment from './environment';
import Backend from 'i18next-xhr-backend'
import _ from 'lodash';
import {AppConfig} from "./app-config";

const logger = LogManager.getLogger('stamp-web');

window.requirejs.config({catchError: true, waitSeconds: 30});

if (window.location.href.indexOf('debug=true') >= 0) {
    LogManager.setLevel(LogManager.logLevel.debug);
}

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

async function getLang(aurelia) {
    let httpClient = new HttpClient();
    let eventBus = new EventAggregator();
    let appConfig = aurelia.container.get(AppConfig);
    await appConfig.load(window.location.pathname);
    let prefs = new Preferences(httpClient,eventBus, appConfig);
    return new Promise( (resolve,reject) => {
        if( prefs ) {
            prefs.find({
                $filter: "(category eq 'user') and (name eq 'locale')"
            }).then(result => {
                let lang = 'en';
                if( !_.isEmpty(result) ) {
                    lang = _.first(result.models).value;
                }
                resolve(lang);
            }).catch( e => {
                reject(new Error("Failure querying preferences"));
            });
        } else {
            reject(new Error("Preferences services is not available"));
        }
    });
}

function setRoot(aurelia) {
    logger.info('bootstrapped:' + aurelia.setupAureliaFinished + ", localization:" + aurelia.setupI18NFinished);
    if(aurelia.setupAureliaFinished && aurelia.setupI18NFinished) {
        aurelia.setRoot('app');
    }
}

export async function configure(aurelia) {

    configureGlobalLibraries();
    getLang(aurelia).then(lang => {
        initialize( aurelia, lang );
    }).catch(e => {
        console.log('WARNING: Failure to obtain a language to use for Stamp-Web.  Defaulting to "en"');
        initialize( aurelia, 'en');
    });
}

function configureGlobalLibraries() {
    window.requirejs(['jquery','popper.js','bootstrap'], (jquery, popper, bootstrap) => {
        window.jQuery = jquery;
        window.Popper = popper;
        window.Bootstrap = bootstrap;
    });
}

async function initialize( aurelia, lang ) {

    aurelia.setupAureliaFinished = false;
    aurelia.setupI18NFinished = false;
    await aurelia.use.standardConfiguration()
        .feature('resources')
        //Uncomment the line below to enable animation.
        //if the css animator is enabled, add swap-order="after" to all router-view elements
        // .plugin('aurelia-animator-css')
        //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
        //  .plugin('aurelia-html-import-template-loader')
        .plugin('aurelia-dialog', config => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
        .plugin('aurelia-validation')
        .feature('bootstrap-validation')
        .plugin('aurelia-i18n', (instance) => {
            instance.i18next.use(Backend);
            instance.setup({
                backend: {                                  // <-- configure backend settings
                    loadPath: 'resources/locales/{{lng}}/{{ns}}.json' // <-- XHR settings for where to get the files from
                },
                lng: lang,
                attributes: ['t', 'i18n'],
                fallbackLng: 'en',
                ns: ['stamp-web'/*, 'translation'*/],
                fallbackNS: ['stamp-web'],
                defaultNS: 'stamp-web',
                debug: false // make true to see un-translated keys
            }).then( () => {
                aurelia.setupI18NFinished = true;
                setRoot(aurelia);
            });
        });

    aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then( () => {
        aurelia.setupAureliaFinished = true;
        setRoot(aurelia);
    });

}
