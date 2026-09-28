#!/usr/bin/env node
/**
 * Jarvis & Agent Builder PC / Antigravity IDE Integration Bridge
 * Connects the PC developer environment, Agent Builder, and IDE directly to Jarvis Assistant.
 *
 * Usage:
 *   node scripts/jarvis-ide-bridge.js ping
 *   node scripts/jarvis-ide-bridge.js notify "Build Complete" "Vercel deployment finished successfully"
 */

// The webhook key is a secret: read it from the environment, never commit it.
//   JARVIS_WEBHOOK_KEY=jb_live_sk_...  (required)
//   JARVIS_LOCAL_URL / JARVIS_PUBLIC_URL (optional base URLs)
const key = process.env.JARVIS_WEBHOOK_KEY;
if (!key) {
  console.error('Set JARVIS_WEBHOOK_KEY (and optionally JARVIS_PUBLIC_URL) before running this script.');
  process.exit(1);
}
const JARVIS_CONFIG = {
  localWebhookUrl: `${process.env.JARVIS_LOCAL_URL || 'http://localhost:3005'}/api/assistant/webhook/${key}`,
  remoteWebhookUrl: process.env.JARVIS_PUBLIC_URL
    ? `${process.env.JARVIS_PUBLIC_URL.replace(/\/$/, '')}/api/assistant/webhook/${key}`
    : null,
  userId: process.env.JARVIS_USER_ID,
  sender: 'AgentBuilder-PC/Antigravity-IDE',
};

async function dispatchWebhook(subject, body, details = {}) {
  const payload = {
    type: 'event',
    channelType: 'webhook',
    userId: JARVIS_CONFIG.userId,
    sender: JARVIS_CONFIG.sender,
    subject,
    body: typeof body === 'string' ? body : JSON.stringify(body),
    details,
    timestamp: new Date().toISOString(),
  };

  const targets = [JARVIS_CONFIG.localWebhookUrl, JARVIS_CONFIG.remoteWebhookUrl].filter(Boolean);

  for (const targetUrl of targets) {
    try {
      console.log(`📡 Probing Jarvis Gateway: ${targetUrl}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok) {
        console.log('✅ Jarvis Response:', data);
        return data;
      } else {
        console.warn(`⚠️ Target responded with status ${res.status}:`, data);
      }
    } catch (e) {
      console.warn(`⚠️ Target unreachable (${targetUrl}): ${e.message}`);
    }
  }

  throw new Error('All Jarvis webhook targets unreachable.');
}

async function main() {
  const [,, cmd, arg1, arg2] = process.argv;

  switch (cmd) {
    case 'ping': {
      console.log('⚡ Running Jarvis Ping Probe from PC / IDE...');
      await dispatchWebhook('PC / IDE Ping Probe', 'Verifying bi-directional connectivity between IDE and Jarvis.');
      console.log('🎉 Connectivity verified successfully.');
      break;
    }
    case 'notify': {
      const subject = arg1 || 'IDE / Agent Builder Notification';
      const body = arg2 || 'Autonomous task checkpoint reached.';
      console.log(`📤 Sending alert to Jarvis: "${subject}"...`);
      await dispatchWebhook(subject, body, { caller: 'cli-bridge' });
      console.log('🎉 Notification delivered to Jarvis Assistant.');
      break;
    }
    default: {
      console.log(`
Jarvis PC & IDE Connector Bridge
Commands:
  node scripts/jarvis-ide-bridge.js ping
  node scripts/jarvis-ide-bridge.js notify <title> <message>
      `);
    }
  }
}

main().catch((err) => {
  console.error('❌ Bridge execution error:', err.message);
  process.exit(1);
});
