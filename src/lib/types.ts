/**
 * Mistake-to-Mastery Platform Types
 * Grounded in: "Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback" (Akbar 2025)
 */

export type ProgrammingLanguage = 'c' | 'javascript' | 'python' | 'typescript';

export type BloomLevel = 
  | 'remember'   // Recall C syntax, primitives, headers
  | 'understand' // Trace pointer/array bounds & execution
  | 'apply'      // Implement standard algorithms in C
  | 'analyse'    // Debug memory boundaries, off-by-one & logic flaws
  | 'evaluate'   // Judge memory footprint & algorithmic efficiency
  | 'create';    // Design original modular programs in C

export type MasteryStage = 'identified' | 'corrected' | 'practised' | 'mastered';

export type AISolvabilityCategory = 
  | 'Low (<50%)' 
  | 'Medium (50–64%)' 
  | 'Medium-High (65–74%)' 
  | 'High (>74%)';

export interface AISolvabilityMetadata {
  score: number; // 0 - 100%
  category: AISolvabilityCategory;
  taskStrength: string;
  limitation: string;
  suggestedImprovement: string;
}

export interface TestCase {
  id: string;
  name: string;
  inputDescription: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface BeginnerFlawExplanation {
  identifiedMistake: string;
  rootCause: string;
  remediationSuggestion: string;
}

export interface AssessmentChallenge {
  id: string;
  title: string;
  targetTopic: string;
  bloomLevel: BloomLevel;
  difficulty: string;
  aiSolvability: AISolvabilityMetadata;
  description: string;
  starterCode: Record<ProgrammingLanguage, string>;
  correctCode?: Record<ProgrammingLanguage, string>;
  predefinedFeedback?: FormativeFeedback;
  testCases: TestCase[];
  flawExplanation: BeginnerFlawExplanation;
  reflectionPrompt: string;
  rubricCriteria: {
    name: string;
    weight: number;
    description: string;
  }[];
}

export interface FormativeFeedback {
  wellDone: string;
  problem: string;
  why: string;
  improvement: string;
  nextStep: string;
}

export interface TelemetryMetric {
  totalKeystrokes: number;
  pasteEvents: number;
  pastedCharCount: number;
  activeTypingTimeSeconds: number;
  backspaceCount: number;
  pasteRatio: number;
  burstAnomalyDetected: boolean;
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
  authenticityConfidence: number;
  bloomLevel: BloomLevel;
  aiSolvability: AISolvabilityMetadata;
  formativeFeedback: FormativeFeedback;
  rubricBreakdown: RubricScoreItem[];
  masteryStage: MasteryStage;
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
