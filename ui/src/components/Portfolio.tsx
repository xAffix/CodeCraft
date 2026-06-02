'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PortfolioData {
  displayName: string;
  title: string;
  joinedAt: number;
  stats: Record<string, number | string>;
  tickets: TicketEntry[];
  reviews: ReviewEntry[];
  certifications: CertEntry[];
}

interface TicketEntry {
  id: string;
  title: string;
  difficulty: string;
  completedAt: number;
  skills: string[];
}

interface ReviewEntry {
  id: string;
  title: string;
  reviewer: string;
  verdict: string;
  timestamp: number;
}

interface CertEntry {
  name: string;
  icon: string;
  earnedAt: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Portfolio() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api('/portfolio');
      setData(res);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-md flex items-center justify-center h-48">
        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-xl p-md flex items-center justify-center h-48">
        <div className="text-center text-outline-variant/60">
          <span className="material-symbols-outlined text-[40px]">folder</span>
          <p className="font-body-sm text-body-sm mt-2">Portfolio data unavailable</p>
        </div>
      </div>
    );
  }

  const diffStyles: Record<string, string> = {
    easy: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/20 text-amber-400',
    hard: 'bg-rose-500/20 text-rose-400',
  };

  const verdictStyles: Record<string, string> = {
    approved: 'text-emerald-400 bg-emerald-500/10',
    changes_requested: 'text-amber-400 bg-amber-500/10',
    rejected: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <div className="glass-panel rounded-xl p-md overflow-y-auto feed-scroll max-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-md">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">badge</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface font-medium">{data.displayName}</h3>
              <p className="font-body-sm text-body-sm text-outline-variant">{data.title}</p>
              <p className="font-label-xs text-label-xs text-outline-variant mt-0.5">
                Joined {new Date(data.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-md">
        {Object.entries(data.stats).map(([key, val]) => (
          <div key={key} className="bg-surface-dim rounded-lg p-2.5 text-center">
            <span className="font-display-sm text-display-sm text-primary">{val}</span>
            <p className="font-label-xs text-label-xs text-outline-variant uppercase mt-0.5">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        ))}
      </div>

      {/* Completed Tickets */}
      <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Completed Tickets</h4>
      <div className="space-y-1.5 mb-md">
        {data.tickets.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full shrink-0 ${diffStyles[t.difficulty] || 'bg-surface-dim text-outline-variant'}`}>
              {t.id}
            </span>
            <span className="flex-1 text-[12px] text-on-surface-variant min-w-0 truncate">{t.title}</span>
            <div className="flex gap-1 shrink-0">
              {t.skills.slice(0, 2).map((s) => (
                <span key={s} className="text-[9px] text-outline-variant bg-white/5 px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Code Reviews */}
      <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Recent Reviews</h4>
      <div className="space-y-1.5 mb-md">
        {data.reviews.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <span className="text-[11px] text-outline-variant font-mono shrink-0">{r.id}</span>
            <span className="flex-1 text-[12px] text-on-surface-variant min-w-0 truncate">{r.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${verdictStyles[r.verdict] || 'text-outline-variant'}`}>
              {r.verdict.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-outline-variant shrink-0">by {r.reviewer}</span>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Achievements</h4>
      <div className="flex flex-wrap gap-2">
        {data.certifications.map((c) => (
          <div key={c.name} className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5">
            <span className="material-symbols-outlined text-[14px] text-amber-400">{c.icon}</span>
            <span className="text-[11px] text-amber-300">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
