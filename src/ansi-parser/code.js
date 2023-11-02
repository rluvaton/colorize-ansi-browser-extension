import {subtypes, types} from "./constants.js";

export class Code {
    static reset = 0;
    static bright = 1;
    static dim = 2;
    static inverse = 7;
    static noBrightness = 22;

    static noItalic = 23;
    static noUnderline = 24;
    static noInverse = 27;
    static noColor = 39;
    static noBgColor = 49;

    constructor(n) {
        let value = undefined;
        let type = undefined;
        let subtype = undefined;
        let str = '';
        let isBrightness = false;

        if (n !== undefined) {
            value = Number(n);
            type = types[Math.floor(value / 10)];
            subtype = subtypes[type][value % 10];
            str = "\u001b[" + value + "m";
            isBrightness = value === Code.noBrightness || value === Code.bright || value === Code.dim;
        }

        this.value = value;
        this.type = type;
        this.subtype = subtype;
        this.str = str;
        this.isBrightness = isBrightness;
    }
}
