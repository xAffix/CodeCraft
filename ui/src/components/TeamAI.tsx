'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Persona {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  color: string;
  tagline: string;
  status: string;
  expertise: string[];
}

interface ChatEntry {
  id: string;
  personaId: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

interface Incident {
  id: string;
  type: string;
  service: string;
  severity: string;
  text: string;
  timestamp: string;
  details?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Persona card config
// ---------------------------------------------------------------------------

const colorConfig: Record<string, { primary: string; bg: string; border: string; glow: string }> = {
  cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/10' },
  amber: { primary: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'shadow-amber-500/10' },
  violet: { primary: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', glow: 'shadow-violet-500/10' },
  emerald: { primary: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamAI() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showIncidents, setShowIncidents] = useState(false);
  const [chaosStatus, setChaosStatus] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTeam();
    loadIncidents();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const loadTeam = async () => {
    try {
      const data = await api('/ai/team');
      if (data?.team) setPersonas(data.team);
      if (data?.chaos) setChaosStatus(data.chaos);
    } catch {
      setPersonas([
        { id: 'kira', name: 'Kira Voss', role: 'Tech Lead', title: 'Senior Staff Engineer', avatar: 'smart_toy', color: 'cyan', status: 'online', tagline: '"Ship clean code or don\'t ship at all."', expertise: ['System Architecture', 'TypeScript/Node.js', 'API Design', 'Performance'] },
        { id: 'maya', name: 'Maya Chen', role: 'Product Manager', title: 'Senior PM — FinTechFast', avatar: 'account_tree', color: 'amber', status: 'online', tagline: '"Let\'s ship value, not features."', expertise: ['Sprint Planning', 'Stakeholder Mgmt', 'KPI Tracking', 'Roadmap Strategy'] },
        { id: 'ravi', name: 'Ravi Patel', role: 'Peer Developer', title: 'Full-Stack Engineer', avatar: 'group', color: 'violet', status: 'online', tagline: '"Let\'s debug this together."', expertise: ['Full-Stack Debugging', 'React/Next.js', 'Docker', 'CI/CD'] },
      ]);
    }
  };

  const loadIncidents = async () => {
    try {
      const data = await api('/ai/chaos/events');
      if (data?.events) setIncidents(data.events);
      const status = await api('/ai/chaos/status');
      if (status) setChaosStatus(status);
    } catch { /* silent */ }
  };

  const selectPersona = (id: string) => {
    setSelectedPersona(id);
    setChatHistory([]);
    const persona = personas.find(p => p.id === id);
    if (persona) {
      setChatHistory([{
        id: `greet-${id}`,
        personaId: id,
        content: `I'm **${persona.name}**, ${persona.role.toLowerCase()}. ${persona.tagline}\n\nHow can I help you?`,
        timestamp: new Date(),
        isUser: false,
      }]);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !selectedPersona || chatLoading) return;

    const text = chatInput;
    setChatInput('');
    setChatLoading(true);

    // Add user message
    setChatHistory(prev => [...prev, {
      id: `user-${Date.now()}`,
      personaId: selectedPersona,
      content: text,
      timestamp: new Date(),
      isUser: true,
    }]);

    try {
      // Build channel context based on persona
      const channelMap: Record<string, string> = {
        kira: 'general',
        maya: 'general',
        ravi: 'general',
      };
      const channel = channelMap[selectedPersona] || 'general';

      const data = await api('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          channel,
          message: text,
          channelMembers: [selectedPersona],
        }),
      });

      if (data?.text) {
        setChatHistory(prev => [...prev, {
          id: `ai-${Date.now()}`,
          personaId: selectedPersona,
          content: data.text,
          timestamp: new Date(),
          isUser: false,
        }]);
      }
    } catch {
      // Fallback response if API unavailable
      const fallbacks: Record<string, string[]> = {
        kira: ['Let me review the code and get back to you.', 'That architecture pattern works, but we need to consider the data flow at scale.', 'Good question. Stack up the error logs and I\'ll take a look.'],
        maya: ['I\'ll add that to the sprint backlog. Let me check the priority stack first.', 'Good catch — I\'ll update the stakeholders and push the deadline.', 'Log it as a ticket. Tracked work > hallway conversations.'],
        ravi: ['I was literally just looking at that! Let me show you what I found.', 'Oh interesting — let me reproduce it in the staging environment.', 'I might\'ve touched that file too. Let me check my branch.'],
      };
      const pool = fallbacks[selectedPersona] || ['Let me get back to you on that.'];
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: `ai-${Date.now()}`,
          personaId: selectedPersona,
          content: pool[Math.floor(Math.random() * pool.length)],
          timestamp: new Date(),
          isUser: false,
        }]);
        setChatLoading(false);
      }, 1200);
      return;
    }

    setChatLoading(false);
  };

  const triggerChaos = async () => {
    try {
      await api('/ai/chaos/trigger', { method: 'POST' });
      setTimeout(loadIncidents, 1000);
    } catch { /* silent */ }
  };

  const selectedP = personas.find(p => p.id === selectedPersona);
  const colors = selectedP ? colorConfig[selectedP.color] || colorConfig.cyan : colorConfig.cyan;

  return (
    <div className="flex flex-col gap-base h-full w-full max-w-6xl mx-auto">
      {/* Team Banner */}
      <div className="glass-panel rounded-xl p-md">
        <div className="flex items-center justify-between mb-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Your AI Team</h2>
            <p className="font-body-sm text-body-sm text-outline-variant mt-1">
              {personas.length} team members available
              {' · '}
              {chaosStatus?.activeIncidents > 0 ? (
                <span className="text-rose-400 font-medium">{chaosStatus.activeIncidents} active incidents</span>
              ) : (
                <span className="text-emerald-400">all systems nominal</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`font-label-sm text-label-sm px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                showIncidents
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'text-on-surface-variant border-white/10 hover:border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">warning</span>
              Incidents
              {incidents.length > 0 && (
                <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded-full">
                  {incidents.length}
                </span>
              )}
            </button>
            <button
              onClick={triggerChaos}
              className="font-label-sm text-label-sm px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Trigger Incident
            </button>
          </div>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-3 gap-4">
          {personas.map((p) => {
            const c = colorConfig[p.color] || colorConfig.cyan;
            return (
              <button
                key={p.id}
                onClick={() => selectPersona(p.id)}
                className={`glass-panel rounded-xl p-md text-left transition-all duration-200 hover:scale-[1.02] group ${
                  selectedPersona === p.id
                    ? `${c.border} ${c.glow} shadow-lg`
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${c.primary}`}>{p.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-label-md text-label-md ${c.primary} font-medium`}>{p.name}</h3>
                      <span className={`w-2 h-2 rounded-full ${p.status === 'online' ? 'bg-emerald-500' : 'bg-gray-500'} animate-pulse`}></span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{p.role}</p>
                    <p className="font-label-xs text-label-xs text-outline-variant mt-1 italic">{p.tagline}</p>
                  </div>
                </div>
                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.expertise.slice(0, 3).map((exp) => (
                    <span key={exp} className={`font-label-xs text-label-xs ${c.bg} ${c.primary} px-2 py-0.5 rounded-full`}>
                      {exp}
                    </span>
                  ))}
                  {p.expertise.length > 3 && (
                    <span className="font-label-xs text-label-xs text-outline-variant px-2 py-0.5">+{p.expertise.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-base min-h-0">
        {/* Chat Panel */}
        <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden min-h-0">
          {selectedPersona && selectedP ? (
            <>
              {/* Chat Header */}
              <div className={`px-md py-3 border-b border-white/5 ${colorConfig[selectedP.color]?.bg || ''} shrink-0`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colorConfig[selectedP.color]?.bg || 'bg-surface-dim'} border ${colorConfig[selectedP.color]?.border || 'border-white/10'} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${colorConfig[selectedP.color]?.primary || 'text-on-surface'}`}>{selectedP.avatar}</span>
                  </div>
                  <div>
                    <h3 className={`font-label-md text-label-md font-medium ${colorConfig[selectedP.color]?.primary || 'text-on-surface'}`}>
                      {selectedP.name}
                    </h3>
                    <p className="font-label-xs text-label-xs text-outline-variant">{selectedP.title}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-md feed-scroll space-y-3">
                {chatHistory.map((entry) => (
                  <div key={entry.id} className={`flex gap-2.5 ${entry.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                      entry.isUser
                        ? 'bg-surface-variant border-white/10'
                        : `${colorConfig[selectedP.color]?.bg || 'bg-surface-dim'} ${colorConfig[selectedP.color]?.border || 'border-white/10'}`
                    }`}>
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {entry.isUser ? 'person' : selectedP.avatar}
                      </span>
                    </div>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl font-body-sm text-body-sm leading-relaxed ${
                      entry.isUser
                        ? 'bg-primary/10 text-on-surface rounded-tr-sm'
                        : `bg-[#1a1a1c] border border-white/5 text-on-surface-variant rounded-tl-sm`
                    }`}>
                      {entry.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${colorConfig[selectedP.color]?.bg || 'bg-surface-dim'} border ${colorConfig[selectedP.color]?.border || 'border-white/10'} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[16px] text-primary">{selectedP.avatar}</span>
                    </div>
                    <div className="flex items-center gap-1 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2 bg-surface-dim rounded-xl px-3 py-2 border border-white/5 focus-within:border-primary/30 transition-colors">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder={`Ask ${selectedP.name} about ${selectedP.expertise[0]?.toLowerCase() || 'code'}...`}
                    className="flex-1 bg-transparent border-none outline-none text-on-surface font-body-sm placeholder:text-outline-variant/50"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={chatLoading || !chatInput.trim()}
                    className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-outline-variant/60">
              <span className="material-symbols-outlined text-[56px]">diversity_3</span>
              <p className="font-body-md text-body-md mt-3">Select a team member to start chatting</p>
              <p className="font-body-sm text-body-sm mt-1">Click on any persona card above</p>
            </div>
          )}
        </div>

        {/* Incidents Panel */}
        {showIncidents && (
          <div className="w-80 glass-panel rounded-xl flex flex-col overflow-hidden shrink-0 min-h-0">
            <div className="px-md py-3 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-rose-400">warning</span>
                <h3 className="font-label-md text-label-md text-on-surface">Incident Log</h3>
              </div>
              <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full ${
                chaosStatus?.activeIncidents > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {chaosStatus?.activeIncidents || 0} active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-md feed-scroll space-y-2">
              {incidents.length === 0 ? (
                <div className="text-center text-outline-variant/60 pt-8">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  <p className="font-body-sm text-body-sm mt-2">No incidents recorded yet</p>
                  <p className="font-label-xs text-label-xs mt-1">The chaos engine will fire automatically</p>
                </div>
              ) : (
                [...incidents].reverse().map((inc) => {
                  const isActive = inc.type !== 'resolved' && !inc.text?.includes('resolved');
                  return (
                    <div key={inc.id} className={`p-2.5 rounded-lg text-[11px] leading-relaxed border ${
                      isActive
                        ? 'bg-rose-500/5 border-rose-500/20'
                        : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <span className={`font-medium ${isActive ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isActive ? 'ACTIVE' : 'RESOLVED'}
                        </span>
                        <span className="text-outline-variant ml-auto">
                          {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-on-surface-variant">{inc.service} — {inc.type}</p>
                      <p className="text-outline-variant mt-0.5 truncate">{inc.text?.substring(0, 80)}</p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-3 border-t border-white/5 shrink-0">
              <button
                onClick={loadIncidents}
                className="w-full font-label-xs text-label-xs text-primary bg-primary/10 py-1.5 rounded-lg hover:bg-primary/20 transition-all"
              >
                Refresh Events
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
