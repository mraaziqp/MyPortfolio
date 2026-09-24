import { validateApiKey, ApiAuthResult } from '../src/lib/auth';
import { INITIAL_CV_DATA, SHOWCASE_PROJECTS } from '../src/data/initialData';
import { createHash } from 'crypto';

// In-memory runtime state cache (persists across warm invocations in serverless)
export let sharedCvState = { ...INITIAL_CV_DATA };
export let sharedTelemetryState = {
  views: {
    emeron: 342,
    lifestack: 218,
    'hustle-studio': 196,
  },
  interactions: {
    emeron: 84,
    lifestack: 62,
    'hustle-studio': 49,
  },
  totalViews: 756,
};
export let sharedInquiries: Array<{
  id: string;
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
  category: string;
  status: 'unread' | 'read' | 'alerted_to_jarvis';
  createdAt: string;
  receiptId?: string;
}> = [
  {
    id: 'inq-seed-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@enterprise-tech.co.za',
    organization: 'Enterprise Cloud Solutions',
    subject: 'Senior Infrastructure & AI Architecture Role',
    message: 'Reviewing your BCX and full-stack track record. We would love to discuss a solutions lead opening.',
    category: 'recruiting',
    status: 'alerted_to_jarvis',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    receiptId: 'rcpt_1790184995604_a7f9',
  }
];

export let sharedAuditReceipts: Array<{
  receiptId: string;
  timestamp: string;
  unixTimestamp: number;
  actionType: string;
  caller: string;
  status: string;
  statusCode: number;
  latencyMs: number;
  payloadDigest: string;
  receiptSignature: string;
  summary: string;
  details?: Record<string, any>;
}> = [];

export function handleCors(req: any, res: any): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-jarvis-key, x-api-key, x-emeron-key, x-client-secret');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export async function parseBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return { raw: req.body };
    }
  }

  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({ raw: data });
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export function sendJson(res: any, statusCode: number, data: any): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function checkAuth(req: any): ApiAuthResult {
  const urlObj = new URL(req.url || '/', 'http://localhost:3000');
  return validateApiKey(req.headers, urlObj.searchParams);
}

export function calculateDigest(data: unknown): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data || {});
  const hash = createHash('sha256').update(str).digest('hex');
  return `sha256:${hash}`;
}

export function recordServerReceipt(params: {
  actionType: string;
  caller: string;
  status: string;
  statusCode: number;
  latencyMs: number;
  summary: string;
  payload?: unknown;
  details?: Record<string, any>;
}) {
  const now = new Date();
  const unix = now.getTime();
  const randomSuffix = Math.random().toString(16).substring(2, 8);
  const receiptId = `rcpt_${unix}_${randomSuffix}`;
  const payloadDigest = calculateDigest(params.payload || {});
  const receiptSignature = `sig_${calculateDigest(`${receiptId}:${unix}:${params.actionType}:${params.status}`)}`;

  const receipt = {
    receiptId,
    timestamp: now.toISOString(),
    unixTimestamp: unix,
    actionType: params.actionType,
    caller: params.caller,
    status: params.status,
    statusCode: params.statusCode,
    latencyMs: Math.max(1, Math.round(params.latencyMs)),
    payloadDigest,
    receiptSignature,
    summary: params.summary,
    details: params.details,
  };

  sharedAuditReceipts.unshift(receipt);
  if (sharedAuditReceipts.length > 100) {
    sharedAuditReceipts = sharedAuditReceipts.slice(0, 100);
  }
  return receipt;
}

/**
 * Dispatches an event to the Jarvis Assistant Webhook (Local & Remote Fallback)
 */
export async function dispatchToJarvisWebhook(params: {
  sender?: string;
  subject: string;
  body: string;
  details?: Record<string, any>;
  type?: string;
}): Promise<{ success: boolean; response?: any; error?: string }> {
  const webhookKey = 'jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a';
  const userId = 'a009e210-f221-4de4-9428-dae96d68a39e';

  const urls = [
    `http://localhost:3005/api/assistant/webhook/${webhookKey}`,
    `https://jarvis.savestate.co.za/api/assistant/webhook/${webhookKey}`,
  ];

  const payload = {
    type: params.type || 'event',
    channelType: 'webhook',
    userId,
    sender: params.sender || 'MyPortfolio',
    subject: params.subject,
    body: typeof params.body === 'string' ? params.body : JSON.stringify(params.body),
    details: params.details || {},
    timestamp: new Date().toISOString(),
  };

  let lastError = '';
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return { success: true, response: json };
      }
    } catch (e: any) {
      lastError = e?.message || 'Connection failed';
    }
  }

  return { success: false, error: lastError };
}
