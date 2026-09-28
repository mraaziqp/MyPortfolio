import React from 'react';
import { ArrowRight, Award, Briefcase, Download, Github, GraduationCap, Linkedin, Mail, MapPin } from 'lucide-react';
import type { CvSyncPayload } from '../types';
import { formatMonth } from '../lib/format';
import { Card, buttonPrimary, buttonSecondary } from './ui';

export function Hero({ profile }: { profile: CvSyncPayload }) {
  const current = profile.experiences.find((e) => e.isCurrent) ?? profile.experiences[0];
  const topEducation = profile.education[0];
  const topCert = profile.certifications[0];
  const open = profile.availability?.openToWork;

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
    <section id="top" className="pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div>
          {open && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              {profile.availability?.note || 'Open to new opportunities'}
            </p>
          )}

          <h1 className="font-display mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight text-ink leading-[1.05]">
            {profile.fullName}
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-accent-text font-medium">{profile.headline}</p>

          <p className="mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed text-muted">
            I keep enterprise VMware, Hyper-V and Active Directory environments running to SLA at{' '}
            {current?.company || 'BCX'}, and I design and ship full-stack platforms — multi-tenant SaaS, recruitment
            and finance tools — with Next.js, TypeScript and PostgreSQL.
          </p>

          <div className="no-print mt-7 flex flex-wrap items-center gap-3">
            <a href="#contact" className={buttonPrimary}>
              Get in touch <ArrowRight size={16} aria-hidden />
            </a>
            <a href="/Mohammed_Parker_CV.pdf" download className={buttonSecondary}>
              <Download size={16} aria-hidden /> Download CV
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                <Mail size={15} aria-hidden /> {profile.email}
              </a>
            </li>
            {profile.linkedinUrl && (
              <li>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-ink">
                  <Linkedin size={15} aria-hidden /> LinkedIn
                </a>
              </li>
            )}
            {profile.githubUrl && (
              <li>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-ink">
                  <Github size={15} aria-hidden /> GitHub
                </a>
              </li>
            )}
          </ul>
        </div>

        <Card className="p-2">
          <dl className="divide-y divide-line">
            {facts.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-4 p-4">
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
        </Card>
      </div>
    </section>
  );
}
