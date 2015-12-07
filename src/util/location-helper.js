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
function LocationHelperFn() {

    return {
        getQueryParameter: function (key, default_) {
            if (default_ == null) {
                default_ = null;
            }
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            key = key.replace("$", "\\$");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var qs = regex.exec(window.location.href);
            if (qs == null) {
                return default_;
            } else {
                return qs[1];
            }
        },

        setQueryParameter: function(key, value) {
            let href = window.location.href;
            let indx = href.index(key+'=');
            if( indx >= 0 ) {
                let s = href.substring(indx + key.length + '=');
                throw Error("Not implemented");
            }
        }
    };
}

export var LocationHelper = new LocationHelperFn();
