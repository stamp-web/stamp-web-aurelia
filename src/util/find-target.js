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
import {inject, customAttribute} from 'aurelia-framework';

let handleKeyDown = function(e) {
    var self = this;
    if (e.ctrlKey === 114 || ((e.ctrlKey || e.metaKey) && e.keyCode === 70)) {
        e.preventDefault();
        setTimeout(() => {
            $(self.element).focus();
        }, 100);
    }
};

@customAttribute('find-target')
@inject( Element)
export class FindTargetCustomAttribute {
    constructor(element) {
        this.element = element;
        this.listener = handleKeyDown.bind(this);
    }

    attached( ) {
        $(window).on('keydown', this.listener);
    }

    detached() {
        $(window).off('keydown', this.listener);
    }
}
