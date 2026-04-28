import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';

// Serve files in `src/assets/` at `/assets/*` during dev, mirroring
// what the production build does via the post-`vite build` copy step.
function devAssetsAlias() {
  return {
    name: 'dev-assets-alias',
    configureServer(server) {
      const root = path.resolve(__dirname, 'src/assets');
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/assets/')) return next();
        const rel = decodeURIComponent(req.url.replace(/^\/assets\//, '').split('?')[0]);
        const filePath = path.join(root, rel);
        if (filePath.startsWith(root) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader('Cache-Control', 'no-cache');
          fs.createReadStream(filePath).pipe(res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), devAssetsAlias()],
});
