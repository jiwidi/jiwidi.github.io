import assert from 'node:assert/strict';
import test from 'node:test';
import { filmStops, labCorrection } from './camera/print.js';

const close = (a, b, eps = 0.05) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('the negative tracks exposure inside its latitude', () => {
  close(filmStops(0), 0);
  close(filmStops(3), 3);
  close(filmStops(-2), -2, 0.15);
});

test('shadows sink into the fog and highlights block up outside it', () => {
  assert.ok(filmStops(-8) > -3.3 && filmStops(-8) < -3.1);
  assert.ok(filmStops(12) < 6.6 && filmStops(12) > 6.3);
});

test('the lab corrects most of an error, up to three stops', () => {
  assert.equal(labCorrection(0), 0);
  close(labCorrection(2), 1.5);
  assert.equal(labCorrection(4), 3);
  assert.equal(labCorrection(-6), -3);
});
