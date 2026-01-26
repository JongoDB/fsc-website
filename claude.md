# Fighting Smart Cyber - Production Development Environment

## ⚠️ IMPORTANT: Work on Production Server

**DO NOT work on local files in `/home/jon-dev/web-dev/fighting-smart-cyber/`**

**ALWAYS work directly on the production server:**
- **Server**: `root@45.79.219.7`
- **Site Directory**: `/root/fighting-smart-cyber/`
- **SSH Access**: SSH key already configured, no password needed

## Production Environment Overview

### Server Details
- **Host**: 45.79.219.7
- **User**: root
- **OS**: Ubuntu with systemd
- **Web Server**: Nginx 1.24.0
- **Python**: 3.x (for API services)

### Site Structure

```
/root/fighting-smart-cyber/
├── index.html                 # Homepage with animations
├── contact.html              # Contact form
├── css/
│   └── main.css              # All styles including animations
├── js/
│   ├── animations.js         # Particle system & animations
│   ├── cyber-effects.js      # Cyber/futuristic effects
│   ├── navigation.js         # Navigation functionality
│   └── header.js             # Header generation
├── about/
│   ├── who-we-are.html
│   └── leadership.html
├── solutions/
│   ├── index.html
│   ├── consulting.html
│   ├── training.html
│   └── advisory.html
├── training/
│   ├── index.html
│   ├── custom-training.html
│   ├── cyber-kill-chain.html
│   ├── incident-response.html
│   ├── kubernetes-security.html
│   └── threat-hunting.html
├── platforms/
│   ├── index.html
│   ├── soc-in-a-box.html
│   └── secure-kubernetes.html
├── bundles/
│   ├── index.html
│   ├── devsecops-bundle.html
│   ├── dfir-bundle.html
│   ├── productivity-suite.html
│   ├── request-bundle.html
│   └── soc-stack.html
├── resources/
│   └── index.html
├── admin/
│   ├── submissions.html      # Admin panel for viewing form submissions
│   ├── README.md
│   └── TEST.md
└── api/
    ├── form_server.py        # Form submission API (port 8080)
    ├── submissions_api.py    # Admin submissions API (port 8081)
    ├── storage/
    │   └── submissions.json  # Form submissions data
    └── submissions.log       # Form submissions log
```

## Backend Services

### Service Management

**Two systemd services run the APIs:**

1. **Form Submission API**
   - Service: `fighting-smart-form.service`
   - Port: 8080
   - File: `/root/fighting-smart-cyber/api/form_server.py`
   - Endpoint: `/api/submit_form` (proxied through Nginx)

2. **Admin Submissions API**
   - Service: `fighting-smart-submissions-api.service`
   - Port: 8081
   - File: `/root/fighting-smart-cyber/api/submissions_api.py`
   - Endpoint: `/api/submissions?password=PASSWORD` (proxied through Nginx)

**Service Commands:**
```bash
# Check status
systemctl status fighting-smart-form.service
systemctl status fighting-smart-submissions-api.service

# Restart services (after editing Python files)
systemctl restart fighting-smart-form.service
systemctl restart fighting-smart-submissions-api.service

# View logs
journalctl -u fighting-smart-form.service -f
journalctl -u fighting-smart-submissions-api.service -f
```

### Admin Password

**Current Password**: `FSCyber1775!@`

**To Change:**
```bash
nano /etc/systemd/system/fighting-smart-submissions-api.service
# Edit: Environment="ADMIN_PASSWORD=NewPasswordHere"
systemctl daemon-reload
systemctl restart fighting-smart-submissions-api.service
```

## Nginx Configuration

**Config File**: `/etc/nginx/nginx.conf`

**Key Points:**
- Port 80 redirects to HTTPS (443)
- SSL certificates in `/etc/ssl/fightingsmartcyber/`
- Proxies `/api/submit_form` → localhost:8080
- Proxies `/api/submissions` → localhost:8081
- Static files served from `/root/fighting-smart-cyber/`
- Directory listing disabled (`autoindex off` should be set)

**Reload Nginx after config changes:**
```bash
nginx -t                    # Test config
systemctl reload nginx      # Apply changes
```

## Cloudflare Integration

**Important**: Site is behind Cloudflare
- **Domain**: fightingsmartcyber.com
- **SSL**: Handled by Cloudflare
- **Caching**: Enabled - **MUST PURGE CACHE** after frontend updates

**After Making Frontend Changes:**
1. Edit files on production server
2. Go to https://dash.cloudflare.com
3. Select fightingsmartcyber.com
4. Caching → Configuration → "Purge Everything"
5. Wait 30 seconds
6. Hard refresh browser (Ctrl+Shift+R)

## Common Development Tasks

### Editing Frontend Files

**Example: Edit homepage**
```bash
ssh root@45.79.219.7
cd /root/fighting-smart-cyber
nano index.html
# Make changes, save
# Purge Cloudflare cache to see changes
```

### Editing CSS/JavaScript

```bash
ssh root@45.79.219.7
cd /root/fighting-smart-cyber
nano css/main.css
# or
nano js/animations.js
# Purge Cloudflare cache
```

### Editing API Backend

```bash
ssh root@45.79.219.7
cd /root/fighting-smart-cyber/api
nano form_server.py
# After saving:
systemctl restart fighting-smart-form.service
```

### Viewing Form Submissions

**Via API:**
```bash
curl "http://localhost:8081/api/submissions?password=FSCyber1775!@"
```

**Via Admin Panel:**
https://fightingsmartcyber.com/admin/submissions.html
(Enter password: `FSCyber1775!@`)

**Direct File:**
```bash
cat /root/fighting-smart-cyber/api/storage/submissions.json | python3 -m json.tool
```

### File Permissions

If files become unreadable (403 errors):
```bash
cd /root/fighting-smart-cyber
find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

## Testing

**Test site loads:**
```bash
curl -I https://fightingsmartcyber.com/
```

**Test form submission API:**
```bash
curl -X POST http://localhost:8080/api/submit_form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","organization":"Test Org","interest":"consulting","message":"Test"}'
```

**Test admin API:**
```bash
curl "http://localhost:8081/api/submissions?password=FSCyber1775!@"
```

**Check services are running:**
```bash
ss -tlnp | grep -E ':(8080|8081)'
```

## Backups

**Backup before major changes:**
```bash
cd /root
tar -czf fighting-smart-backup-$(date +%Y%m%d-%H%M%S).tar.gz fighting-smart-cyber/
```

**Restore from backup:**
```bash
cd /root
tar -xzf fighting-smart-backup-TIMESTAMP.tar.gz
systemctl restart fighting-smart-form.service fighting-smart-submissions-api.service
systemctl reload nginx
```

## Troubleshooting

### Site Not Loading
1. Check Nginx: `systemctl status nginx`
2. Check logs: `tail -f /var/log/nginx/error.log`
3. Test config: `nginx -t`

### Forms Not Submitting
1. Check service: `systemctl status fighting-smart-form.service`
2. Check logs: `journalctl -u fighting-smart-form.service -f`
3. Verify port: `ss -tlnp | grep 8080`

### Changes Not Visible
1. **PURGE CLOUDFLARE CACHE** (most common issue)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check file permissions (should be 644)

### Admin Panel Not Loading Submissions
1. Check service: `systemctl status fighting-smart-submissions-api.service`
2. Verify password in service file
3. Check logs: `journalctl -u fighting-smart-submissions-api.service -f`

## Important Files (Local Reference Only)

Keep these files locally in `/home/jon-dev/web-dev/fighting-smart-cyber/` for reference:
- `deployment/` - Deployment documentation and guides
- `claude.md` - This file
- Service files (for reference/backup)

## Development Workflow

1. **SSH to production server:**
   ```bash
   ssh root@45.79.219.7
   ```

2. **Navigate to site directory:**
   ```bash
   cd /root/fighting-smart-cyber
   ```

3. **Make changes directly on server:**
   ```bash
   nano index.html  # or any file
   ```

4. **If editing Python/API files, restart services:**
   ```bash
   systemctl restart fighting-smart-form.service
   systemctl restart fighting-smart-submissions-api.service
   ```

5. **If editing Nginx config:**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

6. **Purge Cloudflare cache** (for frontend changes)

7. **Test changes:**
   ```bash
   curl -I https://fightingsmartcyber.com/
   ```

## Quick Reference Commands

```bash
# SSH to production
ssh root@45.79.219.7

# Check all services
systemctl status fighting-smart-form.service fighting-smart-submissions-api.service nginx --no-pager

# View recent submissions
tail -f /root/fighting-smart-cyber/api/submissions.log

# Count total submissions
cat /root/fighting-smart-cyber/api/storage/submissions.json | jq '. | length'

# Create backup
cd /root && tar -czf fighting-smart-backup-$(date +%Y%m%d-%H%M%S).tar.gz fighting-smart-cyber/

# Fix permissions
cd /root/fighting-smart-cyber && find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;
```

## Website Features

- **Particle Animation System**: Canvas-based particles on hero section
- **Cyber Effects**: Scanlines, glitch effects, gradient animations
- **Responsive Design**: Mobile-friendly navigation and layouts
- **Contact Form**: Validated form with backend API integration
- **Admin Panel**: View and manage form submissions

## Stack

- **Frontend**: HTML5, CSS3 (custom), Vanilla JavaScript
- **Backend**: Python 3 (http.server based)
- **Web Server**: Nginx
- **SSL/CDN**: Cloudflare
- **Storage**: JSON file-based (submissions.json)

---

**Remember: Always work on production server at `root@45.79.219.7:/root/fighting-smart-cyber/`**
