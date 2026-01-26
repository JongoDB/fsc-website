# Server Not Showing Changes?

If you're not seeing your changes in the browser (even in incognito mode), the Python HTTP server may need to be restarted.

## How to Restart

### 1. Stop the Current Server

In the terminal where the server is running, press:
```
Ctrl + C
```

Or, if it's running in the background:
```bash
# Find the process
ps aux | grep "python3 -m http.server" | grep -v grep

# Kill it (replace PID with the actual process ID)
kill <PID>
```

Or use this one-liner:
```bash
pkill -f "python3 -m http.server 8000"
```

### 2. Restart the Server

```bash
cd /home/jon-dev/web-dev/fighting-smart-cyber
./serve-preprod.sh
```

Or manually:
```bash
cd /home/jon-dev/web-dev/fighting-smart-cyber/pre-prod
python3 -m http.server 8000
```

### 3. Hard Refresh Browser

Even after restarting the server, do a hard refresh:
- **Chrome/Firefox/Edge**: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- **Safari**: `Cmd + Option + R`

---

## Quick One-Liner to Restart

```bash
pkill -f "python3 -m http.server 8000" && cd /home/jon-dev/web-dev/fighting-smart-cyber && ./serve-preprod.sh
```

This will kill the old server and start a new one in one command.
