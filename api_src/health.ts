/**
 * GET /api/health — liveness for uptime checks (public).
 * With the Jarvis key it also reports which integrations are configured and
 * reachable, without ever echoing a secret.
 */
import { env } from './_lib/env';
import { authenticate, methodNotAllowed, route, sendJson } from './_lib/http';
import { jarvisHostForDisplay } from './_lib/notify';
import { pingStorage, storageMode } from './_lib/store';

async function resendStatus() {
  if (!env.resendApiKey) return { configured: false };
  const from = env.resendFrom;
  const fromDomain = /@([^>\s]+)/.exec(from)?.[1] ?? null;
  try {
    // Read-only: lists sending domains so a misconfigured From is visible here
    // rather than as silently undelivered contact messages.
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${env.resendApiKey}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { configured: true, from, fromDomain, domains: `unavailable (${res.status}; sending-only key?)` };
    const data: any = await res.json();
    const domains = (data?.data || []).map((d: any) => ({ name: d.name, status: d.status }));
    const verified = fromDomain === 'resend.dev' || domains.some((d: any) => d.name === fromDomain && d.status === 'verified');
    return { configured: true, from, fromDomain, fromDomainVerified: verified, domains };
  } catch (e: any) {
    return { configured: true, from, fromDomain, domains: `error: ${e?.message}` };
  }
}

export default route(async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const auth = authenticate(req);
  if (!auth.ok || auth.role !== 'jarvis_master') {
    return sendJson(res, 200, { status: 'ok', time: new Date().toISOString() });
  }

  const [storage, email] = await Promise.all([pingStorage(), resendStatus()]);
  let dbHost: string | null = null;
  try {
    dbHost = env.databaseUrl ? new URL(env.databaseUrl).hostname : null;
  } catch {
    dbHost = 'unparseable';
  }

  return sendJson(res, 200, {
    status: storage.ok ? 'ok' : 'degraded',
    time: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'local',
    storage: { mode: storageMode(), host: dbHost, ...storage },
    email: { ...email, notifyTo: env.notifyEmail ? 'NOTIFY_EMAIL' : 'CV email (NOTIFY_EMAIL unset)' },
    jarvisWebhook: { configured: Boolean(jarvisHostForDisplay()), host: jarvisHostForDisplay() },
    keys: { jarvis: Boolean(env.jarvisApiKey), portfolio: Boolean(env.portfolioApiKey) },
  });
});
