/**
 * POST /api/telemetry — anonymous counters from the site (page view, project view/click).
 * GET  /api/telemetry — the totals (either key).
 *
 * Only known slugs are counted, so the table cannot be filled with junk rows.
 */
import { SHOWCASE_PROJECTS } from '../src/data/initialData';
import { authenticate, methodNotAllowed, readJson, requireRole, route, sendJson } from './_lib/http';
import { TELEMETRY_EVENTS, TelemetryEvent, getProjects, getTelemetry, inquiryCounts, incrementTelemetry } from './_lib/store';

export default route(async (req, res) => {
  if (req.method === 'POST') {
    const body = await readJson(req);
    const slug = typeof body.slug === 'string' ? body.slug : body.projectSlug;
    const event = (body.event ?? body.eventType) as TelemetryEvent;
    const projects = await getProjects().catch(() => SHOWCASE_PROJECTS);
    const known = slug === 'site' || projects.some((p) => p.slug === slug);

    if (!known || !TELEMETRY_EVENTS.includes(event)) {
      return sendJson(res, 400, { success: false, error: 'Unknown slug or event.' });
    }
    // A counter is never worth an error in a visitor's console: drop it if storage is down.
    await incrementTelemetry(slug, event).catch((e) => console.warn('[telemetry] dropped:', e?.message));
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET', 'POST']);

  const auth = authenticate(req);
  if (!requireRole(res, auth, ['jarvis_master', 'client_sync'])) return;

  const [telemetry, projects, inquiries] = await Promise.all([getTelemetry(), getProjects(), inquiryCounts()]);
  return sendJson(res, 200, {
    success: true,
    totalViews: telemetry.totalViews,
    projects: projects.map((p) => ({
      projectSlug: p.slug,
      projectName: p.title,
      views: telemetry.projects[p.slug]?.views ?? 0,
      clicks: telemetry.projects[p.slug]?.clicks ?? 0,
    })),
    inquiries,
    generatedAt: new Date().toISOString(),
  });
});
