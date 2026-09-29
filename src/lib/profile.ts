import type { CvSyncPayload, ExperienceItem, ProjectShowcaseItem } from '../types';

function monthIndex(value?: string | null): number | null {
  const m = value ? /^(\d{1,2})\/(\d{4})$/.exec(value.trim()) : null;
  return m ? Number(m[2]) * 12 + Number(m[1]) - 1 : null;
}

/** Years since the first professional role started, to one decimal ("3+"). */
export function yearsOfExperience(experiences: ExperienceItem[], now = new Date()): number {
  const starts = experiences.map((e) => monthIndex(e.startDate)).filter((n): n is number => n !== null);
  if (!starts.length) return 0;
  const months = now.getFullYear() * 12 + now.getMonth() - Math.min(...starts);
  return Math.max(0, Math.floor(months / 12));
}

export interface Stat {
  value: string;
  label: string;
  hint: string;
}

/** Headline numbers, all computed from the CV data rather than typed in. */
export function headlineStats(profile: CvSyncPayload, projects: ProjectShowcaseItem[]): Stat[] {
  const years = yearsOfExperience(profile.experiences);
  const live = projects.filter((p) => p.status === 'live').length;
  const branchMatch = profile.experiences
    .flatMap((e) => e.keyAchievements)
    .map((a) => /(\d+)\s+KFC branch/i.exec(a))
    .find(Boolean);
  const stats: Stat[] = [
    { value: `${years}+`, label: 'Years in IT', hint: 'Enterprise support to systems administration' },
    { value: String(projects.length), label: 'Products built', hint: 'SaaS, fintech, B2B and XR' },
    { value: String(live), label: 'Live platforms', hint: 'In production today' },
  ];
  if (branchMatch) stats.push({ value: branchMatch[1], label: 'Branches supported', hint: 'Remote support across a national chain' });
  stats.push({ value: String(profile.certifications.length), label: 'Certifications', hint: 'AWS, Lenovo and Dell' });
  return stats;
}

// ---------------------------------------------------------------------------
// Skill explorer: which roles and projects used a given skill.
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9#+]/g, '');

/**
 * Phrases that count as evidence of a skill, keyed by the normalised skill
 * name. Matching is whole-word, so "Azure AD" never matches on-prem "Active
 * Directory" and short names cannot hit the middle of unrelated words.
 */
const PHRASES: Record<string, string[]> = {
  azureadentraid: ['azure active directory', 'entra id', 'azure ad'],
  hyperv: ['hyper-v'],
  unity: ['unity'],
  aws: ['aws'],
  sql: ['sql', 'postgresql'],
  restapis: ['rest apis', 'rest api', 'restful', 'rest endpoints'],
  windowsserver: ['windows server', 'server infrastructure'],
  microsoftintune: ['intune', 'microsoft endpoint'],
  systemobservability: ['observability'],
  aiorchestration: ['ai orchestration', 'ai copilots', 'ai-powered'],
  llms: ['llm', 'gemini', 'ollama'],
  bashshell: ['bash', 'shell'],
  tailwindcss: ['tailwind'],
};

const phrasesFor = (skill: string) =>
  PHRASES[norm(skill)] || [skill.toLowerCase().replace(/\(.*?\)/g, '').trim()];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function mentions(text: string, skill: string): boolean {
  return phrasesFor(skill).some((p) => new RegExp(`(^|[^a-z0-9])${escapeRe(p)}($|[^a-z0-9#+])`, 'i').test(text));
}

export interface SkillUsage {
  roles: ExperienceItem[];
  projects: ProjectShowcaseItem[];
  /** True when this very site is built with the skill. */
  thisSite: boolean;
}

/** What this portfolio is built with (see package.json and api_src/). */
const SITE_STACK = ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'REST APIs'];

export function skillUsage(skill: string, profile: CvSyncPayload, projects: ProjectShowcaseItem[]): SkillUsage {
  const inAny = (texts: string[]) => texts.some((t) => mentions(t, skill));
  return {
    roles: profile.experiences.filter((e) => inAny([...e.technologies, ...e.keyAchievements])),
    projects: projects.filter((p) => inAny([...p.technologies, p.description, p.tagline])),
    thisSite: inAny(SITE_STACK),
  };
}

// ---------------------------------------------------------------------------
// Recruiter kit
// ---------------------------------------------------------------------------

export function vCard(profile: CvSyncPayload): string {
  const [first, ...rest] = profile.fullName.split(' ');
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1');
  const current = profile.experiences.find((e) => e.isCurrent);
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(rest.join(' '))};${esc(first)};;;`,
    `FN:${esc(profile.fullName)}`,
    `TITLE:${esc(profile.headline)}`,
    current ? `ORG:${esc(current.company)}` : '',
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    profile.phone ? `TEL;TYPE=CELL:${profile.phone.replace(/\s+/g, '')}` : '',
    profile.websiteUrl ? `URL:${profile.websiteUrl}` : '',
    profile.linkedinUrl ? `URL;TYPE=LinkedIn:${profile.linkedinUrl}` : '',
    `ADR;TYPE=WORK:;;;${esc(profile.location.replace(/\s+\d{4}$/, ''))};;;`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadVCard(profile: CvSyncPayload): void {
  const blob = new Blob([vCard(profile)], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.fullName.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareSite(profile: CvSyncPayload): Promise<'shared' | 'copied' | 'failed'> {
  const url = profile.websiteUrl || window.location.origin;
  const data = { title: `${profile.fullName} — ${profile.headline}`, url };
  if (navigator.share) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch {
      /* dismissed: fall through to copying */
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
