/**
 * Positioning copy for the site. Every claim here must trace back to the CV
 * (public/Mohammed_Parker_CV.pdf) — this page is read by recruiters.
 */

export const ROLES = ['Systems Administrator', 'Full-Stack Developer', 'Cloud Practitioner', 'XR Developer'];

export const BUSINESS = {
  name: 'ARP Cloud Solutions',
  url: 'https://arpcloudsolutions.co.za',
  pitch: 'Need something built rather than a hire? I take on web platforms and IT projects through my company.',
};

export interface Service {
  id: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'infrastructure',
    title: 'Enterprise infrastructure',
    summary: 'Keeping Microsoft and virtualised estates healthy, documented and inside SLA.',
    points: [
      'VMware and Hyper-V server & VM lifecycle, through to decommissioning',
      'Active Directory and Entra ID identity, RBAC and policy',
      'Incident-queue triage and QA sign-off before changes go live',
    ],
    stack: ['VMware', 'Hyper-V', 'Active Directory', 'Windows Server', 'Intune'],
  },
  {
    id: 'product',
    title: 'Full-stack product builds',
    summary: 'From schema to deployment: multi-tenant SaaS, portals and dashboards.',
    points: [
      'Multi-tenant data isolation and role-based portals',
      'Admin control centres, booking and verification pipelines',
      'Analytics dashboards and REST APIs',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Node.js'],
  },
  {
    id: 'cloud',
    title: 'Cloud & automation',
    summary: 'AWS-certified foundations, CI/CD and AI-assisted tooling.',
    points: [
      'AWS (EC2, S3), Firebase, Supabase and Docker deployments',
      'CI/CD pipelines and system observability',
      'LLM orchestration with Gemini and Ollama',
    ],
    stack: ['AWS', 'Docker', 'CI/CD', 'Firebase', 'LLMs'],
  },
  {
    id: 'xr',
    title: 'XR & interactive',
    summary: 'Immersive Unity applications with purposeful interaction design.',
    points: [
      'VR exposure-therapy application in Unity and C#',
      'Spatial interaction mechanics and dynamic environments',
      'Real-time behavioural feedback loops',
    ],
    stack: ['Unity', 'C#', 'VR', '3D interaction'],
  },
];

/** Cover art palette per project category (gradient stops). */
export const COVERS: Record<string, [string, string]> = {
  'Enterprise SaaS': ['#0f766e', '#115e59'],
  Productivity: ['#4338ca', '#312e81'],
  'B2B Platforms': ['#0369a1', '#0c4a6e'],
  FinTech: ['#15803d', '#14532d'],
  'XR & Simulation': ['#9333ea', '#581c87'],
};
