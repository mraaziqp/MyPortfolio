import React, { useState } from 'react';
import { CircleAlert, CircleCheck, Github, Linkedin, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import type { ContactSubmissionPayload, CvSyncPayload } from '../types';
import { submitContact } from '../lib/api';
import { Card, Section, buttonPrimary } from './ui';

const REASONS: Array<{ value: NonNullable<ContactSubmissionPayload['category']>; label: string }> = [
  { value: 'recruiting', label: 'A role / recruitment' },
  { value: 'engineering', label: 'Software project' },
  { value: 'infrastructure', label: 'IT infrastructure' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'general', label: 'Something else' },
];

const EMPTY: ContactSubmissionPayload = {
  name: '',
  email: '',
  organization: '',
  subject: '',
  message: '',
  category: 'recruiting',
  website: '',
};

const field =
  'mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-[15px] text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 transition';

export function Contact({ profile }: { profile: CvSyncPayload }) {
  const [form, setForm] = useState<ContactSubmissionPayload>(EMPTY);
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'sent' | 'error'; error?: string; sentTo?: string }>({
    status: 'idle',
  });

  const set = (key: keyof ContactSubmissionPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: 'sending' });
    const result = await submitContact(form);
    if ('error' in result) {
      setState({ status: 'error', error: result.error });
    } else {
      setState({ status: 'sent', sentTo: form.email });
      setForm(EMPTY);
    }
  };

  const phoneHref = profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : undefined;
  const whatsappHref = profile.phone ? `https://wa.me/${profile.phone.replace(/\D/g, '')}` : undefined;

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk"
      intro="Hiring for a software or infrastructure role, or have a project in mind? Send a message — it comes straight to my inbox."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
        <ul className="space-y-4">
          <li>
            <a href={`mailto:${profile.email}`} className="group flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Mail size={18} aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Email</span>
                <span className="text-ink group-hover:underline underline-offset-4">{profile.email}</span>
              </span>
            </a>
          </li>
          {profile.phone && (
            <li className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Phone size={18} aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Phone / WhatsApp</span>
                <a href={phoneHref} className="text-ink hover:underline underline-offset-4">
                  {profile.phone}
                </a>
                <span className="text-subtle"> · </span>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-text hover:underline underline-offset-4">
                  WhatsApp
                </a>
              </span>
            </li>
          )}
          <li className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
              <MapPin size={18} aria-hidden />
            </span>
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">Based in</span>
              <span className="text-ink">{profile.location.replace(/\s+\d{4}$/, '')}</span>
            </span>
          </li>
          <li className="flex flex-wrap gap-2 pt-2">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2"
              >
                <Linkedin size={16} aria-hidden /> LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2"
              >
                <Github size={16} aria-hidden /> GitHub
              </a>
            )}
          </li>
        </ul>

        <Card className="no-print p-5 sm:p-7">
          {state.status === 'sent' ? (
            <div role="status" className="flex flex-col items-start gap-3 py-6">
              <CircleCheck size={28} className="text-ok" aria-hidden />
              <h3 className="font-display text-xl font-semibold text-ink">Message sent</h3>
              <p className="text-muted">
                Thanks for reaching out. I'll reply to <span className="text-ink">{state.sentTo}</span>, usually within a
                working day.
              </p>
              <button
                type="button"
                onClick={() => setState({ status: 'idle' })}
                className="text-sm font-medium text-accent-text hover:underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate={false} className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Name
                <input required autoComplete="name" maxLength={120} value={form.name} onChange={set('name')} className={field} />
              </label>
              <label className="block text-sm font-medium text-ink">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  value={form.email}
                  onChange={set('email')}
                  className={field}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Company <span className="font-normal text-subtle">(optional)</span>
                <input autoComplete="organization" maxLength={160} value={form.organization} onChange={set('organization')} className={field} />
              </label>
              <label className="block text-sm font-medium text-ink">
                Reason
                <select value={form.category} onChange={set('category')} className={field}>
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-ink sm:col-span-2">
                Message
                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  className={`${field} resize-y`}
                  placeholder="A little about the role or project…"
                />
              </label>

              {/* Honeypot for bots — hidden from people and assistive tech. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                </label>
              </div>

              {state.status === 'error' && (
                <p role="alert" className="sm:col-span-2 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  <CircleAlert size={17} className="mt-0.5 shrink-0" aria-hidden />
                  <span>
                    {state.error}{' '}
                    <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-4">
                      Email me instead
                    </a>
                    .
                  </span>
                </p>
              )}

              <div className="sm:col-span-2 flex items-center justify-between gap-4">
                <p className="text-xs text-subtle">Your details are only used to reply to you.</p>
                <button type="submit" disabled={state.status === 'sending'} className={buttonPrimary}>
                  {state.status === 'sending' ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" aria-hidden /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden /> Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}
