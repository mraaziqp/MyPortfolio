import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App, { PortalApp } from './App';
import './index.css';

const root = document.getElementById('root')!;

if (new URLSearchParams(window.location.search).has('portal')) {
  // The dashboard embed is a different page from the prerendered CV: render fresh.
  root.innerHTML = '';
  createRoot(root).render(
    <StrictMode>
      <PortalApp />
    </StrictMode>
  );
} else if (root.hasChildNodes()) {
  // Production: the CV was prerendered at build time — attach to it.
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Dev server: nothing prerendered.
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
