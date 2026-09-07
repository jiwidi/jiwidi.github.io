<template>
  <figure class="rangefinder" aria-label="Interactive film camera">
    <figcaption class="camera-caption">
      <span>RANGEFINDER / 01</span>
      <button type="button" class="xray-toggle" :aria-pressed="xray" :disabled="loading || failed" @click="toggleXray">{{ xray ? '◉ X-ray on' : '◎ X-ray' }}</button>
    </figcaption>
    <div
      ref="stage" class="camera-stage" tabindex="0" role="group"
      aria-label="3D camera. Drag to turn it, including the back. Arrow keys rotate; Home resets the view. The red lever advances film; the yellow button releases the shutter."
      @keydown="rotateWithKeys"
    >
      <p v-if="loading || failed" class="camera-placeholder" role="status">{{ failed ? 'The 3D view is unavailable. Film controls still work below.' : 'Loading camera…' }}</p>
      <span v-if="exposing && !xray" class="camera-exposure" aria-hidden="true" />
      <span v-if="xray" class="cutaway-caption">Schematic cutaway</span>
    </div>
    <div v-if="xray" class="cutaway-tools">
      <div class="cutaway-parts" aria-label="Inspect camera internals">
        <button v-for="part in parts" :key="part.value" type="button" :aria-pressed="inspection === part.value" @click="inspect(part.value)">{{ part.label }}</button>
      </div>
      <label v-if="inspection !== 'shutter'" class="focus-control">
        <span>Focus</span>
        <input v-model.number="focus" type="range" min="0" max="1" step="0.01" aria-label="Rangefinder focus" @input="updateFocus">
        <svg viewBox="0 0 52 24" aria-hidden="true"><rect x="1" y="1" width="50" height="22" fill="none" stroke="currentColor" opacity=".3"/><path d="M21 6h10v12H21Z" fill="none" stroke="currentColor"/><path :transform="`translate(${(focus - 0.5) * 22} 0)`" d="M21 6h10v12H21Z" fill="none" stroke="currentColor" opacity=".5"/></svg>
        <span class="focus-state">{{ Math.abs(focus - .5) < .045 ? 'aligned' : 'align images' }}</span>
      </label>
    </div>
    <div class="camera-controls">
      <button :disabled="ready || winding || exposing" @click="advance"><span class="control-dot" />Advance film</button>
      <span class="frame-counter" aria-label="Frame counter">{{ String(frame).padStart(2, '0') }}<span> / 36</span></span>
      <button :disabled="!ready || winding || exposing" @click="shoot"><span class="control-dot shutter-dot" />Shoot</button>
    </div>
    <div class="camera-footnote"><span role="status">{{ status }}</span><button @click="resetView" aria-label="Reset camera rotation">Reset view ↺</button></div>
  </figure>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { createCameraCutaway } from '/src/lib/camera/CameraCutaway.js';
import { createCameraExterior } from '/src/lib/camera/CameraExterior.js';

const stage = ref(null);
const ready = ref(false);
const xray = ref(false);
const inspection = ref('all');
const focus = ref(0.28);
const winding = ref(false);
const parts = [{ value: 'all', label: 'All' }, { value: 'shutter', label: 'Film & shutter' }, { value: 'rangefinder', label: 'Rangefinder' }];
const exposing = ref(false);
const frame = ref(0);
const loading = ref(true);
const failed = ref(false);
const hasShot = ref(false);
const status = computed(() => exposing.value ? 'Shutter travelling across the film.' : winding.value ? 'Advancing film. Cocking the shutter.' : ready.value ? 'Frame ready. Make a photograph.' : hasShot.value ? 'Moment kept. Advance for the next.' : 'Drag to explore. Advance to begin.');
let renderer, scene, camera, controls, cameraBody, shutter, lever, exterior, cutaway, redMaterial;
let resizeObserver, themeObserver, visibilityObserver, preference;
let THREE;
let disposed = false;
let visible = true;
let drawFrame = 0;
let exposureTimer;
let windStart = 0;
let windDuration = 460;
let exposureStart = 0;
let exposureDuration = 220;
let clickStart = null;
let removePointerListeners = () => {};
const request = new AbortController();
const START = [100, 100, 190];

function render() {
  if (!renderer || !camera || disposed || !visible || document.hidden) return;
  renderer.render(scene, camera);
}

function animateControls(time) {
  drawFrame = 0;
  if (disposed) return;
  const windProgress = winding.value ? Math.min(1, (time - windStart) / windDuration) : 1;
  const roll = Math.min(1, windProgress / .72);
  const wound = roll * roll * (3 - 2 * roll);
  if (lever) lever.rotation.y = winding.value ? 0.95 * (windProgress < .72 ? wound : (1 - windProgress) / .28) : 0;
  if (winding.value) {
    cutaway?.transport(wound);
    cutaway?.cock(wound);
  }
  if (windProgress === 1) winding.value = false;
  const exposureProgress = exposing.value ? Math.min(1, (time - exposureStart) / exposureDuration) : null;
  if (!winding.value) cutaway?.exposure(exposureProgress, ready.value);
  if (shutter) shutter.position.y = 37.956 - (exposing.value ? 1.5 : 0);
  render();
  if ((winding.value || (exposing.value && exposureProgress < 1)) && visible && !document.hidden) drawFrame = requestAnimationFrame(animateControls);
}

function advance() {
  if (ready.value || exposing.value || winding.value) return;
  frame.value = frame.value % 36 + 1;
  ready.value = true;
  if (lever && !preference?.matches) {
    cancelAnimationFrame(drawFrame);
    windStart = performance.now();
    windDuration = xray.value ? 1500 : 650;
    winding.value = true;
    drawFrame = requestAnimationFrame(animateControls);
  } else {
    cutaway?.transport(1);
    cutaway?.cock(1);
  }
  render();
}

function shoot() {
  if (!ready.value || winding.value || exposing.value) return;
  ready.value = false;
  hasShot.value = true;
  exposing.value = true;
  exposureStart = performance.now();
  exposureDuration = preference?.matches ? 150 : xray.value ? 1300 : 220;
  if (shutter) shutter.position.y = 36.456;
  if (!preference?.matches) {
    cutaway?.exposure(0, false);
    cancelAnimationFrame(drawFrame);
    drawFrame = requestAnimationFrame(animateControls);
  } else cutaway?.exposure(null, false);
  render();
  clearTimeout(exposureTimer);
  exposureTimer = setTimeout(() => {
    exposing.value = false;
    if (shutter) shutter.position.y = 37.956;
    cutaway?.exposure(null, false);
    render();
  }, exposureDuration);
}

function toggleXray() {
  xray.value = !xray.value;
  exterior?.xray(xray.value);
  if (cutaway) cutaway.group.visible = xray.value;
  render();
}

function inspect(value) {
  inspection.value = value;
  cutaway?.inspect(value);
  render();
}

function updateFocus() {
  cutaway?.focus(focus.value);
  exterior?.focus(focus.value);
  render();
}

function resetView() {
  if (!camera || !controls) return;
  camera.position.set(...START);
  controls.target.set(0, 0, 0);
  controls.update();
  render();
}

function rotateWithKeys(event) {
  if (event.target !== stage.value || !camera || !controls) return;
  if (event.key === 'Home') { event.preventDefault(); resetView(); return; }
  const keys = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] };
  if (!keys[event.key]) return;
  event.preventDefault();
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += keys[event.key][0];
  spherical.phi = THREE.MathUtils.clamp(spherical.phi + keys[event.key][1], 0.12, Math.PI - 0.12);
  camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
  controls.update();
}

function syncTheme() {
  if (!renderer || !exterior) return;
  const style = getComputedStyle(stage.value);
  const ink = new THREE.Color(style.getPropertyValue('--fg').trim());
  const paper = new THREE.Color(style.getPropertyValue('--bg').trim());
  const accent = new THREE.Color(style.getPropertyValue('--accent').trim());
  exterior.theme(ink, paper, accent);
  cutaway.theme(ink, paper, accent);
  redMaterial.color.set(style.getPropertyValue('--control-red').trim());
  exterior.shutterMaterial.color.set(style.getPropertyValue('--yellow').trim());
  render();
}

function resize() {
  if (!renderer || !stage.value) return;
  const { width, height } = stage.value.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  render();
}

function pauseRendering() {
  cancelAnimationFrame(drawFrame);
  drawFrame = 0;
  if (lever) lever.rotation.y = 0;
  winding.value = false;
  if (shutter) shutter.position.y = 37.956;
  cutaway?.transport(1);
  exposing.value = false;
  clearTimeout(exposureTimer);
  cutaway?.exposure(null, ready.value);
  render();
}

function handleVisibility() {
  if (document.hidden) pauseRendering();
  else render();
}

onMounted(async () => {
  try {
    const [three, { OrbitControls }, { STLLoader }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js'),
      import('three/addons/loaders/STLLoader.js'),
    ]);
    if (disposed) return;
    THREE = three;
    const response = await fetch('/models/rangefinder.stl', { signal: request.signal });
    if (!response.ok) throw new Error('Camera model unavailable');
    const bytes = await response.arrayBuffer();
    if (disposed) return;
    const geometry = new STLLoader().parse(bytes);
    geometry.rotateX(-Math.PI / 2);
    geometry.rotateY(Math.PI);
    geometry.center();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, 1, 1500);
    camera.position.set(...START);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    stage.value.appendChild(renderer.domElement);

    cameraBody = new THREE.Group();
    scene.add(cameraBody);
    exterior = createCameraExterior(THREE, geometry);
    cameraBody.add(exterior.group);
    cutaway = createCameraCutaway(THREE);
    cutaway.group.visible = false;
    cameraBody.add(cutaway.group);
    cutaway.exposure(null, ready.value);
    cutaway.focus(focus.value);
    redMaterial = exterior.controlMaterial;
    shutter = exterior.shutter;
    lever = exterior.lever;
    cutaway.transport(0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = false;
    controls.rotateSpeed = 0.65;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI - 0.12;
    controls.addEventListener('change', render);
    controls.update();

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hitAt = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      ndc.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      // Compare against the body too so controls cannot be clicked through its back.
      const hits = raycaster.intersectObjects(cameraBody.children, true);
      return hits.find((hit) => hit.object.isMesh && !hit.object.userData.cutaway && !(xray.value && hit.object.userData.shell))?.object.userData.action;
    };
    const down = (event) => {
      if (event.button !== 0) return;
      stage.value.focus({ preventScroll: true });
      clickStart = { x: event.clientX, y: event.clientY, id: event.pointerId, action: hitAt(event) };
      if (clickStart.action) controls.enabled = false;
    };
    const up = (event) => {
      controls.enabled = true;
      if (clickStart && event.pointerId === clickStart.id && Math.hypot(event.clientX - clickStart.x, event.clientY - clickStart.y) < 6) {
        if (clickStart.action === 'advance' && hitAt(event) === 'advance') advance();
        if (clickStart.action === 'shoot' && hitAt(event) === 'shoot') shoot();
      }
      clickStart = null;
    };
    const move = (event) => { renderer.domElement.style.cursor = hitAt(event) ? 'pointer' : event.buttons ? 'grabbing' : 'grab'; };
    const cancel = () => { controls.enabled = true; clickStart = null; };
    // Capture runs before OrbitControls so clicking a control doesn't start a drag.
    renderer.domElement.addEventListener('pointerdown', down, true);
    window.addEventListener('pointerup', up);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointercancel', cancel);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    removePointerListeners = () => {
      renderer.domElement.removeEventListener('pointerdown', down, true);
      window.removeEventListener('pointerup', up);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointercancel', cancel);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    };
    preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    preference.addEventListener('change', pauseRendering);
    document.addEventListener('visibilitychange', handleVisibility);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage.value);
    themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) render(); else pauseRendering(); });
    visibilityObserver.observe(stage.value);
    loading.value = false;
    syncTheme();
    resize();
  } catch (error) {
    if (!disposed) { loading.value = false; failed.value = true; }
  }
});

function contextLost(event) {
  event.preventDefault();
  failed.value = true;
  pauseRendering();
}

onBeforeUnmount(() => {
  disposed = true;
  request.abort();
  cancelAnimationFrame(drawFrame);
  clearTimeout(exposureTimer);
  removePointerListeners();
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  visibilityObserver?.disconnect();
  preference?.removeEventListener('change', pauseRendering);
  document.removeEventListener('visibilitychange', handleVisibility);
  controls?.dispose();
  const geometries = new Set(), materials = new Set();
  scene?.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => { material.map?.dispose(); material.dispose(); });
  renderer?.dispose();
  renderer?.domElement.remove();
});
</script>

<style scoped>
.rangefinder { width: 100%; min-width: 0; max-width: 420px; margin: 0; color: var(--fg); align-self: start; }
.camera-caption { display: flex; align-items: center; justify-content: space-between; font: 9px/1.4 var(--font-mono); letter-spacing: .15em; color: var(--muted); padding: 0 0 7px; border-bottom: 1px solid var(--rule_soft); }
.camera-stage { position: relative; height: clamp(260px, 23vw, 300px); cursor: grab; touch-action: none; user-select: none; }
.camera-stage :deep(canvas) { display: block; width: 100%; height: 100%; }
.camera-placeholder { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; padding: 24px; font: 11px/1.6 var(--font-mono); color: var(--muted); text-align: center; }
.camera-exposure { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 0 1px var(--fg); background: var(--bg); opacity: .12; }
.camera-controls { border-top: 1px solid var(--rule_soft); border-bottom: 1px solid var(--rule_soft); padding: 10px 0; display: flex; align-items: center; justify-content: space-between; gap: 7px; }
.camera-controls button { padding: 4px 0; border: 0; color: var(--fg); background: none; font: 10px/1.2 var(--font-mono); cursor: pointer; display: inline-flex; gap: 6px; align-items: center; }
.camera-controls button:disabled { opacity: .4; cursor: default; }
.control-dot { width: 5px; height: 5px; background: var(--control-red); border-radius: 50%; }
.shutter-dot { background: var(--yellow); }
.frame-counter { font: 12px/1 var(--font-mono); font-variant-numeric: tabular-nums; }
.frame-counter > span { font-size: 9px; color: var(--muted); }
.camera-footnote { display: flex; align-items: start; justify-content: space-between; gap: 7px; padding-top: 9px; font: 9px/1.5 var(--font-mono); color: var(--muted); }
.camera-footnote button { color: inherit; font: inherit; white-space: nowrap; padding: 0; border: 0; background: transparent; cursor: pointer; }
button:focus-visible, .camera-stage:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.camera-footnote button:hover { color: var(--fg); }
@media (max-width: 700px) { .camera-stage { height: 260px; } }
@media (prefers-reduced-motion: reduce) { .camera-exposure { background: none; opacity: .5; } }

.xray-toggle { font: inherit; letter-spacing: .05em; border: 1px solid var(--rule_soft); padding: 5px 9px; color: var(--fg); background: transparent; cursor: pointer; }
.xray-toggle[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.xray-toggle:disabled { opacity: .5; cursor: default; }
.cutaway-caption { position: absolute; bottom: 8px; left: 0; font: 8px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); pointer-events: none; }
.cutaway-tools { border-top: 1px solid var(--rule_soft); padding-block: 8px; }
.cutaway-parts { display: flex; gap: 5px; }
.cutaway-parts button { border: 1px solid transparent; background: none; color: var(--muted); font: 9px/1.4 var(--font-mono); padding: 4px 7px; cursor: pointer; }
.cutaway-parts button[aria-pressed="true"] { border-color: var(--rule_soft); color: var(--fg); background: var(--accent-soft); }
.focus-control { display: flex; align-items: center; gap: 9px; margin-top: 9px; font: 9px var(--font-mono); color: var(--muted); }
.focus-control input { flex: 1; width: 50px; min-width: 0; height: 16px; accent-color: var(--accent); }
.focus-control svg { width: 52px; height: 24px; flex: 0 0 52px; }
.focus-state { min-width: 70px; font-size: 8px; }
</style>
