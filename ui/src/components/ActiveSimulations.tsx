import React from 'react';

export default function ActiveSimulations({
  showAlert,
  setShowAlert,
  logs,
  metrics
}: {
  showAlert: boolean,
  setShowAlert: (v: boolean) => void,
  logs: any[],
  metrics: any
}) {
  return (
    <>
      {/*  Top Row Grid  */}
      <div className="grid grid-cols-12 gap-base h-[60%] min-h-0">
        {/*  Col 1: Sim-Slack Sidebar  */}
        <div className="col-span-2 glass-panel rounded-lg flex flex-col overflow-hidden">
          <div className="p-sm border-b border-white/5 flex items-center justify-between">
            <h3 className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">Sim-Comms</h3>
            <span className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer hover:text-primary">add</span>
          </div>
          <div className="p-sm flex-grow overflow-y-auto flex flex-col gap-1">
            <div className="px-sm py-1 rounded bg-error/10 text-error font-label-sm text-label-sm flex items-center gap-2 cursor-pointer border border-error/20 pulse-error">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              # incidents-sev1
            </div>
            <div className="px-sm py-1 rounded hover:bg-white/5 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[14px]">tag</span>
              # engineering
            </div>
            <div className="px-sm py-1 rounded hover:bg-white/5 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[14px]">tag</span>
              # deploys
            </div>
            <div className="px-sm py-1 rounded hover:bg-white/5 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              # core-infrastructure
            </div>
          </div>
        </div>
        
        {/*  Col 2: IDE Center  */}
        <div className="col-span-7 glass-panel rounded-lg flex flex-col overflow-hidden ambient-glow-primary relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="flex items-center bg-[#0a0a0b] border-b border-white/5 font-label-sm text-label-sm overflow-x-auto">
            <div className="px-md py-sm border-r border-white/5 border-b-2 border-primary text-primary bg-white/5 flex items-center gap-2 min-w-max cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">code</span>
              authentication.ts
            </div>
            <div className="px-md py-sm border-r border-white/5 text-on-surface-variant hover:bg-white/5 cursor-pointer flex items-center gap-2 min-w-max transition-colors">
              <span className="material-symbols-outlined text-[16px] text-error">warning</span>
              database_pool.rs
            </div>
            <div className="px-md py-sm text-on-surface-variant hover:bg-white/5 cursor-pointer flex items-center gap-2 min-w-max transition-colors">
              <span className="material-symbols-outlined text-[16px]">description</span>
              simulation_config.yml
            </div>
          </div>
          <div className="flex-grow bg-[#050505] p-md overflow-y-auto font-label-md text-label-md leading-relaxed">
            <div className="flex">
              <div className="text-outline-variant pr-md select-none text-right flex flex-col font-label-sm">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span className="text-error font-bold">6</span><span>7</span><span>8</span><span>9</span>
              </div>
              <div className="text-on-surface whitespace-pre font-label-sm">
                <span className="text-secondary">import</span> {"{"} NextFunction, Request, Response {"}"} <span className="text-secondary">from</span> <span className="text-tertiary">'express'</span>;{"\n"}
                <span className="text-secondary">import</span> {"{"} JwtService {"}"} <span className="text-secondary">from</span> <span className="text-tertiary">'@core/security'</span>;{"\n\n"}
                <span className="text-primary-fixed">export const</span> <span className="text-tertiary-fixed-dim">verifySimulationToken</span> = <span className="text-secondary">async</span> (req: Request, res: Response, next: NextFunction) =&gt; {"{\n"}
                {"    "}<span className="text-secondary">try</span> {"{\n"}
                <div className="bg-error/10 -ml-4 pl-4 border-l-2 border-error w-full relative group">
                  {"        "}<span className="text-primary-fixed">const</span> token = req.headers.authorization?.split(<span className="text-tertiary">' '</span>)[<span className="text-tertiary-fixed-dim">1</span>];{"\n"}
                  {"        "}<span className="text-surface-variant line-through">{/* let legacyMode = true; // FIXME: Deprecated */}</span>{"\n"}
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-error text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">MERGE CONFLICT DETECTED</span>
                </div>
                {"        "}<span className="text-secondary">if</span> (!token) <span className="text-secondary">throw new</span> <span className="text-tertiary-fixed-dim">Error</span>(<span className="text-tertiary">'No token provided'</span>);{"\n\n"}
                {"        "}<span className="text-primary-fixed">const</span> decoded = <span className="text-secondary">await</span> JwtService.verify(token);{"\n"}
                {"        "}req.user = decoded;{"\n"}
                {"    "}{"}"}
              </div>
            </div>
          </div>
        </div>
        
        {/*  Col 3: AI Review / Ticket Panel  */}
        <div className="col-span-3 flex flex-col gap-base h-full overflow-hidden">
          {showAlert && (
            <div className="glass-panel rounded-lg p-sm border border-error/30 ambient-glow-error flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-error font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                  PagerDuty Alert
                </div>
                <span className="text-error/70 font-label-sm text-[10px]">Just now</span>
              </div>
              <p className="font-body-md text-body-md text-on-error-container leading-tight">High Latency in Simulation Core (Region: us-east-1)</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowAlert(false)} className="flex-1 bg-error text-on-error py-1 rounded font-label-sm text-label-sm font-bold hover:bg-error/90 transition-colors">Acknowledge</button>
                <button onClick={() => setShowAlert(false)} className="flex-1 bg-transparent border border-error/50 text-error py-1 rounded font-label-sm text-label-sm hover:bg-error/10 transition-colors">Resolve</button>
              </div>
            </div>
          )}
          
          <div className="glass-panel rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="p-sm border-b border-white/5 flex items-center justify-between bg-surface-container-low/50">
              <h3 className="font-label-sm text-label-sm text-on-surface font-bold">AI Review Feed</h3>
              <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
            </div>
            <div className="p-sm overflow-y-auto flex flex-col gap-3">
              <div className="bg-[#131313] p-sm rounded border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-tertiary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> CodeCraft-AI</span>
                  <span className="font-label-sm text-[10px] text-outline">2m ago</span>
                </div>
                <p className="font-body-md text-[13px] text-on-surface-variant">Suggested optimization in `database_pool.rs`. Connection scaling curve is sub-optimal for current simulated load.</p>
                <button className="mt-2 text-primary font-label-sm text-[11px] hover:underline flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">visibility</span> View Diff</button>
              </div>
              <div className="bg-[#131313] p-sm rounded border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-secondary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">confirmation_number</span> SIM-4092</span>
                  <span className="bg-primary/20 text-primary px-1.5 rounded-sm font-label-sm text-[9px]">IN PROGRESS</span>
                </div>
                <p className="font-body-md text-[13px] text-on-surface-variant">Implement temporal distortion dampeners in Auth flow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/*  Bottom Row: Terminal & Observability  */}
      <div className="flex-grow grid grid-cols-12 gap-base min-h-0 mt-base">
        <div className="col-span-8 glass-panel rounded-lg flex flex-col overflow-hidden">
          <div className="bg-[#0a0a0b] p-xs px-sm border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-4">
              <span className="font-label-sm text-label-sm text-primary border-b border-primary pb-1">Deploy Logs</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface cursor-pointer pb-1 transition-colors">Sim-Engine</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
            </div>
          </div>
          <div className="flex-grow bg-[#050505] p-sm overflow-y-auto font-label-sm text-label-sm text-outline font-mono flex flex-col gap-1 relative">
            {logs.map((log, index) => (
              <div key={index} className={log.type === "WARN" ? "text-error/80" : ""}>
                <span className={log.type === "WARN" ? "text-error font-bold" : "text-tertiary"}>[{log.time}] {log.type}:</span> {log.text}
              </div>
            ))}
            <div className="animate-pulse text-on-surface mt-1">_</div>
          </div>
        </div>
        
        <div className="col-span-4 glass-panel rounded-lg p-sm flex flex-col gap-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-label-sm text-label-sm text-on-surface font-bold uppercase">System Telemetry</h3>
            <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim">query_stats</span>
          </div>
          <div className="flex-grow flex flex-col justify-around">
            <div>
              <div className="flex justify-between font-label-sm text-[11px] mb-1">
                <span className="text-on-surface-variant">CPU Load (Cluster Alpha)</span>
                <span className={`${metrics.cpu > 85 ? 'text-error font-bold' : 'text-primary'}`}>{metrics.cpu}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div className={`h-full ${metrics.cpu > 85 ? 'bg-error shadow-[0_0_10px_rgba(255,180,171,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(0,218,243,0.5)]'} transition-all duration-300 rounded-full`} style={{ width: `${metrics.cpu}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-label-sm text-[11px] mb-1">
                <span className="text-on-surface-variant">Memory Allocation</span>
                <span className="text-primary">{metrics.memory}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,218,243,0.5)]" style={{ width: `${metrics.memory}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-label-sm text-[11px] mb-1">
                <span className="text-on-surface-variant">Active Connections</span>
                <span className="text-tertiary">{metrics.connections.toLocaleString()}</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div className="h-full bg-tertiary transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(171,255,203,0.5)]" style={{ width: `${Math.min(100, (metrics.connections / 2000) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
