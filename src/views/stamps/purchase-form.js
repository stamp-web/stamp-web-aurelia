/**
 Copyright 2015 Jason Drake

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
import {DialogController} from 'aurelia-dialog';
import {inject, bindable} from 'aurelia-framework';
import {CurrencyCode} from '../../util/common-models';
import _ from 'lodash';

@inject(DialogController)
@bindable({
    name: 'percentage',
    defaultValue: 0.0
})
@bindable('model')
export class PurchaseForm {

    catalogueTotal = 0.0;
    codes = CurrencyCode.symbols();

    constructor(controller) {
        this.controller = controller;
    }

    priceChanged() {
        if( this.model.price && +this.model.price > 0 && this.catalogueTotal > 0.0 ) {
            this.percentage = ( +this.model.price / this.catalogueTotal );
        } else {
            this.percentage = 0.0;
        }
    }

    activate(model) {
        let self = this;
        self.model = model;
        self.catalogueTotal = 0.0;
        if(self.model && self.model.selectedStamps && self.model.selectedStamps.length > 0 ) {
            _.each( self.model.selectedStamps, function( stamp ) {
                let activeCN = ( stamp.activeCatalogueNumber ) ? stamp.activeCatalogueNumber : undefined;
                if (activeCN) {
                    self.catalogueTotal += activeCN.value;
                } else {
                    console.log("No active number found.");
                }
            });
        }
    }
}
