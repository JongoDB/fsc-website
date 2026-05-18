// Vercel serverless function for the contact and bundle-request forms.
//
// Sends a notification email to team@fightingsmartcyber.com via Resend.
// No database persistence — submissions live in the recipient's inbox.
//
// Required env var (set in Vercel → Settings → Environment Variables):
//   - RESEND_API_KEY            Resend API key. The function returns 503
//                               with a clear message until this is set.
//
// Optional env vars (sane defaults applied):
//   - CONTACT_TO_EMAIL          Where notifications go. Default: team@…
//   - CONTACT_FROM_EMAIL        From: address. Must be on a Resend-verified
//                               domain. Default: forms@fightingsmartcyber.com.

const DEFAULT_TO = 'team@fightingsmartcyber.com';
const DEFAULT_FROM = 'FSC Forms <forms@fightingsmartcyber.com>';

const isEmail = (s) =>
  typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Read the request body explicitly — Vercel's auto-parse has been
// unreliable here, so we just consume the raw stream and parse JSON.
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {};
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderEmailHtml(body, isBundle) {
  const rows = (entries) =>
    entries
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(
        ([label, v]) =>
          '<tr>' +
            '<td style="padding:8px 14px;background:#f6f8fa;color:#57606a;font-weight:600;width:170px;vertical-align:top;border-bottom:1px solid #d0d7de;">' +
            escapeHtml(label) +
            '</td>' +
            '<td style="padding:8px 14px;color:#24292f;border-bottom:1px solid #d0d7de;white-space:pre-wrap;">' +
            escapeHtml(v) +
            '</td>' +
          '</tr>'
      )
      .join('');

  const fields = isBundle
    ? [
        ['Name', body.name],
        ['Email', body.email],
        ['Organization', body.organization],
        ['Role', body.role],
        ['Timeframe', body.timeframe],
        ['Use Case', body.useCase],
        ['Environment', body.environment],
        ['Requirements', body.requirements],
      ]
    : [
        ['Name', body.name],
        ['Email', body.email],
        ['Organization', body.organization],
        ['Role', body.role],
        ['Org Type', body.orgType],
        ['Interest', body.interest],
        ['Timeframe', body.timeframe],
        ['Message', body.message],
      ];

  const title = isBundle
    ? 'New bundle request from ' + escapeHtml(body.name)
    : 'New contact form submission from ' + escapeHtml(body.name);

  return (
    '<!doctype html><html><body style="margin:0;padding:24px;background:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#24292f;">' +
      '<table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #d0d7de;overflow:hidden;">' +
        '<tr><td style="padding:20px 24px;background:#0a2540;color:#ffffff;">' +
          '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#00d4ff;margin-bottom:6px;">Fighting Smart Cyber</div>' +
          '<h1 style="margin:0;font-size:20px;font-weight:700;">' + title + '</h1>' +
        '</td></tr>' +
        '<tr><td>' +
          '<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">' +
            rows(fields) +
          '</table>' +
        '</td></tr>' +
        '<tr><td style="padding:14px 24px;background:#f6f8fa;color:#57606a;font-size:12px;">' +
          'Sent automatically from <a href="https://fightingsmartcyber.com" style="color:#0066cc;text-decoration:none;">fightingsmartcyber.com</a>. ' +
          'Reply directly to this email to respond to the submitter.' +
        '</td></tr>' +
      '</table>' +
    '</body></html>'
  );
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (parseErr) {
      console.error('JSON parse error', parseErr);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (!body || typeof body !== 'object') body = {};

    if (!body.name || !isEmail(body.email) || !body.organization) {
      return res
        .status(400)
        .json({ error: 'Missing required fields (name, email, organization)' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(503).json({
        error: 'Email service not configured. Please set RESEND_API_KEY.',
      });
    }

    const isBundle = body.formType === 'bundle-request';
    const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
    const subject = isBundle
      ? 'New bundle request from ' + body.name
      : 'New contact form submission from ' + body.name;

    let emailRes;
    try {
      emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: body.email,
          subject,
          html: renderEmailHtml(body, isBundle),
        }),
      });
    } catch (netErr) {
      const cause = netErr && netErr.cause ? String(netErr.cause) : null;
      console.error('Resend network error', netErr, 'cause:', cause);
      return res
        .status(502)
        .json({ error: 'Network error reaching Resend', message: netErr && netErr.message, cause });
    }

    if (!emailRes.ok) {
      const detail = await emailRes.text().catch(() => '');
      console.error('Resend rejected send', emailRes.status, detail);
      return res
        .status(502)
        .json({ error: 'Resend rejected the message', resend_status: emailRes.status, detail });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    const cause = err && err.cause ? String(err.cause) : null;
    console.error('Unhandled error in /api/submit', err && err.stack ? err.stack : err, 'cause:', cause);
    return res.status(500).json({
      error: 'Internal error',
      message: err && err.message ? err.message : String(err),
      cause,
    });
  }
}
