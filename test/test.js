import {it} from "node:test";
import {expect} from "expect";

import * as fixturesInput from "./fixtures/input.js";
import * as fixturesSpanResults from "./fixtures/span-result.js";

import {parseAnsi} from "../src/ansi-parser/index.js";



it('should match the snapshot', () => {
    const result = parseAnsi(() => fixturesInput.fixture1Input);

    expect([...result]).toEqual(fixturesSpanResults.fixture1SpanResult);
});

