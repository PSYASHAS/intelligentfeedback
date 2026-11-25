import { 
  AssessmentChallenge, 
  IntelligentFeedbackReport, 
  FormativeFeedback,
  RubricScoreItem, 
  TelemetryMetric,
  SUPPORTED_LANGUAGES
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
  private static getLanguageName(langId: string): string {
    return SUPPORTED_LANGUAGES.find((l) => l.id === langId)?.shortName || 'C';
  }

  /**
   * Generates a 4-Part Actionable Formative Feedback Report.
   * Grounded in Akbar (2025): Answers What did I do well? What is the problem? Why? How to improve?
   */
  public static analyzeSubmission(context: AnalysisContext): IntelligentFeedbackReport {
    const { code, language, challenge, testResults } = context;
    const { passed, total } = testResults;
    const langName = this.getLanguageName(language);

    let formative: FormativeFeedback;

    if (challenge.id === 'find_max') {
      formative = this.analyzeFindMax(code, passed, total, langName);
    } else if (challenge.id === 'count_vowels') {
      formative = this.analyzeCountVowels(code, passed, total, langName);
    } else if (challenge.id === 'even_sum') {
      formative = this.analyzeEvenSum(code, passed, total, langName);
    } else if (challenge.id === 'reverse_list') {
      formative = this.analyzeReverseList(code, passed, total, langName);
    } else {
      formative = {
        wellDone: "Function signature and syntax parsed cleanly.",
        problem: `Passed ${passed} of ${total} test cases.`,
        why: "Edge cases or boundary conditions were not satisfied.",
        improvement: "Review the problem requirements and boundary constraints.",
        nextStep: "Adjust implementation and re-run diagnostics."
      };
    }

    // Rubric Breakdown
    const rubricBreakdown: RubricScoreItem[] = challenge.rubricCriteria.map((crit) => {
      const ratio = total > 0 ? passed / total : 0;
      const score = Math.round(crit.weight * ratio);
      return {
        criterion: crit.name,
        score,
        maxScore: crit.weight,
        citation: ratio === 1 ? 'Satisfied all invariants' : `Met ${passed}/${total} invariants`,
        comment: ratio === 1 ? 'Flawless execution.' : 'Review edge case handling.'
      };
    });

    const overallScore = Math.round((passed / Math.max(total, 1)) * 100);
    const masteryStage = passed === total ? 'practised' : passed > 0 ? 'corrected' : 'identified';

    return {
      overallScore,
      authenticityConfidence: 95,
      bloomLevel: challenge.bloomLevel,
      aiSolvability: challenge.aiSolvability,
      formativeFeedback: formative,
      rubricBreakdown,
      masteryStage
    };
  }

  private static analyzeFindMax(code: string, passed: number, total: number, langName: string): FormativeFeedback {
    const hasZeroInit = /(?:max|max_val|maxVal)\s*(?::?=)\s*0\b/.test(code);
    const hasArbitraryConstant = /(?:max|max_val|maxVal)\s*(?::?=)\s*-\s*(?:999|1000|999999)\b/.test(code);

    if (passed === total) {
      return {
        wellDone: `Outstanding work in ${langName}! You initialized the maximum variable to \`numbers[0]\`, guaranteeing it always starts as a valid member of the array.`,
        problem: "Zero remaining flaws. All positive, all-negative, and single-element arrays passed flawlessly.",
        why: "Using the first array element `numbers[0]` as the baseline guarantees correct comparison regardless of whether numbers are positive, zero, or negative.",
        improvement: "You've successfully resolved this beginner misconception! Consider keeping an empty-array guard (`size <= 0`) whenever handling array inputs.",
        nextStep: "Click 'Submit & Socratic Defend' to lock in your understanding through Socratic reflection."
      };
    }

    if (hasZeroInit) {
      return {
        wellDone: `Good job structuring the ${langName} loop and comparing values against your running maximum.`,
        problem: "Your code failed on test cases with all negative numbers like `{-8, -3, -10}`. It returned 0 instead of -3.",
        why: "Your maximum variable is initialized to `0`. If all numbers in the array are negative, `numbers[i] > max` is NEVER true, so it stays 0 (a value not even in the array!).",
        improvement: `Initialize your maximum variable using the first array item (\`numbers[0]\`) instead of \`0\` in ${langName}.`,
        nextStep: "Update the initialization to `numbers[0]` and click 'Run Tests'."
      };
    }

    if (hasArbitraryConstant) {
      return {
        wellDone: "Good thinking to pick a negative number smaller than 0.",
        problem: "Using an arbitrary negative constant like `-999999` is an anti-pattern. If an array contains numbers smaller than that, the function will fail.",
        why: "Hardcoding numbers relies on assumptions about input bounds that may not hold true in production.",
        improvement: "Initialize from `numbers[0]` directly—initializing from the input itself eliminates arbitrary magic numbers.",
        nextStep: "Replace the constant with `numbers[0]` and test again."
      };
    }

    return {
      wellDone: "Loop structure is in place.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "The baseline value for maximum must be an element from within the array.",
      improvement: "Initialize your maximum variable to `numbers[0]` and traverse from index `1` to `size - 1`.",
      nextStep: "Re-run diagnostics after updating the initialization."
    };
  }

  private static analyzeCountVowels(code: string, passed: number, total: number, langName: string): FormativeFeedback {
    const hasCaseNormalization = /tolower|toLower|ToLower|lower\(|lowercase|downcase|strtolower/i.test(code);
    const hasUpperChecks = /['"]A['"]|['"]E['"]|['"]I['"]|['"]O['"]|['"]U['"]/.test(code);

    if (passed === total) {
      return {
        wellDone: `Excellent ${langName} solution! You normalized character case so uppercase and lowercase vowels are counted uniformly.`,
        problem: "Zero flaws. Lowercase, uppercase ('Apple', 'PROGRAMMING'), and edge case strings all passed.",
        why: "Uppercase and lowercase letters have distinct character/ASCII representations ('A' is 65, 'a' is 97). Normalizing case eliminates case-mismatch bugs.",
        improvement: "Clean, readable logic! Normalizing characters once per iteration keeps vowel checks concise.",
        nextStep: "Proceed to the reflection stage to explain character representation in your own words."
      };
    }

    if (!hasCaseNormalization && !hasUpperChecks) {
      return {
        wellDone: `Great job iterating through the string in ${langName} and counting lowercase vowels.`,
        problem: "Your code failed on uppercase tests like 'Apple' (returned 1 instead of 2) and 'PROGRAMMING' (returned 0 instead of 3).",
        why: "Your condition only checks lowercase vowels (`'a', 'e', 'i', 'o', 'u'`). Because `'A'` (65) != `'a'` (97), uppercase vowels are skipped.",
        improvement: `Normalize each character to lowercase before checking vowels (e.g., \`tolower()\` in C/C++, \`toLowerCase()\` in JS/TS/Java, \`.lower()\` in Python).`,
        nextStep: "Add case normalization and re-run tests."
      };
    }

    return {
      wellDone: "String traversal is functioning.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "Some vowels are still not being matched across both letter cases.",
      improvement: "Ensure all 5 vowels (a, e, i, o, u) are checked case-insensitively.",
      nextStep: "Verify your condition handles both 'A' and 'a', then re-run."
    };
  }

  private static analyzeEvenSum(code: string, passed: number, total: number, langName: string): FormativeFeedback {
    const startsAtOne = /for\s*\([^;]*\bi\s*:?=\s*1\b|range\s*\(\s*1\b|\b1\s*\.\.=?\.?\s*size\b|\b1\s+until\b/.test(code);
    const hasEqualSize = /i\s*<=\s*(?:\$)?size|\.\.=\s*size|\b1\.\.size\b|\b1\.\.\.size\b/.test(code);

    if (passed === total) {
      return {
        wellDone: `Flawless ${langName} traversal! You used standard 0-based indexing from \`0\` up to \`size - 1\`.`,
        problem: "Zero flaws. The first element `arr[0]` is now included, and no out-of-bounds access occurs.",
        why: "Zero-indexed arrays occupy indices `0` through `size - 1`. Starting at 0 ensures every item is visited without skipping the first element or overrunning the end.",
        improvement: "Great boundary discipline! Keeping strict `< size` bounds prevents off-by-one bugs across all languages.",
        nextStep: "Complete the Socratic reflection to confirm your mastery of array bounds."
      };
    }

    if (startsAtOne || hasEqualSize) {
      return {
        wellDone: "Your even-number filter (`num > 0 && num % 2 == 0`) correctly identifies positive even integers.",
        problem: "For `{2, 4, 6}`, your code returned 10 instead of 12! The first even number (2) was completely skipped.",
        why: "Arrays are 0-indexed. Starting your loop at `1` skips `arr[0]`, and iterating through `size` inclusively reads past the valid array bounds!",
        improvement: `Change the loop in ${langName} to start at \`0\` and stop strictly before \`size\`.`,
        nextStep: "Update the loop bounds to `0 .. size - 1` and click 'Run Tests'."
      };
    }

    return {
      wellDone: "Loop structure present.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "Make sure all positive even numbers are included and odd or negative numbers are skipped.",
      improvement: "Check your loop bounds and modulo condition: `arr[i] > 0 && arr[i] % 2 == 0`.",
      nextStep: "Re-run diagnostics after fixing."
    };
  }

  private static analyzeReverseList(code: string, passed: number, total: number, langName: string): FormativeFeedback {
    const hasForwardCopy = /result\s*\[\s*(?:\$)?i\s*\]\s*=\s*(?:\$)?arr\s*\[\s*(?:\$)?i\s*\]/.test(code);

    if (passed === total) {
      return {
        wellDone: `Superb ${langName} solution! You reversed the array by calculating \`arr[size - 1 - i]\` and populated \`result\` accurately.`,
        problem: "Zero flaws. Odd-length, single-element, and multi-element arrays reversed correctly.",
        why: "Using the mirror index mapping `result[i] = arr[size - 1 - i]` places the last element into index 0, reversing the sequence in a single pass.",
        improvement: "Next-level tip: Compare this O(N) buffer approach with an in-place two-pointer swap (`O(1)` extra space).",
        nextStep: "Proceed to the reflection to evaluate memory tradeoffs between buffer copying and in-place reversal."
      };
    }

    if (hasForwardCopy) {
      return {
        wellDone: "Array initialization and function signature are ready.",
        problem: "The array is not reversed. For `{1, 2, 3, 4}`, your code produced `{1, 2, 3, 4}` (an exact forward copy).",
        why: "Your assignment sets `result[i] = arr[i]`. This copies items from left to right in their original order instead of reverse.",
        improvement: "Map the index from the rear: `result[i] = arr[size - 1 - i]` so that when `i = 0`, it reads `arr[size - 1]`.",
        nextStep: "Update the assignment to use `arr[size - 1 - i]` and click 'Run Tests'."
      };
    }

    return {
      wellDone: "Function structure is in place.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "Make sure each index `i` reads from `size - 1 - i`.",
      improvement: "Check your index formula: `result[i] = arr[size - 1 - i]`.",
      nextStep: "Re-run tests after adjusting the index calculation."
    };
  }
}
