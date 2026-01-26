# Cloudflare Cache Purge Instructions

## Why You Need This

After deploying updates to your production site, **Cloudflare caches the old version** of your files. Visitors (including you) will see the old site until the cache is purged.

## Symptoms of Cached Content

- ✅ Files updated on server
- ✅ Direct server access shows new content
- ❌ Browser shows old version
- ❌ Animations/effects not working
- ❌ CSS changes not visible

## How to Purge Cloudflare Cache

### Option 1: Purge Everything (Recommended after deployment)

1. **Log into Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Select your domain**: fightingsmartcyber.com
3. **Navigate to**: Caching → Configuration
4. **Click**: "Purge Everything"
5. **Confirm** the purge
6. **Wait**: 30 seconds for propagation
7. **Hard refresh** your browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Option 2: Purge Specific Files

If you only want to purge specific files:

1. Go to Caching → Configuration → Custom Purge
2. Enter URLs to purge:
   ```
   https://fightingsmartcyber.com/js/animations.js
   https://fightingsmartcyber.com/js/cyber-effects.js
   https://fightingsmartcyber.com/css/main.css
   https://fightingsmartcyber.com/index.html
   ```
3. Click "Purge"

### Option 3: Using Cloudflare API (Advanced)

```bash
# Set your credentials
ZONE_ID="your-zone-id"
API_TOKEN="your-api-token"

# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer ${API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

## Verification Checklist

After purging cache:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check homepage loads with animations
- [ ] Verify particle effects on hero section
- [ ] Check CSS styling matches dev site
- [ ] Test on incognito/private window
- [ ] Test on mobile device

## Prevention: Development Rules

To avoid caching during development:

1. In Cloudflare Dashboard → Page Rules
2. Create rule: `*fightingsmartcyber.com/*`
3. Setting: "Cache Level" → "Bypass"
4. **Only enable during development, disable for production!**

## Current Deployment Status

**Last Update**: $(date)
**Files Synced**: ✅ All frontend files
**Permissions Fixed**: ✅ All files readable
**Services Restarted**: ✅ APIs running

**File Checksums** (Production):
- animations.js: 721ade0665c7d9d8fb3f412377a20510
- cyber-effects.js: 0aa839b8cb05aec79bbc5cb64e0ea7a7
- main.css: 86da7294129d6eae422d47d7dcca88a1
- index.html: 0497cec66532a2d4814c9640e4bac5fd

These match dev environment exactly ✅

## Quick Test

Test if files are updated:

```bash
# Check animations.js version
curl -s "https://fightingsmartcyber.com/js/animations.js?nocache=$(date +%s)" | head -1

# Should return:
# // Advanced Animations and Effects for Fighting Smart Cyber
```

## Browser Hard Refresh

- **Chrome/Firefox/Edge** (Windows/Linux): Ctrl + Shift + R
- **Chrome/Firefox/Edge** (Mac): Cmd + Shift + R
- **Safari** (Mac): Cmd + Option + R
- **Mobile**: Clear browser cache in settings
