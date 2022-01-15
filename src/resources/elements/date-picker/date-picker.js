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
import {inject, bindable, bindingMode, customElement} from 'aurelia-framework';
import flatpickr from 'flatpickr';
import _ from 'lodash';
import moment from 'moment';
import $ from "jquery";
import {KeyCodes} from 'events/key-codes';
import {BaseFormElement} from '../base-form-element';

const DATEFORMAT_REGEX = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
const DATEFORMAT = 'YYYY-MM-DD';
const FLICKRFORMAT = 'Y-m-d';

/**
 * date-picker Custom Element
 *
 * Leverages the third-part flatpickr date picker and then overrides the behavior of the text input to work
 * cleaner with usage patterns.
 *
 * <b>Implementation Notes</b>
 * - The change event is listened to on the input to set the date in the flatpickr and this will update the value
 * - If ENTER is hit via a KeyUp in the input box, the value will process through the same code path as the change event
 * - If a date is changed through change / keyUp the flatpickr selected date is updated, and it is closed.
 */
@customElement('date-picker')
@inject(Element)
export class DatePicker extends BaseFormElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) value;

    displayValue;

    constructor(element) {
        super(element);
    }

    attached() {
        super.attached();
        this._initDatePicker();
    }

    getInputSelector() {
        return '.date-picker-wrapper > input';
    }

    valueChanged(newVal, oldVal) {
        if (newVal === oldVal || moment(newVal).isSame(oldVal)) {
            return;
        }
        this._setValueInPicker(this.value);
        this.displayValue = this._normalizeValueForDisplay(this.value);
    }

    handleKeyUp(evt) {
        let kCode = evt.keyCode;
        if (kCode === KeyCodes.VK_ENTER) {
            this.change(evt);
        } else if (kCode === KeyCodes.VK_DASH || (kCode >= KeyCodes.VK_0 && kCode <= KeyCodes.VK_9)) {
            let v = this.extractDate(this.displayValue);
            if (v) {
                this._setValueInPicker(v);
            }
        }
        return true;
    }

    change(evt) {
        this.value = this.extractDate(this.displayValue);
        this._setValueInPicker(this.value);
        if(this.datePicker) {
            this.datePicker.close();
        }
        /**
         * If validation is hooked up to the date picker at some point this logic/test can be removed
         * This just ensures that any date entered is in fact valid and if it is not we clear the display value
         */
        if(!this.value && !_.isEmpty(this.displayValue)) {
            this.displayValue = '';
        }
        evt.stopPropagation();
    }

    clear(evt) {
        if (this.datePicker) {
            this.datePicker.clear();
            this.datePicker.close();
        }
        this.value = undefined;
        this.displayValue = '';
        evt.stopPropagation();
    }

    _initDatePicker() {
        if (!this.datePicker) {
            this.datePicker = this._getDatePicker({
                allowInput: false,
                onChange:   this._dateChanged.bind(this)
            });
            this.datePicker.setDate(this.value, true, FLICKRFORMAT);
        }
    }

    _getDatePicker(opts) {
        return flatpickr($(this.element).find('.date-picker-wrapper')[0], opts);
    }

    _normalizeValueForDisplay(val) {
        return (val) ? moment(val).format(DATEFORMAT) : '';
    }

    _setValueInPicker(val) {
        if (this.datePicker) {
            let dates = this.datePicker.selectedDates;
            let currentDate = undefined;
            if (dates && _.size(dates) > 0) {
                currentDate = _.head(dates);
            }
            if (!moment(currentDate).isSame(val)) {
                this.datePicker.setDate(val, true, FLICKRFORMAT);
            }
        }
    }

    extractDate(inputValue) {
        let v = undefined;
        if (!_.isEmpty(inputValue) && inputValue.match(DATEFORMAT_REGEX)) {
            let m = moment(inputValue);
            if (m.isValid()) {
                v = m.toDate();
            }
        }
        return v;
    }

    /**
     * Date Change callback from flatpickr
     *
     * @param selectedDates - array of date objects
     */
    _dateChanged(selectedDates) {
        if (selectedDates && _.size(selectedDates) > 0) {
            this.value = _.head(selectedDates);
        }
    }
}

