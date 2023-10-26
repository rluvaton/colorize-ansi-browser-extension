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

// getString as function instead of string to allow garbage collection
function* rawAnsiParse(getString) {
    const stateObject = {
        state: TEXT,
        buffer: '',
        text: '',
        code: '',
        codes: [],
    }

    const chunks = splitStringToChunksOfSize(
        getString(),
        // 1 MB
        1_048_576
    );

    while(chunks.length > 0) {
        const chunk = chunks.shift();
        yield * processChunk(chunk, stateObject);
    }

    if (stateObject.state !== TEXT) stateObject.text += stateObject.buffer;

    if (stateObject.text) {
        yield new Span(new Code(), stateObject.text);
    }
}

function splitStringToChunksOfSize(str, chunkSize) {
    const chunks = [];
    const chunksLength = Math.ceil(str.length / chunkSize);

    for (let i = 0, o = 0; i < chunksLength; ++i, o += chunkSize) {
        chunks.push(str.substring(o, o + chunkSize));
    }

    return chunks;
}

function* processChunk(chunk, stateObject) {
    const chars = chunk;
    const charsLength = chunk.length;

    for (let i = 0; i < charsLength; i++) {
        const c = chars[i];

        stateObject.buffer += c;

        switch (stateObject.state) {
            case TEXT:
                if (c === "\u001b") {
                    stateObject.state = BRACKET;
                    stateObject.buffer = c;
                } else {
                    stateObject.text += c;
                }
                break;

            case BRACKET:
                if (c === "[") {
                    stateObject.state = CODE;
                    stateObject.code = "";
                    stateObject.codes = [];
                } else {
                    stateObject.state = TEXT;
                    stateObject.text += stateObject.buffer;
                }
                break;

            case CODE:
                if (c >= "0" && c <= "9") {
                    stateObject.code += c;
                } else if (c === ";") {
                    stateObject.codes.push(new Code(stateObject.code));
                    stateObject.code = "";
                } else if (c === "m") {
                    stateObject.code = stateObject.code || "0";
                    for (const code of stateObject.codes) {
                        yield new Span(code, stateObject.text);
                        stateObject.text = "";
                    }

                    yield new Span(new Code(stateObject.code), stateObject.text);
                    stateObject.text = "";
                    stateObject.state = TEXT;
                } else {
                    stateObject.state = TEXT;
                    stateObject.text += stateObject.buffer;
                }
        }
    }
}

module.exports = {rawAnsiParse};
