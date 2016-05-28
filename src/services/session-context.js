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
import _ from 'lodash';

export var SessionContext = function() {


    return {

        SEARCH_CHANGE: 'search-change',

        searchConditions: undefined,
        contextListeners: {},

        constructor() { },

        addContextListener: function(eventName, callback) {
            if( this.contextListeners[eventName] === undefined ) {
                this.contextListeners[eventName] = [];
            }
            this.contextListeners[eventName].push(callback);
        },

        removeContextListener: function(eventName, callback) {
            if( this.contextListeners[eventName] ) {
                let index = -1;
                _.forEach(this.contextListeners[eventName], (listener, idx) => {
                    if( listener === callback ) {
                        index = idx;
                        return;
                    }
                });
                if( index >= 0 ) {
                    this.contextListeners[eventName].splice(index, 1);
                }
            }
        },

        publish: function(eventName, data, oldData) {
            if( this.contextListeners[eventName] ) {
                _.forEach(this.contextListeners[eventName], listener => {
                    listener(data, oldData);
                });
            }
        },

        getSearchCondition: function() {
            return this.searchConditions;
        },

        setSearchCondition: function( predicate ) {
            let oldCondition = this.searchConditions;
            this.searchConditions = predicate;
            this.publish(this.SEARCH_CHANGE, this.searchConditions, oldCondition);
        }
    };
}();
