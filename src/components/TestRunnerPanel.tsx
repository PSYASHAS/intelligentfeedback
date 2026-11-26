'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, Terminal, Binary, Cpu } from 'lucide-react';

export interface WasmReportProp {
  compileTimeMs?: number;
  binarySize?: number;
  watText?: string;
  memoryHex?: string;
  terminalOutput?: string;
  warnings?: Array<{ line: number; col: number; code: string; message: string }>;
}

interface TestRunnerPanelProps {
  testResults: Array<{
    id: string;
    name: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }>;
  summary: {
    passed: number;
    failed: number;
    total: number;
  } | null;
  isExecuting: boolean;
  wasmReport?: WasmReportProp | null;
  executionEngine?: string;
}

export function TestRunnerPanel({
  testResults,
  summary,
  isExecuting,
  wasmReport,
  executionEngine,
}: TestRunnerPanelProps) {
  const [activeTab, setActiveTab] = useState<'invariants' | 'terminal' | 'wat' | 'memory'>('invariants');

  if (isExecuting) {
    return (
      <div className="p-6 text-center text-slate-400 text-xs">
        <div className="h-6 w-6 border-2 border-[#65c994] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="font-mono text-[#8ae0b3]">Compiling C code to WebAssembly bytecode...</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs space-y-1">
        <Play className="h-6 w-6 text-slate-700 mx-auto mb-1" />
        <p className="text-slate-300 font-medium">Ready to Compile & Execute</p>
        <p className="text-slate-500">Click <strong className="text-[#8ae0b3]">Compile & Run (WASM)</strong> in the editor bar above.</p>
      </div>
    );
  }

  const warningCount = wasmReport?.warnings?.length || 0;

  return (
    <div className="space-y-3 p-3 text-xs">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-[#101113] p-1.5 rounded-xl border border-[#303236]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('invariants')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeTab === 'invariants'
                ? 'bg-[#65c994] text-[#132319] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unit Invariants ({summary.passed}/{summary.total})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'terminal'
                ? 'bg-[#65c994] text-[#132319] shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Clang Terminal</span>
            {warningCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {warningCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'wat'
                ? 'bg-[#65c994] text-[#132319] shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>WebAssembly (WAT)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'memory'
                ? 'bg-[#65c994] text-[#132319] shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RAM Inspector</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8ae0b3]">
          <span className="w-2 h-2 rounded-full bg-[#65c994] animate-pulse" />
          <span>
            {wasmReport?.binarySize
              ? `WASM 1.0 (${wasmReport.binarySize}B in ${wasmReport.compileTimeMs}ms)`
              : executionEngine === 'wasm'
              ? 'WASM JIT Engine'
              : 'Test Engine'}
          </span>
        </div>
      </div>

      {/* Tab 1: Unit Invariants */}
      {activeTab === 'invariants' && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {testResults.map((t) => (
            <div
              key={t.id}
              className={`p-2.5 rounded-lg border text-xs font-mono transition ${
                t.passed
                  ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-200'
                  : 'bg-rose-950/10 border-rose-500/20 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-sans">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  {t.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                  )}
                  {t.name}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    t.passed ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 font-sans">Input: </span>
                  <code className="text-slate-200">{t.input}</code>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">Expected: </span>
                  <span className="text-emerald-400 font-semibold">{t.expected}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">Actual: </span>
                  <span className={t.passed ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {t.actual}
                  </span>
                </div>
                {t.error && (
                  <div className="text-rose-400 font-semibold mt-1">
                    <span className="text-slate-500 font-sans">Error: </span>
                    {t.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Clang Terminal */}
      {activeTab === 'terminal' && (
        <div className="rounded-xl bg-[#0d0e10] border border-[#26282b] p-3 font-mono text-xs text-[#a0e4be] leading-relaxed max-h-60 overflow-y-auto whitespace-pre selection:bg-emerald-500/30">
          {wasmReport?.terminalOutput || `$ clang -Wall -Wextra -std=c99 -pedantic solution.c -o solution.wasm\nTarget: wasm32-unknown-wasi (Linear Memory 64KB)\nCompilation clean.`}
        </div>
      )}

      {/* Tab 3: WebAssembly (WAT) */}
      {activeTab === 'wat' && (
        <div className="rounded-xl bg-[#0d0e10] border border-[#26282b] p-3 font-mono text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre selection:bg-emerald-500/30">
          {wasmReport?.watText || ';; Disassembled WASM 1.0 bytecode is generated upon compilation.'}
        </div>
      )}

      {/* Tab 4: RAM / Memory Inspector */}
      {activeTab === 'memory' && (
        <div className="rounded-xl bg-[#0d0e10] border border-[#26282b] p-3 font-mono text-xs text-[#80d9ac] leading-relaxed max-h-60 overflow-y-auto whitespace-pre selection:bg-emerald-500/30">
          {wasmReport?.memoryHex || ';; WebAssembly Linear Memory (Page 0: 64KB)\n;; Offset 0x1000 holds array/string buffers.'}
        </div>
      )}
    </div>
  );
}
