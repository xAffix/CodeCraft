/**
 * CodeCraft Portfolio Engine
 *
 * Generates a developer portfolio from completed work:
 *   - Completed tickets with difficulty and skills
 *   - Code reviews given/received
 *   - Incidents handled
 *   - Achievements (badges)
 *   - Skills graph snapshot
 */

class PortfolioEngine {
  constructor() {
    this.portfolios = new Map();
    this._seed('dev-user-000');
  }

  _seed(userId) {
    if (this.portfolios.has(userId)) return;

    this.portfolios.set(userId, {
      user_id: userId,
      displayName: 'Platform Engineer',
      title: 'Full-Stack Engineer',
      joinedAt: Date.now() - 86400000 * 14, // 2 weeks ago
      stats: {
        ticketsCompleted: 12,
        codeReviewsDone: 24,
        incidentsResolved: 7,
        linesOfCode: 3420,
        prsMerged: 15,
        uptime: '99.7%',
      },
      tickets: [
        { id: 'TICKET-42', title: 'Fix pagination bug on transaction history API', difficulty: 'medium', completedAt: Date.now() - 86400000, skills: ['React', 'TypeScript', 'API Design'] },
        { id: 'TICKET-40', title: 'Fix CORS configuration for production', difficulty: 'easy', completedAt: Date.now() - 86400000 * 3, skills: ['DevOps', 'Security'] },
        { id: 'TICKET-41', title: 'Implement session refresh middleware', difficulty: 'medium', completedAt: Date.now() - 86400000 * 5, skills: ['Node.js', 'Auth', 'Express'] },
        { id: 'TICKET-39', title: 'Add WebSocket heartbeat mechanism', difficulty: 'hard', completedAt: Date.now() - 86400000 * 8, skills: ['WebSockets', 'Node.js', 'Real-time'] },
        { id: 'TICKET-35', title: 'Build user settings panel', difficulty: 'medium', completedAt: Date.now() - 86400000 * 12, skills: ['React', 'Tailwind CSS', 'Form Validation'] },
      ],
      reviews: [
        { id: 'PR-47', title: 'Add input sanitization to Sim-Slack', reviewer: 'Kira Voss', verdict: 'approved', timestamp: Date.now() - 86400000 * 2 },
        { id: 'PR-45', title: 'Write unit tests for WebSocket handlers', reviewer: 'Kira Voss', verdict: 'changes_requested', timestamp: Date.now() - 86400000 * 4 },
        { id: 'PR-43', title: 'Add rate limiting to auth endpoints', reviewer: 'Ravi Patel', verdict: 'approved', timestamp: Date.now() - 86400000 * 7 },
        { id: 'PR-44', title: 'Update user profile avatar component', reviewer: 'Maya Chen', verdict: 'approved', timestamp: Date.now() - 86400000 * 10 },
      ],
      certifications: [
        { name: 'Sprint #12 Completion', icon: 'emoji_events', earnedAt: Date.now() - 86400000 * 1 },
        { name: 'First On-Call Rotation', icon: 'shield', earnedAt: Date.now() - 86400000 * 5 },
        { name: 'Code Quality Gate', icon: 'verified', earnedAt: Date.now() - 86400000 * 9 },
      ],
    });
  }

  getPortfolio(userId) {
    if (!this.portfolios.has(userId)) this._seed(userId);
    return this.portfolios.get(userId);
  }
}

module.exports = PortfolioEngine;
