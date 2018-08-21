/**
 Copyright 2018 Jason Drake

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
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from "../events/event-managed";

import _ from 'lodash';

@inject(EventAggregator)
export class PdfGenerator {

    constructor(eventAggregator) {
        this.eventAggregrator = eventAggregator;
        this.logger = LogManager.getLogger('PdfGenerator');
    }

    initialize() {
        return new Promise((resolve, reject) => {
            if (!window.pdfMake) {
                require(['node_modules/pdfmake/build/pdfmake.js'], () => {
                    require(['node_modules/pdfmake/build/vfs_fonts.js'], () => {
                        resolve();
                    });
                });
            } else {
                resolve();
            }
        });

    };

    printReport(opts) {
        this.initialize().then(() => {
            let docDefinition = opts;
            pdfMake.createPdf(docDefinition).print();
        }).catch(e => {
            this.logger.warn("Error printing.", e);
            this.eventAggregrator.publish(EventNames.popupBlocked);
        });

    }
};
