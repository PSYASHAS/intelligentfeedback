export type ProgrammingLanguage = 'javascript' | 'python' | 'typescript';

export interface TestCase {
  id: string;
  name: string;
  inputDescription: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export type AssessmentCategory = 
  | 'algorithmic'          // Algorithmic challenge with performance/scale invariants
  | 'inverted_ai_critique' // Flawed AI-generated code that student must audit & repair
  | 'concurrency_state';    // State machine or edge-case prone logic

export interface AssessmentChallenge {
  id: string;
  title: string;
  category: AssessmentCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  aiTrapContext?: {
    claimedFlawlessDescription: string;
    hiddenVulnerabilities: string[];
    commonCopyPasteHallucinations: string[];
  };
  rubricCriteria: {
    name: string;
    weight: number;
    description: string;
  }[];
}

export interface TelemetryMetric {
  totalKeystrokes: number;
  pasteEvents: number;
  pastedCharCount: number;
  activeTypingTimeSeconds: number;
  backspaceCount: number;
  pasteRatio: number; // pasted chars / total chars
  burstAnomalyDetected: boolean;
}

export interface Misconception {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  affectedLines?: number[];
  studentMentalModel: string;
  scientificExplanation: string;
  remediationAdvice: string;
}

export interface ScaffoldedHint {
  level: 1 | 2 | 3;
  type: 'nudge' | 'guiding_question' | 'structural_remediation';
  title: string;
  content: string;
  reflectionQuestion: string;
  revealed: boolean;
}

export interface RubricScoreItem {
  criterion: string;
  score: number;
  maxScore: number;
  citation: string;
  comment: string;
}

export interface IntelligentFeedbackReport {
  overallScore: number;
  authenticityConfidence: number; // 0 - 100%
  executiveSummary: string;
  strengths: string[];
  misconceptions: Misconception[];
  scaffoldedHints: ScaffoldedHint[];
  rubricBreakdown: RubricScoreItem[];
  timeComplexityIdentified: string;
  spaceComplexityIdentified: string;
  aiResilienceAudit: {
    authenticityFlags: string[];
    defenseRecommendation: string;
  };
}

export interface DefenseQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  targetedInsight: 'code_rationale' | 'edge_case_stress' | 'alternative_tradeoff';
  studentAnswer?: string;
  evaluation?: {
    verifiedMastery: boolean;
    confidenceScore: number;
    analysis: string;
  };
}

export interface DefenseSession {
  submissionId: string;
  status: 'pending' | 'in_progress' | 'completed';
  questions: DefenseQuestion[];
  currentQuestionIndex: number;
  finalVerdict?: {
    passed: boolean;
    authenticityRating: 'High Understanding' | 'Partial / Memorized' | 'Superficial / Likely Pasted';
    summary: string;
  };
}
