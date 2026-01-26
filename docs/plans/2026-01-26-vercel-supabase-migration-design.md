# Vercel + Supabase Migration Design

**Date:** 2026-01-26
**Status:** Approved

## Overview

Migrate Fighting Smart Cyber website from VPS deployment (Python servers + JSON storage + Nginx + Cloudflare Tunnel) to Vercel hosting with Supabase backend.

## Goals

- Simplify deployment: push to GitHub, Vercel auto-deploys
- Replace JSON file storage with Supabase PostgreSQL
- Remove pre-prod/prod differentiation (single production environment)
- Eliminate server maintenance overhead

## Architecture

### Current State
```
VPS Server
├── Nginx (reverse proxy, HTTP Basic Auth)
├── Cloudflare Tunnel (SSL)
├── Python form_server.py (port 8080)
├── Python submissions_api.py (port 8081)
└── JSON file storage
```

### Target State
```
GitHub (main branch)
    ↓ auto-deploy
Vercel (static hosting)
    ↓ API calls
Supabase (PostgreSQL + Auth)
```

## Database Schema

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null
);

-- Enable Row Level Security
alter table submissions enable row level security;

-- Anyone can submit contact form
create policy "Public can insert" on submissions
  for insert with check (true);

-- Only authenticated users can view submissions
create policy "Authenticated can read" on submissions
  for select using (auth.role() = 'authenticated');

-- Only authenticated users can delete submissions
create policy "Authenticated can delete" on submissions
  for delete using (auth.role() = 'authenticated');
```

## Authentication

- Supabase Auth with email/password
- Single admin user created manually in Supabase console
- No public sign-up functionality
- Admin page shows login form when unauthenticated

## Frontend Changes

### New Files
- `js/supabase-client.js` - Supabase client initialization and helpers

### Modified Files
- `contact.html` - Form submits to Supabase instead of `/api/submit_form`
- `admin/submissions.html` - Login UI, fetch/delete via Supabase client

### Dependencies
- Supabase JS client via CDN: `@supabase/supabase-js@2`

## Files to Delete

- `api/form_server.py`
- `api/submissions_api.py`
- `api/storage/` (entire directory)
- `api/submissions.log`
- `deployment/` (entire directory)

## Vercel Configuration

`vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

## Implementation Steps

1. Create Supabase project and database table
2. Configure RLS policies
3. Create admin user in Supabase Auth
4. Add `js/supabase-client.js` with Supabase initialization
5. Update `contact.html` form submission logic
6. Update `admin/submissions.html` with auth and Supabase queries
7. Add `vercel.json` configuration
8. Delete Python backend and deployment docs
9. Connect GitHub repo to Vercel
10. Configure custom domain (optional)

## Security

- Supabase anon key is safe to expose (RLS protects data)
- Admin access requires Supabase Auth login
- Supabase provides built-in rate limiting
- HTTPS enforced by Vercel

## Rollback Plan

If issues arise, the VPS deployment can remain active until migration is verified. DNS can be switched back to Cloudflare Tunnel pointing to VPS.
