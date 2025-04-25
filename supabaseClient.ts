import { createClient } from '@supabase/supabase-js';

const supabaseUrl = https://iflhdbjxonqtldorajuc.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbGhkYmp4b25xdGxkb3JhanVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDI1NDgsImV4cCI6MjA2MTA3ODU0OH0.dYpbRgXBgIAibYoLI3vGvY5UPAQ-Mj5FTM3M4x2CdDM

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
