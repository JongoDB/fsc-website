// Vercel serverless function for the contact and bundle-request forms.
//
// Responsibilities:
//   1. Insert the submission into Supabase (preserves existing admin view)
//   2. Send a notification email to team@fightingsmartcyber.com via Resend
//
// Required env vars (set in Vercel project → Settings → Environment Variables):
//   - RESEND_API_KEY            Resend API key. If missing, email step is
//                               skipped and only the Supabase insert happens
//                               (the form does not break — graceful degrade).
//   - SUPABASE_URL              Optional. Defaults to the existing project URL.
//   - SUPABASE_ANON_KEY         Optional. Defaults to the existing anon key.
//
// Optional env vars (sane defaults applied):
//   - CONTACT_TO_EMAIL          Where notifications go. Default: team@…
//   - CONTACT_FROM_EMAIL        From: address. Must be on a Resend-verified
//                               domain. Default: forms@fightingsmartcyber.com.

const DEFAULT_SUPABASE_URL = 'https://voplzrnyqmolehjwuijr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGx6cm55cW1vbGVoand1aWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTE0MTUsImV4cCI6MjA4NTAyNzQxNX0.JbsiQajhIJxRY1aoGylcc2wrdtQPd7_gOpI3lEBTd8s';
const DEFAULT_TO = 'team@fightingsmartcyber.com';
const DEFAULT_FROM = 'FSC Forms <forms@fightingsmartcyber.com>';

const isEmail = (s) =>
  typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Read the request body explicitly. Vercel's auto-parsing has bitten us in
// the past, so we just consume the raw stream and parse JSON ourselves.
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

function buildRecord(body) {
  const isBundle = body.formType === 'bundle-request';
  const base = {
    form_type: isBundle ? 'bundle-request' : 'contact',
    name: body.name,
    email: body.email,
    organization: body.organization,
    role: body.role || null,
  };
  if (isBundle) {
    return {
      ...base,
      interest: 'Custom Bundle Request',
      timeframe: body.timeframe || null,
      use_case: body.useCase || null,
      environment: body.environment || null,
      requirements: body.requirements || null,
    };
  }
  return {
    ...base,
    org_type: body.orgType,
    interest: body.interest,
    timeframe: body.timeframe,
    message: body.message,
  };
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderEmailHtml(record) {
  const isBundle = record.form_type === 'bundle-request';

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
        ['Name', record.name],
        ['Email', record.email],
        ['Organization', record.organization],
        ['Role', record.role],
        ['Timeframe', record.timeframe],
        ['Use Case', record.use_case],
        ['Environment', record.environment],
        ['Requirements', record.requirements],
      ]
    : [
        ['Name', record.name],
        ['Email', record.email],
        ['Organization', record.organization],
        ['Role', record.role],
        ['Org Type', record.org_type],
        ['Interest', record.interest],
        ['Timeframe', record.timeframe],
        ['Message', record.message],
      ];

  const title = isBundle
    ? 'New bundle request from ' + escapeHtml(record.name)
    : 'New contact form submission from ' + escapeHtml(record.name);

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
      return res.status(400).json({ error: 'Missing required fields (name, email, organization)' });
    }

    const record = buildRecord(body);
    const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

    // 1. Persist to Supabase.
    let supabaseRes;
    try {
      supabaseRes = await fetch(supabaseUrl + '/rest/v1/submissions', {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: 'Bearer ' + supabaseKey,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(record),
      });
    } catch (netErr) {
      const cause = netErr && netErr.cause ? String(netErr.cause) : null;
      console.error('Supabase network error', netErr, 'cause:', cause);
      return res.status(502).json({
        error: 'Network error reaching Supabase',
        phase: 'supabase_fetch',
        url_host: new URL(supabaseUrl).host,
        message: netErr && netErr.message,
        cause,
      });
    }

    if (!supabaseRes.ok) {
      const detail = await supabaseRes.text().catch(() => '');
      console.error('Supabase insert failed', supabaseRes.status, detail);
      return res.status(500).json({
        error: 'Supabase rejected insert',
        phase: 'supabase_response',
        supabase_status: supabaseRes.status,
        detail,
      });
    }

    // 2. Send email via Resend (graceful skip if not configured).
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn('RESEND_API_KEY not set — skipping email notification');
      return res.status(200).json({ success: true, emailed: false, reason: 'no_resend_key' });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
    const subject =
      record.form_type === 'bundle-request'
        ? 'New bundle request from ' + record.name
        : 'New contact form submission from ' + record.name;

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
          reply_to: record.email,
          subject,
          html: renderEmailHtml(record),
        }),
      });
    } catch (netErr) {
      console.error('Resend network error', netErr);
      return res
        .status(200)
        .json({ success: true, emailed: false, reason: 'resend_network_error', message: netErr && netErr.message });
    }

    if (!emailRes.ok) {
      const detail = await emailRes.text().catch(() => '');
      console.error('Resend send failed', emailRes.status, detail);
      return res.status(200).json({ success: true, emailed: false, resend_status: emailRes.status, detail });
    }

    return res.status(200).json({ success: true, emailed: true });
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
