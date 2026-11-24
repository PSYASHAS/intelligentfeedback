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

  // Interactive Cursor Animation
  useEffect(() => {
    const spotlight = document.getElementById('cursorSpotlight');
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    if (!spotlight || !ring || !dot) return;

    if (window.matchMedia('(hover: none)').matches) {
      spotlight.style.display = 'none';
      ring.style.display = 'none';
      dot.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let spotX = mouseX;
    let spotY = mouseY;
    let isHovering = false;
    let isMouseDown = false;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        spotlight.style.opacity = '1';
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const card = (e.target as HTMLElement).closest('.spotlight-card') as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      spotlight.style.opacity = '0';
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      spotlight.style.opacity = '1';
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    };

    const onMouseDown = () => { isMouseDown = true; };
    const onMouseUp = () => { isMouseDown = false; };

    const onMouseOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest('button, select, textarea, input, a, [role="button"], .cursor-pointer');
      if (interactive) {
        isHovering = true;
        ring.classList.add('cursor-hover');
      } else {
        isHovering = false;
        ring.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    let animId: number;
    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      spotX += (mouseX - spotX) * 0.08;
      spotY += (mouseY - spotY) * 0.08;

      const scale = isMouseDown ? 0.75 : (isHovering ? 1.5 : 1.0);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
      spotlight.style.transform = `translate3d(${spotX}px, ${spotY}px, 0)`;

      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

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
    <div className="studio-app min-h-screen flex flex-col text-slate-100">
      {/* Interactive Cursor Spotlight & Follower Elements */}
      <div id="cursorSpotlight" />
      <div id="cursorRing" />
      <div id="cursorDot" />

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
          <section className="studio-panel problem-panel spotlight-card">
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
          <section className="studio-panel feedback-panel spotlight-card">
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
        onDefenseComplete={handleDefenseComplete}
      />
    </div>
  );
}
