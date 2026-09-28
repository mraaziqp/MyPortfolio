/**
 * GET  /api/sync-cv — current CV version and checksum.
 * POST /api/sync-cv — push a (partial) CV from Emeron / CV tooling.
 *
 * Accepts either key. The payload is validated as a whole before anything is
 * saved, so a bad push leaves the live CV untouched.
 */
import { authenticate, methodNotAllowed, readJson, requireRole, route, sendJson, sha256 } from './_lib/http';
import { getProfile, recordEvent, saveProfile } from './_lib/store';
import { ValidationError, mergeCvPayload } from './_lib/validate';

export default route(async (req, res) => {
  const startedAt = performance.now();
  const auth = authenticate(req);

  if (!auth.ok) {
    await recordEvent({
      actionType: 'CV_INGEST',
      caller: 'unauthenticated',
      status: 'UNAUTHORIZED',
      statusCode: auth.status || 401,
      startedAt,
      summary: 'Rejected CV sync without a valid key.',
    });
  }
  if (!requireRole(res, auth, ['jarvis_master', 'client_sync'])) return;

  if (req.method === 'GET') {
    const profile = await getProfile();
    return sendJson(res, 200, {
      success: true,
      version: profile.version,
      fullName: profile.fullName,
      lastSyncedAt: profile.rawCvMetadata?.parsedAt ?? null,
      checksum: profile.rawCvMetadata?.checksum ?? null,
      counts: {
        experiences: profile.experiences.length,
        certifications: profile.certifications.length,
        education: profile.education.length,
      },
    });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const body = await readJson(req);
  const current = await getProfile();
  let next;
  try {
    next = mergeCvPayload(current, body);
  } catch (e) {
    if (e instanceof ValidationError) return sendJson(res, 400, { success: false, error: e.message });
    throw e;
  }

  const checksum = `sha256:${sha256({ ...next, rawCvMetadata: undefined, version: undefined })}`;
  if ('version' in body === false) {
    // Bump the patch number so every accepted sync is distinguishable.
    const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(current.version || '');
    next.version = m ? `v${m[1]}.${m[2]}.${Number(m[3]) + 1}` : 'v1.0.0';
  }
  next.rawCvMetadata = {
    parserSource: typeof body.rawCvMetadata?.parserSource === 'string'
      ? body.rawCvMetadata.parserSource.slice(0, 120)
      : auth.clientId || 'api',
    confidenceScore: typeof body.rawCvMetadata?.confidenceScore === 'number' ? body.rawCvMetadata.confidenceScore : undefined,
    parsedAt: new Date().toISOString(),
    checksum,
  };
  await saveProfile(next);

  const receipt = await recordEvent({
    actionType: 'CV_INGEST',
    caller: auth.clientId!,
    status: 'SUCCESS',
    statusCode: 200,
    startedAt,
    summary: `CV synchronised to ${next.version}.`,
    payload: { version: next.version, checksum },
    details: { fields: Object.keys(body).filter((k) => k !== 'rawCvMetadata') },
  });

  return sendJson(res, 200, {
    success: true,
    version: next.version,
    checksum,
    recordsUpdated: {
      experiences: next.experiences.length,
      skills: (Object.values(next.skills) as Array<string[] | undefined>).reduce((n, list) => n + (list?.length || 0), 0),
      certifications: next.certifications.length,
      education: next.education.length,
    },
    receiptId: receipt.receiptId,
    timestamp: receipt.timestamp,
  });
});
