/**
 * CodeCraft Trust Score Routes
 *
 * GET  /api/trust/score     — Current trust score with factor breakdown
 * GET  /api/trust/history   — Score history over time
 * GET  /api/trust/badges    — Badge progress
 * POST /api/trust/event     — Apply a score event (for testing/simulation)
 * GET  /api/trust/leaderboard — All users ranked
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Reference set from server.js
let trustEngine = null;

function setTrustEngine(engine) {
  trustEngine = engine;
}

router.use(authMiddleware);

/**
 * GET /api/trust/score
 * Current trust score snapshot.
 */
router.get('/score', (req, res) => {
  if (!trustEngine) {
    return res.status(503).json({ error: 'Trust engine not initialized' });
  }
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  const score = trustEngine.getScore(userId);
  res.json(score);
});

/**
 * GET /api/trust/history?limit=30
 * Score history over time.
 */
router.get('/history', (req, res) => {
  if (!trustEngine) {
    return res.status(503).json({ error: 'Trust engine not initialized' });
  }
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  const limit = parseInt(req.query.limit) || 30;
  const history = trustEngine.getHistory(userId, limit);
  res.json({ history });
});

/**
 * GET /api/trust/badges
 * Badge progress and unlock status.
 */
router.get('/badges', (req, res) => {
  if (!trustEngine) {
    return res.status(503).json({ error: 'Trust engine not initialized' });
  }
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  const score = trustEngine.getScore(userId);
  res.json({ badges: score.badges, total: score.total });
});

/**
 * POST /api/trust/event
 * Apply a score event manually (for simulation/testing).
 * Body: { factor, delta, description }
 */
router.post('/event', (req, res) => {
  if (!trustEngine) {
    return res.status(503).json({ error: 'Trust engine not initialized' });
  }
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  const { factor, delta = 1, description } = req.body;
  const result = trustEngine.applyEvent(userId, { factor, delta, description });
  if (!result) {
    return res.status(400).json({ error: 'Invalid factor. Use: codeQuality, incidentResponse, sprintReliability, collaboration' });
  }
  res.json(result);
});

/**
 * GET /api/trust/leaderboard
 * All users ranked by trust score.
 */
router.get('/leaderboard', (req, res) => {
  if (!trustEngine) {
    return res.status(503).json({ error: 'Trust engine not initialized' });
  }
  const scores = trustEngine.getAllScores();
  res.json({ leaderboard: scores });
});

module.exports = { router, setTrustEngine };
