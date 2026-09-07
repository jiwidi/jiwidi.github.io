// One phase drives the entire illustrated lever escapement. The balance has
// two impulses per oscillation; the escape wheel advances one tooth per cycle.
// Mechanism reference: https://ciechanow.ski/mechanical-watch/ (Balance section).
export const TAU = Math.PI * 2;
export const BALANCE = [253, 126];
export const FORK = [161, 146];
export const ESCAPE = [99, 146];
export const AMPLITUDE = 2.65;
export const CONTACT_ANGLE = .48;
export const CONTACT_WINDOW = Math.asin(CONTACT_ANGLE / AMPLITUDE) / TAU;
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
export const rollerPoint = angle => [BALANCE[0] - 20 * Math.cos(angle), BALANCE[1] - 20 * Math.sin(angle)];
const bearing = angle => { const p = rollerPoint(angle); return Math.atan2(p[1] - FORK[1], p[0] - FORK[0]); };
export const FORK_REST = bearing(0);
export function escapementState(cycles) {
  const cycle = Math.floor(cycles), phase = cycles - cycle;
  const balance = AMPLITUDE * Math.cos(phase * TAU);
  const fork = bearing(Math.max(-CONTACT_ANGLE, Math.min(CONTACT_ANGLE, balance))) - FORK_REST;
  const events = [.25, .75].map(center => (phase - center + CONTACT_WINDOW) / (2 * CONTACT_WINDOW));
  const escape = (-54 + cycle * 24 + events.reduce((sum, event) => sum + 12 * smooth((event - .2) / .7), 0)) * Math.PI / 180;
  const contact = events.find(event => event >= 0 && event <= 1);
  const stage = contact === undefined ? 'Locked · balance swings freely' : contact < .2 ? 'Unlock · roller meets fork' : contact < .9 ? 'Impulse · escape wheel advances' : 'Lock · next tooth catches';
  return { balance, fork, escape, phase, stage, contact: contact !== undefined };
}
export function rotatePoint(point, center, angle) {
  const x = point[0] - center[0], y = point[1] - center[1];
  return [center[0] + x * Math.cos(angle) - y * Math.sin(angle), center[1] + x * Math.sin(angle) + y * Math.cos(angle)];
}
// Each locking jewel meets an escape tooth at the corresponding end of travel.
export const PALLETS = [-54,54].map((angle, i) => {
  const contact = [ESCAPE[0] + 47 * Math.cos(angle * Math.PI / 180), ESCAPE[1] + 47 * Math.sin(angle * Math.PI / 180)];
  return rotatePoint(contact, FORK, -escapementState(i * .5).fork);
});
