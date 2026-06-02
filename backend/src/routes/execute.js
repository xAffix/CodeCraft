const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { executeCode, getSupportedLanguages } = require('../workspace/executor');

const router = express.Router();

/**
 * GET /api/execute/languages
 * List supported programming languages (public).
 */
router.get('/languages', async (req, res) => {
  const languages = getSupportedLanguages();
  res.json({ languages });
});

// All other routes require authentication
router.use(authMiddleware);

/**
 * POST /api/execute
 * Execute user code in a sandboxed environment.
 */
router.post('/', async (req, res, next) => {
  try {
    const { code, language, timeout, stdin } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: 'Code exceeds maximum length (50KB)' });
    }

    const result = await executeCode(
      req.user?.id || 'test-user',
      code,
      language || 'javascript',
      { timeout, stdin }
    );

    res.json({ result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
