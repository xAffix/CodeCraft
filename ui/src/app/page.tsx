'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessTerminal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [developerId, setDeveloperId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulated Telemetry feed
    const messages = [
      "Node 0x4A connected.",
      "Syncing atmospheric models...",
      "Latency: 14ms (us-east)",
      "Checking integrity hashes...",
      "All systems nominal.",
      "Awaiting access token..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const next = [...prev, messages[i % messages.length]];
        if (next.length > 5) next.shift();
        return next;
      });
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const simulateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    setTimeout(() => {
      if (developerId.includes("@") && accessToken.length >= 4) {
        document.cookie = "codecraft_auth_token=valid_session; path=/; max-age=86400";
        router.push('/active_simulation');
      } else {
        setError("Invalid Developer ID or Access Token sequence.");
        setIsLoading(false);
      }
    }, 1500);
  };
  return (
    <div className="flex w-full min-h-screen">{/*  Left Panel: Immersive Atmosphere (Hidden on Mobile)  */}
<div className="hidden lg:flex w-1/2 relative flex-col justify-between p-xl border-r border-white/[0.03] z-0">
{/*  Animated Background Grid & Orbs  */}
<div className="absolute inset-0 bg-grid-pattern opacity-50 z-[-1]" id="interactive-grid"></div>
<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen z-[-1] animate-pulse-glow"></div>
<div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] mix-blend-screen z-[-1]"></div>
{/*  Floating Abstract 'Logos' / Nodes  */}
<div className="absolute top-1/3 right-1/4 w-12 h-12 glass-panel rounded-xl flex items-center justify-center animate-float-slow transform rotate-12">
<span className="material-symbols-outlined text-primary text-opacity-70">data_object</span>
</div>
<div className="absolute bottom-1/3 left-1/4 w-16 h-16 glass-panel rounded-full flex items-center justify-center animate-float-medium transform -rotate-12">
<span className="material-symbols-outlined text-secondary text-opacity-70">memory</span>
</div>
<div className="absolute top-2/3 right-1/3 w-10 h-10 glass-panel rounded-lg flex items-center justify-center animate-float-slow" style={{ animationDelay: "2s" }}>
<span className="material-symbols-outlined text-tertiary text-opacity-70">hub</span>
</div>
{/*  Header / Brand  */}
<div className="flex justify-between items-start z-10 w-full">
<div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tighter mb-xs text-glow">
                    CODE<span className="text-primary">CRAFT</span>
</h1>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Atmospheric Engineering</p>
</div>
{/*  Trust Score Preview  */}
<div className="glass-panel px-sm py-xs rounded-full flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
<span className="font-label-sm text-label-sm text-on-surface">Trust: <span className="text-tertiary">99.8%</span></span>
</div>
</div>
{/*  Hero Content  */}
<div className="z-10 max-w-lg mt-xl">
<h2 className="font-headline-lg text-headline-lg text-on-background mb-md">
                Welcome Back, Engineer.<br/>
<span className="text-on-surface-variant">Your sprint is waiting.</span>
</h2>
<p className="font-body-lg text-body-lg text-outline">
                Access the global nexus. Synthesize components, execute simulations, and deploy with atmospheric precision.
            </p>
</div>
{/*  Live Activity Ticker  */}
<div className="z-10 w-full mt-auto">
<div className="flex items-center gap-xs mb-sm">
<span className="material-symbols-outlined text-primary text-[16px]">sensors</span>
<span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Live Telemetry</span>
</div>
<div className="glass-panel p-md rounded-xl h-[160px] overflow-hidden relative">
{/*  Fade masks for scroll effect  */}
<div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#1a1a1b] to-transparent z-10 pointer-events-none rounded-t-xl opacity-60"></div>
<div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#1a1a1b] to-transparent z-10 pointer-events-none rounded-b-xl opacity-60"></div>
<div className="flex flex-col gap-2 font-label-sm text-label-sm text-outline-variant animate-scroll-up" id="ticker-feed">
{telemetry.map((msg, index) => (
  <div key={index} className="flex gap-2">
    <span className="text-tertiary-fixed">[{new Date().toLocaleTimeString()}]</span>
    {msg}
  </div>
))}
</div>
</div>
</div>
</div>
{/*  Right Panel: Auth Container  */}
<div className="w-full lg:w-1/2 relative flex items-center justify-center p-md sm:p-lg z-10 bg-surface-container-lowest lg:bg-transparent">
{/*  Mobile Background Elements (visible only on md/sm)  */}
<div className="absolute inset-0 bg-grid-pattern opacity-20 lg:hidden z-[-1]"></div>
<div className="absolute top-0 right-0 w-full h-1/2 bg-primary/5 blur-[100px] lg:hidden z-[-1]"></div>
{/*  The Auth Card  */}
<div className="glass-panel ambient-glow w-full max-w-[440px] rounded-2xl p-xl relative overflow-hidden gradient-border-top transition-transform duration-500 hover:scale-[1.01]" id="auth-card">
{/*  Verification Scan Line Effect  */}
<div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 blur-[1px] opacity-0 transition-opacity duration-300 pointer-events-none z-20" id="scanline"></div>
<div className="mb-lg text-center lg:text-left">
{/*  Mobile Logo  */}
<h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-xs lg:hidden text-glow">
                    CODE<span className="text-primary">CRAFT</span>
</h1>
<h3 className="font-headline-lg-mobile text-headline-lg-mobile lg:font-headline-md lg:text-headline-md text-on-surface">Initiate Session</h3>
<p className="font-body-md text-body-md text-outline mt-xs">Verify credentials to access the environment.</p>
</div>
<form className="flex flex-col gap-md" onSubmit={simulateLogin}>
{error && (
  <div className="bg-error/10 border border-error/20 text-error font-label-sm px-sm py-xs rounded flex items-center gap-2">
    <span className="material-symbols-outlined text-[16px]">error</span>
    {error}
  </div>
)}
{/*  Input Group: Identifier  */}
<div className="flex flex-col gap-xs relative">
<label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">terminal</span>
                        Developer ID
                    </label>
<div className="relative input-focus-ring rounded-lg border border-outline/20 bg-surface-dim transition-colors overflow-hidden">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[18px]">account_circle</span>
</div>
<input value={developerId} onChange={(e) => setDeveloperId(e.target.value)} autoComplete="username" className="w-full bg-transparent border-none text-on-surface font-body-md py-sm pl-[40px] pr-sm focus:ring-0 placeholder:text-outline/50" placeholder="sysadmin@codecraft.dev" required type="text"/>
</div>
</div>
{/*  Input Group: Passkey  */}
<div className="flex flex-col gap-xs relative">
<div className="flex justify-between items-center">
<label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">key</span>
                            Access Token
                        </label>
<a className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors" href="#">Reset Hash?</a>
</div>
<div className="relative input-focus-ring rounded-lg border border-outline/20 bg-surface-dim transition-colors overflow-hidden">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[18px]">password</span>
</div>
<input value={accessToken} onChange={(e) => setAccessToken(e.target.value)} autoComplete="current-password" className="w-full bg-transparent border-none text-on-surface font-body-md py-sm pl-[40px] pr-[40px] focus:ring-0 placeholder:text-outline/50 tracking-widest" placeholder="••••••••••••" required type={showPassword ? "text" : "password"}/>
<button className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
<span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility" : "visibility_off"}</span>
</button>
</div>
</div>
{/*  Action Area  */}
<div className="mt-xs">
<button disabled={isLoading} className="w-full bg-primary/10 border border-primary/30 text-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-300 flex justify-center items-center gap-xs relative overflow-hidden group" id="login-btn" type="submit">
{/*  Button background glow effect  */}
<div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
<span className={`relative z-10 flex items-center gap-xs transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`} id="btn-text">
                            Authenticate
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</span>
{/*  Loading State  */}
<span className={`absolute inset-0 flex items-center justify-center transition-opacity ${isLoading ? 'opacity-100' : 'opacity-0'} z-10`} id="btn-loader">
<span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
</span>
</button>
</div>
</form>
{/*  Divider  */}
<div className="flex items-center gap-sm my-lg opacity-50">
<div className="h-px bg-outline flex-1"></div>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Or bypass via</span>
<div className="h-px bg-outline flex-1"></div>
</div>
{/*  Alternative Auth  */}
<button className="w-full bg-surface-dim border border-outline/20 text-on-surface font-label-md text-label-md py-sm rounded-lg hover:border-outline/50 hover:bg-surface-bright transition-all flex justify-center items-center gap-sm" type="button">
<span className="material-symbols-outlined text-[20px]">api</span>
                Connect with Provider
            </button>
<div className="mt-lg text-center">
<p className="font-label-sm text-label-sm text-outline-variant">
                    System Protocol v4.2.1 • <a className="text-primary hover:underline" href="#">Privacy Matrix</a>
</p>
</div>
</div>
</div>


</div>
  );
}
