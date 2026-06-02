'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrustScoreData {
  total: number;
  level: string;
  codeQuality: number;
  incidentResponse: number;
  sprintReliability: number;
  collaboration: number;
  recentEvents: EventRecord[];
  badges: Badge[];
}

interface EventRecord {
  type: string;
  description: string;
  delta: number;
  timestamp: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

interface HistoryPoint {
  timestamp: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const factorLabels: Record<string, string> = {
  codeQuality: 'Code Quality',
  incidentResponse: 'Incident Response',
  sprintReliability: 'Sprint Reliability',
  collaboration: 'Collaboration',
};

const factorColors: Record<string, string> = {
  codeQuality: 'text-cyan-400',
  incidentResponse: 'text-rose-400',
  sprintReliability: 'text-amber-400',
  collaboration: 'text-violet-400',
};

const factorBarColors: Record<string, string> = {
  codeQuality: 'bg-cyan-500',
  incidentResponse: 'bg-rose-500',
  sprintReliability: 'bg-amber-500',
  collaboration: 'bg-violet-500',
};

function getLevelColor(total: number): string {
  if (total >= 96) return 'text-purple-400';
  if (total >= 81) return 'text-cyan-400';
  if (total >= 61) return 'text-emerald-400';
  if (total >= 41) return 'text-amber-400';
  return 'text-rose-400';
}

function getLevelGlow(total: number): string {
  if (total >= 96) return 'shadow-purple-500/30';
  if (total >= 81) return 'shadow-cyan-500/30';
  if (total >= 61) return 'shadow-emerald-500/20';
  if (total >= 41) return 'shadow-amber-500/20';
  return 'shadow-rose-500/20';
}

// SVG arc path helper
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ---------------------------------------------------------------------------
// Trust Score Arc Component
// ---------------------------------------------------------------------------

function ScoreGauge({ total }: { total: number }) {
  const radius = 68;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (total / 100) * circumference;
  const color = total >= 80 ? '#22d3ee' : total >= 60 ? '#34d399' : total >= 40 ? '#fbbf24' : '#fb7185';

  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center">
      <svg width="160" height="160" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="80" cy="80" r={normalizedRadius}
          fill="none" stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx="80" cy="80" r={normalizedRadius}
          fill="none" stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display-lg text-display-lg tracking-tight" style={{ color }}>{total}</span>
        <span className={`font-label-xs text-label-xs ${getLevelColor(total)}`}>/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini Sparkline (CSS-based)
// ---------------------------------------------------------------------------

function MiniSparkline({ points }: { points: HistoryPoint[] }) {
  if (points.length < 2) return null;

  const values = points.map(p => p.total);
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const range = max - min;

  // Build polyline points for inline SVG
  const w = 120;
  const h = 32;
  const step = w / (values.length - 1);

  const pts = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} className="overflow-visible">
        <polyline
          points={pts}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        />
      </svg>
      <div className="flex flex-col text-[10px] text-outline-variant">
        <span>{values[values.length - 1]}</span>
        <span className={values[values.length - 1] >= values[0] ? 'text-emerald-400' : 'text-rose-400'}>
          {values[values.length - 1] >= values[0] ? '↑' : '↓'}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function TrustScore() {
  const [data, setData] = useState<TrustScoreData | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    setLoading(true);
    try {
      const [scoreRes, historyRes] = await Promise.all([
        api('/trust/score'),
        api('/trust/history?limit=14'),
      ]);
      setData(scoreRes);
      if (historyRes?.history) setHistory(historyRes.history);
    } catch {
      // Fallback mock data if API unavailable
      setData({
        total: 71,
        level: 'Senior Engineer',
        codeQuality: 72,
        incidentResponse: 68,
        sprintReliability: 85,
        collaboration: 60,
        recentEvents: [],
        badges: [],
      });
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

  if (!data) return null;

  const factors = [
    { key: 'codeQuality', value: data.codeQuality },
    { key: 'incidentResponse', value: data.incidentResponse },
    { key: 'sprintReliability', value: data.sprintReliability },
    { key: 'collaboration', value: data.collaboration },
  ];

  return (
    <div className="glass-panel rounded-xl p-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-md">
        <div>
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Trust Score</h3>
          <p className={`font-label-md text-label-md font-medium ${getLevelColor(data.total)}`}>
            {data.level}
          </p>
        </div>
        <button
          onClick={loadScore}
          className="text-outline-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
        </button>
      </div>

      <div className="flex gap-md">
        {/* Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <ScoreGauge total={data.total} />
          <MiniSparkline points={history} />
        </div>

        {/* Factor breakdown */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {factors.map((f) => {
            const isExpanded = expandedFactor === f.key;
            const barWidth = `${f.value}%`;
            const barColor = factorBarColors[f.key] || 'bg-primary';
            const textColor = factorColors[f.key] || 'text-on-surface';

            return (
              <div key={f.key}>
                <button
                  onClick={() => setExpandedFactor(isExpanded ? null : f.key)}
                  className="w-full flex items-center justify-between group"
                >
                  <span className={`font-label-xs text-label-xs ${textColor}`}>
                    {factorLabels[f.key] || f.key}
                  </span>
                  <span className="font-label-xs text-label-xs text-outline-variant group-hover:text-on-surface transition-colors">
                    {f.value}
                  </span>
                </button>
                {/* Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {data.badges.length > 0 && (
        <div className="mt-md pt-md border-t border-white/5">
          <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Badges</h4>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                  badge.unlocked
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-surface-dim border-white/5 text-outline-variant opacity-60'
                }`}
                title={`${badge.name}${badge.unlocked ? ' — Unlocked!' : ` — ${badge.progress}%`}`}
              >
                <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                <span>{badge.name}</span>
                {!badge.unlocked && (
                  <span className="text-[9px] text-outline-variant">{badge.progress}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      {data.recentEvents && data.recentEvents.length > 0 && (
        <div className="mt-md pt-md border-t border-white/5">
          <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Recent Activity</h4>
          <div className="space-y-1.5">
            {data.recentEvents.slice(0, 4).map((evt, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    evt.delta > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-on-surface-variant truncate">{evt.description}</span>
                </div>
                <span className={`shrink-0 ml-2 ${evt.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {evt.delta > 0 ? '+' : ''}{evt.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
