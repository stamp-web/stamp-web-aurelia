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
import ODataFilter from 'odata-filter-parser';
import _ from 'lodash';

let Operators = ODataFilter.Operators;

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

export var PredicateUtilities = {
    removeMatches(subject, predicates) {
        let predicateList = _.clone(predicates);
        if (predicateList.length === 1 && !Operators.isLogical(predicateList[0].operator)) {
            if (predicateList[0].subject === subject) {
                predicateList.splice(0, 1);
            }
        } else {
            _.remove(predicateList, item => {
                return item.subject === subject;
            });
            let logicals = _.filter(predicateList, item => {
                return Operators.isLogical(item.operator);
            });
            if (logicals.length > 0) {
                _.forEach(logicals, logical => {
                    let flattened = logical.flatten();
                    let processed = PredicateUtilities.removeMatches(subject, flattened);
                    if (processed.length < flattened.length) {
                        let indx = _.indexOf(predicateList, logical);
                        predicateList.splice(indx, 1);
                    }
                });
            }
        }
        return predicateList;
    }
};

export var StringUtil = {
    pluralize: function (str, count) {
        var s = str;
        if (count > 1) {
            if (str.endsWith("y")) {
                s = str.substring(0, str.length - 1) + 'ies';
            } else {
                s += 's';
            }
        }
        return s;
    }
};
