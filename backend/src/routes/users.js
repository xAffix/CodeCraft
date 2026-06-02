const express = require('express');
const supabase = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { isDevUser, DEV_PROFILE } = require('../config/devMock');

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/users/me
 * Get the current user's profile, trust score, and simulation state.
 */
router.get('/me', async (req, res, next) => {
  try {
    if (isDevUser(req)) {
      return res.json({ profile: DEV_PROFILE, devMode: true });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      profile: data || {
        id: req.user.id,
        email: req.user.email,
        trust_score: 0,
        current_simulation_id: null,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/users/me
 * Update user profile settings.
 */
router.patch('/me', async (req, res, next) => {
  try {
    const allowedFields = ['display_name', 'avatar_url', 'preferences'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    if (isDevUser(req)) {
      Object.assign(DEV_PROFILE, updates, { updated_at: new Date().toISOString() });
      return res.json({ profile: DEV_PROFILE, devMode: true });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: req.user.id, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;

    res.json({ profile: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
