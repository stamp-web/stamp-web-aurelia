import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../event-names';

import 'resources/styles/components/stamp-grid.css!';

@customElement('stamp-grid')
@bindable('stamps')
@bindable('editId')
export class StampGrid {

}
