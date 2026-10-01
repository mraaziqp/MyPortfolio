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
  websiteUrl: 'https://portfolio.arpcloudsolutions.co.za',
  availability: {
    openToWork: true,
    note: 'Open to software engineering and infrastructure roles',
  },
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
      issueDate: '',
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
    parserSource: 'Mohammed_Parker_CV.pdf',
    parsedAt: '2026-09-25T00:00:00.000Z'
  }
};

// Links are only listed where they resolve (checked 2026-09-28); private
// codebases have no GitHub link rather than one that 404s.
export const SHOWCASE_PROJECTS: ProjectShowcaseItem[] = [
  {
    id: 'proj-emeron',
    slug: 'emeron',
    title: 'Emeron',
    tagline: 'Enterprise recruitment platform',
    description:
      'End-to-end talent acquisition platform with automated CV parsing, algorithmic candidate shortlisting and role-based client portals.',
    role: 'Full-Stack Developer',
    category: 'Enterprise SaaS',
    featured: true,
    status: 'in-development',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'CV parsing', 'Role-based access'],
    metrics: [],
    liveUrl: 'https://emeron.co.za',
  },
  {
    id: 'proj-hustle-studio',
    slug: 'hustle-studio',
    title: 'Hustle Studio',
    tagline: 'Multi-tenant business operations & point of sale',
    description:
      'Multi-tenant business operations platform with point-of-sale, financial tracking and embedded AI copilots. Implemented tenant data isolation and query optimisation for high-availability operation.',
    role: 'Lead Full-Stack Developer',
    category: 'Enterprise SaaS',
    featured: true,
    status: 'in-development',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Multi-tenancy', 'AI copilots'],
    metrics: [],
  },
  {
    id: 'proj-lifestack',
    slug: 'lifestack',
    title: 'LifeStack',
    tagline: 'AI-powered project management & personal assistant',
    description:
      'Project management and personal assistant web app with intelligent schedule optimisation, automated activity tracking and REST endpoints for personalised productivity workflows.',
    role: 'Full-Stack Engineer',
    category: 'Productivity',
    featured: true,
    status: 'in-development',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    metrics: [],
  },
  {
    id: 'proj-verifiedbizlink',
    slug: 'verifiedbizlink',
    previewImage: '/previews/verifiedbizlink.jpg',
    title: 'VerifiedBizLink & TotalLŸ',
    tagline: 'B2B verification network & service booking platforms',
    description:
      'B2B verification network and multi-tenant service booking platforms with custom admin control centres, document vetting pipelines and secure database schemas.',
    role: 'Full-Stack Developer',
    category: 'B2B Platforms',
    featured: true,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Multi-tenant booking', 'Admin tooling'],
    metrics: [],
    liveUrl: 'https://www.verifiedbizlink.co.za',
    githubUrl: 'https://github.com/mraaziqp/VerifiedBizLink',
    links: [{ label: 'totally.co.za', url: 'https://www.totally.co.za' }],
  },
  {
    id: 'proj-xpfinance',
    slug: 'xpfinance',
    previewImage: '/previews/xpfinance.jpg',
    title: 'XPFinance',
    tagline: 'Personal finance & expense analytics',
    description:
      'Personal finance and expense management app with interactive analytics dashboards, transaction categorisation and budget tracking.',
    role: 'Full-Stack Developer',
    category: 'FinTech',
    featured: true,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Data visualisation'],
    metrics: [],
    liveUrl: 'https://www.xpfinance.co.za',
  },
  {
    id: 'proj-vr-phobia',
    slug: 'vr-phobia',
    title: 'VR Phobia Therapy',
    tagline: 'Virtual reality exposure therapy',
    description:
      'Immersive VR application for controlled exposure therapy, helping people work through phobias. Designed the spatial interaction mechanics, dynamic environments and real-time behavioural feedback loops.',
    role: 'XR Developer',
    category: 'XR & Simulation',
    featured: true,
    status: 'in-development',
    technologies: ['Unity', 'C#', 'Virtual reality', '3D interaction design'],
    metrics: [],
  },
  {
    id: 'proj-arp-hub',
    slug: 'arp-cloud-solutions',
    previewImage: '/previews/arp-cloud-solutions.jpg',
    title: 'ARP Cloud Solutions',
    tagline: 'Client portal, quoting and payments for my own studio',
    description:
      'The home of my development business: live project showcase, an instant quoting tool, a template customiser clients can edit in the browser, PayFast checkout with verified ITN webhooks, and a customer dashboard that tracks each build through its stages.',
    role: 'Designer & Full-Stack Developer',
    category: 'Business Platforms',
    featured: true,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'Firestore', 'PayFast', 'AWS Amplify'],
    metrics: [],
    liveUrl: 'https://arpcloudsolutions.co.za',
  },
  {
    id: 'proj-awehchat',
    slug: 'awehchat',
    previewImage: '/previews/awehchat.jpg',
    title: 'AwehChat',
    tagline: 'Private messaging, calls and shared workspaces',
    description:
      'A messaging app built around South African users: fast private chat, calls and shared workspaces, with a contact hub that keeps people reachable across the other apps in the ecosystem.',
    role: 'Full-Stack Developer',
    category: 'Consumer Apps',
    featured: true,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'Postgres', 'Drizzle', 'AWS Amplify'],
    metrics: [],
    liveUrl: 'https://awehchat.co.za',
  },
  {
    id: 'proj-aethermail',
    slug: 'aethermail',
    previewImage: '/previews/aethermail.jpg',
    title: 'AetherMail',
    tagline: 'Mail operations dashboard with threat triage',
    description:
      'A command centre for email: real-time triage, automated threat evaluation and routing rules, presented as a dark operations dashboard built for scanning a busy inbox quickly.',
    role: 'Full-Stack Developer',
    category: 'Productivity',
    featured: false,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'Postgres', 'Drizzle', 'Vercel'],
    metrics: [],
    liveUrl: 'https://aethermail-five.vercel.app',
  },
  {
    id: 'proj-sharehub',
    slug: 'sharehub',
    previewImage: '/previews/sharehub.jpg',
    title: 'ShareHub',
    tagline: 'Community rental marketplace',
    description:
      'A neighbourhood marketplace for lending rooms, tools and equipment, with fractional subscriptions and trust signals built into the booking flow.',
    role: 'Full-Stack Developer',
    category: 'B2B Platforms',
    featured: false,
    status: 'live',
    technologies: ['React', 'Vite', 'TypeScript', 'Firebase', 'AWS Amplify'],
    metrics: [],
    liveUrl: 'https://main.d2pumkvkkdfso8.amplifyapp.com',
  },
  {
    id: 'proj-plazr',
    slug: 'plazr',
    previewImage: '/previews/plazr.jpg',
    title: 'Plazr',
    tagline: 'Street market platform for local traders',
    description:
      'A marketplace designed for South African traders working from a phone: stalls, listings and payments, kept light enough to run on a slow connection.',
    role: 'Full-Stack Developer',
    category: 'B2B Platforms',
    featured: false,
    status: 'live',
    technologies: ['React', 'Vite', 'TypeScript', 'Postgres', 'Vercel'],
    metrics: [],
    liveUrl: 'https://plazr2.vercel.app',
  },
  {
    id: 'proj-nikahpath',
    slug: 'nikahpath',
    title: 'NikahPath',
    tagline: 'Intentional halal matchmaking',
    description:
      'A matchmaking platform designed around Islamic practice: wali approval, chaperoned conversations and private photo access, with the privacy rules enforced server-side rather than in the interface.',
    role: 'Full-Stack Developer',
    category: 'Consumer Apps',
    featured: false,
    status: 'live',
    technologies: ['React', 'TypeScript', 'Express', 'Postgres', 'Vercel'],
    metrics: [],
    liveUrl: 'https://muslim-dating.vercel.app',
  },
  {
    id: 'proj-silver-crest',
    slug: 'silver-crest-connect',
    previewImage: '/previews/silver-crest-connect.jpg',
    title: 'Silver Crest Connect',
    tagline: 'Event platform for a B2B networking showcase',
    description:
      'Delivered for a vetted business networking event: programme, speaker profiles, delegate registration and the on-the-day logistics the organisers run from their phones.',
    role: 'Full-Stack Developer (client project)',
    category: 'B2B Platforms',
    featured: false,
    status: 'live',
    technologies: ['React', 'Vite', 'TypeScript', 'Express', 'Vercel'],
    metrics: [],
    liveUrl: 'https://silver-crest-connect.vercel.app',
  },
  {
    id: 'proj-wedding-invitation',
    slug: 'wedding-invitation',
    previewImage: '/previews/wedding-invitation.jpg',
    title: 'Digital Wedding Invitation',
    tagline: 'Invitation, RSVP and a private memory panel',
    description:
      'A digital invitation delivered for a client wedding: the story, the day, directions and RSVP, plus a private panel where guests upload photos after the event.',
    role: 'Full-Stack Developer (client project)',
    category: 'Consumer Apps',
    featured: false,
    status: 'live',
    technologies: ['Next.js', 'TypeScript', 'Firebase', 'Framer Motion', 'Vercel'],
    metrics: [],
    liveUrl: 'https://weddingapp3-0.vercel.app',
  },
];
