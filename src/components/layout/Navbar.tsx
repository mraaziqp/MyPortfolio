import React, { useState } from 'react';
import { RefreshCw, Menu, X, ArrowUpRight } from 'lucide-react';

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'portfolio', label: 'Solutions' },
    { id: 'experience', label: 'Experience' },
    { id: 'dashboard-manager', label: 'Fleet Hub' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/80 flex items-center justify-center font-semibold text-slate-100 text-xs tracking-tight shadow-sm shrink-0">
            MP
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white truncate">
                Mohammed Parker
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                AWS CCP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal truncate hidden sm:block">
              Software Engineer & Systems Administrator
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/70 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Sync Status Pill */}
          <button
            onClick={onTriggerQuickSync}
            disabled={isSyncing}
            title="Synchronize profile state with Emeron live feed"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="font-medium text-[11px] sm:text-xs">
              {isSyncing ? 'Syncing...' : 'Live Synced'}
            </span>
            <RefreshCw
              size={12}
              className={`text-slate-400 ${isSyncing ? 'animate-spin text-blue-400' : ''}`}
            />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#090d16]/98 backdrop-blur-lg px-4 pt-3 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'text-white bg-slate-800 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
