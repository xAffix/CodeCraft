const express = require('express');
const supabase = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { isDevUser, DEV_USER_ID, DEV_MESSAGES } = require('../config/devMock');

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/messages?channel=general&limit=50
 * Fetch messages for a simulation channel.
 */
router.get('/', async (req, res, next) => {
  try {
    const { channel, simulation_id, limit = 50 } = req.query;

    if (isDevUser(req)) {
      const channelMessages = channel
        ? (DEV_MESSAGES[channel] || [])
        : Object.values(DEV_MESSAGES).flat();
      return res.json({ messages: channelMessages.slice(0, parseInt(limit) || 50), devMode: true });
    }

    let query = supabase
      .from('sim_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(Math.min(parseInt(limit), 100));

    if (channel) {
      query = query.eq('channel', channel);
    }
    if (simulation_id) {
      query = query.eq('simulation_id', simulation_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ messages: data || [] });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/messages
 * Send a new message to a channel.
 */
router.post('/', async (req, res, next) => {
  try {
    const { simulation_id, channel, content, sender_type } = req.body;

    if (!channel || !content) {
      return res.status(400).json({ error: 'Channel and content are required' });
    }

    const message = {
      id: `msg-${Date.now()}`,
      simulation_id: simulation_id || null,
      channel,
      sender_id: req.user.id,
      sender_type: sender_type || 'user',
      sender_name: req.user.user_metadata?.full_name || 'You',
      content,
      created_at: new Date().toISOString(),
    };

    if (isDevUser(req)) {
      if (!DEV_MESSAGES[channel]) DEV_MESSAGES[channel] = [];
      DEV_MESSAGES[channel].push(message);
      return res.status(201).json({ message, devMode: true });
    }

    const { data, error } = await supabase
      .from('sim_messages')
      .insert({
        simulation_id: simulation_id || null,
        channel,
        sender_id: req.user.id,
        sender_type: sender_type || 'user',
        content,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
