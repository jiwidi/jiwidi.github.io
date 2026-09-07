import assert from 'node:assert/strict';
import test from 'node:test';
import { MAZE, createMarble, stepMarble } from './marblePhysics.js';

function assertClear(ball) {
  const r = MAZE.radius;
  assert.ok(ball.x >= MAZE.left + r && ball.x <= MAZE.right - r);
  assert.ok(ball.y >= MAZE.top + r && ball.y <= MAZE.bottom - r);
  for (const wall of MAZE.walls) {
    const x = Math.max(wall.x, Math.min(ball.x, wall.x + wall.w));
    const y = Math.max(wall.y, Math.min(ball.y, wall.y + wall.h));
    assert.ok(Math.hypot(ball.x - x, ball.y - y) >= r - 1e-6, 'marble must not overlap an obstacle');
  }
}

test('the finish is reachable around every obstacle at different simulation rates', () => {
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  for (const dt of [1 / 120, 1 / 240]) {
    const ball = createMarble();
    for (const [x, y] of [[50, 155], [138, 155], [138, 36], [222, 36], [222, 155], [326, 156]]) {
      let reached = false;
      for (let i = 0; i < 15 / dt; i += 1) {
        stepMarble(ball, {
          x: clamp((x - ball.x) * 0.04 - ball.vx * 0.018),
          y: clamp((y - ball.y) * 0.04 - ball.vy * 0.018),
        }, dt);
        assertClear(ball);
        if (ball.won || (Math.hypot(x - ball.x, y - ball.y) < 2 && Math.hypot(ball.vx, ball.vy) < 4)) {
          reached = true;
          break;
        }
      }
      assert.ok(reached, `waypoint ${x}, ${y} must be reachable`);
    }
    assert.ok(ball.won);
    const finished = { ...ball };
    stepMarble(ball, { x: -1, y: -1 }, dt);
    assert.deepEqual(ball, finished, 'a win keeps the marble in the finish ring');
  }
});

test('sustained tilt cannot push through an obstacle, and releasing it settles the marble', () => {
  const ball = createMarble();
  for (let i = 0; i < 2400; i += 1) {
    stepMarble(ball, { x: 1, y: 0 }, 1 / 120);
    assertClear(ball);
  }
  assert.ok(ball.x <= MAZE.walls[0].x - MAZE.radius);
  for (let i = 0; i < 600; i += 1) stepMarble(ball, { x: 0, y: 0 }, 1 / 120);
  assert.ok(Math.hypot(ball.vx, ball.vy) < 0.01);
});
