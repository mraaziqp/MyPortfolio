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
