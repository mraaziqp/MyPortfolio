/**
 * Jarvis assistant API.
 *
 *   GET  /api/jarvis/ping    connectivity check (public, reveals nothing)
 *   GET  /api/jarvis/schema  what Jarvis can read and do (key)
 *   GET  /api/jarvis/state   full snapshot: CV, projects, telemetry, inbox, recent receipts (key)
 *   POST /api/jarvis/action  run one action: { action, params } (key)
 *   GET  /api/jarvis/events  audit receipts, newest first (key)
 *
 * Every write goes through the same validation as /api/sync-cv and is stored,
 * so a change Jarvis makes is what visitors see on the next load.
 */
import { env } from '../_lib/env';
import { authenticate, methodNotAllowed, readJson, requireRole, route, sendJson, subpath } from '../_lib/http';
import {
  getProfile,
  getProjects,
  getTelemetry,
  inquiryCounts,
  listEvents,
  listInquiries,
  recordEvent,
  resetProfile,
  saveProfile,
  setInquiryStatus,
  storageMode,
} from '../_lib/store';
import { SKILL_CATEGORIES, ValidationError, mergeCvPayload } from '../_lib/validate';

const ACTIONS = [
  { action: 'update_headline', description: 'Set the headline shown under the name.', params: { headline: 'string' } },
  { action: 'update_summary', description: 'Replace the professional summary.', params: { summary: 'string' } },
  {
    action: 'set_availability',
    description: 'Show or hide the "open to opportunities" badge.',
    params: { openToWork: 'boolean', note: 'string (optional)' },
  },
  { action: 'add_skill', description: 'Add a skill to a category.', params: { category: SKILL_CATEGORIES.join('|'), skill: 'string' } },
  { action: 'remove_skill', description: 'Remove a skill from a category.', params: { category: SKILL_CATEGORIES.join('|'), skill: 'string' } },
  {
    action: 'update_experience',
    description: 'Edit one role on the timeline.',
    params: { experienceId: 'string', role: 'string?', summary: 'string?', keyAchievements: 'string[]?', technologies: 'string[]?' },
  },
  { action: 'update_profile', description: 'Apply a partial CV update (same shape as POST /api/sync-cv).', params: { '...': 'CV fields' } },
  { action: 'reset_profile', description: 'Discard all stored edits and serve the CV bundled with the site.', params: {} },
  { action: 'mark_inquiry', description: 'Triage a contact enquiry.', params: { inquiryId: 'string', status: 'new|read|archived' } },
  { action: 'test_probe', description: 'Round-trip check; changes nothing.', params: { '...': 'anything' } },
];

async function snapshot() {
  const [profile, projects, telemetry, inquiries, counts, receipts] = await Promise.all([
    getProfile(),
    getProjects(),
    getTelemetry(),
    listInquiries(50),
    inquiryCounts(),
    listEvents(15),
  ]);
  return { profile, projects, telemetry, inquiries, inquiryCounts: counts, recentReceipts: receipts };
}

async function runAction(action: string, params: Record<string, any>) {
  const profile = await getProfile();
  const save = async (patch: Record<string, unknown>) => {
    const next = mergeCvPayload(profile, patch);
    await saveProfile(next);
    return next;
  };

  switch (action) {
    case 'update_headline':
      return { headline: (await save({ headline: params.headline })).headline };
    case 'update_summary':
      return { summary: (await save({ summary: params.summary })).summary };
    case 'set_availability':
      return { availability: (await save({ availability: params })).availability };
    case 'add_skill':
    case 'remove_skill': {
      const category = params.category as (typeof SKILL_CATEGORIES)[number];
      const skill = typeof params.skill === 'string' ? params.skill.trim() : '';
      if (!SKILL_CATEGORIES.includes(category)) throw new ValidationError(`category must be one of ${SKILL_CATEGORIES.join(', ')}.`);
      if (!skill) throw new ValidationError('skill is required.');
      const list = profile.skills[category] || [];
      const updated =
        action === 'add_skill'
          ? list.includes(skill) ? list : [...list, skill]
          : list.filter((s) => s.toLowerCase() !== skill.toLowerCase());
      const next = await save({ skills: { [category]: updated } });
      return { category, skills: next.skills[category] };
    }
    case 'update_experience': {
      const index = profile.experiences.findIndex((e) => e.id === params.experienceId);
      if (index < 0) {
        throw new ValidationError(`No experience with id "${params.experienceId}". Ids: ${profile.experiences.map((e) => e.id).join(', ')}.`);
      }
      const experiences = profile.experiences.map((e, i) => {
        if (i !== index) return e;
        const edit: Record<string, unknown> = {};
        for (const key of ['role', 'summary', 'keyAchievements', 'technologies', 'endDate', 'isCurrent'] as const) {
          if (key in params) edit[key] = params[key];
        }
        return { ...e, ...edit };
      });
      const next = await save({ experiences });
      return { experience: next.experiences[index] };
    }
    case 'update_profile': {
      const next = await save(params);
      return { version: next.version, updatedFields: Object.keys(params) };
    }
    case 'reset_profile':
      await resetProfile();
      return { reset: true, version: (await getProfile()).version };
    case 'mark_inquiry': {
      const status = params.status || 'read';
      if (!['new', 'read', 'archived'].includes(status)) throw new ValidationError('status must be new, read or archived.');
      const inquiry = await setInquiryStatus(String(params.inquiryId || ''), status);
      if (!inquiry) throw new ValidationError(`No enquiry with id "${params.inquiryId}".`);
      return { inquiryId: inquiry.id, status: inquiry.status };
    }
    case 'test_probe':
      return { pong: true, receivedParams: params, serverTime: new Date().toISOString() };
    default:
      return undefined;
  }
}

export default route(async (req, res) => {
  const path = subpath(req, '/api/jarvis');
  const startedAt = performance.now();

  if (!path || path === 'ping') {
    return sendJson(res, 200, {
      status: 'ok',
      app: 'myportfolio',
      name: 'Mohammed Parker — Portfolio',
      url: env.siteUrl,
      time: new Date().toISOString(),
    });
  }

  const auth = authenticate(req);
  if (!requireRole(res, auth, ['jarvis_master'])) return;

  if (path === 'schema') {
    const base = env.siteUrl;
    return sendJson(res, 200, {
      schemaVersion: '3.0.0',
      app: 'myportfolio',
      description: 'Public online CV of Mohammed Parker. Jarvis can read everything and edit the live CV.',
      auth: 'Send the key as "Authorization: Bearer <key>" or "x-jarvis-key: <key>".',
      endpoints: [
        { method: 'GET', path: '/api/jarvis/ping', description: 'Connectivity check (no key).' },
        { method: 'GET', path: '/api/jarvis/schema', description: 'This document.' },
        { method: 'GET', path: '/api/jarvis/state', description: 'CV, projects, telemetry, enquiries and recent receipts.' },
        { method: 'POST', path: '/api/jarvis/action', description: 'Body { action, params }. See actions.' },
        { method: 'GET', path: '/api/jarvis/events', description: 'Audit receipts, newest first. ?limit=1..100' },
        { method: 'GET', path: '/api/contact', description: 'Contact enquiries.' },
        { method: 'GET|POST', path: '/api/sync-cv', description: 'Read CV version / push a partial CV.' },
        { method: 'GET', path: '/api/telemetry', description: 'View and click counters.' },
        { method: 'GET', path: '/api/dashboard/portal', description: 'Dashboard manifest for the ecosystem hub.' },
        { method: 'GET', path: '/api/health', description: 'Integration status (details with a key).' },
      ].map((e) => ({ ...e, url: `${base}${e.path}` })),
      actions: ACTIONS,
      storage: storageMode(),
    });
  }

  if (path === 'state') {
    return sendJson(res, 200, { success: true, snapshotAt: new Date().toISOString(), ...(await snapshot()) });
  }

  if (path === 'events') {
    const limit = Math.min(100, Math.max(1, Number(new URL(req.url, 'http://x').searchParams.get('limit')) || 30));
    const events = await listEvents(limit);
    return sendJson(res, 200, { success: true, total: events.length, events });
  }

  if (path === 'action') {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    const body = await readJson(req);
    const action = String(body.action || '');
    const params = body.params && typeof body.params === 'object' ? body.params : {};

    let result;
    try {
      result = await runAction(action, params);
    } catch (e) {
      if (e instanceof ValidationError) {
        await recordEvent({
          actionType: 'JARVIS_ACTION',
          caller: auth.clientId!,
          status: 'FAILED',
          statusCode: 400,
          startedAt,
          summary: `Action "${action}" rejected: ${e.message}`,
          payload: { action, params },
        });
        return sendJson(res, 400, { success: false, action, error: e.message });
      }
      throw e;
    }
    if (result === undefined) {
      return sendJson(res, 400, {
        success: false,
        error: `Unknown action "${action}".`,
        availableActions: ACTIONS.map((a) => a.action),
      });
    }

    const receipt = await recordEvent({
      actionType: 'JARVIS_ACTION',
      caller: auth.clientId!,
      status: 'SUCCESS',
      statusCode: 200,
      startedAt,
      summary: `Executed "${action}".`,
      payload: { action, params },
    });
    return sendJson(res, 200, {
      success: true,
      action,
      result,
      receipt: {
        receiptId: receipt.receiptId,
        timestamp: receipt.timestamp,
        payloadDigest: receipt.payloadDigest,
        receiptSignature: receipt.receiptSignature,
      },
    });
  }

  return sendJson(res, 404, {
    success: false,
    error: `Unknown Jarvis endpoint "${path}".`,
    available: ['ping', 'schema', 'state', 'action', 'events'],
  });
});
