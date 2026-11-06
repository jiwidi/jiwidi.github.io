// The visible stretch of film between the cassette lip and the take-up
// spool, painted onto a canvas each time the film moves.
import { FRAME_PITCH, PERF_PITCH, ROLL } from '../optics.js';
import { FILM_X0, FILM_X1, LEADER_TIP } from './layout.js';

const PPM = 6;
const WIDTH_MM = FILM_X1 - FILM_X0;
const HEIGHT_MM = 35;
const LEADER_MM = 64;
const FIRST_FRAME_U = 19;

export function createFilm(T) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH_MM * PPM;
  canvas.height = HEIGHT_MM * PPM;
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new T.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.35, side: T.DoubleSide });
  const ctx = canvas.getContext('2d');
  const px = (x) => (x - FILM_X0) * PPM;          // world x → canvas x
  const py = (y) => (HEIGHT_MM / 2 - y) * PPM;    // film y (centre 0) → canvas y

  function draw(filmPos, negatives) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tipX = filmPos - LEADER_TIP;
    const end = Math.min(FILM_X1, tipX);
    if (end <= FILM_X0) { texture.needsUpdate = true; return; }

    // Base, with the half-width tongue of the leader near the tip.
    ctx.fillStyle = '#efc07a';
    ctx.beginPath();
    const leaderStart = tipX - LEADER_MM;
    ctx.moveTo(px(FILM_X0), py(17.5));
    ctx.lineTo(px(Math.min(end, leaderStart)), py(17.5));
    if (leaderStart < end) {
      ctx.bezierCurveTo(px(leaderStart + 10), py(17.5), px(leaderStart + 6), py(1), px(Math.min(end, leaderStart + 18)), py(1));
      ctx.lineTo(px(end), py(1));
    }
    ctx.lineTo(px(end), py(-17.5));
    ctx.lineTo(px(FILM_X0), py(-17.5));
    ctx.closePath();
    ctx.fill();

    // The leader is fogged during loading: dense on the negative.
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#6b3f19';
    ctx.fillRect(px(filmPos - FIRST_FRAME_U), 0, canvas.width, canvas.height);
    for (let k = 1; k <= ROLL; k++) {
      const x = filmPos - FRAME_PITCH * k;
      if (x < FILM_X0 - 20 || x > FILM_X1 + 20) continue;
      const negative = negatives.get(k);
      if (negative) {
        // The lens turns the image upside down; seen from behind it reads rotated 180°.
        ctx.save();
        ctx.translate(px(x), py(0));
        ctx.rotate(Math.PI);
        ctx.drawImage(negative, -18 * PPM, -12 * PPM, 36 * PPM, 24 * PPM);
        ctx.restore();
      } else {
        ctx.strokeStyle = 'rgba(140, 92, 40, .35)';
        ctx.setLineDash([6, 5]);
        ctx.strokeRect(px(x - 18), py(12), 36 * PPM, 24 * PPM);
        ctx.setLineDash([]);
      }
      ctx.fillStyle = 'rgba(110, 66, 24, .85)';
      ctx.font = `600 ${1.3 * PPM}px ui-monospace, monospace`;
      ctx.fillText(String(k), px(x - 14), py(-13.6));
      ctx.fillText(`${k}A`, px(x + 5), py(-13.6));
      if (k % 2) ctx.fillText('400 B&W', px(x - 6), py(12.4));
    }
    ctx.restore();

    // Perforations: 8 per frame along both edges.
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const first = Math.ceil((filmPos - end) / PERF_PITCH);
    for (let j = first; ; j++) {
      const x = filmPos - j * PERF_PITCH;
      if (x < FILM_X0 - 3) break;
      for (const y of [15.3, -15.3]) ctx.fillRect(px(x - 1), py(y + 1.4), 2 * PPM, 2.8 * PPM);
    }
    ctx.restore();
    texture.needsUpdate = true;
  }

  return { material, draw, dispose() { texture.dispose(); material.dispose(); } };
}
