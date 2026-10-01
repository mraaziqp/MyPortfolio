import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Building2,
  Cloud,
  CodeXml,
  Github,
  Glasses,
  GraduationCap,
  Hammer,
  MousePointerClick,
  Server,
} from 'lucide-react';
import type { CvSyncPayload, ProjectShowcaseItem, SkillCategoryMap } from '../types';
import { formatDuration, formatMonth, hostname } from '../lib/format';
import { track } from '../lib/api';
import { skillUsage } from '../lib/profile';
import { BUSINESS, COVERS, SERVICES } from '../data/marketing';
import { Card, Chip, ExternalLink, Section } from './ui';

/** "Graduated 04/2025" -> "Graduated Apr 2025"; "01/2023" -> "2023". */
const formatYear = (value: string) =>
  /^graduated/i.test(value) ? value.replace(/(\d{1,2}\/\d{4})/, (m) => formatMonth(m)) : value.replace(/^\d{1,2}\//, '');

const pill = (active: boolean) =>
  `rounded-full border px-3 py-1 text-sm transition ${
    active ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-muted hover:text-ink hover:border-subtle'
  }`;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

const INTERESTS = [
  { title: 'Interactive tech & game development', text: 'Building VR simulations and mechanics in Unity and C#.' },
  { title: 'Hardware & electronics restoration', text: 'Component-level troubleshooting and physical computing.' },
  { title: 'Culinary arts', text: 'Precision coffee extraction and artisanal confectionery.' },
];

export function About({ profile, projects }: { profile: CvSyncPayload; projects: ProjectShowcaseItem[] }) {
  const building = projects.filter((p) => p.status === 'in-development');
  return (
    <Section id="about" eyebrow="Profile" title="Infrastructure discipline, product engineering">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div className="reveal space-y-6">
          <p className="text-[15px] sm:text-base leading-relaxed text-muted">{profile.summary}</p>
          {building.length > 0 && (
            <Card className="spotlight p-5">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text">
                <Hammer size={14} aria-hidden /> Currently building
              </p>
              <ul className="mt-3 space-y-2">
                {building.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-baseline gap-x-2">
                    <a href="#projects" className="font-medium text-ink hover:underline underline-offset-4">
                      {p.title}
                    </a>
                    <span className="text-sm text-muted">— {p.tagline}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
        <div className="reveal">
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
// Services
// ---------------------------------------------------------------------------

const SERVICE_ICONS: Record<string, typeof Server> = {
  infrastructure: Server,
  product: CodeXml,
  cloud: Cloud,
  xr: Glasses,
};

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="What I bring"
      title="Two disciplines, one engineer"
      intro="Most teams hire for infrastructure or for software. I work across both — so what gets built is also easy to run."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.id] || Server;
          return (
            <Card key={s.id} className="reveal spotlight p-5 sm:p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-[15px] text-muted">{s.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {s.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.stack.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="reveal no-print mt-5 flex flex-col gap-4 rounded-xl border border-accent/30 bg-accent-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <Building2 size={20} aria-hidden />
          </span>
          <div>
            <p className="font-display font-semibold text-ink">{BUSINESS.name}</p>
            <p className="text-sm text-muted">{BUSINESS.pitch}</p>
          </div>
        </div>
        <a
          href={BUSINESS.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          Start a project <ArrowUpRight size={15} aria-hidden />
        </a>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export function Experience({ experiences }: { experiences: CvSyncPayload['experiences'] }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-8 sm:space-y-10 border-l border-line pl-6 sm:pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="reveal relative">
            <span
              aria-hidden
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                exp.isCurrent ? 'border-accent bg-accent shadow-[0_0_0_4px_var(--accent-soft)]' : 'border-line bg-bg'
              }`}
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {exp.role} <span className="text-muted font-normal">· {exp.company}</span>
                </h3>
                <p className="text-sm text-subtle">
                  {exp.location}
                  {exp.enterpriseDomain && <span className="hidden sm:inline"> · {exp.enterpriseDomain}</span>}
                </p>
              </div>
              <p className="shrink-0 font-mono text-xs text-muted sm:text-right">
                {formatMonth(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonth(exp.endDate)}
                <span className="text-subtle" suppressHydrationWarning>
                  {' '}
                  · {formatDuration(exp.startDate, exp.isCurrent ? null : exp.endDate)}
                </span>
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
// Projects
// ---------------------------------------------------------------------------

const STATUS: Record<NonNullable<ProjectShowcaseItem['status']>, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-emerald-400' },
  'in-development': { label: 'In development', dot: 'bg-amber-300' },
  private: { label: 'Private', dot: 'bg-white/70' },
};

function ProjectCover({ project }: { project: ProjectShowcaseItem }) {
  const [from, to] = COVERS[project.category] || ['#334155', '#0f172a'];
  const initials = project.title
    .replace(/&.*$/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  const status = project.status ? STATUS[project.status] : null;
  // A capture of the real site beats a drawn graphic, so projects that have one
  // show it in a small browser frame. The drawn cover below is the fallback.
  if (project.previewImage) {
    return (
      <div className="relative h-44 overflow-hidden rounded-t-xl border-b border-line bg-surface-2">
        <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#f87171]/70" />
          <span className="h-2 w-2 rounded-full bg-[#fbbf24]/70" />
          <span className="h-2 w-2 rounded-full bg-[#4ade80]/70" />
          <span className="ml-1 truncate font-mono text-[10px] text-subtle">
            {project.liveUrl ? hostname(project.liveUrl) : project.title}
          </span>
          {status && (
            <span className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-subtle">
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          )}
        </div>
        <img
          src={project.previewImage}
          alt={`The ${project.title} site`}
          loading="lazy"
          decoding="async"
          className="h-[calc(100%-29px)] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-28 overflow-hidden rounded-t-xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.18) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <span className="font-display absolute -bottom-5 right-3 text-[5.5rem] font-bold leading-none tracking-tighter text-white/15">
        {initials}
      </span>
      <p className="absolute left-4 top-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">{project.category}</p>
      {status && (
        <p className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </p>
      )}
      <p className="absolute bottom-3 left-4 font-mono text-[11px] text-white/75">{project.technologies.slice(0, 3).join(' · ')}</p>
    </div>
  );
}

export function Projects({ projects }: { projects: ProjectShowcaseItem[] }) {
  const [filter, setFilter] = useState<string>('All');
  const filters = useMemo(() => ['All', 'Live', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const shown = projects.filter((p) =>
    filter === 'All' ? true : filter === 'Live' ? p.status === 'live' : p.category === filter
  );

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected software & XR work"
      intro="Products I've designed and built end to end — from database schema to deployment."
    >
      <div role="group" aria-label="Filter projects" className="no-print mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={pill(filter === f)}>
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-70">
                {f === 'Live' ? projects.filter((p) => p.status === 'live').length : projects.filter((p) => p.category === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {shown.map((p) => (
          <Card key={p.id} className="spotlight group flex flex-col">
            <ProjectCover project={p} />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
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
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Skills — click a skill to see where it was used.
// ---------------------------------------------------------------------------

const SKILL_GROUPS: Array<{ key: keyof SkillCategoryMap; label: string }> = [
  { key: 'enterpriseAndIT', label: 'Enterprise IT & systems' },
  { key: 'cloudAndDevOps', label: 'Cloud & data' },
  { key: 'languages', label: 'Languages' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'aiAndArchitecture', label: 'AI & architecture' },
];

export function Skills({ profile, projects }: { profile: CvSyncPayload; projects: ProjectShowcaseItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const usage = selected ? skillUsage(selected, profile, projects) : null;

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical toolkit"
      intro="Select a skill to see exactly where I've used it."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-5">
          {SKILL_GROUPS.filter((g) => profile.skills[g.key]?.length).map((g) => (
            <div key={g.key} className="reveal">
              <h3 className="text-sm font-medium text-ink">{g.label}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {profile.skills[g.key]!.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      aria-pressed={selected === s}
                      onClick={() => setSelected(selected === s ? null : s)}
                      className={pill(selected === s)}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Card className="no-print p-5 lg:sticky lg:top-24" >
          <div aria-live="polite">
            {!usage ? (
              <div className="flex flex-col items-start gap-2 py-4 text-muted">
                <MousePointerClick size={22} className="text-accent-text" aria-hidden />
                <p className="font-medium text-ink">Skill explorer</p>
                <p className="text-sm">Pick any skill on the left to trace it to the roles and products where it was applied.</p>
              </div>
            ) : (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Where I've used</p>
                <p className="font-display mt-1 text-xl font-semibold text-ink">{selected}</p>
                {usage.roles.length + usage.projects.length === 0 && !usage.thisSite ? (
                  <p className="mt-3 text-sm text-muted">
                    On my CV toolkit but not tied to a project shown here — happy to walk through it in an interview.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {usage.roles.length > 0 && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-subtle">In roles</p>
                        <ul className="mt-1.5 space-y-1">
                          {usage.roles.map((r) => (
                            <li key={r.id}>
                              <a href="#experience" className="text-sm text-ink hover:underline underline-offset-4">
                                {r.role} · {r.company}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {usage.projects.length > 0 && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-subtle">In products</p>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {usage.projects.map((p) => (
                            <li key={p.id}>
                              <a href="#projects">
                                <Chip>{p.title}</Chip>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {usage.thisSite && (
                      <p className="text-sm text-muted">
                        <span className="font-medium text-ink">And this site</span> — it's built with it.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Education & certifications
// ---------------------------------------------------------------------------

export function Education({ profile }: { profile: CvSyncPayload }) {
  return (
    <Section id="education" eyebrow="Education & certifications" title="Qualifications">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <ol className="space-y-5">
          {profile.education.map((e) => (
            <li key={e.id} className="reveal flex gap-4">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                <GraduationCap size={18} aria-hidden />
              </span>
              <div>
                <h3 className="font-medium text-ink leading-snug">{e.degree}</h3>
                <p className="text-sm text-muted">
                  {e.institution} · <span className="font-mono text-xs">{formatYear(e.year)}</span>
                </p>
                {e.details && e.id === profile.education[0]?.id && <p className="mt-1 text-sm text-subtle">{e.details}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="reveal">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Certifications</h3>
          <ul className="mt-3 space-y-3">
            {profile.certifications.map((c) => (
              <li key={c.id}>
                <Card className="spotlight flex items-start gap-3 p-4">
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
