import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blglqqtllpxhgdmhuauw.supabase.co';
const supabaseAnonKey = 'eyJhbG...4kOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current session's access token for backend API calls.
 */
export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Call a backend API endpoint with auth headers.
 */
export async function api(path, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`http://localhost:3001/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}
