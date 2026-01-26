# Cloudflare Rate Limiting Setup Guide

## Overview

This guide walks you through setting up rate limiting rules in Cloudflare to protect your admin panel from brute force attacks. This adds an extra security layer **before** requests even reach your server.

## Why Rate Limiting?

- **Blocks rapid login attempts** before they hit fail2ban
- **Reduces server load** from automated attacks
- **Cloudflare-level protection** - attackers never reach your server
- **Free on all Cloudflare plans**

## Current Protection Stack

With rate limiting added, you'll have:

1. **Cloudflare Rate Limiting** ← NEW! (blocks rapid requests)
2. **Nginx HTTP Basic Auth** (username/password)
3. **fail2ban** (IP banning after failed attempts)

---

## Step-by-Step Setup

### 1. Log into Cloudflare

1. Go to https://dash.cloudflare.com
2. Log in with your Cloudflare account
3. Select your domain: **fightingsmartcyber.com**

### 2. Navigate to WAF

1. In the left sidebar, click **Security**
2. Click **WAF** (Web Application Firewall)
3. Click the **Rate limiting rules** tab

### 3. Create Admin Panel Rate Limiting Rule

Click **Create rule** and configure:

#### Rule Configuration

**Rule name:**
```
Admin Panel - Rate Limit
```

**If incoming requests match:**

Click **Edit expression** and add:

```
(http.request.uri.path eq "/admin/submissions.html") or (http.request.uri.path eq "/api/submissions")
```

**OR use the visual builder:**
- Field: `URI Path`
- Operator: `equals`
- Value: `/admin/submissions.html`
- Click **Or**
- Field: `URI Path`
- Operator: `equals`
- Value: `/api/submissions`

**Then:**
- Choose: **Rate limit**

**Requests:**
- Enter: `10`

**Period:**
- Select: `1 minute` (60 seconds)

**With the same characteristics:**
- Select: `IP`

**Mitigation action:**
- Select: **Block**

**Mitigation timeout:**
- Enter: `600` (10 minutes)

**Response:**
- Select: **Default Cloudflare rate limiting page**
- OR select **Custom response**:
  - Status code: `429`
  - Content-Type: `text/plain`
  - Body: `Too many login attempts. Please try again in 10 minutes.`

### 4. Deploy the Rule

1. Review your configuration
2. Click **Deploy**
3. Wait 30-60 seconds for propagation

---

## Testing Rate Limiting

### Test 1: Normal Access (Should Work)

```bash
curl -u admin:FightingSmart@2026!Admin https://fightingsmartcyber.com/api/submissions
```

### Test 2: Rapid Requests (Should Get Blocked)

```bash
# Should be blocked after 10th request
for i in {1..15}; do
  echo "Request $i:"
  curl -u admin:FightingSmart@2026!Admin https://fightingsmartcyber.com/api/submissions
done
```

---

## Monitoring & Troubleshooting

### View Blocked Requests

1. Cloudflare Dashboard → **Security** → **Events**
2. Filter by Service: Rate limiting, Action: Block

### If You Get Blocked

**Wait 10 minutes** - Block auto-expires

Or **whitelist your IP:**
- Security → WAF → Tools → IP Access Rules
- Add your IP with Action: Allow

---

## Recommended Settings

**Balanced (Current):**
- 10 requests per minute
- 10 minute timeout

**High Security:**
- 5 requests per minute
- 30 minute timeout

**More Forgiving:**
- 20 requests per minute
- 5 minute timeout

---

## Summary

**What this protects:**
- `/admin/submissions.html` (admin panel)
- `/api/submissions` (submissions API)

**Protection:**
- Max 10 requests per minute per IP
- Blocks for 10 minutes when exceeded
- Works with HTTP Basic Auth and fail2ban

**Your admin panel now has 3 layers of security! 🔒**

---

## Quick Commands

**View rate limiting events:**
```
Cloudflare Dashboard → Security → Events
```

**Unblock an IP:**
```
Security → WAF → Tools → IP Access Rules → Add IP with Allow action
```

**Test it:**
```bash
for i in {1..15}; do curl https://fightingsmartcyber.com/admin/submissions.html; done
```
