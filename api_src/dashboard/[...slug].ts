import {
  handleCors,
  sendJson,
  parseBody,
  checkAuth,
  recordServerReceipt,
  calculateDigest,
  sharedCvState,
  sharedTelemetryState,
  sharedInquiries,
  sharedAuditReceipts,
} from '../_utils';
import { SHOWCASE_PROJECTS } from '../../src/data/initialData';

export const ECOSYSTEM_APPS = [
  {
    id: 'second-brain',
    name: 'Jarvis Second Brain AI Core',
    slug: 'second-brain',
    category: 'ai_core',
    status: 'operational',
    localUrl: 'http://localhost:3005',
    productionUrl: 'https://jarvis.savestate.co.za',
    healthEndpoint: 'http://localhost:3005/api/system/status',
    description: 'Central AI assistant, autonomous triage sentry, vector memory, and execution runtime.',
    portalEmbedUrl: 'http://localhost:3005/m/control',
    capabilities: ['autonomous_actions', 'email_triage', 'webhook_gateway', 'voice_pipeline'],
  },
  {
    id: 'agent-builder',
    name: 'Agent Builder (PC & Remote)',
    slug: 'agent-builder',
    category: 'ai_core',
    status: 'operational',
    productionUrl: 'https://agent-builder-remote.vercel.app',
    description: 'Visual autonomous agent designer, prompt flow orchestrator, and tool synthesizer.',
    portalEmbedUrl: 'https://agent-builder-remote.vercel.app',
    capabilities: ['prompt_engineering', 'agent_orchestration', 'ide_bridge', 'code_synthesis'],
  },
  {
    id: 'consolidated-hub',
    name: 'Consolidated Business Hub',
    slug: 'consolidated-hub',
    category: 'saas_platform',
    status: 'operational',
    localUrl: 'http://localhost:9003',
    productionUrl: 'https://consolidated-hub.vercel.app',
    description: 'Master enterprise hub managing ARP Cloud Solutions, client projects, invoices, and payments.',
    portalEmbedUrl: 'https://consolidated-hub.vercel.app/admin',
    capabilities: ['invoicing', 'client_crm', 'payfast_gateway', 'firebase_sync'],
  },
  {
    id: 'aethermail',
    name: 'AetherMail Business Gateway',
    slug: 'aethermail',
    category: 'productivity',
    status: 'operational',
    localUrl: 'http://localhost:3007',
    productionUrl: 'https://aethermail-five.vercel.app',
    description: 'Autonomous email triage, Stalwart relay, IMAP synchronization, and spam firewall.',
    portalEmbedUrl: 'https://aethermail-five.vercel.app',
    capabilities: ['smtp_relay', 'imap_sync', 'smart_drafting', 'domain_management'],
  },
  {
    id: 'cvgenman',
    name: 'Emeron CV Parsing & Generation Engine',
    slug: 'cvgenman',
    category: 'saas_platform',
    status: 'operational',
    productionUrl: 'https://cvgenman.vercel.app',
    description: 'AI-assisted resume parser, professional CV builder, and portfolio synchronization webhook.',
    portalEmbedUrl: 'https://cvgenman.vercel.app',
    capabilities: ['resume_parsing', 'pdf_export', 'webhook_sync', 'candidate_scoring'],
  },
  {
    id: 'remotedesk',
    name: 'RemoteDesk Enterprise Workspace',
    slug: 'remotedesk',
    category: 'productivity',
    status: 'operational',
    productionUrl: 'https://remotedesk-omega.vercel.app',
    description: 'Remote desktop gateway, cloud file sync, and team collaboration canvas.',
    portalEmbedUrl: 'https://remotedesk-omega.vercel.app',
    capabilities: ['session_streaming', 'file_vault', 'multi_user_collab'],
  },
  {
    id: 'financeplay',
    name: 'FinancePlay Analytics',
    slug: 'financeplay',
    category: 'saas_platform',
    status: 'operational',
    productionUrl: 'https://www.xpfinance.co.za',
    description: 'Personal and corporate finance modeling, expense classification, and budget forecasting.',
    portalEmbedUrl: 'https://www.xpfinance.co.za',
    capabilities: ['transaction_categorization', 'budgeting', 'financial_reports'],
  },
  {
    id: 'deenify',
    name: 'Deenify Spiritual Lifestyle',
    slug: 'deenify',
    category: 'consumer',
    status: 'operational',
    productionUrl: 'https://www.deenify.co.za',
    description: 'Islamic companion app featuring prayer timings, Qibla compass, and Quran recitation.',
    portalEmbedUrl: 'https://www.deenify.co.za',
    capabilities: ['prayer_times', 'quran_audio', 'community_events'],
  },
  {
    id: 'project-cupid',
    name: 'Project Cupid / Muslim Dating',
    slug: 'project-cupid',
    category: 'consumer',
    status: 'operational',
    productionUrl: 'https://muslim-dating.vercel.app',
    description: 'Modern, values-aligned matchmaking and marital relationship platform.',
    portalEmbedUrl: 'https://muslim-dating.vercel.app',
    capabilities: ['profile_matching', 'direct_messaging', 'verification'],
  },
  {
    id: 'myportfolio',
    name: 'Mohamed Raaziq Parker Portfolio (Self)',
    slug: 'myportfolio',
    category: 'productivity',
    status: 'operational',
    productionUrl: 'https://portfolio.arpcloudsolutions.co.za',
    description: 'Showcase portfolio, tech stack matrix, CV synchronization, and ecosystem dashboard hub.',
    portalEmbedUrl: 'https://portfolio.arpcloudsolutions.co.za/?portal=true',
    capabilities: ['cv_sync', 'telemetry_export', 'jarvis_bridge', 'dashboard_manager'],
  },
];

async function handlePortal(req: any, res: any, start: number, auth: any, origin: string) {
  const manifest = {
    manifestVersion: '1.0.0',
    appName: 'Mohamed Raaziq Parker Portfolio',
    appSlug: 'myportfolio',
    primaryDomain: 'arpcloudsolutions.co.za',
    subdomainUrl: 'https://portfolio.arpcloudsolutions.co.za',
    embedPortalUrl: `${origin}/?portal=true`,
    status: 'operational',
    lastSeenAt: new Date().toISOString(),
    jarvisBridge: {
      enabled: true,
      webhookConfigured: true,
      masterKeyPrefix: 'jrv_mp_',
      endpoints: {
        ping: `${origin}/api/jarvis/ping`,
        schema: `${origin}/api/jarvis/schema`,
        state: `${origin}/api/jarvis/state`,
        action: `${origin}/api/jarvis/action`,
        events: `${origin}/api/jarvis/events`,
        portal: `${origin}/api/dashboard/portal`,
        export: `${origin}/api/dashboard/export`,
        ingest: `${origin}/api/dashboard/ingest`,
        manager: `${origin}/api/dashboard/manager`,
      },
    },
    metrics: {
      profileViews: sharedTelemetryState.totalViews,
      totalInteractions: Object.values(sharedTelemetryState.interactions).reduce((a, b) => a + b, 0),
      activeInquiries: sharedInquiries.filter((i) => i.status === 'unread' || i.status === 'alerted_to_jarvis').length,
      totalExperiences: sharedCvState.experiences.length,
      totalProjects: SHOWCASE_PROJECTS.length,
      totalSkills:
        sharedCvState.skills.languages.length +
        sharedCvState.skills.frameworks.length +
        sharedCvState.skills.cloudAndDevOps.length +
        sharedCvState.skills.enterpriseAndIT.length,
      cvVersion: sharedCvState.version,
    },
    widgets: [
      { id: 'telemetry_overview', title: 'Visitor Telemetry & Engagement', type: 'metric', size: 'sm' },
      { id: 'jarvis_sentry', title: 'Jarvis Autonomous Sentry', type: 'feed', size: 'md' },
      { id: 'recruiter_inbox', title: 'Recruiter & Collaboration Inquiries', type: 'table', size: 'lg' },
      { id: 'cv_cache_status', title: 'Emeron CV Parsing Engine Status', type: 'action_card', size: 'sm' },
    ],
    allowableActions: [
      { action: 'sync_cv', description: 'Trigger Emeron CV sync', params: { force: 'boolean' } },
      { action: 'update_headline', description: 'Update profile headline', params: { headline: 'string' } },
      { action: 'mark_inquiry_read', description: 'Mark inquiry as read', params: { inquiryId: 'string' } },
    ],
  };

  recordServerReceipt({
    actionType: 'PORTAL_SYNC',
    caller: auth.isValid ? auth.clientId || 'Jarvis' : 'DashboardManagerProbe',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: 'Dashboard Portal Manifest generated for Jarvis General Dashboard Manager.',
    payload: { manifestVersion: manifest.manifestVersion },
  });

  return sendJson(res, 200, manifest);
}

async function handleExport(req: any, res: any, start: number, auth: any) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error,
    });
  }

  const now = new Date();
  const exportPayload = {
    exportVersion: '2.5.0',
    exportId: `exp_${now.getTime()}_${Math.random().toString(16).substring(2, 8)}`,
    exportedAt: now.toISOString(),
    unixTimestamp: now.getTime(),
    app: {
      name: 'Mohamed Raaziq Parker Portfolio',
      slug: 'myportfolio',
      subdomain: 'portfolio.arpcloudsolutions.co.za',
    },
    cvData: sharedCvState,
    projects: SHOWCASE_PROJECTS,
    telemetry: sharedTelemetryState,
    inquiries: sharedInquiries,
    recentReceipts: sharedAuditReceipts.slice(0, 25),
  };

  const sha256Digest = calculateDigest(exportPayload);
  const signature = `sig_${calculateDigest(`${exportPayload.exportId}:${exportPayload.unixTimestamp}:${sha256Digest}`)}`;

  const bundle = {
    ...exportPayload,
    sha256Digest,
    receiptSignature: signature,
  };

  const receipt = recordServerReceipt({
    actionType: 'PORTAL_SYNC',
    caller: auth.clientId || 'JarvisDashboardManager',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: 'Full dashboard snapshot exported for centralized management in Jarvis.',
    payload: { exportId: exportPayload.exportId, digest: sha256Digest },
  });

  return sendJson(res, 200, {
    success: true,
    bundle,
    receiptId: receipt.receiptId,
  });
}

async function handleIngest(req: any, res: any, start: number, auth: any) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error,
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const body = await parseBody(req);
  const bundle = body.bundle || body;

  if (!bundle || (!bundle.cvData && !bundle.profile)) {
    return sendJson(res, 400, { success: false, error: 'Invalid dashboard bundle payload. Missing cvData.' });
  }

  if (bundle.cvData) {
    Object.assign(sharedCvState, bundle.cvData);
  }
  if (bundle.telemetry) {
    Object.assign(sharedTelemetryState, bundle.telemetry);
  }
  if (Array.isArray(bundle.inquiries)) {
    sharedInquiries.splice(0, sharedInquiries.length, ...bundle.inquiries);
  }

  const receipt = recordServerReceipt({
    actionType: 'PORTAL_SYNC',
    caller: auth.clientId || 'JarvisDashboardManager',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: 'Dashboard state successfully ingested and synchronized from Jarvis Manager.',
    payload: { source: bundle.exportId || 'JarvisDirectSync' },
  });

  return sendJson(res, 200, {
    success: true,
    message: 'Dashboard state successfully ingested.',
    syncedAt: new Date().toISOString(),
    receiptId: receipt.receiptId,
  });
}

async function handleManager(req: any, res: any, start: number, auth: any) {
  const receipt = recordServerReceipt({
    actionType: 'FLEET_PROBE',
    caller: auth.isValid ? auth.clientId || 'Jarvis' : 'PublicDashboardExplorer',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: 'Ecosystem dashboard manager registry queried.',
  });

  return sendJson(res, 200, {
    success: true,
    ecosystemName: 'ARP Cloud Solutions & Jarvis Ecosystem Fleet',
    managedNodeCount: ECOSYSTEM_APPS.length,
    apps: ECOSYSTEM_APPS,
    receiptId: receipt.receiptId,
    timestamp: new Date().toISOString(),
  });
}

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const urlObj = new URL(req.url || '', 'http://localhost');
  const rawSubpath = Array.isArray(req.query?.slug)
    ? req.query.slug.join('/')
    : (req.query?.slug || urlObj.pathname.replace(/^\/api\/dashboard\/?/, ''));
  const subpath = (rawSubpath || '').split('?')[0].replace(/^\//, '').replace(/\/$/, '');

  const start = performance.now();
  const auth = checkAuth(req);
  const origin = req.headers.host ? `https://${req.headers.host}` : 'https://portfolio.arpcloudsolutions.co.za';

  if (!subpath || subpath === 'portal') {
    return handlePortal(req, res, start, auth, origin);
  }
  if (subpath === 'export') {
    return handleExport(req, res, start, auth);
  }
  if (subpath === 'ingest') {
    return handleIngest(req, res, start, auth);
  }
  if (subpath === 'manager') {
    return handleManager(req, res, start, auth);
  }

  return sendJson(res, 404, {
    error: `Unknown Dashboard sub-endpoint: "${subpath}"`,
    availableEndpoints: ['portal', 'export', 'ingest', 'manager'],
  });
}
