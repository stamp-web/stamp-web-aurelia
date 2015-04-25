import {valueConverter} from 'aurelia-framework';

@valueConverter("rateFilter")
export class rateFilterValueConverter {

  toView(value) {
    return ( !value || value === '-' ) ? '' : value ;
  }
}
