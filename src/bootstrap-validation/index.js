/*
 Implementation from https://gist.github.com/jdanyow/ea843c24956cfffff48bb21776291f6a
 */
import {BootstrapFormValidationRenderer} from './bootstrap-form-validation-renderer';

export function configure(config) {
    config.container.registerHandler(
        'bootstrap-form',
        container => container.get(BootstrapFormValidationRenderer));
}
