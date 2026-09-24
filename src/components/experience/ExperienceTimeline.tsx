import React from 'react';
import { Calendar, MapPin, CheckCircle2, Server } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
  lastSyncedAt?: string;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Career Track Record
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Professional Experience & System Governance
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Enterprise infrastructure reliability, high-density server virtualization, and full-stack software delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 self-start sm:self-end">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Emeron Synchronized</span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-5 sm:pl-7 border-l border-slate-800 space-y-6 sm:space-y-8">
        {experiences.map((exp, idx) => {
          return (
            <div key={exp.id || idx} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[25px] sm:-left-[33px] top-2 flex items-center justify-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    exp.isCurrent
                      ? 'bg-blue-500 ring-4 ring-slate-900'
                      : 'bg-slate-600 ring-4 ring-slate-900'
                  }`}
                ></div>
              </div>

              {/* Experience Card */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors p-5 sm:p-7 shadow-sm">
                {/* Header Information */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {exp.role}
                      </h3>
                      {exp.isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/70">
                          Active Position
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="text-slate-200 font-medium">{exp.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-500" />
                        {exp.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar size={12} className="text-slate-500" />
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                  </div>

                  {exp.enterpriseDomain && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs self-start lg:self-center">
                      <Server size={12} className="text-blue-400" />
                      <span>{exp.enterpriseDomain}</span>
                    </div>
                  )}
                </div>

                {/* Summary narrative */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {exp.summary}
                </p>

                {/* Key Achievements Bullet Points */}
                {exp.keyAchievements && exp.keyAchievements.length > 0 && (
                  <div className="space-y-2 mb-5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Key Outcomes & Responsibilities:
                    </div>
                    <ul className="space-y-1.5">
                      {exp.keyAchievements.map((achieve, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 size={14} className="text-blue-400 mt-0.5 shrink-0" />
                          <span>{achieve}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies used in this role */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 mr-1.5 font-medium text-[11px]">
                    Technologies:
                  </span>
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/70"
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
    </div>
  );
};
