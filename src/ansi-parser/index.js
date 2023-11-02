"use strict";

import {Code} from "./code.js";
import {Color} from "./color.js";
import {rawAnsiParse} from "./raw-ansi-parse.js";


/**
 * Parse ansi text
 * @param getString get string to parse function
 * @param fullSpan should return full span with all the props or just the text and css
 * @return {Generator<{css: string, text}, void, *>}
 */
export function* parseAnsi(getString, fullSpan = false) {
    let color = new Color();
    let bgColor = new Color(true /* background */);
    let brightness = undefined;
    let styles = new Set();

    function reset() {
        color = new Color();
        bgColor = new Color(true /* background */);
        brightness = undefined;
        styles.clear();
    }

    reset();

    const spansIterator = rawAnsiParse(getString);

    for (const span of spansIterator) {
        if (span.text.length === 0) {
            continue;
        }

        const c = span.code;

        const inverted = styles.has("inverse");
        const underline = styles.has("underline")
            ? "text-decoration: underline;"
            : "";
        const italic = styles.has("italic") ? "font-style: italic;" : "";
        const bold = brightness === Code.bright ? "font-weight: bold;" : "";

        const foreColor = color.defaultBrightness(brightness);

        span.css = bold + italic + underline + foreColor.css(inverted) + bgColor.css(inverted);

        if (fullSpan) {
            span.bold = !!bold;
            span.color = foreColor.clean;
            span.bgColor = bgColor.clean;

            for (const k of styles) {
                span[k] = true;
            }
        }

        // If more props are needed than just return the span object
        yield {text: span.text, css: span.css}

        if (c.isBrightness) {
            brightness = c.value;
            continue;
        }

        if (span.code.value === undefined) {
            continue;
        }

        if (span.code.value === Code.reset) {
            reset();
            continue;
        }

        switch (span.code.type) {
            case "color":
            case "colorLight":
                color = new Color(false, c.subtype);
                break;

            case "bgColor":
            case "bgColorLight":
                bgColor = new Color(true, c.subtype);
                break;

            case "style":
                styles.add(c.subtype);
                break;
            case "unstyle":
                styles.delete(c.subtype);
                break;
        }
    }
}
