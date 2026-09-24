import {
  handleCors,
  sendJson,
  parseBody,
  recordServerReceipt,
  dispatchToJarvisWebhook,
  sharedInquiries,
} from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const start = performance.now();

  if (req.method === 'GET') {
    return sendJson(res, 200, {
      totalInquiries: sharedInquiries.length,
      inquiries: sharedInquiries,
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const body = await parseBody(req);
  const { name, email, organization, subject, message, category } = body;

  if (!name || !email || !message) {
    return sendJson(res, 400, {
      success: false,
      error: 'Missing required fields: name, email, message.',
    });
  }

  const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const inquiryRecord: {
    id: string;
    name: string;
    email: string;
    organization: string;
    subject: string;
    message: string;
    category: string;
    status: 'alerted_to_jarvis';
    createdAt: string;
    receiptId?: string;
  } = {
    id,
    name,
    email,
    organization: organization || 'Independent',
    subject: subject || 'Portfolio Inbound Opportunity',
    message,
    category: category || 'general',
    status: 'alerted_to_jarvis',
    createdAt: new Date().toISOString(),
  };

  sharedInquiries.unshift(inquiryRecord);

  // Generate immutable audit receipt
  const receipt = recordServerReceipt({
    actionType: 'CONTACT_INQUIRY',
    caller: `PublicVisitor (${name} <${email}>)`,
    status: 'SUCCESS',
    statusCode: 200,
    latencyMs: performance.now() - start,
    summary: `Contact inquiry received from ${name} (${organization || 'Individual'}). Dispatched alert to Jarvis.`,
    payload: { name, email, organization, subject, category },
  });

  inquiryRecord.receiptId = receipt.receiptId;

  // Dispatch high-priority alert to Jarvis Assistant Webhook
  const jarvisNotification = await dispatchToJarvisWebhook({
    sender: `PortfolioContact:${name}`,
    subject: `🚨 [Portfolio Inquiry] ${subject || 'New Contact Request'} from ${name}`,
    body: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\nCategory: ${category}\n\nMessage:\n${message}\n\nReceipt: ${receipt.receiptId}`,
    details: {
      inquiryId: id,
      name,
      email,
      organization,
      category,
      receiptId: receipt.receiptId,
    },
    type: 'alert',
  });

  return sendJson(res, 200, {
    success: true,
    message: 'Your inquiry has been received and escalated to Mohamed Raaziq Parker & Jarvis Assistant.',
    inquiryId: id,
    receiptId: receipt.receiptId,
    timestamp: receipt.timestamp,
    jarvisAlertDispatched: jarvisNotification.success,
  });
}
