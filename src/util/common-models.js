/**
 * Referenced from https://gist.github.com/xmlking/e86e4f15ec32b12c4689
 */
export class EnumSymbol {

    sym = Symbol.for(name);
    ordinal:number;
    description:string;

    constructor(name:string, {ordinal, description}) {
        if (!Object.is(ordinal, undefined)) {
            this.ordinal = ordinal;
        }
        if (description) {
            this.description = description;
        }
        Object.freeze(this);
    }

    get display() {
        return this.description || Symbol.keyFor(this.sym);
    }

    toString() {
        return this.sym;
    }

    valueOf() {
        return this.ordinal;
    }
}


export class Enum {
    constructor(enumLiterals) {
        for (let key in enumLiterals) {
            if (!enumLiterals[key]) {
                throw new TypeError('each enum should have been initialized with atleast empty {} value');
            }
            this[key] = new EnumSymbol(key, enumLiterals[key]);
        }
        Object.freeze(this);
    }

    symbols() {
        var syms = [];
        var self = this;
        Object.keys(this).forEach(function (k) {
            syms.push(self[k]);
        });
        return syms; //for (key of Object.keys(this)) this[key];
    }

    keys() {
        return Object.keys(this);
    }

    contains(sym) {
        if (!(sym instanceof EnumSymbol)) {
            return false;
        }
        return this[Symbol.keyFor(sym.sym)] === sym;
    }

}

export const Condition = new Enum({

    MINT: {ordinal: 0, description: 'MLH'},
    MINT_NH: {ordinal: 1, description: 'MNH'},
    MING_NG: {ordinal: 4, description: 'MNG'},
    USED: {ordinal: 2, description: 'U'},
    CTO: {ordinal: 3, description: 'CTO'}

});

export const Grade = new Enum({
    XF: {ordinal: 0, description: 'XF'},
    VF: {ordinal: 1, description: 'VF'},
    FVF: {ordinal: 2, description: 'FVF'},
    F: {ordinal: 3, description: 'F'},
    VG: {ordinal: 4, description: 'VG'},
    D: {ordinal: 5, description: 'D'},
    CTS: {ordinal: 6, description: 'CTS'}
});

export const CurrencyCode = new Enum({
    USD: {ordinal: 0, description: 'USD'},
    CAD: {ordinal: 1, description: 'CAD'},
    EUR: {ordinal: 2, description: 'EUR'},
    GBP: {ordinal: 3, description: 'GBP'},
    AUD: {ordinal: 4, description: 'AUD'},
    JYP: {ordinal: 5, description: 'JYP'}

});

export const CatalogueType = new Enum({
    STANLEY_GIBBONS: { ordinal: 0, description: 'Stanley Gibbons'},
    SCOTT: { ordinal: 1, description: 'Scott Publishing'},
    MICHEL: {ordinal: 2, description: 'Michel'},
    FACIT: {ordinal: 3, description: 'Facit'},
    OTHER: {ordinal: 4, description: 'Other'},
    DARNELL: {ordinal: 5, description: 'Darnell'},
    BRIDGER_AND_KAY: {ordinal: 6, description: 'Bridger and Kay'},
    VAN_DAM: {ordinal: 7, description: 'Van Dam'},
    JSCA: {ordinal: 8, description: 'JSCA Specialized'}
});
