const {Code} = require("./code");

const TEXT = 0;
const BRACKET = 1;
const CODE = 2;

class Span {

    // Those are added in the actual parse, this is done for performance reasons to have the same hidden class
    css = '';
    color = '';
    bgColor = '';
    bold = undefined;

    constructor(code, text) {
        this.code = code;
        this.text = text;
    }
}

function* rawAnsiParse(s) {
    let state = TEXT;
    let buffer = "";
    let text = "";
    let code = "";
    let codes = [];

    const chars = s.split("");
    const charsLength = chars.length;

    for (let i = 0; i < charsLength; i++) {
        const c = chars[i];

        buffer += c;

        switch (state) {
            case TEXT:
                if (c === "\u001b") {
                    state = BRACKET;
                    buffer = c;
                } else {
                    text += c;
                }
                break;

            case BRACKET:
                if (c === "[") {
                    state = CODE;
                    code = "";
                    codes = [];
                } else {
                    state = TEXT;
                    text += buffer;
                }
                break;

            case CODE:
                if (c >= "0" && c <= "9") {
                    code += c;
                } else if (c === ";") {
                    codes.push(new Code(code));
                    code = "";
                } else if (c === "m") {
                    code = code || "0";
                    for (const code of codes) {
                        yield new Span(code, text);
                        // spans.push({ text, code });
                        text = "";
                    }

                    yield new Span(new Code(code), text);
                    text = "";
                    state = TEXT;
                } else {
                    state = TEXT;
                    text += buffer;
                }
        }
    }

    if (state !== TEXT) text += buffer;

    if (text) {
        yield new Span(new Code(), text);
    }
}

module.exports = {rawAnsiParse};
