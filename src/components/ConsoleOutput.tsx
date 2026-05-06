import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Log {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  count: number;
}

interface ConsoleOutputProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ConsoleOutput({ isOpen, onToggle }: ConsoleOutputProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only trust messages from our iframe
      if (event.data && event.data.type === 'nanzz-console') {
        setLogs(prev => {
          const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            type: event.data.logType,
            content: typeof event.data.content[0] === 'string' 
              ? event.data.content.join(' ') 
              : JSON.stringify(event.data.content[0], null, 2),
            count: 1
          };
          
          // Basic collapsing of identical sequential logs
          if (prev.length > 0) {
            const lastLog = prev[prev.length - 1];
            if (lastLog.type === newLog.type && lastLog.content === newLog.content) {
              const updated = [...prev];
              updated[updated.length - 1] = { ...lastLog, count: lastLog.count + 1 };
              return updated;
            }
          }
          return [...prev, newLog];
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const clearLogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogs([]);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div 
        className="h-8 shrink-0 bg-[#252526] flex items-center px-4 text-[11px] font-bold text-[#858585] gap-4 border-b border-[#111] cursor-pointer hover:bg-[#2a2d2e] transition-colors"
        onClick={onToggle}
      >
        <div className={`h-full flex items-center border-b ${isOpen ? 'border-blue-500 text-white' : 'border-transparent text-[#858585]'}`}>
          CONSOLE ({logs.length})
        </div>
        <div className="flex items-center ml-auto gap-3">
          <button 
            onClick={clearLogs}
            className="text-[#858585] hover:text-white transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            className="text-[#858585] hover:text-white transition-colors"
            title="Toggle Console"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="flex-1 overflow-y-auto font-mono text-[13px] bg-[#1e1e1e]">
          {logs.length === 0 ? (
            <div className="text-[#858585] p-4 italic text-xs">No output...</div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className={`px-4 py-1 border-b border-[#333] flex gap-2 ${
                  log.type === 'error' ? 'text-red-400 bg-red-950/20' :
                  log.type === 'warn' ? 'text-yellow-400 bg-yellow-950/20' :
                  log.type === 'info' ? 'text-blue-400 bg-blue-950/20' :
                  'text-[#cccccc]'
                }`}
              >
                <span className="opacity-50 select-none">›</span>
                <span className="whitespace-pre-wrap break-all">{log.content}</span>
                {log.count > 1 && (
                  <span className="ml-auto bg-[#3e3e3e] text-[#cccccc] text-[10px] px-1.5 py-0.5 rounded-full h-fit flex items-center justify-center">
                    {log.count}
                  </span>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
