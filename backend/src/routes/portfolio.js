const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
let portfolioEngine = null;

function setPortfolioEngine(engine) {
  portfolioEngine = engine;
}

router.use(authMiddleware);

router.get('/', (req, res) => {
  if (!portfolioEngine) return res.status(503).json({ error: 'Portfolio engine not initialized' });
  const userId = req.user.id || req.user.sub || 'dev-user-000';
  res.json(portfolioEngine.getPortfolio(userId));
});

module.exports = { router, setPortfolioEngine };
