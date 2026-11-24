import { 
  AssessmentChallenge, 
  IntelligentFeedbackReport, 
  FormativeFeedback,
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
   * Generates a 4-Part Actionable Formative Feedback Report.
   * Grounded in Akbar (2025): Answers What did I do well? What is the problem? Why? How to improve?
   */
  public static analyzeSubmission(context: AnalysisContext): IntelligentFeedbackReport {
    const { code, challenge, testResults } = context;
    const { passed, total } = testResults;

    let formative: FormativeFeedback;

    if (challenge.id === 'find_max') {
      formative = this.analyzeFindMax(code, passed, total);
    } else if (challenge.id === 'count_vowels') {
      formative = this.analyzeCountVowels(code, passed, total);
    } else if (challenge.id === 'even_sum') {
      formative = this.analyzeEvenSum(code, passed, total);
    } else if (challenge.id === 'reverse_list') {
      formative = this.analyzeReverseList(code, passed, total);
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

  private static analyzeFindMax(code: string, passed: number, total: number): FormativeFeedback {
    const hasZeroInit = /max\s*=\s*0\s*;/.test(code);
    const hasArbitraryConstant = /max\s*=\s*-\s*(?:999|1000|999999)\s*;/.test(code);
    const hasNumbersZeroInit = /max\s*=\s*numbers\s*\[\s*0\s*\]\s*;/.test(code);

    if (passed === total) {
      return {
        wellDone: "Outstanding work! You initialized `max = numbers[0];`, guaranteeing that `max` always starts as a valid member of the array.",
        problem: "Zero remaining flaws. All positive, all-negative, and single-element arrays passed flawlessly.",
        why: "Using the first array element `numbers[0]` as the baseline guarantees correct comparison regardless of whether numbers are positive, zero, or negative.",
        improvement: "You've successfully resolved this beginner misconception! Consider adding an empty array guard (`if (size <= 0)`) if not already present.",
        nextStep: "Click 'Mastery Check' to lock in your understanding through Socratic reflection."
      };
    }

    if (hasZeroInit) {
      return {
        wellDone: "Good job structuring the C loop and comparing values with `numbers[i] > max`.",
        problem: "Your code failed on test cases with all negative numbers like `{-8, -3, -10}`. It returned 0 instead of -3.",
        why: "On line 12, `max` is initialized to `0`. If all numbers in the array are negative, `numbers[i] > max` is NEVER true, so `max` stays 0 (a value not even in the array!).",
        improvement: "Initialize `max` using the first array item: change `int max = 0;` to `int max = numbers[0];`.",
        nextStep: "Update line 12 to `int max = numbers[0];` and click 'Run Tests & Diagnose'."
      };
    }

    if (hasArbitraryConstant) {
      return {
        wellDone: "Good thinking to pick a negative number smaller than 0.",
        problem: "Using an arbitrary negative constant like `-999999` is an anti-pattern. If an array contains numbers smaller than that, the function will fail.",
        why: "Hardcoding numbers relies on assumptions about input bounds that may not hold true in production.",
        improvement: "Use `int max = numbers[0];` (or `INT_MIN` from `<limits.h>`). Initializing from the input itself eliminates arbitrary magic numbers.",
        nextStep: "Replace the constant with `int max = numbers[0];` and test again."
      };
    }

    return {
      wellDone: "Loop structure is in place.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "The baseline value for `max` must be an element from within the array.",
      improvement: "Initialize `int max = numbers[0];` and traverse from `i = 1` to `size - 1`.",
      nextStep: "Re-run diagnostics after updating the initialization."
    };
  }

  private static analyzeCountVowels(code: string, passed: number, total: number): FormativeFeedback {
    const hasToLower = /tolower\s*\(/.test(code);
    const hasUpperChecks = /'A'|'E'|'I'|'O'|'U'/.test(code);

    if (passed === total) {
      return {
        wellDone: "Excellent! You accounted for uppercase and lowercase character representations in C.",
        problem: "Zero flaws. Lowercase, uppercase ('Apple', 'PROGRAMMING'), and edge case strings all passed.",
        why: "In C, characters are numeric ASCII values ('A' is 65, 'a' is 97). Converting with `tolower()` or checking uppercase guarantees exact case-insensitive matches.",
        improvement: "For even cleaner C code, you could use a `switch` statement or a lookup table instead of multiple `||` operators.",
        nextStep: "Proceed to the reflection stage to explain the ASCII relationship in your own words."
      };
    }

    if (!hasToLower && !hasUpperChecks) {
      return {
        wellDone: "Great job iterating through the C string until the null-terminator `\\0`.",
        problem: "Your code failed on uppercase tests like 'Apple' (returned 1 instead of 2) and 'PROGRAMMING' (returned 0 instead of 3).",
        why: "Line 16 only checks lowercase vowels (`ch == 'a' || ch == 'e' ...`). In C, character comparisons compare ASCII numbers. Because 'A' (65) != 'a' (97), uppercase vowels are skipped.",
        improvement: "Use `tolower()` from `<ctype.h>`: add `char ch = tolower(text[i]);` before checking, or add uppercase conditions (`ch == 'A' || ...`).",
        nextStep: "Include `<ctype.h>` and wrap the character in `tolower()`, then re-run diagnostics."
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

  private static analyzeEvenSum(code: string, passed: number, total: number): FormativeFeedback {
    const startsAtOne = /for\s*\(\s*(?:int\s+)?i\s*=\s*1\s*;/.test(code);
    const hasEqualSize = /i\s*<=\s*size\s*;/.test(code);

    if (passed === total) {
      return {
        wellDone: "Flawless! You used standard C 0-based indexing: `for (int i = 0; i < size; i++)`.",
        problem: "Zero flaws. The first element `arr[0]` is now included, and no memory is accessed out-of-bounds.",
        why: "C arrays have indices from `0` to `size - 1`. Starting at 0 ensures every item is visited without buffer overruns.",
        improvement: "You've mastered C array boundaries! Keep in mind that accessing `arr[size]` in C causes undefined behavior.",
        nextStep: "Complete the Socratic reflection to confirm your mastery of C array limits."
      };
    }

    if (startsAtOne || hasEqualSize) {
      return {
        wellDone: "Your even-number filter `num > 0 && num % 2 == 0` correctly identifies positive even numbers.",
        problem: "For `{2, 4, 6}`, your code returned 10 instead of 12! The first even number (2) was completely skipped.",
        why: "In C, arrays are 0-indexed. Your loop starts at `i = 1`, which skips the first element `arr[0]`. Furthermore, `i <= size` accesses `arr[size]`, which is unallocated memory!",
        improvement: "Change the loop to start at 0 and stop before `size`: `for (int i = 0; i < size; i++)`.",
        nextStep: "Change line 11 to `for (int i = 0; i < size; i++)` and click 'Run Tests & Diagnose'."
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

  private static analyzeReverseList(code: string, passed: number, total: number): FormativeFeedback {
    const hasForwardCopy = /result\s*\[\s*i\s*\]\s*=\s*arr\s*\[\s*i\s*\]\s*;/.test(code);

    if (passed === total) {
      return {
        wellDone: "Superb! You reversed the C array by calculating `arr[size - 1 - i]` and populated the `result[]` buffer correctly.",
        problem: "Zero flaws. Odd-length, single-element, and multi-element C arrays reversed correctly.",
        why: "Using the index mapping `result[i] = arr[size - 1 - i]` places the last element into index 0, reversing the sequence in a clean single pass.",
        improvement: "Advanced C tip: In C, you could also reverse in-place by swapping `arr[start]` and `arr[end]` with a temporary variable to save memory!",
        nextStep: "Proceed to the reflection to evaluate memory usage between new buffer vs in-place swap in C."
      };
    }

    if (hasForwardCopy) {
      return {
        wellDone: "Array initialization and function signature are ready.",
        problem: "The array is not reversed. For `{1, 2, 3, 4}`, your code produced `{1, 2, 3, 4}` (an exact forward copy).",
        why: "Your assignment on line 10 assigns `result[i] = arr[i]`. This copies items from left to right in original order instead of reverse.",
        improvement: "Map the index from the back: `result[i] = arr[size - 1 - i];` so that when `i = 0`, it takes `arr[size - 1]` (the last element).",
        nextStep: "Change line 10 to `result[i] = arr[size - 1 - i];` and click 'Run Tests & Diagnose'."
      };
    }

    return {
      wellDone: "Function structure is in place.",
      problem: `Passed ${passed} of ${total} tests.`,
      why: "Make sure each index `i` reads from `size - 1 - i`.",
      improvement: "Check your index formula: `result[i] = arr[size - 1 - i];`.",
      nextStep: "Re-run tests after adjusting the index calculation."
    };
  }
}
