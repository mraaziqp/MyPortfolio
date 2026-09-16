import React, { useState } from 'react';
import {
  Code,
  Layers,
  Cloud,
  Server,
  Coffee,
  Award,
  Gamepad2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SkillCategoryMap, CertificationItem, EducationItem } from '../../types';

interface TechStackMatrixProps {
  skills: SkillCategoryMap;
  certifications: CertificationItem[];
  education: EducationItem[];
}

export const TechStackMatrix: React.FC<TechStackMatrixProps> = ({
  skills,
  certifications,
  education,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Disciplines', icon: Layers },
    { id: 'enterprise', label: 'Enterprise Systems & BCX', icon: Server },
    { id: 'cloud', label: 'AWS Cloud & Reliability', icon: Cloud },
    { id: 'dev', label: 'Full-Stack Software', icon: Code },
    { id: 'creative', label: 'Interdisciplinary Craft', icon: Coffee },
  ];

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Technical Proficiency
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
            Enterprise Infrastructure & Software Stack
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            A comprehensive matrix covering enterprise server virtualization, AWS cloud governance, modern web engineering, and precision craft.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-blue-400 font-semibold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* 1. Enterprise IT & Active Directory (BCX Focus) */}
        {(activeCategory === 'all' || activeCategory === 'enterprise') && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                  <Server size={18} />
                </div>
                <h3 className="text-base font-semibold text-white">Enterprise IT & Systems</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                BCX Track
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Virtualization fleets (ESXi, Hyper-V), domain controller security, and Active Directory RBAC policies.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.enterpriseAndIT.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 2. Cloud Architecture & DevOps (AWS Certified) */}
        {(activeCategory === 'all' || activeCategory === 'cloud') && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400">
                  <Cloud size={18} />
                </div>
                <h3 className="text-base font-semibold text-white">Cloud & Reliability</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                AWS Certified
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Cloud workloads, containerized infrastructure, automated snapshot protection, and least-privilege IAM.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.cloudAndDevOps.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Full-Stack & Frameworks */}
        {(activeCategory === 'all' || activeCategory === 'dev') && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                  <Code size={18} />
                </div>
                <h3 className="text-base font-semibold text-white">Software & Application Stack</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Next.js / TS
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              React Server Components, type-safe TypeScript architectures, PostgreSQL with Drizzle ORM, and RESTful APIs.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[...skills.languages, ...skills.frameworks].map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Creative Engineering & Hardware (Unique Interdisciplinary Craft) */}
        {(activeCategory === 'all' || activeCategory === 'creative') && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                  <Coffee size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Interdisciplinary Craft & Hardware Diagnostics
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Combining analytical systems rigor with physics simulations, electronics diagnostics, and artisanal craftsmanship.
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 self-start sm:self-center">
                Interdisciplinary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <Gamepad2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Unity / C# Game Engine</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Interactive physics simulation, 3D systems, and game mechanics.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <Coffee size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Artisanal Coffee Profiling</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Precision extraction science, flow profiling, and origin calibration.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <Sparkles size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Chocolate Confectionery</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Bean-to-bar tempering chemistry, crystal structures & formulation.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <Wrench size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Hardware & SMD Electronics</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Micro-soldering, PCB diagnostics, and enterprise server repair.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certifications & Formal Qualifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Certifications Card */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <Award size={18} className="text-blue-400" />
            <h3 className="text-base font-semibold text-white">Industry Certifications & Credentials</h3>
          </div>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{cert.name}</div>
                  <div className="text-xs text-blue-400 mt-0.5">{cert.issuer}</div>
                  {cert.credentialId && (
                    <div className="text-xs text-slate-400 mt-1">
                      Credential ID: {cert.credentialId}
                    </div>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {cert.issueDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Education Card */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Education & Systems Foundation</h3>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{edu.degree}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{edu.institution}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {edu.year}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
