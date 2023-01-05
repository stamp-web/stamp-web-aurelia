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

let Predicate = ODataFilter.Predicate;
let Operators = ODataFilter.Operators;

export var ObjectUtilities = {
    isEqual: (objA, objB) => {
        if (!objA || !objB) {
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
    deepExtend: (destination, source) => {
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
        if( Operators.isLogical(predicates.operator)) {
            if(predicates.subject instanceof Predicate && predicates.subject.subject === subject) {
                predicates = predicates.value;
              //  predicates = PredicateUtilities.removeMatches(subject, predicates);
            }
            if (predicates.value instanceof Predicate && predicates.value.subject === subject) {
                predicates = predicates.subject;
             //   predicates = PredicateUtilities.removeMatches(subject, predicates);
            }
            if( predicates.subject instanceof Predicate && Operators.isLogical(predicates.subject.operator)) {
                predicates.subject = PredicateUtilities.removeMatches(subject, predicates.subject);
                if(_.isEmpty(predicates.subject)) {
                    predicates = predicates.value;
                }
            }
            if( predicates.value instanceof Predicate && Operators.isLogical(predicates.value.operator)) {
                predicates.value = PredicateUtilities.removeMatches(subject, predicates.value);
                if(_.isEmpty(predicates.value)) {
                    predicates = predicates.subject;
                }
            }
        }
        if (predicates instanceof Predicate && predicates.subject === subject) {
            predicates = undefined;
        }
        return predicates;
    },

    concat(op, array) {
        let ret = [].concat(...array.filter((elm, idx, arr) => {
            return !_.isEmpty(elm) && (Array.isArray(elm) || elm instanceof Predicate);
        }));
        if (_.size(ret) > 1) {
            return Predicate.concat(op, ret);
        } else if (!_.isEmpty(ret) && ret[0] instanceof Predicate) {
            return ret[0];
        }
        return undefined;
    }


};

export var StringUtil = {
    pluralize: (str, count) => {
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

export var DateUtil = {
    isValidDate: (d) => {
        return d instanceof Date && !isNaN(d)
    }
};
