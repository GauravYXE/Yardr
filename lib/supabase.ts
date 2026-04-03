import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase credentials
// Prefer Expo public env vars (if configured), but keep hardcoded fallback to avoid undefined at runtime.
const SUPABASE_URL =
	process.env.EXPO_PUBLIC_SUPABASE_URL ??
	'https://gfkqmaupmuhxavkfyjbb.supabase.co';
const SUPABASE_ANON_KEY =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma3FtYXVwbXVoeGF2a2Z5amJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTA5ODksImV4cCI6MjA4MDg4Njk4OX0.f_4aHwLdkZdaFoJwZO34TEWh664FpcmaDV1RkM-Vkuk';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error(
		'[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.',
	);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
  },
});
