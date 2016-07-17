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
import {valueConverter} from 'aurelia-framework';

@valueConverter("asNumber")
export class asNumberValueConverter {

    toView(value, asFloat = false) {
        if (value) {
            try {
                value = asFloat ? parseFloat(value.toString()) : parseInt(value.toString());
            } catch (err) {
                console.log("Could not parse '" + value + "' to a number.");
                value = -1;
            }
        }
        return value;
    }

    fromView(value, asFloat = false) {
        if(value) {
            try {
                value = (asFloat) ? parseFloat(value) : parseInt(value);
            } catch( err ) {
                console.log("Could not parse '" + value + "' to a number.");
                value = -1;
            }
        }
        return value;
    }
}
