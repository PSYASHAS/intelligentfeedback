'use client';

import React from 'react';
import { CheckCircle2, XCircle, Play, AlertCircle } from 'lucide-react';

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
}

export function TestRunnerPanel({
  testResults,
  summary,
  isExecuting,
}: TestRunnerPanelProps) {
  if (isExecuting) {
    return (
      <div className="p-4 text-center text-slate-400 text-xs">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Executing test suite against invariant conditions...</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 text-center text-slate-500 text-xs">
        <Play className="h-5 w-5 text-slate-700 mx-auto mb-1" />
        <span>Click "Run Tests" in the editor bar above to execute test cases.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 text-xs">
      {/* Summary Header */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Execution Result:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded ${
              summary.failed === 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {summary.passed} / {summary.total} Passed
          </span>
        </div>
      </div>

      {/* Test Case Cards */}
      <div className="space-y-2">
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
                <span className="text-slate-500">Input: </span>
                <span>{t.input}</span>
              </div>
              <div>
                <span className="text-slate-500">Expected: </span>
                <span className="text-emerald-400">{t.expected}</span>
              </div>
              <div>
                <span className="text-slate-500">Actual: </span>
                <span className={t.passed ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                  {t.actual}
                </span>
              </div>
              {t.error && (
                <div className="text-rose-400 font-semibold mt-1">
                  <span className="text-slate-500">Error: </span>
                  {t.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
