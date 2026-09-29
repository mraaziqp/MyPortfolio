/**
 * Durable storage for the portfolio API.
 *
 * With DATABASE_URL set, everything lives in Postgres (Neon's HTTP driver, so
 * no connection pool to leak across serverless invocations). Tables are
 * prefixed `portfolio_` and created on first use with IF NOT EXISTS, so the
 * code never alters anything it does not own.
 *
 * Without a database (local dev) the same interface is backed by memory, and
 * /api/health reports `storage: "memory"` so that mode is never mistaken for
 * the real thing.
 */
import { neon } from '@neondatabase/serverless';
import { createHmac, randomBytes } from 'crypto';
import { env } from './env';
import { sha256 } from './http';
import { INITIAL_CV_DATA, SHOWCASE_PROJECTS } from '../../src/data/initialData';
import type { CvSyncPayload, ProjectShowcaseItem } from '../../src/types';

export type InquiryStatus = 'new' | 'read' | 'archived';

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  category: string;
  status: InquiryStatus;
  emailDelivered: boolean;
  jarvisDelivered: boolean;
  receiptId: string | null;
}

export interface AuditEvent {
  receiptId: string;
  timestamp: string;
  actionType: string;
  caller: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
  statusCode: number;
  latencyMs: number;
  payloadDigest: string;
  receiptSignature: string;
  summary: string;
  details?: Record<string, unknown> | null;
}

export interface TelemetrySummary {
  totalViews: number;
  projects: Record<string, { views: number; clicks: number }>;
}

export const TELEMETRY_EVENTS = ['view', 'click'] as const;
export type TelemetryEvent = (typeof TELEMETRY_EVENTS)[number];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// Postgres
// ---------------------------------------------------------------------------

const rawSql = env.databaseUrl ? neon(env.databaseUrl) : null;
let schemaReady: Promise<void> | null = null;

/** Thrown when Postgres cannot be used (quota, outage, network). Routes turn it into a 503. */
export class StorageUnavailableError extends Error {
  constructor(public reason: string) {
    super(`Storage temporarily unavailable: ${reason}`);
    this.name = 'StorageUnavailableError';
  }
}

// Circuit breaker: after a failure, skip the database for a minute rather than
// making every request wait ~1s for the same error.
const BREAKER_MS = 60_000;
let unavailableUntil = 0;
let lastFailure = '';

function describe(e: any): string {
  const msg = String(e?.message || e || 'unknown error');
  if (/HTTP status 402|exceeded the quota/i.test(msg)) return 'database plan quota exceeded';
  return msg.slice(0, 160);
}

export function storageBreaker(): { open: boolean; reason: string | null; retryInSeconds: number } {
  const left = unavailableUntil - Date.now();
  return { open: left > 0, reason: left > 0 ? lastFailure : null, retryInSeconds: Math.max(0, Math.ceil(left / 1000)) };
}

type Sql = NonNullable<typeof rawSql>;
const guarded = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
  if (Date.now() < unavailableUntil) throw new StorageUnavailableError(lastFailure);
  try {
    return await (rawSql as Sql)(strings, ...(values as any[]));
  } catch (e) {
    lastFailure = describe(e);
    unavailableUntil = Date.now() + BREAKER_MS;
    throw new StorageUnavailableError(lastFailure);
  }
}) as unknown as Sql;

const sql: Sql | null = rawSql ? guarded : null;

function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS portfolio_kv (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS portfolio_inquiries (
        id text PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        name text NOT NULL,
        email text NOT NULL,
        organization text,
        subject text NOT NULL,
        message text NOT NULL,
        category text NOT NULL,
        status text NOT NULL DEFAULT 'new',
        ip_hash text,
        email_delivered boolean NOT NULL DEFAULT false,
        jarvis_delivered boolean NOT NULL DEFAULT false,
        receipt_id text
      )`;
      await sql`CREATE INDEX IF NOT EXISTS portfolio_inquiries_ip_created
        ON portfolio_inquiries (ip_hash, created_at)`;
      await sql`CREATE TABLE IF NOT EXISTS portfolio_events (
        receipt_id text PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        action_type text NOT NULL,
        caller text NOT NULL,
        status text NOT NULL,
        status_code integer NOT NULL,
        latency_ms integer NOT NULL,
        payload_digest text NOT NULL,
        signature text NOT NULL,
        summary text NOT NULL,
        details jsonb
      )`;
      await sql`CREATE INDEX IF NOT EXISTS portfolio_events_created ON portfolio_events (created_at DESC)`;
      await sql`CREATE TABLE IF NOT EXISTS portfolio_telemetry (
        slug text NOT NULL,
        event text NOT NULL,
        count bigint NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (slug, event)
      )`;
    })().catch((e) => {
      schemaReady = null; // retry on the next request instead of caching the failure
      throw e;
    });
  }
  return schemaReady;
}

async function db() {
  await ensureSchema();
  return sql!;
}

// ---------------------------------------------------------------------------
// Memory fallback
// ---------------------------------------------------------------------------

const memory = {
  kv: new Map<string, unknown>(),
  inquiries: [] as Array<Inquiry & { ipHash: string }>,
  events: [] as AuditEvent[],
  telemetry: new Map<string, number>(),
};

export const storageMode = (): 'postgres' | 'memory' => (sql ? 'postgres' : 'memory');

export async function pingStorage(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  if (!sql) return { ok: true, latencyMs: 0 };
  try {
    unavailableUntil = 0; // an explicit health check always probes for real
    await db();
    await sql`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - start };
  } catch (e: any) {
    return { ok: false, latencyMs: Date.now() - start, error: e instanceof StorageUnavailableError ? e.reason : describe(e) };
  }
}

// ---------------------------------------------------------------------------
// Profile (the CV) and projects
// ---------------------------------------------------------------------------

async function getKv<T>(key: string): Promise<T | undefined> {
  if (!sql) return memory.kv.has(key) ? clone(memory.kv.get(key) as T) : undefined;
  const rows = await (await db())`SELECT value FROM portfolio_kv WHERE key = ${key}`;
  return rows[0]?.value as T | undefined;
}

async function setKv(key: string, value: unknown): Promise<void> {
  if (!sql) {
    memory.kv.set(key, clone(value));
    return;
  }
  await (await db())`
    INSERT INTO portfolio_kv (key, value, updated_at) VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

async function deleteKv(key: string): Promise<void> {
  if (!sql) {
    memory.kv.delete(key);
    return;
  }
  await (await db())`DELETE FROM portfolio_kv WHERE key = ${key}`;
}

/** The live CV: the stored override when one exists, otherwise the version bundled with the site. */
export async function getProfile(): Promise<CvSyncPayload> {
  return (await getKv<CvSyncPayload>('profile')) || clone(INITIAL_CV_DATA);
}

export async function saveProfile(profile: CvSyncPayload): Promise<void> {
  await setKv('profile', profile);
}

export async function resetProfile(): Promise<void> {
  await deleteKv('profile');
}

export async function getProjects(): Promise<ProjectShowcaseItem[]> {
  return (await getKv<ProjectShowcaseItem[]>('projects')) || clone(SHOWCASE_PROJECTS);
}

export async function saveProjects(projects: ProjectShowcaseItem[]): Promise<void> {
  await setKv('projects', projects);
}

// ---------------------------------------------------------------------------
// Contact inquiries
// ---------------------------------------------------------------------------

const rowToInquiry = (r: any): Inquiry => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  name: r.name,
  email: r.email,
  organization: r.organization,
  subject: r.subject,
  message: r.message,
  category: r.category,
  status: r.status,
  emailDelivered: r.email_delivered,
  jarvisDelivered: r.jarvis_delivered,
  receiptId: r.receipt_id,
});

export async function countRecentInquiries(ipHash: string, withinMinutes: number): Promise<number> {
  if (!sql) {
    const since = Date.now() - withinMinutes * 60_000;
    return memory.inquiries.filter((i) => i.ipHash === ipHash && Date.parse(i.createdAt) > since).length;
  }
  const rows = await (await db())`
    SELECT count(*)::int AS n FROM portfolio_inquiries
    WHERE ip_hash = ${ipHash} AND created_at > now() - make_interval(mins => ${withinMinutes}::int)`;
  return rows[0]?.n ?? 0;
}

export async function insertInquiry(
  input: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'emailDelivered' | 'jarvisDelivered' | 'receiptId'>,
  ipHash: string
): Promise<Inquiry> {
  const inquiry: Inquiry = {
    ...input,
    id: `inq_${Date.now()}_${randomBytes(3).toString('hex')}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    emailDelivered: false,
    jarvisDelivered: false,
    receiptId: null,
  };
  if (!sql) {
    memory.inquiries.unshift({ ...inquiry, ipHash });
    return clone(inquiry);
  }
  await (await db())`
    INSERT INTO portfolio_inquiries (id, created_at, name, email, organization, subject, message, category, status, ip_hash)
    VALUES (${inquiry.id}, ${inquiry.createdAt}, ${inquiry.name}, ${inquiry.email}, ${inquiry.organization},
            ${inquiry.subject}, ${inquiry.message}, ${inquiry.category}, 'new', ${ipHash})`;
  return inquiry;
}

export async function markInquiryDelivery(
  id: string,
  delivery: { emailDelivered: boolean; jarvisDelivered: boolean; receiptId: string }
): Promise<void> {
  if (!sql) {
    const found = memory.inquiries.find((i) => i.id === id);
    if (found) Object.assign(found, delivery);
    return;
  }
  await (await db())`
    UPDATE portfolio_inquiries
    SET email_delivered = ${delivery.emailDelivered}, jarvis_delivered = ${delivery.jarvisDelivered},
        receipt_id = ${delivery.receiptId}
    WHERE id = ${id}`;
}

export async function listInquiries(limit = 50): Promise<Inquiry[]> {
  if (!sql) return memory.inquiries.slice(0, limit).map(({ ipHash, ...i }) => clone(i));
  const rows = await (await db())`
    SELECT * FROM portfolio_inquiries ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map(rowToInquiry);
}

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry | null> {
  if (!sql) {
    const found = memory.inquiries.find((i) => i.id === id);
    if (!found) return null;
    found.status = status;
    const { ipHash, ...rest } = found;
    return clone(rest);
  }
  const rows = await (await db())`
    UPDATE portfolio_inquiries SET status = ${status} WHERE id = ${id} RETURNING *`;
  return rows[0] ? rowToInquiry(rows[0]) : null;
}

export async function inquiryCounts(): Promise<{ total: number; open: number }> {
  if (!sql) {
    return { total: memory.inquiries.length, open: memory.inquiries.filter((i) => i.status === 'new').length };
  }
  const rows = await (await db())`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'new')::int AS open FROM portfolio_inquiries`;
  return { total: rows[0]?.total ?? 0, open: rows[0]?.open ?? 0 };
}

// ---------------------------------------------------------------------------
// Audit receipts
// ---------------------------------------------------------------------------

function signingKey(): string {
  // Receipts are only as trustworthy as this secret; without one they are
  // still recorded but plainly marked unsigned.
  return env.jarvisApiKey || '';
}

export async function recordEvent(params: {
  actionType: string;
  caller: string;
  status: AuditEvent['status'];
  statusCode: number;
  startedAt: number;
  summary: string;
  payload?: unknown;
  details?: Record<string, unknown>;
}): Promise<AuditEvent> {
  const now = new Date();
  const receiptId = `rcpt_${now.getTime()}_${randomBytes(3).toString('hex')}`;
  const payloadDigest = `sha256:${sha256(params.payload ?? {})}`;
  const key = signingKey();
  const receiptSignature = key
    ? `hmac-sha256:${createHmac('sha256', key)
        .update(`${receiptId}|${now.toISOString()}|${params.actionType}|${params.status}|${payloadDigest}`)
        .digest('hex')}`
    : 'unsigned';

  const event: AuditEvent = {
    receiptId,
    timestamp: now.toISOString(),
    actionType: params.actionType,
    caller: params.caller.slice(0, 200),
    status: params.status,
    statusCode: params.statusCode,
    latencyMs: Math.max(1, Math.round(performance.now() - params.startedAt)),
    payloadDigest,
    receiptSignature,
    summary: params.summary.slice(0, 500),
    details: params.details ?? null,
  };

  try {
    if (!sql) {
      memory.events.unshift(event);
      memory.events.length = Math.min(memory.events.length, 200);
    } else {
      const q = await db();
      await q`
        INSERT INTO portfolio_events (receipt_id, created_at, action_type, caller, status, status_code, latency_ms,
                                      payload_digest, signature, summary, details)
        VALUES (${event.receiptId}, ${event.timestamp}, ${event.actionType}, ${event.caller}, ${event.status},
                ${event.statusCode}, ${event.latencyMs}, ${event.payloadDigest}, ${event.receiptSignature},
                ${event.summary}, ${event.details ? JSON.stringify(event.details) : null}::jsonb)`;
      // Keep the log bounded without a cron job: occasionally trim old rows.
      if (Math.random() < 0.02) {
        await q`DELETE FROM portfolio_events WHERE created_at < now() - interval '180 days'`;
      }
    }
  } catch (e) {
    // An audit write failing must never fail the request it describes.
    console.error('[audit] could not record event', e);
  }
  return event;
}

export async function listEvents(limit = 30): Promise<AuditEvent[]> {
  if (!sql) return clone(memory.events.slice(0, limit));
  const rows = await (await db())`
    SELECT * FROM portfolio_events ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map((r: any) => ({
    receiptId: r.receipt_id,
    timestamp: new Date(r.created_at).toISOString(),
    actionType: r.action_type,
    caller: r.caller,
    status: r.status,
    statusCode: r.status_code,
    latencyMs: r.latency_ms,
    payloadDigest: r.payload_digest,
    receiptSignature: r.signature,
    summary: r.summary,
    details: r.details,
  }));
}

// ---------------------------------------------------------------------------
// Telemetry: plain counters, no personal data.
// ---------------------------------------------------------------------------

export async function incrementTelemetry(slug: string, event: TelemetryEvent): Promise<void> {
  if (!sql) {
    const k = `${slug}|${event}`;
    memory.telemetry.set(k, (memory.telemetry.get(k) || 0) + 1);
    return;
  }
  await (await db())`
    INSERT INTO portfolio_telemetry (slug, event, count, updated_at) VALUES (${slug}, ${event}, 1, now())
    ON CONFLICT (slug, event) DO UPDATE SET count = portfolio_telemetry.count + 1, updated_at = now()`;
}

export async function getTelemetry(): Promise<TelemetrySummary> {
  const rows: Array<{ slug: string; event: string; count: number }> = !sql
    ? [...memory.telemetry.entries()].map(([k, count]) => {
        const [slug, event] = k.split('|');
        return { slug, event, count };
      })
    : ((await (await db())`SELECT slug, event, count::int AS count FROM portfolio_telemetry`) as any);

  const summary: TelemetrySummary = { totalViews: 0, projects: {} };
  for (const row of rows) {
    if (row.slug === 'site') {
      if (row.event === 'view') summary.totalViews = Number(row.count);
      continue;
    }
    const entry = (summary.projects[row.slug] ||= { views: 0, clicks: 0 });
    if (row.event === 'view') entry.views = Number(row.count);
    if (row.event === 'click') entry.clicks = Number(row.count);
  }
  return summary;
}
