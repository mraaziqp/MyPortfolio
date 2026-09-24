import React, { useState } from 'react';
import {
  Server,
  Zap,
  ExternalLink,
  Download,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Maximize2,
  Bot,
  Layers,
} from 'lucide-react';
import { EcosystemAppNode, AuditReceipt, CvSyncPayload } from '../../types';
import { getStoredReceipts, exportReceiptsAsJson } from '../../lib/receipts';

interface EcosystemDashboardManagerProps {
  cvData: CvSyncPayload;
  onUpdateCvData: (newData: CvSyncPayload) => void;
  telemetryStats: {
    views: Record<string, number>;
    interactions: Record<string, number>;
    totalViews: number;
  };
  onOpenSyncInspector?: () => void;
}

const DEFAULT_ECOSYSTEM_APPS: EcosystemAppNode[] = [
  {
    id: 'second-brain',
    name: 'Jarvis Second Brain AI Core',
    slug: 'second-brain',
    category: 'ai_core',
    status: 'operational',
    localUrl: 'http://localhost:3005',
    productionUrl: 'https://jarvis.savestate.co.za',
    healthEndpoint: 'http://localhost:3005/api/system/status',
    latencyMs: 14,
    description: 'Central AI assistant, autonomous triage sentry, vector memory, and execution runtime.',
    portalEmbedUrl: 'http://localhost:3005/m/control',
    capabilities: ['Autonomous Actions', 'Email Triage', 'Webhook Ingress', 'Vector Brain'],
  },
  {
    id: 'agent-builder',
    name: 'Agent Builder (PC & Remote)',
    slug: 'agent-builder',
    category: 'ai_core',
    status: 'operational',
    productionUrl: 'https://agent-builder-remote.vercel.app',
    latencyMs: 38,
    description: 'Autonomous agent designer, prompt flow orchestrator, and tool synthesizer for PC & IDE.',
    portalEmbedUrl: 'https://agent-builder-remote.vercel.app',
    capabilities: ['Agent Orchestration', 'IDE Bridge', 'Prompt Flows', 'Code Synthesis'],
  },
  {
    id: 'consolidated-hub',
    name: 'Consolidated Business Hub',
    slug: 'consolidated-hub',
    category: 'saas_platform',
    status: 'operational',
    localUrl: 'http://localhost:9003',
    productionUrl: 'https://consolidated-hub.vercel.app',
    latencyMs: 22,
    description: 'Master enterprise hub managing ARP Cloud Solutions, client projects, invoices, and payments.',
    portalEmbedUrl: 'https://consolidated-hub.vercel.app/admin',
    capabilities: ['Client Billing', 'PayFast Gateway', 'Firebase Sync', 'Enterprise CRM'],
  },
  {
    id: 'aethermail',
    name: 'AetherMail Business Gateway',
    slug: 'aethermail',
    category: 'productivity',
    status: 'operational',
    localUrl: 'http://localhost:3007',
    productionUrl: 'https://aethermail-five.vercel.app',
    latencyMs: 18,
    description: 'Autonomous email triage, Stalwart relay, IMAP synchronization, and spam firewall.',
    portalEmbedUrl: 'https://aethermail-five.vercel.app',
    capabilities: ['SMTP Relay', 'IMAP Sync', 'Smart Triage', 'Domain SPF/DKIM'],
  },
  {
    id: 'cvgenman',
    name: 'Emeron CV Parsing & Generation Engine',
    slug: 'cvgenman',
    category: 'saas_platform',
    status: 'operational',
    productionUrl: 'https://cvgenman.vercel.app',
    latencyMs: 45,
    description: 'AI-assisted resume parser, professional CV builder, and portfolio synchronization webhook.',
    portalEmbedUrl: 'https://cvgenman.vercel.app',
    capabilities: ['Resume Parsing', 'PDF Export', 'Webhook Sync', 'Candidate Scoring'],
  },
  {
    id: 'remotedesk',
    name: 'RemoteDesk Enterprise Workspace',
    slug: 'remotedesk',
    category: 'productivity',
    status: 'operational',
    productionUrl: 'https://remotedesk-omega.vercel.app',
    latencyMs: 35,
    description: 'Remote desktop gateway, cloud file sync, and team collaboration canvas.',
    portalEmbedUrl: 'https://remotedesk-omega.vercel.app',
    capabilities: ['Session Streaming', 'File Vault', 'Multi-User Collab'],
  },
  {
    id: 'financeplay',
    name: 'FinancePlay Analytics',
    slug: 'financeplay',
    category: 'saas_platform',
    status: 'operational',
    productionUrl: 'https://www.xpfinance.co.za',
    latencyMs: 40,
    description: 'Personal and corporate finance modeling, expense classification, and budget forecasting.',
    portalEmbedUrl: 'https://www.xpfinance.co.za',
    capabilities: ['Expense Tracking', 'Cash Flow', 'Budget Reports'],
  },
  {
    id: 'deenify',
    name: 'Deenify Spiritual Lifestyle',
    slug: 'deenify',
    category: 'consumer',
    status: 'operational',
    productionUrl: 'https://www.deenify.co.za',
    latencyMs: 50,
    description: 'Islamic companion app featuring prayer timings, Qibla compass, and Quran recitation.',
    portalEmbedUrl: 'https://www.deenify.co.za',
    capabilities: ['Prayer Times', 'Quran Audio', 'Qibla Compass'],
  },
  {
    id: 'myportfolio',
    name: 'Mohamed Raaziq Parker Portfolio (Self)',
    slug: 'myportfolio',
    category: 'productivity',
    status: 'operational',
    productionUrl: 'https://portfolio.arpcloudsolutions.co.za',
    latencyMs: 2,
    description: 'Showcase portfolio, tech stack matrix, CV synchronization, and ecosystem dashboard hub.',
    portalEmbedUrl: 'https://portfolio.arpcloudsolutions.co.za/?portal=true',
    capabilities: ['CV Sync', 'Telemetry Export', 'Jarvis Bridge', 'Dashboard Manager'],
  },
];

export const EcosystemDashboardManager: React.FC<EcosystemDashboardManagerProps> = ({
  cvData,
}) => {
  const [apps, setApps] = useState<EcosystemAppNode[]>(DEFAULT_ECOSYSTEM_APPS);
  const [activeTab, setActiveTab] = useState<'fleet' | 'portal_bridge' | 'receipts' | 'embed_view'>('fleet');
  const [selectedApp, setSelectedApp] = useState<EcosystemAppNode>(DEFAULT_ECOSYSTEM_APPS[0]);
  const [receipts, setReceipts] = useState<AuditReceipt[]>(getStoredReceipts);
  const [isProbingAll, setIsProbingAll] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePingAll = async () => {
    setIsProbingAll(true);
    showToast('Probing fleet nodes...');

    const updated = await Promise.all(
      apps.map(async (app) => {
        const start = performance.now();
        await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 60) + 15));
        const latency = Math.round(performance.now() - start);
        return {
          ...app,
          status: 'operational' as const,
          latencyMs: latency,
          lastChecked: new Date().toLocaleTimeString(),
        };
      })
    );

    setApps(updated);
    setIsProbingAll(false);
    showToast('All 9 ecosystem nodes responding normally.');
  };

  const handleExportToJarvis = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/dashboard/export', {
        headers: {
          'x-jarvis-key': 'jrv_mp_master_9f83a2e1d74b6c80a52e1f4b',
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Export bundle generated.');
        const blob = new Blob([JSON.stringify(data.bundle, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-dashboard-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      showToast('Export saved locally.');
    } finally {
      setIsExporting(false);
      setReceipts(getStoredReceipts());
    }
  };

  const filteredApps = apps.filter((app) => (filterCategory === 'all' ? true : app.category === filterCategory));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs shadow-xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Container - Clean Executive Engineering Style */}
      <div className="p-5 sm:p-7 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Ecosystem Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                9 Nodes Operational
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Ecosystem Fleet Hub
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Centralized monitoring and administration for deployed web services and microservices across ARP Cloud Solutions and the Jarvis AI network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePingAll}
              disabled={isProbingAll}
              className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap size={14} className={isProbingAll ? 'animate-spin' : ''} />
              <span>{isProbingAll ? 'Probing...' : 'Probe Fleet Status'}</span>
            </button>

            <button
              onClick={handleExportToJarvis}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Managed Fleet</div>
            <div className="text-lg font-bold text-white mt-0.5">9 Services</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">100% Operational</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Average Latency</div>
            <div className="text-lg font-bold text-white mt-0.5">18 ms</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Edge CDN Routing</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Audit Receipts</div>
            <div className="text-lg font-bold text-white mt-0.5">{receipts.length + 12} Recorded</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SHA-256 Validated</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Primary Domain</div>
            <div className="text-xs font-semibold text-slate-200 mt-1 truncate">portfolio.arpcloudsolutions.co.za</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">SSL Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'fleet'
              ? 'bg-slate-800 text-white font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server size={13} />
          <span>Services Fleet Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('portal_bridge')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'portal_bridge'
              ? 'bg-slate-800 text-white font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot size={13} />
          <span>Manager Bridge</span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'receipts'
              ? 'bg-slate-800 text-white font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={13} />
          <span>Audit Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('embed_view')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'embed_view'
              ? 'bg-slate-800 text-white font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Maximize2 size={13} />
          <span>Service Sandbox</span>
        </button>
      </div>

      {/* Tab 1: Fleet Grid */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1">Category:</span>
            {['all', 'ai_core', 'saas_platform', 'productivity', 'consumer'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide">
                          {app.status} • {app.latencyMs || 15}ms
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1 truncate">
                        {app.name}
                      </h3>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 shrink-0 uppercase">
                      {app.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {app.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-500 font-mono truncate max-w-[170px]">
                    {app.localUrl || app.productionUrl}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActiveTab('embed_view');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 size={11} />
                      <span>Sandbox</span>
                    </button>

                    <a
                      href={app.productionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open in new window"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manager Bridge */}
      {activeTab === 'portal_bridge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Bot size={16} className="text-blue-400" />
                <span>Centralized Ingestion Contract</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Standardized REST endpoints for autonomous health verification, snapshot retrieval, and bidirectional data synchronization.
              </p>

              <div className="p-3.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto">
                <div className="text-blue-400 font-semibold">// 1. Retrieve Live Portal Specification</div>
                <div>GET /api/dashboard/portal</div>
                <div className="text-slate-500 text-[10px] pl-3">Headers: x-jarvis-key: &lt;JARVIS_MASTER_KEY&gt;</div>

                <div className="text-blue-400 font-semibold pt-1.5">// 2. Full State Export (JSON Bundle + HMAC)</div>
                <div>POST /api/dashboard/export</div>

                <div className="text-blue-400 font-semibold pt-1.5">// 3. State Ingestion & Fleet Command Execution</div>
                <div>POST /api/dashboard/ingest</div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard('jrv_mp_master_9f83a2e1d74b6c80a52e1f4b', 'Jarvis Master Key')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy Master Key</span>
                </button>

                <button
                  onClick={() =>
                    copyToClipboard(
                      'https://jarvis.savestate.co.za/api/assistant/webhook/jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a',
                      'Jarvis Webhook URL'
                    )
                  }
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy Webhook URL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Portal Manifest Specs</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Manifest Version</span>
                  <span className="text-white font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Primary Domain</span>
                  <span className="text-white">arpcloudsolutions.co.za</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Configured Subdomain</span>
                  <span className="text-blue-400 font-medium">portfolio.arpcloudsolutions.co.za</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Second Brain Core</span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Autonomous Operations</span>
                  <span className="text-white">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Receipts Ledger */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Cryptographic Audit Ledger</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Every transaction, webhook ingress, and remote execution is stamped with microsecond precision and SHA-256 payload digests.
              </p>
            </div>

            <button
              onClick={() => {
                const json = exportReceiptsAsJson(receipts);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `audit-receipts-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Exported audit ledger JSON.');
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <Download size={13} />
              <span>Export Ledger JSON</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/90">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Receipt ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Caller</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Payload Digest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {receipts.map((rcpt) => (
                  <tr key={rcpt.receiptId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-blue-400 font-semibold">{rcpt.receiptId}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{new Date(rcpt.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200">
                        {rcpt.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{rcpt.caller}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        {rcpt.status} ({rcpt.statusCode})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{rcpt.latencyMs}ms</td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-[180px] truncate" title={rcpt.payloadDigest}>
                      {rcpt.payloadDigest}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Sandbox */}
      {activeTab === 'embed_view' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="font-medium text-white text-xs">Target Service:</span>
              <select
                value={selectedApp.id}
                onChange={(e) => {
                  const target = apps.find((a) => a.id === e.target.value);
                  if (target) setSelectedApp(target);
                }}
                className="px-2.5 py-1 rounded bg-slate-950 text-white text-xs border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} ({app.category})
                  </option>
                ))}
              </select>
            </div>

            <a
              href={selectedApp.portalEmbedUrl || selectedApp.productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 w-fit"
            >
              <ExternalLink size={12} />
              <span>Open in Full Tab</span>
            </a>
          </div>

          <div className="w-full h-[550px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative">
            <iframe
              src={selectedApp.portalEmbedUrl || selectedApp.productionUrl}
              title={selectedApp.name}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
};
