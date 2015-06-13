import {valueConverter} from 'aurelia-framework';

@valueConverter("asNumber")
export class asNumberValueConverter {

    toView(value) {
        if (value) {
            try {
                value = +parseInt(value.toString());
            } catch (err) {
                console.log("Could not parse '" + value + "' to a number.");
                value = -1;
            }
        }
        return value;
    }
}
