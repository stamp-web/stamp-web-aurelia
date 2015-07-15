import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import 'bootstrap';
import 'resources/styles/bootstrap.css!';
import "resources/styles/styles.css!";

@inject(Router)
export class App {

    configureRouter(config, router) {
        config.title = 'Stamp Web';
        config.map([
            {
                route: 'stamp-list',
                name: 'stamp-list',
                moduleId: './views/stamps/stamp-list',
                nav: true,
                title: 'Stamps'
            },
            {route: 'manage', moduleId: './views/manage/manage-list', nav: true, title: 'Manage'},
            {route: 'settings', moduleId: './views/preferences/user-settings', nav: false, title: 'Settings'}
           // {route: ['', 'welcome'], moduleId: './welcome', nav: true, title: 'Help'}
        ]);
        this.router = router;
    }

}
