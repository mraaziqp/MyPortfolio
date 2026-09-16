import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ShieldCheck, Server } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
  lastSyncedAt?: string;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
  lastSyncedAt,
}) => {
  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Career Track Record
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
            Professional Experience & System Governance
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            A proven history of enterprise infrastructure reliability, virtualization orchestration, and full-stack software delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Synchronized via Emeron Database Feed</span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-8 border-l border-slate-800 space-y-8">
        {experiences.map((exp, idx) => {
          return (
            <div key={exp.id || idx} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                    exp.isCurrent
                      ? 'bg-blue-600 border-[#0b0f17] ring-4 ring-blue-900/40'
                      : 'bg-slate-700 border-[#0b0f17] group-hover:bg-slate-500'
                  }`}
                ></div>
              </div>

              {/* Experience Card */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors p-6 sm:p-7 shadow-sm">
                {/* Header Information */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          Active Position
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="text-slate-200 font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-slate-400" />
                        {exp.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar size={13} className="text-slate-400" />
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                  </div>

                  {exp.enterpriseDomain && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-xs self-start lg:self-center">
                      <Server size={13} className="text-blue-400" />
                      <span>{exp.enterpriseDomain}</span>
                    </div>
                  )}
                </div>

                {/* Summary narrative */}
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  {exp.summary}
                </p>

                {/* Key Achievements Bullet Points */}
                {exp.keyAchievements && exp.keyAchievements.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Key Outcomes & Business Deliverables:
                    </div>
                    <ul className="space-y-2">
                      {exp.keyAchievements.map((achieve, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 size={15} className="text-blue-400 mt-0.5 shrink-0" />
                          <span>{achieve}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies used in this role */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-2 font-medium">
                    Core Technologies:
                  </span>
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
