#!/usr/bin/env python3
"""
HTTP server for handling contact form submissions
Stores submissions locally in JSON format
Runs on localhost:8080
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# Storage paths - use script directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_DIR = os.path.join(SCRIPT_DIR, 'storage')
SUBMISSIONS_FILE = os.path.join(STORAGE_DIR, 'submissions.json')
LOG_FILE = os.path.join(SCRIPT_DIR, 'submissions.log')

class FormHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/submit_form':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                form_data = json.loads(post_data.decode('utf-8'))
                result = self.store_submission(form_data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass
    
    def store_submission(self, form_data):
        """Store form submission locally"""
        try:
            # Ensure storage directory exists
            os.makedirs(STORAGE_DIR, exist_ok=True)
            
            # Add metadata to form data
            submission = {
                'id': datetime.now().strftime('%Y%m%d%H%M%S') + '_' + str(abs(hash(form_data.get('email', ''))))[:8],
                'timestamp': datetime.now().isoformat(),
                'submission': form_data.copy()
            }
            
            # Store submission in JSON file
            try:
                # Load existing submissions
                if os.path.exists(SUBMISSIONS_FILE):
                    with open(SUBMISSIONS_FILE, 'r') as f:
                        submissions = json.load(f)
                else:
                    submissions = []
                
                # Add new submission
                submissions.append(submission)
                
                # Save back to file
                with open(SUBMISSIONS_FILE, 'w') as f:
                    json.dump(submissions, f, indent=2)
                    
            except Exception as storage_error:
                import sys
                sys.stderr.write(f"Failed to store submission: {str(storage_error)}\n")
                return {'success': False, 'message': f'Error storing submission: {str(storage_error)}'}
            
            # Also log to text file for easy reading
            try:
                with open(LOG_FILE, 'a') as f:
                    f.write(f"\n{'='*80}\n")
                    f.write(f"Submission ID: {submission['id']}\n")
                    f.write(f"Timestamp: {submission['timestamp']}\n")
                    f.write(f"Name: {form_data.get('name', 'Not provided')}\n")
                    f.write(f"Email: {form_data.get('email', 'Not provided')}\n")
                    f.write(f"Organization: {form_data.get('organization', 'Not provided')}\n")
                    f.write(f"Role: {form_data.get('role', 'Not provided')}\n")
                    f.write(f"Org Type: {form_data.get('orgType', 'Not provided')}\n")
                    f.write(f"Interest: {form_data.get('interest', 'Not provided')}\n")
                    f.write(f"Timeframe: {form_data.get('timeframe', 'Not provided')}\n")
                    f.write(f"Message: {form_data.get('message', 'No message provided')}\n")
                    f.write(f"{'='*80}\n\n")
            except Exception as log_error:
                import sys
                sys.stderr.write(f"Failed to write to log file: {str(log_error)}\n")
            
            return {'success': True, 'message': 'Form submitted successfully'}
        
        except Exception as e:
            return {'success': False, 'message': f'Error processing submission: {str(e)}'}

def run(server_class=HTTPServer, handler_class=FormHandler, port=8080):
    server_address = ('127.0.0.1', port)
    httpd = server_class(server_address, handler_class)
    print(f'Form submission server running on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
