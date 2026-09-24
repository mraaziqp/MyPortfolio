#!/usr/bin/env node
/**
 * Jarvis & Agent Builder PC / Antigravity IDE Integration Bridge
 * Connects the PC developer environment, Agent Builder, and IDE directly to Jarvis Assistant.
 *
 * Usage:
 *   node scripts/jarvis-ide-bridge.js ping
 *   node scripts/jarvis-ide-bridge.js notify "Build Complete" "Vercel deployment finished successfully"
 */

const JARVIS_CONFIG = {
  localWebhookUrl: 'http://localhost:3005/api/assistant/webhook/jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a',
  remoteWebhookUrl: 'https://jarvis.savestate.co.za/api/assistant/webhook/jb_live_sk_bc8030782491116677c88743d165331284bc6aacad03100a',
  userId: 'a009e210-f221-4de4-9428-dae96d68a39e',
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

  const targets = [JARVIS_CONFIG.localWebhookUrl, JARVIS_CONFIG.remoteWebhookUrl];

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
