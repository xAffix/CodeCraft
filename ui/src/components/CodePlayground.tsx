'use client';

import React, { useState } from 'react';
import { api } from '@/lib/supabase';

const PRESETS = [
  { name: 'JS: Hello World', language: 'javascript', code: `console.log("Hello, CodeCraft Engineer! 👋");\nconsole.log("Environment ready:", typeof process !== 'undefined');` },
  { name: 'JS: Fibonacci', language: 'javascript', code: `function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\nfor (let i = 0; i < 10; i++) {\n  console.log(\`fib(\${i}) = \${fib(i)}\`);\n}` },
  { name: 'Python: Hello', language: 'python', code: `print("Hello from Python! 🐍")\nprint(f"2 + 2 = {2 + 2}")` },
  { name: 'Python: List', language: 'python', code: `items = ["reverse shell", "buffer overflow", "sql injection"]\nfor i, item in enumerate(items, 1):\n    print(f"{i}. {item.upper()}")\nprint(f"\\nTotal: {len(items)} techniques")` },
  { name: 'Shell: Info', language: 'shell', code: `echo "System: $(uname -a)"\necho "Host: $(hostname)"\necho "Uptime: $(uptime -p)"` },
];

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  language: string;
}

export default function CodePlayground() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [code, setCode] = useState(PRESETS[0].code);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handlePresetChange = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setResult(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setResult({ stdout: '⏳ Running...', stderr: '', exitCode: 0, executionTime: 0, language: selectedPreset.language });
    
    try {
      const data = await api('/execute', {
        method: 'POST',
        body: JSON.stringify({ code, language: selectedPreset.language }),
      });
      if (data?.result) setResult(data.result);
    } catch (err: any) {
      setResult({ stdout: '', stderr: `Error: ${err.message}`, exitCode: 1, executionTime: 0, language: selectedPreset.language });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-sm text-headline-sm text-primary tracking-tight">Code Playground</h3>
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
            isRunning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-not-allowed'
                     : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">{isRunning ? 'sync' : 'play_arrow'}</span>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetChange(preset)}
            className={`font-label-xs text-label-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              selectedPreset.name === preset.name
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface-dim/50 text-on-surface-variant border border-white/5 hover:border-white/20'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Code Input */}
      <div className="flex-1 min-h-0 mb-3">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-[#1a1a1b] text-[#c9d1d9] border border-white/10 rounded-lg p-3 resize-none focus:outline-none focus:border-primary/30 transition-colors font-mono text-sm"
          style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {result && (
        <div className="bg-[#1a1a1b] border border-white/10 rounded-lg overflow-hidden" style={{ minHeight: '120px', maxHeight: '200px' }}>
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
            <span className="font-label-xs text-label-xs text-on-surface-variant">
              Output · {result.executionTime > 0 ? `${result.executionTime}ms` : ''} · exited {result.exitCode}
            </span>
            <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full ${
              result.exitCode === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {result.exitCode === 0 ? '✓ Pass' : `✗ Fail`}
            </span>
          </div>
          <div className="p-3 overflow-y-auto" style={{ maxHeight: '140px' }}>
            {result.stdout && <pre className="text-[#c9d1d9] whitespace-pre-wrap m-0 font-mono text-sm">{result.stdout}</pre>}
            {result.stderr && <pre className="text-[#f85149] whitespace-pre-wrap m-0 mt-1 font-mono text-sm">{result.stderr}</pre>}
            {!result.stdout && !result.stderr && <span className="text-outline-variant/60 text-sm">(no output)</span>}
          </div>
        </div>
      )}
    </div>
  );
}
