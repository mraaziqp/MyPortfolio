// src/lib/auth.ts
import { timingSafeEqual } from "crypto";
var DEFAULT_PORTFOLIO_KEY = "mp_sec_live_9f83a2e1d74b6c80";
var DEFAULT_JARVIS_KEY = "jrv_mp_master_9f83a2e1d74b6c80a52e1f4b";
function validateApiKey(requestHeaders, searchParams) {
  const configuredPortfolioKey = process.env.PORTFOLIO_API_KEY || DEFAULT_PORTFOLIO_KEY;
  const configuredJarvisKey = process.env.JARVIS_API_KEY || DEFAULT_JARVIS_KEY;
  let incomingKey = null;
  if (requestHeaders instanceof Headers) {
    const authHeader = requestHeaders.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      incomingKey = authHeader.substring(7).trim();
    } else {
      incomingKey = requestHeaders.get("x-jarvis-key") || requestHeaders.get("x-api-key") || requestHeaders.get("x-emeron-key") || requestHeaders.get("x-client-secret");
    }
  } else {
    const authHeader = requestHeaders["authorization"];
    const authHeaderStr = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (authHeaderStr && authHeaderStr.toLowerCase().startsWith("bearer ")) {
      incomingKey = authHeaderStr.substring(7).trim();
    } else {
      const apiKeyHeader = requestHeaders["x-jarvis-key"] || requestHeaders["x-api-key"] || requestHeaders["x-emeron-key"] || requestHeaders["x-client-secret"];
      incomingKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader || null;
    }
  }
  if (!incomingKey && searchParams) {
    incomingKey = searchParams.get("jarvis_key") || searchParams.get("api_key") || searchParams.get("key");
  }
  if (!incomingKey) {
    return {
      isValid: false,
      error: "Unauthorized: Missing API key in Authorization (Bearer), x-jarvis-key, or x-api-key header.",
      statusCode: 401
    };
  }
  const incomingClean = incomingKey.trim();
  const safeCompare = (expected, provided) => {
    try {
      const expectedBuf = Buffer.from(expected, "utf-8");
      const providedBuf = Buffer.from(provided, "utf-8");
      if (expectedBuf.length !== providedBuf.length) return false;
      return timingSafeEqual(expectedBuf, providedBuf);
    } catch {
      return false;
    }
  };
  if (safeCompare(configuredJarvisKey, incomingClean)) {
    return {
      isValid: true,
      clientId: "jarvis-second-brain-master",
      role: "jarvis_master"
    };
  }
  if (safeCompare(configuredPortfolioKey, incomingClean)) {
    return {
      isValid: true,
      clientId: "emeron-cv-sync-service",
      role: "client_sync"
    };
  }
  return {
    isValid: false,
    error: "Forbidden: Invalid API key credentials provided.",
    statusCode: 403
  };
}

// src/data/initialData.ts
var INITIAL_CV_DATA = {
  version: "v3.0.0",
  fullName: "Mohammed Parker",
  headline: "Software Engineer & Systems Administrator",
  summary: "Software Engineer and Systems Administrator with strong expertise in full-stack application development, cloud computing (AWS Certified), and enterprise infrastructure management. Proven track record of architecting scalable multi-tenant SaaS platforms, interactive VR applications, and AI-orchestrated tools. Combines hands-on systems reliability, VMware virtualization, and Azure/Active Directory administration with modern web development methodologies to deliver secure, high-availability software solutions.",
  location: "Cape Town, South Africa 7500",
  email: "mraaziqp@gmail.com",
  phone: "+27 83 786 4913",
  githubUrl: "https://github.com/mraaziqp",
  linkedinUrl: "https://linkedin.com/in/mohammedparker",
  websiteUrl: "https://mraaziqp.vercel.app",
  experiences: [
    {
      id: "exp-bcx",
      role: "IT Admin",
      company: "BCX",
      location: "Cape Town, South Africa",
      startDate: "10/2024",
      endDate: null,
      isCurrent: true,
      summary: "Managing and coordinating server, virtual machine (VMware/Hyper-V), and Active Directory engineering workflows, consistently meeting strict enterprise Service Level Agreements (SLAs).",
      keyAchievements: [
        "Manage and coordinate server, virtual machine (VMware/Hyper-V), and Active Directory engineering workflows, consistently meeting strict enterprise Service Level Agreements (SLAs).",
        "Direct the Microsoft team\u2019s request and incident queues; triage complex technical escalations, prioritize workload distribution, and exercise autonomous decision-making for task resolution.",
        "Provision, configure, and maintain physical and virtual enterprise server infrastructure, establishing remote diagnostics and system observability.",
        "Oversee end-to-end server lifecycle management, including decommissioning protocols, compliance documentation, and audit readiness.",
        "Serve as the final technical gatekeeper and QA sign-off authority prior to deploying infrastructure changes and client-facing solutions."
      ],
      technologies: ["VMware ESXi", "Microsoft Hyper-V", "Active Directory", "Windows Server", "System Observability", "SLA Management", "Microsoft Infrastructure"],
      enterpriseDomain: "Enterprise Virtualization & Directory Services"
    },
    {
      id: "exp-reddington",
      role: "IT Technician",
      company: "Reddington \u2013 Ensure IT Services",
      location: "Cape Town, South Africa",
      startDate: "07/2023",
      endDate: "10/2024",
      isCurrent: false,
      summary: "Performed root-cause analysis, hardware diagnostics, and component-level repairs for enterprise laptops, workstations, and printers across enterprise client fleets.",
      keyAchievements: [
        "Performed root-cause analysis, hardware diagnostics, and component-level repairs for enterprise laptops, workstations, and printers.",
        "Managed parts procurement, warranty tracking, and inventory logistics through Microsoft Dynamics.",
        "Resolved complex networking, operating system, and hardware configuration escalations."
      ],
      technologies: ["Hardware Diagnostics", "Component-Level Repair", "Microsoft Dynamics", "Enterprise Networking", "OS Troubleshooting", "Logistics Management"],
      enterpriseDomain: "Hardware Diagnostics & Systems Reliability"
    },
    {
      id: "exp-fpg",
      role: "IT Technical Support Intern",
      company: "FPG Group",
      location: "Plattekloof, South Africa",
      startDate: "05/2023",
      endDate: "09/2023",
      isCurrent: false,
      summary: "Administered user identities, access control (RBAC), and security policies in Azure Active Directory (Entra ID) with centralized endpoint deployment.",
      keyAchievements: [
        "Administered user identities, access control (RBAC), and security policies in Azure Active Directory (Entra ID).",
        "Deployed operating system images and configured enterprise software across distributed company workstations using Microsoft Endpoint.",
        "Participated in cross-functional technical meetings to troubleshoot systemic errors and support IT modernization initiatives."
      ],
      technologies: ["Azure Active Directory / Entra ID", "RBAC Policies", "Microsoft Endpoint", "OS Imaging", "Security Policies", "IT Modernization"],
      enterpriseDomain: "Azure Identity & Endpoint Management"
    },
    {
      id: "exp-construct",
      role: "L1 Technical Support Engineer",
      company: "Construct Education",
      location: "Cape Town, South Africa",
      startDate: "05/2023",
      endDate: "08/2023",
      isCurrent: false,
      summary: "Delivered remote technical support across 54 KFC branch locations and educational portals, troubleshooting Canvas LMS and mobile app issues.",
      keyAchievements: [
        "Delivered remote technical support across 54 KFC branch locations and educational portals, troubleshooting Canvas LMS and mobile app issues.",
        "Authored accessible technical guides and standard operating procedures (SOPs) to streamline troubleshooting for non-technical users."
      ],
      technologies: ["Remote Support", "Canvas LMS", "Mobile Applications", "Technical Writing", "SOP Authoring", "Distributed Branch Support"],
      enterpriseDomain: "Distributed Branch Support & Educational Platforms"
    }
  ],
  skills: {
    languages: ["TypeScript", "Python", "C#", "SQL", "Bash / Shell", "PowerShell"],
    frameworks: ["Next.js", "React", "Node.js", "Tailwind CSS", "Unity (XR)", "Express"],
    cloudAndDevOps: ["AWS (EC2, S3)", "PostgreSQL", "Firebase", "Supabase", "Docker", "REST APIs"],
    aiAndArchitecture: ["AI Orchestration", "LLMs (Gemini, Ollama)", "CI/CD", "Microservices", "System Observability"],
    enterpriseAndIT: ["VMware", "Hyper-V", "Linux", "Windows Server", "Azure AD / Entra ID", "Microsoft Intune"],
    hardwareAndCreative: ["Unity & C# XR Simulation", "Hardware & Electronics Restoration", "Precision Coffee Extraction", "Artisanal Confectionery"]
  },
  certifications: [
    {
      id: "cert-aws",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "Valid Thru 2026",
      badgeUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
    },
    {
      id: "cert-lenovo",
      name: "Lenovo Certified Technician",
      issuer: "Lenovo",
      issueDate: "2023 \u2013 2031"
    },
    {
      id: "cert-dell",
      name: "DELL Certified Technician",
      issuer: "DELL Technologies",
      issueDate: "2023 \u2013 2031"
    }
  ],
  education: [
    {
      id: "edu-adv-dip",
      degree: "Advanced Diploma in ICT: Applications Development",
      institution: "Cape Peninsula University of Technology (CPUT) \u2014 Cape Town",
      year: "Graduated 04/2025",
      details: "Focus: Full-stack application development, software design patterns, advanced SQL, systems analysis, and Agile methodologies."
    },
    {
      id: "edu-nat-dip",
      degree: "National Diploma in ICT: Applications Development",
      institution: "Cape Peninsula University of Technology (CPUT) \u2014 Cape Town",
      year: "01/2023",
      details: "Comprehensive software engineering, database design, algorithms, and distributed computing."
    },
    {
      id: "edu-higher-cert",
      degree: "Higher Certificate in ICT",
      institution: "Cape Peninsula University of Technology (CPUT) \u2014 Cape Town",
      year: "01/2020",
      details: "Information and Communication Technology foundational principles, programming fundamentals, and computer hardware."
    },
    {
      id: "edu-matric",
      degree: "National Senior Certificate / High School Diploma",
      institution: "Fairbairn College \u2014 Cape Town",
      year: "01/2019",
      details: "National Senior Certificate matriculation."
    }
  ],
  rawCvMetadata: {
    parserSource: "Official Mohammed Parker Verified Resume",
    confidenceScore: 1,
    parsedAt: (/* @__PURE__ */ new Date()).toISOString(),
    checksum: "sha256:mohammed_parker_cv_verified_2026"
  }
};
var SHOWCASE_PROJECTS = [
  {
    id: "proj-lifestack",
    slug: "lifestack",
    title: "LifeStack",
    tagline: "AI-Powered Project Management & Personal Assistant Web Application",
    description: "Engineered an AI-powered project management and personal assistant web application using Next.js, React, and TypeScript. Integrated intelligent schedule optimization, automated activity tracking, and RESTful API endpoints for personalized productivity workflows.",
    role: "Full-Stack Engineer",
    category: "Productivity Systems",
    featured: true,
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs", "AI Scheduling"],
    metrics: [
      { label: "Schedule Engine", value: "Automated" },
      { label: "Stack Architecture", value: "Next.js & React" },
      { label: "API Protocols", value: "RESTful Endpoints" }
    ],
    liveUrl: "https://lifestack.co.za",
    githubUrl: "https://github.com/mraaziqp/lifestack-ai"
  },
  {
    id: "proj-vr-phobia",
    slug: "vr-phobia",
    title: "VR Phobia Therapy",
    tagline: "Immersive Virtual Reality Exposure Therapy Application",
    description: "Developing an immersive Virtual Reality application in Unity Engine and C# designed for controlled exposure therapy to assist individuals with phobias. Designed spatial interaction mechanics, dynamic VR environments, and real-time behavioral feedback loops.",
    role: "XR Developer",
    category: "XR & Simulation",
    featured: true,
    technologies: ["Unity (XR)", "C#", "Virtual Reality", "Spatial Mechanics", "Behavioral Feedback", "3D Graphics"],
    metrics: [
      { label: "Platform Engine", value: "Unity & C#" },
      { label: "Interaction Model", value: "Spatial 3D Mechanics" },
      { label: "Therapeutic Feedback", value: "Real-time Loops" }
    ],
    githubUrl: "https://github.com/mraaziqp"
  },
  {
    id: "proj-hustle-studio",
    slug: "hustle-studio",
    title: "Hustle Studio",
    tagline: "Multi-Tenant Business Operations Platform & Point-of-Sale (POS)",
    description: "Architected a multi-tenant business operations platform featuring point-of-sale (POS) systems, financial tracking, and embedded AI copilots. Implemented multi-tenant database isolation and query optimizations to support high-availability operations.",
    role: "Lead Full-Stack Developer",
    category: "Enterprise SaaS",
    featured: true,
    technologies: ["Next.js", "PostgreSQL", "TypeScript", "Multi-Tenant DB", "Embedded AI Copilots", "POS Systems"],
    metrics: [
      { label: "Architecture", value: "Multi-Tenant" },
      { label: "Availability", value: "High Availability" },
      { label: "Core Capabilities", value: "POS & AI Copilots" }
    ],
    liveUrl: "https://hustlestudio.co.za",
    githubUrl: "https://github.com/mraaziqp/hustle-studio"
  },
  {
    id: "proj-emeron",
    slug: "emeron",
    title: "Emeron",
    tagline: "Enterprise Talent Acquisition & Automated CV Intelligence Platform",
    description: "Developed an end-to-end talent acquisition platform featuring automated CV parsing, algorithmic candidate shortlisting, and role-based client portals. Integrates bidirectional webhook synchronization with live portfolio caches and enterprise stores.",
    role: "Full-Stack Developer",
    category: "Enterprise Intelligence",
    featured: true,
    syncSource: true,
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Automated CV Parsing", "Role-Based Portals", "Secure Webhooks"],
    metrics: [
      { label: "Parsing Engine", value: "Automated CV Parsing" },
      { label: "Shortlisting Model", value: "Algorithmic Match" },
      { label: "Sync Latency", value: "<140ms Ingress" }
    ],
    liveUrl: "#sync-inspector",
    githubUrl: "https://github.com/mraaziqp/emeron-cv-parser"
  },
  {
    id: "proj-xpfinance",
    slug: "xpfinance",
    title: "XPFinance",
    tagline: "Personal Finance & Expense Management Analytics Engine",
    description: "Built a personal finance and expense management application with interactive analytics dashboards, transaction categorization, and budget tracking.",
    role: "Full-Stack Developer",
    category: "Financial Technology",
    featured: true,
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Interactive Dashboards", "Transaction Categorization", "Budget Tracking"],
    metrics: [
      { label: "Dashboard UX", value: "Interactive Analytics" },
      { label: "Categorization", value: "Algorithmic" },
      { label: "Financial Guard", value: "Real-Time Budgeting" }
    ],
    liveUrl: "https://xpfinance.co.za",
    githubUrl: "https://github.com/mraaziqp"
  },
  {
    id: "proj-verifiedbizlink",
    slug: "verifiedbizlink",
    title: "VerifiedBizLink & TotalL\u0178",
    tagline: "B2B Verification Networks & Multi-Tenant Service Booking Platforms",
    description: "Built B2B verification networks and multi-tenant service booking platforms with custom administrative control centers, secure database schemas, and automated verification pipelines.",
    role: "Full-Stack Developer",
    category: "B2B Verification",
    featured: true,
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Multi-Tenant Booking", "B2B Verification", "Admin Centers"],
    metrics: [
      { label: "Platform Scope", value: "B2B Verification" },
      { label: "Booking Engine", value: "Multi-Tenant" },
      { label: "Control Plane", value: "Custom Admin Centers" }
    ],
    liveUrl: "https://verifiedbizlink.co.za",
    githubUrl: "https://github.com/mraaziqp"
  }
];

// api_src/_utils.ts
import { createHash } from "crypto";
var sharedCvState = { ...INITIAL_CV_DATA };
var sharedTelemetryState = {
  views: {
    emeron: 342,
    lifestack: 218,
    "hustle-studio": 196
  },
  interactions: {
    emeron: 84,
    lifestack: 62,
    "hustle-studio": 49
  },
  totalViews: 756
};
var sharedInquiries = [
  {
    id: "inq-seed-1",
    name: "Sarah Jenkins",
    email: "sarah.j@enterprise-tech.co.za",
    organization: "Enterprise Cloud Solutions",
    subject: "Senior Infrastructure & AI Architecture Role",
    message: "Reviewing your BCX and full-stack track record. We would love to discuss a solutions lead opening.",
    category: "recruiting",
    status: "alerted_to_jarvis",
    createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
    receiptId: "rcpt_1790184995604_a7f9"
  }
];
var sharedAuditReceipts = [];
function handleCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-jarvis-key, x-api-key, x-emeron-key, x-client-secret");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}
async function parseBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return { raw: req.body };
    }
  }
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({ raw: data });
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function checkAuth(req) {
  const urlObj = new URL(req.url || "/", "http://localhost:3000");
  return validateApiKey(req.headers, urlObj.searchParams);
}
function calculateDigest(data) {
  const str = typeof data === "string" ? data : JSON.stringify(data || {});
  const hash = createHash("sha256").update(str).digest("hex");
  return `sha256:${hash}`;
}
function recordServerReceipt(params) {
  const now = /* @__PURE__ */ new Date();
  const unix = now.getTime();
  const randomSuffix = Math.random().toString(16).substring(2, 8);
  const receiptId = `rcpt_${unix}_${randomSuffix}`;
  const payloadDigest = calculateDigest(params.payload || {});
  const receiptSignature = `sig_${calculateDigest(`${receiptId}:${unix}:${params.actionType}:${params.status}`)}`;
  const receipt = {
    receiptId,
    timestamp: now.toISOString(),
    unixTimestamp: unix,
    actionType: params.actionType,
    caller: params.caller,
    status: params.status,
    statusCode: params.statusCode,
    latencyMs: Math.max(1, Math.round(params.latencyMs)),
    payloadDigest,
    receiptSignature,
    summary: params.summary,
    details: params.details
  };
  sharedAuditReceipts.unshift(receipt);
  if (sharedAuditReceipts.length > 100) {
    sharedAuditReceipts = sharedAuditReceipts.slice(0, 100);
  }
  return receipt;
}

// api_src/dashboard/[...slug].ts
var ECOSYSTEM_APPS = [
  {
    id: "second-brain",
    name: "Jarvis Second Brain AI Core",
    slug: "second-brain",
    category: "ai_core",
    status: "operational",
    localUrl: "http://localhost:3005",
    productionUrl: "https://jarvis.savestate.co.za",
    healthEndpoint: "http://localhost:3005/api/system/status",
    description: "Central AI assistant, autonomous triage sentry, vector memory, and execution runtime.",
    portalEmbedUrl: "http://localhost:3005/m/control",
    capabilities: ["autonomous_actions", "email_triage", "webhook_gateway", "voice_pipeline"]
  },
  {
    id: "agent-builder",
    name: "Agent Builder (PC & Remote)",
    slug: "agent-builder",
    category: "ai_core",
    status: "operational",
    productionUrl: "https://agent-builder-remote.vercel.app",
    description: "Visual autonomous agent designer, prompt flow orchestrator, and tool synthesizer.",
    portalEmbedUrl: "https://agent-builder-remote.vercel.app",
    capabilities: ["prompt_engineering", "agent_orchestration", "ide_bridge", "code_synthesis"]
  },
  {
    id: "consolidated-hub",
    name: "Consolidated Business Hub",
    slug: "consolidated-hub",
    category: "saas_platform",
    status: "operational",
    localUrl: "http://localhost:9003",
    productionUrl: "https://consolidated-hub.vercel.app",
    description: "Master enterprise hub managing ARP Cloud Solutions, client projects, invoices, and payments.",
    portalEmbedUrl: "https://consolidated-hub.vercel.app/admin",
    capabilities: ["invoicing", "client_crm", "payfast_gateway", "firebase_sync"]
  },
  {
    id: "aethermail",
    name: "AetherMail Business Gateway",
    slug: "aethermail",
    category: "productivity",
    status: "operational",
    localUrl: "http://localhost:3007",
    productionUrl: "https://aethermail-five.vercel.app",
    description: "Autonomous email triage, Stalwart relay, IMAP synchronization, and spam firewall.",
    portalEmbedUrl: "https://aethermail-five.vercel.app",
    capabilities: ["smtp_relay", "imap_sync", "smart_drafting", "domain_management"]
  },
  {
    id: "cvgenman",
    name: "Emeron CV Parsing & Generation Engine",
    slug: "cvgenman",
    category: "saas_platform",
    status: "operational",
    productionUrl: "https://cvgenman.vercel.app",
    description: "AI-assisted resume parser, professional CV builder, and portfolio synchronization webhook.",
    portalEmbedUrl: "https://cvgenman.vercel.app",
    capabilities: ["resume_parsing", "pdf_export", "webhook_sync", "candidate_scoring"]
  },
  {
    id: "remotedesk",
    name: "RemoteDesk Enterprise Workspace",
    slug: "remotedesk",
    category: "productivity",
    status: "operational",
    productionUrl: "https://remotedesk-omega.vercel.app",
    description: "Remote desktop gateway, cloud file sync, and team collaboration canvas.",
    portalEmbedUrl: "https://remotedesk-omega.vercel.app",
    capabilities: ["session_streaming", "file_vault", "multi_user_collab"]
  },
  {
    id: "financeplay",
    name: "FinancePlay Analytics",
    slug: "financeplay",
    category: "saas_platform",
    status: "operational",
    productionUrl: "https://www.xpfinance.co.za",
    description: "Personal and corporate finance modeling, expense classification, and budget forecasting.",
    portalEmbedUrl: "https://www.xpfinance.co.za",
    capabilities: ["transaction_categorization", "budgeting", "financial_reports"]
  },
  {
    id: "deenify",
    name: "Deenify Spiritual Lifestyle",
    slug: "deenify",
    category: "consumer",
    status: "operational",
    productionUrl: "https://www.deenify.co.za",
    description: "Islamic companion app featuring prayer timings, Qibla compass, and Quran recitation.",
    portalEmbedUrl: "https://www.deenify.co.za",
    capabilities: ["prayer_times", "quran_audio", "community_events"]
  },
  {
    id: "project-cupid",
    name: "Project Cupid / Muslim Dating",
    slug: "project-cupid",
    category: "consumer",
    status: "operational",
    productionUrl: "https://muslim-dating.vercel.app",
    description: "Modern, values-aligned matchmaking and marital relationship platform.",
    portalEmbedUrl: "https://muslim-dating.vercel.app",
    capabilities: ["profile_matching", "direct_messaging", "verification"]
  },
  {
    id: "myportfolio",
    name: "Mohamed Raaziq Parker Portfolio (Self)",
    slug: "myportfolio",
    category: "productivity",
    status: "operational",
    productionUrl: "https://portfolio.arpcloudsolutions.co.za",
    description: "Showcase portfolio, tech stack matrix, CV synchronization, and ecosystem dashboard hub.",
    portalEmbedUrl: "https://portfolio.arpcloudsolutions.co.za/?portal=true",
    capabilities: ["cv_sync", "telemetry_export", "jarvis_bridge", "dashboard_manager"]
  }
];
async function handlePortal(req, res, start, auth, origin) {
  const manifest = {
    manifestVersion: "1.0.0",
    appName: "Mohamed Raaziq Parker Portfolio",
    appSlug: "myportfolio",
    primaryDomain: "arpcloudsolutions.co.za",
    subdomainUrl: "https://portfolio.arpcloudsolutions.co.za",
    embedPortalUrl: `${origin}/?portal=true`,
    status: "operational",
    lastSeenAt: (/* @__PURE__ */ new Date()).toISOString(),
    jarvisBridge: {
      enabled: true,
      webhookConfigured: true,
      masterKeyPrefix: "jrv_mp_",
      endpoints: {
        ping: `${origin}/api/jarvis/ping`,
        schema: `${origin}/api/jarvis/schema`,
        state: `${origin}/api/jarvis/state`,
        action: `${origin}/api/jarvis/action`,
        events: `${origin}/api/jarvis/events`,
        portal: `${origin}/api/dashboard/portal`,
        export: `${origin}/api/dashboard/export`,
        ingest: `${origin}/api/dashboard/ingest`,
        manager: `${origin}/api/dashboard/manager`
      }
    },
    metrics: {
      profileViews: sharedTelemetryState.totalViews,
      totalInteractions: Object.values(sharedTelemetryState.interactions).reduce((a, b) => a + b, 0),
      activeInquiries: sharedInquiries.filter((i) => i.status === "unread" || i.status === "alerted_to_jarvis").length,
      totalExperiences: sharedCvState.experiences.length,
      totalProjects: SHOWCASE_PROJECTS.length,
      totalSkills: sharedCvState.skills.languages.length + sharedCvState.skills.frameworks.length + sharedCvState.skills.cloudAndDevOps.length + sharedCvState.skills.enterpriseAndIT.length,
      cvVersion: sharedCvState.version
    },
    widgets: [
      { id: "telemetry_overview", title: "Visitor Telemetry & Engagement", type: "metric", size: "sm" },
      { id: "jarvis_sentry", title: "Jarvis Autonomous Sentry", type: "feed", size: "md" },
      { id: "recruiter_inbox", title: "Recruiter & Collaboration Inquiries", type: "table", size: "lg" },
      { id: "cv_cache_status", title: "Emeron CV Parsing Engine Status", type: "action_card", size: "sm" }
    ],
    allowableActions: [
      { action: "sync_cv", description: "Trigger Emeron CV sync", params: { force: "boolean" } },
      { action: "update_headline", description: "Update profile headline", params: { headline: "string" } },
      { action: "mark_inquiry_read", description: "Mark inquiry as read", params: { inquiryId: "string" } }
    ]
  };
  recordServerReceipt({
    actionType: "PORTAL_SYNC",
    caller: auth.isValid ? auth.clientId || "Jarvis" : "DashboardManagerProbe",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Dashboard Portal Manifest generated for Jarvis General Dashboard Manager.",
    payload: { manifestVersion: manifest.manifestVersion }
  });
  return sendJson(res, 200, manifest);
}
async function handleExport(req, res, start, auth) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error
    });
  }
  const now = /* @__PURE__ */ new Date();
  const exportPayload = {
    exportVersion: "2.5.0",
    exportId: `exp_${now.getTime()}_${Math.random().toString(16).substring(2, 8)}`,
    exportedAt: now.toISOString(),
    unixTimestamp: now.getTime(),
    app: {
      name: "Mohamed Raaziq Parker Portfolio",
      slug: "myportfolio",
      subdomain: "portfolio.arpcloudsolutions.co.za"
    },
    cvData: sharedCvState,
    projects: SHOWCASE_PROJECTS,
    telemetry: sharedTelemetryState,
    inquiries: sharedInquiries,
    recentReceipts: sharedAuditReceipts.slice(0, 25)
  };
  const sha256Digest = calculateDigest(exportPayload);
  const signature = `sig_${calculateDigest(`${exportPayload.exportId}:${exportPayload.unixTimestamp}:${sha256Digest}`)}`;
  const bundle = {
    ...exportPayload,
    sha256Digest,
    receiptSignature: signature
  };
  const receipt = recordServerReceipt({
    actionType: "PORTAL_SYNC",
    caller: auth.clientId || "JarvisDashboardManager",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Full dashboard snapshot exported for centralized management in Jarvis.",
    payload: { exportId: exportPayload.exportId, digest: sha256Digest }
  });
  return sendJson(res, 200, {
    success: true,
    bundle,
    receiptId: receipt.receiptId
  });
}
async function handleIngest(req, res, start, auth) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error
    });
  }
  if (req.method !== "POST") {
    return sendJson(res, 405, { success: false, error: "Method Not Allowed. Use POST." });
  }
  const body = await parseBody(req);
  const bundle = body.bundle || body;
  if (!bundle || !bundle.cvData && !bundle.profile) {
    return sendJson(res, 400, { success: false, error: "Invalid dashboard bundle payload. Missing cvData." });
  }
  if (bundle.cvData) {
    Object.assign(sharedCvState, bundle.cvData);
  }
  if (bundle.telemetry) {
    Object.assign(sharedTelemetryState, bundle.telemetry);
  }
  if (Array.isArray(bundle.inquiries)) {
    sharedInquiries.splice(0, sharedInquiries.length, ...bundle.inquiries);
  }
  const receipt = recordServerReceipt({
    actionType: "PORTAL_SYNC",
    caller: auth.clientId || "JarvisDashboardManager",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Dashboard state successfully ingested and synchronized from Jarvis Manager.",
    payload: { source: bundle.exportId || "JarvisDirectSync" }
  });
  return sendJson(res, 200, {
    success: true,
    message: "Dashboard state successfully ingested.",
    syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    receiptId: receipt.receiptId
  });
}
async function handleManager(req, res, start, auth) {
  const receipt = recordServerReceipt({
    actionType: "FLEET_PROBE",
    caller: auth.isValid ? auth.clientId || "Jarvis" : "PublicDashboardExplorer",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Ecosystem dashboard manager registry queried."
  });
  return sendJson(res, 200, {
    success: true,
    ecosystemName: "ARP Cloud Solutions & Jarvis Ecosystem Fleet",
    managedNodeCount: ECOSYSTEM_APPS.length,
    apps: ECOSYSTEM_APPS,
    receiptId: receipt.receiptId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function handler(req, res) {
  if (handleCors(req, res)) return;
  const urlObj = new URL(req.url || "", "http://localhost");
  const rawSubpath = Array.isArray(req.query?.slug) ? req.query.slug.join("/") : req.query?.slug || urlObj.pathname.replace(/^\/api\/dashboard\/?/, "");
  const subpath = (rawSubpath || "").split("?")[0].replace(/^\//, "").replace(/\/$/, "");
  const start = performance.now();
  const auth = checkAuth(req);
  const origin = req.headers.host ? `https://${req.headers.host}` : "https://portfolio.arpcloudsolutions.co.za";
  if (!subpath || subpath === "portal") {
    return handlePortal(req, res, start, auth, origin);
  }
  if (subpath === "export") {
    return handleExport(req, res, start, auth);
  }
  if (subpath === "ingest") {
    return handleIngest(req, res, start, auth);
  }
  if (subpath === "manager") {
    return handleManager(req, res, start, auth);
  }
  return sendJson(res, 404, {
    error: `Unknown Dashboard sub-endpoint: "${subpath}"`,
    availableEndpoints: ["portal", "export", "ingest", "manager"]
  });
}
export {
  ECOSYSTEM_APPS,
  handler as default
};
