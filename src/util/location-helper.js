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

import _ from 'lodash';

function LocationHelperFn() {

    return {
        loadResource: (filename, filetype = 'js') => {
            return new Promise((resolve,reject) => {
                let fileRef;
                if (filetype == 'js') {
                    fileRef = document.createElement('script');
                    fileRef.setAttribute('type', 'text/javascript');
                    fileRef.setAttribute('src', filename);
                }
                else if (filetype == 'css') {
                    fileRef = document.createElement('link');
                    fileRef.setAttribute('rel', 'stylesheet');
                    fileRef.setAttribute('type', 'text/css');
                    fileRef.setAttribute('href', filename);
                }
                if (fileRef) {
                    fileRef.onload = () => {
                        resolve();
                    };
                    fileRef.onerror = e => {
                        reject(e);
                    };
                    _.defer(() => {
                        document.getElementsByTagName("head")[0].appendChild(fileRef);
                    })

                }
            });
        },

        getQueryParameter: (key, default_) => {
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
                return decodeURIComponent(qs[1]);
            }
        },

        resolvePath: (path, _default) => {
            let val = !_.isEmpty(path) && path.value ? path.value : _default;
            return val + (val.endsWith('/') ? '' : '/');
        }
    };
}

export var LocationHelper = new LocationHelperFn();
