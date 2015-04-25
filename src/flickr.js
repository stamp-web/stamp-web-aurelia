import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {Stamps} from 'services/stamps';

@inject(HttpClient, Stamps)
export class Flickr{
  heading = 'Flickr';
  images = [];
  url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json';

  constructor(http, stamps){
    this.http = http;
    this.stampService = stamps;

        this.stampService.find();
  }

  activate(){
    return this.http.jsonp(this.url).then(response => {
      this.images = response.content.items;
    });
  }

  canDeactivate(){
    return confirm('Are you sure you want to leave?');
  }
}
