import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-14 sm:py-20 border-t border-line">
      <div className="reveal mb-8 sm:mb-10 max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-text">{eyebrow}</p>
        <h2 id={`${id}-title`} className="font-display mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {intro && <p className="mt-3 text-muted leading-relaxed">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface-2 px-2 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-line bg-surface shadow-card ${className}`}>{children}</div>;
}

export function ExternalLink({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline underline-offset-4 ${className}`}
    >
      {children}
      <ArrowUpRight size={14} aria-hidden />
    </a>
  );
}

/** The MP monogram — same mark as public/favicon.svg. */
export function Monogram({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <g fill="none" stroke="var(--accent-ink)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 46V18l11 16 11-16v28" />
        <path d="M40.5 46V18h6a8 8 0 0 1 0 16h-6" />
      </g>
    </svg>
  );
}

export const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink shadow-card transition hover:brightness-110 active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed';
export const buttonSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2';
