const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createWorkspace,
  destroyWorkspace,
  getWorkspaceStatus,
  listWorkspaces,
} = require('../workspace/manager');

const router = express.Router();

// All workspace routes require authentication
router.use(authMiddleware);

/**
 * POST /api/workspace
 * Create a new workspace for the authenticated user.
 */
router.post('/', async (req, res, next) => {
  try {
    const { simulationId } = req.body;
    const workspace = await createWorkspace(req.user.id, simulationId || 'default');
    res.status(201).json({ workspace });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/workspace
 * Get the current user's workspace status.
 */
router.get('/', async (req, res, next) => {
  try {
    const workspace = getWorkspaceStatus(req.user.id);
    if (!workspace) {
      return res.json({ workspace: null });
    }
    res.json({ workspace });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/workspace
 * Destroy the current user's workspace.
 */
router.delete('/', async (req, res, next) => {
  try {
    await destroyWorkspace(req.user.id);
    res.json({ message: 'Workspace destroyed' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/workspace/admin (admin only - lists all)
 */
router.get('/admin', async (req, res, next) => {
  try {
    const workspaces = listWorkspaces();
    res.json({ workspaces, count: workspaces.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
