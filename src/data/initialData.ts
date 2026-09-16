import { CvSyncPayload, ProjectShowcaseItem } from '../types';

export const INITIAL_CV_DATA: CvSyncPayload = {
  version: 'v2.4.1',
  fullName: 'Mohammed Parker',
  headline: 'Senior Full-Stack Developer & Enterprise IT Systems Specialist',
  summary:
    'Solutions engineer and infrastructure specialist bridging mission-critical enterprise IT operations (BCX, VMware, Active Directory) with resilient full-stack web applications. Track record of maintaining 99.98% virtualization uptime, leading cloud migrations, and architecting automated, real-time data synchronization systems.',
  location: 'Cape Town, South Africa',
  email: 'mohammed.parker.dev@gmail.com',
  phone: '+27 (0) 21 000 0000',
  githubUrl: 'https://github.com/mohammedparker',
  linkedinUrl: 'https://linkedin.com/in/mohammedparker',
  websiteUrl: 'https://mohammedparker.dev',
  experiences: [
    {
      id: 'exp-1',
      role: 'IT Operations Administrator & Infrastructure Engineer',
      company: 'BCX (Business Connexion)',
      location: 'Cape Town, South Africa',
      startDate: '2022',
      endDate: null,
      isCurrent: true,
      summary:
        'Overseeing mission-critical enterprise server virtualization, domain security, and high-availability systems across hybrid corporate environments.',
      keyAchievements: [
        'Maintained 99.98% infrastructure availability across 150+ enterprise virtual machines (VMware ESXi & Microsoft Hyper-V).',
        'Implemented enterprise-wide Active Directory security policies, automated provisioning workflows, and RBAC governance.',
        'Established proactive disaster recovery and automated failover pipelines minimizing business disruption.',
        'Delivered continuous system health observability with enterprise incident escalation protocols.'
      ],
      technologies: ['Active Directory', 'VMware ESXi', 'Hyper-V', 'Windows Server Enterprise', 'Ubuntu Server', 'PowerShell Automation', 'Enterprise Networking'],
      enterpriseDomain: 'Enterprise Infrastructure, Virtualization & Directory Services'
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Software Engineer & Solutions Architect',
      company: 'Independent / Product Engineering',
      location: 'Cape Town, South Africa',
      startDate: '2021',
      endDate: null,
      isCurrent: true,
      summary:
        'Designing and deploying robust, business-critical web platforms, secure API integrations, and automated data pipelines using Next.js, TypeScript, and modern database architectures.',
      keyAchievements: [
        'Architected Emeron: enterprise CV data extraction platform featuring secure real-time webhook synchronization and schema validation.',
        'Engineered LifeStack: executive workflow assistant optimizing task scheduling through intelligent contextual analysis.',
        'Developed Hustle Studio: end-to-end operational platform centralizing billing, contract lifecycle, and resource utilization.'
      ],
      technologies: ['Next.js (App Router)', 'TypeScript', 'React', 'PostgreSQL', 'Drizzle ORM', 'Tailwind CSS', 'API Integration', 'Cloud Architecture'],
      enterpriseDomain: 'Full-Stack Enterprise Applications & Automated Pipelines'
    },
    {
      id: 'exp-3',
      role: 'Systems Administrator & Cloud Solutions Specialist',
      company: 'Technology Infrastructure Solutions',
      location: 'Western Cape, South Africa',
      startDate: '2019',
      endDate: '2022',
      isCurrent: false,
      summary:
        'Managed cloud migrations, multi-tier network security, automated backup operations, and precision hardware diagnostics for enterprise clients.',
      keyAchievements: [
        'Earned AWS Certified Cloud Practitioner credential and successfully migrated on-premises infrastructure to AWS VPC and EC2 environments.',
        'Enforced least-privilege IAM security frameworks and automated snapshot schedules for data protection compliance.',
        'Conducted component-level hardware diagnostics and board-level repairs on critical server appliances.'
      ],
      technologies: ['AWS (EC2, S3, IAM, VPC, Route53)', 'Docker', 'Bash Automation', 'Hardware Diagnostics', 'Electronics & Diagnostics'],
      enterpriseDomain: 'Cloud Migration & Infrastructure Reliability'
    }
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'C# (Unity)', 'SQL', 'Bash / Shell', 'PowerShell'],
    frameworks: ['Next.js (App Router)', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'Drizzle ORM', 'Prisma'],
    cloudAndDevOps: ['AWS Certified Cloud Practitioner', 'Docker', 'Serverless PostgreSQL', 'CI/CD Pipelines', 'Linux (Ubuntu/Debian)', 'Cloud Architecture'],
    enterpriseAndIT: ['BCX Enterprise Infrastructure', 'Active Directory & GPOs', 'VMware ESXi', 'Microsoft Hyper-V', 'Windows Server Enterprise', 'DNS / DHCP / VLANs', 'Disaster Recovery & Redundancy'],
    hardwareAndCreative: ['Unity Engine & C# Systems', 'Artisanal Coffee Extraction & Profiling', 'Artisan Chocolate Confectionery', 'SMD Electronics & Hardware Diagnostics']
  },
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023',
      expiryDate: '2026',
      credentialId: 'AWS-CCP-984210',
      badgeUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
    },
    {
      id: 'cert-2',
      name: 'Enterprise Active Directory & Server Administration',
      issuer: 'Microsoft Certified Professional Standards',
      issueDate: '2022',
      credentialId: 'MS-AD-ADMIN-772',
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Information Technology & Systems Engineering',
      institution: 'Cape Town Institute of Technology',
      year: '2019 - 2021',
      details: 'Comprehensive focus on Enterprise Infrastructure, Cloud Architectures, Distributed Systems, and Modern Software Engineering.'
    }
  ],
  rawCvMetadata: {
    parserSource: 'Emeron CV Intelligence Engine v2.4',
    confidenceScore: 0.985,
    parsedAt: new Date().toISOString(),
    checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
};

export const SHOWCASE_PROJECTS: ProjectShowcaseItem[] = [
  {
    id: 'proj-emeron',
    slug: 'emeron',
    title: 'Emeron',
    tagline: 'Automated Resume Intelligence & Live Data Synchronization Platform',
    description:
      'Solves the friction of candidate data entry by parsing unstructured CV documents into standardized, structured records. Connects directly to enterprise recruitment systems and live portfolios via secure real-time webhooks, eliminating manual data handling.',
    role: 'Lead Architect & Full-Stack Developer',
    category: 'Enterprise Intelligence',
    featured: true,
    syncSource: true,
    technologies: ['Next.js App Router', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Tailwind CSS', 'Secure Webhooks', 'RESTful APIs'],
    metrics: [
      { label: 'Data Extraction', value: '98.5% Accuracy' },
      { label: 'Sync Latency', value: '<140ms' },
      { label: 'Fields Processed', value: '35+ Entities' }
    ],
    liveUrl: '#sync-inspector',
    githubUrl: 'https://github.com/mohammedparker/emeron-cv-parser'
  },
  {
    id: 'proj-lifestack',
    slug: 'lifestack',
    title: 'LifeStack',
    tagline: 'Executive Productivity & Intelligent Workflow Optimization',
    description:
      'Designed to reduce cognitive overhead for professionals by combining dynamic calendar scheduling with contextual task prioritization. Evaluates incoming deliverables and optimizes work sessions to maximize high-impact outcomes.',
    role: 'Full-Stack Creator & Solutions Engineer',
    category: 'Productivity Systems',
    featured: true,
    technologies: ['React', 'Next.js', 'Intelligent Context Engine', 'TypeScript', 'Tailwind CSS', 'Vector Storage'],
    metrics: [
      { label: 'Efficiency Gain', value: '15+ Hrs/Month' },
      { label: 'Response Time', value: 'Sub-second' },
      { label: 'Workflow Model', value: 'Automated' }
    ],
    liveUrl: 'https://lifestack.app',
    githubUrl: 'https://github.com/mohammedparker/lifestack-ai'
  },
  {
    id: 'proj-hustle-studio',
    slug: 'hustle-studio',
    title: 'Hustle Studio',
    tagline: 'Unified Business Operations & Financial Management Platform',
    description:
      'A comprehensive operational workspace consolidating enterprise contract lifecycles, team resource scheduling, client invoicing, and real-time financial reporting into a clear executive dashboard.',
    role: 'Full-Stack Architect',
    category: 'Enterprise SaaS',
    featured: true,
    technologies: ['Next.js', 'PostgreSQL', 'Drizzle ORM', 'Server Actions', 'Tailwind CSS', 'Role-Based Access (RBAC)'],
    metrics: [
      { label: 'Architecture', value: 'High Availability' },
      { label: 'Access Control', value: 'Enterprise RBAC' },
      { label: 'Reporting', value: 'Real-Time Insights' }
    ],
    liveUrl: 'https://hustlestudio.co',
    githubUrl: 'https://github.com/mohammedparker/hustle-studio'
  }
];
