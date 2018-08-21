import {customElement, bindable} from 'aurelia-framework';

@customElement('panel')
export class Panel {

    @bindable headingText;
}
