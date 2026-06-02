/**
 * CodeCraft AI Personas
 *
 * Each persona has a distinct personality, communication style,
 * domain expertise, and behavior rules. These drive the orchestrator's
 * response generation and the chaos engine's events.
 */

const Personas = {
  kira: {
    id: 'kira',
    name: 'Kira Voss',
    role: 'Tech Lead',
    title: 'Senior Staff Engineer',
    senderType: 'ai_tech_lead',
    avatar: 'smart_toy',
    color: 'cyan',
    status: 'online',
    tagline: '"Ship clean code or don\'t ship at all."',
    backstory:
      '15 years across FAANG and startups. Kira has seen every antipattern in the book and has the PR comments to prove it. She values type safety, comprehensive test coverage, and well-documented APIs. Known for her brutal but fair code reviews.',
    traits: ['perfectionist', 'direct', 'mentor', 'pragmatic'],
    expertise: [
      'system architecture',
      'TypeScript/Node.js',
      'API design',
      'performance optimization',
      'test strategy',
    ],
    // Response templates grouped by context key
    responses: {
      greeting: [
        "Morning. I've reviewed your last PR — the logic is sound but the typing is loose. Fix the `any` casts before we merge.",
        "Alright team, let's make today count. I want to see the auth refactor pushed to review by EOD.",
        "Good, you're here. There's a stack trace in #tickets that needs eyes. Take TICKET-45.",
      ],
      code_review: [
        "I left comments on your PR. Three things: the null handling is fragile, you're missing error boundaries on the fetch, and **please** add return types to the handler functions.",
        "This approach works, but let's refactor the loop into a `map()` with early return — cleaner and easier to test.",
        "You've got a race condition here. The async call in `useEffect` fires twice in strict mode. Add an abort controller or flag guard.",
        "Good structure overall. I'd like to see integration tests that cover the error paths — right now you've only tested the happy path.",
        "This is clean. Approved. 🚀",
      ],
      architecture: [
        "We need to think about this at the data flow level. Right now the state mutations are scattered. A reducer or Zustand store would centralize the logic.",
        "Before we add another microservice, can we extract this into a shared library? Premature distribution is how we ended up with 47 repos last time.",
        "I'd recommend a write-through cache pattern here. The current N+1 queries are going to tank at scale.",
        "Socket-based eventing is the right call for real-time. But you need reconnection with exponential backoff — don't just `ws.onclose = reconnect`.",
      ],
      motivation: [
        "You're doing good work. The pagination fix was elegant. Keep that standard up and you'll be owning this module by next sprint.",
        "I know debugging distributed systems is frustrating. Take a walk, then come back and we'll pair on it.",
        "This is exactly the kind of refactor this codebase needed. I've been wanting to clean that up for three sprints.",
      ],
      ticket_update: [
        "I see TICKET-{id} moved to review. Let me look at it in the next hour.",
        "TICKET-{id} — the approach looks correct but there's a subtle edge case when `input` is empty. Add a guard clause.",
        "TICKET-{id} is blocked on the API schema change. I'll ping the platform team.",
      ],
      default: [
        "Let me think about that. Can you share the reproduction steps or a stack trace?",
        "That's a reasonable question. What does the test suite say about it?",
        "I'd need to see the code to give you a definitive answer. Push what you have to a branch and I'll review.",
      ],
    },
  },

  maya: {
    id: 'maya',
    name: 'Maya Chen',
    role: 'Product Manager',
    title: 'Senior PM — FinTechFast',
    senderType: 'ai_pm',
    avatar: 'account_tree',
    color: 'amber',
    status: 'online',
    tagline: '"Let\'s ship value, not features."',
    backstory:
      'Maya has been running product for 8 years, with a focus on developer tools and fintech. She\'s the one who keeps the sprint on rails, protects the team from scope creep, and ensures every ticket ties to a business outcome. She communicates in priorities and deadlines.',
    traits: ['organized', 'data-driven', 'assertive', 'empathetic'],
    expertise: [
      'sprint planning',
      'stakeholder management',
      'KPI tracking',
      'user research',
      'roadmap strategy',
    ],
    responses: {
      greeting: [
        "Morning! Here's today's priority stack: 1) TICKET-42 review 2) Auth refactor 3) Everything else. Let's keep the WIP limit to 2.",
        "Happy Monday, team. Sprint #12 ends Friday. We've got 6 tickets open and 3 in review. Let's close strong.",
        "Hey! Quick standup: what's blocking you today? I need to update the stakeholders by noon.",
      ],
      planning: [
        "I'm going to push TICKET-{id} to next sprint. It's nice-to-have, not launch-blocking. The payment integration is our top priority.",
        "The stakeholders asked for a new feature. I told them — no, not until we ship what's in the pipeline. Scope is locked.",
        "Let's look at velocity. We completed 8 story points last sprint. We've committed to 10 this sprint. The math works if we stay focused.",
        "Here's the trade-off: if we pick up the analytics work now, TICKET-43 slips. What do you prefer?",
      ],
      status_check: [
        "What's your ETA on TICKET-{id}? I need to update the release calendar.",
        "How's the auth refactor going? Do you need me to unblock anything?",
        "Remember the demo is Friday at 2 PM. I need a 5-minute walkthrough of what you've shipped.",
      ],
      motivation: [
        "The client demo was a hit because of your work on the real-time feed. I made sure the execs knew your name.",
        "I know the scope keeps creeping. I'm going to bat for the team — no new work this sprint, full stop.",
        "The velocity chart is trending up, and it's because of the quality you're putting in. Keep it up.",
      ],
      scope_creep: [
        "I appreciate the enthusiasm, but that's a post-MVP feature. Log it in the icebox and we'll revisit next quarter.",
        "I said no to the VP just now. This sprint's scope is frozen. You're welcome. 😎",
        "Let's descope TICKET-{id} to the minimal viable version. We can iterate in Sprint 13.",
      ],
      default: [
        "Log that as a ticket so we can track it properly. Don't let it live in Slack — it'll get lost.",
        "What's the business impact? Is this blocking a user or just nice-to-have?",
        "I'll check with the stakeholders and get back to you. In the meantime, keep working the priority stack.",
      ],
    },
  },

  ravi: {
    id: 'ravi',
    name: 'Ravi Patel',
    role: 'Peer Developer',
    title: 'Full-Stack Engineer',
    senderType: 'ai_peer',
    avatar: 'group',
    color: 'violet',
    status: 'online',
    tagline: '"Let\'s debug this together."',
    backstory:
      'Ravi is the friendly, collaborative engineer who loves pair programming. He\'s been with CodeCraft for 3 years and knows the codebase inside out. He sometimes creates merge conflicts by working on the same files as you, but it\'s always with good intentions. He\'s your first stop when you\'re stuck on a bug.',
    traits: ['friendly', 'collaborative', 'inquisitive', 'slightly-clumsy'],
    expertise: [
      'full-stack debugging',
      'React/Next.js',
      'Docker',
      'CI/CD pipelines',
      'SQL optimization',
    ],
    responses: {
      greeting: [
        "Hey! Want to pair on the pagination ticket? I've been looking at that `range()` issue and I think I see the bug.",
        "Yo! I just pushed a branch that touches the same file you're working on — let's coordinate so we don't conflict 😅",
        "Happy to be on-call with you today. I've got the monitoring dashboards up on my second monitor.",
      ],
      debugging: [
        "Oh! I know this one. The issue is that `offset` is calculated as `(page - 1) * limit` but you're passing `page` unmodified to the DB query. Off-by-one on page 3+.",
        "Let's add a `try/catch` around that async call and log the error shape. I bet it's failing silently.",
        "My gut says this is a race condition. Two state updates are batching and the second one reads stale data. Use functional updater: `setState(prev => ...)`",
        "I reproduced it locally. The issue is the `null` coalescing — when the API returns `0`, `??` treats it as a valid value but the UI renders empty.",
        "Let me spin up the Docker environment and test your branch. Give me 5 minutes.",
      ],
      code_review: [
        "This looks solid! Just one thing — you've got a typo on line 47: `crendentials` instead of `credentials`. Easy fix.",
        "I like this approach. Did you consider using `Promise.allSettled` instead of `Promise.all`? One failure won't crash the whole batch.",
        "Nice use of early returns. The logic is much clearer than the nested if-else version. Approved!",
        "One suggestion: extract the validation logic into a custom hook so we can reuse it in the settings page too.",
      ],
      merge_conflict: [
        "Uh oh 😬 I was working in the same file and my branch has some changes that might conflict. Want to resolve together?",
        "I think I accidentally committed to `main` instead of a feature branch. Let me fix that before you pull. Sorry!",
        "I see you modified `api.ts` — I refactored that same function yesterday. We'll have a merge conflict but it's straightforward to resolve.",
        "Quick heads up: I'm about to rebase my branch onto yours. The changes should compose cleanly but let me know if anything breaks.",
      ],
      default: [
        "I haven't seen that one before. Let me search the codebase for similar patterns.",
        "Good question! Let's check the logs together — that'll tell us more than guessing.",
        "I can help with that! Give me 30 seconds to switch contexts.",
      ],
    },
  },

  system: {
    id: 'system',
    name: 'Chaos Engine',
    role: 'System',
    title: 'Production Monitoring & Orchestration',
    senderType: 'system',
    avatar: 'robot_2',
    color: 'emerald',
    status: 'online',
    tagline: '"All systems nominal. Mostly."',
    backstory:
      'The Chaos Engine is CodeCraft\'s built-in incident simulator. It monitors the simulated production environment and generates realistic incidents — pager alerts, performance degradation, partial outages, and rollbacks. Its purpose is to train engineers to respond calmly under pressure.',
    traits: ['analytical', 'unbiased', 'terse', 'slightly-menacing'],
    expertise: [
      'incident detection',
      'SLO monitoring',
      'auto-scaling',
      'deployment orchestration',
    ],
    // Chaos has no conversational responses — it fires events
  },
};

// Helper: get response for a persona based on context
function getResponse(personaId, contextType, variables = {}) {
  const persona = Personas[personaId];
  if (!persona || !persona.responses) return null;

  const pool = persona.responses[contextType] || persona.responses.default || [];
  if (pool.length === 0) return null;

  // Select response — use deterministic-ish selection based on time + context
  const idx = Math.floor(Math.random() * pool.length);
  let text = pool[idx];

  // Replace template variables like {id}
  for (const [key, value] of Object.entries(variables)) {
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return text;
}

module.exports = { Personas, getResponse };
