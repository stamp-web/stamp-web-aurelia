import {bindable, customElement} from 'aurelia-framework';

import 'resources/styles/components/stamp-grid.css!';

@customElement('stamp-grid')
@bindable('stamps')
@bindable('editId')
@bindable('lastSelected')
@bindable('showCatalogueNumbers')
export class StampGrid {

}
