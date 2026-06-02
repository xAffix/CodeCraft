/**
 * CodeCraft Chaos Engine
 *
 * Background process that generates realistic production incidents
 * at random intervals. Fires events via WebSocket broadcast and
 * maintains an incident log.
 *
 * Incidents simulate: pager alerts, service degradation, rollbacks,
 * and resolution events.
 */

const { generateIncident, generateChaosResponse } = require('./orchestrator');

class ChaosEngine {
  constructor(broadcastFn) {
    this.broadcast = broadcastFn;
    this.active = false;
    this.timer = null;
    this.incidents = [];
    this.activeIncidents = [];
    this.minInterval = 120000;   // 2 min minimum between incidents
    this.maxInterval = 300000;   // 5 min maximum
    this.autoResolveDelay = 60000; // 60s auto-resolve
    this._initialDelay = 45000;  // First incident after 45s
    this._customInterval = null;
  }

  start() {
    if (this.active) return;
    this.active = true;
    console.log('[Chaos Engine] Activated — incidents will occur every 2–5 minutes');
    this._schedule(this._initialDelay);
  }

  stop() {
    this.active = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    console.log('[Chaos Engine] Deactivated');
  }

  // Allow tests to set a faster interval
  setDebugInterval(ms) {
    this._customInterval = ms;
    if (this.active) {
      clearTimeout(this.timer);
      this._schedule(ms);
    }
  }

  _schedule(delay) {
    if (!this.active) return;
    const interval = delay || this._customInterval ||
      (this.minInterval + Math.floor(Math.random() * (this.maxInterval - this.minInterval)));

    this.timer = setTimeout(() => this._fire(), interval);
  }

  _fire() {
    if (!this.active) return;

    const incident = generateIncident();
    const text = generateChaosResponse(incident);
    const isResolved = incident.type === 'resolved';

    const event = {
      type: isResolved ? 'chaos:resolved' : 'chaos:alert',
      payload: {
        ...incident,
        text,
        channel: 'general',
        timestamp: new Date().toISOString(),
      },
    };

    this.incidents.push(event);
    if (!isResolved) {
      this.activeIncidents.push(event);
      // Schedule auto-resolve
      setTimeout(() => this._resolve(incident.id), this.autoResolveDelay);
    }

    // Broadcast via WebSocket
    if (this.broadcast) {
      this.broadcast(event);
    }

    console.log(`[Chaos Engine] ${isResolved ? '🔵 Resolved' : '🔴 Incident'}: ${incident.service} — ${incident.type}`);

    // Schedule next incident
    this._schedule();
  }

  _resolve(incidentId) {
    this.activeIncidents = this.activeIncidents.filter(inc => inc.payload.id !== incidentId);

    const resolveEvent = {
      type: 'chaos:resolved',
      payload: {
        id: `res-${incidentId}`,
        resolvedIncidentId: incidentId,
        text: `🟢 Incident ${incidentId} has been automatically resolved. All systems nominal.`,
        timestamp: new Date().toISOString(),
      },
    };

    this.incidents.push(resolveEvent);

    if (this.broadcast) {
      this.broadcast(resolveEvent);
    }
  }

  getStatus() {
    return {
      active: this.active,
      totalIncidents: this.incidents.length,
      activeIncidents: this.activeIncidents.length,
      incidents: this.incidents.slice(-10),
    };
  }

  forceIncident() {
    this._fire();
  }

  getRecentEvents(limit = 20) {
    return this.incidents.slice(-limit);
  }
}

module.exports = ChaosEngine;
