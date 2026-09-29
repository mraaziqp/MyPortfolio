import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About, Education, Experience, Projects, Services, Skills } from './components/Sections';
import { Terminal } from './components/Terminal';
import { Contact } from './components/Contact';
import { ScrollChrome, Toaster, useReveal, useSpotlight } from './components/effects';
import { Card, Monogram } from './components/ui';
import { trackPageViewOnce, useProfile } from './lib/api';
import type { CvSyncPayload } from './types';

// Only downloaded when someone presses Ctrl+K or the quick-actions button.
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));

function Footer({ profile }: { profile: CvSyncPayload }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.fullName} ·{' '}
          {profile.location.replace(/\s+\d{4}$/, '')}
        </p>
        <p className="no-print flex flex-wrap gap-x-4 gap-y-1">
          <a href="/Mohammed_Parker_CV.pdf" download className="hover:text-ink">
            CV (PDF)
          </a>
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              LinkedIn
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              GitHub
            </a>
          )}
          <span className="hidden sm:inline">
            Press <kbd className="rounded border border-line px-1 font-mono text-[11px]">Ctrl K</kbd> for shortcuts
          </span>
        </p>
        {/* Printed copies point back to the live, always-current version. */}
        <div className="print-only mt-4 flex items-center gap-3">
          <img src="/qr.svg" alt="" width={64} height={64} />
          <p>Live version: {profile.websiteUrl}</p>
        </div>
      </div>
    </footer>
  );
}

/** Compact card for the ecosystem dashboard iframe (?portal=true). */
export function PortalCard({ profile }: { profile: CvSyncPayload }) {
  const current = profile.experiences.find((e) => e.isCurrent);
  return (
    <main className="min-h-screen bg-bg p-4">
      <Card className="mx-auto max-w-md p-5">
        <div className="flex items-center gap-3">
          <Monogram size={40} />
          <div>
            <p className="font-display font-semibold text-ink">{profile.fullName}</p>
            <p className="text-sm text-muted">{profile.headline}</p>
          </div>
        </div>
        {current && (
          <p className="mt-4 text-sm text-muted">
            Currently <span className="text-ink">{current.role}</span> at <span className="text-ink">{current.company}</span>
          </p>
        )}
        <p className="mt-1 font-mono text-xs text-subtle">
          CV {profile.version}
          {profile.rawCvMetadata?.parsedAt && ` · updated ${new Date(profile.rawCvMetadata.parsedAt).toLocaleDateString('en-ZA')}`}
        </p>
        <a
          href="/"
          target="_top"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline underline-offset-4"
        >
          Open portfolio <ArrowUpRight size={14} aria-hidden />
        </a>
      </Card>
    </main>
  );
}

export function PortalApp() {
  const { profile } = useProfile();
  return <PortalCard profile={profile} />;
}

export default function App() {
  const { profile, projects } = useProfile();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useReveal(profile);
  useSpotlight();

  useEffect(() => {
    trackPageViewOnce();
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openPalette = () => setPaletteOpen(true);

  return (
    <div className="min-h-screen overflow-x-clip bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-card"
      >
        Skip to content
      </a>
      <ScrollChrome />
      <Header name={profile.fullName} onOpenPalette={openPalette} />
      <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero profile={profile} projects={projects} onOpenPalette={openPalette} />
        <About profile={profile} projects={projects} />
        <Services />
        <Experience experiences={profile.experiences} />
        <Projects projects={projects} />
        <Skills profile={profile} projects={projects} />
        <Education profile={profile} />
        <Terminal profile={profile} projects={projects} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <Toaster />
      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette profile={profile} onClose={() => setPaletteOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
