// Supabase Configuration
const SUPABASE_URL = 'https://voplzrnyqmolehjwuijr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGx6cm55cW1vbGVoand1aWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTE0MTUsImV4cCI6MjA4NTAyNzQxNX0.JbsiQajhIJxRY1aoGylcc2wrdtQPd7_gOpI3lEBTd8s';

// Initialize Supabase client (use different name to avoid conflict with CDN global)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Submit contact or bundle-request form via the /api/submit Vercel function.
// The endpoint persists to Supabase AND emails team@fightingsmartcyber.com
// via Resend, so we no longer write to Supabase directly from the browser.
async function submitContactForm(formData) {
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        let detail = '';
        try {
            const body = await response.json();
            detail = body && body.error ? body.error : JSON.stringify(body);
        } catch (e) {
            detail = await response.text().catch(() => '');
        }
        console.error('Form submission failed:', response.status, detail);
        throw new Error(detail || 'Submission failed (' + response.status + ')');
    }

    return response.json();
}

// Auth functions for admin
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

async function getSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

// Submissions functions for admin
async function getSubmissions() {
    const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

async function deleteSubmissions(ids) {
    const { error } = await supabaseClient
        .from('submissions')
        .delete()
        .in('id', ids);

    if (error) throw error;
    return { success: true };
}
