import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://vwqrygpvxuvvixkxabkp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3cXJ5Z3B2eHV2dml4a3hhYmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwNDUzOTIsImV4cCI6MjAzMzYyMTM5Mn0.Pq9HydEbOyK_TyAEO8u2ZuefMQrYKOjS76t-4lNMGQg')