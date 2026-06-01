import React, { useState } from 'react';

export default function TeamAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Greetings, Engineer. I am CodeCraft AI, your embedded architectural assistant. How can I optimize your workflows today?" }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "I have analyzed your request. Based on current system parameters and the temporal distortion patterns in the staging environment, I recommend implementing a debounced retry mechanism with exponential backoff." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-base h-full w-full max-w-4xl mx-auto">
      <div className="glass-panel p-md rounded-lg mb-base flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary text-primary relative">
            <span className="material-symbols-outlined">smart_toy</span>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface"></div>
          </div>
          <div>
            <h2 className="font-headline-sm text-on-surface">CodeCraft Assistant</h2>
            <p className="font-label-sm text-outline-variant">Model: Architect-v4 (Online)</p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 font-label-sm">
          <span className="material-symbols-outlined text-sm">delete</span> Clear Context
        </button>
      </div>

      <div className="glass-panel rounded-lg flex-grow flex flex-col overflow-hidden min-h-0">
        <div className="flex-grow overflow-y-auto p-lg flex flex-col gap-lg">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-sm max-w-[80%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-surface-variant border-white/10 text-on-surface' : 'bg-primary/20 border-primary/50 text-primary'}`}>
                <span className="material-symbols-outlined text-[16px]">{msg.role === 'user' ? 'person' : 'smart_toy'}</span>
              </div>
              <div className={`p-md rounded-2xl ${msg.role === 'user' ? 'bg-surface-variant rounded-tr-sm' : 'bg-[#1a1a1c] border border-white/5 rounded-tl-sm'} font-body-md text-on-surface leading-relaxed shadow-lg`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-sm bg-surface-container-low border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CodeCraft AI about architecture, bugs, or system state..." 
              className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-md pl-md pr-[80px] font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
