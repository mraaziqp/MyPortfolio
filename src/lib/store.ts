import { CvSyncPayload, ProjectTelemetry, SyncLog, ContactSubmissionPayload } from '../types';
import { INITIAL_CV_DATA, SHOWCASE_PROJECTS } from '../data/initialData';

const CV_CACHE_STORAGE_KEY = 'mp_portfolio_cv_cache_v3';
const TELEMETRY_STORAGE_KEY = 'mp_portfolio_telemetry_v2';
const SYNC_LOGS_STORAGE_KEY = 'mp_portfolio_sync_logs_v2';
const CONTACTS_STORAGE_KEY = 'mp_portfolio_contacts_v2';

export function getCachedCvData(): CvSyncPayload {
  try {
    const saved = localStorage.getItem(CV_CACHE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Unable to load CV data from localStorage', e);
  }
  return INITIAL_CV_DATA;
}

export function saveCachedCvData(data: CvSyncPayload): void {
  try {
    localStorage.setItem(CV_CACHE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to save CV data to localStorage', e);
  }
}

export function getStoredSyncLogs(): SyncLog[] {
  try {
    const saved = localStorage.getItem(SYNC_LOGS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  
  // Default seeded sync logs
  return [
    {
      id: 'log-seed-1',
      direction: 'INGEST',
      sourceApp: 'Emeron CV Parser',
      endpoint: '/api/sync-cv',
      status: 'SUCCESS',
      recordsProcessed: 14,
      errorMessage: null,
      payloadDigest: 'sha256:e3b0c44298fc1c149afbf4c8',
      syncedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'log-seed-2',
      direction: 'EXPORT',
      sourceApp: 'LifeStack / Analytics',
      endpoint: '/api/telemetry',
      status: 'SUCCESS',
      recordsProcessed: 3,
      errorMessage: null,
      payloadDigest: 'sha256:7f83b1657ff1fc53b92dc181',
      syncedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];
}

export function addSyncLog(log: Omit<SyncLog, 'id' | 'syncedAt'>): SyncLog {
  const newLog: SyncLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    syncedAt: new Date().toISOString(),
  };
  const logs = [newLog, ...getStoredSyncLogs()].slice(0, 30);
  try {
    localStorage.setItem(SYNC_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {}
  return newLog;
}

export interface TelemetryStats {
  views: Record<string, number>;
  interactions: Record<string, number>;
  totalViews: number;
}

export function getTelemetryStats(): TelemetryStats {
  try {
    const saved = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}

  return {
    views: {
      emeron: 342,
      lifestack: 218,
      'hustle-studio': 196,
    },
    interactions: {
      emeron: 84,
      lifestack: 62,
      'hustle-studio': 49,
    },
    totalViews: 756,
  };
}

export function recordProjectInteraction(projectSlug: string, type: 'view' | 'demo_click' | 'repo_click' | 'tech_badge_click'): void {
  const current = getTelemetryStats();
  const currentInteractions = current.interactions[projectSlug] || 0;
  const currentViews = current.views[projectSlug] || 0;

  if (type === 'view') {
    current.views[projectSlug] = currentViews + 1;
    current.totalViews = (current.totalViews || 0) + 1;
  } else {
    current.interactions[projectSlug] = currentInteractions + 1;
  }

  try {
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}
}

export function recordContactSubmission(submission: ContactSubmissionPayload): { success: boolean; id: string } {
  const id = `contact-${Date.now()}`;
  try {
    const list = JSON.parse(localStorage.getItem(CONTACTS_STORAGE_KEY) || '[]');
    list.unshift({
      id,
      ...submission,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
  return { success: true, id };
}

export function getContactSubmissionsCount(): number {
  try {
    const list = JSON.parse(localStorage.getItem(CONTACTS_STORAGE_KEY) || '[]');
    return list.length + 8; // Seeded inquiries count
  } catch (e) {
    return 8;
  }
}
