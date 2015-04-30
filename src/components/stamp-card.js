import {bindable,customElement,inject} from 'aurelia-framework';


@customElement('stamp-card')
@bindable('model')
export class StampCard {

  getCatalogueNumber() {
    var s = "";
    if( this.model ) {
      var activeCN = this.findActiveCatalogueNumber(this.model);
      s = activeCN.number;
    }
    return s;
  }

  findActiveCatalogueNumber() {
    var activeCN = ( this.model.activeCatalogueNumber ) ? this.model.activeCatalogueNumber : undefined;
    if( !activeCN ) {
      for(var i = 0, len = this.model.catalogueNumbers.length; i < len; i++ ) {
        if( this.model.catalogueNumbers[i].active === true ) {
          this.model.activeCatalogueNumber = this.model.catalogueNumbers[i];
          activeCN = this.model.activeCatalogueNumber;
          break;
        }
      }
    }
    return activeCN;
  }

  imageNotFound() {
    return StampCard.prototype.imageNotFoundFn;
  }

  getImagePath() {
    if( this.model && this.model.stampOwnerships && this.model.stampOwnerships.length > 0 ) {
      var path = this.model.stampOwnerships[0].img;
      if( path ) {
        var index = path.lastIndexOf('/');
        path = path.substring(0,index+1) + "thumb-" + path.substring(index+1);
        return "http://drake-server.ddns.net:9001/Thumbnails/" + path;
      }

    }
    return null;
  }
}


StampCard.prototype.imageNotFoundFn = function() {
  this.src = 'resources/images/not-available.png';
};
