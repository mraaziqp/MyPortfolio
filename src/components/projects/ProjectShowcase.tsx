import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, BarChart3, Database } from 'lucide-react';
import { ProjectShowcaseItem } from '../../types';
import { recordProjectInteraction } from '../../lib/store';

interface ProjectShowcaseProps {
  projects: ProjectShowcaseItem[];
  onOpenSyncInspector: () => void;
  telemetryStats: {
    views: Record<string, number>;
    interactions: Record<string, number>;
  };
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  onOpenSyncInspector,
  telemetryStats,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedFilter);

  const handleInteract = (slug: string, type: 'demo_click' | 'repo_click' | 'tech_badge_click') => {
    recordProjectInteraction(slug, type);
  };

  const handleCopyEndpoint = (slug: string) => {
    const endpoint = `https://mraaziqp.vercel.app/api/sync-cv`;
    navigator.clipboard.writeText(endpoint);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Featured Solutions
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Production Systems & Business Platforms
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Engineered to eliminate operational bottlenecks, automate unstructured data workflows, and deliver resilient software architectures.
          </p>
        </div>

        {/* Category Filters with smooth horizontal scroll on small devices */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {filteredProjects.map((project) => {
          const isEmeron = project.slug === 'emeron';
          const colSpan = isEmeron ? 'lg:col-span-12' : 'lg:col-span-6';
          const views = telemetryStats.views[project.slug] || 180;
          const interactions = telemetryStats.interactions[project.slug] || 45;

          return (
            <div
              key={project.id}
              className={`${colSpan} rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors p-5 sm:p-7 flex flex-col justify-between shadow-sm`}
            >
              <div>
                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {project.category}
                    </span>
                    {project.syncSource && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-800/70 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Live Data Connected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BarChart3 size={12} className="text-slate-500" />
                      {views} views
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{interactions} interactions</span>
                  </div>
                </div>

                {/* Title & Role */}
                <div className="mb-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {project.role}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium mt-0.5">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Impact Metrics - Responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-5 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  {project.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="text-left">
                      <div className="text-[11px] text-slate-400 font-normal">
                        {metric.label}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      onClick={() => handleInteract(project.slug, 'tech_badge_click')}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  {isEmeron ? (
                    <button
                      onClick={() => {
                        handleInteract(project.slug, 'demo_click');
                        onOpenSyncInspector();
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Explore Live Sync</span>
                      <ArrowUpRight size={13} />
                    </button>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleInteract(project.slug, 'demo_click')}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 font-medium rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Launch Solution</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleInteract(project.slug, 'repo_click')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <Github size={13} />
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>

                {isEmeron && (
                  <button
                    onClick={() => handleCopyEndpoint(project.slug)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedSlug === project.slug ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied Webhook</span>
                      </>
                    ) : (
                      <>
                        <Database size={13} className="text-blue-400" />
                        <span>Copy Webhook URL</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
