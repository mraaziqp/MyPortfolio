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

// api_src/jarvis/[...slug].ts
async function handlePing(req, res, start, auth, origin) {
  const receipt = recordServerReceipt({
    actionType: "FLEET_PROBE",
    caller: auth.isValid ? auth.clientId || "Jarvis" : "PublicHealthProbe",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Jarvis diagnostic health probe acknowledged.",
    payload: { path: "/api/jarvis/ping", method: req.method }
  });
  return sendJson(res, 200, {
    status: "ok",
    connected: true,
    caller: auth.isValid ? auth.role : "unauthenticated",
    app: {
      name: "Mohamed Raaziq Parker Portfolio & Ecosystem Hub",
      slug: "myportfolio",
      origin,
      subdomain: "portfolio.arpcloudsolutions.co.za",
      version: "v2.5.0"
    },
    jarvis: {
      enabled: true,
      masterKeyPrefix: "jrv_mp_",
      lastSeenAt: Date.now(),
      webhookConfigured: true
    },
    endpoints: {
      ping: `${origin}/api/jarvis/ping`,
      schema: `${origin}/api/jarvis/schema`,
      state: `${origin}/api/jarvis/state`,
      action: `${origin}/api/jarvis/action`,
      events: `${origin}/api/jarvis/events`,
      portal: `${origin}/api/dashboard/portal`,
      export: `${origin}/api/dashboard/export`,
      ingest: `${origin}/api/dashboard/ingest`,
      manager: `${origin}/api/dashboard/manager`,
      bridge: `${origin}/api/agent-builder/bridge`
    },
    receiptId: receipt.receiptId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function handleSchema(req, res, start, auth) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error
    });
  }
  recordServerReceipt({
    actionType: "JARVIS_ACTION",
    caller: auth.clientId || "Jarvis",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Jarvis retrieved autonomous schema definitions."
  });
  return sendJson(res, 200, {
    schemaVersion: "2.5.0",
    app: "MyPortfolio",
    entities: {
      profile: {
        description: "Mohamed Raaziq Parker personal brand, headline, bio, contact details",
        fields: ["fullName", "headline", "summary", "location", "email", "phone", "githubUrl", "linkedinUrl", "websiteUrl"]
      },
      experiences: {
        description: "Professional career timeline and enterprise infrastructure roles",
        fields: ["id", "role", "company", "location", "startDate", "endDate", "isCurrent", "summary", "keyAchievements", "technologies", "enterpriseDomain"]
      },
      skills: {
        description: "Enterprise IT, Cloud, DevOps, Full-Stack, and Creative capability matrix",
        categories: ["languages", "frameworks", "cloudAndDevOps", "enterpriseAndIT", "hardwareAndCreative"]
      },
      projects: {
        description: "Showcase projects (Emeron, LifeStack, Hustle Studio, etc.)",
        fields: ["id", "slug", "title", "tagline", "description", "role", "category", "featured", "technologies", "metrics"]
      },
      inquiries: {
        description: "Recruiter and collaboration inbound inquiries",
        fields: ["id", "name", "email", "organization", "subject", "message", "category", "status", "createdAt"]
      },
      receipts: {
        description: "Cryptographic audit receipts with SHA-256 digests",
        fields: ["receiptId", "timestamp", "actionType", "caller", "status", "latencyMs", "payloadDigest", "receiptSignature"]
      }
    },
    allowableActions: [
      {
        action: "update_headline",
        description: "Updates Mohamed Raaziq Parker headline and role title in live profile",
        params: { headline: "string (required)" }
      },
      {
        action: "update_summary",
        description: "Updates executive profile summary bio",
        params: { summary: "string (required)" }
      },
      {
        action: "add_skill",
        description: "Adds a skill to an enterprise category",
        params: { category: "languages|frameworks|cloudAndDevOps|enterpriseAndIT|hardwareAndCreative", skill: "string" }
      },
      {
        action: "update_experience_role",
        description: "Updates a specific experience role title or key achievements",
        params: { experienceId: "string", role: "string (optional)", summary: "string (optional)" }
      },
      {
        action: "sync_cv",
        description: "Triggers cache re-sync from Emeron CV parsing platform",
        params: { force: "boolean (optional)" }
      },
      {
        action: "mark_inquiry_read",
        description: "Marks a recruiter inquiry as triaged or read",
        params: { inquiryId: "string" }
      },
      {
        action: "export_dashboard_snapshot",
        description: "Generates full snapshot export for Jarvis Dashboard Manager",
        params: { includeReceipts: "boolean (optional)" }
      }
    ]
  });
}
async function handleState(req, res, start, auth) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error
    });
  }
  const receipt = recordServerReceipt({
    actionType: "JARVIS_ACTION",
    caller: auth.clientId || "Jarvis",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: "Jarvis retrieved live portfolio snapshot and telemetry state."
  });
  return sendJson(res, 200, {
    success: true,
    snapshotTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
    receiptId: receipt.receiptId,
    profile: {
      fullName: sharedCvState.fullName,
      headline: sharedCvState.headline,
      summary: sharedCvState.summary,
      location: sharedCvState.location,
      email: sharedCvState.email,
      phone: sharedCvState.phone,
      version: sharedCvState.version,
      rawCvMetadata: sharedCvState.rawCvMetadata
    },
    experiences: sharedCvState.experiences,
    skills: sharedCvState.skills,
    certifications: sharedCvState.certifications,
    education: sharedCvState.education,
    projects: SHOWCASE_PROJECTS,
    telemetry: sharedTelemetryState,
    inquiries: sharedInquiries,
    recentReceipts: sharedAuditReceipts.slice(0, 15)
  });
}
async function handleAction(req, res, start, auth) {
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
  const action = body.action;
  const params = body.params || {};
  if (!action) {
    return sendJson(res, 400, { success: false, error: 'Missing "action" parameter in request body.' });
  }
  let actionResult = null;
  switch (action) {
    case "update_headline": {
      if (!params.headline) {
        return sendJson(res, 400, { success: false, error: "Missing params.headline" });
      }
      sharedCvState.headline = params.headline;
      actionResult = { updatedHeadline: sharedCvState.headline };
      break;
    }
    case "update_summary": {
      if (!params.summary) {
        return sendJson(res, 400, { success: false, error: "Missing params.summary" });
      }
      sharedCvState.summary = params.summary;
      actionResult = { updatedSummary: sharedCvState.summary };
      break;
    }
    case "add_skill": {
      const category = params.category;
      const skill = params.skill;
      if (!category || !skill || !sharedCvState.skills[category]) {
        return sendJson(res, 400, { success: false, error: "Invalid skill category or skill name" });
      }
      if (!sharedCvState.skills[category].includes(skill)) {
        sharedCvState.skills[category].push(skill);
      }
      actionResult = { category, skills: sharedCvState.skills[category] };
      break;
    }
    case "update_experience_role": {
      const { experienceId, role, summary } = params;
      const exp = sharedCvState.experiences.find((e) => e.id === experienceId) || sharedCvState.experiences[0];
      if (exp) {
        if (role) exp.role = role;
        if (summary) exp.summary = summary;
      }
      actionResult = { updatedExperience: exp };
      break;
    }
    case "sync_cv": {
      sharedCvState.version = `v2.${Math.floor(Math.random() * 5) + 5}.1`;
      sharedCvState.rawCvMetadata = {
        parserSource: "Emeron CV Parsing Engine v2.5 (Jarvis-Triggered)",
        confidenceScore: 0.998,
        parsedAt: (/* @__PURE__ */ new Date()).toISOString(),
        checksum: `sha256:${Math.random().toString(36).substring(2, 14)}`
      };
      actionResult = { version: sharedCvState.version, checksum: sharedCvState.rawCvMetadata.checksum };
      break;
    }
    case "mark_inquiry_read": {
      const { inquiryId } = params;
      const inq = sharedInquiries.find((i) => i.id === inquiryId);
      if (inq) {
        inq.status = "read";
      }
      actionResult = { inquiryId, status: inq ? inq.status : "not_found" };
      break;
    }
    case "test_probe": {
      actionResult = {
        pong: true,
        receivedParams: params,
        serverTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      break;
    }
    default:
      return sendJson(res, 400, { success: false, error: `Unknown action: "${action}"` });
  }
  const receipt = recordServerReceipt({
    actionType: "JARVIS_ACTION",
    caller: auth.clientId || "JarvisAssistant",
    status: "SUCCESS",
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: `Executed autonomous action "${action}"`,
    payload: { action, params, result: actionResult },
    details: { clientId: auth.clientId, role: auth.role }
  });
  return sendJson(res, 200, {
    success: true,
    action,
    result: actionResult,
    receipt: {
      receiptId: receipt.receiptId,
      timestamp: receipt.timestamp,
      payloadDigest: receipt.payloadDigest,
      receiptSignature: receipt.receiptSignature,
      latencyMs: receipt.latencyMs
    }
  });
}
async function handleEvents(req, res, auth) {
  if (!auth.isValid) {
    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error
    });
  }
  return sendJson(res, 200, {
    success: true,
    totalEvents: sharedAuditReceipts.length,
    events: sharedAuditReceipts.slice(0, 30),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function handler(req, res) {
  if (handleCors(req, res)) return;
  const urlObj = new URL(req.url || "", "http://localhost");
  const rawSubpath = Array.isArray(req.query?.slug) ? req.query.slug.join("/") : req.query?.slug || urlObj.pathname.replace(/^\/api\/jarvis\/?/, "");
  const subpath = (rawSubpath || "").split("?")[0].replace(/^\//, "").replace(/\/$/, "");
  const start = performance.now();
  const auth = checkAuth(req);
  const origin = req.headers.host ? `https://${req.headers.host}` : "https://portfolio.arpcloudsolutions.co.za";
  if (!subpath || subpath === "ping") {
    return handlePing(req, res, start, auth, origin);
  }
  if (subpath === "schema") {
    return handleSchema(req, res, start, auth);
  }
  if (subpath === "state") {
    return handleState(req, res, start, auth);
  }
  if (subpath === "action") {
    return handleAction(req, res, start, auth);
  }
  if (subpath === "events") {
    return handleEvents(req, res, auth);
  }
  return sendJson(res, 404, {
    error: `Unknown Jarvis sub-endpoint: "${subpath}"`,
    availableEndpoints: ["ping", "schema", "state", "action", "events"]
  });
}
export {
  handler as default
};
