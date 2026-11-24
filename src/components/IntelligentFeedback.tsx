'use client';

import React, { useState } from 'react';
import { 
  IntelligentFeedbackReport, 
  ScaffoldedHint 
} from '@/lib/types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Unlock, 
  Award, 
  Cpu, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';

interface IntelligentFeedbackProps {
  report: IntelligentFeedbackReport | null;
  isLoading: boolean;
}

export function IntelligentFeedback({ report, isLoading }: IntelligentFeedbackProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'misconceptions' | 'hints' | 'rubric'>('overview');
  const [hintsState, setHintsState] = useState<ScaffoldedHint[]>([]);

  React.useEffect(() => {
    if (report?.scaffoldedHints) {
      setHintsState(report.scaffoldedHints);
    }
  }, [report]);

  const unlockNextHint = (level: number) => {
    setHintsState((prev) =>
      prev.map((h) => (h.level === level ? { ...h, revealed: true } : h))
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-200">Synthesizing Intelligent Feedback...</p>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Diagnosing conceptual misconceptions, calculating asymptotic bounds, and generating scaffolded pedagogical hints.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Lightbulb className="h-12 w-12 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-400">No Assessment Feedback Yet</p>
        <p className="text-xs max-w-sm mt-1">
          Click <span className="text-indigo-400 font-semibold">Run Tests</span> or <span className="text-emerald-400 font-semibold">Submit & Socratic Defend</span> to initiate the multi-tiered evaluation pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden text-xs">
      {/* Score Header Banner */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{report.overallScore}</span>
            <span className="text-slate-500 text-[11px]">/ 100 Overall Score</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-md">{report.executiveSummary}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Complexity Badges */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Asymptotic Profile</span>
            <span className="text-[11px] text-cyan-300 font-mono font-semibold">{report.timeComplexityIdentified}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Overview & Strengths
        </button>
        <button
          onClick={() => setActiveTab('misconceptions')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'misconceptions'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <span>Misconceptions</span>
          {report.misconceptions.length > 0 && (
            <span className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] flex items-center justify-center font-bold">
              {report.misconceptions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 transition ${
            activeTab === 'hints'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Socratic Hints
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 transition ${
            activeTab === 'rubric'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Rubric Details
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-1.5">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI-Resilience & Authenticity Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>AI Resilience & Authenticity Audit</span>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {report.authenticityConfidence}% Confidence
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {report.aiResilienceAudit.defenseRecommendation}
              </p>
              {report.aiResilienceAudit.authenticityFlags.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-300">Telemetry Observations:</span>
                  <ul className="space-y-1">
                    {report.aiResilienceAudit.authenticityFlags.map((flag, i) => (
                      <li key={i} className="text-slate-400 text-[11px] flex items-start gap-1.5">
                        <AlertCircle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Asymptotic Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Time Complexity</span>
                <p className="text-slate-200 font-mono font-medium text-xs mt-0.5">{report.timeComplexityIdentified}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Space Complexity</span>
                <p className="text-slate-200 font-mono font-medium text-xs mt-0.5">{report.spaceComplexityIdentified}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'misconceptions' && (
          <div className="space-y-3">
            {report.misconceptions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">No Critical Misconceptions Detected</p>
                <p className="text-[11px] text-slate-500 mt-1">Your implementation maintained expected invariants.</p>
              </div>
            ) : (
              report.misconceptions.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-3.5 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-rose-300">
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                      <span>{m.title}</span>
                    </div>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                      {m.severity} severity
                    </span>
                  </div>

                  <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1.5">
                    <div>
                      <span className="text-slate-400 font-medium">Identified Mental Model: </span>
                      <span className="text-slate-200">{m.studentMentalModel}</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-medium">Scientific Reality: </span>
                      <span className="text-slate-300">{m.scientificExplanation}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-indigo-300 flex items-start gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-indigo-200">Remediation:</strong> {m.remediationAdvice}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-slate-300 text-[11px]">
              <span className="font-semibold text-indigo-300">Multi-Tier Socratic Scaffolding: </span>
              Hints are progressively structured so you maintain the productive struggle of learning without answers being spoiled upfront.
            </div>

            {hintsState.map((hint) => (
              <div
                key={hint.level}
                className={`border rounded-xl p-3.5 transition ${
                  hint.revealed
                    ? 'bg-slate-900/70 border-slate-700/80'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        hint.level === 1
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : hint.level === 2
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      Tier {hint.level}: {hint.type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-200">{hint.title}</span>
                  </div>

                  {hint.revealed ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => unlockNextHint(hint.level)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition shadow"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Unlock Hint</span>
                    </button>
                  )}
                </div>

                {hint.revealed ? (
                  <div className="space-y-2 mt-2">
                    <p className="text-slate-300 text-xs leading-relaxed">{hint.content}</p>
                    <div className="p-2 rounded bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-[11px]">
                      <span className="font-semibold">Reflective Question: </span>
                      {hint.reflectionQuestion}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px] italic">
                    Hint locked. Try reflecting on previous tiers before unlocking this step.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rubric' && (
          <div className="space-y-3">
            {report.rubricBreakdown.map((r, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{r.criterion}</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      r.score === r.maxScore
                        ? 'text-emerald-400'
                        : r.score > 0
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {r.score} / {r.maxScore} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{r.comment}</p>
                <div className="text-[10px] text-indigo-400 font-mono bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80">
                  <span className="text-slate-500">Citation / Evidence: </span>
                  {r.citation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
