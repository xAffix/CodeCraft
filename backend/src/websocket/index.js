/**
 * CodeCraft WebSocket Server
 *
 * Handles real-time communication:
 * - chat:send / chat:message — user-to-user and user-to-AI messaging
 * - ai:message — AI persona sends a message
 * - chaos:alert / chaos:resolved — chaos engine incidents
 *
 * The orchestrator is called when users send messages in
 * simulation channels to generate AI persona responses.
 */

const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { generateResponse, Personas } = require('../ai/orchestrator');

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Set();

  function broadcast(event) {
    const data = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }

  function authenticate(connectionParams) {
    try {
      // Try to find token in URL params or header
      const urlParams = new URLSearchParams(connectionParams);
      const token = urlParams.get('token');
      if (!token) return null;
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch {
      return null;
    }
  }

  function handleChatSend(ws, payload) {
    const { channel, text, senderType = 'user', senderName = 'You' } = payload;

    if (!channel || !text) return;

    // Broadcast user message
    const userMsgEvent = {
      type: 'chat:message',
      payload: {
        channel,
        text,
        sender_type: senderType,
        sender_name: senderName,
        timestamp: new Date().toISOString(),
      },
    };
    broadcast(userMsgEvent);

    // Generate AI response(s) via orchestrator
    // 70% chance an AI responds, 30% chance silence (like real life)
    if (Math.random() < 0.7) {
      const aiResult = generateResponse({
        channel,
        message: text,
        senderType,
        senderName,
        channelMembers: ['kira', 'maya', 'ravi'],
      });

      const persona = Personas[aiResult.personaId];
      const delay = 1000 + Math.floor(Math.random() * 2500); // 1-3.5s delay

      setTimeout(() => {
        const aiMsgEvent = {
          type: 'ai:message',
          payload: {
            channel,
            text: aiResult.text,
            persona_id: persona.id,
            persona_name: persona.name,
            persona_role: persona.role,
            sender_type: persona.senderType,
            avatar: persona.avatar,
            color: persona.color,
            timestamp: new Date().toISOString(),
          },
        };
        broadcast(aiMsgEvent);
      }, delay);
    }
  }

  wss.on('connection', (ws, req) => {
    // Parse token from URL
    const url = new URL(req.url, 'http://localhost');
    const user = authenticate(url.searchParams.toString());

    clients.add(ws);
    console.log(`[WS] Client connected${user ? ` (user: ${user.sub || 'unknown'})` : ''}`);

    // Send connection confirmation
    ws.send(JSON.stringify({ type: 'connection:established', payload: { timestamp: new Date().toISOString() } }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case 'chat:send':
            handleChatSend(ws, msg.payload);
            break;

          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;

          default:
            console.log(`[WS] Unknown message type: ${msg.type}`);
        }
      } catch (err) {
        console.error('[WS] Error handling message:', err.message);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('[WS] Client disconnected');
    });

    ws.on('error', () => {
      clients.delete(ws);
    });
  });

  console.log(`[WS] WebSocket server ready on /ws`);

  return { wss, broadcast, clients };
}

module.exports = { setupWebSocket };
