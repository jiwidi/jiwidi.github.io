import { reactive } from 'vue';

// Global terminal-mode state. Survives route changes; reset on full reload.
export const terminalState = reactive({
  active: false,
  previewPath: null,
});

export function toggleTerminal() {
  terminalState.active = !terminalState.active;
  if (!terminalState.active) terminalState.previewPath = null;
}

export function exitTerminal() {
  terminalState.active = false;
  terminalState.previewPath = null;
}

export function setPreview(path) {
  terminalState.previewPath = path || null;
}

export function clearPreview() {
  terminalState.previewPath = null;
}
