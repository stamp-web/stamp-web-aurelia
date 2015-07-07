import {customElement, bindable, inject, LogManager} from 'aurelia-framework';
import datePicker from 'eternicode/bootstrap-datepicker/js/bootstrap-datepicker';
import XDate from 'arshaw/xdate';

import 'resources/styles/widgets/date-picker.css!';

const logger = LogManager.getLogger("date-picker");

@customElement('date-picker')
@bindable('value')
@bindable('id')
@inject(Element)
export class DatePickerCustomComponent {

    constructor(element) {
        this.element = element;
    }

    attached() {
        this.configure();
    }

    configure() {
        var self = this;
        if (datePicker) {
            $(this.element).find(this.getSelector()).datepicker({
                format: "mm/dd/yyyy",
                todayHighlight: true,
                startDate: new Date("01/01/1840"),
                endDate: new Date("01/01/2050"),
                container: 'body',
                todayBtn: "linked",
                autoclose: true
            }).on('changeDate', function (e) {
                var d = (e.date) ? e.date : null;
                self.setModelValue(d);
            });
        }
    }

    getSelector() {
        return '.input-append.date-picker';
    }

    valueChanged(newValue, oldValue) {
        var elm = $(this.element).find(this.getSelector());
        if (newValue !== oldValue) {
            var d = '';
            if (newValue) {
                try {
                    // If you have dates with a time they fail to resolve in the picker correct.
                    d = new XDate(newValue).toString("MM/dd/yyyy");
                    d = new Date(d + " 00:00:00");
                } catch (err) {
                    logger.error("Unable to parse " + newValue);
                }
            }
            if (d instanceof Date && !isNaN(d.valueOf())) {
                logger.debug("Setting the value for date picker: " + d);
                elm.datepicker('update', d);
                elm.datepicker('hide');
            }
        }
    }

    setModelValue(d) {
        if (d instanceof Date && !isNaN(d.valueOf())) {
            this.value = new XDate(d).toString("yyyy-MM-dd'T'HH:mm:sszzz");
        } else if (d === null) {
            this.value = null;
        }
        logger.debug("Setting model value: " + this.value);
    }


}
