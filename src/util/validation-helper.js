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
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

export var ValidationHelper = {
    _currencyEvaluate: value => {
        return (_.isEmpty(value)) || (new RegExp(/^\d*(\.\d{0,2})?$/).test(value));
    },

    defineCurrencyValueRule: (ValidationRules, name) => {
        ValidationRules.customRule(name, (value, obj) => {
            return this._currencyEvaluate(value);
        });
    },

    defineNumericRangeRule: (ValidationRules, name, min, max) => {
        ValidationRules.customRule(name, (value, obj) => {
            return value > min && value < (max || Number.MAX_VALUE);
        });
    },

    defineIdSelection: (ValidationRules, name) => {
        ValidationRules.customRule(name, (value,obj) => {
            return value && value > 0;
        })
    }
};

export class ValidationEventHandler extends EventAggregator {

    constructor(controller) {
        super();
        this.controller = controller;
    }
    render(instruction) {
        let msg = {
            valid: this.controller ? this.controller.errors.length === 0 : true
        };
        if( !msg.valid ) {
            msg.error = _.first(this.controller.errors)  // in case we want it (footer messaging etc)
        };
        this.publish('validation-status',msg);
    }
}
