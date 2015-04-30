import {valueConverter} from 'aurelia-framework';

@valueConverter("stampCount")
export class stampCountValueConverter {

  toView(value) {
    return ( value && +value > 0 ) ? value + ' stamp' + ((+value > 1) ? 's' : '') : '' ;
  }
}
