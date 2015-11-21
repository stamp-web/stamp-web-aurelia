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
/**
 * Referenced from https://gist.github.com/xmlking/e86e4f15ec32b12c4689
 */
export class EnumSymbol {

    sym = Symbol.for(name);
    ordinal:number;
    description:string;
    keyName:string;

    constructor(name:string, {ordinal, description}) {
        if (!Object.is(ordinal, undefined)) {
            this.ordinal = ordinal;
        }
        if (description) {
            this.description = description;
        }
        this.keyName = name;
        Object.freeze(this);
    }

    get display() {
        return this.description || Symbol.keyFor(this.sym);
    }

    get key() {
        return this.keyName;
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
                throw new TypeError('each enum should have been initialized with at least empty {} value');
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

    get(ordinal) {
        let self = this;
        let symbol;
        this.keys().forEach( k => {
            if( self[k].ordinal === ordinal ) {
                symbol = self[k];
            }
        });
        return symbol;
    }

}

export const Condition = new Enum({

    MINT: {ordinal: 0, description: 'condition.MLH'},
    MINT_NH: {ordinal: 1, description: 'condition.MNH'},
    MING_NG: {ordinal: 4, description: 'condition.MNG'},
    MINT_HH: {ordinal: 5, description: 'condition.MHH'},
    USED: {ordinal: 2, description: 'condition.U'},
    CTO: {ordinal: 3, description: 'condition.CTO'},
    COVER: {ordinal: 6, description: 'condition.COVER'},
    ON_PAPER: {ordinal: 7, description: 'condition.ON_PAPER'}
});

export const Grade = new Enum({
    XF: {ordinal: 0, description: 'grade.XF'},
    VF: {ordinal: 1, description: 'grade.VF'},
    FVF: {ordinal: 2, description: 'grade.FVF'},
    F: {ordinal: 3, description: 'grade.F'},
    VG: {ordinal: 4, description: 'grade.VG'},
    D: {ordinal: 5, description: 'grade.D'},
    CTS: {ordinal: 6, description: 'grade.CTS'}
});

export const CurrencyCode = new Enum({
    USD: {ordinal: 0, description: 'currencyCode.USD'},
    CAD: {ordinal: 1, description: 'currencyCode.CAD'},
    EUR: {ordinal: 2, description: 'currencyCode.EUR'},
    GBP: {ordinal: 3, description: 'currencyCode.GBP'},
    AUD: {ordinal: 4, description: 'currencyCode.AUD'},
    JYP: {ordinal: 5, description: 'currencyCode.JYP'}
});

export const UserLocale = new Enum({
    en: {ordinal: 0, description: 'userLocale.en'},
    zh: {ordinal: 1, description: 'userLocale.zh'}
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

export const Defects = new Enum({
    THIN: {ordinal: 2, description: 'defects.THIN'},
    TORN: {ordinal: 4, description: 'defects.TORN'},
    TONED_PAPER: {ordinal: 8, description: 'defects.TONED_PAPER'},
    CREASED: {ordinal: 16, description: 'defects.CREASED'},
    SCUFFED: {ordinal: 32, description: 'defects.SCUFFED'},
    PINHOLE: {ordinal: 64, description: 'defects.PINHOLE'},
    SHORT_PERF: {ordinal: 128, description: 'defects.SHORT_PERF'},
    STUNTED_PERF: {ordinal: 256, description: 'defects.STUNTED_PERF'},
    CLIPPED: {ordinal: 512, description: 'defects.CLIPPED'},
    FADING: {ordinal: 1024, description: 'defects.FADING'},
    BLEEDING: {ordinal: 2048, description: 'defects.BLEEDING'},
    INK_STAIN: {ordinal: 4096, description: 'defects.INK_STAIN'},
    CHANGELING: {ordinal: 8192, description: 'defects.CHANGELING'},
    CRACKED_GUM: {ordinal: 16384, description: 'defects.CRACKED_GUM'},
    TONED_GUM: {ordinal: 32768, description: 'defects.TONED_GUM'},
    HEAVILY_HINGED: {ordinal: 65536, description: 'defects.HEAVILY_HINGED'}
});

export const Deceptions = new Enum({
    FAKE_CANCEL: {ordinal: 2, description: 'deceptions.FAKE_CANCEL'},
    FAKE_OVERPRINT: {ordinal: 4, description: 'deceptions.FAKE_OVERPRINT'},
    FISCAL_REMOVED: {ordinal: 8, description: 'deceptions.FISCAL_REMOVED'},
    FORGERY: {ordinal: 16, description: 'deceptions.FORGERY'},
    FORGERY_POSSIBLE: {ordinal: 32, description: 'deceptions.FORGERY_POSSIBLE'},
    REPAIRED: {ordinal: 64, description: 'deceptions.REPAIRED'},
    REPRINT: {ordinal: 128, description: 'deceptions.REPRINT'}
});

export const StampFilter = new Enum({
    ALL: {ordinal: 0, description: 'filters.ALL_STAMPS'},
    ONLY_OWNED: {ordinal: 1, description: 'filters.ONLY_OWNED'},
    ONLY_WANTLIST: {ordinal: 2, description: 'filters.ONLY_WANTLIST'}
});

export const ConditionFilter = new Enum({
    ALL: {ordinal: 0, description: 'conditionFilters.ALL_STAMPS'},
    ONLY_MINT: {ordinal: 1, description: 'conditionFilters.ONLY_MINT'},
    ONLY_USED: {ordinal: 2, description: 'conditionFilters.ONLY_USED'},
    ONLY_POSTAL_HISTORY: {ordinal: 3, description: 'conditionFilters.ONLY_POSTAL_HISTORY'}
});

export var CatalogueHelper = function() {
    return {
        getImagePrefix: catalogue => {
            let prefix = "";
            switch( catalogue.type ) {
                case 1:
                    prefix = "sc";
                    break;
            }
            return prefix;
        }
    };
}();
