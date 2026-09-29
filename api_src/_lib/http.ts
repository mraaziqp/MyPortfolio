import { createHash, timingSafeEqual } from 'crypto';
import { env } from './env';

export type Role = 'jarvis_master' | 'client_sync';

export interface AuthResult {
  ok: boolean;
  role?: Role;
  clientId?: string;
  status?: number;
  error?: string;
}

const MAX_BODY_BYTES = 256 * 1024;

export function applyCors(req: any, res: any): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-jarvis-key, x-api-key, x-emeron-key'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export function sendJson(res: any, status: number, data: unknown, cache?: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cache || 'no-store');
  res.end(JSON.stringify(data));
}

export function methodNotAllowed(res: any, allowed: string[]): void {
  res.setHeader('Allow', allowed.join(', '));
  sendJson(res, 405, { success: false, error: `Method not allowed. Use ${allowed.join(' or ')}.` });
}

export class BodyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Parses a JSON body whether or not the platform already did. Rejects oversized or malformed input. */
export async function readJson(req: any): Promise<Record<string, any>> {
  let body: unknown;
  try {
    // On Vercel `req.body` is a getter that parses lazily and throws on invalid JSON.
    body = req.body;
  } catch {
    throw new BodyError(400, 'Request body is not valid JSON.');
  }
  if (body !== undefined && body !== null && body !== '') {
    if (typeof body === 'object' && !Buffer.isBuffer(body)) {
      if (Array.isArray(body)) throw new BodyError(400, 'Request body must be a JSON object.');
      return body as Record<string, any>;
    }
    return parseJsonText(Buffer.isBuffer(body) ? body.toString('utf8') : String(body));
  }

  const text = await new Promise<string>((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new BodyError(413, 'Request body too large.'));
        req.destroy?.();
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', () => reject(new BodyError(400, 'Could not read request body.')));
  });
  return text ? parseJsonText(text) : {};
}

function parseJsonText(text: string): Record<string, any> {
  if (text.length > MAX_BODY_BYTES) throw new BodyError(413, 'Request body too large.');
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new BodyError(400, 'Request body must be a JSON object.');
    }
    return parsed;
  } catch (e) {
    if (e instanceof BodyError) throw e;
    throw new BodyError(400, 'Request body is not valid JSON.');
  }
}

function safeEqual(expected: string, provided: string): boolean {
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

function header(req: any, name: string): string | undefined {
  const value = req.headers?.[name];
  return Array.isArray(value) ? value[0] : value || undefined;
}

/**
 * Accepts the key as `Authorization: Bearer`, `x-jarvis-key`, `x-api-key` or `x-emeron-key`.
 * Query-string keys are deliberately not accepted: they end up in access logs.
 */
export function authenticate(req: any): AuthResult {
  const bearer = header(req, 'authorization');
  const provided = (
    bearer?.toLowerCase().startsWith('bearer ')
      ? bearer.slice(7)
      : header(req, 'x-jarvis-key') || header(req, 'x-api-key') || header(req, 'x-emeron-key')
  )?.trim();

  if (!env.jarvisApiKey && !env.portfolioApiKey) {
    return { ok: false, status: 503, error: 'API keys are not configured on this deployment.' };
  }
  if (!provided) {
    return { ok: false, status: 401, error: 'Missing API key (Authorization: Bearer, x-jarvis-key or x-api-key).' };
  }
  if (env.jarvisApiKey && safeEqual(env.jarvisApiKey, provided)) {
    return { ok: true, role: 'jarvis_master', clientId: 'jarvis' };
  }
  if (env.portfolioApiKey && safeEqual(env.portfolioApiKey, provided)) {
    return { ok: true, role: 'client_sync', clientId: 'cv-sync-client' };
  }
  return { ok: false, status: 403, error: 'Invalid API key.' };
}

/** Sends the error response and returns false when the caller lacks one of the roles. */
export function requireRole(res: any, auth: AuthResult, roles: Role[]): boolean {
  if (!auth.ok) {
    if (auth.status === 401) res.setHeader('WWW-Authenticate', 'Bearer');
    sendJson(res, auth.status || 401, { success: false, error: auth.error });
    return false;
  }
  if (!auth.role || !roles.includes(auth.role)) {
    sendJson(res, 403, { success: false, error: 'This key is not allowed to call this endpoint.' });
    return false;
  }
  return true;
}

export function clientIp(req: any): string {
  const forwarded = header(req, 'x-forwarded-for');
  return (forwarded?.split(',')[0] || header(req, 'x-real-ip') || req.socket?.remoteAddress || 'unknown').trim();
}

export function sha256(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? {});
  return createHash('sha256').update(text).digest('hex');
}

/** Subpath after a catch-all prefix, e.g. "/api/jarvis/state?x=1" -> "state". */
export function subpath(req: any, prefix: string): string {
  const slug = req.query?.slug;
  if (Array.isArray(slug)) return slug.join('/');
  if (typeof slug === 'string' && slug) return slug;
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  return pathname.replace(new RegExp(`^${prefix}/?`), '').replace(/\/$/, '');
}

/** Wraps a handler so thrown errors become JSON instead of a platform 500 page. */
export function route(handler: (req: any, res: any) => Promise<void>) {
  return async (req: any, res: any) => {
    if (applyCors(req, res)) return;
    try {
      await handler(req, res);
    } catch (e: any) {
      if (e instanceof BodyError) return sendJson(res, e.status, { success: false, error: e.message });
      if (e?.name === 'StorageUnavailableError') {
        res.setHeader('Retry-After', '60');
        return sendJson(res, 503, { success: false, error: e.message, retryable: true });
      }
      console.error('[api]', req.method, req.url, e);
      if (!res.headersSent) sendJson(res, 500, { success: false, error: 'Internal error.' });
    }
  };
}
