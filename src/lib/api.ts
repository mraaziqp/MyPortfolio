import { useEffect, useState } from 'react';
import { INITIAL_CV_DATA, SHOWCASE_PROJECTS } from '../data/initialData';
import type { ContactSubmissionPayload, CvSyncPayload, ProjectShowcaseItem } from '../types';

export interface ProfileState {
  profile: CvSyncPayload;
  projects: ProjectShowcaseItem[];
}

const REFRESH_MS = 2 * 60_000;

/**
 * Renders the CV bundled with the site immediately, then swaps in the live
 * copy from /api/profile (which reflects Emeron / Jarvis updates) and keeps it
 * current: it refetches when the tab regains focus and every two minutes while
 * visible. If the API is unreachable the bundled CV simply stays.
 */
export function useProfile(): ProfileState {
  const [state, setState] = useState<ProfileState>({ profile: INITIAL_CV_DATA, projects: SHOWCASE_PROJECTS });

  useEffect(() => {
    let controller: AbortController | null = null;
    let lastJson = '';

    const load = () => {
      controller?.abort();
      controller = new AbortController();
      fetch('/api/profile', { signal: controller.signal, headers: { Accept: 'application/json' } })
        .then((res) => (res.ok ? res.text() : null))
        .then((text) => {
          if (!text || text === lastJson) return; // unchanged: skip the re-render
          const data = JSON.parse(text);
          if (data?.profile?.fullName && Array.isArray(data.profile.experiences)) {
            lastJson = text;
            setState({
              profile: data.profile,
              projects: Array.isArray(data.projects) ? data.projects : SHOWCASE_PROJECTS,
            });
          }
        })
        .catch(() => {});
    };

    load();
    const onVisible = () => document.visibilityState === 'visible' && load();
    const timer = window.setInterval(() => document.visibilityState === 'visible' && load(), REFRESH_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return state;
}

/** Anonymous counter; failures are irrelevant to the visitor. */
export function track(slug: string, event: 'view' | 'click'): void {
  try {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, event }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function trackPageViewOnce(): void {
  try {
    if (sessionStorage.getItem('mp_viewed')) return;
    sessionStorage.setItem('mp_viewed', '1');
  } catch {
    /* private mode: count anyway */
  }
  track('site', 'view');
}

export async function submitContact(payload: ContactSubmissionPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) return { ok: true };
    return { ok: false, error: data?.error || `Something went wrong (${res.status}).` };
  } catch {
    return { ok: false, error: 'Could not reach the server — check your connection.' };
  }
}
