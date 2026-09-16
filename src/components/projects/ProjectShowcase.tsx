import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, Server, BarChart3, Layers, Database } from 'lucide-react';
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

  const categories = ['ALL', 'Enterprise Intelligence', 'Productivity Systems', 'Enterprise SaaS'];

  const filteredProjects = selectedFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedFilter);

  const handleInteract = (slug: string, type: 'demo_click' | 'repo_click' | 'tech_badge_click') => {
    recordProjectInteraction(slug, type);
  };

  const handleCopyEndpoint = (slug: string) => {
    const endpoint = `https://mohammedparker.dev/api/sync-cv`;
    navigator.clipboard.writeText(endpoint);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Featured Solutions
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
            Production Systems & Business Platforms
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Software engineered to solve corporate bottlenecks, automate unstructured data workflows, and deliver measurable operational impact.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedFilter === cat
                  ? 'bg-slate-800 text-blue-400 font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {filteredProjects.map((project) => {
          const isEmeron = project.slug === 'emeron';
          const colSpan = isEmeron ? 'lg:col-span-12' : 'lg:col-span-6';
          const views = telemetryStats.views[project.slug] || 180;
          const interactions = telemetryStats.interactions[project.slug] || 45;

          return (
            <div
              key={project.id}
              className={`${colSpan} group relative rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm`}
            >
              <div>
                {/* Card Top Metadata & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {project.category}
                    </span>
                    {project.syncSource && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Live Data Connected
                      </span>
                    )}
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BarChart3 size={13} className="text-slate-400" />
                      {views} views
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{interactions} engagements</span>
                  </div>
                </div>

                {/* Project Title & Tagline */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {project.role}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm font-medium mt-1">
                    {project.tagline}
                  </p>
                </div>

                {/* Business Value & Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Project Impact Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  {project.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="text-left">
                      <div className="text-xs text-slate-400 font-normal">
                        {metric.label}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-white mt-0.5">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technology Enablers */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      onClick={() => handleInteract(project.slug, 'tech_badge_click')}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-600 hover:text-slate-100 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {isEmeron ? (
                    <button
                      onClick={() => {
                        handleInteract(project.slug, 'demo_click');
                        onOpenSyncInspector();
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>Explore Live Sync Architecture</span>
                      <ArrowUpRight size={13} />
                    </button>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleInteract(project.slug, 'demo_click')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
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
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Github size={13} />
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>

                {isEmeron && (
                  <button
                    onClick={() => handleCopyEndpoint(project.slug)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedSlug === project.slug ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Endpoint Copied to Clipboard</span>
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
    </section>
  );
};
