import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ContactRound,
  Copy,
  CornerDownLeft,
  Download,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Share2,
  SquareTerminal,
} from 'lucide-react';
import type { CvSyncPayload } from '../types';
import { copyText, downloadVCard, shareSite } from '../lib/profile';
import { toggleTheme } from '../lib/theme';
import { toast } from './effects';

interface Action {
  id: string;
  label: string;
  hint?: string;
  group: 'Go to' | 'Contact' | 'Tools';
  icon: typeof Mail;
  keywords?: string;
  run: () => void;
}

const SECTIONS: Array<[string, string]> = [
  ['top', 'Top'],
  ['about', 'Profile'],
  ['services', 'What I bring'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills explorer'],
  ['education', 'Education & certifications'],
  ['terminal', 'Terminal'],
  ['contact', 'Contact form'],
];

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', id === 'top' ? '#' : `#${id}`);
}

export function CommandPalette({ profile, onClose }: { profile: CvSyncPayload; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const actions = useMemo<Action[]>(() => {
    const list: Action[] = SECTIONS.map(([id, label]) => ({
      id: `go-${id}`,
      label,
      group: 'Go to',
      icon: ArrowRight,
      run: () => go(id),
    }));
    list.push(
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: profile.email,
        group: 'Contact',
        icon: Copy,
        keywords: 'mail',
        run: async () => toast((await copyText(profile.email)) ? 'Email address copied' : profile.email),
      },
      {
        id: 'email',
        label: 'Send an email',
        group: 'Contact',
        icon: Mail,
        run: () => (window.location.href = `mailto:${profile.email}`),
      },
      {
        id: 'vcard',
        label: 'Save contact card',
        hint: '.vcf',
        group: 'Contact',
        icon: ContactRound,
        keywords: 'vcard phone address book',
        run: () => downloadVCard(profile),
      }
    );
    if (profile.phone) {
      list.push({
        id: 'whatsapp',
        label: 'Message on WhatsApp',
        hint: profile.phone,
        group: 'Contact',
        icon: MessageCircle,
        keywords: 'phone call',
        run: () => window.open(`https://wa.me/${profile.phone!.replace(/\D/g, '')}`, '_blank', 'noopener'),
      });
    }
    if (profile.linkedinUrl) {
      list.push({ id: 'linkedin', label: 'Open LinkedIn', group: 'Contact', icon: Linkedin, run: () => window.open(profile.linkedinUrl, '_blank', 'noopener') });
    }
    if (profile.githubUrl) {
      list.push({ id: 'github', label: 'Open GitHub', group: 'Contact', icon: Github, run: () => window.open(profile.githubUrl, '_blank', 'noopener') });
    }
    list.push(
      {
        id: 'cv',
        label: 'Download CV (PDF)',
        group: 'Tools',
        icon: Download,
        keywords: 'resume',
        run: () => {
          const a = document.createElement('a');
          a.href = '/Mohammed_Parker_CV.pdf';
          a.download = 'Mohammed_Parker_CV.pdf';
          a.click();
        },
      },
      {
        id: 'share',
        label: 'Share this portfolio',
        group: 'Tools',
        icon: Share2,
        keywords: 'link copy url',
        run: async () => {
          if ((await shareSite(profile)) === 'copied') toast('Link copied');
        },
      },
      { id: 'theme', label: 'Toggle light / dark theme', group: 'Tools', icon: Moon, keywords: 'dark mode', run: () => toggleTheme() },
      {
        id: 'terminal',
        label: 'Open the terminal',
        group: 'Tools',
        icon: SquareTerminal,
        keywords: 'cli shell command',
        run: () => {
          go('terminal');
          window.setTimeout(() => document.getElementById('terminal-input')?.focus({ preventScroll: true }), 500);
        },
      }
    );
    return list;
  }, [profile]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.hint || ''} ${a.keywords || ''} ${a.group}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const run = (action?: Action) => {
    if (!action) return;
    onClose();
    // Let the dialog unmount (and body scroll unlock) before scrolling.
    window.setTimeout(action.run, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(filtered[index]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup = '';
  return (
    <div className="no-print fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick actions"
        className="role-in w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={17} className="text-subtle" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions and sections…"
            aria-label="Search actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[index] ? `palette-${filtered[index].id}` : undefined}
            className="h-12 w-full bg-transparent text-[15px] text-ink placeholder:text-subtle focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-subtle">Esc</kbd>
        </div>
        <ul id="palette-list" ref={listRef} role="listbox" aria-label="Actions" className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li>}
          {filtered.map((a, i) => {
            const header = a.group !== lastGroup ? a.group : null;
            lastGroup = a.group;
            const Icon = a.icon;
            return (
              <React.Fragment key={a.id}>
                {header && (
                  <li role="presentation" className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                    {header}
                  </li>
                )}
                <li
                  id={`palette-${a.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(a)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    i === index ? 'bg-accent-soft text-ink' : 'text-muted'
                  }`}
                >
                  <Icon size={16} aria-hidden className={i === index ? 'text-accent-text' : ''} />
                  <span className="flex-1">{a.label}</span>
                  {a.hint && <span className="truncate text-xs text-subtle">{a.hint}</span>}
                  {i === index && <CornerDownLeft size={14} className="text-subtle" aria-hidden />}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
