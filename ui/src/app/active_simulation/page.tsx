'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActiveSimulations from '@/components/ActiveSimulations';
import MissionControl from '@/components/MissionControl';
import TeamAI from '@/components/TeamAI';
import { supabase } from '@/lib/supabase';

export default function ActiveSimulation() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Active Simulations");
  const [showAlert, setShowAlert] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check real auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/');
      } else {
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || 'Engineer');
      }
    });
  }, [router]);
  
  const [metrics, setMetrics] = useState({ cpu: 89, memory: 42, connections: 1024 });
  const [logs, setLogs] = useState([
    { time: "14:02:44", type: "INFO", text: "Initializing deployment sequence for branch feature/temporal-auth..." },
    { time: "14:02:45", type: "INFO", text: "Building Docker containers... done" },
    { time: "14:02:48", type: "INFO", text: "Running integration tests (Simulation V3)..." },
    { time: "14:03:01", type: "WARN", text: "Latency spike detected during test suite execution (>500ms)." },
    { time: "14:03:05", type: "INFO", text: "Pushing to registry us-east-1.codecraft.sim..." }
  ]);

  useEffect(() => {
    // Jitter metrics
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + Math.floor(Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + Math.floor(Math.random() * 6 - 3))),
        connections: Math.max(0, prev.connections + Math.floor(Math.random() * 40 - 20))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Random log generation
    const possibleLogs = [
      "Scaling up auth-service workers...",
      "Cache hit ratio: 94.2%",
      "Incoming request from remote proxy [REDACTED]",
      "Compiling rust binaries...",
      "Network partition detected and resolved.",
      "Garbage collection cycle completed (12ms)."
    ];
    const interval = setInterval(() => {
      const date = new Date();
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
      setLogs(prev => {
        const newLogs = [...prev, { time: timeStr, type: "INFO", text: randomLog }];
        if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8);
        return newLogs;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex w-full min-h-screen">
      {/*  Ambient Background Lighting Effect  */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none z-0"></div>
      
      {/*  SideNavBar  */}
      <nav className="bg-surface/60 backdrop-blur-xl fixed left-0 top-0 h-full w-64 border-r border-white/10 shadow-[0px_0px_40px_rgba(0,218,243,0.1)] flex flex-col py-lg z-50">
        <div className="px-gutter mb-lg flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <img alt="Developer Profile" className="w-10 h-10 rounded-full border border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCdoUtE9ePryM7VGjuqwTLmgW8VwPbmdkqlbAqYQWRw7blFzVfFSCnvfhjfwWRqc0dRY6YxeZ9WG8xSbcUD8dM0g2plbyUWBjmqMY9Mv10Gwpsj9X8nFDfvwSrG1hlYmgoK06IflqSdk0p5BoYTunDD6hUbyHlDHMBkRKMobXgio6pNcYPLCIqczSBjurlbfgCFmQk95IMGNGs5WljqBxKbKefCs17PVG6jw4mw1EenX3BclK1EvblGmS6jm-5q4y1ClqY5ZzaCtE" />
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">CODECRAFT</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Trust Score: 98.4</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow gap-2 px-sm">
          {["Mission Control", "Active Simulations", "Tech Stack", "Team AI", "Terminal"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-md py-sm rounded-r-full pl-4 transition-all duration-300 w-full text-left ${activeTab === tab ? 'text-primary font-bold border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent scale-[0.98]' : 'text-on-surface-variant font-medium hover:text-primary hover:bg-white/5'}`}>
              <span className="material-symbols-outlined" style={activeTab === tab ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {tab === "Mission Control" ? "dashboard" : tab === "Active Simulations" ? "simulation" : tab === "Tech Stack" ? "layers" : tab === "Team AI" ? "smart_toy" : "terminal"}
              </span>
              <span className="font-label-md text-label-md">{tab}</span>
            </button>
          ))}
        </div>
        
        <div className="px-gutter mt-auto pt-lg border-t border-white/5">
          <button onClick={handleSignOut} className="w-full py-sm px-md rounded bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-md text-label-md font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">rocket_launch</span>
            Sign Out
          </button>
        </div>
      </nav>

      {/*  TopAppBar  */}
      <header className="bg-transparent full-width top-0 flex justify-between items-center w-full px-margin py-base ml-64 z-40 relative">
        <div className="flex items-center gap-md">
          <h2 className="font-headline-md text-headline-md text-primary glow-sm tracking-tight font-bold">{activeTab}</h2>
        </div>
        <div className="flex items-center gap-lg">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-surface-container/50 border border-white/10 rounded-full pl-10 pr-4 py-1.5 font-label-sm text-label-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder-on-surface-variant/50" placeholder="Search commands, logs, tickets..." type="text"/>
          </div>
          <div className="flex items-center gap-md text-on-surface-variant">
            <button className="hover:text-primary transition-colors relative hover:-translate-y-[1px] transition-transform">
              <span className="material-symbols-outlined">notifications</span>
              {showAlert && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error animate-pulse"></span>}
            </button>
            <button className="hover:text-primary transition-colors hover:-translate-y-[1px] transition-transform">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="hover:text-primary transition-colors hover:-translate-y-[1px] transition-transform">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/*  Main Canvas  */}
      <main className="ml-64 p-gutter pt-0 pb-xl h-[calc(100vh-4rem)] overflow-hidden flex flex-col gap-base relative z-10 w-full">
        {activeTab === "Mission Control" && <MissionControl />}
        {activeTab === "Active Simulations" && <ActiveSimulations showAlert={showAlert} setShowAlert={setShowAlert} logs={logs} metrics={metrics} />}
        {activeTab === "Team AI" && <TeamAI />}
        
        {/* Placeholder for others */}
        {activeTab !== "Mission Control" && activeTab !== "Active Simulations" && activeTab !== "Team AI" && (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant font-label-md glass-panel rounded-lg ambient-glow">
            <span className="material-symbols-outlined text-[48px] text-primary/30 mb-sm">construction</span>
            <span className="tracking-widest uppercase">Module Offline</span>
            <span className="text-outline-variant font-body-sm mt-1">Please check access permissions or await future deployment.</span>
          </div>
        )}
      </main>

      {/*  Footer  */}
      <footer className="bg-surface-container-lowest/80 backdrop-blur-md border-t border-white/5 fixed bottom-0 left-64 right-0 z-50 flex justify-between items-center px-gutter py-xs">
        <div className="font-label-sm text-label-sm text-tertiary-fixed-dim">
          System Latency: {Math.max(10, metrics.cpu - 60)}ms | Active Tickets: {showAlert ? 13 : 12} | Incidents: {showAlert ? 1 : 0}
        </div>
        <div className="flex gap-md font-label-sm text-label-sm">
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Documentation</a>
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Support</a>
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">API Status</a>
        </div>
      </footer>
    </div>
  );
}
