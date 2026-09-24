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

// api_src/_utils.ts
import { createHash } from "crypto";
var sharedCvState = { ...INITIAL_CV_DATA };
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
async function dispatchToJarvisWebhook(params) {
  const webhookKey = "jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a";
  const userId = "a009e210-f221-4de4-9428-dae96d68a39e";
  const urls = [
    `http://localhost:3005/api/assistant/webhook/${webhookKey}`,
    `https://jarvis.savestate.co.za/api/assistant/webhook/${webhookKey}`
  ];
  const payload = {
    type: params.type || "event",
    channelType: "webhook",
    userId,
    sender: params.sender || "MyPortfolio",
    subject: params.subject,
    body: typeof params.body === "string" ? params.body : JSON.stringify(params.body),
    details: params.details || {},
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  let lastError = "";
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        return { success: true, response: json };
      }
    } catch (e) {
      lastError = e?.message || "Connection failed";
    }
  }
  return { success: false, error: lastError };
}

// api_src/agent-builder/bridge.ts
async function handler(req, res) {
  if (handleCors(req, res)) return;
  const start = performance.now();
  const auth = checkAuth(req);
  if (req.method === "GET") {
    return sendJson(res, 200, {
      bridge: "Jarvis & Agent Builder PC/IDE Gateway Bridge",
      status: "active",
      jarvisLocalTarget: "http://localhost:3005",
      jarvisRemoteTarget: "https://jarvis.savestate.co.za",
      supportedClients: ["AgentBuilder-PC", "Antigravity-IDE", "Cursor", "Claude-Desktop"],
      activeKey: "jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a"
    });
  }
  if (req.method !== "POST") {
    return sendJson(res, 405, { success: false, error: "Method Not Allowed" });
  }
  const body = await parseBody(req);
  const { eventType, sender, title, message, metadata } = body;
  const dispatchResult = await dispatchToJarvisWebhook({
    sender: sender || "AgentBuilder/IDE-Bridge",
    subject: title || "Agent Builder Pipeline Event",
    body: message || JSON.stringify(metadata || {}),
    details: metadata || {},
    type: eventType || "event"
  });
  const receipt = recordServerReceipt({
    actionType: "JARVIS_ACTION",
    caller: sender || "AgentBuilder-PC",
    status: dispatchResult.success ? "SUCCESS" : "FAILED",
    statusCode: dispatchResult.success ? 200 : 502,
    latencyMs: performance.now() - start,
    summary: `Relayed event from ${sender || "Agent Builder"} to Jarvis assistant engine.`,
    payload: { title, message, dispatchResult }
  });
  return sendJson(res, dispatchResult.success ? 200 : 502, {
    success: dispatchResult.success,
    receiptId: receipt.receiptId,
    jarvisResponse: dispatchResult.response,
    error: dispatchResult.error
  });
}
export {
  handler as default
};
