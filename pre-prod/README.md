# Fighting Smart Cyber - Pre-Production Environment

## Overview

This directory contains the **pre-production** versions of pages being improved through the UI/UX review process. Test changes locally before deploying to the live production server.

---

## Directory Structure

```
pre-prod/
├── index.html              # Homepage (IMPROVED - Ready for Review)
├── css/
│   └── main.css           # Main stylesheet (IMPROVED)
├── js/
│   ├── navigation.js      # Navigation functionality
│   ├── animations.js      # Scroll animations
│   ├── cyber-effects.js   # Particle effects
│   └── tooltips.js        # Tooltip system (NEW)
├── about/                 # About pages (pending)
├── solutions/             # Solutions pages (pending)
├── training/              # Training pages (pending)
├── platforms/             # Platforms pages (pending)
├── bundles/               # Bundles pages (pending)
└── resources/             # Resources pages (pending)
```

---

## How to Test Locally

### 1. Start Python HTTP Server

From this directory (`pre-prod/`):

```bash
cd /home/jon-dev/web-dev/fighting-smart-cyber/pre-prod
python3 -m http.server 8000
```

### 2. Access the Site

Open your browser to:
- **Homepage**: http://localhost:8000/
- **Desktop Testing**: Use your browser normally
- **Mobile Testing**:
  - Chrome DevTools: `F12` → Toggle Device Toolbar (`Ctrl+Shift+M`)
  - Test on actual device: Use your machine's local IP address

### 3. Test Checklist

#### Homepage (`index.html`)
- [ ] SVG icons display in mission cards
- [ ] Hover over acronyms (DOTMLPF-P, DCO, SIEM) shows tooltips
- [ ] Hero stats display in grid (4 across desktop, 2x2 mobile)
- [ ] Mission card buttons have proper styling and touch targets
- [ ] Leadership cards animate on hover
- [ ] Hamburger menu icon animates to X when clicked
- [ ] Trust badges have dark theme with hover effects
- [ ] Mobile: All touch targets are 48px minimum
- [ ] Mobile: Stats wrap to 2x2 grid properly
- [ ] Mobile: Hero padding is appropriate
- [ ] Accessibility: ARIA attributes present (inspect with DevTools)
- [ ] Reduced motion: Disable in OS settings and verify animations stop

---

## Workflow

### Phase 1: Build & Test Locally
1. Claude creates improved page in `pre-prod/`
2. You test using Python HTTP server
3. Iterate until you approve

### Phase 2: Deploy to Production
1. You approve the page: "approved, move to next page"
2. Claude deploys from `pre-prod/` to production server
3. You purge Cloudflare cache
4. Verify on live site

### Phase 3: Move to Next Page
1. Claude marks current page as ✅ Complete in `UI-UX-REVIEW-PROCESS.md`
2. Claude starts work on next page
3. Repeat workflow

---

## Current Status

### ✅ Completed (Local Only)
- **Homepage** (`/`) - All 18 UI/UX improvements implemented
  - Visual Design: SVG icons, eliminated inline styles, hero background, redesigned trust badges
  - Content: Tooltips for acronyms, tightened copy
  - Navigation: ARIA accessibility
  - Mobile: 48px touch targets, responsive grids, optimized padding
  - Technical: Reduced motion support, alt text

### ⏸️ Pending Production Approval
- Homepage - Awaiting your review and approval

### 🔄 In Queue
1. About - Who We Are
2. About - Leadership
3. Solutions - Overview
... (see `deployment/UI-UX-REVIEW-PROCESS.md` for full list)

---

## Production Server

**DO NOT EDIT DIRECTLY**

Production server location:
- **Host**: root@45.79.219.7
- **Path**: /root/fighting-smart-cyber/
- **Domain**: https://fightingsmartcyber.com

All changes go through pre-prod approval first.

---

## Rollback Plan

If issues are found after production deployment:
1. Backups are automatically created before each deployment
2. Located at: `/root/fighting-smart-cyber/backup-homepage-YYYYMMDD-HHMMSS.tar.gz`
3. Restore with: `tar -xzf backup-*.tar.gz`

---

## Files Modified (Homepage)

| File | Status | Size | Changes |
|------|--------|------|---------|
| `index.html` | ✅ Improved | 24KB | SVG icons, ARIA attributes, tooltips, cleaner HTML |
| `css/main.css` | ✅ Improved | 41KB | +10KB new classes for stats, cards, badges, tooltips |
| `js/tooltips.js` | ✅ New File | 2.3KB | Tooltip functionality for acronyms |
| `js/navigation.js` | No change | - | Copied from production |
| `js/animations.js` | No change | - | Copied from production |
| `js/cyber-effects.js` | No change | - | Copied from production |

---

## Quick Commands

```bash
# Start local server
cd /home/jon-dev/web-dev/fighting-smart-cyber/pre-prod
python3 -m http.server 8000

# Find your local IP (for mobile testing)
hostname -I | awk '{print $1}'

# View in browser
xdg-open http://localhost:8000  # Linux
open http://localhost:8000      # Mac
```

---

## Notes

- **Cache**: Browser may cache CSS/JS. Hard refresh with `Ctrl+Shift+R`
- **Mobile Testing**: Test on real devices when possible
- **Accessibility**: Use screen reader to test ARIA improvements
- **Performance**: Check DevTools Network tab for load times

---

**Last Updated**: 2026-01-01
**Current Page**: Homepage (Pre-Prod)
**Next Page**: About - Who We Are (Pending)
