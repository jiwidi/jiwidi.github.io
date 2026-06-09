// Route changes animate through the View Transitions API: the DOM swaps
// instantly and the browser crossfades composited snapshots, so navigation
// has zero dead time (unlike out-in component transitions, which wait for a
// fade-out before mounting the next page). Browsers without the API simply
// get an instant swap.
//
// The animation itself is defined in scss/_main.scss under
// `::view-transition-*` — topnav, main and footer each get their own
// snapshot so the chrome stays put while page content morphs.

import { nextTick } from 'vue';
import { START_LOCATION } from 'vue-router';
import { terminalState } from './terminalMode.js';

export function installViewTransitions(router) {
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
    return;
  }

  let finishTransition = null;

  // Unfreeze rendering. Safe to call when no transition is pending.
  const settle = () => {
    if (finishTransition) {
      finishTransition();
      finishTransition = null;
    }
  };

  router.beforeResolve((to, from) => {
    if (from === START_LOCATION) return; // initial load — nothing to animate
    if (to.fullPath === from.fullPath) return;
    if (terminalState.active) return; // CLI handles its own rendering
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    settle(); // a rapid second navigation must release the previous snapshot

    return new Promise((proceed) => {
      let localDone = null;
      const transition = document.startViewTransition(
        () =>
          new Promise((done) => {
            localDone = done;
            finishTransition = done;
            proceed(); // let vue-router confirm the navigation and patch the DOM
          })
      );
      // Safety net: if the browser abandons the transition (skipped,
      // interrupted, snapshot failure), release the frozen callback so the
      // page never hangs. Only settle globally if a newer navigation hasn't
      // already taken over.
      transition.ready.catch(() => {
        if (!localDone) return;
        if (finishTransition === localDone) settle();
        else localDone();
      });
    });
  });

  // The DOM is patched on the tick after navigation confirms; only then may
  // the browser snapshot the new state and start animating.
  router.afterEach(() => {
    nextTick(settle);
  });
  router.onError(settle);
}
