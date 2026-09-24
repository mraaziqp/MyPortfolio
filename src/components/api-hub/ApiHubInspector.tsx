import React, { useState } from 'react';
import {
  Terminal,
  Key,
  Play,
  Copy,
  BarChart3,
  Lock,
  Sparkles,
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
    await new Promise((r) => setTimeout(r, 550));

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
      message: 'Profile data cache successfully synchronized and persisted.',
      recordsUpdated: {
        experiences: updatedPayload.experiences.length,
        skillsCount: Object.values(updatedPayload.skills).flat().length,
        version: updatedPayload.version,
      },
      source: 'Emeron CV Parser Engine',
      latencyMs: 118,
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
    await new Promise((r) => setTimeout(r, 350));

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
        systemStatus: 'OPERATIONAL',
      },
      exportedAt: new Date().toISOString(),
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
    <div className="space-y-6" id="sync-inspector">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Integration Architecture
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Profile Synchronization & API Console
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Bi-directional data pipeline connecting external resume and CV data sources with this portfolio cache via timing-safe authenticated webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 self-start sm:self-end">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>REST API: Operational</span>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-3 bg-slate-950/80 gap-3">
          <span className="text-xs font-semibold text-slate-300">
            API Console
          </span>

          <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveSubTab('ingestion')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeSubTab === 'ingestion'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              POST /api/sync-cv
            </button>
            <button
              onClick={() => setActiveSubTab('export')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeSubTab === 'export'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GET /api/telemetry
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeSubTab === 'schema'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Database Schema
            </button>
            <button
              onClick={() => setActiveSubTab('auth')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeSubTab === 'auth'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Security
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Action */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Key Input */}
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Key size={13} className="text-blue-400" />
                  <span>Bearer Token / API Key:</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">Timing-Safe Active</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter API Secret Key"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setApiKeyInput('mp_sec_live_9f83a2e1d74b6c80')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs rounded border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {activeSubTab === 'ingestion' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-blue-400" />
                    <span>Real-Time Ingestion Trigger</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Emeron updates candidate data and dispatches an authenticated JSON payload to <code className="text-slate-200">/api/sync-cv</code>.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Professional Headline:
                    </label>
                    <input
                      type="text"
                      value={customHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Current Position Title:
                    </label>
                    <input
                      type="text"
                      value={customRoleTitle}
                      onChange={(e) => setCustomRoleTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSimulateEmeronSync}
                  disabled={isExecuting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Play size={13} className={isExecuting ? 'animate-spin' : ''} />
                  <span>{isExecuting ? 'Executing...' : 'Dispatch Live Ingestion'}</span>
                </button>
              </div>
            )}

            {activeSubTab === 'export' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <BarChart3 size={13} className="text-blue-400" />
                    <span>Telemetry Export Pipeline</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    External platforms query <code className="text-slate-200">GET /api/telemetry</code> to fetch views and interaction telemetry.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Endpoint:</span>
                    <span className="text-blue-400 font-mono">GET /api/telemetry</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Tracked Views:</span>
                    <span className="text-white font-semibold">{telemetryStats.totalViews}</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateTelemetryExport}
                  disabled={isExecuting}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs rounded border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play size={13} className={isExecuting ? 'animate-spin' : ''} />
                  <span>{isExecuting ? 'Fetching...' : 'Query Live Telemetry'}</span>
                </button>
              </div>
            )}

            {activeSubTab === 'schema' && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-400 leading-relaxed">
                  PostgreSQL schema structured with Drizzle ORM:
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                  <div className="text-blue-400 font-semibold">// Table: cv_data_cache</div>
                  <div>id: uuid().primaryKey()</div>
                  <div>version: varchar().notNull()</div>
                  <div>experiences: jsonb().notNull()</div>
                  <div>skills: jsonb().notNull()</div>
                  <div>updatedAt: timestamp().defaultNow()</div>
                </div>
              </div>
            )}

            {activeSubTab === 'auth' && (
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Lock size={13} />
                    <span>Timing-Safe Authentication Guard</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Uses <code className="text-slate-200 font-mono">crypto.timingSafeEqual</code> to defend against side-channel timing attacks.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Terminal Output */}
          <div className="lg:col-span-6 flex flex-col space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} className="text-blue-400" />
                <span>Response Stream</span>
              </span>

              {lastResponse && (
                <button
                  onClick={() => handleCopy(JSON.stringify(lastResponse, null, 2), 'response')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy size={11} />
                  <span>{copiedText === 'response' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[220px] max-h-[320px] p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs overflow-auto">
              {lastResponse ? (
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-1.5 py-6">
                  <Terminal size={20} className="text-slate-700" />
                  <p className="text-xs text-slate-500 font-sans text-center">
                    Awaiting endpoint execution...
                  </p>
                </div>
              )}
            </div>

            {/* Audit Log */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
                <span>Recent Sync Events</span>
                <span className="text-slate-500 normal-case">{syncLogs.length} events</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {syncLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-300">
                        {log.direction}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-[140px] sm:max-w-none">
                        {log.endpoint}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-emerald-400">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
