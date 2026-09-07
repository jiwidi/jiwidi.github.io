import test from 'node:test';
import assert from 'node:assert/strict';
import { escapementState, PALLETS, ESCAPE, FORK, BALANCE, CONTACT_ANGLE, rotatePoint, rollerPoint, FORK_REST } from './escapement.js';
const close = (a,b,tolerance=1e-8) => assert.ok(Math.abs(a-b)<tolerance,`${a} should equal ${b}`);

test('escape wheel stays locked outside contact and advances one tooth per complete oscillation', () => {
  let last = escapementState(-2).escape;
  for (let i=-1999;i<=3000;i++) {
    const state = escapementState(i/1000);
    assert.ok(state.escape >= last - 1e-10, 'the driven wheel never reverses');
    if (!state.contact && !escapementState((i-1)/1000).contact) close(state.escape,last);
    last = state.escape;
  }
  for (const phase of [0,.22,.25,.5,.75,.99]) close(escapementState(phase+1).escape-escapementState(phase).escape,Math.PI*2/15);
});

test('each locked pallet meets an escape tooth, and the roller follows the fork slot during contact', () => {
  for (const phase of [0,.5,1,1.5]) {
    const state = escapementState(phase), pallet = PALLETS[Math.round(phase*2)%2];
    const p = rotatePoint(pallet,FORK,state.fork);
    close(Math.hypot(p[0]-ESCAPE[0],p[1]-ESCAPE[1]),47);
    const angle = Math.atan2(p[1]-ESCAPE[1],p[0]-ESCAPE[0]);
    close(Math.sin((angle-state.escape)*15/2),0);
  }
  for (let i=0;i<=1000;i++) {
    const state = escapementState(i/1000);
    if (Math.abs(state.balance)>CONTACT_ANGLE) continue;
    const p = rollerPoint(state.balance);
    close(Math.atan2(p[1]-FORK[1],p[0]-FORK[0]),state.fork+FORK_REST);
    close(Math.hypot(p[0]-BALANCE[0],p[1]-BALANCE[1]),20);
  }
});
