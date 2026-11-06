import assert from 'node:assert/strict';
import test from 'node:test';
import {
  NEAR, blurMm, distanceAt, exposureError, extension, mirrorAngle, rangefinderShift,
  rollRadius, shutterPlan, sliderAt, formatStops,
} from './camera/optics.js';

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('focus slider maps the near limit and infinity and round-trips', () => {
  assert.equal(distanceAt(0), NEAR);
  assert.equal(distanceAt(1), Infinity);
  close(sliderAt(distanceAt(0.37)), 0.37);
  assert.equal(sliderAt(Infinity), 1);
});

test('helicoid extension is zero at infinity and about 3.85 mm at 0.7 m', () => {
  assert.equal(extension(Infinity), 0);
  close(extension(700), 2500 / 650);
});

test('rangefinder ghost vanishes when focus matches the subject', () => {
  assert.equal(rangefinderShift(2400, 2400), 0);
  assert.ok(rangefinderShift(2400, Infinity) > 0);
  assert.ok(rangefinderShift(Infinity, 2400) < 0);
  assert.equal(mirrorAngle(Infinity), 0);
});

test('blur is zero in focus and grows with aperture', () => {
  assert.equal(blurMm(2400, 2400, 2), 0);
  assert.ok(blurMm(Infinity, 2400, 2) > blurMm(Infinity, 2400, 16));
  close(blurMm(Infinity, Infinity, 2), 0);
});

test('exposure error is zero for sunny-16 style settings on the scene', () => {
  // EV 12 at ISO 100 is EV 14 at ISO 400: f/8 at 1/256 s.
  close(exposureError(8, 1 / 256), 0);
  assert.ok(exposureError(2, 1 / 60) > 0);
  assert.ok(exposureError(16, 1 / 1000) < 0);
  assert.equal(formatStops(0.1), 'correct');
  assert.equal(formatStops(-2), '−2 stops under');
});

test('fast speeds expose through a slit; slow speeds open the whole gate', () => {
  close(shutterPlan(1 / 1000, 900).slitMm, 1.8);
  assert.equal(shutterPlan(1 / 15, 900).slitMm, 36);
  assert.ok(shutterPlan(1, 900).delayMs > shutterPlan(1 / 60, 900).delayMs);
});

test('film roll grows from its core', () => {
  assert.equal(rollRadius(0, 6), 6);
  assert.ok(rollRadius(1400, 6) > 9 && rollRadius(1400, 6) < 10.5);
});
