import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// 1. Create a project at https://supabase.com/
// 2. Go to Project Settings > API
// 3. Find your Project URL and anon public key
// 4. Replace the placeholder values below with your own
// It is highly recommended to use environment variables for this.
const supabaseUrl = 'https://ivfmhpzazbztzdywtrkx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Zm1ocHphenJ6dHpkeXd0cmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMzEyMDEsImV4cCI6MjAzMzcwNzIwMX0.e4oc-G23NP233-XacGRi2t9h-x-Ie8Dq1xprb-M-u_E';

// FIX: Removed comparison to 'YOUR_SUPABASE_URL'. The constant's type is inferred as a specific
// string literal, which can never be equal to the placeholder, causing a TypeScript error.
if (!supabaseUrl) {
    console.error("Supabase URL is missing. Please add it to services/supabaseClient.ts. You can find it in your Supabase project's API settings.");
    alert("Supabase URL is not configured. The app will not work. Please see the console for instructions.");
}
// FIX: Removed comparison to 'YOUR_SUPABASE_ANON_KEY'. The constant's type is inferred as a specific
// string literal, which can never be equal to the placeholder, causing a TypeScript error.
if (!supabaseAnonKey) {
    console.error("Supabase Anon Key is missing. Please add it to services/supabaseClient.ts. You can find it in your Supabase project's API settings.");
    alert("Supabase Anon Key is not configured. The app will not work. Please see the console for instructions.");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
