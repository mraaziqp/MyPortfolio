import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';

/**
 * Serves the API from api_src/ during `npm run dev`, mirroring the Vercel
 * Function routes, so the site and its endpoints can be exercised locally.
 */
function apiDevPlugin(): Plugin {
  const routes: Array<[RegExp, string]> = [
    [/^\/api\/jarvis(\/|$)/, '/api_src/jarvis/[...slug].ts'],
    [/^\/api\/dashboard(\/|$)/, '/api_src/dashboard/[...slug].ts'],
    [/^\/api\/agent-builder\/bridge$/, '/api_src/agent-builder/bridge.ts'],
    [/^\/api\/sync-cv$/, '/api_src/sync-cv.ts'],
    [/^\/api\/telemetry$/, '/api_src/telemetry.ts'],
    [/^\/api\/contact$/, '/api_src/contact.ts'],
    [/^\/api\/profile$/, '/api_src/profile.ts'],
    [/^\/api\/health$/, '/api_src/health.ts'],
  ];
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        const pathname = new URL(req.url, 'http://localhost').pathname;
        const match = routes.find(([re]) => re.test(pathname));
        if (!match) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: false, error: 'Not found' }));
        }
        const mod = await server.ssrLoadModule(match[1]);
        await mod.default(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose non-VITE_ variables to the dev API handlers (never to the client bundle).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''), process.env);
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
