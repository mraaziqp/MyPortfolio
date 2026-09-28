/**
 * POST /api/contact — public contact form.
 * GET  /api/contact — inquiry inbox (Jarvis key only).
 *
 * A message counts as received only once it is stored or emailed. The Jarvis
 * alert is a bonus on top, never the only copy.
 */
import { env } from './_lib/env';
import { authenticate, clientIp, methodNotAllowed, readJson, requireRole, route, sendJson, sha256 } from './_lib/http';
import { sendOwnerEmail, sendToJarvis } from './_lib/notify';
import {
  countRecentInquiries,
  getProfile,
  insertInquiry,
  listInquiries,
  markInquiryDelivery,
  recordEvent,
  storageMode,
} from './_lib/store';
import { EMAIL_RE, ValidationError, str } from './_lib/validate';

const CATEGORIES = ['recruiting', 'engineering', 'infrastructure', 'consulting', 'general'] as const;
const MAX_PER_HOUR = 5;

export default route(async (req, res) => {
  const startedAt = performance.now();

  if (req.method === 'GET') {
    const auth = authenticate(req);
    if (!requireRole(res, auth, ['jarvis_master'])) return;
    const inquiries = await listInquiries(100);
    return sendJson(res, 200, { success: true, total: inquiries.length, inquiries });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const body = await readJson(req);

  // Honeypot: a field real visitors never see. Pretend success so bots move on.
  if (typeof body.website === 'string' && body.website.trim()) {
    return sendJson(res, 200, { success: true, inquiryId: 'inq_ok' });
  }

  let name: string, email: string, organization: string | undefined, subject: string, message: string;
  try {
    name = str(body.name, 'Name', 120)!;
    email = str(body.email, 'Email', 200)!;
    if (!EMAIL_RE.test(email)) throw new ValidationError('Please enter a valid email address.');
    organization = str(body.organization, 'Company', 160, false);
    message = str(body.message, 'Message', 5000)!;
    if (message.length < 10) throw new ValidationError('Message is a little short — add a few more details.');
    subject = str(body.subject, 'Subject', 200, false) || `Portfolio enquiry from ${name}`;
  } catch (e) {
    if (e instanceof ValidationError) return sendJson(res, 400, { success: false, error: e.message });
    throw e;
  }
  const category = (CATEGORIES as readonly string[]).includes(body.category) ? body.category : 'general';

  const ipHash = sha256(`portfolio-contact:${clientIp(req)}`);
  if ((await countRecentInquiries(ipHash, 60)) >= MAX_PER_HOUR) {
    return sendJson(res, 429, {
      success: false,
      error: 'Too many messages from this connection. Please email directly instead.',
    });
  }

  const persisted = storageMode() === 'postgres';
  const inquiry = await insertInquiry({ name, email, organization: organization || null, subject, message, category }, ipHash);

  const profile = await getProfile();
  const fields: Array<[string, string]> = [
    ['From', `${name} <${email}>`],
    ['Company', organization || '—'],
    ['Reason', category],
    ['Received', new Date(inquiry.createdAt).toUTCString()],
  ];
  const [emailResult, jarvisResult] = await Promise.all([
    sendOwnerEmail({
      to: env.notifyEmail || profile.email,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      fields,
      message,
    }),
    sendToJarvis({
      type: 'alert',
      sender: `Portfolio contact: ${name}`,
      subject: `Portfolio enquiry: ${subject}`,
      body: `${fields.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
      details: { inquiryId: inquiry.id, name, email, organization, category },
    }),
  ]);

  const received = persisted || emailResult.delivered;
  const receipt = await recordEvent({
    actionType: 'CONTACT_INQUIRY',
    caller: 'public-contact-form',
    status: received ? 'SUCCESS' : 'FAILED',
    statusCode: received ? 200 : 503,
    startedAt,
    summary: `Contact enquiry (${category})${organization ? ` from ${organization}` : ''}.`,
    payload: { id: inquiry.id, category },
    details: {
      stored: persisted,
      email: emailResult.delivered ? 'sent' : emailResult.error,
      jarvis: jarvisResult.delivered ? 'sent' : jarvisResult.error,
    },
  });
  await markInquiryDelivery(inquiry.id, {
    emailDelivered: emailResult.delivered,
    jarvisDelivered: jarvisResult.delivered,
    receiptId: receipt.receiptId,
  });

  if (!emailResult.delivered) console.warn('[contact] email not delivered:', emailResult.error);
  if (!received) {
    return sendJson(res, 503, {
      success: false,
      error: `The message could not be delivered right now. Please email ${profile.email} directly.`,
    });
  }
  return sendJson(res, 200, { success: true, inquiryId: inquiry.id });
});
