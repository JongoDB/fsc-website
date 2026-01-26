// Supabase Configuration
const SUPABASE_URL = 'https://voplzrnyqmolehjwuijr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGx6cm55cW1vbGVoand1aWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTE0MTUsImV4cCI6MjA4NTAyNzQxNX0.JbsiQajhIJxRY1aoGylcc2wrdtQPd7_gOpI3lEBTd8s';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Submit contact form
async function submitContactForm(formData) {
    const { data, error } = await supabase
        .from('submissions')
        .insert([{
            name: formData.name,
            email: formData.email,
            organization: formData.organization,
            role: formData.role || null,
            org_type: formData.orgType,
            interest: formData.interest,
            timeframe: formData.timeframe,
            message: formData.message
        }]);

    if (error) {
        console.error('Error submitting form:', error);
        throw error;
    }

    return { success: true };
}

// Auth functions for admin
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// Submissions functions for admin
async function getSubmissions() {
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

async function deleteSubmissions(ids) {
    const { error } = await supabase
        .from('submissions')
        .delete()
        .in('id', ids);

    if (error) throw error;
    return { success: true };
}
