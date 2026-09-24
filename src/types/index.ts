export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  summary: string;
  keyAchievements: string[];
  technologies: string[];
  enterpriseDomain?: string;
}

export interface SkillCategoryMap {
  languages: string[];
  frameworks: string[];
  cloudAndDevOps: string[];
  enterpriseAndIT: string[];
  hardwareAndCreative: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  badgeUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface CvSyncPayload {
  version: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  experiences: ExperienceItem[];
  skills: SkillCategoryMap;
  certifications: CertificationItem[];
  education: EducationItem[];
  rawCvMetadata?: {
    parserSource: string;
    confidenceScore?: number;
    parsedAt: string;
    checksum?: string;
  };
}

export interface ProjectShowcaseItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  category: 'Enterprise Intelligence' | 'Productivity Systems' | 'Enterprise SaaS' | 'AI Platform' | 'Enterprise Cloud' | 'Workflow Suite' | 'Systems & Games';
  featured: boolean;
  technologies: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  liveUrl?: string;
  githubUrl?: string;
  syncSource?: boolean; // Indicates if this is the Emeron platform connected via API
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
  category?: 'recruiting' | 'consulting' | 'enterprise_it' | 'ai_dev' | 'general';
}

export interface TelemetryExportResponse {
  totalViews: number;
  projects: {
    projectSlug: string;
    projectName: string;
    views: number;
    interactions: number;
    lastActive: string;
  }[];
  recentInquiriesCount: number;
  lastSyncedAt: string;
}

export interface SyncLog {
  id: string;
  direction: 'INGEST' | 'EXPORT';
  sourceApp: string;
  endpoint: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
  recordsProcessed: number | null;
  errorMessage?: string | null;
  payloadDigest?: string | null;
  syncedAt: string;
}

export interface AuditReceipt {
  receiptId: string;
  timestamp: string; // ISO 8601
  unixTimestamp: number;
  actionType: 'CV_INGEST' | 'JARVIS_ACTION' | 'CONTACT_INQUIRY' | 'TELEMETRY_EXPORT' | 'PORTAL_SYNC' | 'FLEET_PROBE' | 'CONFIG_UPDATE';
  caller: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
  statusCode: number;
  latencyMs: number;
  payloadDigest: string; // sha256:...
  receiptSignature: string;
  summary: string;
  details?: Record<string, any>;
}

export interface EcosystemAppNode {
  id: string;
  name: string;
  slug: string;
  category: 'ai_core' | 'saas_platform' | 'productivity' | 'consumer';
  status: 'operational' | 'degraded' | 'offline' | 'checking';
  localUrl?: string;
  productionUrl: string;
  healthEndpoint?: string;
  latencyMs?: number;
  lastChecked?: string;
  description: string;
  portalEmbedUrl?: string;
  capabilities: string[];
}

export interface DashboardPortalManifest {
  manifestVersion: string;
  appName: string;
  appSlug: string;
  primaryDomain: string;
  subdomainUrl: string;
  embedPortalUrl: string;
  status: 'operational' | 'degraded' | 'offline';
  lastSeenAt: string;
  jarvisBridge: {
    enabled: boolean;
    webhookConfigured: boolean;
    masterKeyPrefix: string;
    endpoints: {
      ping: string;
      schema: string;
      state: string;
      action: string;
      events: string;
      portal: string;
      export: string;
      ingest: string;
      manager: string;
    };
  };
  metrics: {
    profileViews: number;
    totalInteractions: number;
    activeInquiries: number;
    totalExperiences: number;
    totalProjects: number;
    totalSkills: number;
    cvVersion: string;
  };
  widgets: {
    id: string;
    title: string;
    type: 'metric' | 'table' | 'feed' | 'action_card';
    size: 'sm' | 'md' | 'lg' | 'full';
  }[];
  allowableActions: {
    action: string;
    description: string;
    params: Record<string, string>;
  }[];
}

export interface DashboardExportBundle {
  exportId: string;
  exportedAt: string;
  unixTimestamp: number;
  cvData: CvSyncPayload;
  telemetry: TelemetryExportResponse;
  receipts: AuditReceipt[];
  manifest: DashboardPortalManifest;
  receiptSignature: string;
  sha256Digest: string;
}

export interface ProjectTelemetry {
  id: string;
  projectSlug: string;
  projectName: string;
  eventType: string;
  viewCount: number;
  referrer?: string | null;
  userAgent?: string | null;
  sessionDurationSeconds?: number | null;
  metadata?: Record<string, any> | null;
  recordedAt: string;
}

