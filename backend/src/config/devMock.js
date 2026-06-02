/**
 * CodeCraft Dev Mock Helpers
 *
 * In dev mode, the request user is a stub (`dev-user-000`) that doesn't
 * exist in Supabase. Database queries that filter by UUID columns would
 * crash with "invalid input syntax for type uuid". Rather than coerce
 * IDs, these helpers let routes return realistic mock data so the dev
 * experience mirrors a real user with seeded sample data.
 */

const isDevUser = (req) => req?.user?.id === 'dev-user-000';

const DEV_USER_ID = 'dev-user-000';

const DEV_PROFILE = {
  id: DEV_USER_ID,
  email: 'dev@codecraft.dev',
  display_name: 'Dev Engineer',
  avatar_url: null,
  trust_score: 72,
  current_simulation_id: 'sim-fintechfast-12',
  preferences: { theme: 'dark', notifications: true },
  created_at: '2025-12-15T10:00:00.000Z',
  updated_at: '2026-06-02T10:00:00.000Z',
};

const DEV_TICKETS = [
  {
    id: 'TICKET-42',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Fix pagination bug on transaction history API',
    description: 'When offset > 100, the API returns duplicates. Suspect an off-by-one error in the cursor logic.',
    status: 'IN_REVIEW',
    priority: 'high',
    difficulty: 'medium',
    acceptance_criteria: [
      'Offset 0..1000 returns unique rows',
      'No duplicates across page boundaries',
      'Response time < 200ms at p95',
    ],
    labels: ['backend', 'bug', 'pagination'],
    created_at: '2026-05-25T09:30:00.000Z',
    updated_at: '2026-05-31T14:20:00.000Z',
  },
  {
    id: 'TICKET-40',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Fix CORS configuration for production',
    description: 'Production domain not in allowed origins. Need to update the allowlist and verify preflight requests.',
    status: 'DONE',
    priority: 'medium',
    difficulty: 'easy',
    acceptance_criteria: [
      'app.fintechfast.com allowed',
      'Preflight OPTIONS returns 204',
      'Credentials flag respected',
    ],
    labels: ['devops', 'security'],
    created_at: '2026-05-20T11:00:00.000Z',
    updated_at: '2026-05-22T15:00:00.000Z',
  },
  {
    id: 'TICKET-41',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Implement session refresh middleware',
    description: 'Tokens expire after 1h. Add a refresh interceptor on the API client that silently renews the JWT.',
    status: 'DONE',
    priority: 'high',
    difficulty: 'medium',
    acceptance_criteria: [
      'Refresh triggered when < 5min remain',
      'No failed requests during refresh',
      'Works in both browser and Node',
    ],
    labels: ['backend', 'auth'],
    created_at: '2026-05-15T08:00:00.000Z',
    updated_at: '2026-05-18T17:00:00.000Z',
  },
  {
    id: 'TICKET-39',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Add WebSocket heartbeat mechanism',
    description: 'Idle WebSocket connections die after 60s. Add ping/pong to keep them alive.',
    status: 'DONE',
    priority: 'medium',
    difficulty: 'hard',
    acceptance_criteria: [
      'Heartbeat every 30s',
      'Reconnect on missed pong',
      'No memory leak after 1h uptime',
    ],
    labels: ['backend', 'websockets', 'realtime'],
    created_at: '2026-05-10T13:00:00.000Z',
    updated_at: '2026-05-13T16:00:00.000Z',
  },
  {
    id: 'TICKET-43',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Add rate limiting to auth endpoints',
    description: 'Brute force protection: limit /api/auth/login to 5 attempts per minute per IP.',
    status: 'TODO',
    priority: 'high',
    difficulty: 'medium',
    acceptance_criteria: [
      '5 req/min/IP for login',
      '10 req/min/IP for signup',
      '429 response with Retry-After',
    ],
    labels: ['backend', 'security', 'rate-limiting'],
    created_at: '2026-05-30T10:00:00.000Z',
    updated_at: '2026-05-30T10:00:00.000Z',
  },
  {
    id: 'TICKET-44',
    simulation_id: 'sim-fintechfast-12',
    assignee_id: DEV_USER_ID,
    title: 'Refactor user profile avatar component',
    description: 'The avatar component is 400 lines and has too many props. Split into Avatar + AvatarGroup + AvatarUpload.',
    status: 'IN_PROGRESS',
    priority: 'low',
    difficulty: 'medium',
    acceptance_criteria: [
      'Component < 150 lines each',
      'No prop drilling',
      'Storybook stories for all states',
    ],
    labels: ['frontend', 'refactor'],
    created_at: '2026-05-28T09:00:00.000Z',
    updated_at: '2026-06-01T11:00:00.000Z',
  },
];

const DEV_MESSAGES = {
  general: [
    {
      id: 'msg-1',
      channel: 'general',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-maya',
      sender_type: 'ai',
      sender_name: 'Maya Chen',
      avatar: 'account_tree',
      content: "Morning team! Sprint #12 kickoff. We have 6 tickets in the queue, with TICKET-42 being the priority. Let's aim for a clean merge on Wednesday.",
      created_at: '2026-06-01T09:00:00.000Z',
    },
    {
      id: 'msg-2',
      channel: 'general',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-kira',
      sender_type: 'ai',
      sender_name: 'Kira Voss',
      avatar: 'smart_toy',
      content: "I'll be doing a code review on the pagination fix. Make sure to include unit tests covering the offset boundary cases — I want to see coverage for offsets 99, 100, 101 explicitly.",
      created_at: '2026-06-01T09:05:00.000Z',
    },
    {
      id: 'msg-3',
      channel: 'general',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-ravi',
      sender_type: 'ai',
      sender_name: 'Ravi Patel',
      avatar: 'group',
      content: "Heads up — I just merged the CORS config to staging. Should be live in 5 min. If you see weird 401s, that's probably why.",
      created_at: '2026-06-01T09:10:00.000Z',
    },
  ],
  tickets: [
    {
      id: 'msg-4',
      channel: 'tickets',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-maya',
      sender_type: 'ai',
      sender_name: 'Maya Chen',
      avatar: 'account_tree',
      content: "Updated TICKET-42 acceptance criteria. We also need to handle cursor-based pagination, not just offset. Let me know if that changes your estimate.",
      created_at: '2026-06-01T11:30:00.000Z',
    },
  ],
  random: [],
  standup: [
    {
      id: 'msg-5',
      channel: 'standup',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-ravi',
      sender_type: 'ai',
      sender_name: 'Ravi Patel',
      avatar: 'group',
      content: "Yesterday: finished CORS fix, reviewed PR for the WebSocket heartbeat. Today: pairing on rate limiter, then the avatar refactor.",
      created_at: '2026-06-02T09:00:00.000Z',
    },
    {
      id: 'msg-6',
      channel: 'standup',
      simulation_id: 'sim-fintechfast-12',
      sender_id: 'ai-kira',
      sender_type: 'ai',
      sender_name: 'Kira Voss',
      avatar: 'smart_toy',
      content: "Yesterday: reviewed 3 PRs, blocked one for missing test coverage. Today: 1:1s, then deep-dive on the rate limiter design.",
      created_at: '2026-06-02T09:02:00.000Z',
    },
  ],
};

module.exports = {
  isDevUser,
  DEV_USER_ID,
  DEV_PROFILE,
  DEV_TICKETS,
  DEV_MESSAGES,
};
