import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spabase.mauriciosti.xyz';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNjcxNzUwLCJleHAiOjE5MzAzNTE3NTB9.7BQUzk9cmOqag-XgfrR7lro7wE7YFj2v5U3pMyFPsrg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'portal_contribuintes'
  }
});
