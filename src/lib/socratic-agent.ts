import { DefenseQuestion, AssessmentChallenge, SUPPORTED_LANGUAGES } from './types';
import { generateStructuredJSON } from './llm-client';

interface LLMQuestionsResponse {
  questions?: Array<{
    prompt?: string;
    targetedInsight?: 'code_rationale' | 'edge_case_stress' | 'alternative_tradeoff';
  }>;
}

interface LLMEvaluationResponse {
  verifiedMastery?: boolean;
  confidenceScore?: number;
  analysis?: string;
}

export class SocraticDefenseAgent {
  private static getLanguageName(langId?: string): string {
    if (!langId) return 'the selected language';
    return SUPPORTED_LANGUAGES.find((l) => l.id === langId)?.shortName || langId.toUpperCase();
  }

  /**
   * Generates tailored Socratic reflection questions that probe the student's actual submitted code.
   */
  public static async generateQuestions(
    challenge: AssessmentChallenge,
    studentCode: string,
    language = 'c'
  ): Promise<DefenseQuestion[]> {
    const langName = this.getLanguageName(language);

    const aiQuestions = await generateStructuredJSON<LLMQuestionsResponse>({
      systemPrompt: `You are a Socratic computer science examiner conducting a viva voce defense.
Generate 3 concise, probing questions directly referencing the student's actual submitted code and language (${langName}).
Return valid JSON matching:
{
  "questions": [
    { "targetedInsight": "code_rationale", "prompt": "..." },
    { "targetedInsight": "edge_case_stress", "prompt": "..." },
    { "targetedInsight": "alternative_tradeoff", "prompt": "..." }
  ]
}`,
      userPrompt: `Challenge: ${challenge.title}
Topic: ${challenge.targetTopic}
Description: ${challenge.description}
Language: ${langName}

Student's Code:
\`\`\`${langName.toLowerCase()}
${studentCode}
\`\`\``,
      temperature: 0.35,
    });

    if (aiQuestions?.questions && aiQuestions.questions.length > 0) {
      const valid = aiQuestions.questions
        .filter((q) => typeof q.prompt === 'string' && q.prompt.trim().length > 10)
        .slice(0, 3);

      if (valid.length > 0) {
        return valid.map((q, idx) => ({
          id: `q-ai-${idx + 1}`,
          questionNumber: idx + 1,
          targetedInsight: q.targetedInsight || 'code_rationale',
          prompt: q.prompt!.trim(),
        }));
      }
    }

    return this.buildDynamicQuestions(challenge, studentCode, langName);
  }

  private static buildDynamicQuestions(
    challenge: AssessmentChallenge,
    studentCode: string,
    langName: string
  ): DefenseQuestion[] {
    const initMatch = studentCode.match(/\b(?:let|const|var|int|long|double|float)?\s*([A-Za-z_]\w*)\s*(?::?=)\s*([^;\n]+)/);
    const hasGuard = /if\s*\(?\s*(?:!|size\s*<=|len\([^)]+\)\s*<=|\.length\s*<=|\.length\s*===\s*0)/.test(studentCode);
    const loopMatch = studentCode.match(/\b(?:for|while)\s*\(([^)]+)\)|\bfor\s+([^\n:]+):/);

    const rationaleSnippet = initMatch
      ? `In your ${langName} code, you initialized \`${initMatch[1]} = ${initMatch[2].trim()}\`. Why is that initial state valid (or risky) for all inputs in "${challenge.targetTopic}"?`
      : `Explain the core invariant in your ${langName} implementation for "${challenge.title}" and why each step preserves it.`;

    const edgeSnippet = loopMatch
      ? `Looking at your loop \`${(loopMatch[1] || loopMatch[2] || '').trim()}\` (${hasGuard ? 'with' : 'without'} an explicit empty-input guard), what happens on boundary inputs such as empty arrays/strings, single-element inputs, or extreme values?`
      : `What happens in your ${langName} function when given empty, single-element, or adversarial boundary inputs?`;

    const tradeoffSnippet = `What is the time and auxiliary space complexity of your current ${langName} approach, and what alternative implementation could trade readability or memory for performance?`;

    return [
      {
        id: 'q-dyn-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: rationaleSnippet,
      },
      {
        id: 'q-dyn-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: edgeSnippet,
      },
      {
        id: 'q-dyn-3',
        questionNumber: 3,
        targetedInsight: 'alternative_tradeoff',
        prompt: tradeoffSnippet,
      },
    ];
  }

  /**
   * Evaluates a student's Socratic defense response against the question, challenge, and submitted code.
   */
  public static async evaluateAnswer(
    question: DefenseQuestion,
    answer: string,
    context?: {
      challenge?: AssessmentChallenge;
      code?: string;
      language?: string;
    }
  ): Promise<{ verifiedMastery: boolean; confidenceScore: number; analysis: string }> {
    const trimmed = answer.trim();
    const langName = this.getLanguageName(context?.language);

    const aiEval = await generateStructuredJSON<LLMEvaluationResponse>({
      systemPrompt: `You are evaluating a student's oral/written defense of their code.
Judge conceptual accuracy, specificity to the question and code, and technical correctness.
Return valid JSON matching:
{
  "verifiedMastery": true or false,
  "confidenceScore": integer 0 to 100,
  "analysis": "2-3 sentences explaining what the student got right or what gap remains."
}`,
      userPrompt: `Challenge: ${context?.challenge?.title || 'Coding Assessment'}
Language: ${langName}
Question (${question.targetedInsight}): ${question.prompt}
${context?.code ? `\nStudent Code:\n\`\`\`\n${context.code}\n\`\`\`\n` : ''}
Student Answer:
${trimmed}`,
      temperature: 0.2,
    });

    if (
      aiEval &&
      typeof aiEval.verifiedMastery === 'boolean' &&
      typeof aiEval.confidenceScore === 'number' &&
      typeof aiEval.analysis === 'string' &&
      aiEval.analysis.trim().length > 0
    ) {
      return {
        verifiedMastery: aiEval.verifiedMastery,
        confidenceScore: Math.max(0, Math.min(100, Math.round(aiEval.confidenceScore))),
        analysis: aiEval.analysis.trim(),
      };
    }

    return this.evaluateAnswerDynamically(question, trimmed, context?.challenge);
  }

  private static evaluateAnswerDynamically(
    question: DefenseQuestion,
    answer: string,
    challenge?: AssessmentChallenge
  ): { verifiedMastery: boolean; confidenceScore: number; analysis: string } {
    const words = answer.toLowerCase().split(/\s+/).filter(Boolean);
    const hasCausalReasoning = /\b(because|since|therefore|so that|causes|leads to|ensures|guarantees|prevents|otherwise|if)\b/i.test(
      answer
    );
    const technicalTerms = [
      'index',
      'bounds',
      'loop',
      'array',
      'string',
      'element',
      'first',
      'last',
      'zero',
      'negative',
      'empty',
      'size',
      'length',
      'memory',
      'space',
      'time',
      'o(n)',
      'o(1)',
      'complexity',
      'ascii',
      'case',
      'lowercase',
      'uppercase',
      'null',
      'undefined',
      'overflow',
      'swap',
      'pointer',
      'guard',
      'return',
      'initialize',
      'initial',
    ];

    const matchedConcepts = technicalTerms.filter((term) => answer.toLowerCase().includes(term));

    // Also reward overlap with keywords in the question itself (> 4 chars)
    const promptKeywords = Array.from(
      new Set(
        (question.prompt + ' ' + (challenge?.targetTopic || ''))
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 4)
      )
    );
    const relevantOverlap = promptKeywords.filter((kw) => answer.toLowerCase().includes(kw));

    let score = 35;
    if (words.length >= 12) score += 20;
    else if (words.length >= 6) score += 10;

    if (hasCausalReasoning) score += 18;
    score += Math.min(18, matchedConcepts.length * 6);
    score += Math.min(12, relevantOverlap.length * 4);
    score = Math.max(20, Math.min(96, score));

    const verifiedMastery = words.length >= 8 && (hasCausalReasoning || matchedConcepts.length >= 2) && score >= 65;

    const analysis = verifiedMastery
      ? `Your explanation demonstrates clear reasoning (${matchedConcepts.slice(0, 3).join(', ') || 'relevant domain concepts'}) and directly addresses the ${question.targetedInsight.replace('_', ' ')} prompt.`
      : `Your response is too brief or lacks explicit causal reasoning. Expand on *why* your implementation behaves that way on edge cases (mentioning concrete terms like ${
          promptKeywords.slice(0, 3).join(', ') || 'bounds, initialization, or complexity'
        }).`;

    return {
      verifiedMastery,
      confidenceScore: score,
      analysis,
    };
  }
}
