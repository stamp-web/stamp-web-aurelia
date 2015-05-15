import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';
import "theme";
import "resources/styles/styles.css!";

@inject(Router)
export class App {
	constructor(router) {
		this.router = router;
		this.router.configure(config => {
			config.title = 'Stamp Web';
			config.map([

				{route: 'stamp-list', moduleId: './views/stamp-list', nav: true, title: 'Stamps'},
				{route: 'manage', moduleId: './views/manage-list', nav: true, title: 'Manage'},
				{route: ['', 'welcome'], moduleId: './welcome', nav: true, title: 'Help'}
			]);
		});
	}
}
