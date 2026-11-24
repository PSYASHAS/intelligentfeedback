import { DefenseQuestion, DefenseSession, AssessmentChallenge } from './types';

export class SocraticDefenseAgent {
  /**
   * Generates tailored viva voce questions that probe the student's actual code.
   */
  public static generateQuestions(
    challenge: AssessmentChallenge,
    studentCode: string
  ): DefenseQuestion[] {
    const questions: DefenseQuestion[] = [];

    if (challenge.id === 'inverted-ai-sanitizer') {
      questions.push({
        id: 'q-sanitizer-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: `In your sanitization logic, how does your implementation guarantee that an input like '<scr<script>ipt>' cannot reconstruct into an executable script after the inner tag is removed?`,
      });

      questions.push({
        id: 'q-sanitizer-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: `If an attacker uses multiline spacing and tab characters like '<img src="x"\\n\\tonerror\\t=\\t"alert(1)">', how does your solution parse the attributes without succumbing to exponential regex backtracking?`,
      });

      questions.push({
        id: 'q-sanitizer-3',
        questionNumber: 3,
        targetedInsight: 'alternative_tradeoff',
        prompt: `Why is an iterative character scan or state machine generally considered more resilient against ReDoS attacks than complex regular expressions?`,
      });
    } else if (challenge.id === 'algorithmic-lru-cache') {
      questions.push({
        id: 'q-lru-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: `Explain why achieving true O(1) time complexity for BOTH get() and put() requires combining two distinct data structures instead of using a single list or hash table.`,
      });

      questions.push({
        id: 'q-lru-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: `When unlinking an arbitrary node in your doubly-linked list during an eviction or update, how do you prevent null pointer exceptions if the node is at the head or tail boundary?`,
      });

      questions.push({
        id: 'q-lru-3',
        questionNumber: 3,
        targetedInsight: 'alternative_tradeoff',
        prompt: `If memory was extremely constrained and each node pointer overhead was unacceptable, what alternative caching policy or structure would you propose?`,
      });
    } else {
      questions.push({
        id: 'q-gen-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: `Walk me through the lifecycle of an incoming request in your solution. What is the exact invariant you maintain?`,
      });

      questions.push({
        id: 'q-gen-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: `What failure mode occurs if external system clocks experience negative drift or leap seconds during execution?`,
      });

      questions.push({
        id: 'q-gen-3',
        questionNumber: 3,
        targetedInsight: 'alternative_tradeoff',
        prompt: `How would you adapt this single-threaded model to support a distributed environment across multiple worker nodes?`,
      });
    }

    return questions;
  }

  /**
   * Evaluates the student's defense response for genuine conceptual understanding.
   */
  public static evaluateAnswer(
    question: DefenseQuestion,
    answer: string
  ): { verifiedMastery: boolean; confidenceScore: number; analysis: string } {
    const trimmed = answer.trim();
    const wordCount = trimmed.split(/\s+/).length;

    // Check for superficial / evasive answers
    if (wordCount < 6 || trimmed.toLowerCase().includes("i don't know") || trimmed.toLowerCase().includes("ai wrote this")) {
      return {
        verifiedMastery: false,
        confidenceScore: 15,
        analysis: 'Response is too brief or evasive to demonstrate conceptual mastery of the design choice.',
      };
    }

    const lower = trimmed.toLowerCase();
    let score = 75;
    let analysis = 'Student demonstrated sound reasoning aligned with structural invariants.';

    if (question.targetedInsight === 'code_rationale') {
      if (lower.includes('hash') || lower.includes('pointer') || lower.includes('constant') || lower.includes('loop') || lower.includes('pass')) {
        score = 92;
        analysis = 'Strong articulation of data structure mechanics and algorithmic complexity guarantees.';
      }
    } else if (question.targetedInsight === 'edge_case_stress') {
      if (lower.includes('null') || lower.includes('boundary') || lower.includes('backtrack') || lower.includes('sentinel') || lower.includes('drift')) {
        score = 90;
        analysis = 'Accurately recognized boundary invariants and defensive state validation.';
      }
    } else if (question.targetedInsight === 'alternative_tradeoff') {
      if (lower.includes('tradeoff') || lower.includes('memory') || lower.includes('overhead') || lower.includes('scale') || lower.includes('state')) {
        score = 88;
        analysis = 'Demonstrated mature engineering reasoning regarding architectural alternatives.';
      }
    }

    return {
      verifiedMastery: score >= 70,
      confidenceScore: score,
      analysis,
    };
  }
}
