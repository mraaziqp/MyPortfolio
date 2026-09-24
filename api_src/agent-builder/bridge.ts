import {
  handleCors,
  sendJson,
  parseBody,
  checkAuth,
  recordServerReceipt,
  dispatchToJarvisWebhook,
} from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const start = performance.now();
  const auth = checkAuth(req);

  if (req.method === 'GET') {
    // Health / connectivity check for IDE and PC Agent Builder
    return sendJson(res, 200, {
      bridge: 'Jarvis & Agent Builder PC/IDE Gateway Bridge',
      status: 'active',
      jarvisLocalTarget: 'http://localhost:3005',
      jarvisRemoteTarget: 'https://jarvis.savestate.co.za',
      supportedClients: ['AgentBuilder-PC', 'Antigravity-IDE', 'Cursor', 'Claude-Desktop'],
      activeKey: 'jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a',
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const body = await parseBody(req);
  const { eventType, sender, title, message, metadata } = body;

  const dispatchResult = await dispatchToJarvisWebhook({
    sender: sender || 'AgentBuilder/IDE-Bridge',
    subject: title || 'Agent Builder Pipeline Event',
    body: message || JSON.stringify(metadata || {}),
    details: metadata || {},
    type: eventType || 'event',
  });

  const receipt = recordServerReceipt({
    actionType: 'JARVIS_ACTION',
    caller: sender || 'AgentBuilder-PC',
    status: dispatchResult.success ? 'SUCCESS' : 'FAILED',
    statusCode: dispatchResult.success ? 200 : 502,
    latencyMs: performance.now() - start,
    summary: `Relayed event from ${sender || 'Agent Builder'} to Jarvis assistant engine.`,
    payload: { title, message, dispatchResult },
  });

  return sendJson(res, dispatchResult.success ? 200 : 502, {
    success: dispatchResult.success,
    receiptId: receipt.receiptId,
    jarvisResponse: dispatchResult.response,
    error: dispatchResult.error,
  });
}
