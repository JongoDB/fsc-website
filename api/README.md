# Contact Form API

## Overview

The form submission server handles contact form submissions and stores them locally in JSON format. No email sending is configured - all submissions are stored for later processing.

## Local Storage

All form submissions are stored locally in two formats:

1. **JSON Storage:** `/root/fighting-smart-cyber/api/storage/submissions.json`
   - Structured JSON format
   - Each submission has: id, timestamp, and submission data
   - Easy to parse and process programmatically

2. **Text Log:** `/root/fighting-smart-cyber/api/submissions.log`
   - Human-readable log format
   - Includes all submission details

## Service Management

The form server runs as a systemd service:

```bash
# Check status
systemctl status fighting-smart-form.service

# Restart service
systemctl restart fighting-smart-form.service

# View logs
journalctl -u fighting-smart-form.service -f
```

## Viewing Submissions

```bash
# View JSON submissions (formatted)
cat /root/fighting-smart-cyber/api/storage/submissions.json | python3 -m json.tool

# View log file
tail -f /root/fighting-smart-cyber/api/submissions.log

# Count submissions
jq '. | length' /root/fighting-smart-cyber/api/storage/submissions.json

# View latest submission
jq '.[-1]' /root/fighting-smart-cyber/api/storage/submissions.json
```

## Submission Format

Each submission includes:
- `id`: Unique identifier (timestamp + hash)
- `timestamp`: ISO format timestamp
- `submission`: All form fields (name, email, organization, role, orgType, interest, timeframe, message)

## API Endpoint

- **URL:** `/api/submit_form`
- **Method:** POST
- **Content-Type:** application/json
- **Response:** JSON with `success` and `message` fields

## Files

- `form_server.py` - Main server script
- `storage/submissions.json` - JSON storage of all submissions
- `submissions.log` - Human-readable log file
