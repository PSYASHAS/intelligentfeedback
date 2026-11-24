'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ASSESSMENT_CHALLENGES } from '@/lib/assessment-bank';
import { 
  AssessmentChallenge, 
  ProgrammingLanguage, 
  IntelligentFeedbackReport, 
  TelemetryMetric 
} from '@/lib/types';
import { TelemetryTracker } from '@/lib/telemetry';
import { Navbar } from '@/components/Navbar';
import { ProblemStatement } from '@/components/ProblemStatement';
import { CodeEditor } from '@/components/CodeEditor';
import { TestRunnerPanel } from '@/components/TestRunnerPanel';
import { IntelligentFeedback } from '@/components/IntelligentFeedback';
import { SocraticDefenseModal } from '@/components/SocraticDefenseModal';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function AssessmentStudio() {
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(ASSESSMENT_CHALLENGES[0].id);
  const currentChallenge = ASSESSMENT_CHALLENGES.find((c) => c.id === currentChallengeId)!;

  const [language, setLanguage] = useState<ProgrammingLanguage>('c');
  const [code, setCode] = useState<string>(currentChallenge.starterCode.c);

  // Execution & Feedback states
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testSummary, setTestSummary] = useState<{ passed: number; failed: number; total: number } | null>(null);
  const [showTestDrawer, setShowTestDrawer] = useState(false);

  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState<IntelligentFeedbackReport | null>(null);

  // Socratic Defense modal state
  const [isDefenseOpen, setIsDefenseOpen] = useState(false);

  // Telemetry Tracker instance
  const telemetryRef = useRef<TelemetryTracker>(new TelemetryTracker());

  // Reset code when challenge or language changes
  useEffect(() => {
    setCode(currentChallenge.starterCode[language] || currentChallenge.starterCode.c);
    setTestResults([]);
    setTestSummary(null);
    setFeedbackReport(null);
    setShowTestDrawer(false);
    telemetryRef.current = new TelemetryTracker();
  }, [currentChallengeId, language]);

  const handleKeystroke = (key: string) => {
    telemetryRef.current.recordKeystroke(key);
  };

  const handlePaste = (pastedText: string) => {
    telemetryRef.current.recordPaste(pastedText);
  };

  const handleResetCode = () => {
    setCode(currentChallenge.starterCode[language] || currentChallenge.starterCode.c);
  };

  // Run tests & request intelligent feedback
  const handleRunTests = async () => {
    setIsExecuting(true);
    setShowTestDrawer(true);

    try {
      // 1. Execute tests
      const execRes = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          challengeId: currentChallenge.id,
        }),
      });

      const execData = await execRes.json();
      setTestResults(execData.results || []);
      setTestSummary(execData.summary || null);

      // 2. Fetch Intelligent Feedback
      setIsLoadingFeedback(true);
      const telemetryMetrics = telemetryRef.current.getMetrics(code.length);

      const feedbackRes = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          challengeId: currentChallenge.id,
          testResults: execData.summary,
          telemetry: telemetryMetrics,
        }),
      });

      const feedbackData = await feedbackRes.json();
      if (feedbackData.report) {
        setFeedbackReport(feedbackData.report);
      }
    } catch (err) {
      console.error('Execution / Feedback pipeline failed', err);
    } finally {
      setIsExecuting(false);
      setIsLoadingFeedback(false);
    }
  };

  const handleLaunchDefense = () => {
    setIsDefenseOpen(true);
  };

  const handleDefenseComplete = (bonusScore: number) => {
    if (feedbackReport) {
      setFeedbackReport((prev) =>
        prev
          ? {
              ...prev,
              overallScore: Math.min(100, prev.overallScore + bonusScore),
              authenticityConfidence: Math.min(100, prev.authenticityConfidence + 15),
            }
          : prev
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar */}
      <Navbar
        challenges={ASSESSMENT_CHALLENGES}
        currentChallengeId={currentChallengeId}
        onSelectChallenge={setCurrentChallengeId}
        authenticityScore={feedbackReport?.authenticityConfidence ?? 90}
      />

      {/* Main 3-Column Studio Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 max-w-[1700px] w-full mx-auto h-[calc(100vh-60px)]">
        {/* Left Column: Problem & Invariant Specs (3 cols) */}
        <section className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 overflow-hidden flex flex-col h-full shadow-lg">
          <ProblemStatement challenge={currentChallenge} />
        </section>

        {/* Center Column: Code Editor & Execution Runner (5 cols) */}
        <section className="lg:col-span-5 flex flex-col h-full space-y-2 overflow-hidden">
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onExecute={handleRunTests}
              onDefend={handleLaunchDefense}
              onReset={handleResetCode}
              isExecuting={isExecuting}
              onKeystroke={handleKeystroke}
              onPaste={handlePaste}
            />
          </div>

          {/* Test Results Drawer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <button
              onClick={() => setShowTestDrawer(!showTestDrawer)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-950/70 border-b border-slate-800/80 text-xs text-slate-300 font-semibold hover:bg-slate-900 transition"
            >
              <span>Test Suite Execution ({testSummary ? `${testSummary.passed}/${testSummary.total}` : 'Ready'})</span>
              {showTestDrawer ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
            {showTestDrawer && (
              <div className="max-h-56 overflow-y-auto">
                <TestRunnerPanel
                  testResults={testResults}
                  summary={testSummary}
                  isExecuting={isExecuting}
                />
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Intelligent Feedback Engine (4 cols) */}
        <section className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
          <IntelligentFeedback
            report={feedbackReport}
            isLoading={isLoadingFeedback}
          />
        </section>
      </main>

      {/* Socratic Defense Modal */}
      <SocraticDefenseModal
        isOpen={isDefenseOpen}
        onClose={() => setIsDefenseOpen(false)}
        challenge={currentChallenge}
        studentCode={code}
        onDefenseComplete={handleDefenseComplete}
      />
    </div>
  );
}
