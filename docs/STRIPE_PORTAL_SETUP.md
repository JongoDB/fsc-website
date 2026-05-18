# Stripe Customer Portal Setup — portal.fightingsmartcyber.com

This guide walks through configuring the **Stripe-hosted Customer Portal** to serve from `portal.fightingsmartcyber.com` with FSC branding.

Total time: **~30–45 minutes**, most of it waiting for DNS to propagate.

---

## Outcome

When this is done:

- Customers receive invoice / subscription emails from Stripe with links to `portal.fightingsmartcyber.com/...` instead of `invoice.stripe.com/...` or `billing.stripe.com/...`.
- A single, sharable **login link** lives at `portal.fightingsmartcyber.com/p/login/<id>` — customers enter their email, get a one-time sign-in link, and can manage billing.
- The hosted UI uses FSC's logo, accent color, and brand fonts.
- The FSC main site has a `/client-portal` landing page and header/footer entries pointing customers in.

---

## Prerequisites

- [ ] Stripe account on the **standard pricing plan** or above (custom domain feature requires it).
- [ ] DNS access to `fightingsmartcyber.com` (wherever the apex domain is managed — Cloudflare, Route 53, Namecheap, etc.).
- [ ] Admin access to the Stripe Dashboard.

---

## Step 1 — Add the custom domain in Stripe

1. In the Stripe Dashboard, go to **Settings → Branding → Custom domains** (or **Settings → Custom domains** depending on the dashboard version).
2. Click **Add domain**.
3. Enter `portal.fightingsmartcyber.com`.
4. Stripe will show a **CNAME target** like `hosted-checkout-domains.stripe.com.` — copy it.

## Step 2 — Add the DNS record

1. In your DNS provider, add a **CNAME record**:
   - **Name / Host**: `portal`
   - **Value / Target**: the CNAME target from Step 1 (e.g. `hosted-checkout-domains.stripe.com.`)
   - **TTL**: 3600 (or provider default)
2. If using Cloudflare, set the record to **DNS-only** (gray cloud, *not* proxied) — Stripe needs to terminate TLS itself.
3. Save the record.

## Step 3 — Verify in Stripe

1. Back in the Stripe Dashboard custom-domains screen, click **Verify**.
2. DNS propagation usually takes 1–15 minutes. If it fails initially, wait and retry.
3. Stripe will issue a TLS cert automatically once the CNAME resolves. You'll see a green checkmark when ready.

## Step 4 — Enable the surfaces

Toggle which Stripe-hosted surfaces use the custom domain. **Enable all four**:

- [x] **Checkout** — Stripe Checkout sessions
- [x] **Payment Links** — Shareable payment URLs
- [x] **Invoices** — Hosted invoice pages
- [x] **Customer Portal** — Subscription / billing management

---

## Step 5 — Configure Customer Portal branding

Go to **Settings → Customer portal** in the Stripe Dashboard.

### Branding tab

| Field | Value |
|-------|-------|
| **Business name** | Fighting Smart Cyber |
| **Brand color** (accent) | `#00a8ff` |
| **Brand color (button)** | `#00a8ff` (same, or use `#0066cc` for slightly darker) |
| **Logo** | Upload `public/images/brand/primary.png` (or `white.png` if the portal background is dark) |
| **Icon** | Upload `public/images/brand/favicon-256.png` |
| **Font** | "Inter" if available, otherwise "Helvetica" |
| **Public business URL** | `https://fightingsmartcyber.com` |
| **Support email** | `team@fightingsmartcyber.com` |

> The logo and icon files live in this repo at `public/images/brand/`. Once the main site is deployed, you can also reference them by URL: `https://fightingsmartcyber.com/images/brand/primary.png`

### Features tab

Enable these portal features (check each box):

- [x] **Invoice history** — customers can view + download past invoices
- [x] **Customer information update** — billing address, name, email
- [x] **Tax ID** — collect / update tax IDs
- [x] **Payment methods** — add, remove, set default
- [x] **Subscription cancellation** — set the cancellation policy (recommended: "Cancel immediately" *or* "Cancel at end of period" — your call)
- [x] **Subscription pause** — (optional; only if you want to offer pauses)
- [x] **Subscription update** — let customers swap between configured plans
- [ ] **Promotional codes** — leave off for now unless you actively use them

### Legal links

- **Terms of service URL**: `https://fightingsmartcyber.com/terms` *(create this page when ready; portal will link to it from the footer)*
- **Privacy policy URL**: `https://fightingsmartcyber.com/privacy` *(same)*

---

## Step 6 — Enable the Login link

This is the killer feature that makes the portal usable without you building any auth.

1. Still in **Settings → Customer portal**, find **Login link**.
2. Toggle it **On**.
3. Stripe will generate a public URL that looks like:
   ```
   https://portal.fightingsmartcyber.com/p/login/aBcDeFgHi
   ```
4. Copy that URL.

## Step 7 — Wire the URL into the FSC main site

1. Open `src/data/navigation.ts` in this repo.
2. Replace the placeholder:
   ```ts
   portalLoginUrl: 'https://portal.fightingsmartcyber.com/p/login/REPLACE_ME',
   ```
   with the real URL from Step 6.
3. Commit and push. Vercel will redeploy automatically.

The `/client-portal` page will now show an active **Sign In to Portal** button instead of the "not yet configured" warning.

---

## Step 8 — Test end-to-end

1. **Login flow** — Visit `fightingsmartcyber.com/client-portal`, click **Sign In to Portal**. You should land on the Stripe-hosted login page at `portal.fightingsmartcyber.com`. Enter a test customer's email. Confirm the magic-link email arrives. Click it; verify you land in the branded portal.
2. **Invoice flow** — Create a test invoice in Stripe Dashboard, finalize it, and click the hosted-invoice link from the email. Confirm the URL is `portal.fightingsmartcyber.com/i/...` and the page is branded correctly.
3. **Checkout flow** *(optional)* — Create a Payment Link in Stripe, open it. Confirm the URL is on the custom domain.

---

## Email templates (optional polish)

Stripe-sent emails (invoices, subscription notices, receipts) use Stripe's default templates. To match FSC branding more closely:

1. **Settings → Emails** in Stripe Dashboard.
2. Set the **from name** to "Fighting Smart Cyber".
3. *(If using a custom email-sending domain)* Configure SPF/DKIM for `fightingsmartcyber.com` so Stripe can send as `billing@fightingsmartcyber.com`. Requires extra DNS records — Stripe walks you through it.
4. Upload the FSC logo to the email template branding.

---

## When to graduate beyond Stripe-hosted

The Stripe-hosted portal is great for v1: zero infrastructure, PCI-DSS Level 1 security, fast to deploy. You should consider building a custom portal on `portal.fightingsmartcyber.com` (replacing the Stripe domain mapping) when:

- You need **file sharing** (deliverables, reports, signed contracts).
- You want **engagement-specific dashboards** (e.g. an AI Readiness Assessment progress tracker for ESO).
- You need **non-billing data** behind login (project notes, working documents).
- You want to consolidate multiple SaaS portals (Zoho Books, Docusign, Calendly) into one client-facing surface.

That would be a separate Next.js / Astro-hybrid app with:
- NextAuth or Auth.js for authentication
- Stripe API integration for billing (keep the same backend)
- Custom UI matching FSC branding directly

I'd estimate ~2-3 weeks of focused build for an MVP of that. Not needed today — revisit when you have 2-3 active engagements and an active feature request from a client.

---

## Quick reference

| Thing | Value |
|---|---|
| Subdomain | `portal.fightingsmartcyber.com` |
| DNS record type | CNAME |
| CNAME target | *(provided by Stripe at setup time)* |
| FSC accent color | `#00a8ff` |
| FSC primary brand color | `#0a2540` |
| Logo (light bg) | `public/images/brand/primary.png` |
| Logo (dark bg) | `public/images/brand/white.png` |
| Support email | `team@fightingsmartcyber.com` |
| Source of truth for portal URLs | `src/data/navigation.ts` → `siteConfig` |
