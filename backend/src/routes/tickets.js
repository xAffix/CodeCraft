const express = require('express');
const supabase = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { isDevUser, DEV_USER_ID, DEV_TICKETS } = require('../config/devMock');

const router = express.Router();

// All ticket routes require authentication
router.use(authMiddleware);

/**
 * GET /api/tickets
 * List tickets for the current user's simulation.
 * In dev mode, returns seeded sample tickets.
 */
router.get('/', async (req, res, next) => {
  try {
    if (isDevUser(req)) {
      return res.json({ tickets: DEV_TICKETS, devMode: true });
    }

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assignee_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ tickets: data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tickets/:id
 * Get a single ticket with full details.
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (isDevUser(req)) {
      const ticket = DEV_TICKETS.find(t => t.id === req.params.id);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      return res.json({ ticket, devMode: true });
    }

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ ticket: data });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/tickets/:id
 * Update ticket status (e.g., TODO -> IN_PROGRESS -> IN_REVIEW -> DONE).
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const allowedFields = ['status', 'title', 'description'];
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
      const ticket = DEV_TICKETS.find(t => t.id === req.params.id);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      Object.assign(ticket, updates, { updated_at: new Date().toISOString() });
      return res.json({ ticket, devMode: true });
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', req.params.id)
      .eq('assignee_id', req.user.id)
      .select()
      .single();

    if (error) return res.status(404).json({ error: 'Ticket not found or access denied' });

    res.json({ ticket: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
