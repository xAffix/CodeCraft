require('dotenv').config();

module.exports = {
  supabase: {
    url: process.env.SUPABASE_URL || 'https://blglqqtllpxhgdmhuauw.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbG...4kOM',
  },
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'codecr...n',
  },
};
