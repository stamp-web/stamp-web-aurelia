/**
 Copyright 2016 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {customElement, bindable} from 'aurelia-framework';

// import dataTable from 'datatables'; // eslint-disable-line no-unused-vars

@customElement('stamp-replacement-table')
@bindable( {
    name: 'stamps',
    defaultValue: []
})
export class StampReplacementTable {

    //_dataTable;

    static inject() {
        return [Element];
    }

    constructor(element) {
        this.element = element;
    }

    attached( ) {
        /*this._dataTable = $(this.element).find('table').dataTable({
            data: this.stamps,
            info: false,
            paging: false,
            scrollX: false,
            scrollY: '100%',
            scrollCollapse: true,
            searching: false
        }); */
    }

    detached( ) {
        /*if( this._dataTable) {
            this._dataTable.api().destroy();
        }*/
    }

}
