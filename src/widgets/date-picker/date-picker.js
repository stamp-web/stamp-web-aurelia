import {inject, customElement, bindable} from 'aurelia-framework';
import moment from 'moment';
import {datepicker} from 'eonasdan/bootstrap-datetimepicker';  //eslint-disable-line no-unused-vars
import 'eonasdan/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css!';
import 'resources/styles/widgets/date-picker/date-picker.css!';

@customElement('date-picker')
@inject(Element)
@bindable("value")
@bindable({
    name: "clearable",
    defaultValue: "false"
})
@bindable({
    name: "format",
    defaultValue: "MM/DD/YYYY"
})
export class DatePicker {

    constructor(element) {
        this.element = element;
    }

    icons = {
        time: 'sw-icon-time',
        date: 'sw-icon-calendar',
        up: 'sw-icon-up',
        down: 'sw-icon-down',
        previous: 'sw-icon-previous',
        next: 'sw-icon-next',
        today: 'sw-icon-target',
        clear: 'sw-icon-trash',
        close: 'sw-icon-cancel'
    }

    clear() {
        var picker = $(this.element).find('.input-group.date').data("DateTimePicker");
        picker.clear();
        picker.hide();
    }

    clearableChanged(newValue) {
        this.clearing = (newValue === 'true');
    }

    attached() {
        this.datePicker = $(this.element).find('.input-group.date')
            .datetimepicker({
                // set to true to not dismiss dialog
                //debug: true,
                ignoreReadonly: true,
                format: this.format,
                showClose: true,
                showTodayButton: true,
                icons: this.icons
            });

        this.datePicker.on("dp.change", (e) => {
            this.value = moment(e.date).format(this.format);
        });
    }

    detached() {
        this.datePicker.off();
    }
}
