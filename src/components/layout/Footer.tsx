import React from 'react';
import { Terminal } from 'lucide-react';

interface FooterProps {
  onOpenSyncInspector: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSyncInspector }) => {
  return (
    <footer className="relative z-10 border-t border-slate-800 bg-slate-950 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Professional Pursuits */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400">
          <span className="text-slate-300 font-medium">Interests & Pursuits:</span>
          <span>Game Development (Unity/C#)</span>
          <span className="text-slate-600">•</span>
          <span>Artisanal Coffee</span>
          <span className="text-slate-600">•</span>
          <span>Chocolate Making</span>
          <span className="text-slate-600">•</span>
          <span>Electronics & Hardware Repair</span>
        </div>

        {/* Right: Social & Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <button
            onClick={onOpenSyncInspector}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium"
          >
            <Terminal size={13} className="text-blue-400" />
            <span>Profile Sync Console</span>
          </button>

          <a
            href="https://linkedin.com/in/mohammedparker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/mohammedparker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>

          <span className="text-slate-400">
            © {new Date().getFullYear()} Mohammed Parker
          </span>
        </div>
      </div>
    </footer>
  );
};
