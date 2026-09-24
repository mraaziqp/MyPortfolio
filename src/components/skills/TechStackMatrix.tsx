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
  Bot,
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
    { id: 'enterprise', label: 'Enterprise IT & Systems', icon: Server },
    { id: 'ai', label: 'AI & Architecture', icon: Bot },
    { id: 'cloud', label: 'Cloud & Databases', icon: Cloud },
    { id: 'dev', label: 'Languages & Frameworks', icon: Code },
    { id: 'creative', label: 'Interdisciplinary Craft', icon: Coffee },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Technical Proficiency
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Enterprise Infrastructure & Software Stack
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Enterprise virtualization, AWS cloud governance, AI orchestration, full-stack software development, and precision hardware engineering.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {/* 1. Languages & Frameworks */}
        {(activeCategory === 'all' || activeCategory === 'dev') && (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-800 text-indigo-400">
                  <Code size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Languages & Frameworks</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Core Stack
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-3.5 leading-relaxed">
              Full-stack TypeScript, React, Next.js web platforms, Python data scripting, and C# Unity interactive applications.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[...skills.languages, ...skills.frameworks].map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 2. Cloud & Databases */}
        {(activeCategory === 'all' || activeCategory === 'cloud') && (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-800 text-sky-400">
                  <Cloud size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Cloud & Databases</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                AWS Certified
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-3.5 leading-relaxed">
              AWS EC2/S3 cloud services, PostgreSQL, Firebase, Supabase, Docker containers, and robust REST API gateways.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.cloudAndDevOps.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. AI & Architecture */}
        {(activeCategory === 'all' || activeCategory === 'ai') && (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-800 text-purple-400">
                  <Bot size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">AI & Architecture</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                Agentic Systems
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-3.5 leading-relaxed">
              AI Orchestration, LLM integration (Gemini, Ollama), CI/CD pipelines, microservices architecture, and system observability.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(skills.aiAndArchitecture || ['AI Orchestration', 'LLMs (Gemini, Ollama)', 'CI/CD', 'Microservices', 'System Observability']).map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Enterprise IT & Systems */}
        {(activeCategory === 'all' || activeCategory === 'enterprise') && (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-800 text-blue-400">
                  <Server size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Enterprise IT & Systems</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                BCX Track
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-3.5 leading-relaxed">
              VMware ESXi, Hyper-V, Linux, Windows Server, Azure Active Directory / Entra ID, and Microsoft Intune endpoint governance.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.enterpriseAndIT.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Interdisciplinary Craft & Hardware */}
        {(activeCategory === 'all' || activeCategory === 'creative') && (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-slate-800 text-amber-400">
                  <Coffee size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Interdisciplinary Craft & Hardware Diagnostics
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Combining systems engineering with VR simulation mechanics, component-level electronics repair, and precision culinary craft.
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-center">
                Interdisciplinary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                <Gamepad2 size={15} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Interactive Tech & Game Dev</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Developing VR simulations and interaction mechanics in Unity & C#.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                <Wrench size={15} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Hardware & Electronics Restoration</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Component-level troubleshooting and physical computing repairs.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                <Coffee size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Culinary Arts & Science</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Precision coffee extraction methods and artisanal confectionery formulation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certifications & Formal Qualifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* Certifications Card */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <Award size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Industry Certifications & Credentials</h3>
          </div>
          <div className="space-y-2.5">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white">{cert.name}</div>
                  <div className="text-xs text-blue-400 mt-0.5">{cert.issuer}</div>
                  {cert.credentialId && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Credential: {cert.credentialId}
                    </div>
                  )}
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {cert.issueDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Education Card */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <ShieldCheck size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Education & Qualifications</h3>
          </div>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{edu.degree}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{edu.institution}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {edu.year}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
