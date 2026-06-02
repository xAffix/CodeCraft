'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import XTerminal from './XTerminal';
import { api } from '@/lib/supabase';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface FileTab {
  name: string;
  language: string;
  content: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  language: string;
}

const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'shell',
  bash: 'shell',
};

const mockFiles: FileTab[] = [
  {
    name: 'index.ts',
    language: 'typescript',
    content: `// 🚀 CodeCraft Simulation Workspace
// Ticket: Fix pagination bug on transaction history API

import { Transaction } from './types';
import { Database } from './db';

const PAGE_SIZE = 20;

export async function getTransactionHistory(
  userId: string,
  page: number = 1
): Promise<{ transactions: Transaction[]; total: number }> {
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error, count } = await Database
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;

  return {
    transactions: data || [],
    total: count || 0,
  };
}
`,
  },
  {
    name: 'types.ts',
    language: 'typescript',
    content: `export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
`,
  },
  {
    name: 'script.py',
    language: 'python',
    content: `# Python playground
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b
    print()

fibonacci(10)
`,
  },
  {
    name: 'db.ts',
    language: 'typescript',
    content: `// Database abstraction layer

export const Database = {
  from: (table: string) => ({
    select: (columns: string, opts?: { count?: 'exact' }) => ({
      eq: (field: string, value: string) => ({
        order: (field: string, dir: 'asc' | 'desc') => ({
          range: async (from: number, to: number) => {
            console.log(\`[DB] Query: \${table} \${columns} where \${field}=\${value}\`);
            return { data: [], error: null, count: 0 };
          },
        }),
      }),
    }),
  }),
};
`,
  },
];

export default function CodeWorkspace() {
  const [activeFile, setActiveFile] = useState(0);
  const [files, setFiles] = useState<FileTab[]>(mockFiles);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketPanel, setShowTicketPanel] = useState(true);
  const [workspaceStatus, setWorkspaceStatus] = useState<string>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    loadTickets();
    initWorkspace();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await api('/tickets');
      if (data?.tickets?.length > 0) {
        setTickets(data.tickets);
        setSelectedTicket(data.tickets[0]);
      }
    } catch {
      const mockTickets: Ticket[] = [
        { id: 'TICKET-42', title: 'Fix pagination bug on transaction history API', description: 'The /api/transactions endpoint returns incorrect page offsets when navigating past page 3.', status: 'in_progress', difficulty: 'medium' },
        { id: 'TICKET-43', title: 'Add rate limiting to auth endpoints', description: 'Implement token bucket rate limiting to prevent brute force attacks.', status: 'todo', difficulty: 'hard' },
        { id: 'TICKET-44', title: 'Update user profile avatar component', description: 'Replace img with Next.js Image. Add loading skeleton and error states.', status: 'in_review', difficulty: 'easy' },
      ];
      setTickets(mockTickets);
      setSelectedTicket(mockTickets[0]);
    }
  };

  const initWorkspace = async () => {
    try {
      setWorkspaceStatus('creating');
      let ws = await api('/workspace');
      if (!ws.workspace) {
        await api('/workspace', { method: 'POST', body: JSON.stringify({ simulationId: 'fintechfast' }) });
      }
      setWorkspaceStatus('ready');
    } catch {
      setWorkspaceStatus('ready');
    }
  };

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) =>
      prev.map((f, i) => (i === activeFile ? { ...f, content: value } : f))
    );
  };

  // ── Code Execution ─────────────────────────────────────

  const runCode = async () => {
    const currentFile = files[activeFile];
    const ext = currentFile.name.split('.').pop() || 'ts';
    const language = LANG_MAP[ext] || 'javascript';

    setIsRunning(true);
    setShowOutput(true);
    setExecResult({
      stdout: '⏳ Running...\n',
      stderr: '',
      exitCode: 0,
      executionTime: 0,
      language,
    });

    try {
      const data = await api('/execute', {
        method: 'POST',
        body: JSON.stringify({
          code: currentFile.content,
          language,
        }),
      });

      if (data?.result) {
        setExecResult(data.result);
      } else {
        throw new Error('No result from execution service');
      }
    } catch (err: any) {
      setExecResult({
        stdout: '',
        stderr: `Execution error: ${err.message}`,
        exitCode: 1,
        executionTime: 0,
        language,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickScript = (script: string, language: string) => {
    // Run a quick inline script without changing the active file
    setIsRunning(true);
    setShowOutput(true);
    setExecResult({
      stdout: '⏳ Running...\n',
      stderr: '',
      exitCode: 0,
      executionTime: 0,
      language,
    });

    api('/execute', {
      method: 'POST',
      body: JSON.stringify({ code: script, language }),
    })
      .then((data) => {
        if (data?.result) setExecResult(data.result);
      })
      .catch((err) => {
        setExecResult({
          stdout: '',
          stderr: `Error: ${err.message}`,
          exitCode: 1,
          executionTime: 0,
          language,
        });
      })
      .finally(() => setIsRunning(false));
  };

  const getExecLanguage = (): string => {
    const ext = files[activeFile].name.split('.').pop() || 'ts';
    return LANG_MAP[ext] || 'javascript';
  };

  const diffColors: Record<string, string> = {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="flex h-full w-full gap-0">
      {/* ── Left: Ticket Panel ─────────────────────────────── */}
      {showTicketPanel && (
        <div className="w-80 min-w-[320px] border-r border-white/10 flex flex-col bg-surface/40 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm text-primary tracking-tight">Active Ticket</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${workspaceStatus === 'ready' ? 'bg-emerald-500' : workspaceStatus === 'creating' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <button onClick={() => setShowTicketPanel(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto feed-scroll pr-1">
              {tickets.map((ticket) => (
                <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                  className={`text-left p-3 rounded-lg border transition-all ${selectedTicket?.id === ticket.id ? 'bg-primary/10 border-primary/30' : 'bg-surface-dim/50 border-white/5 hover:border-white/20'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{ticket.id}</span>
                    <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full border ${diffColors[ticket.difficulty]}`}>{ticket.difficulty}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface line-clamp-2">{ticket.title}</p>
                </button>
              ))}
            </div>
          </div>
          {selectedTicket && (
            <div className="flex-1 p-4 overflow-y-auto feed-scroll">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-xs text-label-xs ${
                  selectedTicket.status === 'todo' ? 'bg-slate-500/20 text-slate-300' :
                  selectedTicket.status === 'in_progress' ? 'bg-sky-500/20 text-sky-300' :
                  selectedTicket.status === 'in_review' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  <span className="material-symbols-outlined text-[12px]">
                    {selectedTicket.status === 'todo' ? 'radio_button_unchecked' :
                     selectedTicket.status === 'in_progress' ? 'play_circle' :
                     selectedTicket.status === 'in_review' ? 'rate_review' : 'check_circle'}
                  </span>
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-headline-xs text-headline-xs text-on-surface mb-3">{selectedTicket.title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{selectedTicket.description}</p>
              <div className="mt-4 p-3 rounded-lg bg-surface-dim/50 border border-white/5">
                <p className="font-label-sm text-label-sm text-primary mb-2">Acceptance Criteria</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-tertiary mt-0.5">check</span>
                    Pagination works correctly beyond page 3
                  </li>
                  <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-tertiary mt-0.5">check</span>
                    No duplicate records returned across pages
                  </li>
                  <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-tertiary mt-0.5">check</span>
                    Response includes correct total count
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Right: Editor + Output + Terminal ──────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* File Tabs + Run Button */}
        <div className="flex items-center bg-surface/60 border-b border-white/10 overflow-x-auto">
          {files.map((file, idx) => (
            <button key={file.name} onClick={() => setActiveFile(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 border-r border-white/5 font-label-sm text-label-sm transition-colors ${
                activeFile === idx
                  ? 'bg-surface/80 text-primary border-b-2 border-b-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}>
              <span className="material-symbols-outlined text-[14px]">description</span>
              {file.name}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 px-2">
            <span className="font-label-xs text-label-xs text-outline-variant mr-1">{getExecLanguage()}</span>
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-not-allowed'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{isRunning ? 'sync' : 'play_arrow'}</span>
              {isRunning ? 'Running...' : 'Run'}
            </button>
            {!showTicketPanel && (
              <button onClick={() => setShowTicketPanel(true)} className="px-2 py-1.5 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0">
          <MonacoEditor
            key={files[activeFile].name}
            height="100%"
            language={files[activeFile].language}
            theme="vs-dark"
            value={files[activeFile].content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              tabSize: 2,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Execution Output Panel */}
        {showOutput && execResult && (
          <div className="border-t border-white/10 bg-[#1a1a1b] flex flex-col" style={{ minHeight: '120px', maxHeight: '200px' }}>
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">output</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Output</span>
                {execResult.executionTime > 0 && (
                  <span className="font-label-xs text-label-xs text-outline-variant">
                    · {execResult.executionTime}ms · exited {execResult.exitCode}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full ${
                  execResult.exitCode === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {execResult.exitCode === 0 ? '✓ Success' : `✗ Exit ${execResult.exitCode}`}
                </span>
                <button onClick={() => setShowOutput(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 feed-scroll" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '13px' }}>
              {execResult.stdout && (
                <pre className="text-[#c9d1d9] whitespace-pre-wrap m-0">{execResult.stdout}</pre>
              )}
              {execResult.stderr && (
                <pre className="text-[#f85149] whitespace-pre-wrap m-0 mt-1">{execResult.stderr}</pre>
              )}
              {!execResult.stdout && !execResult.stderr && (
                <span className="text-outline-variant/60">(no output)</span>
              )}
            </div>
          </div>
        )}

        {/* xterm.js Terminal */}
        <XTerminal height={showOutput ? '140px' : '200px'} />
      </div>
    </div>
  );
}
