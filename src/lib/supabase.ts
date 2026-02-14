
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kxgrprxyqeuffhczaznl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Z3Jwcnh5cWV1ZmZoY3phem5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODk3NDMsImV4cCI6MjA2MDg2NTc0M30.m4p38iF8Wkr_ehuZ4pqWGCcfqKb8cJjrdK-Ni9TO4Cc";

// Create a single supabase client for the entire app
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
