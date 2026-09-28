import React, { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About, Education, Experience, Projects, Skills } from './components/Sections';
import { Contact } from './components/Contact';
import { Card, Monogram } from './components/ui';
import { trackPageViewOnce, useProfile } from './lib/api';
import type { CvSyncPayload } from './types';

function Footer({ profile }: { profile: CvSyncPayload }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.fullName} · {profile.location.replace(/\s+\d{4}$/, '')}
        </p>
        <p className="no-print flex gap-4">
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
        </p>
      </div>
    </footer>
  );
}

/** Compact card for the ecosystem dashboard iframe (?portal=true). */
function PortalCard({ profile }: { profile: CvSyncPayload }) {
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

export default function App() {
  const { profile, projects } = useProfile();
  const isPortal = new URLSearchParams(window.location.search).has('portal');

  useEffect(() => {
    if (!isPortal) trackPageViewOnce();
  }, [isPortal]);

  if (isPortal) return <PortalCard profile={profile} />;

  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-card"
      >
        Skip to content
      </a>
      <Header name={profile.fullName} />
      <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero profile={profile} />
        <About profile={profile} />
        <Experience experiences={profile.experiences} />
        <Projects projects={projects} />
        <Skills skills={profile.skills} />
        <Education profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
