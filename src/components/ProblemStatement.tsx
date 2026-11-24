'use client';

import React from 'react';
import { AssessmentChallenge } from '@/lib/types';
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu, Sparkles, Scale } from 'lucide-react';

interface ProblemStatementProps {
  challenge: AssessmentChallenge;
}

export function ProblemStatement({ challenge }: ProblemStatementProps) {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'inverted_ai_critique':
        return {
          label: 'Inverted AI Bug Hunt',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: ShieldAlert,
        };
      case 'algorithmic':
        return {
          label: 'Asymptotic O(1) Invariant',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: Cpu,
        };
      default:
        return {
          label: 'State Machine & Concurrency',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          icon: Scale,
        };
    }
  };

  const badge = getCategoryBadge(challenge.category);
  const Icon = badge.icon;

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1 text-slate-300 space-y-4">
      {/* Title & Category Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {badge.label}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {challenge.difficulty}
          </span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">{challenge.title}</h1>
      </div>

      {/* Description */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs leading-relaxed space-y-3">
        <div className="whitespace-pre-line text-slate-300 font-sans">{challenge.description}</div>
      </div>

      {/* AI Trap Context Alert (Why LLMs struggle with this challenge) */}
      {challenge.aiTrapContext && (
        <div className="bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 rounded-xl p-3.5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Why Typical LLMs Hallucinate Here</span>
          </div>
          <p className="text-slate-300 mb-2">{challenge.aiTrapContext.claimedFlawlessDescription}</p>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-200">Hidden Trapdoors:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              {challenge.aiTrapContext.hiddenVulnerabilities.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Rubric Criteria */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-3.5">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5 text-indigo-400" />
          Evaluation Rubric
        </h3>
        <div className="space-y-2">
          {challenge.rubricCriteria.map((c, i) => (
            <div key={i} className="flex items-start justify-between text-xs gap-3">
              <div>
                <span className="font-medium text-slate-200">{c.name}</span>
                <p className="text-[11px] text-slate-400">{c.description}</p>
              </div>
              <span className="text-[11px] font-bold text-indigo-400 whitespace-nowrap">
                {c.weight}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Cases Preview */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-3.5">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          Key Test Specifications
        </h3>
        <div className="space-y-2">
          {challenge.testCases.map((tc) => (
            <div
              key={tc.id}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
            >
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-300 mb-1">
                <span className="font-semibold text-indigo-300">{tc.name}</span>
                {tc.isSecret && (
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1 rounded border border-rose-500/20">
                    Secret Invariant Test
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                <span className="text-slate-500">In: </span>
                {tc.inputDescription}
              </div>
              <div className="text-[11px] text-emerald-400 truncate">
                <span className="text-slate-500">Exp: </span>
                {tc.expectedOutput}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
