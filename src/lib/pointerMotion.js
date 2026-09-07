// A small, damped response to the pointer. Frames run only while settling.
// The CSS variables live on `surface`; a larger `trigger` can listen for movement.
export function mountPointerMotion(surface, { trigger = surface, onUpdate } = {}) {
  if (!surface || !trigger) return { destroy() {} };

  const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0;
  let previousTime = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let active = 0;
  let targetActive = 0;
  let angle = 0;
  let targetAngle = 0;
  let destroyed = false;

  const paint = () => {
    surface.style.setProperty('--pointer-x', x.toFixed(4));
    surface.style.setProperty('--pointer-y', y.toFixed(4));
    surface.style.setProperty('--pointer-active', active.toFixed(4));
    surface.style.setProperty('--pointer-angle', `${angle.toFixed(2)}deg`);
    onUpdate?.({ x, y, active, angle });
  };

  const tick = (time) => {
    const elapsed = previousTime ? Math.min(time - previousTime, 40) : 16;
    previousTime = time;
    const blend = 1 - Math.exp(-elapsed / 90);
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    active += (targetActive - active) * blend;
    angle += (targetAngle - angle) * blend;
    const settled = Math.abs(targetX - x) + Math.abs(targetY - y)
      + Math.abs(targetActive - active) + Math.abs(targetAngle - angle) / 180 < 0.001;
    if (settled) { x = targetX; y = targetY; active = targetActive; angle = targetAngle; }
    paint();
    frame = settled ? 0 : requestAnimationFrame(tick);
    if (settled) previousTime = 0;
  };

  const schedule = () => {
    if (!frame && !destroyed) frame = requestAnimationFrame(tick);
  };

  const move = (event) => {
    if (!preference.matches || event.pointerType === 'touch') return;
    const rect = surface.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
    targetActive = 1;
    const nextAngle = Math.atan2(event.clientX - rect.left - rect.width / 2,
      -(event.clientY - rect.top - rect.height / 2)) * 180 / Math.PI;
    // Take the shortest arc when crossing north.
    targetAngle = angle + (((nextAngle - angle + 180) % 360 + 360) % 360) - 180;
    schedule();
  };

  const reset = () => {
    targetX = 0;
    targetY = 0;
    targetActive = 0;
    targetAngle = 0;
    schedule();
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    x = y = targetX = targetY = 0;
    active = targetActive = angle = targetAngle = 0;
    paint();
  };

  trigger.addEventListener('pointermove', move, { passive: true });
  trigger.addEventListener('pointerleave', reset);
  trigger.addEventListener('pointercancel', reset);
  preference.addEventListener('change', stop);
  window.addEventListener('blur', stop);

  return {
    destroy() {
      destroyed = true;
      stop();
      trigger.removeEventListener('pointermove', move);
      trigger.removeEventListener('pointerleave', reset);
      trigger.removeEventListener('pointercancel', reset);
      preference.removeEventListener('change', stop);
      window.removeEventListener('blur', stop);
      surface.style.removeProperty('--pointer-x');
      surface.style.removeProperty('--pointer-y');
      surface.style.removeProperty('--pointer-active');
      surface.style.removeProperty('--pointer-angle');
    },
  };
}
