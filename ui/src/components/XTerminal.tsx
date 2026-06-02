'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { getAccessToken } from '@/lib/supabase';

interface XTerminalProps {
  simulationId?: string;
  height?: string;
}

export default function XTerminal({ simulationId, height = '200px' }: XTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [sessionId] = useState(() => `sess-${Date.now()}`);

  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    // Initialize xterm.js
    term.current = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      theme: {
        background: '#1a1a1b',
        foreground: '#c9d1d9',
        cursor: '#c3f5ff',
        selectionBackground: '#c3f5ff33',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
      allowTransparency: true,
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);

    // Initial prompt
    term.current.writeln('\x1b[36m╔══════════════════════════════════════╗\x1b[0m');
    term.current.writeln('\x1b[36m║   CodeCraft Workspace Terminal v1.0  ║\x1b[0m');
    term.current.writeln('\x1b[36m╚══════════════════════════════════════╝\x1b[0m');
    term.current.writeln('');

    // Connect to WebSocket
    connectWebSocket();

    // Handle terminal input
    term.current.onData((data) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'terminal:input',
          payload: { sessionId, data },
        }));
      } else {
        // Local echo when disconnected
        if (data === '\r') {
          term.current?.writeln('');
          term.current?.write('\x1b[32m$\x1b[0m ');
        } else if (data === '\x7f') {
          // Backspace
          term.current?.write('\b \b');
        } else {
          term.current?.write(data);
        }
      }
    });

    // Fit terminal to container
    setTimeout(() => fitAddon.current?.fit(), 100);

    // Resize handler
    const resizeHandler = () => fitAddon.current?.fit();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      wsRef.current?.close();
      term.current?.dispose();
    };
  }, []);

  const connectWebSocket = async () => {
    try {
      const token = await getAccessToken();
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'localhost:3001';
      const url = `${protocol}//${host}/ws${token ? `?token=${token}` : ''}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        term.current?.writeln('\x1b[32m✓ Connected to workspace\x1b[0m');
        term.current?.write('\x1b[32m$\x1b[0m ');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case 'terminal:output':
              if (msg.payload?.output) {
                term.current?.write(msg.payload.output);
              }
              break;
            case 'connection':
              if (msg.status === 'authenticated') {
                term.current?.writeln(`\x1b[32m✓ Authenticated as user ${msg.userId?.slice(0, 8)}...\x1b[0m`);
              }
              break;
            case 'pong':
              // heartbeat received
              break;
            default:
              // ignore other message types in terminal
              break;
          }
        } catch {
          // Not JSON, write as raw output
          term.current?.write(event.data);
        }
      };

      ws.onerror = () => {
        term.current?.writeln('\x1b[31m✗ WebSocket connection error\x1b[0m');
        term.current?.writeln('\x1b[33m⚠ Running in local-echo mode\x1b[0m');
        term.current?.write('\x1b[32m$\x1b[0m ');
      };

      ws.onclose = () => {
        setConnected(false);
        term.current?.writeln('\x1b[33m⚠ Disconnected from workspace\x1b[0m');
        term.current?.writeln('\x1b[33m  Reconnecting in 3s...\x1b[0m');
        setTimeout(connectWebSocket, 3000);
      };
    } catch (err) {
      term.current?.writeln(`\x1b[31m✗ Connection failed: ${err}\x1b[0m`);
      term.current?.write('\x1b[32m$\x1b[0m ');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161616] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">terminal</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Workspace Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span className={`font-label-xs text-label-xs ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="font-label-xs text-label-xs text-outline-variant ml-2">Session: {sessionId.slice(0, 12)}</span>
        </div>
      </div>
      <div ref={terminalRef} style={{ height }} className="w-full" />
    </div>
  );
}
