'use client';

import React from 'react';
import TrustScore from './TrustScore';

export default function MissionControl() {
  return (
    <div className="flex flex-col gap-base h-full w-full overflow-y-auto feed-scroll">
      {/* Top KPI Row */}
      <div className="grid grid-cols-4 gap-base shrink-0">
        <div className="glass-panel p-md rounded-lg flex flex-col gap-xs ambient-glow-primary hover:-translate-y-1 transition-transform">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Sprint Velocity</span>
          <div className="flex items-end gap-2">
            <span className="font-display-md text-display-md text-on-surface">42</span>
            <span className="font-label-sm text-primary mb-1">+14%</span>
          </div>
          <span className="font-body-sm text-outline-variant">Points this week</span>
        </div>
        <div className="glass-panel p-md rounded-lg flex flex-col gap-xs hover:-translate-y-1 transition-transform">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Active PRs</span>
          <div className="flex items-end gap-2">
            <span className="font-display-md text-display-md text-on-surface">18</span>
            <span className="font-label-sm text-error mb-1">2 blocked</span>
          </div>
          <span className="font-body-sm text-outline-variant">Awaiting code review</span>
        </div>
        <div className="glass-panel p-md rounded-lg flex flex-col gap-xs hover:-translate-y-1 transition-transform">
          <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">System Uptime</span>
          <div className="flex items-end gap-2">
            <span className="font-display-md text-display-md text-on-surface">99.9%</span>
            <span className="font-label-sm text-tertiary mb-1">Nominal</span>
          </div>
          <span className="font-body-sm text-outline-variant">Global infrastructure</span>
        </div>
        <div className="glass-panel p-md rounded-lg flex flex-col gap-xs ambient-glow-error hover:-translate-y-1 transition-transform">
          <span className="font-label-sm text-label-sm text-error uppercase tracking-wider">Open Incidents</span>
          <div className="flex items-end gap-2">
            <span className="font-display-md text-display-md text-error">1</span>
            <span className="font-label-sm text-error mb-1">SEV-1</span>
          </div>
          <span className="font-body-sm text-outline-variant">Requires immediate action</span>
        </div>
      </div>

      {/* Two-column layout: Trust Score + Pipeline */}
      <div className="grid grid-cols-5 gap-base flex-grow min-h-0">
        {/* Trust Score — Left 2 columns */}
        <div className="col-span-2">
          <TrustScore />
        </div>

        {/* Pipeline + Team — Right 3 columns */}
        <div className="col-span-3 grid grid-cols-3 gap-base min-h-0">
          {/* Deployment Pipeline */}
          <div className="col-span-2 glass-panel rounded-lg flex flex-col overflow-hidden">
            <div className="p-sm border-b border-white/5 bg-surface-container-low/50 flex justify-between items-center">
              <h3 className="font-label-sm text-label-sm text-on-surface font-bold uppercase">Deployment Pipeline</h3>
              <span className="material-symbols-outlined text-sm text-primary">swap_calls</span>
            </div>
            <div className="p-md flex-grow flex flex-col justify-center gap-lg">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/50 relative">
                  <span className="material-symbols-outlined">commit</span>
                  <div className="absolute right-[-2rem] top-1/2 w-8 h-[2px] bg-primary"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface">Build & Test</span>
                  <span className="font-body-sm text-outline-variant">Latest commit passed 1,402 tests</span>
                </div>
              </div>
              <div className="flex items-center gap-md ml-12">
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/50 relative animate-pulse">
                  <span className="material-symbols-outlined">security</span>
                  <div className="absolute right-[-2rem] top-1/2 w-8 h-[2px] bg-white/10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface">Security Scan</span>
                  <span className="font-body-sm text-secondary">Scanning... 89% complete</span>
                </div>
              </div>
              <div className="flex items-center gap-md ml-24 opacity-50">
                <div className="w-12 h-12 rounded-full bg-surface-dim text-outline flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined">cloud_upload</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface">Production Deploy</span>
                  <span className="font-body-sm text-outline-variant">Waiting for previous stages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Roster */}
          <div className="col-span-1 glass-panel rounded-lg flex flex-col overflow-hidden">
            <div className="p-sm border-b border-white/5 bg-surface-container-low/50">
              <h3 className="font-label-sm text-label-sm text-on-surface font-bold uppercase">Team Roster</h3>
            </div>
            <div className="p-sm flex-grow overflow-y-auto flex flex-col gap-sm">
              {[
                { name: "Kira Voss", role: "Tech Lead", status: "online", initial: "K" },
                { name: "Maya Chen", role: "Product Manager", status: "online", initial: "M" },
                { name: "Ravi Patel", role: "Full-Stack", status: "busy", initial: "R" },
                { name: "You", role: "Platform Engineer", status: "online", initial: "Y" },
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-sm p-sm rounded hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      member.name === 'You' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-variant text-outline-variant'
                    }`}>
                      {member.initial}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-surface ${
                      member.status === 'online' ? 'bg-tertiary' : member.status === 'busy' ? 'bg-error' : 'bg-outline-variant'
                    }`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface">{member.name}</span>
                    <span className="font-body-sm text-[10px] text-outline-variant uppercase">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
