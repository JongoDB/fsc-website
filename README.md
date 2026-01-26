# Fighting Smart Cyber - Production Development

## ⚠️ WORK ON PRODUCTION SERVER

**This is NOT the development environment.**

All development is done directly on the production server:

**Server**: `ssh root@45.79.219.7`
**Directory**: `/root/fighting-smart-cyber/`

## Read claude.md First

Before starting any work, read `claude.md` for complete instructions on:
- Production server environment
- How to edit files
- Service management
- Cloudflare cache management
- Troubleshooting

## This Directory

This local directory contains only:
- `claude.md` - Complete production development guide
- `deployment/` - Deployment documentation and service files
- `README.md` - This file

## Quick Start

```bash
# SSH to production
ssh root@45.79.219.7

# Navigate to site
cd /root/fighting-smart-cyber

# Make changes
nano index.html

# Purge Cloudflare cache after frontend changes
# (See claude.md for instructions)
```

## Deployment Reference

See `deployment/` directory for:
- `DEPLOYMENT.md` - Full deployment guide
- `CHECKLIST.md` - Deployment checklist
- `CACHE-PURGE.md` - Cloudflare cache management
- `PASSWORD.md` - Admin password management
- Service files for systemd

---

**All work happens on production: root@45.79.219.7:/root/fighting-smart-cyber/**
