#!/bin/bash
# Launch pre-production server for Fighting Smart Cyber

echo "========================================="
echo "  Fighting Smart Cyber - Pre-Prod Server"
echo "========================================="
echo ""
echo "Starting Python HTTP server on port 8000..."
echo ""
echo "Access the site at:"
echo "  → Desktop: http://localhost:8000/"
echo "  → Mobile: http://$(hostname -I | awk '{print $1}'):8000/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================="
echo ""

cd "$(dirname "$0")/pre-prod" && python3 -m http.server 8000
