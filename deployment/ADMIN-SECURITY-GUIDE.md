# Admin Panel Security - Complete Guide

## ✅ What's Enabled

Your admin panel is protected with **HTTP Basic Authentication + fail2ban**:

- **Username/Password Required** - Browser login popup (HTTP Basic Auth)
- **Encrypted over HTTPS** - Credentials never sent in plain text via Cloudflare
- **Brute Force Protection** - fail2ban automatically blocks attackers
- **Industry Standard** - Works with all browsers and tools

## 🔑 Login Credentials

**Username**: `admin`
**Password**: `FightingSmart@2026!Admin`

When you visit the admin panel, your browser will show a login popup. Enter these credentials.

## 🌐 Accessing the Admin Panel

**Admin Panel**: https://fightingsmartcyber.com/admin/submissions.html
**API Endpoint**: https://fightingsmartcyber.com/api/submissions

Your browser will remember the credentials after first login (until you close the browser or clear cookies).

## 🛡️ Brute Force Protection (fail2ban)

### How It Works

- **Monitors** Nginx logs for failed login attempts
- **Blocks IPs** after 5 failed attempts within 10 minutes
- **Ban duration**: 1 hour (3600 seconds)
- **Automatic unbanning** after ban period expires

### fail2ban Commands

```bash
ssh root@45.79.219.7

# Check status of nginx-auth jail
fail2ban-client status nginx-auth

# View currently banned IPs
fail2ban-client get nginx-auth banip

# Manually unban an IP
fail2ban-client set nginx-auth unbanip 1.2.3.4

# View fail2ban logs
tail -f /var/log/fail2ban.log

# Restart fail2ban
systemctl restart fail2ban
```

### Change fail2ban Settings

Edit `/etc/fail2ban/jail.d/nginx-auth.conf`:

```bash
ssh root@45.79.219.7
nano /etc/fail2ban/jail.d/nginx-auth.conf

# Modify these values:
# maxretry = 5        # Number of failed attempts before ban
# findtime = 600      # Time window in seconds (10 minutes)
# bantime = 3600      # Ban duration in seconds (1 hour)

# Restart to apply changes
systemctl restart fail2ban
```

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

**Test fail2ban Protection:**
```bash
# Try 6 wrong passwords (should get banned after 5th attempt)
for i in {1..6}; do curl -u admin:wrongpassword https://fightingsmartcyber.com/admin/submissions.html; done

# Check if your IP was banned
ssh root@45.79.219.7 "fail2ban-client status nginx-auth"
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

### "I'm getting 403 Forbidden" or "Connection refused"

**Cause**: Your IP may be banned by fail2ban

**Solution**:
```bash
ssh root@45.79.219.7

# Check if you're banned
fail2ban-client status nginx-auth

# Unban your IP (replace with your actual IP)
fail2ban-client set nginx-auth unbanip YOUR.IP.ADDRESS

# Or disable nginx-auth jail temporarily
fail2ban-client stop nginx-auth

# Re-enable when done
fail2ban-client start nginx-auth
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
2. **Change the default password** shown in this guide immediately
3. **Don't share credentials** - create separate users for each person
4. **Use HTTPS always** - Never access over HTTP (enforced by Cloudflare)
5. **Log out when done** - Close browser or use private/incognito mode
6. **Monitor fail2ban logs** - Check periodically for attack attempts

## 🔒 Additional Security Layers (Optional)

### 1. Cloudflare Rate Limiting (Recommended)

Add an extra layer by rate limiting admin endpoints in Cloudflare:

1. Log into Cloudflare Dashboard
2. Go to Security → WAF → Rate limiting rules
3. Create rule:
   - **Rule name**: Admin Panel Rate Limit
   - **If incoming requests match:**
     - URI Path equals `/admin/submissions.html` OR
     - URI Path equals `/api/submissions`
   - **Rate**: 10 requests per 1 minute
   - **Action**: Block for 10 minutes
   - **Characteristics**: IP Address
4. Save and deploy

This blocks rapid login attempts before they reach your server.

### 2. Cloudflare IP Allow Lists

For maximum security, only allow specific IPs to access admin panel:

1. Log into Cloudflare Dashboard
2. Go to Security → WAF → Custom rules
3. Create rule:
   - **Rule name**: Admin IP Allowlist
   - **Field**: URI Path
   - **Operator**: starts with
   - **Value**: `/admin`
   - **Then**: Block
   - **Add Exception**: 
     - IP Address equals YOUR.HOME.IP
     - OR IP Address equals YOUR.OFFICE.IP
4. Save and deploy

⚠️ **Important**: This will block ALL IPs except those you specify. Make sure you know your current IP first!

### 3. Two-Factor Authentication (2FA)

For enterprise-grade security, consider implementing 2FA:
- Use Cloudflare Access (paid feature)
- Or implement TOTP/Google Authenticator at application level
- Requires code changes to submissions page

## 📂 Important Files

- **Password File**: `/etc/nginx/.htpasswd`
- **Nginx Config**: `/etc/nginx/nginx.conf`
- **fail2ban Jail Config**: `/etc/fail2ban/jail.d/nginx-auth.conf`
- **fail2ban Filter**: `/etc/fail2ban/filter.d/nginx-auth.conf`
- **fail2ban Logs**: `/var/log/fail2ban.log`
- **Nginx Error Logs**: `/var/log/nginx/error.log`

## ✅ What's Protected

**Protected (requires username + password):**
- ✅ `/admin/` (all admin pages)
- ✅ `/api/submissions` (submissions API)

**Not Protected (public):**
- ✅ `/` (homepage)
- ✅ `/contact.html` (contact form)
- ✅ `/api/submit_form` (form submission endpoint)
- ✅ All other public pages

## 🎯 Quick Commands Reference

```bash
# SSH to production
ssh root@45.79.219.7

# === HTTP Basic Auth ===

# Change admin password
htpasswd /etc/nginx/.htpasswd admin

# Add new user
htpasswd /etc/nginx/.htpasswd newuser

# Remove user
htpasswd -D /etc/nginx/.htpasswd username

# List all users
cat /etc/nginx/.htpasswd

# === fail2ban ===

# Check nginx-auth jail status
fail2ban-client status nginx-auth

# Unban an IP
fail2ban-client set nginx-auth unbanip 1.2.3.4

# View banned IPs
fail2ban-client get nginx-auth banip

# View fail2ban logs
tail -f /var/log/fail2ban.log

# Restart fail2ban
systemctl restart fail2ban

# === Nginx ===

# View nginx config
nano /etc/nginx/nginx.conf

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

# View nginx error log (where auth failures are logged)
tail -f /var/log/nginx/error.log
```

## 📊 Monitor Security

### Check for Attack Attempts

```bash
ssh root@45.79.219.7

# View recent failed login attempts
grep "user.*password mismatch" /var/log/nginx/error.log | tail -20

# View currently banned IPs
fail2ban-client status nginx-auth

# View all fail2ban activity
tail -100 /var/log/fail2ban.log
```

### Regular Security Checks

1. **Weekly**: Review fail2ban logs for suspicious activity
2. **Monthly**: Update admin password
3. **As needed**: Review and update IP allowlists in Cloudflare

---

**Current Security Status**: 
- ✅ HTTP Basic Authentication enabled
- ✅ HTTPS encryption via Cloudflare
- ✅ fail2ban brute force protection active
- ✅ All admin endpoints protected
- ✅ Public endpoints remain accessible

**Protection Summary**:
- First layer: Cloudflare (DDoS, optional rate limiting/IP filtering)
- Second layer: Nginx HTTP Basic Auth
- Third layer: fail2ban (automatic IP banning after failed attempts)
