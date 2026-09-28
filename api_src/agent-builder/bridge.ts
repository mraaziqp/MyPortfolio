/**
 * GET  /api/agent-builder/bridge — status of the relay (public; no secrets).
 * POST /api/agent-builder/bridge — forward an event to Jarvis (Jarvis key).
 *
 * Posting needs the key: an open relay would let anyone push messages into
 * the assistant.
 */
import { authenticate, methodNotAllowed, readJson, requireRole, route, sendJson } from '../_lib/http';
import { jarvisHostForDisplay, sendToJarvis } from '../_lib/notify';
import { recordEvent } from '../_lib/store';
import { ValidationError, str } from '../_lib/validate';

export default route(async (req, res) => {
  const startedAt = performance.now();

  if (req.method === 'GET') {
    return sendJson(res, 200, {
      bridge: 'Agent Builder / IDE → Jarvis relay',
      status: jarvisHostForDisplay() ? 'active' : 'not_configured',
      auth: 'POST requires the Jarvis key (Authorization: Bearer or x-jarvis-key).',
    });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const auth = authenticate(req);
  if (!requireRole(res, auth, ['jarvis_master'])) return;

  const body = await readJson(req);
  let title: string, message: string, sender: string;
  try {
    title = str(body.title, 'title', 200, false) || 'Agent Builder event';
    message = str(body.message, 'message', 10_000, false) || JSON.stringify(body.metadata ?? {});
    sender = str(body.sender, 'sender', 120, false) || 'AgentBuilder';
  } catch (e) {
    if (e instanceof ValidationError) return sendJson(res, 400, { success: false, error: e.message });
    throw e;
  }

  const result = await sendToJarvis({
    type: body.eventType === 'alert' ? 'alert' : 'event',
    sender,
    subject: title,
    body: message,
    details: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
  });
  const status = result.delivered ? 200 : result.skipped ? 503 : 502;
  const receipt = await recordEvent({
    actionType: 'JARVIS_RELAY',
    caller: sender,
    status: result.delivered ? 'SUCCESS' : 'FAILED',
    statusCode: status,
    startedAt,
    summary: `Relayed "${title}" to Jarvis${result.delivered ? '' : ` — ${result.error}`}.`,
    payload: { title },
  });
  return sendJson(res, status, { success: result.delivered, receiptId: receipt.receiptId, error: result.error });
});
