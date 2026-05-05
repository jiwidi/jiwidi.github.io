<template>
  <main class="terminal-main">
    <div id="rterm" ref="termHost" class="rterm-host" tabindex="0" :style="hostStyle" @click="focusTerminal" @click.capture="onHostClick"></div>
    <section v-if="terminalState.previewPath" class="terminal-preview">
      <header class="preview-bar">
        <span class="preview-label">preview · {{ terminalState.previewPath }}</span>
        <button type="button" class="preview-close" @click="closePreview">close ×</button>
      </header>
      <div class="preview-body">
        <component v-if="previewComponent" :is="previewComponent" />
        <p v-else-if="previewError" class="preview-error">could not load preview for {{ terminalState.previewPath }}</p>
        <p v-else class="preview-loading">loading…</p>
      </div>
    </section>
  </main>
</template>

<script>
import { shallowRef, markRaw } from 'vue';
import { buildTerminalData } from '/src/lib/buildTerminalFs.js';
import { terminalState, exitTerminal, setPreview, clearPreview } from '/src/lib/terminalMode.js';

const SCRIPT_SRC = '/rTerm.js';

let scriptLoadPromise = null;
function loadScript() {
  if (window.rTerm) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load rTerm.js'));
    document.head.appendChild(s);
  });
  return scriptLoadPromise;
}

export default {
  name: 'Terminal',
  data() {
    return {
      terminalState,
      previewComponent: shallowRef(null),
      previewError: false,
    };
  },
  computed: {
    hostStyle() {
      const h = this.terminalState.lockedHeight;
      // terminal-main has a 2px bottom border; subtract so the outer
      // box matches the previously rendered <main> exactly.
      return h ? { height: Math.max(120, h - 2) + 'px' } : null;
    },
  },
  watch: {
    'terminalState.previewPath'(path) {
      this.loadPreview(path);
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('keydown', this.onTab, true);
    loadScript().then(() => {
      this.boot();
      this.attachAutoScroll();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      const host = this.$refs.termHost;
      if (host) host.textContent = 'failed to load terminal — check rTerm.js path';
    });
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('keydown', this.onTab, true);
    if (this._termObserver) this._termObserver.disconnect();
    if (this.$refs.termHost) this.$refs.termHost.innerHTML = '';
  },
  methods: {
    boot() {
      if (typeof window.rTerm !== 'function') return;
      const data = buildTerminalData();
      // eslint-disable-next-line new-cap
      this._term = new window.rTerm({
        div: 'rterm',
        username: 'jaimefh',
        hostname: '',
        fsstart: '/home/jiwidi/',
        data,
        url: window.location.pathname,
        max_height: 9999,
        maxStrings: 150,
        onInternalLink: (path) => setPreview(path),
      });
    },
    focusTerminal() {
      const host = document.getElementById('rterm');
      if (host) host.focus();
    },
    attachAutoScroll() {
      const host = this.$refs.termHost;
      const cli = host && host.querySelector('#termcli');
      if (!host || !cli) return;
      const scrollToBottom = () => {
        host.scrollTop = host.scrollHeight;
      };
      this._termObserver = new MutationObserver(scrollToBottom);
      this._termObserver.observe(cli, { childList: true, subtree: true, characterData: true });
      scrollToBottom();
    },
    onHostClick(ev) {
      // Intercept clicks on internal _ilink anchors rendered by `ls`,
      // route them through the preview pane instead of full navigation.
      const a = ev.target.closest && ev.target.closest('a.link');
      if (!a) return;
      const target = a.getAttribute('target');
      const href = a.getAttribute('href') || '';
      if (target === '_blank') return; // external — let it open
      if (!href || href.startsWith('http')) return;
      ev.preventDefault();
      ev.stopPropagation();
      setPreview(href);
    },
    closePreview() {
      clearPreview();
      this.focusTerminal();
    },
    onKey(e) {
      if (e.key === 'Escape') {
        if (terminalState.previewPath) {
          clearPreview();
        } else {
          exitTerminal();
        }
      }
    },
    onTab(e) {
      if (e.key !== 'Tab') return;
      const term = this._term;
      if (!term || !term.funcMap) return;
      e.preventDefault();
      e.stopPropagation();
      this.tryComplete(term);
    },
    tryComplete(term) {
      const input = term.input || '';
      const tokens = input.split(' ');
      const lastIdx = tokens.length - 1;
      const last = tokens[lastIdx];

      if (lastIdx === 0) {
        // command-name completion
        const cmds = Object.keys(term.funcMap).sort();
        this.applyCompletion(term, cmds, last, ' ');
        return;
      }

      // path completion against the fake fs
      let dirPart = '';
      let prefix = last;
      const slash = last.lastIndexOf('/');
      if (slash >= 0) {
        dirPart = last.slice(0, slash + 1); // include trailing /
        prefix = last.slice(slash + 1);
      }
      const lookupPath = dirPart || term.cdir || '.';
      let dirData;
      try {
        const result = term.getByPath(lookupPath);
        dirData = result && result[0];
      } catch (_err) {
        return;
      }
      if (!dirData || typeof dirData !== 'object') return;

      let entries = Object.keys(dirData);
      if (!prefix.startsWith('.')) entries = entries.filter((k) => !k.startsWith('.'));
      const matches = entries.filter((k) => k.startsWith(prefix)).sort();
      if (matches.length === 0) return;

      // append a / suffix when single match resolves to a directory
      let suffix = '';
      if (matches.length === 1) {
        const v = dirData[matches[0]];
        if (v && typeof v === 'object') suffix = '/';
      }
      this.applyCompletion(term, matches, prefix, suffix);
    },
    applyCompletion(term, matches, prefix, suffix) {
      if (matches.length === 1) {
        term.input += matches[0].slice(prefix.length) + suffix;
        term.updateTerm();
        return;
      }
      // multiple — extend by longest common prefix; if no progress, list them
      let lcp = matches[0];
      for (const m of matches) {
        while (m.indexOf(lcp) !== 0) lcp = lcp.slice(0, -1);
        if (!lcp) break;
      }
      if (lcp.length > prefix.length) {
        term.input += lcp.slice(prefix.length);
        term.updateTerm();
      } else {
        term.oldInput += term.termPrev + term.input + '<br>' + matches.join('&nbsp;&nbsp;') + '<br>';
        term.nStrings += 2;
        term.updateTerm();
      }
    },
    async loadPreview(path) {
      this.previewError = false;
      this.previewComponent = null;
      if (!path) return;
      try {
        const resolved = this.$router.resolve(path);
        const matched = resolved.matched && resolved.matched[0];
        if (!matched) {
          this.previewError = true;
          return;
        }
        const compOrLoader = matched.components && matched.components.default;
        if (!compOrLoader) {
          this.previewError = true;
          return;
        }
        let comp = compOrLoader;
        // Async/lazy route components are functions returning a promise.
        if (typeof comp === 'function' && !comp.render && !comp.setup) {
          const mod = await comp();
          comp = mod && (mod.default || mod);
        }
        if (!comp) {
          this.previewError = true;
          return;
        }
        this.previewComponent = markRaw(comp);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('preview load failed', err);
        this.previewError = true;
      }
    },
  },
};
</script>

<style>
.terminal-main {
  border: 2px solid var(--fg);
  border-top: 0;
  background: var(--bg);
  margin-bottom: 16px;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.rterm-host {
  padding: 8px 10px;
  /* roughly match the height of the regular page's <main> article
     (h1 + paragraphs + listDisplay) so toggling TUI doesn't change
     the outer box height. Internal scroll prevents growth. */
  height: clamp(360px, 55vh, 560px);
  overflow-y: auto;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--fg);
}

.terminal-preview {
  border-top: 1px dashed var(--fg);
  background: var(--bg);
  font-family: var(--font-sans);
}

.preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--fg);
  color: var(--bg);
  font: 12px/1.4 var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.preview-label { opacity: 0.95; }

.preview-close {
  background: transparent;
  border: 1px solid var(--bg);
  color: var(--bg);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  cursor: pointer;
}

.preview-close:hover {
  background: var(--bg);
  color: var(--fg);
}

.preview-body {
  padding: 0;
  max-height: 70vh;
  overflow: auto;
}

/* Strip nested `main` framing inside the preview so it doesn't double-border.
   Article padding is preserved. */
.preview-body main {
  border: 0 !important;
  margin: 0 !important;
  background: transparent !important;
}
.preview-body .home-container,
.preview-body .projects-container,
.preview-body .creative-container,
.preview-body .about-container,
.preview-body .photos-container { background: transparent; }

.preview-loading,
.preview-error {
  padding: 16px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  opacity: 0.7;
}

#term { color: var(--fg); }

#term b {
  color: var(--term-user);
  font-weight: 700;
}

#term .prompt-sep {
  color: var(--term-sigil);
  opacity: 0.7;
  margin: 0 1px;
}

#term .prompt-path {
  color: var(--term-path);
  font-weight: 600;
}

#term .prompt-sigil {
  color: var(--term-sigil);
  margin-left: 4px;
  font-weight: 600;
}

#term .cursor {
  color: var(--term-user);
  animation: rterm-blink 1.1s steps(2) infinite;
  margin-left: 1px;
  display: inline-block;
  will-change: opacity;
}

#term .link {
  color: var(--term-link);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
}

#term .link:hover {
  background: var(--term-link);
  color: var(--bg);
  text-decoration: none;
}

#term font[color] { color: inherit; }
#term font[color="#729FCF"] {
  color: var(--term-folder);
  font-weight: 600;
}

@keyframes rterm-blink {
  50% { opacity: 0; }
}
</style>
