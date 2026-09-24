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
  version: "v2.4.1",
  fullName: "Mohammed Parker",
  headline: "Senior Full-Stack Developer & Enterprise IT Systems Specialist",
  summary: "Solutions engineer and infrastructure specialist bridging mission-critical enterprise IT operations (BCX, VMware, Active Directory) with resilient full-stack web applications. Track record of maintaining 99.98% virtualization uptime, leading cloud migrations, and architecting automated, real-time data synchronization systems.",
  location: "Cape Town, South Africa",
  email: "mohammed.parker.dev@gmail.com",
  phone: "+27 (0) 21 000 0000",
  githubUrl: "https://github.com/mohammedparker",
  linkedinUrl: "https://linkedin.com/in/mohammedparker",
  websiteUrl: "https://mohammedparker.dev",
  experiences: [
    {
      id: "exp-1",
      role: "IT Operations Administrator & Infrastructure Engineer",
      company: "BCX (Business Connexion)",
      location: "Cape Town, South Africa",
      startDate: "2022",
      endDate: null,
      isCurrent: true,
      summary: "Overseeing mission-critical enterprise server virtualization, domain security, and high-availability systems across hybrid corporate environments.",
      keyAchievements: [
        "Maintained 99.98% infrastructure availability across 150+ enterprise virtual machines (VMware ESXi & Microsoft Hyper-V).",
        "Implemented enterprise-wide Active Directory security policies, automated provisioning workflows, and RBAC governance.",
        "Established proactive disaster recovery and automated failover pipelines minimizing business disruption.",
        "Delivered continuous system health observability with enterprise incident escalation protocols."
      ],
      technologies: ["Active Directory", "VMware ESXi", "Hyper-V", "Windows Server Enterprise", "Ubuntu Server", "PowerShell Automation", "Enterprise Networking"],
      enterpriseDomain: "Enterprise Infrastructure, Virtualization & Directory Services"
    },
    {
      id: "exp-2",
      role: "Full-Stack Software Engineer & Solutions Architect",
      company: "Independent / Product Engineering",
      location: "Cape Town, South Africa",
      startDate: "2021",
      endDate: null,
      isCurrent: true,
      summary: "Designing and deploying robust, business-critical web platforms, secure API integrations, and automated data pipelines using Next.js, TypeScript, and modern database architectures.",
      keyAchievements: [
        "Architected Emeron: enterprise CV data extraction platform featuring secure real-time webhook synchronization and schema validation.",
        "Engineered LifeStack: executive workflow assistant optimizing task scheduling through intelligent contextual analysis.",
        "Developed Hustle Studio: end-to-end operational platform centralizing billing, contract lifecycle, and resource utilization."
      ],
      technologies: ["Next.js (App Router)", "TypeScript", "React", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "API Integration", "Cloud Architecture"],
      enterpriseDomain: "Full-Stack Enterprise Applications & Automated Pipelines"
    },
    {
      id: "exp-3",
      role: "Systems Administrator & Cloud Solutions Specialist",
      company: "Technology Infrastructure Solutions",
      location: "Western Cape, South Africa",
      startDate: "2019",
      endDate: "2022",
      isCurrent: false,
      summary: "Managed cloud migrations, multi-tier network security, automated backup operations, and precision hardware diagnostics for enterprise clients.",
      keyAchievements: [
        "Earned AWS Certified Cloud Practitioner credential and successfully migrated on-premises infrastructure to AWS VPC and EC2 environments.",
        "Enforced least-privilege IAM security frameworks and automated snapshot schedules for data protection compliance.",
        "Conducted component-level hardware diagnostics and board-level repairs on critical server appliances."
      ],
      technologies: ["AWS (EC2, S3, IAM, VPC, Route53)", "Docker", "Bash Automation", "Hardware Diagnostics", "Electronics & Diagnostics"],
      enterpriseDomain: "Cloud Migration & Infrastructure Reliability"
    }
  ],
  skills: {
    languages: ["TypeScript", "JavaScript (ESNext)", "Python", "C# (Unity)", "SQL", "Bash / Shell", "PowerShell"],
    frameworks: ["Next.js (App Router)", "React", "Node.js", "Express", "Tailwind CSS", "Drizzle ORM", "Prisma"],
    cloudAndDevOps: ["AWS Certified Cloud Practitioner", "Docker", "Serverless PostgreSQL", "CI/CD Pipelines", "Linux (Ubuntu/Debian)", "Cloud Architecture"],
    enterpriseAndIT: ["BCX Enterprise Infrastructure", "Active Directory & GPOs", "VMware ESXi", "Microsoft Hyper-V", "Windows Server Enterprise", "DNS / DHCP / VLANs", "Disaster Recovery & Redundancy"],
    hardwareAndCreative: ["Unity Engine & C# Systems", "Artisanal Coffee Extraction & Profiling", "Artisan Chocolate Confectionery", "SMD Electronics & Hardware Diagnostics"]
  },
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "2023",
      expiryDate: "2026",
      credentialId: "AWS-CCP-984210",
      badgeUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
    },
    {
      id: "cert-2",
      name: "Enterprise Active Directory & Server Administration",
      issuer: "Microsoft Certified Professional Standards",
      issueDate: "2022",
      credentialId: "MS-AD-ADMIN-772"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Information Technology & Systems Engineering",
      institution: "Cape Town Institute of Technology",
      year: "2019 - 2021",
      details: "Comprehensive focus on Enterprise Infrastructure, Cloud Architectures, Distributed Systems, and Modern Software Engineering."
    }
  ],
  rawCvMetadata: {
    parserSource: "Emeron CV Intelligence Engine v2.4",
    confidenceScore: 0.985,
    parsedAt: (/* @__PURE__ */ new Date()).toISOString(),
    checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
};
var SHOWCASE_PROJECTS = [
  {
    id: "proj-emeron",
    slug: "emeron",
    title: "Emeron",
    tagline: "Automated Resume Intelligence & Live Data Synchronization Platform",
    description: "Solves the friction of candidate data entry by parsing unstructured CV documents into standardized, structured records. Connects directly to enterprise recruitment systems and live portfolios via secure real-time webhooks, eliminating manual data handling.",
    role: "Lead Architect & Full-Stack Developer",
    category: "Enterprise Intelligence",
    featured: true,
    syncSource: true,
    technologies: ["Next.js App Router", "TypeScript", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "Secure Webhooks", "RESTful APIs"],
    metrics: [
      { label: "Data Extraction", value: "98.5% Accuracy" },
      { label: "Sync Latency", value: "<140ms" },
      { label: "Fields Processed", value: "35+ Entities" }
    ],
    liveUrl: "#sync-inspector",
    githubUrl: "https://github.com/mohammedparker/emeron-cv-parser"
  },
  {
    id: "proj-lifestack",
    slug: "lifestack",
    title: "LifeStack",
    tagline: "Executive Productivity & Intelligent Workflow Optimization",
    description: "Designed to reduce cognitive overhead for professionals by combining dynamic calendar scheduling with contextual task prioritization. Evaluates incoming deliverables and optimizes work sessions to maximize high-impact outcomes.",
    role: "Full-Stack Creator & Solutions Engineer",
    category: "Productivity Systems",
    featured: true,
    technologies: ["React", "Next.js", "Intelligent Context Engine", "TypeScript", "Tailwind CSS", "Vector Storage"],
    metrics: [
      { label: "Efficiency Gain", value: "15+ Hrs/Month" },
      { label: "Response Time", value: "Sub-second" },
      { label: "Workflow Model", value: "Automated" }
    ],
    liveUrl: "https://lifestack.app",
    githubUrl: "https://github.com/mohammedparker/lifestack-ai"
  },
  {
    id: "proj-hustle-studio",
    slug: "hustle-studio",
    title: "Hustle Studio",
    tagline: "Unified Business Operations & Financial Management Platform",
    description: "A comprehensive operational workspace consolidating enterprise contract lifecycles, team resource scheduling, client invoicing, and real-time financial reporting into a clear executive dashboard.",
    role: "Full-Stack Architect",
    category: "Enterprise SaaS",
    featured: true,
    technologies: ["Next.js", "PostgreSQL", "Drizzle ORM", "Server Actions", "Tailwind CSS", "Role-Based Access (RBAC)"],
    metrics: [
      { label: "Architecture", value: "High Availability" },
      { label: "Access Control", value: "Enterprise RBAC" },
      { label: "Reporting", value: "Real-Time Insights" }
    ],
    liveUrl: "https://hustlestudio.co",
    githubUrl: "https://github.com/mohammedparker/hustle-studio"
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
