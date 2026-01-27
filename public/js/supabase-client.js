// Supabase Configuration
const SUPABASE_URL = 'https://voplzrnyqmolehjwuijr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGx6cm55cW1vbGVoand1aWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTE0MTUsImV4cCI6MjA4NTAyNzQxNX0.JbsiQajhIJxRY1aoGylcc2wrdtQPd7_gOpI3lEBTd8s';

// Initialize Supabase client (use different name to avoid conflict with CDN global)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Submit contact form (handles both contact and bundle request forms)
async function submitContactForm(formData) {
    let record;

    if (formData.formType === 'bundle-request') {
        record = {
            form_type: 'bundle-request',
            name: formData.name,
            email: formData.email,
            organization: formData.organization,
            role: formData.role || null,
            interest: 'Custom Bundle Request',
            timeframe: formData.timeframe || null,
            use_case: formData.useCase || null,
            environment: formData.environment || null,
            requirements: formData.requirements || null
        };
    } else {
        record = {
            form_type: 'contact',
            name: formData.name,
            email: formData.email,
            organization: formData.organization,
            role: formData.role || null,
            org_type: formData.orgType,
            interest: formData.interest,
            timeframe: formData.timeframe,
            message: formData.message
        };
    }

    const { data, error } = await supabaseClient
        .from('submissions')
        .insert([record]);

    if (error) {
        console.error('Error submitting form:', error);
        throw error;
    }

    return { success: true };
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
