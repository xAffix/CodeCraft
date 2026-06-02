'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActiveSimulations from '@/components/ActiveSimulations';
import MissionControl from '@/components/MissionControl';
import TeamAI from '@/components/TeamAI';
import TicketBoard from '@/components/TicketBoard';
import CodeWorkspace from '@/components/CodeWorkspace';
import SimChat from '@/components/SimChat';
import CodePlayground from '@/components/CodePlayground';
import Portfolio from '@/components/Portfolio';
import SkillGraph from '@/components/SkillGraph';
import Onboarding from '@/components/Onboarding';
import { supabase, api } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ActiveSimulation() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Mission Control");
  const [showAlert, setShowAlert] = useState(true);
  const [incidentCount, setIncidentCount] = useState(0);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [inWorkspace, setInWorkspace] = useState(false);

  useEffect(() => {
    // Check auth — real Supabase session or dev bypass
    const checkAuth = async () => {
      // Check dev session first
      const devSession = localStorage.getItem('codecraft_dev_session');
      if (devSession) {
        const parsed = JSON.parse(devSession);
        if (parsed.expiresAt > Date.now()) {
          setUserName(parsed.name || 'Dev Engineer');
          // Load trust score
          loadTrustScore();
          return;
        }
        // Expired — clear it
        localStorage.removeItem('codecraft_dev_session');
        localStorage.removeItem('codecraft_dev_token');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || 'Engineer');
        loadTrustScore();
      }
    };
    checkAuth();
  }, [router]);

  // Listen for chaos incidents via WebSocket
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//localhost:3001/ws${token ? `?token=${token}` : ''}`);

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'chaos:alert') {
              setIncidentCount(prev => prev + 1);
              setShowAlert(true);
              setActiveIncidents(prev => [...prev.slice(-4), msg.payload]);
            } else if (msg.type === 'chaos:resolved') {
              setActiveIncidents(prev => prev.filter(i => i.id !== msg.payload.resolvedIncidentId));
            }
          } catch { /* ignore */ }
        };

        ws.onclose = () => {
          reconnectTimer = setTimeout(connect, 10000);
        };
      } catch { /* ws unavailable */ }
    };

    connect();
    return () => {
      ws?.close();
      clearTimeout(reconnectTimer);
    };
  }, []);
  
  const [metrics, setMetrics] = useState({ cpu: 89, memory: 42, connections: 1024 });
  const [logs, setLogs] = useState([
    { time: "14:02:44", type: "INFO", text: "Initializing deployment sequence for branch feature/temporal-auth..." },
    { time: "14:02:45", type: "INFO", text: "Building Docker containers... done" },
    { time: "14:02:48", type: "INFO", text: "Running integration tests (Simulation V3)..." },
    { time: "14:03:01", type: "WARN", text: "Latency spike detected during test suite execution (>500ms)." },
    { time: "14:03:05", type: "INFO", text: "Pushing to registry us-east-1.codecraft.sim..." }
  ]);

  useEffect(() => {
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
    localStorage.removeItem('codecraft_dev_session');
    localStorage.removeItem('codecraft_dev_token');
    router.push('/');
  };

  const loadTrustScore = async () => {
    try {
      const data = await api('/trust/score');
      if (data?.total) setTrustScore(data.total);
    } catch { /* silent */ }
  };

  const tabs = [
    { id: "Mission Control", icon: "dashboard" },
    { id: "Active Simulations", icon: "simulation" },
    { id: "Code Workspace", icon: "code" },
    { id: "Team AI", icon: "smart_toy" },
    { id: "Portfolio", icon: "badge" },
    { id: "Skills", icon: "psychology" },
    { id: "Playground", icon: "play_circle" },
  ];

  return (
    <div className="flex w-full min-h-screen">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none z-0"></div>
      
      {/* SideNavBar */}
      <nav className="bg-surface/60 backdrop-blur-xl fixed left-0 top-0 h-full w-64 border-r border-white/10 shadow-[0px_0px_40px_rgba(0,218,243,0.1)] flex flex-col py-lg z-50" id="sidebar-nav">
        <div className="px-gutter mb-lg flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <img alt="Profile" className="w-10 h-10 rounded-full border border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCdoUtE9ePryM7VGjuqwTLmgW8VwPbmdkqlbAqYQWRw7blFzVfFSCnvfhjfwWRqc0dRY6YxeZ9WG8xSbcUD8dM0g2plbyUWBjmqMY9Mv10Gwpsj9X8nFDfvwSrG1hlYmgoK06IflqSdk0p5BoYTunDD6hUbyHlDHMBkRKMobXgio6pNcYPLCIqczSBjurlbfgCFmQk95IMGNGs5WljqBxKbKefCs17PVG6jw4mw1EenX3BclK1EvblGmS6jm-5q4y1ClqY5ZzaCtE" />
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">CODECRAFT</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Trust Score: {trustScore ?? '—'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow gap-2 px-sm">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setInWorkspace(false); }} className={`flex items-center gap-md py-sm rounded-r-full pl-4 transition-all duration-300 w-full text-left ${activeTab === tab.id ? 'text-primary font-bold border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent scale-[0.98]' : 'text-on-surface-variant font-medium hover:text-primary hover:bg-white/5'}`}>
              <span className="material-symbols-outlined" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {tab.icon}
              </span>
              <span className="font-label-md text-label-md">{tab.id}</span>
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

      {/* TopAppBar */}
      <header className="bg-transparent full-width top-0 flex justify-between items-center w-full px-margin py-base ml-64 z-40 relative">
        <div className="flex items-center gap-md">
          <h2 className="font-headline-md text-headline-md text-primary glow-sm tracking-tight font-bold">
            {inWorkspace ? 'Code Workspace' : activeTab}
          </h2>
          {inWorkspace && (
            <button onClick={() => setInWorkspace(false)} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to {activeTab}
            </button>
          )}
        </div>
        <div className="flex items-center gap-lg">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-surface-container/50 border border-white/10 rounded-full pl-10 pr-4 py-1.5 font-label-sm text-label-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder-on-surface-variant/50" placeholder="Search commands, logs, tickets..." type="text"/>
          </div>
          <div className="flex items-center gap-md text-on-surface-variant">
            <div className="relative">
              <button 
                onClick={() => setShowAlert(false)}
                className="hover:text-primary transition-colors relative hover:-translate-y-[1px] transition-transform"
              >
                <span className="material-symbols-outlined">
                  {activeIncidents.length > 0 ? 'notifications_active' : 'notifications'}
                </span>
                {activeIncidents.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error flex items-center justify-center text-[9px] font-bold text-white animate-pulse">
                    {activeIncidents.length}
                  </span>
                )}
              </button>
              {/* Incident dropdown */}
              {activeIncidents.length > 0 && showAlert && (
                <div className="absolute top-full right-0 mt-2 w-80 glass-panel rounded-xl border border-rose-500/20 shadow-2xl overflow-hidden z-50">
                  <div className="px-3 py-2 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
                    <span className="font-label-xs text-label-xs text-rose-400 font-medium">Active Incidents</span>
                    <button onClick={() => setShowAlert(false)} className="text-outline-variant hover:text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {activeIncidents.map((inc, i) => (
                      <div key={inc.id || i} className="px-3 py-2 border-b border-white/5 last:border-0 hover:bg-rose-500/5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="font-label-xs text-label-xs text-rose-400 font-medium">{inc.service}</span>
                          <span className="font-label-xs text-label-xs text-outline-variant ml-auto">
                            {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-label-xs text-label-xs text-outline-variant mt-0.5 truncate">{inc.text?.substring(0, 80)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="hover:text-primary transition-colors hover:-translate-y-[1px] transition-transform">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="hover:text-primary transition-colors hover:-translate-y-[1px] transition-transform">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="ml-64 p-gutter pt-0 pb-xl h-[calc(100vh-4rem)] overflow-hidden flex flex-col gap-base relative z-10 w-full">
        {inWorkspace ? (
          <div className="flex-1 min-h-0">
            <CodeWorkspace />
          </div>
        ) : activeTab === "Mission Control" ? (
          <MissionControl />
        ) : activeTab === "Active Simulations" ? (
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">FinTechFast · Sprint #12</p>
                </div>
              </div>
              <button
                onClick={() => setInWorkspace(true)}
                className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                Open Workspace
              </button>
            </div>
            <div className="flex-1 min-h-0" style={{ height: 'calc(100% - 60px)' }}>
              <ActiveSimulations showAlert={showAlert} setShowAlert={setShowAlert} logs={logs} metrics={metrics} />
            </div>
          </div>
        ) : activeTab === "Code Workspace" ? (
          <div className="flex-1 min-h-0">
            <TicketBoard />
          </div>
        ) : activeTab === "Team AI" ? (
          <TeamAI />
        ) : activeTab === "Portfolio" ? (
          <div className="flex-1 min-h-0">
            <Portfolio />
          </div>
        ) : activeTab === "Skills" ? (
          <div className="flex-1 min-h-0 overflow-y-auto feed-scroll">
            <SkillGraph />
          </div>
        ) : activeTab === "Playground" ? (
          <div className="flex-1 min-h-0">
            <CodePlayground />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant font-label-md glass-panel rounded-lg ambient-glow">
            <span className="material-symbols-outlined text-[48px] text-primary/30 mb-sm">construction</span>
            <span className="tracking-widest uppercase">Module Offline</span>
            <span className="text-outline-variant font-body-sm mt-1">Please check access permissions or await future deployment.</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest/80 backdrop-blur-md border-t border-white/5 fixed bottom-0 left-64 right-0 z-40 flex justify-between items-center px-gutter py-xs">
        <div className="font-label-sm text-label-sm text-tertiary-fixed-dim">
          System Latency: {Math.max(10, metrics.cpu - 60)}ms | Active Tickets: 6 | Incidents: {activeIncidents.length} | Sprint #12
        </div>
        <div className="flex gap-md font-label-sm text-label-sm">
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Docs</a>
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">Support</a>
          <a className="text-on-surface-variant hover:text-tertiary-fixed transition-colors" href="#">API Status</a>
        </div>
      </footer>

      {/* Sim-Slack Chat */}
      <SimChat />
      
      {/* Onboarding */}
      <Onboarding />
    </div>
  );
}
