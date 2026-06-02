'use client';

import React, { useState } from 'react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  difficulty: 'easy' | 'medium' | 'hard';
  assignee?: string;
}

const mockTickets: Ticket[] = [
  { id: 'TICKET-42', title: 'Fix pagination bug on transaction history API', description: 'Range() offset miscalculation past page 3', status: 'in_progress', difficulty: 'medium' },
  { id: 'TICKET-43', title: 'Add rate limiting to auth endpoints', description: 'Token bucket implementation on /api/auth/*', status: 'todo', difficulty: 'hard' },
  { id: 'TICKET-44', title: 'Update user profile avatar component', description: 'Replace img with Next.js Image', status: 'todo', difficulty: 'easy' },
  { id: 'TICKET-45', title: 'Write unit tests for WebSocket handlers', description: 'Cover reconnect, heartbeat, message parsing', status: 'todo', difficulty: 'medium' },
  { id: 'TICKET-41', title: 'Implement session refresh middleware', description: 'Auto-refresh expired tokens before API calls', status: 'done', difficulty: 'medium' },
  { id: 'TICKET-40', title: 'Fix CORS configuration for production', description: 'Allow subdomain origins and WebSocket upgrade', status: 'done', difficulty: 'easy' },
  { id: 'TICKET-46', title: 'Add input sanitization to Sim-Slack', description: 'Prevent XSS via chat message payloads', status: 'in_review', difficulty: 'medium' },
  { id: 'TICKET-47', title: 'Optimize Docker image size', description: 'Multi-stage build, prune dev dependencies', status: 'in_review', difficulty: 'hard' },
];

const columns: { id: Ticket['status']; label: string; icon: string }[] = [
  { id: 'todo', label: 'To Do', icon: 'radio_button_unchecked' },
  { id: 'in_progress', label: 'In Progress', icon: 'play_circle' },
  { id: 'in_review', label: 'In Review', icon: 'rate_review' },
  { id: 'done', label: 'Done', icon: 'check_circle' },
];

const difficultyStyles = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-rose-500/20 text-rose-400',
};

export default function TicketBoard() {
  const [tickets, setTickets] = useState(mockTickets);
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null);

  const handleDragStart = (ticketId: string) => {
    setDraggedTicket(ticketId);
  };

  const handleDrop = (newStatus: Ticket['status']) => {
    if (!draggedTicket) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === draggedTicket ? { ...t, status: newStatus } : t
      )
    );
    setDraggedTicket(null);
  };

  const getColumnTickets = (status: Ticket['status']) =>
    tickets.filter((t) => t.status === status);

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4 feed-scroll">
      {columns.map((col) => {
        const colTickets = getColumnTickets(col.id);
        return (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
            className="flex-1 min-w-[240px] max-w-[320px] flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  {col.icon}
                </span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                  {col.label}
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline-variant bg-surface-dim px-2 py-0.5 rounded-full">
                {colTickets.length}
              </span>
            </div>

            {/* Tickets */}
            <div className="flex flex-col gap-2 flex-1">
              {colTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  draggable
                  onDragStart={() => handleDragStart(ticket.id)}
                  className="glass-panel rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-label-xs text-label-xs text-outline-variant font-mono">
                      {ticket.id}
                    </span>
                    <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full ${difficultyStyles[ticket.difficulty]}`}>
                      {ticket.difficulty}
                    </span>
                  </div>
                  <h4 className="font-body-sm text-body-sm text-on-surface mb-1.5 line-clamp-2">
                    {ticket.title}
                  </h4>
                  <p className="font-body-xs text-body-xs text-outline-variant line-clamp-1">
                    {ticket.description}
                  </p>

                  {/* Hover actions */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.id !== 'done' && (
                      <button className="flex items-center gap-1 font-label-xs text-label-xs text-primary hover:text-primary-fixed transition-colors">
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                        {col.id === 'todo' ? 'Start' : col.id === 'in_progress' ? 'Request Review' : 'Approve'}
                      </button>
                    )}
                    <button className="flex items-center gap-1 font-label-xs text-label-xs text-on-surface-variant hover:text-primary transition-colors ml-auto">
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      Open
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {colTickets.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-6">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[32px] text-outline-variant/40">
                      {col.id === 'done' ? 'celebration' : 'inbox'}
                    </span>
                    <p className="font-body-sm text-body-sm text-outline-variant/60 mt-1">
                      {col.id === 'done' ? 'No completed tickets' : 'Drop tickets here'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
