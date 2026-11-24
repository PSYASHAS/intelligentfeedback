'use client';

import React from 'react';
import { AssessmentChallenge } from '@/lib/types';
import { AlertTriangle, Brain, Gauge, Scale, Sparkles } from 'lucide-react';

interface ProblemStatementProps {
  challenge: AssessmentChallenge;
}

export function ProblemStatement({ challenge }: ProblemStatementProps) {
  const getBloomBadge = (level: string) => {
    switch (level) {
      case 'remember':
        return { label: 'Bloom: Remember', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'understand':
        return { label: 'Bloom: Understand', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'apply':
        return { label: 'Bloom: Apply', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'analyse':
        return { label: 'Bloom: Analyse', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'evaluate':
        return { label: 'Bloom: Evaluate', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      default:
        return { label: 'Bloom: Create', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    }
  };

  const bloom = getBloomBadge(challenge.bloomLevel);

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1 text-slate-300 space-y-4">
      {/* Title & Category Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bloom.color}`}>
            <Brain className="h-3.5 w-3.5" />
            {bloom.label}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {challenge.difficulty}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-medium">
            Topic: {challenge.targetTopic}
          </span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">{challenge.title}</h1>
      </div>

      {/* Description */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs leading-relaxed space-y-3">
        <div className="whitespace-pre-line text-slate-200 font-sans leading-relaxed">{challenge.description}</div>
      </div>

      {/* Beginner Mistake Spotlight Card */}
      <div className="bg-gradient-to-r from-rose-950/30 to-slate-900 border border-rose-500/30 rounded-xl p-3.5 text-xs">
        <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1.5">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <span>Beginner Mistake Spotlight</span>
        </div>
        <p className="text-slate-300 leading-relaxed">{challenge.flawExplanation.identifiedMistake}</p>
        <p className="text-rose-300 font-medium mt-1.5 text-[11px]">
          <strong>Root Misconception:</strong> {challenge.flawExplanation.rootCause}
        </p>
      </div>

      {/* AI-Solvability Indicator (Akbar 2025 Paper Table 1) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
            <Gauge className="h-4 w-4 text-cyan-400" />
            Estimated AI-Solvability:
          </span>
          <span className="font-bold text-cyan-400">{challenge.aiSolvability.score}% — {challenge.aiSolvability.category}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${challenge.aiSolvability.score}%` }}></div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{challenge.aiSolvability.suggestedImprovement}</p>
      </div>

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
    </div>
  );
}
