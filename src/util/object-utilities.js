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
export var ObjectUtilities = {
    isEqual: function (objA, objB) {
        if( !objA || !objB ) {
            return (!objA && !objB);
        }
        var aKeys = Object.keys(objA);
        var bKeys = Object.keys(objB);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (var i = 0, len = aKeys.length; i < len; i++) {
            var key = aKeys[i];
            if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
                return false;
            }
        }
        return true;
    },
    deepExtend: function (destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor &&
                source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                ObjectUtilities.deepExtend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    }

};


export var StringUtil = {
    pluralize: function (str, count) {
        var s = str;
        if (count > 1) {
            if (str.endsWith("y")) {
                s = str.substring(0, str.length - 2) + 'ies';
            } else {
                s += 's';
            }
        }
        return s;
    }
};
