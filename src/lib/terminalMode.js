import { reactive } from 'vue';

// Global terminal-mode state. Survives route changes; reset on full reload.
export const terminalState = reactive({
  active: false,
  previewPath: null,
  // Pixel height of the page <main> measured at toggle-on time, so the
  // terminal box matches what was on screen and the page doesn't jump.
  lockedHeight: null,
});

export function toggleTerminal() {
  if (!terminalState.active) {
    const main = document.querySelector('#app > main');
    if (main) terminalState.lockedHeight = Math.round(main.getBoundingClientRect().height);
  } else {
    terminalState.lockedHeight = null;
    terminalState.previewPath = null;
  }
  terminalState.active = !terminalState.active;
}

export function exitTerminal() {
  terminalState.active = false;
  terminalState.previewPath = null;
  terminalState.lockedHeight = null;
}

export function setPreview(path) {
  terminalState.previewPath = path || null;
}

export function clearPreview() {
  terminalState.previewPath = null;
}
