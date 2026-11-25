'use client';

import React from 'react';
import { Brain, BookOpen, ChevronDown } from 'lucide-react';
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
    <header className="border-b border-white/[.07] bg-[#151618]/90 backdrop-blur-xl sticky top-0 z-40 px-5 py-3.5">
      <div className="max-w-[1740px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-[15px] tracking-tight text-[#f3f3ef]">AI Resilient Assessment and Intelligent Feedback System<span className="text-[#7cdda6]">.</span></span>
            </div>
            <p className="text-[11px] text-[#929691]">Grounded in Bloom's Taxonomy & AI-Resilient Assessment Design</p>
          </div>
        </div>

        {/* Challenge Selector */}
        <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#202123] border border-white/[.08] text-[#9ea39e]">
          <BookOpen className="h-4 w-4 text-[#7cd9a7]" />
          <span className="hidden md:block text-[10px] font-semibold uppercase tracking-wider">Lab Question</span>
          <select 
            value={currentChallengeId} 
            onChange={(e) => onSelectChallenge(e.target.value)} 
            className="max-w-[320px] bg-transparent text-[#e5e7e3] text-xs font-medium outline-none cursor-pointer"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1b1c1e] text-slate-100">
                {c.title}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5" />
        </label>

        {/* Live Integrity & Socratic Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#202123] border border-white/[.08] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#72daa4] opacity-50 animate-ping"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72daa4]"/>
            </span>
            <Brain className="h-3.5 w-3.5 text-[#9baba0]" />
            <span className="text-[#b3b7b2]">Integrity</span>
            <span
              className={`font-semibold ${
                authenticityScore >= 80
                  ? 'text-[#82dfad]'
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
