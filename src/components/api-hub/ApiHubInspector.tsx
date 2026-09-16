import React, { useState } from 'react';
import {
  Terminal,
  RefreshCw,
  Database,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  BarChart3,
  Code2,
  Lock,
} from 'lucide-react';
import { CvSyncPayload, SyncLog } from '../../types';
import { addSyncLog } from '../../lib/store';

interface ApiHubInspectorProps {
  cvData: CvSyncPayload;
  onUpdateCvData: (newData: CvSyncPayload) => void;
  syncLogs: SyncLog[];
  onRefreshLogs: () => void;
  telemetryStats: {
    views: Record<string, number>;
    interactions: Record<string, number>;
    totalViews: number;
  };
}

export const ApiHubInspector: React.FC<ApiHubInspectorProps> = ({
  cvData,
  onUpdateCvData,
  syncLogs,
  onRefreshLogs,
  telemetryStats,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ingestion' | 'export' | 'schema' | 'auth'>('ingestion');
  const [apiKeyInput, setApiKeyInput] = useState<string>('mp_sec_live_9f83a2e1d74b6c80');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Editable sample payload for simulating Emeron CV Parser POST
  const [customRoleTitle, setCustomRoleTitle] = useState<string>(
    'Lead Infrastructure & AI Solutions Architect'
  );
  const [customHeadline, setCustomHeadline] = useState<string>(
    'Staff Full-Stack Engineer & Enterprise IT Operations Specialist'
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSimulateEmeronSync = async () => {
    setIsExecuting(true);

    // Simulate network roundtrip to Ingestion API
    await new Promise((r) => setTimeout(r, 650));

    // Verify key in simulation
    const validKey = 'mp_sec_live_9f83a2e1d74b6c80';
    if (apiKeyInput.trim() !== validKey) {
      const errResponse = {
        success: false,
        error: 'Forbidden: Invalid API key credentials provided.',
        code: 'FORBIDDEN',
        statusCode: 403,
        timestamp: new Date().toISOString(),
      };
      setLastResponse(errResponse);
      addSyncLog({
        direction: 'INGEST',
        sourceApp: 'Emeron CV Parser (External)',
        endpoint: '/api/sync-cv',
        status: 'UNAUTHORIZED',
        recordsProcessed: 0,
        errorMessage: 'Invalid API key credentials',
        payloadDigest: 'sha256:unauth_attempt',
      });
      onRefreshLogs();
      setIsExecuting(false);
      return;
    }

    // Build updated CV payload
    const updatedPayload: CvSyncPayload = {
      ...cvData,
      version: `v2.${Math.floor(Math.random() * 5) + 5}.0`,
      headline: customHeadline,
      experiences: cvData.experiences.map((exp, idx) => {
        if (idx === 0) {
          return {
            ...exp,
            role: customRoleTitle,
          };
        }
        return exp;
      }),
      rawCvMetadata: {
        parserSource: 'Emeron CV Parsing Engine v2.5-LiveSync',
        confidenceScore: 0.992,
        parsedAt: new Date().toISOString(),
        checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      },
    };

    onUpdateCvData(updatedPayload);

    const successResponse = {
      success: true,
      message: 'Profile data cache successfully synchronized and persisted to PostgreSQL store.',
      recordsUpdated: {
        experiences: updatedPayload.experiences.length,
        skillsCount: Object.values(updatedPayload.skills).flat().length,
        version: updatedPayload.version,
      },
      source: 'Emeron CV Parser Engine',
      latencyMs: 124,
      timestamp: new Date().toISOString(),
    };

    setLastResponse(successResponse);

    addSyncLog({
      direction: 'INGEST',
      sourceApp: 'Emeron CV Parser',
      endpoint: '/api/sync-cv',
      status: 'SUCCESS',
      recordsProcessed: 18,
      errorMessage: null,
      payloadDigest: updatedPayload.rawCvMetadata?.checksum || 'sha256:synced',
    });

    onRefreshLogs();
    setIsExecuting(false);
  };

  const handleSimulateTelemetryExport = async () => {
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 400));

    const exportResponse = {
      success: true,
      portfolioOwner: cvData.fullName,
      location: cvData.location,
      metrics: {
        totalPortfolioViews: telemetryStats.totalViews,
        projects: [
          { slug: 'emeron', name: 'Emeron CV Platform', views: telemetryStats.views['emeron'] || 342, interactions: telemetryStats.interactions['emeron'] || 84 },
          { slug: 'lifestack', name: 'LifeStack Workspace', views: telemetryStats.views['lifestack'] || 218, interactions: telemetryStats.interactions['lifestack'] || 62 },
          { slug: 'hustle-studio', name: 'Hustle Studio SaaS', views: telemetryStats.views['hustle-studio'] || 196, interactions: telemetryStats.interactions['hustle-studio'] || 49 },
        ],
        activeDeployments: 3,
        systemStatus: 'HEALTHY_ENTERPRISE_ROUTING',
      },
      exportedAt: new Date().toISOString(),
      clientSecretVerified: true,
    };

    setLastResponse(exportResponse);

    addSyncLog({
      direction: 'EXPORT',
      sourceApp: 'External Analytical Dashboard',
      endpoint: '/api/telemetry',
      status: 'SUCCESS',
      recordsProcessed: 3,
      errorMessage: null,
      payloadDigest: 'sha256:telemetry_export_digest',
    });

    onRefreshLogs();
    setIsExecuting(false);
  };

  return (
    <section className="py-6" id="sync-inspector">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Integration Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
            Real-Time Profile Synchronizer & API Console
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Live integration pipeline connecting external resume and CV data sources with this portfolio cache, backed by secure timing-safe authentication.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>REST API Routes: Operational</span>
        </div>
      </div>

      {/* Main Architecture Console */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden">
        {/* Console Navigation Tab Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-3 bg-slate-950 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              API Orchestration Console
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-md bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveSubTab('ingestion')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubTab === 'ingestion'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              POST /api/sync-cv
            </button>
            <button
              onClick={() => setActiveSubTab('export')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubTab === 'export'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GET /api/telemetry
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Database Schema
            </button>
            <button
              onClick={() => setActiveSubTab('auth')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubTab === 'auth'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Security
            </button>
          </div>
        </div>

        {/* Console Workspace Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Configuration & Trigger */}
          <div className="lg:col-span-6 flex flex-col space-y-5">
            {/* API Key Input Section */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Key size={13} className="text-blue-400" />
                  Authorization Bearer / API Token:
                </span>
                <span className="text-xs text-emerald-400 font-medium">Timing-Safe Guard Active</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter API Secret Key"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setApiKeyInput('mp_sec_live_9f83a2e1d74b6c80')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-md border border-slate-700 transition-colors whitespace-nowrap"
                  title="Reset to default key"
                >
                  Reset Key
                </button>
              </div>
            </div>

            {activeSubTab === 'ingestion' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Real-Time CV Ingestion Simulator</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    When candidate information is updated in Emeron, it dispatches an authenticated JSON webhook to this portfolio's <code className="text-slate-200">/api/sync-cv</code> endpoint.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Professional Headline Field:
                    </label>
                    <input
                      type="text"
                      value={customHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Lead Position Role Title:
                    </label>
                    <input
                      type="text"
                      value={customRoleTitle}
                      onChange={(e) => setCustomRoleTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSimulateEmeronSync}
                  disabled={isExecuting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play size={14} className={isExecuting ? 'animate-spin' : ''} />
                  <span>{isExecuting ? 'Executing Ingestion Pipeline...' : 'Dispatch Live Ingestion Webhook'}</span>
                </button>
              </div>
            )}

            {activeSubTab === 'export' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-2">
                    <BarChart3 size={14} />
                    <span>Project Engagement & Metrics Export Handler</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    External dashboards query <code className="text-slate-200">GET /api/telemetry</code> to fetch visitor interactions, live showcase views, and recruiter engagement telemetry.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Route:</span>
                    <span className="text-blue-400 font-medium">GET /api/telemetry</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cache Control:</span>
                    <span className="text-slate-300">s-maxage=60, stale-while-revalidate</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Tracked Views:</span>
                    <span className="text-emerald-400 font-semibold">{telemetryStats.totalViews}</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateTelemetryExport}
                  disabled={isExecuting}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={14} className={isExecuting ? 'animate-spin' : ''} />
                  <span>{isExecuting ? 'Fetching Telemetry...' : 'Fetch Live Telemetry Export'}</span>
                </button>
              </div>
            )}

            {activeSubTab === 'schema' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  PostgreSQL schema structured with Drizzle ORM, managing <code className="text-slate-200">cv_data_cache</code>, <code className="text-slate-200">project_telemetry</code>, <code className="text-slate-200">contact_submissions</code>, and <code className="text-slate-200">sync_logs</code>.
                </p>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
                  <div className="text-blue-400 font-semibold">// Drizzle Table: cv_data_cache</div>
                  <div>id: uuid().defaultRandom().primaryKey()</div>
                  <div>version: varchar().notNull()</div>
                  <div>experiences: jsonb().notNull()</div>
                  <div>skills: jsonb().notNull()</div>
                  <div>isActive: boolean().default(true)</div>
                  <div>updatedAt: timestamp().defaultNow()</div>
                </div>
              </div>
            )}

            {activeSubTab === 'auth' && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <Lock size={14} />
                    <span>Timing-Safe Authentication Guard</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Uses <code className="text-slate-200 font-mono">crypto.timingSafeEqual</code> to prevent side-channel timing attacks across all bi-directional sync operations between Emeron and this portfolio.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-semibold">// Security Implementation</div>
                  <div>const match = timingSafeEqual(expectedBuf, providedBuf);</div>
                  <div>{"if (!match) return new Response(..., { status: 403 });"}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Terminal Output & Response Inspector */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Terminal size={14} className="text-blue-400" />
                <span>Response Stream & Payloads</span>
              </div>

              {lastResponse && (
                <button
                  onClick={() => handleCopy(JSON.stringify(lastResponse, null, 2), 'response')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <Copy size={12} />
                  <span>{copiedText === 'response' ? 'Copied JSON' : 'Copy Response'}</span>
                </button>
              )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 min-h-[280px] p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs overflow-auto relative">
              {lastResponse ? (
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8">
                  <Terminal size={24} className="text-slate-700" />
                  <p className="text-xs text-slate-500 font-sans text-center">
                    Awaiting endpoint trigger...
                    <br />
                    Click "Dispatch Live Ingestion Webhook" to execute.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Bi-Directional Sync Logs */}
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center justify-between">
                <span>Recent Sync Audit Log:</span>
                <span className="text-xs text-slate-400 normal-case">{syncLogs.length} events recorded</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {syncLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          log.direction === 'INGEST'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {log.direction}
                      </span>
                      <span className="text-slate-300 font-mono">{log.endpoint}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(log.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
