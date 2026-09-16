import React from 'react';
import { ArrowRight, Server, ShieldCheck, Database, Code2, CheckCircle2, ArrowUpRight, Layers } from 'lucide-react';
import { CvSyncPayload } from '../../types';

interface HeroSectionProps {
  cvData: CvSyncPayload;
  onNavigateToTab: (tab: string) => void;
  onOpenSyncInspector: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cvData,
  onNavigateToTab,
  onOpenSyncInspector,
}) => {
  return (
    <section className="relative pt-4 pb-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Executive Bio & Value Proposition */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Location & Status Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {cvData.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-medium">
              Enterprise IT & Full-Stack Solutions
            </span>
          </div>

          {/* Primary Statement */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight">
              Delivering Resilient Enterprise Infrastructure & Modern Software Architecture.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              {cvData.summary}
            </p>
          </div>

          {/* Three Core Competency Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 text-blue-400 mb-2">
                <Server size={18} />
                <span className="text-sm font-semibold text-white">Enterprise IT Ops</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                99.98% VM uptime across VMware ESXi, Hyper-V & Active Directory governance at BCX.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 text-indigo-400 mb-2">
                <Code2 size={18} />
                <span className="text-sm font-semibold text-white">Full-Stack Systems</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scalable Next.js, TypeScript, PostgreSQL platforms with automated validation pipelines.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 text-sky-400 mb-2">
                <ShieldCheck size={18} />
                <span className="text-sm font-semibold text-white">Cloud Reliability</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                AWS Certified Cloud Practitioner architecting secure, redundant cloud migrations.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigateToTab('contact')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Initiate Conversation</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onNavigateToTab('experience')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <span>View Professional Track Record</span>
            </button>

            <button
              onClick={onOpenSyncInspector}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Inspect Live Data Sync</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Executive Overview & Verification Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-xl p-6 bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white">Professional Profile Snapshot</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified Experience & Systems Metrics</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                Verified
              </span>
            </div>

            {/* Structured Executive Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400">Enterprise Virtualization</div>
                <div className="text-xl font-bold text-white mt-1">99.98%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">SLA Uptime at BCX</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400">Cloud Certification</div>
                <div className="text-base font-semibold text-white mt-1">AWS CCP</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Valid Thru 2026</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400">VM Fleet Managed</div>
                <div className="text-xl font-bold text-white mt-1">150+ Nodes</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ESXi & Hyper-V</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400">Data Synchronization</div>
                <div className="text-xl font-bold text-blue-400 mt-1">&lt;140ms</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Real-time Webhook</div>
              </div>
            </div>

            {/* Profile sync information banner */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div>
                  <span className="font-medium text-slate-200">Data Origin:</span> Emeron CV Intelligence
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{cvData.version}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
