/**
 Copyright 2016 Jason Drake

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
import environment from './environment';
import Backend from 'i18next-xhr-backend'

const logger = LogManager.getLogger('stamp-web');

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

function setRoot(aurelia) {
    logger.info('bootstrapped:' + aurelia.setupAureliaFinished + ", localization:" + aurelia.setupI18NFinished);
    if(aurelia.setupAureliaFinished && aurelia.setupI18NFinished) {
        aurelia.setRoot('app');
    }
}

export function configure(aurelia) {
    aurelia.setupAureliaFinished = false;
    aurelia.setupI18NFinished = false;

    aurelia.use
        .standardConfiguration()
        .feature('resources')
   /*     .plugin('aurelia-ui-virtualization')

        .plugin('aurelia-html-import-template-loader')

        */
        .plugin('aurelia-dialog', config => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
        .plugin('aurelia-validation')
        .plugin('aurelia-validatejs')
        .feature('bootstrap-validation')
        .plugin('aurelia-i18n', (instance) => {
            instance.i18next.use(Backend);

            // adapt options to your needs (see http://i18next.com/docs/options/)
            instance.setup({
                backend: {                                  // <-- configure backend settings
                    loadPath: 'resources/locales/{{lng}}/{{ns}}.json' // <-- XHR settings for where to get the files from
                },
                lng: 'en',
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
    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then( () => {
        aurelia.setupAureliaFinished = true;
        setRoot(aurelia);
    });

}
