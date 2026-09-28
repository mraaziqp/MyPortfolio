/**
 * Ecosystem dashboard integration.
 *
 *   GET  /api/dashboard/portal   manifest for the hub (public basics; metrics with a key)
 *   GET  /api/dashboard/export   signed snapshot bundle (Jarvis key)
 *   POST /api/dashboard/ingest   restore the CV/projects from a bundle (Jarvis key)
 *   GET  /api/dashboard/manager  ecosystem app registry (Jarvis key)
 */
import { createHmac } from 'crypto';
import { env } from '../_lib/env';
import { ECOSYSTEM_APPS } from '../_lib/ecosystem';
import { authenticate, methodNotAllowed, readJson, requireRole, route, sendJson, sha256, subpath } from '../_lib/http';
import {
  getProfile,
  getProjects,
  getTelemetry,
  inquiryCounts,
  listEvents,
  listInquiries,
  recordEvent,
  saveProfile,
  saveProjects,
} from '../_lib/store';
import { INITIAL_CV_DATA } from '../../src/data/initialData';
import { ValidationError, mergeCvPayload, str } from '../_lib/validate';
import type { ProjectShowcaseItem } from '../../src/types';

function validateProjects(input: unknown): ProjectShowcaseItem[] {
  if (!Array.isArray(input) || input.length > 30) throw new ValidationError('projects must be an array of at most 30 items.');
  return input.map((p: any, i) => {
    if (!p || typeof p !== 'object') throw new ValidationError(`projects[${i}] must be an object.`);
    const f = `projects[${i}]`;
    const link = (v: unknown, name: string) => {
      const s = str(v, `${f}.${name}`, 500, false);
      if (s && !/^https?:\/\//i.test(s)) throw new ValidationError(`${f}.${name} must be an http(s) URL.`);
      return s;
    };
    return {
      id: str(p.id, `${f}.id`, 80)!,
      slug: str(p.slug, `${f}.slug`, 80)!,
      title: str(p.title, `${f}.title`, 120)!,
      tagline: str(p.tagline, `${f}.tagline`, 200)!,
      description: str(p.description, `${f}.description`, 2000)!,
      role: str(p.role, `${f}.role`, 120)!,
      category: str(p.category, `${f}.category`, 80) || 'Software',
      featured: p.featured !== false,
      technologies: Array.isArray(p.technologies) ? p.technologies.slice(0, 20).map((t: unknown, j: number) => str(t, `${f}.technologies[${j}]`, 60)!) : [],
      metrics: [],
      liveUrl: link(p.liveUrl, 'liveUrl'),
      githubUrl: link(p.githubUrl, 'githubUrl'),
    };
  });
}

export default route(async (req, res) => {
  const path = subpath(req, '/api/dashboard');
  const startedAt = performance.now();
  const auth = authenticate(req);

  if (!path || path === 'portal') {
    const profile = await getProfile();
    const manifest: Record<string, unknown> = {
      manifestVersion: '2.0.0',
      appName: `${profile.fullName} — Portfolio`,
      appSlug: 'myportfolio',
      url: env.siteUrl,
      embedPortalUrl: `${env.siteUrl}/?portal=true`,
      status: 'operational',
      generatedAt: new Date().toISOString(),
      jarvis: { schema: `${env.siteUrl}/api/jarvis/schema`, auth: 'x-jarvis-key' },
    };
    if (auth.ok && auth.role === 'jarvis_master') {
      const [telemetry, counts, projects] = await Promise.all([getTelemetry(), inquiryCounts(), getProjects()]);
      manifest.metrics = {
        profileViews: telemetry.totalViews,
        projectClicks: Object.values(telemetry.projects).reduce((n, p) => n + p.clicks, 0),
        openInquiries: counts.open,
        totalInquiries: counts.total,
        experiences: profile.experiences.length,
        projects: projects.length,
        cvVersion: profile.version,
        cvUpdatedAt: profile.rawCvMetadata?.parsedAt ?? null,
      };
    }
    return sendJson(res, 200, manifest);
  }

  if (!requireRole(res, auth, ['jarvis_master'])) return;

  if (path === 'export') {
    const [cvData, projects, telemetry, inquiries, receipts] = await Promise.all([
      getProfile(),
      getProjects(),
      getTelemetry(),
      listInquiries(100),
      listEvents(25),
    ]);
    const exportedAt = new Date().toISOString();
    const body = { exportVersion: '3.0.0', exportedAt, app: 'myportfolio', cvData, projects, telemetry, inquiries, recentReceipts: receipts };
    const digest = sha256(body);
    const signature = createHmac('sha256', env.jarvisApiKey!).update(`${exportedAt}|${digest}`).digest('hex');
    await recordEvent({
      actionType: 'PORTAL_SYNC',
      caller: auth.clientId!,
      status: 'SUCCESS',
      statusCode: 200,
      startedAt,
      summary: 'Dashboard snapshot exported.',
      payload: { digest },
    });
    return sendJson(res, 200, { success: true, bundle: { ...body, sha256Digest: `sha256:${digest}`, signature: `hmac-sha256:${signature}` } });
  }

  if (path === 'ingest') {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    const body = await readJson(req);
    const bundle = body.bundle && typeof body.bundle === 'object' ? body.bundle : body;
    const cv = bundle.cvData || bundle.profile;
    if (!cv && !bundle.projects) {
      return sendJson(res, 400, { success: false, error: 'Bundle needs cvData (or profile) and/or projects.' });
    }
    try {
      // Validate everything before saving anything.
      const nextProfile = cv ? mergeCvPayload(INITIAL_CV_DATA, cv) : null;
      const nextProjects = bundle.projects ? validateProjects(bundle.projects) : null;
      if (nextProfile) {
        nextProfile.rawCvMetadata = { parserSource: 'dashboard-ingest', parsedAt: new Date().toISOString(), checksum: `sha256:${sha256(cv)}` };
        await saveProfile(nextProfile);
      }
      if (nextProjects) await saveProjects(nextProjects);
    } catch (e) {
      if (e instanceof ValidationError) return sendJson(res, 400, { success: false, error: e.message });
      throw e;
    }
    const receipt = await recordEvent({
      actionType: 'PORTAL_SYNC',
      caller: auth.clientId!,
      status: 'SUCCESS',
      statusCode: 200,
      startedAt,
      summary: 'Dashboard bundle ingested.',
      payload: { profile: Boolean(cv), projects: Boolean(bundle.projects) },
    });
    return sendJson(res, 200, { success: true, syncedAt: receipt.timestamp, receiptId: receipt.receiptId });
  }

  if (path === 'manager') {
    return sendJson(res, 200, {
      success: true,
      ecosystemName: 'ARP Cloud Solutions ecosystem',
      managedNodeCount: ECOSYSTEM_APPS.length,
      apps: ECOSYSTEM_APPS,
    });
  }

  return sendJson(res, 404, {
    success: false,
    error: `Unknown dashboard endpoint "${path}".`,
    available: ['portal', 'export', 'ingest', 'manager'],
  });
});
