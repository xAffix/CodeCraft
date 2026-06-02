'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  barColor: string;
  score: number;
  skills: SubSkill[];
}

interface SubSkill {
  name: string;
  level: number;
}

interface SkillData {
  categories: SkillCategory[];
  recentGrowth: GrowthEntry[];
  totalXp: number;
  nextLevelXp: number;
}

interface GrowthEntry {
  skill: string;
  from: number;
  to: number;
  reason: string;
}

// ---------------------------------------------------------------------------
// Radar Chart (pure SVG)
// ---------------------------------------------------------------------------

function RadarChart({ categories }: { categories: SkillCategory[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const levels = 4;

  // Build polygon points for each category
  const angleStep = (2 * Math.PI) / categories.length;

  // Background grid
  const gridLines = Array.from({ length: levels }, (_, i) => {
    const r = (radius / levels) * (i + 1);
    const pts = categories.map((_, j) => {
      const angle = angleStep * j - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    return { r, pts, opacity: 0.1 + (i + 1) * 0.05 };
  });

  // Data polygon
  const dataPts = categories.map((cat, j) => {
    const angle = angleStep * j - Math.PI / 2;
    const r = (radius * cat.score) / 100;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const dataPolygon = dataPts.map(p => `${p.x},${p.y}`).join(' ');

  // Labels
  const labels = categories.map((cat, j) => {
    const angle = angleStep * j - Math.PI / 2;
    const labelRadius = radius + 18;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);
    // Determine text anchor
    let textAnchor = 'middle';
    if (angle > -0.1 && angle < 0.1) textAnchor = 'start';
    else if (angle > Math.PI - 0.1 && angle < Math.PI + 0.1) textAnchor = 'end';
    else if (angle > Math.PI / 2 - 0.1 && angle < Math.PI / 2 + 0.1) textAnchor = 'start';
    else if (angle > -Math.PI / 2 - 0.1 && angle < -Math.PI / 2 + 0.1) textAnchor = 'start';

    return { x, y, textAnchor: textAnchor as 'start' | 'middle' | 'end' | 'inherit' | undefined, label: cat.name, color: cat.color };
  });

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid circles */}
        {gridLines.map((g, i) => (
          <polygon
            key={i}
            points={g.pts}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {categories.map((_, j) => {
          const angle = angleStep * j - Math.PI / 2;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          return (
            <line
              key={j}
              x1={cx} y1={cy}
              x2={x} y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data polygon fill */}
        <polygon
          points={dataPolygon}
          fill="rgba(34, 211, 238, 0.15)"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />

        {/* Data points */}
        {dataPts.map((p, j) => (
          <circle
            key={j}
            cx={p.x} cy={p.y}
            r="3"
            fill="#22d3ee"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="1"
          />
        ))}

        {/* Labels */}
        {labels.map((l, j) => (
          <text
            key={j}
            x={l.x} y={l.y}
            textAnchor={l.textAnchor}
            dominantBaseline="middle"
            className="text-[8px] fill-current"
            fill="rgba(255,255,255,0.6)"
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function SkillGraph() {
  const [data, setData] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await api('/skills');
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
          <span className="material-symbols-outlined text-[40px]">psychology</span>
          <p className="font-body-sm text-body-sm mt-2">Skills data unavailable</p>
        </div>
      </div>
    );
  }

  const selected = data.categories.find(c => c.name === selectedCategory);

  return (
    <div className="glass-panel rounded-xl p-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-md">
        <div>
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Skill Graph</h3>
          <p className="font-body-sm text-body-sm text-outline-variant mt-0.5">
            XP: {data.totalXp.toLocaleString()} / {data.nextLevelXp.toLocaleString()}
          </p>
        </div>
        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${(data.totalXp / data.nextLevelXp) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-md">
        {/* Radar Chart */}
        <div className="shrink-0">
          <RadarChart categories={data.categories} />
        </div>

        {/* Category list */}
        <div className="flex-1 min-w-0 space-y-2">
          {data.categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all text-left ${
                  isSelected ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${cat.color}`}>{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-label-xs text-label-xs ${cat.color} font-medium`}>{cat.name}</span>
                    <span className="font-label-xs text-label-xs text-outline-variant">{cat.score}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cat.barColor}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  {/* Expanded sub-skills */}
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
                      {cat.skills.map((sk) => (
                        <div key={sk.name} className="flex items-center gap-2">
                          <span className="font-label-xs text-label-xs text-outline-variant w-20 shrink-0">{sk.name}</span>
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${cat.barColor}`}
                              style={{ width: `${sk.level}%` }}
                            />
                          </div>
                          <span className="font-label-xs text-label-xs text-outline-variant w-6 text-right">{sk.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Growth */}
      {data.recentGrowth.length > 0 && (
        <div className="mt-md pt-md border-t border-white/5">
          <h4 className="font-label-xs text-label-xs text-outline-variant uppercase tracking-wider mb-2">Recent Growth</h4>
          <div className="space-y-1.5">
            {data.recentGrowth.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg hover:bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium">{g.skill}</span>
                  <span className="text-outline-variant text-[10px]">{g.reason}</span>
                </div>
                <span className="text-emerald-400 font-medium shrink-0 ml-2">
                  {g.from} → {g.to}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
