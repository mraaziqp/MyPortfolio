import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { ProjectShowcase } from './components/projects/ProjectShowcase';
import { ExperienceTimeline } from './components/experience/ExperienceTimeline';
import { TechStackMatrix } from './components/skills/TechStackMatrix';
import { ApiHubInspector } from './components/api-hub/ApiHubInspector';
import { EcosystemDashboardManager } from './components/dashboard/EcosystemDashboardManager';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import {
  getCachedCvData,
  saveCachedCvData,
  getStoredSyncLogs,
  addSyncLog,
  getTelemetryStats,
} from './lib/store';
import { CvSyncPayload, SyncLog } from './types';
import { SHOWCASE_PROJECTS } from './data/initialData';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [cvData, setCvData] = useState<CvSyncPayload>(getCachedCvData);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(getStoredSyncLogs);
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [telemetryStats, setTelemetryStats] = useState(getTelemetryStats);
  const [isPortalMode, setIsPortalMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'true' || params.get('embed') === 'true') {
        setIsPortalMode(true);
        setActiveTab('dashboard-manager');
      }
    }
  }, []);

  // Periodic telemetry refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryStats(getTelemetryStats());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateCvData = (newData: CvSyncPayload) => {
    setCvData(newData);
    saveCachedCvData(newData);
    setSyncSuccessToast(`Profile synchronized (${newData.version}) via Emeron pipeline.`);
    setTimeout(() => setSyncSuccessToast(null), 3500);
  };

  const handleRefreshLogs = () => {
    setSyncLogs(getStoredSyncLogs());
    setTelemetryStats(getTelemetryStats());
  };

  const handleTriggerQuickSync = async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 600));

    const updated: CvSyncPayload = {
      ...cvData,
      version: `v2.${Math.floor(Math.random() * 8) + 3}.1`,
      rawCvMetadata: {
        parserSource: 'Emeron CV Parsing Webhook Sync',
        confidenceScore: 0.994,
        parsedAt: new Date().toISOString(),
        checksum: `sha256:${Math.random().toString(36).substring(2, 12)}`,
      },
    };

    handleUpdateCvData(updated);

    addSyncLog({
      direction: 'INGEST',
      sourceApp: 'Emeron CV Parser',
      endpoint: '/api/sync-cv',
      status: 'SUCCESS',
      recordsProcessed: 16,
      errorMessage: null,
      payloadDigest: updated.rawCvMetadata?.checksum || 'sha256:sync',
    });

    handleRefreshLogs();
    setIsSyncing(false);
  };

  if (isPortalMode) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans p-4 sm:p-6">
        <EcosystemDashboardManager
          cvData={cvData}
          onUpdateCvData={handleUpdateCvData}
          telemetryStats={telemetryStats}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans relative overflow-x-hidden flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Clean, understated executive ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-blue-900/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Sync Toast Notification */}
      {syncSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{syncSuccessToast}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          const el = document.getElementById(tab);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        isSyncing={isSyncing}
        onTriggerQuickSync={handleTriggerQuickSync}
        lastSyncedAgo="Just now"
      />

      {/* Main Content Container with standard responsive padding */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Top Hero Section */}
        <HeroSection
          cvData={cvData}
          onNavigateToTab={(tab) => {
            setActiveTab(tab);
            const el = document.getElementById(tab);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenSyncInspector={() => {
            setActiveTab('architecture');
            const el = document.getElementById('sync-inspector');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Sections */}
        <div className="space-y-16 sm:space-y-24">
          {/* Projects Showcase */}
          <section id="portfolio" className="border-t border-slate-800/60 pt-12 sm:pt-16">
            <ProjectShowcase
              projects={SHOWCASE_PROJECTS}
              onOpenSyncInspector={() => {
                setActiveTab('architecture');
                const el = document.getElementById('sync-inspector');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              telemetryStats={telemetryStats}
            />
          </section>

          {/* Centralized Ecosystem Dashboard Manager */}
          <section id="dashboard-manager" className="border-t border-slate-800/60 pt-12 sm:pt-16">
            <EcosystemDashboardManager
              cvData={cvData}
              onUpdateCvData={handleUpdateCvData}
              telemetryStats={telemetryStats}
              onOpenSyncInspector={() => {
                setActiveTab('architecture');
                const el = document.getElementById('sync-inspector');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </section>

          {/* Dynamic Experience Timeline */}
          <section id="experience" className="border-t border-slate-800/60 pt-12 sm:pt-16">
            <ExperienceTimeline
              experiences={cvData.experiences}
              lastSyncedAt={cvData.rawCvMetadata?.parsedAt}
            />
          </section>

          {/* Live Profile Sync & Data Architecture */}
          <section id="architecture" className="border-t border-slate-800/60 pt-12 sm:pt-16">
            <ApiHubInspector
              cvData={cvData}
              onUpdateCvData={handleUpdateCvData}
              syncLogs={syncLogs}
              onRefreshLogs={handleRefreshLogs}
              telemetryStats={telemetryStats}
            />
          </section>

          {/* Enterprise IT & Infrastructure Matrix */}
          <section id="infrastructure" className="border-t border-slate-800/60 pt-12 sm:pt-16">
            <TechStackMatrix
              skills={cvData.skills}
              certifications={cvData.certifications}
              education={cvData.education}
            />
          </section>

          {/* Contact Section */}
          <section id="contact" className="border-t border-slate-800/60 pt-12 sm:pt-16 pb-12">
            <ContactSection />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenSyncInspector={() => {
          setActiveTab('architecture');
          const el = document.getElementById('sync-inspector');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
