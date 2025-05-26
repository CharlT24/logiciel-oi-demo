// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ne recrée pas de nouveau client si déjà présent dans globalThis
export const supabase = globalThis.supabase || createClient(supabaseUrl, supabaseAnonKey);

// Si en développement, sauvegarde dans globalThis pour le hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabase;
}
