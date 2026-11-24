'use client';

import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';
import { ProgrammingLanguage } from '@/lib/types';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: ProgrammingLanguage;
  onLanguageChange: (lang: ProgrammingLanguage) => void;
  onExecute: () => void;
  onDefend: () => void;
  onReset: () => void;
  isExecuting: boolean;
  onKeystroke: (key: string) => void;
  onPaste: (text: string) => void;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onExecute,
  onDefend,
  onReset,
  isExecuting,
  onKeystroke,
  onPaste,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  const lines = code.split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeystroke(e.key);

    // Support Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    onPaste(pastedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Workspace Editor</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as ProgrammingLanguage)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none"
          >
            <option value="c">C (C99 / C11)</option>
            <option value="javascript">JavaScript (ES6)</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python 3</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition"
            title="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition"
            title="Reset starter template"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition shadow-sm"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Run Tests'}</span>
          </button>
          <button
            onClick={onDefend}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Submit & Socratic Defend</span>
          </button>
        </div>
      </div>

      {/* Editor Body with line numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs">
        {/* Line Numbers */}
        <div className="select-none py-3 px-2 bg-slate-950/60 text-slate-600 text-right w-10 border-r border-slate-800/60 font-mono text-[11px] leading-5">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-200 resize-none focus:outline-none font-mono text-[11.5px] leading-5 selection:bg-indigo-500/30 whitespace-pre overflow-auto"
          placeholder="Type or refactor code here..."
        />
      </div>
    </div>
  );
}
