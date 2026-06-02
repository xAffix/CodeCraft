/**
 * CodeCraft AI Orchestrator
 *
 * Generates contextual AI responses for each persona based on:
 * - The channel/context the message is in
 * - Recent conversation history
 * - The specific persona's domain and response pool
 * - Random variants to keep replies feeling organic
 *
 * Also handles which persona should respond to which event types.
 */

const { Personas, getResponse } = require('./personas');

// --- Context Detection ---

function detectContext(channel, message, conversationHistory = []) {
  const lower = (message || '').toLowerCase();
  const history = conversationHistory.slice(-5).map(m => (m.content || '').toLowerCase()).join(' ');

  // Check for ticket references
  const ticketMatch = (message || '').match(/TICKET-(\d+)/i);
  const ticketId = ticketMatch ? ticketMatch[1] : null;

  // Context type classification
  if (/\bhello\b|\bhey\b|\bmorning\b|\bhi\b|\byo\b|\bsup\b/i.test(lower) && history.length < 20) {
    return { type: 'greeting', ticketId };
  }
  if (/\breview\b|\bpr\b|\bmerge\b|\bapproved?\b|\bcode\s+review\b/i.test(lower)) {
    return { type: 'code_review', ticketId };
  }
  if (/\barch\b|architecture|design|pattern|refactor|data.?flow/i.test(lower)) {
    return { type: 'architecture', ticketId };
  }
  if (/\bbug\b|error|crash|broken|failing|stack.?trace|exception|debug/i.test(lower)) {
    return { type: 'debugging', ticketId };
  }
  if (/\bconflict\b|merge|rebase|conflicting/i.test(lower)) {
    return { type: 'merge_conflict', ticketId };
  }
  if (/\bplan\b|sprint|estimate|story.?point|velocity|commitment/i.test(lower)) {
    return { type: 'planning', ticketId };
  }
  if (/\bstatus\b|eta|progress|update|where.+(at|we).+on\b|how.+(going|coming)/i.test(lower)) {
    return { type: 'status_check', ticketId };
  }
  if (/\bscope\b|creep|feature|add\b|new\s+thing|icebox/i.test(lower)) {
    return { type: 'scope_creep', ticketId };
  }
  if (/\bgood\b|nice|great|awesome|thanks|thank|appreciate/i.test(lower)) {
    return { type: 'motivation', ticketId };
  }

  return { type: 'default', ticketId };
}

// --- Conversation History Tracking (in-memory) ---

const conversationMemory = new Map(); // channel -> array of { sender, content, personaId?, timestamp }

function addToHistory(channel, entry) {
  if (!conversationMemory.has(channel)) {
    conversationMemory.set(channel, []);
  }
  const history = conversationMemory.get(channel);
  history.push({ ...entry, timestamp: Date.now() });
  // Keep last 20 messages per channel
  if (history.length > 20) history.shift();
}

function getHistory(channel) {
  return conversationMemory.get(channel) || [];
}

// --- Persona Routing Logic ---

function selectResponder(channel, context, channelMembers = ['kira', 'maya', 'ravi', 'system']) {
  const { type } = context;

  // Map context types to personas
  const routing = {
    greeting: ['kira', 'maya', 'ravi'],
    code_review: ['kira', 'ravi'],
    architecture: ['kira'],
    debugging: ['ravi', 'kira'],
    merge_conflict: ['ravi'],
    planning: ['maya'],
    status_check: ['maya', 'kira'],
    scope_creep: ['maya'],
    motivation: ['kira', 'maya', 'ravi'],
    default: ['ravi', 'kira', 'maya'],
  };

  const candidates = routing[type] || routing.default;
  // Filter to only available members, then pick randomly
  const available = candidates.filter(c => channelMembers.includes(c));
  if (available.length === 0) return channelMembers[0];

  return available[Math.floor(Math.random() * available.length)];
}

// --- Main Orchestration ---

function generateResponse({
  channel = 'general',
  message = '',
  senderType = 'user',
  senderName = 'You',
  channelMembers = ['kira', 'maya', 'ravi'],
}) {
  const history = getHistory(channel);

  // Track this message
  addToHistory(channel, { sender: senderName, content: message, personaId: senderType });

  // Detect context
  const context = detectContext(channel, message, history);
  const personaId = selectResponder(channel, context, channelMembers);
  const persona = Personas[personaId];

  // Generate response
  const text = getResponse(personaId, context.type, { id: context.ticketId || 'XX' });

  if (!text) {
    return { personaId, text: (persona.responses.default || ['Interesting. Let me look into that.'])[0] };
  }

  // Track the response in history
  addToHistory(channel, { sender: persona.name, content: text, personaId });

  return { personaId, text };
}

// --- Chaos Response Generation ---

function generateChaosResponse(event) {
  const { type, severity, service, details } = event;

  const messages = {
    pager: [
      `🔴 **PAGER ALERT** — ${service} latency spike detected (${severity.toUpperCase()}). Current p99: ${details.latency || '2.3s'}. Auto-scaling triggered.`,
      `🚨 **CRITICAL** — ${service} is returning 503s. Alarm: "${details.error || 'HighErrorRate'}". On-call engineer notified.`,
      `⚠️ **WARNING** — ${service} memory at ${details.memoryUsage || '87%'}. GC cycle taking ${details.gcTime || '450ms'}. Investigating...`,
      `🔥 **ON FIRE** — ${service} CPU at ${details.cpuSpike || '92%'}. Requests queuing. Incident INC-${details.incidentId || '001'} opened.`,
    ],
    degradation: [
      `📉 **Service Degradation** — ${service} response times increased by ${details.increase || '340%'}. Tracing shows a DB connection pool exhaustion.`,
      `⚠️ ${service} is running in degraded mode. ${details.failover || 'Failing over to read replica'} — ETA ${details.eta || '5m'}.`,
      `🔄 **Degraded** — ${service} requests are being rate-limited at ${details.rateLimit || '100/min'}. Normal capacity: ${details.normalCapacity || '5000/min'}.`,
    ],
    rollback: [
      `↩️ **Rollback Initiated** — ${service} deployment v${details.version || '2.3.1'} to v${details.rollbackVersion || '2.3.0'}. Cause: "${details.reason || 'Metric regression detected'}"`,
      `⏪ **Auto-Rollback** — Canary analysis failed for ${service}. ${details.canaryMetric || 'Error rate'} exceeded threshold (${details.threshold || '0.5%'}). Deploy reverted.`,
      `🔄 **Rollback Complete** — ${service} restored to v${details.rollbackVersion || '2.3.0'}. All health checks passing. Incident report being generated.`,
    ],
    resolved: [
      `✅ **Incident Resolved** — ${service} is healthy. Incident INC-${details.incidentId || '001'} closed. Post-mortem scheduled for tomorrow at ${details.postmortemTime || '10:00 AM'}.`,
      `🟢 **All Clear** — ${service} latency returned to baseline (p99: ${details.latencyAfter || '120ms'}). Auto-scaling scaled back to ${details.replicas || '3'} replicas.`,
      `✅ **Resolved** — ${service} back to nominal. Runbook updated with new alert thresholds.`,
    ],
  };

  const pool = messages[type] || messages.pager;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// --- Incident Templates ---

const incidentTemplates = [
  {
    type: 'pager',
    service: 'auth-service',
    severity: 'critical',
    details: { latency: '2.8s', error: 'HighErrorRate', incidentId: null },
  },
  {
    type: 'pager',
    service: 'payment-api',
    severity: 'high',
    details: { memoryUsage: '91%', gcTime: '520ms', incidentId: null },
  },
  {
    type: 'degradation',
    service: 'user-service',
    severity: 'medium',
    details: { increase: '280%', failover: 'Failing over to read replica', eta: '3m' },
  },
  {
    type: 'degradation',
    service: 'notification-queue',
    severity: 'medium',
    details: { rateLimit: '50/min', normalCapacity: '2000/min' },
  },
  {
    type: 'rollback',
    service: 'api-gateway',
    severity: 'high',
    details: { version: '2.4.0', rollbackVersion: '2.3.2', reason: '504 error rate > 5%', canaryMetric: 'Error rate', threshold: '0.5%' },
  },
  {
    type: 'degradation',
    service: 'database-writer',
    severity: 'critical',
    details: { cpuSpike: '96%', connectionPool: 'exhausted', latency: '4.1s' },
  },
  {
    type: 'pager',
    service: 'cache-cluster',
    severity: 'high',
    details: { error: 'CacheMissRateSpike', latency: '1.9s', incidentId: null },
  },
  {
    type: 'rollback',
    service: 'websocket-gateway',
    severity: 'medium',
    details: { version: '1.8.0', rollbackVersion: '1.7.5', reason: 'Connection drop rate increased 15%' },
  },
];

let incidentCounter = 0;

function generateIncident() {
  incidentCounter++;
  const template = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)];
  return {
    ...template,
    details: {
      ...template.details,
      incidentId: `${String(incidentCounter).padStart(3, '0')}`,
    },
    id: `inc-${incidentCounter}`,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  generateResponse,
  generateChaosResponse,
  generateIncident,
  getHistory,
  addToHistory,
  Personas,
};
