'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, getAccessToken } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: Date;
  isAI: boolean;
  channel: string;
  personaColor?: string;
  isChaos?: boolean;
}

interface AiPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  tagline: string;
}

const channels = ['general', 'tickets', 'random', 'standup'];

const avatarMap: Record<string, string> = {
  kira: 'smart_toy',
  maya: 'account_tree',
  ravi: 'group',
  system: 'robot_2',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SimChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [showChat, setShowChat] = useState(false);
  const [connected, setConnected] = useState(false);
  const [aiResponding, setAiResponding] = useState(false);
  const [personas, setPersonas] = useState<AiPersona[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch team personas
  useEffect(() => {
    api('/ai/team')
      .then((data) => {
        if (data?.team) setPersonas(data.team);
      })
      .catch(() => {
        // Fallback personas if API unavailable
        setPersonas([
          { id: 'kira', name: 'Kira Voss', role: 'Tech Lead', avatar: 'smart_toy', color: 'cyan', tagline: '"Ship clean code or don\'t ship at all."' },
          { id: 'maya', name: 'Maya Chen', role: 'Product Manager', avatar: 'account_tree', color: 'amber', tagline: '"Let\'s ship value, not features."' },
          { id: 'ravi', name: 'Ravi Patel', role: 'Peer Dev', avatar: 'group', color: 'violet', tagline: '"Let\'s debug this together."' },
        ]);
      });
  }, []);

  // Load messages + connect WebSocket
  useEffect(() => {
    loadMessages();
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await api(`/messages?channel=${activeChannel}&limit=50`);
      if (data?.messages && data.messages.length > 0) {
        const formatted = data.messages.map((m: any) => ({
          id: m.id,
          sender: m.sender_name || (m.sender_type === 'user' ? 'You' :
                  m.sender_type === 'ai_tech_lead' ? 'Kira Voss' :
                  m.sender_type === 'ai_pm' ? 'Maya Chen' :
                  m.sender_type === 'ai_peer' ? 'Ravi Patel' : 'System Bot'),
          avatar: m.avatar || (m.sender_type === 'user' ? 'person' : avatarMap[m.sender_id?.replace('ai-', '')] || 'robot_2'),
          text: m.content,
          timestamp: new Date(m.created_at),
          isAI: m.sender_type !== 'user',
          channel: m.channel,
          personaColor: m.sender_id === 'ai-kira' ? 'text-cyan-400' :
                        m.sender_id === 'ai-maya' ? 'text-amber-400' :
                        m.sender_id === 'ai-ravi' ? 'text-violet-400' : undefined,
          isChaos: m.sender_type === 'system',
        }));
        setMessages(formatted);
        return;
      }
    } catch { /* fall through */ }

    // Fallback welcome messages
    setMessages([
      { id: 'sys-1', sender: 'Chaos Engine', avatar: 'robot_2', text: '🔔 **Sprint #12 Active** — You have 3 tickets assigned. Priority: TICKET-42 (pagination bug).', timestamp: new Date(), isAI: true, channel: 'general', isChaos: true },
      { id: 'sys-2', sender: 'Kira Voss', avatar: 'smart_toy', text: 'Morning. I\'ve reviewed the codebase — the `range()` offset in the ticket list is off by one at page 3+. Let me know when you want to pair on it.', timestamp: new Date(), isAI: true, channel: 'general', personaColor: 'text-cyan-400' },
    ]);
  };

  const connectWebSocket = async () => {
    try {
      const token = await getAccessToken();
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'localhost:3001';
      const url = `${protocol}//${host}/ws${token ? `?token=${token}` : ''}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'connection:established':
              setConnected(true);
              break;

            case 'chat:message':
              if (msg.payload.channel === activeChannel) {
                addMessage({
                  id: `ws-${Date.now()}`,
                  sender: msg.payload.sender_name || 'Someone',
                  avatar: 'person',
                  text: msg.payload.text,
                  timestamp: new Date(msg.payload.timestamp),
                  isAI: false,
                  channel: msg.payload.channel,
                });
              }
              break;

            case 'ai:message':
              if (msg.payload.channel === activeChannel) {
                setAiResponding(false);
                addMessage({
                  id: `ai-${Date.now()}`,
                  sender: msg.payload.persona_name,
                  avatar: msg.payload.avatar || 'smart_toy',
                  text: msg.payload.text,
                  timestamp: new Date(msg.payload.timestamp),
                  isAI: true,
                  channel: msg.payload.channel,
                  personaColor: msg.payload.color ? `text-${msg.payload.color}-400` : undefined,
                });
              }
              break;

            case 'chaos:alert':
              setUnreadAlerts(true);
              if (msg.payload.channel === activeChannel) {
                addMessage({
                  id: `chaos-${Date.now()}`,
                  sender: '🚨 Chaos Engine',
                  avatar: 'robot_2',
                  text: msg.payload.text,
                  timestamp: new Date(msg.payload.timestamp),
                  isAI: true,
                  channel: msg.payload.channel,
                  isChaos: true,
                });
              }
              break;

            case 'chaos:resolved':
              if (msg.payload.channel === activeChannel) {
                addMessage({
                  id: `res-${Date.now()}`,
                  sender: '✅ Chaos Engine',
                  avatar: 'robot_2',
                  text: msg.payload.text,
                  timestamp: new Date(msg.payload.timestamp),
                  isAI: true,
                  channel: msg.payload.channel,
                  isChaos: true,
                });
              }
              break;
          }
        } catch { /* ignore non-JSON */ }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimerRef.current = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = () => setConnected(false);
    } catch { /* WS unavailable */ }
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.some(m => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  };

  const handleSend = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const text = input;
      setInput('');
      setAiResponding(true);

      // Add message locally
      const optimisticId = `msg-${Date.now()}`;
      addMessage({
        id: optimisticId,
        sender: 'You',
        avatar: 'person',
        text,
        timestamp: new Date(),
        isAI: false,
        channel: activeChannel,
      });

      // Save to backend API
      try {
        await api('/messages', {
          method: 'POST',
          body: JSON.stringify({ channel: activeChannel, content: text, sender_type: 'user' }),
        });
      } catch { /* silent */ }

      // Request AI response
      try {
        const aiRes = await api('/ai/chat', {
          method: 'POST',
          body: JSON.stringify({ channel: activeChannel, message: text }),
        });

        if (aiRes?.text) {
          addMessage({
            id: `ai-${Date.now()}`,
            sender: aiRes.persona.name,
            avatar: aiRes.persona.avatar || 'smart_toy',
            text: aiRes.text,
            timestamp: new Date(),
            isAI: true,
            channel: activeChannel,
            personaColor: aiRes.persona.color ? `text-${aiRes.persona.color}-400` : undefined,
          });
          setAiResponding(false);
        }
      } catch { /* AI API down, orchestrator will reply via WebSocket if connected */ }

      // Send via WebSocket too (triggers orchestrator-based response)
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'chat:send',
          payload: { channel: activeChannel, text },
        }));
      }

      // Timeout guard — stop showing "typing" after 7s
      setTimeout(() => setAiResponding(false), 7000);
    }
  };

  const channelMessages = messages.filter((m) => m.channel === activeChannel);

  // Get persona display info by name
  const getPersonaStyle = (sender: string) => {
    if (sender === 'Kira Voss') return 'text-cyan-400';
    if (sender === 'Maya Chen') return 'text-amber-400';
    if (sender === 'Ravi Patel') return 'text-violet-400';
    if (sender.includes('Chaos')) return 'text-rose-400';
    return 'text-on-surface';
  };

  const getPersonaAvatar = (sender: string) => {
    if (sender === 'Kira Voss') return 'smart_toy';
    if (sender === 'Maya Chen') return 'account_tree';
    if (sender === 'Ravi Patel') return 'group';
    if (sender.includes('Chaos')) return 'robot_2';
    return 'person';
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => { setShowChat(!showChat); setUnreadAlerts(false); }}
        className={`fixed bottom-16 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          showChat ? 'bg-primary text-on-primary' : 'bg-surface-dim border border-white/20 text-primary hover:border-primary/50'
        }`}
      >
        <span className="material-symbols-outlined">{showChat ? 'close' : 'chat'}</span>
        {unreadAlerts && !showChat && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-error animate-ping"></span>
        )}
      </button>

      {/* Chat Panel */}
      <div className={`fixed bottom-28 right-6 z-50 w-[400px] h-[560px] glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden transition-all duration-300 ${
        showChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">Sim-Slack</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex -space-x-1">
                  {['kira', 'maya', 'ravi'].map((id) => {
                    const p = personas.find(p => p.id === id);
                    return (
                      <div key={id} className="w-4 h-4 rounded-full bg-surface-dim border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[8px] text-primary">{avatarMap[id]}</span>
                      </div>
                    );
                  })}
                </div>
                <span className="font-label-xs text-label-xs text-outline-variant">{personas.length} online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
            <span className={`font-label-xs text-label-xs ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Channel Bar */}
        <div className="flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto shrink-0">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`font-label-xs text-label-xs px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                activeChannel === ch
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-on-surface-variant hover:text-on-surface border border-transparent hover:border-white/10'
              }`}
            >
              # {ch}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 feed-scroll space-y-3">
          {channelMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-outline-variant/60">
              <span className="material-symbols-outlined text-[40px]">forum</span>
              <p className="font-body-sm text-body-sm mt-2">No messages in #{activeChannel}</p>
              <p className="font-body-xs text-body-xs">Type something to get started!</p>
            </div>
          )}
          {channelMessages.map((msg) => {
            const senderColor = msg.personaColor || getPersonaStyle(msg.sender);
            const avatarIcon = getPersonaAvatar(msg.sender);
            return (
              <div key={msg.id} className={`flex gap-2.5 ${!msg.isAI ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.isAI ? 'bg-surface-dim border border-white/10' : 'bg-primary/20 border border-primary/30'
                }`}>
                  <span className="material-symbols-outlined text-[16px] text-primary">{avatarIcon}</span>
                </div>
                <div className={`flex-1 min-w-0 ${!msg.isAI ? 'items-end flex flex-col' : ''}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${!msg.isAI ? 'flex-row-reverse' : ''}`}>
                    <span className={`font-label-xs text-label-xs font-medium ${senderColor}`}>
                      {msg.sender}
                    </span>
                    <span className="font-label-xs text-label-xs text-outline-variant" suppressHydrationWarning>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`font-body-sm text-body-sm leading-relaxed whitespace-pre-wrap ${
                    !msg.isAI
                      ? 'bg-primary/10 text-on-surface px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%]'
                      : msg.isChaos
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[95%]'
                        : 'text-on-surface-variant'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI typing indicator */}
          {aiResponding && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-dim border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[16px] text-primary">more_horiz</span>
              </div>
              <div className="flex items-center gap-1 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-2 bg-surface-dim rounded-xl px-3 py-2 border border-white/5 focus-within:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-[16px] text-outline-variant">add_circle</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSend}
              className="flex-1 bg-transparent border-none outline-none text-on-surface font-body-sm placeholder:text-outline-variant/50"
              placeholder={`Message #${activeChannel}...`}
              disabled={aiResponding}
            />
            <span className="material-symbols-outlined text-[16px] text-outline-variant">mood</span>
          </div>
        </div>
      </div>
    </>
  );
}
