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
const workspaceRoutes = require('./routes/workspace');
const messageRoutes = require('./routes/messages');
const executeRoutes = require('./routes/execute');
const aiRoutes = require('./routes/ai');
const trustRoutes = require('./routes/trust');
const skillsRoutes = require('./routes/skills');
const portfolioRoutes = require('./routes/portfolio');
const { setupWebSocket } = require('./websocket');
const ChaosEngine = require('./ai/chaos');
const TrustScoreEngine = require('./trust/engine');
const SkillGraphEngine = require('./skills/engine');
const PortfolioEngine = require('./portfolio/engine');

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
app.use('/api/workspace', workspaceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/ai', aiRoutes.router);
app.use('/api/trust', trustRoutes.router);
app.use('/api/skills', skillsRoutes.router);
app.use('/api/portfolio', portfolioRoutes.router);

// ─── Error Handling ───────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── WebSocket ────────────────────────────────────────────

const { broadcast } = setupWebSocket(server);

// ─── Chaos Engine Init ────────────────────────────────────

const chaosEngine = new ChaosEngine(broadcast);
aiRoutes.setChaosEngine(chaosEngine);
chaosEngine.start();

// ─── Trust Score Engine Init ──────────────────────────────

const trustEngine = new TrustScoreEngine();
trustRoutes.setTrustEngine(trustEngine);

// ─── Skill Graph Engine Init ──────────────────────────────

const skillsEngine = new SkillGraphEngine();
skillsRoutes.setSkillsEngine(skillsEngine);

// ─── Portfolio Engine Init ────────────────────────────────

const portfolioEngine = new PortfolioEngine();
portfolioRoutes.setPortfolioEngine(portfolioEngine);

// ─── Workspace Manager Init ───────────────────────────────

const { init: initWorkspaceManager } = require('./workspace/manager');
initWorkspaceManager();

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
