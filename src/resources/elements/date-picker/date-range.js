/**
 Copyright 2022 Jason Drake

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
import {inject, bindable, customElement} from 'aurelia-framework';
import {BaseFormElement} from "../base-form-element";

@customElement('date-range')
@inject(Element)
export class DateRange extends BaseFormElement {

    @bindable startDate;
    @bindable endDate;

    constructor(element) {
        super(element);
        this.propagateChildId = false;
    }

    getInputSelector() {
        return '.date-range-wrapper > date-picker';
    }

}
