'use client';
import React, { useEffect } from 'react';

export default function EnterTheMetaverse() {
  useEffect(() => {
    // Interactions can be added here
  }, []);

  return (
    <>

{/*  Ambient Background Grid  */}
<div className="fixed inset-0 z-0 bg-grid opacity-50 pointer-events-none"></div>
<div className="crt-scanline"></div>
{/*  Top Navigation Shell (Suppressed for this linear onboarding flow, but keeping a minimal brand anchor)  */}
<header className="relative z-20 w-full px-margin py-md flex justify-between items-center">
<div className="font-headline-md text-headline-md text-primary tracking-tighter glow-sm flex items-center gap-xs">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>terminal</span>
            CODECRAFT
        </div>
<button className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md flex items-center gap-xs">
<span className="material-symbols-outlined">exit_to_app</span>
            Abort Sequence
        </button>
</header>
{/*  Main Content Canvas  */}
<main className="relative z-10 flex-grow flex flex-col items-center justify-center px-gutter py-xl">
{/*  Onboarding Sequence Container  */}
<div className="w-full max-w-6xl flex flex-col gap-lg">
{/*  Header Section  */}
<div className="text-center flex flex-col gap-sm items-center">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-label-sm uppercase tracking-widest mb-2">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Simulation Initialization
                </div>
<h1 className="font-display-lg text-display-lg text-on-surface">Select Career Track</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                    Define your environment parameters. Your choice dictates tech stack availability, chaos intensity, and AI team composition.
                </p>
</div>
{/*  Progress Steps  */}
<div className="flex justify-center items-center gap-md mb-md">
<div className="flex items-center gap-xs">
<div className="w-8 h-1 rounded-full step-indicator active"></div>
<span className="font-label-sm text-label-sm text-primary">Track</span>
</div>
<div className="flex items-center gap-xs opacity-50">
<div className="w-8 h-1 rounded-full bg-surface-variant step-indicator"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Company</span>
</div>
<div className="flex items-center gap-xs opacity-50">
<div className="w-8 h-1 rounded-full bg-surface-variant step-indicator"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Team</span>
</div>
<div className="flex items-center gap-xs opacity-50">
<div className="w-8 h-1 rounded-full bg-surface-variant step-indicator"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Params</span>
</div>
</div>
{/*  Faction Selection Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-md lg:gap-gutter">
{/*  Startup Track  */}
<button className="faction-card glass-panel rounded-xl p-md flex flex-col text-left group relative overflow-hidden" onClick={() => console.log('Faction selected')}>
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[120px] text-tertiary-fixed">rocket_launch</span>
</div>
<div className="mb-lg z-10">
<div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center border border-tertiary/20 mb-md">
<span className="material-symbols-outlined text-tertiary-fixed">rocket_launch</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Hyper-Growth Startup</h2>
<p className="font-body-md text-body-md text-on-surface-variant">High velocity, high ambiguity. Build from scratch and scale rapidly.</p>
</div>
<div className="mt-auto space-y-sm z-10 border-t border-white/5 pt-md">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Tech Stack</span>
<span className="font-label-sm text-label-sm text-tertiary-fixed-dim">Modern / Bleeding Edge</span>
</div>
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Chaos Intensity</span>
<div className="flex gap-1">
<span className="w-1.5 h-3 bg-error rounded-sm"></span>
<span className="w-1.5 h-3 bg-error rounded-sm"></span>
<span className="w-1.5 h-3 bg-error rounded-sm"></span>
<span className="w-1.5 h-3 bg-surface-variant rounded-sm"></span>
</div>
</div>
</div>
</button>
{/*  Enterprise Track  */}
<button className="faction-card glass-panel rounded-xl p-md flex flex-col text-left group relative overflow-hidden selected" onClick={() => console.log('Faction selected')}>
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[120px] text-primary">domain</span>
</div>
<div className="mb-lg z-10">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 mb-md">
<span className="material-symbols-outlined text-primary">domain</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Global Enterprise</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Legacy systems, massive scale. Navigate bureaucracy and optimize architecture.</p>
</div>
<div className="mt-auto space-y-sm z-10 border-t border-white/5 pt-md">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Tech Stack</span>
<span className="font-label-sm text-label-sm text-primary">Stable / Monolithic</span>
</div>
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Chaos Intensity</span>
<div className="flex gap-1">
<span className="w-1.5 h-3 bg-tertiary rounded-sm"></span>
<span className="w-1.5 h-3 bg-tertiary rounded-sm"></span>
<span className="w-1.5 h-3 bg-surface-variant rounded-sm"></span>
<span className="w-1.5 h-3 bg-surface-variant rounded-sm"></span>
</div>
</div>
</div>
</button>
{/*  OSS Track  */}
<button className="faction-card glass-panel rounded-xl p-md flex flex-col text-left group relative overflow-hidden" onClick={() => console.log('Faction selected')}>
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[120px] text-secondary">code_blocks</span>
</div>
<div className="mb-lg z-10">
<div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20 mb-md">
<span className="material-symbols-outlined text-secondary">code_blocks</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Open Source Maintainer</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Community-driven, public scrutiny. Manage PRs, triage issues, build trust.</p>
</div>
<div className="mt-auto space-y-sm z-10 border-t border-white/5 pt-md">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Tech Stack</span>
<span className="font-label-sm text-label-sm text-secondary">Agnostic / Diverse</span>
</div>
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Chaos Intensity</span>
<div className="flex gap-1">
<span className="w-1.5 h-3 bg-secondary rounded-sm"></span>
<span className="w-1.5 h-3 bg-secondary rounded-sm"></span>
<span className="w-1.5 h-3 bg-secondary rounded-sm"></span>
<span className="w-1.5 h-3 bg-secondary rounded-sm"></span>
</div>
</div>
</div>
</button>
</div>
{/*  Action Area  */}
<div className="flex justify-center mt-xl">
<button className="holo-fx bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-headline-md text-headline-md px-xl py-md rounded-lg shadow-[0px_0px_40px_rgba(0,218,243,0.3)] hover:shadow-[0px_0px_60px_rgba(0,218,243,0.5)] transition-all duration-300 flex items-center gap-sm transform hover:scale-[1.02] active:scale-[0.98]">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
                    Start Your First Sprint
                </button>
</div>
</div>
</main>


</>
  );
}
