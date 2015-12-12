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
import {inject, bindable, customElement} from 'aurelia-framework';
import {datepicker} from 'jquery-ui/ui/datepicker';  //eslint-disable-line no-unused-vars

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
export class DatePicker {
    constructor(element) {
        this.element = element;
    }

    attached() {
        this.range = $(this.element).attr('range') ? true : false;

        setTimeout(() => {
            let elm = $(this.element);
            let self = this;

            elm.find('input').datepicker({
                showOn: "button",
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                buttonImageOnly: false,
                buttonText: '',
                onClose: ( selectedDate, eventObj ) => {
                    if( self.range ) {
                        if( elm.find('input')[MIN_DATE].id === eventObj.input[MIN_DATE].id ) {
                            $(elm.find('input')[MAX_DATE]).datepicker( "option", "minDate", selectedDate );
                        } else {
                            $(elm.find('input')[MIN_DATE]).datepicker( "option", "maxDate", selectedDate );
                        }
                        // icon is lost with selection
                        elm.find('.ui-datepicker-trigger').addClass('sw-icon-calendar btn-default');
                    }
                }
            }).on('change', e => {
                fireEvent(e.target, 'input');
            });
            elm.find('.ui-datepicker-trigger').addClass('sw-icon-calendar btn-default');
            elm.find('input').addClass('form-control');
        });
    }

    detached() {
        $(this.element).datepicker('destroy').off('change');
    }
}




