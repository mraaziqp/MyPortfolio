import React, { useEffect, useState } from 'react';
import { ArrowUp, CircleCheck } from 'lucide-react';

// ---------------------------------------------------------------------------
// Toasts: `toast('Copied')` from anywhere; <Toaster/> renders them.
// ---------------------------------------------------------------------------

type ToastListener = (message: string) => void;
const listeners = new Set<ToastListener>();

export function toast(message: string): void {
  listeners.forEach((l) => l(message));
}

export function Toaster() {
  const [items, setItems] = useState<Array<{ id: number; message: string }>>([]);

  useEffect(() => {
    let seq = 0;
    const onToast: ToastListener = (message) => {
      const id = ++seq;
      setItems((list) => [...list.slice(-2), { id, message }]);
      window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 2800);
    };
    listeners.add(onToast);
    return () => {
      listeners.delete(onToast);
    };
  }, []);

  return (
    <div aria-live="polite" className="no-print pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="role-in flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink shadow-card"
        >
          <CircleCheck size={16} className="text-ok" aria-hidden />
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page-level effects, wired once from App.
// ---------------------------------------------------------------------------

/** Fades `.reveal` elements in as they scroll into view. Re-scans when `key` changes. */
export function useReveal(key: unknown): void {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}

/** Feeds the pointer position to `.spotlight` cards via CSS variables. */
export function useSpotlight(): void {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
}

/** Thin reading-progress bar plus a back-to-top button after the first screen. */
export function ScrollChrome() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setShowTop(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="no-print fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`no-print fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-card transition ${
          showTop ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
