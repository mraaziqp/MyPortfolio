import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Command,
  ContactRound,
  Copy,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Share2,
} from 'lucide-react';
import type { CvSyncPayload, ProjectShowcaseItem } from '../types';
import { formatMonth } from '../lib/format';
import { copyText, downloadVCard, headlineStats, shareSite } from '../lib/profile';
import { ROLES } from '../data/marketing';
import { toast } from './effects';
import { Card, buttonPrimary, buttonSecondary } from './ui';

function RotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="relative inline-block min-h-[1.3em]" aria-hidden>
      <span key={index} className="role-in">
        {ROLES[index]}
      </span>
    </span>
  );
}

const kitButton =
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted hover:bg-surface-2 hover:text-ink transition';

export function Hero({
  profile,
  projects,
  onOpenPalette,
}: {
  profile: CvSyncPayload;
  projects: ProjectShowcaseItem[];
  onOpenPalette: () => void;
}) {
  const current = profile.experiences.find((e) => e.isCurrent) ?? profile.experiences[0];
  const topEducation = profile.education[0];
  const topCert = profile.certifications[0];
  const open = profile.availability?.openToWork;
  const stats = headlineStats(profile, projects);

  const facts = [
    current && {
      icon: Briefcase,
      label: 'Current role',
      value: `${current.role} · ${current.company}`,
      sub: `Since ${formatMonth(current.startDate)}`,
    },
    topEducation && {
      icon: GraduationCap,
      label: 'Education',
      value: topEducation.degree,
      sub: `${topEducation.institution.replace(/\s+—.*$/, '')} · ${formatMonth(topEducation.year.replace(/^Graduated\s*/i, ''))}`,
    },
    topCert && { icon: Award, label: 'Certification', value: topCert.name, sub: topCert.issuer },
    { icon: MapPin, label: 'Location', value: profile.location.replace(/\s+\d{4}$/, ''), sub: 'SAST · UTC+2' },
  ].filter(Boolean) as Array<{ icon: typeof Briefcase; label: string; value: string; sub: string }>;

  return (
    <section id="top" className="relative pt-10 pb-12 sm:pt-16 sm:pb-16">
      <div className="hero-backdrop" aria-hidden />

      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div>
          {open && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              {profile.availability?.note || 'Open to new opportunities'}
            </p>
          )}

          <h1 className="font-display mt-5 text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold tracking-tight text-ink leading-[1.04]">
            {profile.fullName}
            <span className="sr-only">, {profile.headline}</span>
          </h1>
          <p className="font-display mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-accent-text">
            <RotatingRole />
          </p>

          <p className="mt-5 max-w-xl text-lg sm:text-xl font-medium leading-snug text-ink">
            I keep enterprise systems running — and build the software that runs on them.
          </p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            {current?.role || 'IT Admin'} at {current?.company || 'BCX'}, running VMware, Hyper-V and Active Directory to
            SLA. Full-stack developer shipping multi-tenant SaaS, recruitment and finance platforms with Next.js,
            TypeScript and PostgreSQL.
          </p>

          <div className="no-print mt-7 flex flex-wrap items-center gap-3">
            <a href="#contact" className={buttonPrimary}>
              Get in touch <ArrowRight size={16} aria-hidden />
            </a>
            <a href="/Mohammed_Parker_CV.pdf" download className={buttonSecondary}>
              <Download size={16} aria-hidden /> Download CV
            </a>
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted hover:text-ink transition"
            >
              <Command size={15} aria-hidden /> Quick actions
              <kbd className="rounded border border-line bg-surface px-1.5 font-mono text-[11px]">Ctrl K</kbd>
            </button>
          </div>

          <div className="no-print mt-5 flex flex-wrap items-center gap-1 -ml-2">
            <button
              type="button"
              className={kitButton}
              onClick={async () => toast((await copyText(profile.email)) ? 'Email address copied' : profile.email)}
            >
              <Copy size={15} aria-hidden /> {profile.email}
            </button>
            <button type="button" className={kitButton} onClick={() => downloadVCard(profile)}>
              <ContactRound size={15} aria-hidden /> Save contact
            </button>
            <button
              type="button"
              className={kitButton}
              onClick={async () => {
                const r = await shareSite(profile);
                if (r === 'copied') toast('Link copied');
              }}
            >
              <Share2 size={15} aria-hidden /> Share
            </button>
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className={kitButton}>
                <Linkedin size={15} aria-hidden /> LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={kitButton}>
                <Github size={15} aria-hidden /> GitHub
              </a>
            )}
          </div>
        </div>

        <Card className="spotlight overflow-hidden">
          <dl className="divide-y divide-line">
            {facts.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-4 p-4 sm:px-5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                  <Icon size={18} aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{label}</dt>
                  <dd className="mt-0.5 font-medium text-ink leading-snug">{value}</dd>
                  <dd className="text-sm text-muted">{sub}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="flex items-center gap-4 border-t border-line bg-surface-2 p-4 sm:px-5">
            <img src="/qr.svg" alt="QR code linking to this portfolio" width={64} height={64} className="rounded-md bg-white p-1" />
            <p className="text-sm text-muted">
              <span className="font-medium text-ink">Take it with you.</span> Scan to open this CV on your phone.
            </p>
          </div>
        </Card>
      </div>

      <ul aria-label="At a glance" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <li
            key={s.label}
            className={`bg-surface p-4 sm:p-5 ${i === stats.length - 1 && stats.length % 2 ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <p className="font-display text-3xl font-semibold tracking-tight text-ink" suppressHydrationWarning>
              {s.value}
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{s.label}</p>
            <p className="text-xs text-subtle">{s.hint}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
