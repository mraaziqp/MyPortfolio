import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
  integer,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * CV Data Cache Table
 * Stores parsed resume, profile, experience, skills, and education records
 * pushed from the external Emeron CV Parsing Platform.
 */
export const cvDataCache = pgTable(
  'cv_data_cache',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    version: varchar('version', { length: 50 }).notNull().default('v1.0.0'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    headline: text('headline').notNull(),
    summary: text('summary').notNull(),
    location: varchar('location', { length: 255 }).notNull().default('Cape Town, South Africa'),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    githubUrl: varchar('github_url', { length: 500 }),
    linkedinUrl: varchar('linkedin_url', { length: 500 }),
    websiteUrl: varchar('website_url', { length: 500 }),
    
    // Structured JSON data received from Emeron CV Parser
    experiences: jsonb('experiences').$type<Array<{
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
      enterpriseDomain?: string; // e.g. "BCX Active Directory & VM Infrastructure"
    }>>().notNull().default(sql`'[]'::jsonb`),

    skills: jsonb('skills').$type<{
      languages: string[];
      frameworks: string[];
      cloudAndDevOps: string[];
      enterpriseAndIT: string[]; // Active Directory, VMware, Hyper-V, Network Ops
      hardwareAndCreative: string[]; // Unity/C#, Coffee brewing, Hardware repair
    }>().notNull().default(sql`'{}'::jsonb`),

    certifications: jsonb('certifications').$type<Array<{
      id: string;
      name: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      credentialId?: string;
      badgeUrl?: string;
    }>>().notNull().default(sql`'[]'::jsonb`),

    education: jsonb('education').$type<Array<{
      id: string;
      degree: string;
      institution: string;
      year: string;
      details?: string;
    }>>().notNull().default(sql`'[]'::jsonb`),

    rawCvMetadata: jsonb('raw_cv_metadata').$type<{
      parserSource: string; // 'Emeron'
      confidenceScore?: number;
      parsedAt: string;
      checksum?: string;
    }>(),

    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    activeIdx: index('cv_data_cache_active_idx').on(table.isActive),
    updatedAtIdx: index('cv_data_cache_updated_at_idx').on(table.updatedAt),
  })
);

/**
 * Project Telemetry Table
 * Records view metrics, live interactions, and engagement telemetry across showcased projects.
 * Available for export back to the external CV Builder / Analytics.
 */
export const projectTelemetry = pgTable(
  'project_telemetry',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectSlug: varchar('project_slug', { length: 100 }).notNull(), // 'emeron', 'lifestack', 'hustle-studio'
    projectName: varchar('project_name', { length: 255 }).notNull(),
    eventType: varchar('event_type', { length: 50 }).notNull().default('view'), // 'view', 'demo_click', 'repo_click', 'tech_badge_click', 'api_ping'
    viewCount: integer('view_count').notNull().default(1),
    referrer: varchar('referrer', { length: 500 }),
    userAgent: text('user_agent'),
    sessionDurationSeconds: integer('session_duration_seconds').default(0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default(sql`'{}'::jsonb`),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    projectSlugIdx: index('project_telemetry_slug_idx').on(table.projectSlug),
    eventTypeIdx: index('project_telemetry_event_type_idx').on(table.eventType),
    recordedAtIdx: index('project_telemetry_recorded_at_idx').on(table.recordedAt),
  })
);

/**
 * Contact Submissions Table
 * Captures visitor inquiries, enterprise recruiters, and collaboration opportunities.
 * Exportable to external CRM / CV Builder telemetry.
 */
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    organization: varchar('organization', { length: 255 }),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    category: varchar('category', { length: 50 }).notNull().default('general'), // 'recruiting', 'consulting', 'enterprise_it', 'ai_dev'
    status: varchar('status', { length: 50 }).notNull().default('unread'), // 'unread', 'read', 'archived', 'replied'
    ipAddressHash: varchar('ip_address_hash', { length: 128 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('contact_submissions_status_idx').on(table.status),
    createdAtIdx: index('contact_submissions_created_at_idx').on(table.createdAt),
  })
);

/**
 * Sync Logs Table
 * Tracks all bi-directional sync operations with the Emeron CV Parser and external clients.
 */
export const syncLogs = pgTable(
  'sync_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    direction: varchar('direction', { length: 20 }).notNull(), // 'INGEST' | 'EXPORT'
    sourceApp: varchar('source_app', { length: 100 }).notNull().default('Emeron'),
    endpoint: varchar('endpoint', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED'
    recordsProcessed: integer('records_processed').default(0),
    errorMessage: text('error_message'),
    payloadDigest: varchar('payload_digest', { length: 128 }),
    syncedAt: timestamp('synced_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('sync_logs_status_idx').on(table.status),
    syncedAtIdx: index('sync_logs_synced_at_idx').on(table.syncedAt),
  })
);

// Type inference definitions for application use
export type CvDataCache = typeof cvDataCache.$inferSelect;
export type NewCvDataCache = typeof cvDataCache.$inferInsert;

export type ProjectTelemetry = typeof projectTelemetry.$inferSelect;
export type NewProjectTelemetry = typeof projectTelemetry.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
