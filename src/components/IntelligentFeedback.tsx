'use client';

import React, { useState } from 'react';
import { IntelligentFeedbackReport } from '@/lib/types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle, 
  Award, 
  ArrowRight,
  Brain,
  Scale
} from 'lucide-react';

interface IntelligentFeedbackProps {
  report: IntelligentFeedbackReport | null;
  isLoading: boolean;
}

export function IntelligentFeedback({ report, isLoading }: IntelligentFeedbackProps) {
  const [activeTab, setActiveTab] = useState<'formative' | 'rubric'>('formative');

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-200">Evaluating Code & Synthesizing Formative Feedback...</p>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Analyzing boundary invariants, character encodings, and synthesizing 4-part actionable feedback.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Lightbulb className="h-12 w-12 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-400">Ready to Diagnose Your Solution</p>
        <p className="text-xs max-w-sm mt-1">
          Click <span className="text-indigo-400 font-semibold">Run Tests</span> above to initiate the evaluation and receive 4-part formative guidance.
        </p>
      </div>
    );
  }

  const { formativeFeedback, overallScore, rubricBreakdown, masteryStage } = report;

  return (
    <div className="h-full flex flex-col overflow-hidden text-xs">
      {/* Score Header Banner */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{overallScore}</span>
            <span className="text-slate-500 text-[11px]">/ 100 Overall Score</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Stage: {masteryStage}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs">
        <button
          onClick={() => setActiveTab('formative')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 transition ${
            activeTab === 'formative'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          4-Part Formative Feedback
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex-1 py-2 px-3 text-center font-medium border-b-2 transition ${
            activeTab === 'rubric'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Rubric Breakdown
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {activeTab === 'formative' && (
          <div className="space-y-3">
            {/* 1. What did I do well? */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                1. What Did I Do Well?
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{formativeFeedback.wellDone}</p>
            </div>

            {/* 2. What is the problem? */}
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <span className="text-[11px] uppercase font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                2. What Is the Problem?
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{formativeFeedback.problem}</p>
            </div>

            {/* 3. Why did it happen? */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
              <span className="text-[11px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                3. Why Did It Happen? (Root Misconception)
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{formativeFeedback.why}</p>
            </div>

            {/* 4. How can I improve? & Next Action */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/40 space-y-2">
              <span className="text-[11px] uppercase font-bold text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                4. How Can I Improve?
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{formativeFeedback.improvement}</p>
              <div className="pt-2 border-t border-indigo-500/20 flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                <ArrowRight className="h-3.5 w-3.5" />
                <span>Next Action: {formativeFeedback.nextStep}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rubric' && (
          <div className="space-y-2.5">
            {rubricBreakdown.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs">{item.criterion}</span>
                  <span className="font-mono font-bold text-indigo-400 text-xs">
                    {item.score} / {item.maxScore}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
