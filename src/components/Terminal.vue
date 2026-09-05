<template>
  <div class="terminal-main" :class="{ split: hasPreview }" :style="shellStyle">
    <div class="term-col">
      <div
        id="rterm"
        ref="termHost"
        class="rterm-host"
        tabindex="0"
        @click="focusTerminal"
        @click.capture="onHostClick"
      ></div>
    </div>
    <aside class="side" aria-hidden="!hasPreview">
      <div class="side-inner">
        <header class="side-bar">
          <span class="side-chip">{{ sideChip }}</span>
          <span class="side-path">{{ sidePath }}</span>
          <span class="side-spacer"></span>
          <span class="side-key">esc</span>
          <button type="button" class="side-close" @click="closePreview">close ×</button>
        </header>
        <div class="side-body">
          <component v-if="previewComponent" :is="previewComponent" />
          <p v-else-if="previewError" class="side-msg side-error">
            could not load preview for {{ terminalState.previewPath }}
          </p>
          <p v-else class="side-msg side-loading">loading…</p>
        </div>
      </div>
    </aside>
  </div>
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
    hasPreview() {
      return !!this.terminalState.previewPath;
    },
    shellStyle() {
      const h = this.terminalState.lockedHeight;
      return h ? { height: Math.max(120, h) + 'px' } : null;
    },
    sidePath() {
      return this.terminalState.previewPath || '';
    },
    sideChip() {
      const p = this.terminalState.previewPath || '';
      // surface section as the chip label: writing/foo → 'md', creative/x → 'md',
      // photography/x → 'set', projects → 'repo', etc. Default 'doc'.
      if (p.startsWith('/creative/keyboards')) return 'kb';
      if (p.startsWith('/writing/') || p.startsWith('/creative/')) return 'md';
      if (p.startsWith('/photography')) return 'set';
      if (p.startsWith('/projects')) return 'repo';
      if (p.startsWith('/about')) return 'me';
      return 'doc';
    },
  },
  watch: {
    'terminalState.previewPath'(path) {
      this.loadPreview(path);
      this.applyBodyClass();
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('keydown', this.onTab, true);
    this.applyBodyClass();
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
    document.body.classList.remove('split-cli');
  },
  methods: {
    applyBodyClass() {
      document.body.classList.toggle('split-cli', this.hasPreview);
    },
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
      const a = ev.target.closest && ev.target.closest('a.link');
      if (!a) return;
      const target = a.getAttribute('target');
      const href = a.getAttribute('href') || '';
      if (target === '_blank') return;
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
        const cmds = Object.keys(term.funcMap).sort();
        this.applyCompletion(term, cmds, last, ' ');
        return;
      }

      let dirPart = '';
      let prefix = last;
      const slash = last.lastIndexOf('/');
      if (slash >= 0) {
        dirPart = last.slice(0, slash + 1);
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
/* ───────────────────────────────────────────────
   Shell — flex container that owns the term column
   and the side preview column.
   ─────────────────────────────────────────────── */
.terminal-main {
  border: 0;
  background: transparent;
  margin: 0;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  display: flex;
  overflow: hidden;
  /* Fixed shell height — prevents the side preview's content from
     pushing the box taller. Inline lockedHeight from JS overrides this. */
  height: clamp(360px, 55vh, 560px);
}

.term-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 2px solid transparent;
  transition: border-right-color 240ms ease;
}

.terminal-main.split .term-col {
  border-right-color: var(--fg);
}

.rterm-host {
  flex: 1;
  min-height: 0;
  padding: 8px 10px;
  overflow-y: auto;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--fg);
}

/* ───────────────────────────────────────────────
   Side pane — width animates 0 → 54%.
   ─────────────────────────────────────────────── */
.side {
  width: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
  transition: width 480ms cubic-bezier(0.65, 0, 0.35, 1);
}

.terminal-main.split .side {
  width: 54%;
}

.side-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  opacity: 0;
  transform: translateX(12px);
  transition:
    opacity 320ms 160ms cubic-bezier(0.65, 0, 0.35, 1),
    transform 320ms 160ms cubic-bezier(0.65, 0, 0.35, 1);
}

.terminal-main.split .side-inner {
  opacity: 1;
  transform: translateX(0);
}

.side-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--fg);
  color: var(--bg);
  font: 12px/1.4 var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.side-chip {
  background: var(--bg);
  color: var(--fg);
  padding: 1px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.side-path {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-spacer { flex: 1; }

.side-key {
  border: 1px solid var(--bg);
  opacity: 0.7;
  padding: 1px 6px;
  font-size: 10px;
}

.side-close {
  background: transparent;
  border: 1px solid var(--bg);
  color: var(--bg);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 2px 10px;
  cursor: pointer;
  text-transform: uppercase;
}
.side-close:hover { background: var(--bg); color: var(--fg); }

.side-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: var(--font-sans);
}

/* Strip the inner main border/background so it doesn't double-frame. */
.side-body main {
  border: 0 !important;
  margin: 0 !important;
  background: transparent !important;
}
.side-body .home-container,
.side-body .projects-container,
.side-body .creative-container,
.side-body .about-container,
.side-body .photos-container { background: transparent; }

.side-msg {
  padding: 16px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  opacity: 0.7;
}

/* ───────────────────────────────────────────────
   Mobile — stack vertically.
   ─────────────────────────────────────────────── */
@media (max-width: 720px) {
  .terminal-main {
    flex-direction: column;
  }
  .terminal-main.split .term-col {
    border-right-color: transparent;
    border-bottom: 2px solid var(--fg);
    flex: 1 1 50%;
  }
  .terminal-main.split .side {
    width: 100% !important;
    flex: 1 1 50%;
  }
}

/* ───────────────────────────────────────────────
   rTerm output coloring (unchanged)
   ─────────────────────────────────────────────── */
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
