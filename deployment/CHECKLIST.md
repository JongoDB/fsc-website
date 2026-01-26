# Production Deployment Checklist

## Pre-Deployment

- [ ] Review all code changes
- [ ] Test contact form locally
- [ ] Test admin panel locally
- [ ] Backup existing production site (if applicable)
- [ ] Update admin password in service file

## Server Setup

- [ ] Create directory: `/var/www/fighting-smart-cyber`
- [ ] Upload all files to server
- [ ] Set ownership: `chown -R www-data:www-data /var/www/fighting-smart-cyber`
- [ ] Set permissions: `chmod -R 755 /var/www/fighting-smart-cyber`
- [ ] Set storage permissions: `chmod 775 /var/www/fighting-smart-cyber/api/storage`

## Systemd Services

- [ ] Copy service files to `/etc/systemd/system/`
- [ ] **IMPORTANT**: Edit `fighting-smart-admin.service` and change admin password
- [ ] Run: `systemctl daemon-reload`
- [ ] Enable services:
  - [ ] `systemctl enable fighting-smart-form.service`
  - [ ] `systemctl enable fighting-smart-admin.service`
- [ ] Start services:
  - [ ] `systemctl start fighting-smart-form.service`
  - [ ] `systemctl start fighting-smart-admin.service`
- [ ] Verify services are running:
  - [ ] `systemctl status fighting-smart-form.service`
  - [ ] `systemctl status fighting-smart-admin.service`

## Nginx Configuration

- [ ] Copy `nginx-cloudflare.conf` to `/etc/nginx/sites-available/fighting-smart-cyber`
- [ ] Update server_name if needed
- [ ] Review and customize security settings
- [ ] Optional: Add IP restrictions for admin panel
- [ ] Create symbolic link: `ln -s /etc/nginx/sites-available/fighting-smart-cyber /etc/nginx/sites-enabled/`
- [ ] Test configuration: `nginx -t`
- [ ] Reload Nginx: `systemctl reload nginx`

## Cloudflare Tunnel

- [ ] Verify tunnel is configured to route to server
- [ ] Tunnel should point to `http://localhost:80` (Nginx)
- [ ] Test tunnel connectivity
- [ ] Restart cloudflared if needed: `systemctl restart cloudflared`

## Testing

- [ ] Visit homepage: https://fightingsmartcyber.com
- [ ] Test navigation to all pages
- [ ] Submit test form via contact page
- [ ] Verify submission appears in storage:
  - [ ] Check: `cat /var/www/fighting-smart-cyber/api/storage/submissions.json`
- [ ] Test admin panel: https://fightingsmartcyber.com/admin/submissions.html
- [ ] Verify admin panel shows submissions
- [ ] Check service logs for errors:
  - [ ] `journalctl -u fighting-smart-form.service -n 50`
  - [ ] `journalctl -u fighting-smart-admin.service -n 50`

## Security

- [ ] Admin password changed from default
- [ ] Storage directory has correct permissions
- [ ] Consider IP restrictions for admin panel
- [ ] Review Nginx security headers
- [ ] Ensure Cloudflare SSL is enabled
- [ ] Test from external network

## Post-Deployment

- [ ] Monitor logs for first 24 hours
- [ ] Set up automated backups for `/var/www/fighting-smart-cyber/api/storage/`
- [ ] Document any custom configurations
- [ ] Create monitoring/alerting for services
- [ ] Test form submission notifications (if configured)

## Rollback Plan (if needed)

- [ ] Stop services: `systemctl stop fighting-smart-*.service`
- [ ] Restore previous Nginx config
- [ ] Reload Nginx
- [ ] Restore previous site files
- [ ] Restart services

## Backup Strategy

### What to Backup
- `/var/www/fighting-smart-cyber/api/storage/submissions.json` (critical)
- `/var/www/fighting-smart-cyber/` (entire site)
- `/etc/systemd/system/fighting-smart-*.service` (service configs)
- `/etc/nginx/sites-available/fighting-smart-cyber` (nginx config)

### Backup Command
```bash
tar -czf fighting-smart-backup-$(date +%Y%m%d).tar.gz \
  /var/www/fighting-smart-cyber/api/storage/ \
  /etc/systemd/system/fighting-smart-*.service \
  /etc/nginx/sites-available/fighting-smart-cyber
```

## Support Commands

```bash
# View real-time logs
journalctl -u fighting-smart-form.service -f
journalctl -u fighting-smart-admin.service -f

# Check service status
systemctl status fighting-smart-form.service
systemctl status fighting-smart-admin.service

# Restart services
systemctl restart fighting-smart-form.service
systemctl restart fighting-smart-admin.service

# View recent submissions
tail -f /var/www/fighting-smart-cyber/api/submissions.log

# Count total submissions
cat /var/www/fighting-smart-cyber/api/storage/submissions.json | jq '. | length'
```
