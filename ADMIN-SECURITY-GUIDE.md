# Admin Panel Security - Quick Guide

## ✅ What's Enabled

Your admin panel is protected with **HTTP Basic Authentication**:

- **Username/Password Required** - Browser login popup
- **Encrypted over HTTPS** - Credentials never sent in plain text
- **Industry Standard** - Works with all browsers and tools

## 🔑 Login Credentials

**Username**: `admin`
**Password**: `FightingSmart@2026!Admin`

When you visit the admin panel, your browser will show a login popup. Enter these credentials.

## 🌐 Accessing the Admin Panel

**Admin Panel**: https://fightingsmartcyber.com/admin/submissions.html
**API Endpoint**: https://fightingsmartcyber.com/api/submissions

Your browser will remember the credentials after first login (until you close the browser or clear cookies).

## 🔐 How to Change Admin Password

```bash
ssh root@45.79.219.7

# Change password for 'admin' user
htpasswd /etc/nginx/.htpasswd admin
# Enter new password when prompted

# Reload nginx to apply
systemctl reload nginx
```

## 👥 How to Add Additional Users

```bash
ssh root@45.79.219.7

# Add a new admin user
htpasswd /etc/nginx/.htpasswd username
# Enter password when prompted

# Reload nginx
systemctl reload nginx
```

## 🗑️ How to Remove a User

```bash
ssh root@45.79.219.7

# Remove user
htpasswd -D /etc/nginx/.htpasswd username

# Reload nginx
systemctl reload nginx
```

## 📋 List All Admin Users

```bash
ssh root@45.79.219.7
cat /etc/nginx/.htpasswd
# Shows: username:encrypted_password
```

## 🧪 Test Admin Access

**Via Browser:**
1. Go to https://fightingsmartcyber.com/admin/submissions.html
2. Enter username: `admin`
3. Enter password: `FightingSmart@2026!Admin`
4. You should see the submissions dashboard

**Via Command Line:**
```bash
curl -u admin:FightingSmart@2026!Admin https://fightingsmartcyber.com/api/submissions
# Should return submissions JSON
```

## 🚨 Troubleshooting

### "I'm getting 401 Unauthorized"

**Cause**: Wrong username or password

**Solution**:
1. Double-check credentials above
2. Try resetting password:
   ```bash
   ssh root@45.79.219.7
   htpasswd /etc/nginx/.htpasswd admin
   systemctl reload nginx
   ```

### "Browser keeps asking for password"

**Cause**: Incorrect credentials being cached

**Solution**:
1. Clear browser cache/cookies for fightingsmartcyber.com
2. Close all browser windows
3. Reopen browser and try again with correct credentials

### "I forgot the password"

**Solution**:
```bash
ssh root@45.79.219.7
htpasswd /etc/nginx/.htpasswd admin
# Enter new password
systemctl reload nginx
```

### "I want to disable authentication temporarily"

```bash
ssh root@45.79.219.7
nano /etc/nginx/nginx.conf

# Comment out auth lines in /admin/ and /api/submissions locations:
# auth_basic "Admin Panel";
# auth_basic_user_file /etc/nginx/.htpasswd;

nginx -t
systemctl reload nginx

# Remember to uncomment and reload when done!
```

## 🛡️ Security Best Practices

1. **Use a strong password** (16+ characters, mix of letters/numbers/symbols)
2. **Change the default password** shown in this guide
3. **Don't share credentials** - create separate users for each person
4. **Use HTTPS always** - Never access over HTTP
5. **Log out when done** - Close browser or use private/incognito mode

## 🔒 Additional Security (Optional)

### Add IP Restrictions in Cloudflare

Since your site uses Cloudflare, you can add IP restrictions there:

1. Log into Cloudflare Dashboard
2. Go to Security → WAF
3. Create Custom Rule:
   - **Rule name**: Admin Access Only
   - **Field**: URI Path
   - **Operator**: starts with
   - **Value**: `/admin`
   - **Then**: Block
   - **Add Exception**: IP Address equals YOUR.IP.ADDRESS
4. Save and deploy

This adds an extra layer on top of HTTP Basic Auth.

## 📂 Important Files

- **Password File**: `/etc/nginx/.htpasswd`
- **Nginx Config**: `/etc/nginx/nginx.conf`
- **Config Backup**: `/etc/nginx/nginx.conf.backup-*`

## ✅ What's Protected

**Protected (requires username + password):**
- ✅ `/admin/` (all admin pages)
- ✅ `/api/submissions` (submissions API)

**Not Protected (public):**
- ✅ `/` (homepage)
- ✅ `/contact.html` (contact form)
- ✅ `/api/submit_form` (form submission endpoint)
- ✅ All other public pages

## 🎯 Quick Commands

```bash
# SSH to production
ssh root@45.79.219.7

# Change admin password
htpasswd /etc/nginx/.htpasswd admin

# Add new user
htpasswd /etc/nginx/.htpasswd newuser

# Remove user
htpasswd -D /etc/nginx/.htpasswd username

# List all users
cat /etc/nginx/.htpasswd

# View nginx config
nano /etc/nginx/nginx.conf

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx
```

---

**Current Security Status**: HTTP Basic Authentication enabled for all admin endpoints. Access is encrypted over HTTPS via Cloudflare.
