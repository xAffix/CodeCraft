import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://blglqqtllpxhgdmhuauw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current session's access token for backend API calls.
 * Falls back to dev token if no Supabase session.
 */
export async function getAccessToken() {
  // Check dev bypass first
  const devToken = localStorage.getItem('codecraft_dev_token');
  if (devToken) return devToken;

  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Call a backend API endpoint with auth headers.
 * Automatically handles dev bypass headers.
 */
export async function api(path, options = {}) {
  const token = await getAccessToken();
  const isDev = !!localStorage.getItem('codecraft_dev_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    if (isDev) {
      headers['X-Dev-Access'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`http://localhost:3001/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}
