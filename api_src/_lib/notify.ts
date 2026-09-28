import { env, jarvisWebhookTarget } from './env';

export interface DeliveryResult {
  delivered: boolean;
  skipped?: boolean;
  error?: string;
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Emails the owner through Resend. Reply-To is the visitor, so answering is one click. */
export async function sendOwnerEmail(params: {
  to: string;
  subject: string;
  replyTo?: string;
  fields: Array<[string, string]>;
  message: string;
}): Promise<DeliveryResult> {
  if (!env.resendApiKey) return { delivered: false, skipped: true, error: 'RESEND_API_KEY not set' };

  const rows = params.fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#0f172a">
    <table>${rows}</table>
    <p style="white-space:pre-wrap;border-left:3px solid #0d9488;padding-left:12px;margin-top:16px">${escapeHtml(params.message)}</p>
  </div>`;
  const text = `${params.fields.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${params.message}`;

  try {
    const res = await postJson(
      'https://api.resend.com/emails',
      {
        from: env.resendFrom,
        to: [params.to],
        subject: params.subject,
        reply_to: params.replyTo,
        html,
        text,
      },
      { Authorization: `Bearer ${env.resendApiKey}` }
    );
    if (res.ok) return { delivered: true };
    const detail = await res.text().catch(() => '');
    return { delivered: false, error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
  } catch (e: any) {
    return { delivered: false, error: e?.name === 'AbortError' ? 'Resend timed out' : e?.message };
  }
}

/** Best-effort event to the Jarvis assistant. Never the only delivery channel for anything important. */
export async function sendToJarvis(params: {
  type: 'alert' | 'event';
  sender: string;
  subject: string;
  body: string;
  details?: Record<string, unknown>;
}): Promise<DeliveryResult> {
  const url = jarvisWebhookTarget();
  if (!url) return { delivered: false, skipped: true, error: 'Jarvis webhook not configured' };
  try {
    const res = await postJson(url, {
      ...params,
      channelType: 'webhook',
      userId: env.jarvisUserId,
      app: 'myportfolio',
      timestamp: new Date().toISOString(),
    });
    return res.ok ? { delivered: true } : { delivered: false, error: `Jarvis responded ${res.status}` };
  } catch (e: any) {
    return { delivered: false, error: e?.name === 'AbortError' ? 'Jarvis timed out' : e?.message };
  }
}

/** Where the webhook points, without the key in the path. */
export function jarvisHostForDisplay(): string | null {
  const url = jarvisWebhookTarget();
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return 'invalid URL';
  }
}
