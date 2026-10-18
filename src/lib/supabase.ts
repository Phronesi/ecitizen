import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sglbnxxiktmlevbfedxw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbGJueHhpa3RtbGV2YmZlZHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzkyOTgsImV4cCI6MjEwNzkxNTI5OH0.FfubfnpfPkVh9u9wz3aCIXGsu9j7XbuOSpQNSa7oacY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
