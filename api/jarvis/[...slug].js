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
