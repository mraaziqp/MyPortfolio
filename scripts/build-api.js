import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const endpoints = [
  { in: 'api_src/contact.ts', out: 'api/contact.js' },
  { in: 'api_src/sync-cv.ts', out: 'api/sync-cv.js' },
  { in: 'api_src/telemetry.ts', out: 'api/telemetry.js' },
  { in: 'api_src/agent-builder/bridge.ts', out: 'api/agent-builder/bridge.js' },
  { in: 'api_src/dashboard/[...slug].ts', out: 'api/dashboard/[...slug].js' },
  { in: 'api_src/jarvis/[...slug].ts', out: 'api/jarvis/[...slug].js' },
];

fs.rmSync(path.join(root, 'api'), { recursive: true, force: true });

for (const ep of endpoints) {
  const inPath = path.join(root, ep.in);
  const outPath = path.join(root, ep.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  esbuild.buildSync({
    entryPoints: [inPath],
    outfile: outPath,
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
  });
  console.log(`[API Build] Compiled ${ep.in} -> ${ep.out}`);
}
console.log('[API Build] All Serverless Functions bundled successfully.');
