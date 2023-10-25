const assert = require('node:assert');
const {it} = require('node:test');

const fixturesInput = require('./fixtures/input');
const fixturesSpanResults = require('./fixtures/span-result');

const {parseAnsi} = require('../src/ansi-parser');
const {expect} = require('expect');

it('should match the snapshot', () => {
    const result = parseAnsi(fixturesInput.fixture1Input);

    expect([...result]).toEqual(fixturesSpanResults.fixture1SpanResult);
});

