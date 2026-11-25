'use client';

import React, { useState } from 'react';
import { DefenseQuestion, AssessmentChallenge, ProgrammingLanguage } from '@/lib/types';
import { 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Send, 
  ArrowRight, 
  X, 
  Sparkles, 
  Award,
  AlertTriangle 
} from 'lucide-react';

interface SocraticDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: AssessmentChallenge;
  studentCode: string;
  language: ProgrammingLanguage;
  onDefenseComplete: (finalScoreBonus: number) => void;
}

export function SocraticDefenseModal({
  isOpen,
  onClose,
  challenge,
  studentCode,
  language,
  onDefenseComplete,
}: SocraticDefenseModalProps) {
  const [questions, setQuestions] = useState<DefenseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadQuestions();
    } else {
      setQuestions([]);
      setCurrentIndex(0);
      setStudentAnswer('');
      setSessionCompleted(false);
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch('/api/defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          challengeId: challenge.id,
          code: studentCode,
          language,
        }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to load defense questions', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const submitAnswer = async () => {
    if (!studentAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const currentQ = questions[currentIndex];

    try {
      const res = await fetch('/api/defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          challengeId: challenge.id,
          code: studentCode,
          language,
          question: currentQ,
          answer: studentAnswer,
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        const updatedQuestions = [...questions];
        updatedQuestions[currentIndex] = {
          ...currentQ,
          studentAnswer,
          evaluation: data.evaluation,
        };
        setQuestions(updatedQuestions);
      }
    } catch (err) {
      console.error('Answer evaluation failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setStudentAnswer('');
    } else {
      // Completed all questions
      setSessionCompleted(true);
      const passedCount = questions.filter((q) => q.evaluation?.verifiedMastery).length;
      onDefenseComplete(passedCount * 10);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const isCurrentEvaluated = Boolean(currentQ?.evaluation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <span>AI Socratic Viva Voce Defense</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 uppercase font-semibold">
                  Oral Verification
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Verifying genuine conceptual mastery & design rationale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoadingQuestions ? (
            <div className="py-16 text-center text-slate-400">
              <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-200">Synthesizing Socratic Defense Questions...</p>
              <p className="text-[11px] text-slate-500 mt-1">Analyzing your specific implementation choices.</p>
            </div>
          ) : sessionCompleted ? (
            /* Defense Session Completed Summary */
            <div className="text-center py-6 space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Defense Session Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You answered all {questions.length} Socratic verification inquiries.
                </p>
              </div>

              <div className="space-y-2 text-left bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
                {questions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-1.5 border-b border-slate-800/60 last:border-0">
                    {q.evaluation?.verifiedMastery ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-200">Question {idx + 1}: </span>
                      <span className="text-slate-400">{q.prompt}</span>
                      <p className="text-[11px] text-indigo-300 mt-0.5">
                        Verdict: {q.evaluation?.analysis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg"
              >
                Return to Workspace
              </button>
            </div>
          ) : currentQ ? (
            /* Active Question State */
            <div className="space-y-4">
              {/* Progress Steps */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  Insight: {currentQ.targetedInsight.replace('_', ' ')}
                </span>
              </div>

              {/* Question Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans shadow-inner">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="font-medium text-slate-100">{currentQ.prompt}</p>
                </div>
              </div>

              {/* Student Answer Box */}
              {!isCurrentEvaluated ? (
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-medium block">
                    Your Architectural Justification:
                  </label>
                  <textarea
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Articulate your engineering reasoning, data structure tradeoffs, and invariant guarantees..."
                    className="w-full h-28 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-600 font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={submitAnswer}
                      disabled={!studentAnswer.trim() || isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-md"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? 'Evaluating Reason...' : 'Submit Defense'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Evaluated Answer Display */
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500 block mb-1">Your Submission:</span>
                    <p className="text-slate-300">{currentQ.studentAnswer}</p>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      currentQ.evaluation?.verifiedMastery
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5">
                        {currentQ.evaluation?.verifiedMastery ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        )}
                        <span>
                          {currentQ.evaluation?.verifiedMastery
                            ? 'Verified Conceptual Mastery'
                            : 'Partial / Needs Clarification'}
                        </span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {currentQ.evaluation?.confidenceScore}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{currentQ.evaluation?.analysis}</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md"
                    >
                      <span>
                        {currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Defense'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
