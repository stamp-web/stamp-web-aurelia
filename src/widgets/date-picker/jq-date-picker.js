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
import {inject, bindable, customElement, LogManager} from 'aurelia-framework';
import {datepicker} from 'jquery-ui/ui/datepicker';  //eslint-disable-line no-unused-vars
import $ from 'jquery';

const logger = LogManager.getLogger('date-picker');

function createEvent(name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    return event;
}

function fireEvent(element, name) {
    var event = createEvent(name);
    element.dispatchEvent(event);
}

const MIN_DATE = 0;
const MAX_DATE = 1;

@customElement('jq-date-picker')
@inject(Element)
@bindable("value")
@bindable("end")
@bindable({
    name: "range",
    defaultValue: false
})
@bindable({
    name: "futureDates",
    defaultValue: false
})
export class DatePicker {
    constructor(element) {
        this.element = element;
    }

    attached() {

        let elm = $(this.element);
        let self = this;

        elm.find('input').datepicker({
            showOn: "button",
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            buttonImageOnly: false,
            buttonText: '',
            onClose: (selectedDate, eventObj) => {
                if (self.range) {
                    if (elm.find('input')[MIN_DATE].id === eventObj.input[MIN_DATE].id) {
                        $(elm.find('input')[MAX_DATE]).datepicker("option", "minDate", selectedDate);
                    } else {
                        $(elm.find('input')[MIN_DATE]).datepicker("option", "maxDate", selectedDate);
                    }
                    // icon is lost with selection
                    elm.find('.ui-datepicker-trigger').addClass('sw-icon-calendar btn-default');
                }
            }
        }).on('change', e => { // used when user changes the input, need to cascade to bound values.
            let val = $(e.currentTarget).val();
            if( e.currentTarget.id === elm.find('input')[MIN_DATE].id) {
                self.value = val ? new Date(val) : null;
            } else {
                self.end = val ? new Date(val) : null;
            }
            fireEvent(e.target, 'input');
        });

        if( self.range && !self.futureDates) { // ensure no future dates can be chosen
            $(elm.find('input')[MIN_DATE]).datepicker("option", "maxDate", new Date());
            $(elm.find('input')[MAX_DATE]).datepicker("option", "maxDate", new Date());
        }

        // by default jquery ui uses glyph images for the next and back buttons.  These
        // elements are redrawn when navigating between months, so we need to recreate
        // them each time, after they have been rendered..
        let reassignMonthIcons = () => {
            setTimeout( () => { // delay until the rendering of components has occurred
                let picker = $.find('.ui-datepicker');
                let fixNav = (p, locator, cls) => {
                    let el = $(p).find(locator + ' > span');
                    el.removeClass();
                    el.addClass(cls);
                    el.text('');
                    let button = $(p).find(locator);
                    button.off('click', reassignMonthIcons); // free up memory/listener
                    button.on('click', reassignMonthIcons); // need to reassign when navigating
                };
                fixNav(picker, '.ui-datepicker-prev', 'sw-icon-previous');
                fixNav(picker, '.ui-datepicker-next', 'sw-icon-next');
            }, 50);
        };

        let trigger = elm.find('.ui-datepicker-trigger');
        trigger.addClass('sw-icon-calendar btn-default');
        trigger.on('click', () => {
            reassignMonthIcons();
        });
        elm.find('input').addClass('form-control');
    }

    valueChanged(newValue) {
        setTimeout( () => { // give picker time to render
            $($(this.element).find('input')[MIN_DATE]).val( newValue );
        }, 50);
    }

    endChanged(newValue) {
        setTimeout( () => { // give picker time to render
            $($(this.element).find('input')[MAX_DATE]).val( newValue );
        }, 50);
    }

    detached() {
        try {
            $(this.element).datepicker('destroy').off('change');
        } catch( err ) {
            logger.warn('could not remove change listener for' + this.element);
        }

    }
}




