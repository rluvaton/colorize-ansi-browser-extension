const assert = require('node:assert');
const {it} = require('node:test');

const fixturesInput = require('./fixtures/input');
const fixturesSpanResults = require('./fixtures/span-result');

const {parseAnsi} = require('../src/ansi-parser');

it('should match the snapshot', () => {
    assert.deepEqual(parseAnsi(fixturesInput.fixture1Input), fixturesSpanResults.fixture1SpanResult);
});

