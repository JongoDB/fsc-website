# Admin Password Management

## Current Production Password

**Password**: `FSCyber1775!@`

**Location**: `/etc/systemd/system/fighting-smart-submissions-api.service` on production server (45.79.219.7)

## How to Change Password

### On Production Server

1. **SSH to production**:
   ```bash
   ssh root@45.79.219.7
   ```

2. **Edit the service file**:
   ```bash
   nano /etc/systemd/system/fighting-smart-submissions-api.service
   ```

3. **Update the password** on this line:
   ```ini
   Environment="ADMIN_PASSWORD=YourNewPasswordHere"
   ```

4. **Reload and restart**:
   ```bash
   systemctl daemon-reload
   systemctl restart fighting-smart-submissions-api.service
   ```

5. **Verify it's working**:
   ```bash
   systemctl status fighting-smart-submissions-api.service
   ```

### On Local Development

```bash
# Stop services
./stop-services.sh

# Set new password and restart
ADMIN_PASSWORD="your-password" ./start-services.sh
```

## Testing Password

### Production
```bash
# Should return submissions
curl "https://fightingsmartcyber.com/api/submissions?password=FSCyber1775!@"

# Or visit in browser
https://fightingsmartcyber.com/admin/submissions.html
```

### Local Dev
```bash
# Should return submissions
curl "http://localhost:8081/api/submissions?password=change-me-123"

# Or visit in browser
http://localhost:8000/admin/submissions.html
```

## Password Requirements

For security, use:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- No dictionary words
- No common patterns

## Security Notes

⚠️ **Important**: The password is passed as a URL parameter. For enhanced security, consider:
- Using Nginx Basic Auth
- Implementing session-based authentication
- Adding IP whitelisting for admin access
- Using a VPN for admin panel access

## Service File Locations

- **Production**: `/etc/systemd/system/fighting-smart-submissions-api.service`
- **Dev Template**: `deployment/fighting-smart-submissions-api.service`
