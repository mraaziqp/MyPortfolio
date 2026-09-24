import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost:3000');
        const pathname = urlObj.pathname;

        try {
          let handlerModule: any = null;
          if (pathname.startsWith('/api/jarvis/')) {
            handlerModule = await import('./api/jarvis/[...slug].ts');
          } else if (pathname.startsWith('/api/dashboard/')) {
            handlerModule = await import('./api/dashboard/[...slug].ts');
          } else if (pathname === '/api/agent-builder/bridge') {
            handlerModule = await import('./api/agent-builder/bridge.ts');
          } else if (pathname === '/api/sync-cv') {
            handlerModule = await import('./api/sync-cv.ts');
          } else if (pathname === '/api/telemetry') {
            handlerModule = await import('./api/telemetry.ts');
          } else if (pathname === '/api/contact') {
            handlerModule = await import('./api/contact.ts');
          }

          if (handlerModule && handlerModule.default) {
            await handlerModule.default(req, res);
            return;
          }
        } catch (e: any) {
          console.error('[API Dev Plugin Error]', e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
