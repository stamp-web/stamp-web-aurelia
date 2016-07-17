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
import {customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, KeyCodes} from '../../../events/event-managed';

@customElement('paging-toolbar')
@bindable('total')
@bindable('page')
@inject(EventAggregator, Element)
export class pagingToolbarComponent {

    constructor(eventBus, element) {
        this.eventBus = eventBus;
        this.element = element;
    }

    pageChanged(newVal) { //eslint-disable-line no-unused-vars
        this.setButtonState();
    }

    totalChanged(newVal) { //eslint-disable-line no-unused-vars
        this.setButtonState();
    }

    selectPage(num) {
        if( +num < this.total && +num >= 0 ) {
            this.eventBus.publish(EventNames.pageChanged, +num);
        }
    }

    refresh() {
        this.eventBus.publish(EventNames.pageRefreshed, this.page);
    }

    setButtonState() {
        let elm = $(this.element);

        if (this.page === this.total) {
            elm.find('button.last-page').button().button('disable');
            elm.find('button.next-page').button().button('disable');
        } else {
            elm.find('button.last-page').button().button('enable');
            elm.find('button.next-page').button().button('enable');
        }
    }

    validatePage() {
        if (typeof this.page === 'undefined' || +this.page > this.total || +this.page.page < 1) {
            $(this.element).find('.enter-page').addClass('invalid');
        } else {
            $(this.element).find('.enter-page').removeClass('invalid');
        }
    }

    isValid() {
        try {
            if (typeof this.page === 'undefined' || parseInt(this.page) > this.total || parseInt(this.page) < 1) {
                return false;
            }
        } catch( err ) {
            return false;
        }
        return true;

    }

    filterKey($event) {
        if( $event.keyCode === KeyCodes.VK_ENTER && this.isValid()) {
            this.selectPage(parseInt($($event.target).val()) - 1);
        }
    }
}
