const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

module.exports = supabase;
