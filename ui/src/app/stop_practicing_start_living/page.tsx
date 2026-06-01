'use client';
import React, { useEffect } from 'react';

export default function StopPracticingStartLiving() {
  useEffect(() => {
    // Interactions can be added here
  }, []);

  return (
    <>

{/*  TopAppBar  */}
<nav className="bg-transparent flex justify-between items-center w-full px-margin py-base fixed top-0 z-50">
<div className="flex items-center gap-sm">
<span className="font-headline-md text-headline-md text-primary glow-sm font-bold tracking-tighter">CodeCraft</span>
</div>
<div className="flex items-center gap-md">
{/*  Search placeholder  */}
<div className="hidden md:flex items-center gap-xs glass-panel px-sm py-xs rounded-full">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Search parameters...</span>
</div>
<div className="flex items-center gap-sm">
<button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8 hover:translate-y-[-1px] transition-transform">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 0" }}>notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8 hover:translate-y-[-1px] transition-transform">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 0" }}>settings</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8 hover:translate-y-[-1px] transition-transform">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 0" }}>account_circle</span>
</button>
</div>
</div>
</nav>
{/*  Canvas/Main Content  */}
<main className="w-full">
{/*  Hero Section  */}
<section className="relative min-h-screen flex items-center justify-center pt-xl pb-xl px-gutter overflow-hidden">
{/*  Ambient Background Glows  */}
<div className="absolute inset-0 ambient-glow pointer-events-none opacity-80"></div>
<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
<div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
{/*  Floating UI Elements (Abstracted)  */}
<div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
{/*  PR Review Card  */}
<div className="absolute top-[20%] left-[10%] glass-panel rounded-lg p-sm w-64 animate-float-slow opacity-60 transform -rotate-6">
<div className="flex items-center gap-xs mb-xs">
<span className="material-symbols-outlined text-tertiary text-[16px]">merge</span>
<span className="font-label-sm text-label-sm text-on-surface">PR-842: Auth Refactor</span>
</div>
<div className="h-2 w-3/4 bg-surface-container rounded-full mb-1"></div>
<div className="h-2 w-1/2 bg-surface-container rounded-full"></div>
</div>
{/*  Ticket Card  */}
<div className="absolute bottom-[25%] right-[12%] glass-panel rounded-lg p-sm w-56 animate-float-fast opacity-50 transform rotate-3">
<div className="flex items-center gap-xs mb-xs">
<span className="material-symbols-outlined text-error text-[16px]">bug_report</span>
<span className="font-label-sm text-label-sm text-on-surface">CORE-091: Memory Leak</span>
</div>
<div className="flex items-center gap-xs mt-2">
<div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/50"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">In Progress</span>
</div>
</div>
{/*  Terminal Snippet  */}
<div className="absolute top-[60%] left-[15%] glass-panel rounded-lg p-md w-72 animate-float-slow opacity-40" style={{ animationDelay: "-2s" }}>
<div className="font-label-sm text-label-sm text-primary-fixed-dim">~ $ npm run deploy:prod</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Deploying to eu-central-1...</div>
<div className="font-label-sm text-label-sm text-tertiary mt-1">Success: 240ms</div>
</div>
</div>
{/*  Hero Content  */}
<div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
<div className="inline-flex items-center gap-2 glass-panel px-md py-xs rounded-full mb-lg">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span className="font-label-md text-label-md text-tertiary">System Online V2.4</span>
</div>
<h1 className="font-display-lg text-display-lg md:text-[72px] md:leading-[1.05] gradient-text mb-md">
                    Stop Practicing Coding.<br/>
<span className="text-on-background">Start Living Engineering.</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
                    Step into an elite, hyper-realistic engineering simulation. Resolve complex outages, negotiate architectural technical debt, and ship code alongside advanced AI senior engineers.
                </p>
<div className="flex flex-col sm:flex-row gap-md items-center justify-center">
<button className="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-md text-label-md px-margin py-sm rounded-full hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-300 flex items-center gap-xs">
                        Enter Simulation
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<button className="glass-panel text-on-surface font-label-md text-label-md px-margin py-sm rounded-full hover:bg-white/5 transition-all duration-300">
                        View Architectures
                    </button>
</div>
</div>
</section>
{/*  Section 2: How it Works (Ticket to Ship)  */}
<section className="py-xl px-gutter max-w-[1400px] mx-auto">
<div className="mb-lg">
<h2 className="font-headline-lg text-headline-lg text-on-background mb-xs">The Engineering Lifecycle</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Experience the full spectrum of modern software delivery.</p>
</div>
{/*  Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-md">
{/*  Card 1  */}
<div className="glass-panel rounded-xl p-md flex flex-col md:col-span-1 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[48px] text-primary">assignment</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-md border border-white/10">
<span className="font-label-md text-label-md text-primary">01</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-sm">Groom &amp; Plan</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                        Analyze vague product requirements, push back on scope creep, and break down epics into actionable technical tasks.
                    </p>
</div>
{/*  Card 2  */}
<div className="glass-panel rounded-xl p-md flex flex-col md:col-span-1 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[48px] text-secondary">code_blocks</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-md border border-white/10">
<span className="font-label-md text-label-md text-secondary">02</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-sm">Architecture &amp; Implementation</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                        Design scalable systems within constraints. Write clean, performant code while navigating legacy systems and technical debt.
                    </p>
</div>
{/*  Card 3  */}
<div className="glass-panel rounded-xl p-md flex flex-col md:col-span-1 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[48px] text-tertiary">rocket_launch</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-md border border-white/10">
<span className="font-label-md text-label-md text-tertiary">03</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-sm">Review &amp; Deploy</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                        Defend your PRs against rigorous AI reviewers. Manage CI/CD pipelines, monitor metrics, and ensure zero-downtime deployments.
                    </p>
</div>
</div>
</section>
{/*  Section 3: The Chaos Engine  */}
<section className="py-xl px-gutter relative border-y border-white/5 bg-surface-container-lowest/50">
<div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
<div>
<div className="inline-flex items-center gap-xs px-sm py-xs rounded-md bg-error/10 border border-error/20 mb-md">
<span className="material-symbols-outlined text-error text-[16px]">warning</span>
<span className="font-label-sm text-label-sm text-error uppercase tracking-wider">Simulation Variant: Alpha</span>
</div>
<h2 className="font-display-lg text-display-lg text-on-background mb-md">The Chaos Engine</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                        Engineering isn&apos;t just about building; it&apos;s about surviving. Our Chaos Engine randomly injects realistic production incidents—from database deadlocks to CDN outages—testing your ability to debug under pressure.
                    </p>
<ul className="space-y-sm mb-lg">
<li className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="font-body-md text-body-md text-on-surface">Simulated high-traffic DDOS events</span>
</li>
<li className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="font-body-md text-body-md text-on-surface">Silent data corruption scenarios</span>
</li>
<li className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="font-body-md text-body-md text-on-surface">Inter-service latency spikes</span>
</li>
</ul>
</div>
{/*  Abstract UI Representation of Chaos  */}
<div className="relative h-[400px] glass-panel rounded-xl overflow-hidden flex flex-col">
{/*  Fake Top Bar  */}
<div className="h-10 bg-surface-container border-b border-white/5 flex items-center px-sm gap-2">
<div className="w-3 h-3 rounded-full bg-error/50"></div>
<div className="w-3 h-3 rounded-full bg-outline-variant/50"></div>
<div className="w-3 h-3 rounded-full bg-outline-variant/50"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant ml-sm">Grafana: Production Overview</span>
</div>
{/*  Fake Metrics  */}
<div className="flex-grow p-md flex flex-col gap-sm relative">
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,0,10,0.1)_0%,transparent_70%)] pointer-events-none"></div>
<div className="flex justify-between items-end h-1/2 border-b border-error/20 pb-sm">
<div className="w-1/6 h-[20%] bg-surface-container rounded-t-sm"></div>
<div className="w-1/6 h-[30%] bg-surface-container rounded-t-sm"></div>
<div className="w-1/6 h-[25%] bg-surface-container rounded-t-sm"></div>
<div className="w-1/6 h-[80%] bg-error rounded-t-sm shadow-[0_0_15px_rgba(255,180,171,0.5)] relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-error">502</span>
</div>
<div className="w-1/6 h-[90%] bg-error rounded-t-sm shadow-[0_0_15px_rgba(255,180,171,0.5)]"></div>
</div>
<div className="font-label-sm text-label-sm text-error flex items-center gap-xs mt-sm">
<span className="material-symbols-outlined text-[16px]">priority_high</span>
                            CRITICAL: API Latency &gt; 5000ms
                        </div>
</div>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="bg-surface-container-lowest/80 backdrop-blur-md border-t border-white/5 fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center px-gutter py-xs">
<div className="font-label-sm text-label-sm text-on-surface-variant">
            System Latency: 24ms | Active Tickets: 12 | Incidents: 0
        </div>
<div className="flex gap-md hidden sm:flex">
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Documentation</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Support</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">API Status</a>
</div>
</footer>
{/*  Pad main content so it doesn't hide behind fixed footer  */}
<div className="h-16"></div>

</>
  );
}
