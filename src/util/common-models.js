/**
 * Referenced from https://gist.github.com/xmlking/e86e4f15ec32b12c4689
 */
export class EnumSymbol {

	sym = Symbol.for(name);
	ordinal:number;
	description:string;

	constructor(name:string, {ordinal, description}) {
		if (!Object.is(ordinal, undefined)) this.ordinal = ordinal;
		if (description) this.description = description;
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
			if (!enumLiterals[key]) throw new TypeError('each enum should have been initialized with atleast empty {} value');
			this[key] = new EnumSymbol(key, enumLiterals[key]);
		}
		Object.freeze(this);
	}

	symbols() {
		var syms = [];
		var self = this;
		Object.keys(this).forEach(function(k) {
			"use strict";
			syms.push(self[k]);
		});
		return syms; //for (key of Object.keys(this)) this[key];
	}

	keys() {
		return Object.keys(this);
	}

	contains(sym) {
		if (!(sym instanceof EnumSymbol)) return false;
		return this[Symbol.keyFor(sym.sym)] === sym;
	}

}

export const Condition = new Enum({

	MINT: {ordinal: 0, description: 'Mint'},
	MINT_NH: {ordinal: 1, description: 'Mint (NH)'},
	MING_NG: {ordinal: 4, description: 'Mint no gum'},
	USED: {ordinal: 2, description: 'Used' },
	CTO: {ordinal: 3, description: 'Cancel to order'}

});


