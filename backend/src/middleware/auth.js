const supabase = require('../config/database');
const config = require('../config/env');

/**
 * Verify a Supabase JWT token from the Authorization header.
 * Returns the user object if valid, null otherwise.
 */
async function verifyToken(token) {
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Express middleware — extracts Bearer token, verifies it,
 * attaches `req.user` if valid, returns 401 if not.
 *
 * DEV BYPASS: In development mode, you can skip auth by sending
 * the header `X-Dev-Access: codecraft-dev-2024`.
 */
async function authMiddleware(req, res, next) {
  // Dev bypass
  if (config.server.nodeEnv !== 'production' && req.headers['x-dev-access'] === 'codecraft-dev-2024') {
    req.user = { id: 'dev-user-000', email: 'dev@codecraft.dev', user_metadata: { full_name: 'Dev Engineer' } };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const user = await verifyToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}

/**
 * Optional auth — attaches user if token present, but doesn't block.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    req.user = await verifyToken(token);
  }
  next();
}

module.exports = { authMiddleware, optionalAuth, verifyToken };
