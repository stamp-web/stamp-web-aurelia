/**
 Copyright 2017 Jason Drake

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
import {inject, bindable, customElement, LogManager} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';

import 'bootstrap-datepicker';

/**
 * date-picker custom element
 */

const logger = LogManager.getLogger('date-picker');

@customElement('date-picker')

@bindable({ name: 'value', defaultValue: undefined })
@bindable({ name: 'endValue', defaultValue: undefined })
@bindable({ name: 'startDate', defaultValue: undefined })
@bindable({ name: 'endDate', defaultValue: undefined })
@bindable({ name: 'range', defaultValue: false })
@inject(Element, I18N)
export class DatePicker {

    dateDisplayFormat = 'MM/DD/YYYY';

    constructor(element, i18n) {
        this.element = element;
        this.i18n = i18n;
    }

    attached() {
        this.dateDisplayFormat = this.i18n.tr('date-picker.format');

        this.datepicker = $(this.element).find('.date-wrapper input');
        this.datepicker.datepicker({
            orientation: "left auto",
            language: this.i18n.getLocale(),
            autoclose: true,
            clearBtn: false,
            todayBtn: "linked",
            todayHighlight: true,
            templates: {
                leftArrow: '<i class="sw-icon-previous"></i>',
                rightArrow: '<i class="sw-icon-next"></i>'
            },
            container: $(this.element).parent(),
            startDate: this.startDate,
            endData: this.endDate
        }).on('changeDate', (event) => {
            let wrapper = $(event.currentTarget).closest('.date-control');
            if( wrapper.hasClass('end-date')) {
                this.lastChangeEndDate = event.date;
            } else {
                this.lastChangeDate = event.date;
            }

        }).on('hide', (event) => {
            let wrapper = $(event.currentTarget).closest('.date-control');
            if( wrapper.hasClass('end-date')) {
                this.endValue = this.lastChangeEndDate;
            } else {
                this.value = this.lastChangeDate;
            }
        });

        this.updateDate(null, false);
        _.defer(()=> {
            this.updateDate(this.value, false);
        });

        if( this.endValue && this.range ) {
            this.updateDate(null, true);
            _.defer(()=> {
                this.updateDate(this.endValue, true);
            });
        }
        this.configureAttributes();

    }

    startDateChanged(newVal) {
        if (!this.datepicker) {
            return;
        }
        this.datepicker.datepicker('setStartDate', newVal);
    }

    endDateChanged(newVal) {
        if (!this.datepicker) {
            return;
        }
        this.datepicker.datepicker('setEndDate', newVal);
    }

    valueChanged(newVal) {
        if(!this.datepicker) {
            return;
        }
        this.updateDate(newVal, false);
        this.fireChangeEvent();
    }

    endValueChanged(newVal) {
        if(!this.datepicker || !this.range) {
            return;
        }
        this.updateDate(newVal, true);
        this.fireChangeEvent();
    }


    clear($event) {
        let wrapper = $($event.currentTarget).parents('.date-control');
        wrapper.find('input').datepicker('clearDates');
        if( wrapper.hasClass('end-date')) {
            this.endValue = undefined;
        } else {
            this.value = undefined;
        }
    }

    show($event) {
        let wrapper = $($event.currentTarget).parents('.date-control');
        wrapper.find('input').datepicker('show');
    }

    detached() {
        try {
            $(this.element).find('.date-control input').datepicker('destroy').off('changeDate');
        } catch (err) {
            logger.warn('Unabled to destroy date-picker' + err);
        }
    }

    /**
     * @private
     */
    updateDate(val, end) {
        let controls = $(this.element).find('.date-control input');
        if( controls.length < 1 ) {
            return;
        }
        let displayText = this.formatDisplay(val);
        if( end ) {
            this.lastChangeEndDate = val;
        } else {
            this.lastChangeDate = val;
        }
        $(controls[(end ? 1 : 0)]).datepicker('update', val);
        if( end ) {
            this.selectedEndDate = displayText;
            $(controls[0]).datepicker('setEndDate', val);
        } else {
            this.selectedDate = displayText;
            if( this.range) {
                $(controls[1]).datepicker('setStartDate', val);
            }
        }
    }

    /**
     * @private
     */
    configureAttributes() {
        let controls = $(this.element).find('.date-wrapper input');
        let tabIndex = $(this.element).attr('tabindex');
        if(tabIndex && tabIndex !== '') {
            $(this.element).removeAttr('tabindex');
            controls.attr('tabindex', tabIndex);
        }
        let id = $(this.element).attr('id');
        if( id && id !== '' ) {
            $(this.element).removeAttr('id');
            if( this.range ) {
                $(controls[0]).attr('id', id + '-start');
                $(controls[1]).attr('id', id + '-end');
            } else {
                $(controls[0]).attr('id', id);
            }
        }
    }

    /**
     * @private
     */
    formatDisplay(val) {
        return val ? (moment(_.isString(val) ? new Date(val) : val).format(this.dateDisplayFormat)) : undefined;
    }

    /**
     * @private
     */
    fireChangeEvent() {
        _.defer(()=> {
            $(this.element).trigger('change');
        });
    }
}
