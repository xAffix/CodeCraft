'use client';
import React, { useEffect } from 'react';

export default function MissionControl() {
  useEffect(() => {
    // Interactions can be added here
  }, []);

  return (
    <>

{/*  DESKTOP SIDE NAV (Hidden on Mobile)  */}
<nav className="hidden md:flex flex-col h-full py-lg fixed left-0 top-0 w-64 border-r border-white/10 bg-surface/60 backdrop-blur-xl z-50">
{/*  Brand  */}
<div className="px-gutter mb-xl flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(195,245,255,0.2)]">
<span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "\'FILL\' 1" }}>terminal</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">CODECRAFT</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant">Trust Score: 98.4</p>
</div>
</div>
{/*  Navigation Links  */}
<ul className="flex flex-col gap-base flex-grow">
{/*  Active Item: Mission Control  */}
<li className="relative">
<a className="flex items-center gap-md py-sm text-primary font-bold border-l-2 border-primary pl-4 bg-gradient-to-r from-primary/10 to-transparent hover:text-primary hover:bg-white/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>dashboard</span>
<span className="font-label-md text-label-md">Mission Control</span>
</a>
</li>
{/*  Inactive Items  */}
<li>
<a className="flex items-center gap-md py-sm text-on-surface-variant font-medium pl-4 hover:text-primary hover:bg-white/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined">simulation</span>
<span className="font-label-md text-label-md">Active Simulations</span>
</a>
</li>
<li>
<a className="flex items-center gap-md py-sm text-on-surface-variant font-medium pl-4 hover:text-primary hover:bg-white/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined">layers</span>
<span className="font-label-md text-label-md">Tech Stack</span>
</a>
</li>
<li>
<a className="flex items-center gap-md py-sm text-on-surface-variant font-medium pl-4 hover:text-primary hover:bg-white/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined">smart_toy</span>
<span className="font-label-md text-label-md">Team AI</span>
</a>
</li>
<li>
<a className="flex items-center gap-md py-sm text-on-surface-variant font-medium pl-4 hover:text-primary hover:bg-white/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined">terminal</span>
<span className="font-label-md text-label-md">Terminal</span>
</a>
</li>
</ul>
{/*  Bottom CTA / User Profile  */}
<div className="px-gutter mt-auto pt-lg border-t border-white/5">
<button className="w-full bg-gradient-to-r from-primary to-secondary-container text-on-primary font-label-md text-label-md py-sm rounded-lg flex items-center justify-center gap-sm hover:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(195,245,255,0.2)] border border-white/10">
<span className="material-symbols-outlined text-sm">rocket_launch</span>
                Enter Simulation
            </button>
</div>
</nav>
{/*  MOBILE BOTTOM NAV (Visible only on Mobile)  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center py-sm px-xs pb-6">
<a className="flex flex-col items-center text-primary" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>dashboard</span>
<span className="font-label-sm text-label-sm mt-1">Control</span>
</a>
<a className="flex flex-col items-center text-on-surface-variant" href="#">
<span className="material-symbols-outlined">simulation</span>
<span className="font-label-sm text-label-sm mt-1">Sims</span>
</a>
<a className="flex flex-col items-center text-on-surface-variant" href="#">
<span className="material-symbols-outlined">smart_toy</span>
<span className="font-label-sm text-label-sm mt-1">AI</span>
</a>
<a className="flex flex-col items-center text-on-surface-variant" href="#">
<span className="material-symbols-outlined">terminal</span>
<span className="font-label-sm text-label-sm mt-1">Term</span>
</a>
</nav>
{/*  MAIN CONTENT AREA  */}
<main className="flex-grow md:ml-64 relative min-h-screen cyber-grid pb-32 md:pb-24">
{/*  TOP APP BAR  */}
<header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md flex justify-between items-center w-full px-margin py-base border-b border-white/5">
<div>
<h2 className="hidden md:block font-headline-md text-headline-md text-primary drop-shadow-[0_0_8px_rgba(195,245,255,0.5)]">Mission Control</h2>
<h2 className="md:hidden font-headline-lg-mobile text-headline-lg-mobile text-primary drop-shadow-[0_0_8px_rgba(195,245,255,0.5)] font-bold tracking-tight">CODECRAFT</h2>
</div>
<div className="flex items-center gap-md">
{/*  Search (Icon on right logic)  */}
<div className="hidden md:flex items-center bg-surface-container border border-white/10 rounded-full px-4 py-1.5 focus-within:border-primary focus-within:shadow-[0_0_10px_rgba(195,245,255,0.2)] transition-all">
<input className="bg-transparent border-none text-label-md font-label-md text-on-surface focus:ring-0 placeholder:text-on-surface-variant w-48" placeholder="Search systems..." type="text"/>
<span className="material-symbols-outlined text-on-surface-variant text-sm ml-2">search</span>
</div>
<div className="flex items-center gap-sm">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-[1px]">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-[1px]">
<span className="material-symbols-outlined">settings</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-[1px]">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</header>
{/*  DASHBOARD CANVAS (Bento Grid Layout)  */}
<div className="p-margin max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-md items-start">
{/*  Welcome / Status Banner (Spans Full)  */}
<div className="col-span-1 md:col-span-12 glass-panel rounded-xl p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-l-4 border-l-tertiary">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        System Nominal <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_10px_#abffcb] animate-pulse"></span>
</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">All core simulations running. AI cluster optimal.</p>
</div>
<div className="flex gap-sm">
<span className="px-3 py-1 bg-tertiary/10 border border-tertiary/30 text-tertiary font-label-sm text-label-sm rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span> 0 Incidents
                    </span>
<span className="px-3 py-1 bg-surface-container border border-white/10 text-on-surface-variant font-label-sm text-label-sm rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Uptime: 99.9%
                    </span>
</div>
</div>
{/*  Widget 1: Trust Score Progress (Col 1-4)  */}
<div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-md flex flex-col h-full relative overflow-hidden ambient-glow-active">
{/*  Subtle background decoration  */}
<div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
<div className="flex justify-between items-center mb-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Trust Score</h4>
<span className="material-symbols-outlined text-primary">security</span>
</div>
<div className="flex-grow flex flex-col justify-center items-center py-sm">
<div className="relative w-32 h-32 flex items-center justify-center">
{/*  Simulated SVG Donut Chart  */}
<svg className="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" stroke-width="8"></circle>
<circle className="text-primary drop-shadow-[0_0_8px_rgba(195,245,255,0.5)]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" stroke-dasharray="283" stroke-dashoffset="15" stroke-width="8"></circle>
</svg>
<div className="absolute flex flex-col items-center">
<span className="font-display-lg text-display-lg text-on-surface">98<span className="text-headline-md text-on-surface-variant">.4</span></span>
</div>
</div>
</div>
<div className="mt-auto pt-sm border-t border-white/5 flex justify-between items-center text-label-sm font-label-sm">
<span className="text-tertiary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> +1.2%</span>
<span className="text-on-surface-variant">Last 7 days</span>
</div>
</div>
{/*  Widget 2: Current Sprint Overview (Col 5-8)  */}
<div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-md flex flex-col h-full">
<div className="flex justify-between items-center mb-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Sprint Velocity</h4>
<span className="material-symbols-outlined text-secondary">sprint</span>
</div>
<div className="flex-grow flex flex-col justify-center gap-sm">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface">Completed</span>
<span className="text-secondary">42 / 60 pts</span>
</div>
{/*  Progress Bar  */}
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary w-[70%] shadow-[0_0_10px_#c9bfff]"></div>
</div>
<div className="grid grid-cols-2 gap-sm mt-4">
<div className="bg-surface-container/50 p-sm rounded border border-white/5">
<span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Bugs Fixed</span>
<span className="font-headline-md text-headline-md text-on-surface">14</span>
</div>
<div className="bg-surface-container/50 p-sm rounded border border-white/5">
<span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Features</span>
<span className="font-headline-md text-headline-md text-on-surface">8</span>
</div>
</div>
</div>
</div>
{/*  Widget 3: Active Chaos Alerts (Col 9-12)  */}
<div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-md flex flex-col h-full border-t-2 border-t-error">
<div className="flex justify-between items-center mb-md">
<h4 className="font-label-md text-label-md text-error uppercase tracking-widest">Chaos Alerts</h4>
<span className="material-symbols-outlined text-error animate-pulse">warning</span>
</div>
<div className="flex-grow flex flex-col gap-sm overflow-y-auto max-h-[200px] pr-2">
{/*  Alert Item  */}
<div className="bg-error-container/20 border border-error/20 p-sm rounded flex items-start gap-sm">
<span className="material-symbols-outlined text-error text-[18px] mt-0.5">memory</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface font-bold">Memory Leak Detected</p>
<p className="font-label-sm text-label-sm text-on-error-container mt-1">Simulation Node alpha-7 showing anomalous RAM usage pattern.</p>
</div>
</div>
{/*  Alert Item  */}
<div className="bg-surface-container p-sm rounded border border-white/5 flex items-start gap-sm">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">api</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface">Latency Spike</p>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-1">API gateway handling auth experiencing +40ms delay.</p>
</div>
</div>
</div>
</div>
{/*  Widget 4: Simulation Timeline / Active Sims (Col 1-8)  */}
<div className="col-span-1 md:col-span-8 glass-panel rounded-xl p-md flex flex-col">
<div className="flex justify-between items-center mb-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Active Simulations</h4>
<button className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1">
                        View Matrix <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
{/*  Sim Card 1  */}
<div className="bg-surface-container-low border border-white/10 rounded-lg p-sm hover:border-primary/50 hover:shadow-[0_0_15px_rgba(195,245,255,0.1)] transition-all cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<div>
<span className="px-2 py-0.5 bg-primary/10 text-primary font-label-sm text-label-sm rounded text-[10px] uppercase border border-primary/20">Running</span>
<h5 className="font-body-md text-body-md text-on-surface font-medium mt-2 group-hover:text-primary transition-colors">Quantum State Router</h5>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">hub</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full mb-2">
<div className="bg-primary h-1 rounded-full w-[85%]"></div>
</div>
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant text-[11px]">
<span>Epoch 4200</span>
<span>ETA: 12m</span>
</div>
</div>
{/*  Sim Card 2  */}
<div className="bg-surface-container-low border border-white/10 rounded-lg p-sm hover:border-tertiary/50 hover:shadow-[0_0_15px_rgba(171,255,203,0.1)] transition-all cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<div>
<span className="px-2 py-0.5 bg-tertiary/10 text-tertiary font-label-sm text-label-sm rounded text-[10px] uppercase border border-tertiary/20">Optimizing</span>
<h5 className="font-body-md text-body-md text-on-surface font-medium mt-2 group-hover:text-tertiary transition-colors">Neural Load Balancer</h5>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">network_node</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full mb-2">
<div className="bg-tertiary h-1 rounded-full w-[40%]"></div>
</div>
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant text-[11px]">
<span>Epoch 1150</span>
<span>ETA: 45m</span>
</div>
</div>
</div>
</div>
{/*  Widget 5: Terminal Activity Feed (Col 9-12)  */}
<div className="col-span-1 md:col-span-4 bg-[#0a0a0a] border border-white/10 rounded-xl flex flex-col overflow-hidden h-[300px] shadow-inner relative">
{/*  Glare effect  */}
<div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
<div className="bg-[#1a1a1a] px-md py-sm border-b border-white/10 flex justify-between items-center">
<h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error"></span> Terminal output
                    </h4>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">terminal</span>
</div>
<div className="p-sm flex-grow overflow-y-auto font-label-sm text-label-sm flex flex-col gap-1 text-[11px]">
<div className="text-tertiary-fixed-dim"><span className="text-on-surface-variant mr-2">14:02:11</span>&gt; Initializing connection to core cluster...</div>
<div className="text-tertiary-fixed-dim"><span className="text-on-surface-variant mr-2">14:02:12</span>&gt; Connection established. Latency: 12ms.</div>
<div className="text-on-surface-variant"><span className="text-on-surface-variant mr-2">14:02:15</span>&gt; Fetching telemetry data from pod-A7...</div>
<div className="text-primary"><span className="text-on-surface-variant mr-2">14:02:18</span>&gt; Data stream active. Analyzing patterns...</div>
<div className="text-error"><span className="text-on-surface-variant mr-2">14:03:01</span>&gt; WARN: Minor packet loss detected on port 8080.</div>
<div className="text-tertiary-fixed-dim"><span className="text-on-surface-variant mr-2">14:03:05</span>&gt; Rerouting traffic... Successful.</div>
<div className="text-on-surface-variant"><span className="text-on-surface-variant mr-2">14:03:10</span>&gt; Awaiting next instruction command...</div>
<div className="flex items-center mt-2">
<span className="text-primary mr-2">root@codecraft:~#</span>
<span className="w-2 h-4 bg-primary animate-pulse inline-block"></span>
</div>
</div>
</div>
{/*  Widget 6: AI Team Activity & Skill Graph (Full width bottom area)  */}
<div className="col-span-1 md:col-span-12 glass-panel rounded-xl p-md flex flex-col md:flex-row gap-lg">
{/*  AI Team List  */}
<div className="w-full md:w-1/3">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md">AI Agent Swarm</h4>
<div className="flex flex-col gap-sm">
{/*  Agent  */}
<div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center border border-primary/30">
<span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface">Unit-01: Refactor</p>
<p className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Processing 4 files</p>
</div>
</div>
<span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_5px_#abffcb]"></span>
</div>
{/*  Agent  */}
<div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center border border-secondary/30">
<span className="material-symbols-outlined text-secondary text-[18px]">bug_report</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface">Unit-02: QA Bot</p>
<p className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Running test suite</p>
</div>
</div>
<span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_5px_#abffcb]"></span>
</div>
</div>
</div>
{/*  Productivity Heatmap Placeholder  */}
<div className="w-full md:w-2/3 flex flex-col">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md">Code Deposition Heatmap</h4>
<div className="flex-grow bg-surface-container-low border border-white/5 rounded p-sm flex items-end gap-1 opacity-80">
{/*  Simulated Activity Graph Bars  */}
<div className="w-full flex items-end justify-between h-32 gap-1 px-2">
{/*  JS script below will populate this to avoid repetitive HTML  */}

</div>
</div>
</div>
</div>
</div>
</main>
{/*  DESKTOP FOOTER (Hidden on mobile to save space, or adjusted)  */}
<footer className="hidden md:flex fixed bottom-0 left-64 right-0 z-50 justify-between items-center px-gutter py-xs bg-surface-container-lowest/80 backdrop-blur-md border-t border-white/5 flat no shadows">
<p className="font-label-sm text-label-sm text-tertiary-fixed-dim">
            System Latency: 24ms | Active Tickets: 12 | Incidents: 0
        </p>
<div className="flex gap-md">
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Documentation</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Support</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">API Status</a>
</div>
</footer>

</>
  );
}
