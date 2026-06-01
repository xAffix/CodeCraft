const WebSocket = require('ws');
const { verifyToken } = require('../middleware/auth');

/**
 * Set up WebSocket server for real-time features:
 * - Sim-Slack messaging
 * - Terminal output streams
 * - Live telemetry / metrics
 * - Chaos Engine events
 */
function setupWebSocket(server) {
  const wss = new WebSocket.Server({
    server,
    path: '/ws',
  });

  // Track connected clients by user ID
  const clients = new Map();

  wss.on('connection', async (ws, req) => {
    // Extract token from URL query params: ws://host/ws?token=xxx
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    let userId = null;

    if (token) {
      const user = await verifyToken(token);
      if (user) {
        userId = user.id;
        // Register client
        if (!clients.has(userId)) {
          clients.set(userId, new Set());
        }
        clients.get(userId).add(ws);
        console.log(`[WS] User ${userId} connected`);
      }
    }

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      status: userId ? 'authenticated' : 'anonymous',
      userId,
    }));

    // Handle incoming messages
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;

          case 'chat:send':
            handleChatMessage(ws, userId, msg, clients);
            break;

          case 'terminal:input':
            handleTerminalInput(ws, userId, msg);
            break;

          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: `Unknown message type: ${msg.type}`,
            }));
        }
      } catch (err) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }));
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      if (userId && clients.has(userId)) {
        clients.get(userId).delete(ws);
        if (clients.get(userId).size === 0) {
          clients.delete(userId);
        }
      }
      console.log(`[WS] User ${userId || 'anonymous'} disconnected`);
    });

    // Handle errors
    ws.on('error', (err) => {
      console.error(`[WS] Error for user ${userId}:`, err.message);
    });
  });

  /**
   * Broadcast a message to all clients of a specific user.
   */
  function sendToUser(targetUserId, message) {
    if (clients.has(targetUserId)) {
      const payload = JSON.stringify(message);
      for (const client of clients.get(targetUserId)) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    }
  }

  /**
   * Broadcast to ALL connected clients (e.g., system-wide alerts).
   */
  function broadcast(message) {
    const payload = JSON.stringify(message);
    for (const [, userClients] of clients) {
      for (const client of userClients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    }
  }

  /**
   * Handle Sim-Slack chat messages.
   */
  async function handleChatMessage(ws, userId, msg, clients) {
    const { channel, text } = msg.payload || {};

    if (!channel || !text) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Chat messages require channel and text',
      }));
      return;
    }

    // Broadcast to all clients in the same simulation
    // (In production, scope this to simulation_id)
    broadcast({
      type: 'chat:message',
      payload: {
        channel,
        user: userId,
        text,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Handle terminal input forwarding.
   */
  function handleTerminalInput(ws, userId, msg) {
    const { command, sessionId } = msg.payload || {};
    console.log(`[WS] Terminal input from ${userId} on session ${sessionId}: ${command}`);

    // In Phase 2, this will forward to the workspace container
    ws.send(JSON.stringify({
      type: 'terminal:output',
      payload: {
        sessionId,
        output: `\r\n$ ${command}\r\n`,
      },
    }));
  }

  console.log(`[WS] WebSocket server ready on /ws`);

  return { wss, sendToUser, broadcast };
}

module.exports = { setupWebSocket };
