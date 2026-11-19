import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {predict} from './predict.mjs';
const model = JSON.parse(readFileSync(new URL('./model.json', import.meta.url)));
const fixtures = JSON.parse(readFileSync(new URL('./fixtures.json', import.meta.url)));
assert.equal(model.trees.length, 150);
assert.equal(model.schema.length, 23);
for (const fixture of fixtures) {
  const result = predict(model, fixture.input);
  assert.ok(Math.abs(result.score - fixture.expected) < 1e-12, 'Prediction must match Python export');
  assert.equal(result.flag, fixture.expected >= 0.5);
}
assert.throws(() => predict(model, {...model.example, AGE: ''}));
assert.throws(() => predict(model, {...model.example, SEX: 99}));
assert.throws(() => predict(model, {...model.example, PAY_AMT1: -1}));
console.log('Passed four Python prediction fixtures and three invalid-input checks.');
