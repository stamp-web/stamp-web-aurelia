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
import $ from "jquery";

export class BaseFormElement {

    propagateChildId = true;

    constructor(element) {
        this.element = element;
    }

    attached() {
        this.configureAttributes();
    }

    configureAttributes() {
        let controls = $(this.element).find(this.getInputSelector());
        let tabIndex = $(this.element).attr('tabindex');
        let id = $(this.element).attr('id');

        if (tabIndex && tabIndex !== '') {
            $(this.element).removeAttr('tabindex');
            controls.attr('tabindex', tabIndex);
        }
        if (id && id !== '' && this.propagateChildId) {
            $(this.element).removeAttr('id');
            $(controls).attr('id', id);
        }
    }

    getInputSelector() {
        throw new Error('no getInputSelector implemented');
    }
}
