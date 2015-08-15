import {customElement, bindable} from 'aurelia-framework';

import _ from 'lodash';

import 'resources/styles/components/stamps/stamp-table.css!';

@customElement('stamp-table')
@bindable('stamps')
@bindable('total')
export class StampTable {

    pageSize=2000;

    attached() {
        _.debounce(function(self) {
            self.pageSize = self.pageSize * 10;
        })(this);
    }
    getStamps() {
        console.log("here it is" + this.stamps);
        let self = this;
        return new Promise((resolve) => resolve({
            data: self.stamps,
            count: self.stamps.length
        }));
    }
}
