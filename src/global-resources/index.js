export function configure(config) {
    config.globalResources(
        './default-value',
        '../widgets/select-picker/select-picker',
        '../value-converters/as-enum',
        '../value-converters/as-currency-formatted'
    );
}
