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

