import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

@inject(Router)
export class App {
  constructor(router) {
    this.router = router;
    this.router.configure(config => {
      config.title = 'Stamp Web';
      config.map([
        { route: ['','welcome'],  moduleId: './welcome',      nav: true, title:'Welcome' },
     //   { route: 'flickr',        moduleId: './flickr',       nav: true },
     //   { route: 'child-router',  moduleId: './child-router', nav: true, title:'Child Router' },
        { route: 'stamp-grid',  moduleId: './stamp-grid', nav: true, title:'Stamps' }
      ]);
    });
  }
}
