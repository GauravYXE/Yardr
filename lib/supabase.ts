import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase credentials
const SUPABASE_URL = 'https://gfkqmaupmuhxavkfyjbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma3FtYXVwbXVoeGF2a2Z5amJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTA5ODksImV4cCI6MjA4MDg4Njk4OX0.f_4aHwLdkZdaFoJwZO34TEWh664FpcmaDV1RkM-Vkuk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
  },
});
