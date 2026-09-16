import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSyncing: boolean;
  onTriggerQuickSync: () => void;
  lastSyncedAgo: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSyncing,
  onTriggerQuickSync,
  lastSyncedAgo,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f17]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-3.5">
        {/* Executive Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-100 text-sm tracking-normal shadow-sm">
            MP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white leading-none">
                Mohammed Parker
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-blue-400 border border-slate-700">
                AWS CCP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Senior Full-Stack Developer & Enterprise IT Specialist
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`transition-colors py-1 ${
              activeTab === 'portfolio'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Featured Solutions
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`transition-colors py-1 ${
              activeTab === 'experience'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors py-1 ${
              activeTab === 'architecture'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Sync & Architecture
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`transition-colors py-1 ${
              activeTab === 'infrastructure'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enterprise Infrastructure
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors py-1 ${
              activeTab === 'contact'
                ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Live sync status badge & trigger button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerQuickSync}
            disabled={isSyncing}
            title="Synchronize profile state with Emeron live feed"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-600 transition-all text-xs group"
          >
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${
                  isSyncing ? 'opacity-100' : 'opacity-60'
                }`}
              ></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300 hidden sm:inline">
              {isSyncing ? 'Syncing...' : 'Live Synced via Emeron'}
            </span>
            <RefreshCw
              size={13}
              className={`text-slate-400 group-hover:text-slate-200 transition-transform ${
                isSyncing ? 'animate-spin text-blue-400' : 'group-hover:rotate-180'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800 px-2 py-2 bg-slate-900 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-2 py-1 rounded ${activeTab === 'portfolio' ? 'text-blue-400 font-semibold bg-slate-800' : ''}`}
        >
          Solutions
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-2 py-1 rounded ${activeTab === 'experience' ? 'text-blue-400 font-semibold bg-slate-800' : ''}`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-2 py-1 rounded ${activeTab === 'architecture' ? 'text-blue-400 font-semibold bg-slate-800' : ''}`}
        >
          Live Sync
        </button>
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-2 py-1 rounded ${activeTab === 'infrastructure' ? 'text-blue-400 font-semibold bg-slate-800' : ''}`}
        >
          IT Ops
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-2 py-1 rounded ${activeTab === 'contact' ? 'text-blue-400 font-semibold bg-slate-800' : ''}`}
        >
          Contact
        </button>
      </div>
    </header>
  );
};
