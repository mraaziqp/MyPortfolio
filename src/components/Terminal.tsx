import React, { useEffect, useRef, useState } from 'react';
import type { CvSyncPayload, ProjectShowcaseItem } from '../types';
import { formatMonth, hostname } from '../lib/format';
import { toggleTheme } from '../lib/theme';
import { Section } from './ui';

type Line = { kind: 'in' | 'out' | 'err' | 'accent'; text: string };

const PROMPT = 'visitor@mparker:~$';
const COMMANDS = ['help', 'whoami', 'about', 'experience', 'projects', 'open', 'skills', 'education', 'certs', 'contact', 'cv', 'hire', 'theme', 'ls', 'clear'];

function run(input: string, profile: CvSyncPayload, projects: ProjectShowcaseItem[]): Line[] | 'clear' {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const out = (text: string): Line => ({ kind: 'out', text });
  const accent = (text: string): Line => ({ kind: 'accent', text });

  switch ((cmd || '').toLowerCase()) {
    case '':
      return [];
    case 'help':
      return [
        accent('Available commands'),
        out('  whoami        who I am, in one line'),
        out('  about         professional summary'),
        out('  experience    roles and dates'),
        out('  projects      things I have built'),
        out('  open <name>   open a live project, e.g. `open emeron`'),
        out('  skills        technical toolkit'),
        out('  education     qualifications'),
        out('  certs         certifications'),
        out('  contact       how to reach me'),
        out('  cv            download the PDF CV'),
        out('  hire          the important one'),
        out('  theme         toggle light / dark'),
        out('  clear         clear the screen'),
      ];
    case 'whoami':
      return [accent(profile.fullName), out(`${profile.headline} — ${profile.location.replace(/\s+\d{4}$/, '')}`)];
    case 'about':
      return [out(profile.summary)];
    case 'ls':
      return [out('about/  experience/  projects/  skills/  education/  contact/  Mohammed_Parker_CV.pdf')];
    case 'experience':
    case 'exp':
      return profile.experiences.flatMap((e) => [
        accent(`${e.role} @ ${e.company}`),
        out(`  ${formatMonth(e.startDate)} – ${e.isCurrent ? 'Present' : formatMonth(e.endDate)} · ${e.location}`),
      ]);
    case 'projects':
      return [
        ...projects.map((p) =>
          out(`${p.status === 'live' ? '●' : '○'} ${p.title.padEnd(26)} ${p.liveUrl ? hostname(p.liveUrl) : (p.status || '').replace('-', ' ')}`)
        ),
        out(''),
        out('● live  ○ in development — try `open <name>`'),
      ];
    case 'open': {
      const q = args.join(' ').toLowerCase();
      if (!q) return [{ kind: 'err', text: 'usage: open <project>' }];
      const p = projects.find((x) => x.slug.includes(q) || x.title.toLowerCase().includes(q));
      const url = p?.liveUrl || p?.links?.[0]?.url;
      if (!p) return [{ kind: 'err', text: `open: no project matching "${q}"` }];
      if (!url) return [out(`${p.title} is ${p.status === 'in-development' ? 'still in development' : 'not public'} — no live link yet.`)];
      window.open(url, '_blank', 'noopener');
      return [out(`Opening ${url} …`)];
    }
    case 'skills':
      return Object.entries(profile.skills)
        .filter(([k, v]) => k !== 'hardwareAndCreative' && v?.length)
        .map(([k, v]) => out(`${k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).padEnd(22)} ${(v as string[]).join(', ')}`));
    case 'education':
      return profile.education.map((e) => out(`${e.degree} — ${e.institution.replace(/\s+—.*$/, '')} (${e.year})`));
    case 'certs':
    case 'certifications':
      return profile.certifications.map((c) => out(`✓ ${c.name} — ${c.issuer}`));
    case 'contact':
      return [
        out(`email     ${profile.email}`),
        ...(profile.phone ? [out(`phone     ${profile.phone} (WhatsApp)`)] : []),
        ...(profile.linkedinUrl ? [out(`linkedin  ${profile.linkedinUrl}`)] : []),
        ...(profile.githubUrl ? [out(`github    ${profile.githubUrl}`)] : []),
      ];
    case 'cv': {
      const a = document.createElement('a');
      a.href = '/Mohammed_Parker_CV.pdf';
      a.download = 'Mohammed_Parker_CV.pdf';
      a.click();
      return [out('Downloading Mohammed_Parker_CV.pdf …')];
    }
    case 'hire':
      window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 400);
      return [accent('Excellent decision.'), out('Taking you to the contact form…')];
    case 'sudo':
      return [{ kind: 'err', text: 'Permission denied. Try `hire` instead — no root required.' }];
    case 'theme':
      return [out(`Theme set to ${toggleTheme()}.`)];
    case 'clear':
    case 'cls':
      return 'clear';
    case 'exit':
      return [out('There is no escape. But there is a contact form: `hire`.')];
    default:
      return [{ kind: 'err', text: `command not found: ${cmd}. Type \`help\`.` }];
  }
}

const WELCOME: Line[] = [
  { kind: 'accent', text: 'mparker-cv v2 — interactive résumé' },
  { kind: 'out', text: 'Type `help` to see commands, or tap one below.' },
];

export function Terminal({ profile, projects }: { profile: CvSyncPayload; projects: ProjectShowcaseItem[] }) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = (command: string) => {
    const result = run(command, profile, projects);
    if (command.trim()) setHistory((h) => [command, ...h].slice(0, 50));
    setCursor(-1);
    setValue('');
    if (result === 'clear') return setLines([]);
    setLines((l) => [...l, { kind: 'in' as const, text: command }, ...result].slice(-200));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(history.length - 1, cursor + 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(-1, next));
      setValue(next >= 0 ? history[next] : '');
    } else if (e.key === 'Tab') {
      const match = COMMANDS.filter((c) => c.startsWith(value.trim().toLowerCase()));
      if (value.trim() && match.length === 1) {
        e.preventDefault();
        setValue(match[0] + ' ');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const color: Record<Line['kind'], string> = {
    in: 'text-zinc-100',
    out: 'text-zinc-400',
    err: 'text-rose-400',
    accent: 'text-teal-300',
  };

  return (
    <Section
      id="terminal"
      eyebrow="For engineers"
      title="Prefer the command line?"
      intro="The same CV, as a shell. Try `whoami`, `projects` or `hire`."
    >
      <div className="reveal no-print overflow-hidden rounded-xl border border-zinc-800 bg-[#0b0e13] shadow-card">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-3 font-mono text-xs text-zinc-500">mparker — bash</span>
        </div>
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
          className="h-72 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed sm:h-80"
        >
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap break-words ${color[l.kind]}`}>
                {l.kind === 'in' && <span className="text-teal-400">{PROMPT} </span>}
                {l.text}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-zinc-100">
            <span className="shrink-0 text-teal-400">{PROMPT}</span>
            <span className="sr-only">Terminal command</span>
            <input
              id="terminal-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              className="min-w-0 flex-1 bg-transparent text-zinc-100 caret-teal-300 outline-none focus:outline-none focus-visible:outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-zinc-800 px-4 py-3">
          {['help', 'whoami', 'projects', 'skills', 'contact', 'hire'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => submit(c)}
              className="rounded-md border border-zinc-700 px-2.5 py-1 font-mono text-xs text-zinc-300 hover:border-teal-400 hover:text-teal-300 transition"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
