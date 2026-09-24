import React from 'react';
import { ArrowRight, Server, ShieldCheck, Code2, ArrowUpRight, CheckCircle2, Globe2, Download } from 'lucide-react';
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
    <section className="pt-6 sm:pt-10 pb-8 sm:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Executive Summary & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Professional Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium">
                <Globe2 size={13} className="text-slate-400" />
                {cvData.location}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium">
                Enterprise IT & Full-Stack Solutions
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Available for Roles
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.2]">
              Delivering Resilient Enterprise Infrastructure & Modern Software Architecture.
            </h1>

            {/* Subtitle / Bio */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              {cvData.summary}
            </p>
          </div>

          {/* Three Core Competencies - Balanced Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-slate-200 mb-1.5">
                <Server size={15} className="text-blue-400 shrink-0" />
                <span className="text-xs font-semibold">Enterprise IT Ops</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                99.98% VM uptime across VMware ESXi, Hyper-V & Active Directory governance at BCX.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-slate-200 mb-1.5">
                <Code2 size={15} className="text-blue-400 shrink-0" />
                <span className="text-xs font-semibold">Full-Stack Systems</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Scalable Next.js, TypeScript, PostgreSQL platforms with automated validation pipelines.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-slate-200 mb-1.5">
                <ShieldCheck size={15} className="text-blue-400 shrink-0" />
                <span className="text-xs font-semibold">Cloud Reliability</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                AWS Certified Cloud Practitioner architecting secure, redundant cloud workloads.
              </p>
            </div>
          </div>

          {/* Action CTAs - Responsive wrapping & consistent sizing */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToTab('contact')}
              className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm rounded-md shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Initiate Conversation</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => onNavigateToTab('experience')}
              className="px-4 sm:px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm rounded-md transition-colors cursor-pointer"
            >
              <span>View Track Record</span>
            </button>

            <a
              href="/Mohammed_Parker_CV.pdf"
              download="Mohammed_Parker_CV.pdf"
              className="px-3.5 sm:px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} className="text-blue-400" />
              <span>Download CV</span>
            </a>

            <button
              onClick={onOpenSyncInspector}
              className="px-3.5 sm:px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>System Architecture</span>
              <ArrowUpRight size={13} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Executive Dossier & Verified Systems Metrics */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="h-full rounded-xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div>
                <h3 className="text-sm font-semibold text-white">Professional Profile Snapshot</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified Operational Metrics & Qualifications</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                <CheckCircle2 size={12} />
                Verified
              </span>
            </div>

            {/* 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Enterprise Virtualization</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">99.98%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SLA Uptime at BCX</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Cloud Certification</div>
                <div className="text-lg sm:text-xl font-bold text-white mt-1">AWS CCP</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Valid Thru 2026</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">VM Fleet Managed</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">150+ Nodes</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ESXi & Hyper-V Clusters</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Data Synchronization</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-400 mt-1">&lt;140ms</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Real-time Webhook Ingress</div>
              </div>
            </div>

            {/* Profile sync information banner */}
            <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800/90 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px]">
                  <strong className="text-white font-medium">Data Origin:</strong> Emeron CV Pipeline
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">{cvData.version}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
