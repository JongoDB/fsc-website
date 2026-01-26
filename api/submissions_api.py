#!/usr/bin/env python3
"""
API endpoint to serve submissions JSON
Protected by HTTP Basic Auth (handled by Nginx)
Supports GET (list) and DELETE (remove) operations
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Storage paths - use script directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SUBMISSIONS_FILE = os.path.join(SCRIPT_DIR, 'storage', 'submissions.json')

class SubmissionsAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Serve submissions
        try:
            if os.path.exists(SUBMISSIONS_FILE):
                with open(SUBMISSIONS_FILE, 'r') as f:
                    submissions = json.load(f)
            else:
                submissions = []
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(submissions, indent=2).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_DELETE(self):
        # Delete submissions by ID
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        # Get IDs to delete from query params or request body
        ids_to_delete = query_params.get('ids', [])
        
        if not ids_to_delete:
            # Try to read from request body
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    ids_to_delete = data.get('ids', [])
            except:
                pass
        
        if not ids_to_delete:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No IDs provided'}).encode())
            return
        
        try:
            # Load submissions
            if os.path.exists(SUBMISSIONS_FILE):
                with open(SUBMISSIONS_FILE, 'r') as f:
                    submissions = json.load(f)
            else:
                submissions = []
            
            # Filter out deleted submissions
            original_count = len(submissions)
            submissions = [s for s in submissions if s['id'] not in ids_to_delete]
            deleted_count = original_count - len(submissions)
            
            # Save back to file
            with open(SUBMISSIONS_FILE, 'w') as f:
                json.dump(submissions, f, indent=2)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'deleted': deleted_count,
                'remaining': len(submissions)
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def run(server_class=HTTPServer, handler_class=SubmissionsAPIHandler, port=8081):
    server_address = ('127.0.0.1', port)
    httpd = server_class(server_address, handler_class)
    print(f'Submissions API running on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
