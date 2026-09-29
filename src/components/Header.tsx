import React, { useEffect, useState } from 'react';
import { Command, Download, Menu, Moon, Sun, X } from 'lucide-react';
import { Monogram } from './ui';
import { toggleTheme } from '../lib/theme';

const NAV = [
  { id: 'about', label: 'Profile' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light or dark theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition"
    >
      <Sun size={17} className="icon-sun" aria-hidden />
      <Moon size={17} className="icon-moon" aria-hidden />
    </button>
  );
}

export function Header({ name, onOpenPalette }: { name: string; onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  // Highlight the last section whose top has passed a third of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = '';
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom the last section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = NAV[NAV.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll); // fonts/images can change section offsets
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('load', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 font-display font-semibold tracking-tight text-ink">
          <Monogram size={30} />
          <span className="text-[15px]">{name}</span>
        </a>

        <nav aria-label="Sections" className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                active === item.id ? 'text-ink bg-surface-2' : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open quick actions (Ctrl+K)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition"
          >
            <Command size={17} aria-hidden />
          </button>
          <ThemeToggle />
          <a
            href="/Mohammed_Parker_CV.pdf"
            download
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-2 transition"
          >
            <Download size={15} aria-hidden />
            CV
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-surface-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Sections" className="lg:hidden border-t border-line bg-bg px-4 pb-4 pt-2">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-[15px] text-ink hover:bg-surface-2"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/Mohammed_Parker_CV.pdf"
            download
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-accent-ink"
          >
            <Download size={15} aria-hidden />
            Download CV (PDF)
          </a>
        </nav>
      )}
    </header>
  );
}
