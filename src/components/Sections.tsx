import React from 'react';
import { Award, BadgeCheck, Github, GraduationCap } from 'lucide-react';
import type { CvSyncPayload, ProjectShowcaseItem, SkillCategoryMap } from '../types';
import { formatDuration, formatMonth, hostname } from '../lib/format';
import { track } from '../lib/api';
import { Card, Chip, ExternalLink, Section } from './ui';

// ---------------------------------------------------------------------------

/** "Graduated 04/2025" -> "Graduated Apr 2025"; "01/2023" -> "2023". */
const formatYear = (value: string) =>
  /^graduated/i.test(value) ? value.replace(/(\d{1,2}\/\d{4})/, (m) => formatMonth(m)) : value.replace(/^\d{1,2}\//, '');

const INTERESTS = [
  { title: 'Interactive tech & game development', text: 'Building VR simulations and mechanics in Unity and C#.' },
  { title: 'Hardware & electronics restoration', text: 'Component-level troubleshooting and physical computing.' },
  { title: 'Culinary arts', text: 'Precision coffee extraction and artisanal confectionery.' },
];

export function About({ profile }: { profile: CvSyncPayload }) {
  return (
    <Section id="about" eyebrow="Profile" title="Infrastructure discipline, product engineering">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <p className="text-[15px] sm:text-base leading-relaxed text-muted">{profile.summary}</p>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Outside work</h3>
          <ul className="mt-3 space-y-3">
            {INTERESTS.map((i) => (
              <li key={i.title}>
                <p className="font-medium text-ink">{i.title}</p>
                <p className="text-sm text-muted">{i.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------

export function Experience({ experiences }: { experiences: CvSyncPayload['experiences'] }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-8 sm:space-y-10 border-l border-line pl-6 sm:pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                exp.isCurrent ? 'border-accent bg-accent' : 'border-line bg-bg'
              }`}
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {exp.role} <span className="text-muted font-normal">· {exp.company}</span>
                </h3>
                <p className="text-sm text-subtle">{exp.location}</p>
              </div>
              <p className="shrink-0 font-mono text-xs text-muted sm:text-right">
                {formatMonth(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonth(exp.endDate)}
                <span className="text-subtle"> · {formatDuration(exp.startDate, exp.isCurrent ? null : exp.endDate)}</span>
              </p>
            </div>
            <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-muted">
              {(exp.keyAchievements.length ? exp.keyAchievements : [exp.summary]).map((a) => (
                <li key={a} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-subtle" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            {exp.technologies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ---------------------------------------------------------------------------

const STATUS: Record<NonNullable<ProjectShowcaseItem['status']>, { label: string; cls: string }> = {
  live: { label: 'Live', cls: 'text-ok' },
  'in-development': { label: 'In development', cls: 'text-subtle' },
  private: { label: 'Private', cls: 'text-subtle' },
};

export function Projects({ projects }: { projects: ProjectShowcaseItem[] }) {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected software & XR work"
      intro="Products I've designed and built end to end — from database schema to deployment."
    >
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {projects.map((p) => {
          const status = p.status ? STATUS[p.status] : null;
          return (
            <Card key={p.id} className="flex flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{p.category}</p>
                {status && (
                  <p className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.cls}`}>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                    {status.label}
                  </p>
                )}
              </div>
              <h3 className="font-display mt-2 text-xl font-semibold text-ink">{p.title}</h3>
              <p className="text-sm text-accent-text font-medium">{p.tagline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.description}</p>
              <p className="mt-3 text-sm text-subtle">
                Role: <span className="text-ink">{p.role}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
              {(p.liveUrl || p.githubUrl || p.links?.length) && (
                <div className="no-print mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
                  {p.liveUrl && /^https?:/.test(p.liveUrl) && (
                    <ExternalLink href={p.liveUrl} onClick={() => track(p.slug, 'click')}>
                      {hostname(p.liveUrl)}
                    </ExternalLink>
                  )}
                  {p.links?.map((l) => (
                    <ExternalLink key={l.url} href={l.url} onClick={() => track(p.slug, 'click')}>
                      {l.label}
                    </ExternalLink>
                  ))}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track(p.slug, 'click')}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
                    >
                      <Github size={15} aria-hidden /> Source
                    </a>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------

const SKILL_GROUPS: Array<{ key: keyof SkillCategoryMap; label: string; wide?: boolean }> = [
  { key: 'enterpriseAndIT', label: 'Enterprise IT & systems', wide: true },
  { key: 'cloudAndDevOps', label: 'Cloud & data' },
  { key: 'languages', label: 'Languages' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'aiAndArchitecture', label: 'AI & architecture' },
];

export function Skills({ skills }: { skills: SkillCategoryMap }) {
  return (
    <Section id="skills" eyebrow="Skills" title="Technical toolkit">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.filter((g) => skills[g.key]?.length).map((g) => (
          <Card key={g.key} className={`p-5 ${g.wide ? 'lg:col-span-2' : ''}`}>
            <h3 className="font-medium text-ink">{g.label}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {skills[g.key]!.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------

export function Education({ profile }: { profile: CvSyncPayload }) {
  return (
    <Section id="education" eyebrow="Education & certifications" title="Qualifications">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <ol className="space-y-5">
          {profile.education.map((e) => (
            <li key={e.id} className="flex gap-4">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                <GraduationCap size={18} aria-hidden />
              </span>
              <div>
                <h3 className="font-medium text-ink leading-snug">{e.degree}</h3>
                <p className="text-sm text-muted">
                  {e.institution} · <span className="font-mono text-xs">{formatYear(e.year)}</span>
                </p>
                {e.details && e.id === profile.education[0]?.id && (
                  <p className="mt-1 text-sm text-subtle">{e.details}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Certifications</h3>
          <ul className="mt-3 space-y-3">
            {profile.certifications.map((c) => (
              <li key={c.id}>
                <Card className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 text-accent-text">
                    {c.badgeUrl ? <BadgeCheck size={20} aria-hidden /> : <Award size={20} aria-hidden />}
                  </span>
                  <div>
                    <p className="font-medium text-ink leading-snug">
                      {c.badgeUrl ? (
                        <a href={c.badgeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </p>
                    <p className="text-sm text-muted">
                      {c.issuer}
                      {c.issueDate && <span className="font-mono text-xs"> · {c.issueDate}</span>}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
