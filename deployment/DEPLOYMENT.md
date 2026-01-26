# Production Deployment Guide

## Prerequisites

- Ubuntu/Debian server with root access
- Python 3.8+
- Nginx (for serving static files)
- Cloudflare Tunnel configured

## Quick Deployment

### 1. Upload Files to Server

```bash
# On your local machine (from the project directory)
rsync -avz --exclude '.git' --exclude 'deployment' \
  /home/jon-dev/web-dev/fighting-smart-cyber/ \
  root@45.79.219.7:/root/fighting-smart-cyber/
```

### 2. Set Permissions

```bash
# On the server
ssh root@45.79.219.7
cd /root/fighting-smart-cyber
chmod -R 755 .
chmod 775 api/storage
```

### 3. Update Systemd Services (if needed)

**Note**: Services are already running on production. Only update if you need to change configuration.

```bash
# Copy updated service files (if needed)
scp deployment/fighting-smart-form.service root@45.79.219.7:/etc/systemd/system/
scp deployment/fighting-smart-submissions-api.service root@45.79.219.7:/etc/systemd/system/

# IMPORTANT: Edit the submissions API service to update the password!
ssh root@45.79.219.7
nano /etc/systemd/system/fighting-smart-submissions-api.service
# Change: Environment="ADMIN_PASSWORD=YourNewPassword"

# Reload and restart services
systemctl daemon-reload
systemctl restart fighting-smart-form.service
systemctl restart fighting-smart-submissions-api.service

# Check status
systemctl status fighting-smart-form.service
systemctl status fighting-smart-submissions-api.service
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/fighting-smart-cyber`:

```nginx
server {
    listen 80;
    server_name fightingsmartcyber.com www.fightingsmartcyber.com;

    root /var/www/fighting-smart-cyber;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ =404;
    }

    # Proxy form submission API
    location /api/submit_form {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Proxy admin API (optional - restrict by IP if needed)
    location /api/submissions {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Optional: Restrict to specific IPs
        # allow 192.168.1.0/24;
        # deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/fighting-smart-cyber /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configure Cloudflare Tunnel

Your Cloudflare Tunnel should route to your Nginx server (port 80 or 443).

Example `config.yml` for cloudflared:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: fightingsmartcyber.com
    service: http://localhost:80
  - hostname: www.fightingsmartcyber.com
    service: http://localhost:80
  - service: http_status:404
```

Restart cloudflared:

```bash
sudo systemctl restart cloudflared
```

## Service Management

### Check Service Status
```bash
sudo systemctl status fighting-smart-form.service
sudo systemctl status fighting-smart-admin.service
```

### View Logs
```bash
sudo journalctl -u fighting-smart-form.service -f
sudo journalctl -u fighting-smart-admin.service -f
```

### Restart Services
```bash
sudo systemctl restart fighting-smart-form.service
sudo systemctl restart fighting-smart-admin.service
```

### View Submissions
```bash
# View all submissions (formatted)
sudo cat /var/www/fighting-smart-cyber/api/storage/submissions.json | python3 -m json.tool

# View recent submissions
sudo tail -f /var/www/fighting-smart-cyber/api/submissions.log
```

## Security Recommendations

1. **Change Admin Password**: Update the password in the systemd service file
2. **Restrict Admin Access**: Add IP whitelisting in Nginx for `/api/submissions`
3. **Enable SSL**: Use Cloudflare's SSL or Certbot for HTTPS
4. **Regular Backups**: Backup the `api/storage/` directory regularly
5. **Monitor Logs**: Set up log monitoring for suspicious activity

## Updating the Site

```bash
# Stop services
sudo systemctl stop fighting-smart-form.service fighting-smart-admin.service

# Update files
rsync -avz --exclude 'api/storage' \
  /home/jon-dev/web-dev/fighting-smart-cyber/ \
  user@your-server:/var/www/fighting-smart-cyber/

# Restart services
sudo systemctl start fighting-smart-form.service fighting-smart-admin.service
```

## Troubleshooting

### Services won't start
- Check logs: `sudo journalctl -u fighting-smart-form.service -n 50`
- Verify Python3 is installed: `which python3`
- Check file permissions: `ls -la /var/www/fighting-smart-cyber/api/`

### Form submissions not working
- Check if service is running: `sudo systemctl status fighting-smart-form.service`
- Verify port is listening: `ss -tlnp | grep 8080`
- Check Nginx proxy configuration
- View browser console for errors

### Admin panel not accessible
- Verify service is running: `sudo systemctl status fighting-smart-admin.service`
- Check password in service file
- Verify port is listening: `ss -tlnp | grep 8081`
- Check Nginx proxy configuration
