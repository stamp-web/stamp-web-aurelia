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
import {I18N} from 'aurelia-i18n';
import {Router} from 'aurelia-router';

import 'bootstrap';

const logger = LogManager.getLogger('stamp-web');

export class App {

    static inject() {
        return [Router, I18N];
    }

    constructor(router, i18n) {
        this.i18n = i18n;
    }

    configureRouter(config, router) {
        config.title = 'Stamp Web Editor';
        config.map([
            {
                route: ['', 'stamp-list'],
                name: 'stamp-list',
                moduleId: './views/stamps/stamp-list',
                nav: true,
                title: this.i18n.tr('nav.stamps')
            },
            {route: 'manage', moduleId: './views/manage/manage-list', nav: true, title: this.i18n.tr('nav.manage')},
            {route: 'settings', moduleId: './views/preferences/user-settings', nav: false, title: 'Settings'},
            {route: 'upgrade', name: 'upgrade', moduleId: './views/catalogues/catalogue-upgrade', nav: true, title: this.i18n.tr('nav.upgrade')}
        ]);
        this.router = router;
    }

    activate() {
        logger.info("Application is activated");
    }
}
