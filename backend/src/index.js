const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.createServer(app);

// ─── Middleware ────────────────────────────────────────────

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(morgan(config.server.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── Routes ───────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// ─── Error Handling ───────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── WebSocket ────────────────────────────────────────────

const { broadcast } = setupWebSocket(server);

// ─── Start Server ─────────────────────────────────────────

server.listen(config.server.port, () => {
  console.log(`
╔══════════════════════════════════════════╗
║          CodeCraft API Server            ║
╠══════════════════════════════════════════╣
║  HTTP:    http://localhost:${String(config.server.port).padStart(5)}  ║
║  WS:      ws://localhost:${config.server.port}/ws        ║
║  Env:     ${config.server.nodeEnv.padEnd(31)}║
║  CORS:    ${config.cors.origin.padEnd(31)}║
╚══════════════════════════════════════════╝
  `);
});

module.exports = { app, server, broadcast };
