/**
 * CodeCraft Skill Graph Routes
 *
 * GET  /api/skills          — Full skill graph for current user
 * GET  /api/skills/compare  — Skill breakdown by category
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
let skillsEngine = null;

function setSkillsEngine(engine) {
  skillsEngine = engine;
}

router.use(authMiddleware);

router.get('/', (req, res) => {
  if (!skillsEngine) return res.status(503).json({ error: 'Skills engine not initialized' });
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  res.json(skillsEngine.getSkills(userId));
});

router.get('/compare', (req, res) => {
  if (!skillsEngine) return res.status(503).json({ error: 'Skills engine not initialized' });
  res.json({ all: skillsEngine.getAll() });
});

module.exports = { router, setSkillsEngine };
