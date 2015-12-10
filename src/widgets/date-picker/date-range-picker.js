import {inject, customElement, bindable} from 'aurelia-framework';
import 'resources/styles/widgets/date-picker/date-range-picker.css!';

@customElement('date-range-picker')
@inject(Element)
@bindable("startValue")
@bindable("endValue")
@bindable({
    name: "clearable",
    defaultValue: "false"
})
@bindable({
    name: "format",
    defaultValue: "MM/DD/YYYY"
})
@bindable("id")
@bindable("tabindex")
export class DateRangePicker {

    constructor(element) {
        this.element = element;
    }
}
