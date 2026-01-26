# Testing the Admin Panel

## Quick Test

The password is working correctly! Here's how to verify:

### Test via API:
```bash
# Correct password (URL encoded)
curl -k "https://localhost/api/submissions?password=FSCyber1775%21%40"

# Wrong password
curl -k "https://localhost/api/submissions?password=wrong"
# Should return: {"error": "Unauthorized"}
```

### Test via Browser:
1. Visit: `https://fightingsmartcyber.com/admin/submissions.html`
2. Enter password: `FSCyber1775!@`
3. Click "Access Submissions"

## Password Special Characters

The password contains special characters (`!` and `@`) which need to be URL-encoded:
- `!` becomes `%21`
- `@` becomes `%40`

The frontend JavaScript uses `encodeURIComponent()` which handles this automatically.

## Current Status

✅ API endpoint working
✅ Password authentication working  
✅ Service running correctly
✅ Environment variable set: `ADMIN_PASSWORD=FSCyber1775!@`

## Troubleshooting

If the password doesn't work in the browser:
1. Check browser console for errors (F12)
2. Verify the password is typed correctly (no extra spaces)
3. Try clearing browser cache
4. Check that the service is running: `systemctl status fighting-smart-submissions-api.service`

