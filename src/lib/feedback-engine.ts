import { 
  AssessmentChallenge, 
  IntelligentFeedbackReport, 
  Misconception, 
  ScaffoldedHint, 
  RubricScoreItem, 
  TelemetryMetric 
} from './types';

interface AnalysisContext {
  code: string;
  language: string;
  challenge: AssessmentChallenge;
  testResults: {
    passed: number;
    failed: number;
    total: number;
    failures: Array<{ testId: string; name: string; error?: string }>;
  };
  telemetry?: TelemetryMetric;
}

export class IntelligentFeedbackEngine {
  /**
   * Generates a pedagogical, multi-tiered feedback report.
   * Blends deterministic AST/heuristic analysis with AI diagnostic prompts.
   */
  public static analyzeSubmission(context: AnalysisContext): IntelligentFeedbackReport {
    const { code, challenge, testResults, telemetry } = context;
    const misconceptions: Misconception[] = [];
    const strengths: string[] = [];
    const hints: ScaffoldedHint[] = [];
    const rubricBreakdown: RubricScoreItem[] = [];

    // Analyze specific challenge patterns
    if (challenge.id === 'inverted-ai-sanitizer') {
      this.analyzeHtmlSanitizer(code, testResults, misconceptions, strengths, hints);
    } else if (challenge.id === 'algorithmic-lru-cache') {
      this.analyzeLRUCache(code, testResults, misconceptions, strengths, hints);
    } else if (challenge.id === 'token-bucket-rate-limiter') {
      this.analyzeTokenBucket(code, testResults, misconceptions, strengths, hints);
    } else {
      this.analyzeGenericCode(code, testResults, misconceptions, strengths, hints);
    }

    // Complexity Analysis
    const complexity = this.estimateComplexity(challenge.id, code);

    // AI-Resilience & Authenticity calculation
    const resilienceAudit = this.auditAIResilience(code, challenge, telemetry);

    // Compute Rubric Scores based on misconceptions and test results
    let totalScore = 0;
    challenge.rubricCriteria.forEach((crit) => {
      let earned = crit.weight;
      let citation = 'Meets core expectations';
      let comment = 'Demonstrated competent handling of criteria.';

      if (crit.name.includes('Complexity') || crit.name.includes('Invariant')) {
        if (complexity.time.includes('O(N^2)') || complexity.time.includes('O(N) search')) {
          earned = Math.round(crit.weight * 0.4);
          citation = `Detected suboptimal asymptotic behavior (${complexity.time})`;
          comment = 'Failed to uphold average O(1) constant time constraint across all core operations.';
        }
      }

      if (crit.name.includes('Robustness') || crit.name.includes('Correctness')) {
        const passRatio = testResults.total > 0 ? testResults.passed / testResults.total : 0;
        earned = Math.round(crit.weight * passRatio);
        citation = `Passed ${testResults.passed} of ${testResults.total} test cases`;
        comment = testResults.failed > 0 
          ? `Failed edge cases including ${testResults.failures.map(f => f.name).join(', ')}.`
          : 'All functional assertions passed cleanly.';
      }

      if (crit.name.includes('Defense') || crit.name.includes('Integrity')) {
        earned = Math.round(crit.weight * (resilienceAudit.authenticityScore / 100));
        citation = `Telemetry paste ratio: ${((telemetry?.pasteRatio || 0) * 100).toFixed(0)}%`;
        comment = resilienceAudit.defenseRecommendation;
      }

      totalScore += earned;
      rubricBreakdown.push({
        criterion: crit.name,
        score: earned,
        maxScore: crit.weight,
        citation,
        comment,
      });
    });

    const executiveSummary = this.synthesizeSummary(
      totalScore,
      strengths.length,
      misconceptions.length,
      resilienceAudit.authenticityScore
    );

    return {
      overallScore: Math.min(100, Math.max(0, totalScore)),
      authenticityConfidence: resilienceAudit.authenticityScore,
      executiveSummary,
      strengths: strengths.length > 0 ? strengths : ['Code compiled and executed without runtime crashes.'],
      misconceptions,
      scaffoldedHints: hints,
      rubricBreakdown,
      timeComplexityIdentified: complexity.time,
      spaceComplexityIdentified: complexity.space,
      aiResilienceAudit: {
        authenticityFlags: resilienceAudit.flags,
        defenseRecommendation: resilienceAudit.defenseRecommendation,
      },
    };
  }

  // --- Domain-Specific Misconception Detectors ---

  private static analyzeHtmlSanitizer(
    code: string,
    testResults: any,
    misconceptions: Misconception[],
    strengths: string[],
    hints: ScaffoldedHint[]
  ) {
    const hasSinglePassRegex = /replace\s*\(\s*\/<script/i.test(code);
    const hasLoopOrRecursion = /while|for\s*\(|do\s*\{/i.test(code);
    const hasDangerousReDoS = /\(\?:.*?\)\*|<[^<]*\*/.test(code);
    const hasAttributeCleaning = /on\w+/i.test(code);

    if (hasDangerousReDoS) {
      misconceptions.push({
        id: 'misc-redos',
        title: 'Catastrophic Regular Expression Backtracking (ReDoS)',
        severity: 'high',
        studentMentalModel: 'Assuming that nested quantifiers like `(?:(?!pattern)<[^<]*)*` efficiently match all characters.',
        scientificExplanation: 'When the regex engine encounters an unclosed tag, overlapping quantifiers create exponential permutations ($O(2^N)$), freezing the Node/browser event loop.',
        remediationAdvice: 'Avoid nested quantifiers. Use non-backtracking character classes like `[^>]*>` or a finite-state lexer.',
      });
    }

    if (hasSinglePassRegex && !hasLoopOrRecursion) {
      misconceptions.push({
        id: 'misc-nested-bypass',
        title: 'Single-Pass Token Elimination Fallacy',
        severity: 'high',
        studentMentalModel: 'Believing a single global regex replace cleanly purges all prohibited substrings.',
        scientificExplanation: 'In `<scr<script>ipt>`, after the inner `<script>` is removed, the outer fragments concatenate into a valid `<script>` tag. Single-pass algorithms cannot guarantee sanitization on context-free recursive grammars.',
        remediationAdvice: 'Implement an iterative convergence loop (repeat until length stabilizes) or tokenize tags with an explicit character scanner.',
      });
    }

    if (hasAttributeCleaning) {
      strengths.push('Proactively targets inline JavaScript event handlers (on* attributes).');
    }

    if (code.includes('toLowerCase') || /flags\s*=\s*re\.IGNORECASE|\/i\b/.test(code)) {
      strengths.push('Correctly handles case-insensitivity against evasions like <SCRIPT>.');
    }

    // Scaffolding hints
    hints.push({
      level: 1,
      type: 'nudge',
      title: 'Consider Substring Concatenation',
      content: 'What happens when an attacker intentionally wraps one forbidden tag inside another split word?',
      reflectionQuestion: 'If you remove "BAD" from "B BADA D", what string remains?',
      revealed: true, // Level 1 is always unlocked first
    });

    hints.push({
      level: 2,
      type: 'guiding_question',
      title: 'State Invariant & Termination',
      content: 'If you use a loop to strip tags, how do you verify when all nested instances have been exhausted without causing an infinite loop?',
      reflectionQuestion: 'Can you compare the string length before and after a cleaning pass?',
      revealed: false,
    });

    hints.push({
      level: 3,
      type: 'structural_remediation',
      title: 'Iterative Fixed-Point Algorithm',
      content: 'Run a `do { let prev = s; s = clean(s); } while (s.length !== prev.length);`. Ensure you also sanitize against event attributes with whitespace (`onerror = "..."`).',
      reflectionQuestion: 'Why is comparing previous vs current string length an effective termination guard?',
      revealed: false,
    });
  }

  private static analyzeLRUCache(
    code: string,
    testResults: any,
    misconceptions: Misconception[],
    strengths: string[],
    hints: ScaffoldedHint[]
  ) {
    const usesArrayForOrdering = /indexOf|splice|findIndex|unshift|shift/.test(code);
    const usesDoublyLinkedList = /prev\s*=|next\s*=|Node|DNode/.test(code);
    const usesMap = /new\s+Map|this\.cache|this\.map/.test(code);

    if (usesArrayForOrdering && !usesDoublyLinkedList) {
      misconceptions.push({
        id: 'misc-lru-array',
        title: 'Array Shifting Disqualification for O(1) Invariant',
        severity: 'high',
        studentMentalModel: 'Treating a standard array or list as an adequate queue for LRU tracking.',
        scientificExplanation: 'Array operations like `splice()` or `indexOf()` require $O(N)$ linear scans through memory. Under 100,000 operations, this degrades total runtime from 15ms to over 8 seconds.',
        remediationAdvice: 'Combine a HashMap (for O(1) lookup) with a Doubly Linked List (for O(1) pointer-based removal and insertion).',
      });
    }

    if (usesMap && usesDoublyLinkedList) {
      strengths.push('Architecturally sound: Combines HashMap fast lookup with Doubly Linked List constant-time pointer relocation.');
    }

    if (code.includes('dummy') || code.includes('head.next') || code.includes('tail.prev')) {
      strengths.push('Uses sentinel dummy head/tail nodes to prevent tedious null boundary condition checks.');
    }

    hints.push({
      level: 1,
      type: 'nudge',
      title: 'Examining Asymptotic Operations',
      content: 'Check every single method in your get() and put() paths. Do any of them search through elements sequentially?',
      reflectionQuestion: 'What is the worst-case cost of array.indexOf() in terms of N?',
      revealed: true,
    });

    hints.push({
      level: 2,
      type: 'guiding_question',
      title: 'Pointer Mechanics in Doubly Linked Lists',
      content: 'When a key is accessed via get(), it must be moved to the front. How can you remove a middle node in O(1) without iterating?',
      reflectionQuestion: 'If node A points to B, and B points to C, how do you disconnect B?',
      revealed: false,
    });

    hints.push({
      level: 3,
      type: 'structural_remediation',
      title: 'Sentinel Nodes & Constant-Time Splice',
      content: 'To remove node `curr`: `curr.prev.next = curr.next; curr.next.prev = curr.prev;`. Then insert right after `this.head`. Update `this.cache.set(key, node)`.',
      reflectionQuestion: 'Why does a singly-linked list fail to achieve O(1) removal of an arbitrary node?',
      revealed: false,
    });
  }

  private static analyzeTokenBucket(
    code: string,
    testResults: any,
    misconceptions: Misconception[],
    strengths: string[],
    hints: ScaffoldedHint[]
  ) {
    const handlesNegativeTime = /elapsed\s*<\s*0|Math\.max\(\s*0/i.test(code);
    const clampsCapacity = /Math\.min\([^,]+,\s*(?:this\.)?capacity\)/i.test(code);

    if (!handlesNegativeTime) {
      misconceptions.push({
        id: 'misc-monotonic-clock',
        title: 'System Time Monotonicity Assumption',
        severity: 'medium',
        studentMentalModel: 'Assuming `Date.now()` is strictly increasing.',
        scientificExplanation: 'Network Time Protocol (NTP) adjustments can cause system clocks to jump backward. If `elapsed = now - lastRefill` is negative, tokens will be erroneously deducted.',
        remediationAdvice: 'Guard the time delta: `const elapsed = Math.max(0, now - this.lastRefill)`.',
      });
    }

    if (clampsCapacity) {
      strengths.push('Correctly clamps accumulated tokens to max capacity preventing infinite token hoarding.');
    }

    hints.push({
      level: 1,
      type: 'nudge',
      title: 'Time Dilation & Clock Synchronization',
      content: 'Servers in production run NTP daemons that synchronize time. What happens if a sync step rewinds the system clock by 50ms?',
      reflectionQuestion: 'What will your `elapsedTime` variable evaluate to?',
      revealed: true,
    });

    hints.push({
      level: 2,
      type: 'guiding_question',
      title: 'Fractional Token Math',
      content: 'Tokens arrive continuously (rate per second). Ensure fractional tokens are tracked as floating points until deduction.',
      reflectionQuestion: 'Should tokens be an integer or a float in the internal state?',
      revealed: false,
    });

    hints.push({
      level: 3,
      type: 'structural_remediation',
      title: 'Defensive State Update Pattern',
      content: '`const deltaSec = Math.max(0, (now - this.last) / 1000); this.tokens = Math.min(this.capacity, this.tokens + deltaSec * this.rate); this.last = now;`',
      reflectionQuestion: 'Why update `this.last = now` even when a request is denied?',
      revealed: false,
    });
  }

  private static analyzeGenericCode(
    code: string,
    testResults: any,
    misconceptions: Misconception[],
    strengths: string[],
    hints: ScaffoldedHint[]
  ) {
    if (testResults.passed > 0) {
      strengths.push(`Successfully passed ${testResults.passed} test cases.`);
    }
    if (testResults.failed > 0) {
      misconceptions.push({
        id: 'misc-generic-edge-case',
        title: 'Unchecked Edge Case Invariant',
        severity: 'medium',
        studentMentalModel: 'Focusing exclusively on happy-path inputs while neglecting edge-case boundaries.',
        scientificExplanation: 'The code failed when presented with boundaries (empty inputs, zero, or overflow bounds).',
        remediationAdvice: 'Add defensive guards for empty, null, or out-of-range arguments at the entry point.',
      });
    }
  }

  private static estimateComplexity(challengeId: string, code: string): { time: string; space: string } {
    if (challengeId === 'algorithmic-lru-cache') {
      const usesArray = /indexOf|splice/.test(code);
      return {
        time: usesArray ? 'O(N) search / eviction' : 'O(1) average constant time',
        space: 'O(Capacity) bounded hash storage',
      };
    }
    if (challengeId === 'inverted-ai-sanitizer') {
      const hasCatastrophicRegex = /\(\?:.*?\)\*|<[^<]*\*/.test(code);
      return {
        time: hasCatastrophicRegex ? 'O(2^N) worst-case exponential (ReDoS)' : 'O(N * K) bounded linear passes',
        space: 'O(N) string allocation',
      };
    }
    return {
      time: 'O(1) continuous math',
      space: 'O(1) scalar variables',
    };
  }

  private static auditAIResilience(
    code: string,
    challenge: AssessmentChallenge,
    telemetry?: TelemetryMetric
  ): { authenticityScore: number; flags: string[]; defenseRecommendation: string } {
    let score = 90;
    const flags: string[] = [];

    if (telemetry) {
      if (telemetry.pasteRatio > 0.75) {
        score -= 35;
        flags.push(`Massive paste detected: ${(telemetry.pasteRatio * 100).toFixed(0)}% of code entered via clipboard.`);
      }
      if (telemetry.burstAnomalyDetected) {
        score -= 20;
        flags.push('Typing speed anomaly: Over 1200 characters entered in under 3 seconds without keystroke cadence.');
      }
      if (telemetry.activeTypingTimeSeconds < 15 && code.length > 300) {
        score -= 25;
        flags.push('Low time-on-task: Submission generated in under 15 seconds.');
      }
    }

    // Check for hallmark AI commentary signatures
    if (code.includes('// Here is the refactored code') || code.includes('// This code is 100% secure') || code.includes('/** Explanation:')) {
      score -= 20;
      flags.push('Contains conversational LLM boilerplate phrases.');
    }

    let defenseRecommendation = 'Normal verification: Student shows organic iterative thought process.';
    if (score < 60) {
      defenseRecommendation = 'Mandatory High-Rigour Viva Voce: Probe internal mechanics, algorithmic invariants, and ask the student to live-modify the solution.';
    } else if (score < 80) {
      defenseRecommendation = 'Targeted Viva Voce: Inquire on trade-offs and alternative data structures.';
    }

    return {
      authenticityScore: Math.max(10, Math.min(100, score)),
      flags,
      defenseRecommendation,
    };
  }

  private static synthesizeSummary(
    score: number,
    strengthsCount: number,
    misconceptionsCount: number,
    authenticity: number
  ): string {
    if (score >= 90) {
      return `Outstanding submission. Clean algorithmic execution with strong invariant protection. Authenticity confidence is high (${authenticity}%).`;
    }
    if (misconceptionsCount > 0) {
      return `Identified ${misconceptionsCount} core conceptual misconceptions that impair edge-case stability or asymptotic complexity. Review the scaffolded hints below.`;
    }
    return `Solution functional but exhibits optimization opportunities across rubric criteria.`;
  }
}
