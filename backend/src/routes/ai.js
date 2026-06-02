/**
 * CodeCraft AI Routes
 *
 * GET  /api/ai/team          — List team personas with status
 * POST /api/ai/chat          — Generate an AI response
 * GET  /api/ai/chaos/events  — Chaos incident history
 * POST /api/ai/chaos/trigger — Force a chaos incident
 * GET  /api/ai/chaos/status  — Chaos engine status
 */

const express = require('express');
const supabase = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { isDevUser, DEV_MESSAGES } = require('../config/devMock');

const {
  generateResponse,
  generateChaosResponse,
  generateIncident,
  getHistory,
  Personas,
} = require('../ai/orchestrator');

const router = express.Router();

// Reference to chaos engine (set from server.js on init)
let chaosEngine = null;

function setChaosEngine(engine) {
  chaosEngine = engine;
}

// All routes require auth
router.use(authMiddleware);

/**
 * GET /api/ai/team
 * Returns list of AI team members with status and info.
 */
router.get('/team', async (req, res) => {
  const team = Object.values(Personas)
    .filter(p => p.id !== 'system')
    .map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      title: p.title,
      avatar: p.avatar,
      color: p.color,
      tagline: p.tagline,
      status: p.status,
      expertise: p.expertise,
    }));

  // Add chaos engine status
  const chaosStatus = chaosEngine ? chaosEngine.getStatus() : null;

  res.json({
    team,
    chaos: chaosStatus,
  });
});

/**
 * POST /api/ai/chat
 * Generate an AI response in a simulation channel.
 *
 * Body: { channel, message, senderType?, senderName?, channelMembers? }
 */
router.post('/chat', async (req, res) => {
  try {
    const {
      channel = 'general',
      message = '',
      senderType = 'user',
      senderName = req.user?.user_metadata?.full_name || 'You',
      channelMembers = ['kira', 'maya', 'ravi'],
    } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = generateResponse({
      channel,
      message,
      senderType,
      senderName,
      channelMembers,
    });

    const persona = Personas[result.personaId];

    const aiMessage = {
      id: `ai-msg-${Date.now()}`,
      simulation_id: req.body.simulation_id || null,
      channel,
      sender_id: `ai-${persona.id}`,
      sender_type: persona.senderType,
      sender_name: persona.name,
      avatar: persona.avatar,
      content: result.text,
      created_at: new Date().toISOString(),
    };

    // Save AI message — skip DB in dev mode (sender_id is not a real UUID)
    let saved = null;
    if (isDevUser(req)) {
      if (!DEV_MESSAGES[channel]) DEV_MESSAGES[channel] = [];
      DEV_MESSAGES[channel].push(aiMessage);
      saved = aiMessage;
    } else {
      const { data, error } = await supabase
        .from('sim_messages')
        .insert({
          simulation_id: aiMessage.simulation_id,
          channel: aiMessage.channel,
          sender_id: aiMessage.sender_id,
          sender_type: aiMessage.sender_type,
          sender_name: aiMessage.sender_name,
          avatar: aiMessage.avatar,
          content: aiMessage.content,
        })
        .select()
        .single();

      if (error) {
        console.error('[AI Chat] DB save error:', error);
      } else {
        saved = data;
      }
    }

    res.json({
      persona: {
        id: persona.id,
        name: persona.name,
        role: persona.role,
        avatar: persona.avatar,
        color: persona.color,
      },
      text: result.text,
      channel,
      saved,
    });
  } catch (err) {
    console.error('[AI Chat] Error:', err);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

/**
 * GET /api/ai/chat/history?channel=general
 * Get conversation history for a channel (from orchestrator memory).
 */
router.get('/chat/history', async (req, res) => {
  const { channel = 'general' } = req.query;
  const history = getHistory(channel);
  res.json({ channel, messages: history.slice(-30) });
});

/**
 * GET /api/ai/chaos/events
 * Recent chaos engine events.
 */
router.get('/chaos/events', async (req, res) => {
  if (!chaosEngine) {
    return res.json({ events: [] });
  }
  const events = chaosEngine.getRecentEvents(parseInt(req.query.limit) || 20);
  res.json({ events });
});

/**
 * GET /api/ai/chaos/status
 * Chaos engine status.
 */
router.get('/chaos/status', async (req, res) => {
  if (!chaosEngine) {
    return res.json({ active: false, totalIncidents: 0, activeIncidents: 0 });
  }
  res.json(chaosEngine.getStatus());
});

/**
 * POST /api/ai/chaos/trigger
 * Force a chaos incident (for testing or manual trigger).
 */
router.post('/chaos/trigger', async (req, res) => {
  if (!chaosEngine) {
    return res.status(503).json({ error: 'Chaos engine not initialized' });
  }
  chaosEngine.forceIncident();
  res.json({ triggered: true });
});

module.exports = { router, setChaosEngine };
