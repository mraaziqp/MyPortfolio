import { CvSyncPayload, ProjectShowcaseItem } from '../types';

export const INITIAL_CV_DATA: CvSyncPayload = {
  version: 'v3.0.0',
  fullName: 'Mohammed Parker',
  headline: 'Software Engineer & Systems Administrator',
  summary:
    'Software Engineer and Systems Administrator with strong expertise in full-stack application development, cloud computing (AWS Certified), and enterprise infrastructure management. Proven track record of architecting scalable multi-tenant SaaS platforms, interactive VR applications, and AI-orchestrated tools. Combines hands-on systems reliability, VMware virtualization, and Azure/Active Directory administration with modern web development methodologies to deliver secure, high-availability software solutions.',
  location: 'Cape Town, South Africa 7500',
  email: 'mraaziqp@gmail.com',
  phone: '+27 83 786 4913',
  githubUrl: 'https://github.com/mraaziqp',
  linkedinUrl: 'https://linkedin.com/in/mohammedparker',
  websiteUrl: 'https://mraaziqp.vercel.app',
  experiences: [
    {
      id: 'exp-bcx',
      role: 'IT Admin',
      company: 'BCX',
      location: 'Cape Town, South Africa',
      startDate: '10/2024',
      endDate: null,
      isCurrent: true,
      summary:
        'Managing and coordinating server, virtual machine (VMware/Hyper-V), and Active Directory engineering workflows, consistently meeting strict enterprise Service Level Agreements (SLAs).',
      keyAchievements: [
        'Manage and coordinate server, virtual machine (VMware/Hyper-V), and Active Directory engineering workflows, consistently meeting strict enterprise Service Level Agreements (SLAs).',
        'Direct the Microsoft team’s request and incident queues; triage complex technical escalations, prioritize workload distribution, and exercise autonomous decision-making for task resolution.',
        'Provision, configure, and maintain physical and virtual enterprise server infrastructure, establishing remote diagnostics and system observability.',
        'Oversee end-to-end server lifecycle management, including decommissioning protocols, compliance documentation, and audit readiness.',
        'Serve as the final technical gatekeeper and QA sign-off authority prior to deploying infrastructure changes and client-facing solutions.'
      ],
      technologies: ['VMware ESXi', 'Microsoft Hyper-V', 'Active Directory', 'Windows Server', 'System Observability', 'SLA Management', 'Microsoft Infrastructure'],
      enterpriseDomain: 'Enterprise Virtualization & Directory Services'
    },
    {
      id: 'exp-reddington',
      role: 'IT Technician',
      company: 'Reddington – Ensure IT Services',
      location: 'Cape Town, South Africa',
      startDate: '07/2023',
      endDate: '10/2024',
      isCurrent: false,
      summary:
        'Performed root-cause analysis, hardware diagnostics, and component-level repairs for enterprise laptops, workstations, and printers across enterprise client fleets.',
      keyAchievements: [
        'Performed root-cause analysis, hardware diagnostics, and component-level repairs for enterprise laptops, workstations, and printers.',
        'Managed parts procurement, warranty tracking, and inventory logistics through Microsoft Dynamics.',
        'Resolved complex networking, operating system, and hardware configuration escalations.'
      ],
      technologies: ['Hardware Diagnostics', 'Component-Level Repair', 'Microsoft Dynamics', 'Enterprise Networking', 'OS Troubleshooting', 'Logistics Management'],
      enterpriseDomain: 'Hardware Diagnostics & Systems Reliability'
    },
    {
      id: 'exp-fpg',
      role: 'IT Technical Support Intern',
      company: 'FPG Group',
      location: 'Plattekloof, South Africa',
      startDate: '05/2023',
      endDate: '09/2023',
      isCurrent: false,
      summary:
        'Administered user identities, access control (RBAC), and security policies in Azure Active Directory (Entra ID) with centralized endpoint deployment.',
      keyAchievements: [
        'Administered user identities, access control (RBAC), and security policies in Azure Active Directory (Entra ID).',
        'Deployed operating system images and configured enterprise software across distributed company workstations using Microsoft Endpoint.',
        'Participated in cross-functional technical meetings to troubleshoot systemic errors and support IT modernization initiatives.'
      ],
      technologies: ['Azure Active Directory / Entra ID', 'RBAC Policies', 'Microsoft Endpoint', 'OS Imaging', 'Security Policies', 'IT Modernization'],
      enterpriseDomain: 'Azure Identity & Endpoint Management'
    },
    {
      id: 'exp-construct',
      role: 'L1 Technical Support Engineer',
      company: 'Construct Education',
      location: 'Cape Town, South Africa',
      startDate: '05/2023',
      endDate: '08/2023',
      isCurrent: false,
      summary:
        'Delivered remote technical support across 54 KFC branch locations and educational portals, troubleshooting Canvas LMS and mobile app issues.',
      keyAchievements: [
        'Delivered remote technical support across 54 KFC branch locations and educational portals, troubleshooting Canvas LMS and mobile app issues.',
        'Authored accessible technical guides and standard operating procedures (SOPs) to streamline troubleshooting for non-technical users.'
      ],
      technologies: ['Remote Support', 'Canvas LMS', 'Mobile Applications', 'Technical Writing', 'SOP Authoring', 'Distributed Branch Support'],
      enterpriseDomain: 'Distributed Branch Support & Educational Platforms'
    }
  ],
  skills: {
    languages: ['TypeScript', 'Python', 'C#', 'SQL', 'Bash / Shell', 'PowerShell'],
    frameworks: ['Next.js', 'React', 'Node.js', 'Tailwind CSS', 'Unity (XR)', 'Express'],
    cloudAndDevOps: ['AWS (EC2, S3)', 'PostgreSQL', 'Firebase', 'Supabase', 'Docker', 'REST APIs'],
    aiAndArchitecture: ['AI Orchestration', 'LLMs (Gemini, Ollama)', 'CI/CD', 'Microservices', 'System Observability'],
    enterpriseAndIT: ['VMware', 'Hyper-V', 'Linux', 'Windows Server', 'Azure AD / Entra ID', 'Microsoft Intune'],
    hardwareAndCreative: ['Unity & C# XR Simulation', 'Hardware & Electronics Restoration', 'Precision Coffee Extraction', 'Artisanal Confectionery']
  },
  certifications: [
    {
      id: 'cert-aws',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: 'Valid Thru 2026',
      badgeUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
    },
    {
      id: 'cert-lenovo',
      name: 'Lenovo Certified Technician',
      issuer: 'Lenovo',
      issueDate: '2023 – 2031'
    },
    {
      id: 'cert-dell',
      name: 'DELL Certified Technician',
      issuer: 'DELL Technologies',
      issueDate: '2023 – 2031'
    }
  ],
  education: [
    {
      id: 'edu-adv-dip',
      degree: 'Advanced Diploma in ICT: Applications Development',
      institution: 'Cape Peninsula University of Technology (CPUT) — Cape Town',
      year: 'Graduated 04/2025',
      details: 'Focus: Full-stack application development, software design patterns, advanced SQL, systems analysis, and Agile methodologies.'
    },
    {
      id: 'edu-nat-dip',
      degree: 'National Diploma in ICT: Applications Development',
      institution: 'Cape Peninsula University of Technology (CPUT) — Cape Town',
      year: '01/2023',
      details: 'Comprehensive software engineering, database design, algorithms, and distributed computing.'
    },
    {
      id: 'edu-higher-cert',
      degree: 'Higher Certificate in ICT',
      institution: 'Cape Peninsula University of Technology (CPUT) — Cape Town',
      year: '01/2020',
      details: 'Information and Communication Technology foundational principles, programming fundamentals, and computer hardware.'
    },
    {
      id: 'edu-matric',
      degree: 'National Senior Certificate / High School Diploma',
      institution: 'Fairbairn College — Cape Town',
      year: '01/2019',
      details: 'National Senior Certificate matriculation.'
    }
  ],
  rawCvMetadata: {
    parserSource: 'Official Mohammed Parker Verified Resume',
    confidenceScore: 1.0,
    parsedAt: new Date().toISOString(),
    checksum: 'sha256:mohammed_parker_cv_verified_2026'
  }
};

export const SHOWCASE_PROJECTS: ProjectShowcaseItem[] = [
  {
    id: 'proj-lifestack',
    slug: 'lifestack',
    title: 'LifeStack',
    tagline: 'AI-Powered Project Management & Personal Assistant Web Application',
    description:
      'Engineered an AI-powered project management and personal assistant web application using Next.js, React, and TypeScript. Integrated intelligent schedule optimization, automated activity tracking, and RESTful API endpoints for personalized productivity workflows.',
    role: 'Full-Stack Engineer',
    category: 'Productivity Systems',
    featured: true,
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'AI Scheduling'],
    metrics: [
      { label: 'Schedule Engine', value: 'Automated' },
      { label: 'Stack Architecture', value: 'Next.js & React' },
      { label: 'API Protocols', value: 'RESTful Endpoints' }
    ],
    liveUrl: 'https://lifestack.co.za',
    githubUrl: 'https://github.com/mraaziqp/lifestack-ai'
  },
  {
    id: 'proj-vr-phobia',
    slug: 'vr-phobia',
    title: 'VR Phobia Therapy',
    tagline: 'Immersive Virtual Reality Exposure Therapy Application',
    description:
      'Developing an immersive Virtual Reality application in Unity Engine and C# designed for controlled exposure therapy to assist individuals with phobias. Designed spatial interaction mechanics, dynamic VR environments, and real-time behavioral feedback loops.',
    role: 'XR Developer',
    category: 'XR & Simulation',
    featured: true,
    technologies: ['Unity (XR)', 'C#', 'Virtual Reality', 'Spatial Mechanics', 'Behavioral Feedback', '3D Graphics'],
    metrics: [
      { label: 'Platform Engine', value: 'Unity & C#' },
      { label: 'Interaction Model', value: 'Spatial 3D Mechanics' },
      { label: 'Therapeutic Feedback', value: 'Real-time Loops' }
    ],
    githubUrl: 'https://github.com/mraaziqp'
  },
  {
    id: 'proj-hustle-studio',
    slug: 'hustle-studio',
    title: 'Hustle Studio',
    tagline: 'Multi-Tenant Business Operations Platform & Point-of-Sale (POS)',
    description:
      'Architected a multi-tenant business operations platform featuring point-of-sale (POS) systems, financial tracking, and embedded AI copilots. Implemented multi-tenant database isolation and query optimizations to support high-availability operations.',
    role: 'Lead Full-Stack Developer',
    category: 'Enterprise SaaS',
    featured: true,
    technologies: ['Next.js', 'PostgreSQL', 'TypeScript', 'Multi-Tenant DB', 'Embedded AI Copilots', 'POS Systems'],
    metrics: [
      { label: 'Architecture', value: 'Multi-Tenant' },
      { label: 'Availability', value: 'High Availability' },
      { label: 'Core Capabilities', value: 'POS & AI Copilots' }
    ],
    liveUrl: 'https://hustlestudio.co.za',
    githubUrl: 'https://github.com/mraaziqp/hustle-studio'
  },
  {
    id: 'proj-emeron',
    slug: 'emeron',
    title: 'Emeron',
    tagline: 'Enterprise Talent Acquisition & Automated CV Intelligence Platform',
    description:
      'Developed an end-to-end talent acquisition platform featuring automated CV parsing, algorithmic candidate shortlisting, and role-based client portals. Integrates bidirectional webhook synchronization with live portfolio caches and enterprise stores.',
    role: 'Full-Stack Developer',
    category: 'Enterprise Intelligence',
    featured: true,
    syncSource: true,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Automated CV Parsing', 'Role-Based Portals', 'Secure Webhooks'],
    metrics: [
      { label: 'Parsing Engine', value: 'Automated CV Parsing' },
      { label: 'Shortlisting Model', value: 'Algorithmic Match' },
      { label: 'Sync Latency', value: '<140ms Ingress' }
    ],
    liveUrl: '#sync-inspector',
    githubUrl: 'https://github.com/mraaziqp/emeron-cv-parser'
  },
  {
    id: 'proj-xpfinance',
    slug: 'xpfinance',
    title: 'XPFinance',
    tagline: 'Personal Finance & Expense Management Analytics Engine',
    description:
      'Built a personal finance and expense management application with interactive analytics dashboards, transaction categorization, and budget tracking.',
    role: 'Full-Stack Developer',
    category: 'Financial Technology',
    featured: true,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Interactive Dashboards', 'Transaction Categorization', 'Budget Tracking'],
    metrics: [
      { label: 'Dashboard UX', value: 'Interactive Analytics' },
      { label: 'Categorization', value: 'Algorithmic' },
      { label: 'Financial Guard', value: 'Real-Time Budgeting' }
    ],
    liveUrl: 'https://xpfinance.co.za',
    githubUrl: 'https://github.com/mraaziqp'
  },
  {
    id: 'proj-verifiedbizlink',
    slug: 'verifiedbizlink',
    title: 'VerifiedBizLink & TotalLŸ',
    tagline: 'B2B Verification Networks & Multi-Tenant Service Booking Platforms',
    description:
      'Built B2B verification networks and multi-tenant service booking platforms with custom administrative control centers, secure database schemas, and automated verification pipelines.',
    role: 'Full-Stack Developer',
    category: 'B2B Verification',
    featured: true,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Multi-Tenant Booking', 'B2B Verification', 'Admin Centers'],
    metrics: [
      { label: 'Platform Scope', value: 'B2B Verification' },
      { label: 'Booking Engine', value: 'Multi-Tenant' },
      { label: 'Control Plane', value: 'Custom Admin Centers' }
    ],
    liveUrl: 'https://verifiedbizlink.co.za',
    githubUrl: 'https://github.com/mraaziqp'
  }
];
