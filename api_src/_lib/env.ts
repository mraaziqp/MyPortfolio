/**
 * Server configuration, read once from the environment.
 *
 * Nothing secret has a default: a missing key disables the feature that needs
 * it (and /api/health says so) instead of silently falling back to a value
 * that lives in a public git history.
 */

const read = (name: string): string | undefined => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

export const env = {
  /** Full-access key for the Jarvis assistant / dashboard manager. */
  jarvisApiKey: read('JARVIS_API_KEY'),
  /** Sync key for Emeron / CV tooling: may push the CV and read telemetry. */
  portfolioApiKey: read('PORTFOLIO_API_KEY'),

  databaseUrl: read('DATABASE_URL'),

  resendApiKey: read('RESEND_API_KEY'),
  /** Sender must be on a domain verified in Resend; resend.dev only reaches the account owner. */
  resendFrom: read('RESEND_FROM') || 'Portfolio <onboarding@resend.dev>',
  /** Where contact-form messages are delivered. Falls back to the CV email. */
  notifyEmail: read('NOTIFY_EMAIL'),

  /** Either a full webhook URL, or a base URL plus the jb_live_sk_ key. */
  jarvisWebhookUrl: read('JARVIS_WEBHOOK_URL'),
  jarvisPublicUrl: read('JARVIS_PUBLIC_URL'),
  jarvisWebhookKey: read('JARVIS_WEBHOOK_KEY'),
  jarvisUserId: read('JARVIS_USER_ID'),

  /** Canonical public origin, used in manifests. */
  siteUrl: (read('SITE_URL') || 'https://portfolio.arpcloudsolutions.co.za').replace(/\/$/, ''),

  isProduction: process.env.VERCEL_ENV === 'production',
};

export function jarvisWebhookTarget(): string | undefined {
  if (env.jarvisWebhookUrl) return env.jarvisWebhookUrl;
  if (env.jarvisPublicUrl && env.jarvisWebhookKey) {
    return `${env.jarvisPublicUrl.replace(/\/$/, '')}/api/assistant/webhook/${env.jarvisWebhookKey}`;
  }
  return undefined;
}
