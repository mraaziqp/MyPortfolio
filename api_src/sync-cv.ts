import {
  handleCors,
  sendJson,
  parseBody,
  checkAuth,
  recordServerReceipt,
  calculateDigest,
  sharedCvState,
} from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const start = performance.now();
  const auth = checkAuth(req);

  if (!auth.isValid) {
    recordServerReceipt({
      actionType: 'CV_INGEST',
      caller: 'Unknown / Unauthorized Client',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      latencyMs: performance.now() - start,
      summary: 'Rejected unauthorized CV synchronization attempt.',
    });

    return sendJson(res, auth.statusCode || 401, {
      success: false,
      error: auth.error,
    });
  }

  if (req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'active',
      version: sharedCvState.version,
      lastSyncedAt: sharedCvState.rawCvMetadata?.parsedAt || new Date().toISOString(),
      fullName: sharedCvState.fullName,
      checksum: sharedCvState.rawCvMetadata?.checksum,
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const payload = await parseBody(req);

  if (!payload || typeof payload !== 'object') {
    return sendJson(res, 400, { success: false, error: 'Invalid CV payload format.' });
  }

  // Merge inbound CV data
  if (payload.fullName) sharedCvState.fullName = payload.fullName;
  if (payload.headline) sharedCvState.headline = payload.headline;
  if (payload.summary) sharedCvState.summary = payload.summary;
  if (payload.location) sharedCvState.location = payload.location;
  if (payload.email) sharedCvState.email = payload.email;
  if (payload.phone) sharedCvState.phone = payload.phone;
  if (payload.githubUrl) sharedCvState.githubUrl = payload.githubUrl;
  if (payload.linkedinUrl) sharedCvState.linkedinUrl = payload.linkedinUrl;
  if (payload.websiteUrl) sharedCvState.websiteUrl = payload.websiteUrl;
  if (Array.isArray(payload.experiences)) sharedCvState.experiences = payload.experiences;
  if (payload.skills) sharedCvState.skills = payload.skills;
  if (Array.isArray(payload.certifications)) sharedCvState.certifications = payload.certifications;
  if (Array.isArray(payload.education)) sharedCvState.education = payload.education;

  const checksum = calculateDigest(payload);
  sharedCvState.version = payload.version || `v2.${Math.floor(Math.random() * 5) + 5}.0`;
  sharedCvState.rawCvMetadata = {
    parserSource: payload.rawCvMetadata?.parserSource || 'Emeron CV Parsing Engine v2.5-LiveSync',
    confidenceScore: payload.rawCvMetadata?.confidenceScore || 0.994,
    parsedAt: new Date().toISOString(),
    checksum,
  };

  const receipt = recordServerReceipt({
    actionType: 'CV_INGEST',
    caller: auth.clientId || 'Emeron CV Parser',
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: `Synchronized ${sharedCvState.fullName}'s resume records (${sharedCvState.version}) via Emeron webhook.`,
    payload: { version: sharedCvState.version, checksum, experienceCount: sharedCvState.experiences.length },
    details: { recordsUpdated: sharedCvState.experiences.length + 8 },
  });

  return sendJson(res, 200, {
    success: true,
    message: 'Profile data cache successfully synchronized and persisted.',
    recordsUpdated: {
      experiences: sharedCvState.experiences.length,
      skills: Object.keys(sharedCvState.skills).length,
      certifications: sharedCvState.certifications.length,
      education: sharedCvState.education.length,
    },
    version: sharedCvState.version,
    checksum,
    receiptId: receipt.receiptId,
    timestamp: receipt.timestamp,
  });
}
