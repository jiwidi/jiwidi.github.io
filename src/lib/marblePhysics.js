export const MAZE = {
  left: 12, right: 348, top: 12, bottom: 180,
  radius: 6,
  start: { x: 36, y: 36 },
  goal: { x: 326, y: 156, radius: 12 },
  walls: [
    { x: 96, y: 12, w: 7, h: 120 },
    { x: 180, y: 60, w: 7, h: 120 },
    { x: 264, y: 12, w: 7, h: 120 },
  ],
};

export function createMarble() {
  return { ...MAZE.start, vx: 0, vy: 0, won: false };
}

function bounce(ball, nx, ny) {
  const speed = ball.vx * nx + ball.vy * ny;
  if (speed < 0) {
    ball.vx -= 1.3 * speed * nx;
    ball.vy -= 1.3 * speed * ny;
  }
}

// Fixed, short steps prevent the marble from tunnelling through thin walls.
export function stepMarble(ball, tilt, dt) {
  if (ball.won) return;
  const drag = Math.exp(-2.8 * dt);
  ball.vx = (ball.vx + tilt.x * 420 * dt) * drag;
  ball.vy = (ball.vy + tilt.y * 420 * dt) * drag;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  const r = MAZE.radius;

  if (ball.x < MAZE.left + r) { ball.x = MAZE.left + r; bounce(ball, 1, 0); }
  if (ball.x > MAZE.right - r) { ball.x = MAZE.right - r; bounce(ball, -1, 0); }
  if (ball.y < MAZE.top + r) { ball.y = MAZE.top + r; bounce(ball, 0, 1); }
  if (ball.y > MAZE.bottom - r) { ball.y = MAZE.bottom - r; bounce(ball, 0, -1); }

  for (const wall of MAZE.walls) {
    const closestX = Math.max(wall.x, Math.min(ball.x, wall.x + wall.w));
    const closestY = Math.max(wall.y, Math.min(ball.y, wall.y + wall.h));
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    const distance = Math.hypot(dx, dy);
    if (distance >= r) continue;
    if (distance > 0) {
      const nx = dx / distance;
      const ny = dy / distance;
      ball.x += nx * (r - distance);
      ball.y += ny * (r - distance);
      bounce(ball, nx, ny);
    } else {
      // Also recover safely if a ball is ever placed inside a wall.
      const sides = [
        { depth: ball.x - wall.x, nx: -1, ny: 0 },
        { depth: wall.x + wall.w - ball.x, nx: 1, ny: 0 },
        { depth: ball.y - wall.y, nx: 0, ny: -1 },
        { depth: wall.y + wall.h - ball.y, nx: 0, ny: 1 },
      ];
      const side = sides.reduce((a, b) => a.depth < b.depth ? a : b);
      ball.x += side.nx * (side.depth + r);
      ball.y += side.ny * (side.depth + r);
      bounce(ball, side.nx, side.ny);
    }
  }

  if (Math.hypot(ball.x - MAZE.goal.x, ball.y - MAZE.goal.y) < 9) {
    ball.won = true;
    ball.x = MAZE.goal.x;
    ball.y = MAZE.goal.y;
    ball.vx = ball.vy = 0;
  }
}
