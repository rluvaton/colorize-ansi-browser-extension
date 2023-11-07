import {it} from "node:test";
import {expect} from "expect";

import * as fixturesInput from "./fixtures/input.js";
import * as fixturesSpanResults from "./fixtures/span-result.js";

import {parseIterator} from "ansicolor";


it('should match the snapshot', () => {
    const result = parseIterator(() => fixturesInput.fixture1Input);

    let i = 0;
    for (const parsedSpan of result) {
        expect(parsedSpan).toMatchObject(fixturesSpanResults.fixture1SpanResult[i]);
        i++;
    }

    expect(i).toEqual(fixturesSpanResults.fixture1SpanResult.length);
});

