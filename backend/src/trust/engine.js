/**
 * CodeCraft Trust Score Engine
 *
 * Calculates and tracks a user's Trust Score — a gamified metric
 * measuring reliability, code quality, incident response, and teamwork.
 *
 * Factors (weighted):
 *   - Code Quality (30%): PR approvals, clean merges, review feedback
 *   - Incident Response (25%): time-to-resolve, incidents handled
 *   - Sprint Reliability (25%): on-time delivery, scope stability
 *   - Collaboration (20%): peer reviews, helpful messages, pair programming
 *
 * Score ranges:
 *   0-40  → Junior (learning)
 *   41-60 → Mid (growing)
 *   61-80 → Senior (reliable)
 *   81-95 → Lead (trusted)
 *   96-100 → Principal (elite)
 */

class TrustScoreEngine {
  constructor() {
    // In-memory score state per user
    this.scores = new Map();
    this.history = new Map(); // userId -> array of { timestamp, total, factors }

    // Seed some baseline data for the demo user
    this._seed('dev-user-000');
  }

  _seed(userId) {
    if (this.scores.has(userId)) return;

    this.scores.set(userId, {
      user_id: userId,
      codeQuality: 72,
      incidentResponse: 68,
      sprintReliability: 85,
      collaboration: 60,
      total: 0, // calculated below
      level: '',
      recentEvents: [
        { type: 'code_review', description: 'PR #142 approved — pagination fix', delta: +3, timestamp: Date.now() - 3600000 },
        { type: 'incident', description: 'Resolved SEV-2: auth service latency spike (4.2m)', delta: +5, timestamp: Date.now() - 7200000 },
        { type: 'sprint', description: 'Delivered TICKET-42 on time', delta: +2, timestamp: Date.now() - 86400000 },
        { type: 'collaboration', description: 'Helped Ravi debug CI pipeline', delta: +1, timestamp: Date.now() - 172800000 },
      ],
      badges: [
        { id: 'first_merge', name: 'First Merge', icon: 'merge', unlocked: true },
        { id: 'incident_slayer', name: 'Incident Slayer', icon: 'shield', unlocked: true },
        { id: 'code_whisperer', name: 'Code Whisperer', icon: 'code', unlocked: false, progress: 65 },
        { id: 'sprint_champion', name: 'Sprint Champion', icon: 'emoji_events', unlocked: false, progress: 40 },
        { id: 'team_player', name: 'Team Player', icon: 'groups', unlocked: false, progress: 80 },
        { id: 'zero_bugs', name: 'Zero Bugs', icon: 'bug_report', unlocked: false, progress: 10 },
        { id: 'chaos_tamer', name: 'Chaos Tamer', icon: 'bolt', unlocked: false, progress: 55 },
        { id: 'centurion', name: 'Centurion (100)', icon: 'military_tech', unlocked: false, progress: 0 },
      ],
    });

    this._recalculate(userId);

    // Add history points
    this.history.set(userId, [
      { timestamp: Date.now() - 86400000 * 6, total: 62 },
      { timestamp: Date.now() - 86400000 * 5, total: 65 },
      { timestamp: Date.now() - 86400000 * 4, total: 68 },
      { timestamp: Date.now() - 86400000 * 3, total: 64 },
      { timestamp: Date.now() - 86400000 * 2, total: 70 },
      { timestamp: Date.now() - 86400000, total: 71 },
    ]);
  }

  _recalculate(userId) {
    const s = this.scores.get(userId);
    if (!s) return;

    s.total = Math.round(
      s.codeQuality * 0.30 +
      s.incidentResponse * 0.25 +
      s.sprintReliability * 0.25 +
      s.collaboration * 0.20
    );

    // Clamp
    s.total = Math.max(0, Math.min(100, s.total));

    // Level
    if (s.total >= 96) s.level = 'Principal Engineer';
    else if (s.total >= 81) s.level = 'Lead Engineer';
    else if (s.total >= 61) s.level = 'Senior Engineer';
    else if (s.total >= 41) s.level = 'Mid-Level Engineer';
    else s.level = 'Junior Engineer';
  }

  /**
   * Apply a score event for a user.
   */
  applyEvent(userId, event) {
    if (!this.scores.has(userId)) this._seed(userId);
    const s = this.scores.get(userId);

    const { factor, delta, description } = event;
    const validFactors = ['codeQuality', 'incidentResponse', 'sprintReliability', 'collaboration'];
    if (!validFactors.includes(factor)) return null;

    // Apply delta (with bounds)
    s[factor] = Math.max(0, Math.min(100, s[factor] + (delta || 0)));

    // Record event
    const record = {
      type: factor,
      description: description || `${factor} event`,
      delta: delta || 0,
      timestamp: Date.now(),
    };
    s.recentEvents = [record, ...s.recentEvents].slice(0, 50);

    // Recalculate total
    this._recalculate(userId);

    // Record history point
    if (!this.history.has(userId)) this.history.set(userId, []);
    this.history.get(userId).push({ timestamp: Date.now(), total: s.total });
    if (this.history.get(userId).length > 100) this.history.get(userId).shift();

    // Check badge progress
    this._updateBadges(userId);

    return { total: s.total, factor, newValue: s[factor], delta };
  }

  _updateBadges(userId) {
    const s = this.scores.get(userId);
    if (!s) return;

    // Update badge progress based on scores
    s.badges = s.badges.map(b => {
      if (b.unlocked) return b;
      let progress = b.progress;
      switch (b.id) {
        case 'code_whisperer':
          progress = Math.min(100, s.codeQuality);
          break;
        case 'sprint_champion':
          progress = Math.min(100, s.sprintReliability);
          break;
        case 'team_player':
          progress = Math.min(100, s.collaboration);
          break;
        case 'chaos_tamer':
          progress = Math.min(100, s.incidentResponse);
          break;
        case 'zero_bugs':
          progress = s.codeQuality > 80 ? Math.min(100, (s.codeQuality - 80) * 5) : 0;
          break;
        case 'centurion':
          progress = Math.min(100, s.total);
          break;
      }
      return { ...b, progress, unlocked: progress >= 100 };
    });
  }

  /**
   * Get current score snapshot for a user.
   */
  getScore(userId) {
    if (!this.scores.has(userId)) this._seed(userId);
    return this.scores.get(userId);
  }

  /**
   * Get score history for a user.
   */
  getHistory(userId, limit = 30) {
    if (!this.history.has(userId)) this._seed(userId);
    return (this.history.get(userId) || []).slice(-limit);
  }

  /**
   * Get all scores summary (leaderboard-style).
   */
  getAllScores() {
    return Array.from(this.scores.entries()).map(([id, s]) => ({
      user_id: id,
      total: s.total,
      level: s.level,
    })).sort((a, b) => b.total - a.total);
  }

  /**
   * Simulate score changes based on AI actions (called from orchestrator).
   */
  onCodeReview(userId) {
    this.applyEvent(userId, { factor: 'codeQuality', delta: 2, description: 'Reviewed a PR' });
  }

  onIncidentResolved(userId) {
    this.applyEvent(userId, { factor: 'incidentResponse', delta: 4, description: 'Resolved service incident' });
  }

  onTicketCompleted(userId) {
    this.applyEvent(userId, { factor: 'sprintReliability', delta: 3, description: 'Completed a sprint ticket' });
  }

  onCollaboration(userId) {
    this.applyEvent(userId, { factor: 'collaboration', delta: 1, description: 'Helped a team member' });
  }
}

module.exports = TrustScoreEngine;
