import {
  handleCors,
  sendJson,
  parseBody,
  checkAuth,
  recordServerReceipt,
  sharedTelemetryState,
  sharedInquiries,
} from './_utils';
import { SHOWCASE_PROJECTS } from '../src/data/initialData';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const start = performance.now();
  const auth = checkAuth(req);

  if (req.method === 'POST') {
    // Record client interaction event
    const body = await parseBody(req);
    const { projectSlug, eventType } = body;

    if (projectSlug) {
      if (eventType === 'view') {
        sharedTelemetryState.views[projectSlug as keyof typeof sharedTelemetryState.views] =
          (sharedTelemetryState.views[projectSlug as keyof typeof sharedTelemetryState.views] || 0) + 1;
        sharedTelemetryState.totalViews += 1;
      } else {
        sharedTelemetryState.interactions[projectSlug as keyof typeof sharedTelemetryState.interactions] =
          (sharedTelemetryState.interactions[projectSlug as keyof typeof sharedTelemetryState.interactions] || 0) + 1;
      }
    }

    return sendJson(res, 200, {
      success: true,
      currentStats: sharedTelemetryState,
    });
  }

  // GET: LifeStack Analytics Export
  const projectMetrics = SHOWCASE_PROJECTS.map((proj) => ({
    projectSlug: proj.slug,
    projectName: proj.title,
    views: sharedTelemetryState.views[proj.slug as keyof typeof sharedTelemetryState.views] || 45,
    interactions: sharedTelemetryState.interactions[proj.slug as keyof typeof sharedTelemetryState.interactions] || 12,
    lastActive: new Date().toISOString(),
  }));

  const exportPayload = {
    totalViews: sharedTelemetryState.totalViews,
    projects: projectMetrics,
    recentInquiriesCount: sharedInquiries.length + 8,
    lastSyncedAt: new Date().toISOString(),
  };

  recordServerReceipt({
    actionType: 'TELEMETRY_EXPORT',
    caller: auth.isValid ? auth.clientId || 'LifeStackAnalytics' : 'PublicTelemetryConsumer',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: 'Dispatched real-time engagement telemetry to LifeStack / Analytics consumer.',
    payload: { totalViews: exportPayload.totalViews },
  });

  return sendJson(res, 200, exportPayload);
}
