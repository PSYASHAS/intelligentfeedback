'use client';

import React from 'react';
import { ShieldCheck, Brain, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { AssessmentChallenge } from '@/lib/types';

interface NavbarProps {
  challenges: AssessmentChallenge[];
  currentChallengeId: string;
  onSelectChallenge: (id: string) => void;
  authenticityScore: number;
}

export function Navbar({
  challenges,
  currentChallengeId,
  onSelectChallenge,
  authenticityScore,
}: NavbarProps) {
  const current = challenges.find((c) => c.id === currentChallengeId);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Mistake-to-Mastery</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Semester 1 C Programming
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Grounded in Bloom's Taxonomy & AI-Resilient Assessment Design</p>
          </div>
        </div>

        {/* Challenge Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={currentChallengeId}
            onChange={(e) => onSelectChallenge(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Live Integrity & Socratic Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <Brain className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">Integrity Confidence:</span>
            <span
              className={`font-semibold ${
                authenticityScore >= 80
                  ? 'text-emerald-400'
                  : authenticityScore >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {authenticityScore}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
