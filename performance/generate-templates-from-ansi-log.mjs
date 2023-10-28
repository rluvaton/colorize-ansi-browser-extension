import {readFile, writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {gzipSync} from "node:zlib";
import path from "node:path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

class State {
    /**
     * (string | number)[]
     */
    static ready = [];

    /**
     * @type {((text: string) => Generator<string|[string], *, *>)[]} fns
     */
    fns = [];

    /**
     *
     * @type {((text: string) => Generator<string|[string], *, *>)[]} fns
     */
    constructor(fns) {
        this.fns = fns;
    }

    /**
     *
     * @param {string} text
     */
    static run(text) {
        State.ready = [];

        const state = new State([
            extractAnsiText,
            extractWhitespaces,
            extractPredefinedText,

            // Must be AFTER ansi colors
            extractNonWordsAndDigits,
        ]);

        state.runNext(text);

        return State.ready;
    }

    runNext(text) {
        if (this.fns.length === 0) {
            if(text.length > 0) {
                // If nothing left, then add to ready
                this.addReadyItem(text.length)
            }
            return;
        }
        const [current, ...rest] = this.fns;

        runSingleParsing(text, current, new State(rest));
    }

    /**
     * @param {string | number} item
     * @return {boolean} return in valid item or not
     */
    addReadyItem(item) {
        const itemType = typeof item;
        if (itemType !== 'string' && itemType !== 'number') {
            return false;
        }

        State.ready.push(item);
        return true;
    }
}

function runSingleParsing(text, fn, state) {
    for (const item of fn(text, state)) {
        const added = state.addReadyItem(item);
        if (added) {
            continue;
        }

        const [pendingParsing] = item;

        state.runNext(pendingParsing);
    }
}

/**
 * @param {string} text
 * @return {Generator<string|[string], *, *>}
 */
function* extractAnsiText(text) {
    // Regular expression to match text before, ANSI color code (singular and text after
    const regex = /([^\x1b]*)(\x1b\[[0-9;]*m)([^\x1b]*)/g;

    let found = false

    for (const fullMatch of text.matchAll(regex)) {
        found = true;
        const [_, text1, ansiColor, text2] = fullMatch;

        // Not ready
        if (text1) {
            yield [text1];
        }

        // Ready
        yield ansiColor;

        // Not ready
        if (text2) {
            yield [text2];
        }
    }

    if (!found) {
        yield [text];
    }
}

/**
 * @param {string} text
 * @return {Generator<string|[string], *, *>}
 */
function* extractWhitespaces(text) {
    // Regular expression to match text before, ANSI color code (singular and text after
    const regex = /(\s*)(\S+)(\s*)/g;

    let found = false;

    for (const fullMatch of text.matchAll(regex)) {
        found = true;

        const [_, whitespace1, nonWhiteSpace, whitespace2] = fullMatch;
        // ready
        if (whitespace1) {
            yield whitespace1;
        }

        // No ready
        yield [nonWhiteSpace];

        // Ready
        if (whitespace2) {
            yield whitespace2;
        }
    }

    if (!found) {
        yield [text];
    }
}

/**
 * @param {string} text
 * @return {Generator<string|[string], *, *>}
 */
function* extractPredefinedText(text) {
    const doNotReplace = new Set(['warning', 'info', 'error', 'debug', 'trace']);
    if (doNotReplace.has(text.toLowerCase())) {
        yield text;
        return;
    }

    yield [text];
}


/**
 * @param {string} text
 * @return {Generator<string|[string], *, *>}
 */
function* extractNonWordsAndDigits(text) {
    // Regular expression to match non-words and non-digits
    const regex = /([\d\w]*)([^\d\w]+)([\d\w]*)/g;

    let found = false;

    for (const fullMatch of text.matchAll(regex)) {
        found = true;

        const [_, wordsAndDigits1, nonWordsAndDigits, wordsAndDigits2] = fullMatch;
        // not ready
        if (wordsAndDigits1) {
            yield [wordsAndDigits1];
        }

        // ready
        yield nonWordsAndDigits;

        // Ready
        if (wordsAndDigits2) {
            yield [wordsAndDigits2];
        }
    }

    if (!found) {
        yield [text];
    }
}

async function createTemplate(logFileTemplate, templateFilePath) {
    const logFile = (await readFile(logFileTemplate)).toString();
    const template = gzipSync(JSON.stringify(State.run(logFile)))

    await writeFile(
        templateFilePath,
        template
    );
}

const inputFilePath = process.argv[2];
const fileName = path.basename(inputFilePath, path.extname(inputFilePath));
const outputFilePath = path.join(__dirname, `templates/${fileName}.gzip`);

if (!inputFilePath) {
    console.error('Please provide a path to a log file');
    process.exit(1);
}

await createTemplate(
    inputFilePath,
    outputFilePath,
);

console.log(`Done, template created in ${fileName}`)
