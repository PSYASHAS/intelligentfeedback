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
import { ChevronUp, ChevronDown, Code2, Sparkles } from 'lucide-react';

export default function AssessmentStudio() {
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(ASSESSMENT_CHALLENGES[0].id);
  const currentChallenge = ASSESSMENT_CHALLENGES.find((c) => c.id === currentChallengeId)!;

  const [language, setLanguage] = useState<ProgrammingLanguage>('c');
  const [codeMode, setCodeMode] = useState<'buggy' | 'correct'>('buggy');
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
    setCodeMode('buggy');
    setCode(currentChallenge.starterCode[language] || currentChallenge.starterCode.c);
    setTestResults([]);
    setTestSummary(null);
    setFeedbackReport(null);
    setShowTestDrawer(false);
    telemetryRef.current = new TelemetryTracker();
  }, [currentChallengeId, language]);

  // Subtle 3D Card Tilt on Hover
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    const handlers: Array<{ card: Element; enter: () => void; move: (e: any) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      let bounds: DOMRect | null = null;
      const el = card as HTMLElement;

      const enter = () => {
        bounds = el.getBoundingClientRect();
        el.classList.remove('tilt-reset');
      };

      const move = (e: MouseEvent) => {
        if (!bounds) bounds = el.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const halfWidth = bounds.width / 2;
        const halfHeight = bounds.height / 2;

        const rotateX = ((mouseY - halfHeight) / halfHeight) * -3.5;
        const rotateY = ((mouseX - halfWidth) / halfWidth) * 3.5;

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        el.style.boxShadow = `0 ${Math.abs(rotateX) * 2 + 12}px 32px rgba(0, 0, 0, 0.38), 0 0 20px rgba(101, 201, 148, 0.06)`;
      };

      const leave = () => {
        bounds = null;
        el.classList.add('tilt-reset');
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.boxShadow = '';
      };

      el.addEventListener('mouseenter', enter);
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      handlers.push({ card, enter, move, leave });
    });

    return () => {
      handlers.forEach(({ card, enter, move, leave }) => {
        card.removeEventListener('mouseenter', enter);
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    };
  }, [currentChallengeId]);

  const handleKeystroke = (key: string) => {
    telemetryRef.current.recordKeystroke(key);
  };

  const handlePaste = (pastedText: string) => {
    telemetryRef.current.recordPaste(pastedText);
  };

  const handleResetCode = () => {
    setCodeMode('buggy');
    setCode(currentChallenge.starterCode[language] || currentChallenge.starterCode.c);
    setTestResults([]);
    setTestSummary(null);
    setFeedbackReport(null);
    setShowTestDrawer(false);
  };

  const handleCodeModeChange = async (mode: 'buggy' | 'correct') => {
    setCodeMode(mode);
    if (mode === 'correct') {
      const correctCodeStr = currentChallenge.correctCode?.[language] || currentChallenge.starterCode[language];
      setCode(correctCodeStr);
      setTestResults([]);
      setTestSummary(null);
      setFeedbackReport(null);
      setShowTestDrawer(false);
    } else {
      setCode(currentChallenge.starterCode[language] || currentChallenge.starterCode.c);
      setTestResults([]);
      setTestSummary(null);
      setFeedbackReport(null);
      setShowTestDrawer(false);
    }
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
          language,
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
          executionResults: execData.results || [],
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
    <div className="studio-app min-h-screen flex flex-col text-slate-100">
      {/* Navbar */}
      <Navbar
        challenges={ASSESSMENT_CHALLENGES}
        currentChallengeId={currentChallengeId}
        onSelectChallenge={setCurrentChallengeId}
        authenticityScore={feedbackReport?.authenticityConfidence ?? 90}
      />

      {/* Main 3-Column Studio Layout */}
      <main className="studio-main flex-1 w-full mx-auto">
        <div className="studio-intro">
          <div>
            <div className="eyebrow"><span className="live-dot" /> YOUR LEARNING STUDIO <span className="eyebrow-sep">/</span> SEMESTER 1 CODING</div>
            <h1>Think it through.<br className="mobile-break" /> <span>Build it yourself.</span></h1>
            <p>A quiet space to solve hard problems, test your thinking, and see how far you’ve come.</p>
          </div>
          <div className="studio-promise">
            <div className="promise-icon"><Sparkles size={17} /></div>
            <div>
              <strong>Made for deep work</strong>
              <span>One problem at a time. Real understanding.</span>
            </div>
          </div>
        </div>

        <div className="workspace-label">
          <div><Code2 size={15}/><span>WORKSPACE</span></div>
          <span className="workspace-challenge">{currentChallenge.title}<i>·</i>{currentChallenge.difficulty}</span>
        </div>

        <div className="studio-grid">
          {/* Left Column: Problem & Invariant Specs */}
          <section className="studio-panel problem-panel tilt-card">
            <ProblemStatement challenge={currentChallenge} />
          </section>

          {/* Center Column: Code Editor & Execution Runner */}
          <section className="editor-column">
            <div className="flex-1 min-h-0">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={language}
                onLanguageChange={setLanguage}
                codeMode={codeMode}
                onCodeModeChange={handleCodeModeChange}
                onExecute={handleRunTests}
                onDefend={handleLaunchDefense}
                onReset={handleResetCode}
                isExecuting={isExecuting}
                onKeystroke={handleKeystroke}
                onPaste={handlePaste}
              />
            </div>

            {/* Test Results Drawer */}
            <div className="test-panel">
              <button
                onClick={() => setShowTestDrawer(!showTestDrawer)}
                className="test-toggle"
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

          {/* Right Column: Intelligent Feedback Engine */}
          <section className="studio-panel feedback-panel tilt-card">
            <IntelligentFeedback
              report={feedbackReport}
              isLoading={isLoadingFeedback}
            />
          </section>
        </div>
      </main>

      {/* Socratic Defense Modal */}
      <SocraticDefenseModal
        isOpen={isDefenseOpen}
        onClose={() => setIsDefenseOpen(false)}
        challenge={currentChallenge}
        studentCode={code}
        language={language}
        onDefenseComplete={handleDefenseComplete}
      />
    </div>
  );
}
