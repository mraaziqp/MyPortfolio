/**
 * Injects the server-rendered CV into dist/index.html so search engines and
 * link previews see real content, and visitors see it before JS loads.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverDir = path.join(root, 'dist-server');
const indexPath = path.join(root, 'dist', 'index.html');

const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const appHtml = render();
const template = fs.readFileSync(indexPath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('prerender: #root marker not found in dist/index.html');

fs.writeFileSync(indexPath, template.replace(marker, `<div id="root">${appHtml}</div>`));
fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`[prerender] Injected ${(appHtml.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
