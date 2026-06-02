/**
 * CodeCraft Skill Graph Engine
 *
 * Tracks skill levels across engineering domains based on
 * completed tickets, code reviews, incident responses, and
 * code execution activity.
 *
 * Skills categories:
 *   - Frontend: React, Next.js, CSS/Tailwind, TypeScript
 *   - Backend: Node.js, Express, APIs, Databases
 *   - DevOps: Docker, CI/CD, Cloud, Monitoring
 *   - Security: Auth, Rate Limiting, Input Validation
 *   - AI/ML: Prompt Engineering, LLM Integration
 */

class SkillGraphEngine {
  constructor() {
    this.skills = new Map();

    this._seed('dev-user-000');
  }

  _seed(userId) {
    if (this.skills.has(userId)) return;

    this.skills.set(userId, {
      user_id: userId,
      categories: [
        {
          name: 'Frontend',
          icon: 'code',
          color: 'text-cyan-400',
          barColor: 'bg-cyan-500',
          score: 68,
          skills: [
            { name: 'React', level: 72 },
            { name: 'Next.js', level: 65 },
            { name: 'Tailwind CSS', level: 80 },
            { name: 'TypeScript', level: 55 },
          ],
        },
        {
          name: 'Backend',
          icon: 'dns',
          color: 'text-amber-400',
          barColor: 'bg-amber-500',
          score: 74,
          skills: [
            { name: 'Node.js', level: 78 },
            { name: 'Express', level: 82 },
            { name: 'APIs', level: 70 },
            { name: 'Databases', level: 65 },
          ],
        },
        {
          name: 'DevOps',
          icon: 'cloud',
          color: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          score: 55,
          skills: [
            { name: 'Docker', level: 60 },
            { name: 'CI/CD', level: 50 },
            { name: 'Cloud', level: 45 },
            { name: 'Monitoring', level: 65 },
          ],
        },
        {
          name: 'Security',
          icon: 'shield',
          color: 'text-rose-400',
          barColor: 'bg-rose-500',
          score: 48,
          skills: [
            { name: 'Auth', level: 55 },
            { name: 'Rate Limiting', level: 50 },
            { name: 'Input Validation', level: 60 },
            { name: 'OWASP', level: 25 },
          ],
        },
        {
          name: 'AI / ML',
          icon: 'psychology',
          color: 'text-violet-400',
          barColor: 'bg-violet-500',
          score: 42,
          skills: [
            { name: 'Prompt Engineering', level: 55 },
            { name: 'LLM Integration', level: 45 },
            { name: 'Vector DB', level: 30 },
            { name: 'RAG Patterns', level: 40 },
          ],
        },
      ],
      recentGrowth: [
        { skill: 'Express', from: 75, to: 82, reason: 'Built REST API for workspace service' },
        { skill: 'Tailwind CSS', from: 70, to: 80, reason: 'Designed glass-morphism UI components' },
        { skill: 'Docker', from: 45, to: 60, reason: 'Containerized dev environment' },
        { skill: 'React', from: 65, to: 72, reason: 'Built complex state management patterns' },
      ],
      totalXp: 2840,
      nextLevelXp: 3500,
    });
  }

  getSkills(userId) {
    if (!this.skills.has(userId)) this._seed(userId);
    return this.skills.get(userId);
  }

  getAll() {
    return Array.from(this.skills.entries()).map(([id, s]) => ({
      user_id: id,
      totalXp: s.totalXp,
      categories: s.categories.map(c => ({ name: c.name, score: c.score })),
    }));
  }
}

module.exports = SkillGraphEngine;
