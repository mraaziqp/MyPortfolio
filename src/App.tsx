import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { ProjectShowcase } from './components/projects/ProjectShowcase';
import { ExperienceTimeline } from './components/experience/ExperienceTimeline';
import { TechStackMatrix } from './components/skills/TechStackMatrix';
import { ApiHubInspector } from './components/api-hub/ApiHubInspector';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import {
  getCachedCvData,
  saveCachedCvData,
  getStoredSyncLogs,
  addSyncLog,
  getTelemetryStats,
  recordProjectInteraction,
} from './lib/store';
import { CvSyncPayload, SyncLog } from './types';
import { SHOWCASE_PROJECTS } from './data/initialData';
import { RefreshCw, CheckCircle2, Terminal, Sparkles, Activity } from 'lucide-react';

export default function App() {
  const [cvData, setCvData] = useState<CvSyncPayload>(getCachedCvData);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(getStoredSyncLogs);
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [telemetryStats, setTelemetryStats] = useState(getTelemetryStats);

  // Periodic telemetry refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryStats(getTelemetryStats());
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateCvData = (newData: CvSyncPayload) => {
    setCvData(newData);
    saveCachedCvData(newData);
    setSyncSuccessToast(`Synchronized ${newData.fullName}'s CV cache (${newData.version}) via Emeron webhook!`);
    setTimeout(() => setSyncSuccessToast(null), 4000);
  };

  const handleRefreshLogs = () => {
    setSyncLogs(getStoredSyncLogs());
    setTelemetryStats(getTelemetryStats());
  };

  const handleTriggerQuickSync = async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 700));

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

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 font-sans relative overflow-x-hidden flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Subtle, understated enterprise backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
      </div>

      {/* Sync Toast Notification */}
      {syncSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-sm shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <CheckCircle2 size={18} className="text-blue-400" />
          <span>{syncSuccessToast}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSyncing={isSyncing}
        onTriggerQuickSync={handleTriggerQuickSync}
        lastSyncedAgo="Just now"
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-8 space-y-12">
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

        {/* Tab-driven / full-view sections */}
        <div className="space-y-20">
          {/* Projects Showcase */}
          <div id="portfolio">
            <ProjectShowcase
              projects={SHOWCASE_PROJECTS}
              onOpenSyncInspector={() => {
                setActiveTab('architecture');
                const el = document.getElementById('sync-inspector');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              telemetryStats={telemetryStats}
            />
          </div>

          {/* Dynamic Experience Timeline */}
          <div id="experience">
            <ExperienceTimeline
              experiences={cvData.experiences}
              lastSyncedAt={cvData.rawCvMetadata?.parsedAt}
            />
          </div>

          {/* Live Profile Sync & Data Architecture (Emeron Integration) */}
          <div id="architecture">
            <ApiHubInspector
              cvData={cvData}
              onUpdateCvData={handleUpdateCvData}
              syncLogs={syncLogs}
              onRefreshLogs={handleRefreshLogs}
              telemetryStats={telemetryStats}
            />
          </div>

          {/* Enterprise IT & Infrastructure Matrix */}
          <div id="infrastructure">
            <TechStackMatrix
              skills={cvData.skills}
              certifications={cvData.certifications}
              education={cvData.education}
            />
          </div>

          {/* Contact Section */}
          <div id="contact">
            <ContactSection />
          </div>
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
