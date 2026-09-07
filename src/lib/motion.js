import { animate, createTimeline, stagger, svg } from 'animejs';

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function drawable(nodes) {
  if (!nodes) return [];
  const list = typeof nodes.length === 'number' ? nodes : [nodes];
  if (!list.length) return [];
  return svg.createDrawable(list);
}

export function drawLines(root, selector = '.ink-draw', opts = {}) {
  if (!root) return null;
  const nodes = root.querySelectorAll(selector);
  if (!nodes.length) return null;
  const targets = drawable(nodes);
  if (prefersReducedMotion()) {
    targets.forEach((t) => { t.draw = '0 1'; });
    return null;
  }
  return animate(targets, {
    draw: ['0 0', '0 1'],
    ease: opts.ease ?? 'inOut(2.4)',
    duration: opts.duration ?? 1100,
    delay: stagger(opts.stagger ?? 32),
  });
}

export { animate, createTimeline, stagger, svg };
