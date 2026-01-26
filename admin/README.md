# Admin Panel - Form Submissions

## Access

Visit: `https://fightingsmartcyber.com/admin/submissions.html`

You'll be prompted for a password to access the submissions.

## Default Password

**⚠️ IMPORTANT: Change the default password immediately!**

The default password is set in the systemd service file:
- File: `/etc/systemd/system/fighting-smart-submissions-api.service`
- Current default: `change-me-123`

## Changing the Password

1. SSH to production and edit the service file:
   ```bash
   ssh root@45.79.219.7
   nano /etc/systemd/system/fighting-smart-submissions-api.service
   ```

2. Update the `Environment="ADMIN_PASSWORD=your-new-password"` line

3. Reload and restart:
   ```bash
   systemctl daemon-reload
   systemctl restart fighting-smart-submissions-api.service
   ```

## Current Password

Your current production password is: **`FSCyber1775!@`**

This is stored in `/etc/systemd/system/fighting-smart-submissions-api.service` on the production server.

## Features

- **Password Protection**: Simple password-based access
- **Statistics Dashboard**: View total submissions, top interests, unique organizations
- **Submission Cards**: Beautiful card-based layout showing all submission details
- **Auto-refresh**: Automatically refreshes every 30 seconds
- **Responsive Design**: Works on desktop and mobile
- **Email Links**: Click email addresses to open your email client

## Security Notes

- The password is passed as a URL parameter (query string)
- For production, consider implementing:
  - HTTP Basic Auth via Nginx
  - Session-based authentication
  - IP whitelisting
  - More robust authentication system

## API Endpoint

The admin panel uses: `/api/submissions?password=YOUR_PASSWORD`

This endpoint is served by a separate Python server on port 8081.

