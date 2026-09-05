/* Motion lifecycle shared by every ink plate.

   A plate reveals in three passes — frame, structure, detail — then hands
   over to its own ambient loop. Everything is registered here so it can be
   paused when the plate scrolls out of view and torn down on unmount. */

import { animate, createTimeline, stagger, steps, svg, utils } from 'animejs';

/* Reveal choreography. Ambient loops start once the ink has settled. */
const REVEAL = {
  frame: { at: 0, duration: 420, stagger: 14 },
  structure: { at: 180, duration: 640, stagger: 16 },
  detail: { at: 520, duration: 460, stagger: 9 },
  fade: { at: 540, duration: 340, stagger: 16 },
  label: { at: 640, duration: 300, stagger: 20 },
};

export const AMBIENT_START = 980;

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function drawablesIn(root, selector) {
  const nodes = root.querySelectorAll(selector);
  return nodes.length ? svg.createDrawable(nodes) : [];
}

function revealPass(root, selector, { at, duration, stagger: step }, extra) {
  const targets = drawablesIn(root, selector);
  if (!targets.length) return null;
  return animate(targets, {
    draw: ['0 0', '0 1'],
    ease: 'inOut(2.2)',
    duration,
    delay: stagger(step, { start: at }),
    ...extra,
  });
}

function fadePass(root, selector, { at, duration, stagger: step }) {
  const nodes = root.querySelectorAll(selector);
  if (!nodes.length) return null;
  return animate(nodes, {
    opacity: [0, 1],
    duration,
    delay: stagger(step, { start: at }),
    ease: 'out(2)',
  });
}

/* Reduced motion gets the finished plate. Deliberately no drawables here:
   createDrawable seeds `draw: '0 0'`, so touching the geometry at all would
   leave every stroke hidden. Untouched paths simply render in full. */
function settleStatic(root) {
  root.querySelectorAll('.ink-label, [data-fade]').forEach((el) => {
    el.style.opacity = '1';
  });
}

/* `ambient` is called once the reveal is done and returns the loops it started. */
export function mountPlate(root, ambient) {
  if (!root) return { destroy() {} };

  const running = [];
  let observer = null;

  if (prefersReducedMotion()) {
    settleStatic(root);
    return { destroy() {} };
  }

  [
    revealPass(root, '[data-draw="1"]', REVEAL.frame),
    revealPass(root, '[data-draw="2"]', REVEAL.structure),
    revealPass(root, '[data-draw="3"]', REVEAL.detail),
    fadePass(root, '[data-fade]', REVEAL.fade),
    fadePass(root, '.ink-label', REVEAL.label),
  ].forEach((anim) => anim && running.push(anim));

  if (typeof ambient === 'function') {
    (ambient() || []).forEach((anim) => anim && running.push(anim));
  }

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(([entry]) => {
      running.forEach((anim) => (entry.isIntersecting ? anim.resume?.() : anim.pause?.()));
    }, { rootMargin: '120px' });
    observer.observe(root);
  }

  return {
    destroy() {
      observer?.disconnect();
      running.forEach((anim) => anim.pause?.());
      running.length = 0;
    },
  };
}

export { animate, createTimeline, stagger, steps, svg, utils };
