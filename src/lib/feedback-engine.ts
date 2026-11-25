import {
  AssessmentChallenge,
  IntelligentFeedbackReport,
  FormativeFeedback,
  RubricScoreItem,
  TelemetryMetric,
  TestCaseExecutionResult,
  SUPPORTED_LANGUAGES,
} from './types';
import { generateStructuredJSON } from './llm-client';

export interface AnalysisContext {
  code: string;
  language: string;
  challenge: AssessmentChallenge;
  testResults: {
    passed: number;
    failed: number;
    total: number;
    failures?: Array<{ testId: string; name: string; error?: string }>;
  };
  executionResults?: TestCaseExecutionResult[];
  telemetry?: TelemetryMetric;
}

interface LLMFeedbackResponse {
  formativeFeedback?: Partial<FormativeFeedback>;
  rubricBreakdown?: Array<{
    criterion?: string;
    score?: number;
    citation?: string;
    comment?: string;
  }>;
}

interface CodeFeatures {
  lineCount: number;
  hasFunction: boolean;
  hasLoop: boolean;
  hasConditional: boolean;
  hasReturn: boolean;
  hasGuard: boolean;
  literalInits: Array<{ name: string; value: string }>;
  loopStartsAtOne: boolean;
  inclusiveSizeBound: boolean;
  hasCaseFold: boolean;
  usesReverseIndexing: boolean;
}

export class IntelligentFeedbackEngine {
  private static getLanguageName(langId: string): string {
    return SUPPORTED_LANGUAGES.find((l) => l.id === langId)?.shortName || langId.toUpperCase();
  }

  private static computeAuthenticityConfidence(telemetry?: TelemetryMetric): number {
    if (!telemetry) return 90;

    let confidence = 92;
    if (telemetry.burstAnomalyDetected) confidence -= 32;
    else if (telemetry.pasteRatio > 0.65) confidence -= 22;
    else if (telemetry.pasteRatio > 0.35) confidence -= 10;

    if (telemetry.totalKeystrokes === 0 && telemetry.pastedCharCount > 0) {
      confidence -= 15;
    } else if (telemetry.totalKeystrokes > 20 && telemetry.backspaceCount > 2) {
      confidence += 4;
    }

    return Math.max(15, Math.min(98, Math.round(confidence)));
  }

  private static inspectCodeFeatures(code: string): CodeFeatures {
    const lines = code.split('\n').filter((l) => l.trim().length > 0);
    const hasFunction = /\b(function|def|int|void|public|fn|func|fun)\b\s+[A-Za-z_]\w*\s*\(/.test(code);
    const hasLoop = /\b(for|while|do)\b|\.each_char\b|\.forEach\b/.test(code);
    const hasConditional = /\bif\b|\bswitch\b|\?.*:/.test(code);
    const hasReturn = /\breturn\b/.test(code);
    const hasGuard = /if\s*\(?\s*(?:!|size\s*<=|len\([^)]+\)\s*<=|\.length\s*<=|\.length\s*===\s*0)/.test(code);

    const literalInits: Array<{ name: string; value: string }> = [];
    const initRegex = /\b(?:let|const|var|int|long|double|float|auto)?\s*([A-Za-z_]\w*)\s*(?::?=)\s*(-?\d+)\b/g;
    let m: RegExpExecArray | null;
    while ((m = initRegex.exec(code)) !== null) {
      if (m[1] !== 'i' && m[1] !== 'j' && m[1] !== 'k') {
        literalInits.push({ name: m[1], value: m[2] });
      }
    }

    const loopStartsAtOne =
      /for\s*\([^;]*\bi\s*:?=\s*1\b|range\s*\(\s*1\b|\b1\s*\.\.=?\.?\s*size\b|\b1\s+until\b/.test(code);
    const inclusiveSizeBound =
      /\bi\s*<=\s*(?:\$)?size\b|\.\.=\s*size\b|\b1\.\.size\b|\b1\.\.\.size\b/.test(code);
    const hasCaseFold =
      /tolower|toLower|ToLower|lower\(|lowercase|downcase|strtolower/i.test(code);
    const usesReverseIndexing = /size\s*-\s*1\s*-\s*i|\blen\([^)]+\)\s*-\s*1\s*-\s*i/.test(code);

    return {
      lineCount: lines.length,
      hasFunction,
      hasLoop,
      hasConditional,
      hasReturn,
      hasGuard,
      literalInits,
      loopStartsAtOne,
      inclusiveSizeBound,
      hasCaseFold,
      usesReverseIndexing,
    };
  }

  /**
   * Generates a 4-Part Actionable Formative Feedback Report from actual execution results and code.
   * Uses a configured LLM when available, falling back to genuine dynamic code + test-diff analysis.
   */
  public static async analyzeSubmission(
    context: AnalysisContext
  ): Promise<IntelligentFeedbackReport> {
    const { code, language, challenge, testResults, executionResults = [], telemetry } = context;
    const passed = testResults?.passed ?? executionResults.filter((r) => r.passed).length;
    const total = testResults?.total ?? (executionResults.length || challenge.testCases.length);
    const langName = this.getLanguageName(language);
    const authenticityConfidence = this.computeAuthenticityConfidence(telemetry);

    const overallScore = Math.round((passed / Math.max(total, 1)) * 100);
    const masteryStage = passed === total && total > 0 ? 'practised' : passed > 0 ? 'corrected' : 'identified';

    const aiResult = await this.tryGenerateAIFeedback(
      code,
      langName,
      challenge,
      passed,
      total,
      executionResults
    );

    if (aiResult) {
      return {
        overallScore,
        authenticityConfidence,
        bloomLevel: challenge.bloomLevel,
        aiSolvability: challenge.aiSolvability,
        formativeFeedback: aiResult.formativeFeedback,
        rubricBreakdown: aiResult.rubricBreakdown,
        masteryStage,
        analysisSource: 'ai',
      };
    }

    const dynamic = this.buildDynamicFeedback(
      code,
      langName,
      challenge,
      passed,
      total,
      executionResults
    );

    return {
      overallScore,
      authenticityConfidence,
      bloomLevel: challenge.bloomLevel,
      aiSolvability: challenge.aiSolvability,
      formativeFeedback: dynamic.formativeFeedback,
      rubricBreakdown: dynamic.rubricBreakdown,
      masteryStage,
      analysisSource: 'dynamic',
    };
  }

  private static async tryGenerateAIFeedback(
    code: string,
    langName: string,
    challenge: AssessmentChallenge,
    passed: number,
    total: number,
    executionResults: TestCaseExecutionResult[]
  ): Promise<{ formativeFeedback: FormativeFeedback; rubricBreakdown: RubricScoreItem[] } | null> {
    const systemPrompt = `You are an expert computer science instructor providing 4-part formative feedback grounded in Akbar (2025).
Analyze ONLY the student's actual submitted code and the actual test execution results provided.
Never invent test outputs or claim errors that did not happen in the execution log.
Return valid JSON matching this exact schema:
{
  "formativeFeedback": {
    "wellDone": "Specific praise referencing real constructs in the student's code or tests they passed.",
    "problem": "Exact summary of what compiled/failed, quoting real failing test inputs, expected outputs, actual outputs, or compiler/runtime errors. If all tests passed, explicitly state zero flaws remain.",
    "why": "Root conceptual or syntactic reason in the student's actual code explaining why those exact outputs or errors occurred.",
    "improvement": "Concrete, actionable fix tailored to the student's code in the selected language (or next-level complexity/edge-case refinement if all tests pass).",
    "nextStep": "Single clear next action for the student."
  },
  "rubricBreakdown": [
    {
      "criterion": "Exact criterion name from rubricCriteria",
      "score": 0,
      "citation": "Evidence from code/test results",
      "comment": "Concise justification"
    }
  ]
}`;

    const resultsSummary =
      executionResults.length > 0
        ? executionResults
            .map(
              (r) =>
                `- [${r.passed ? 'PASS' : 'FAIL'}] ${r.name} | Input: ${r.input} | Expected: ${r.expected} | Actual: ${r.actual}${
                  r.error ? ` | Error: ${r.error}` : ''
                }`
            )
            .join('\n')
        : `Summary only: ${passed}/${total} tests passed.`;

    const rubricList = challenge.rubricCriteria
      .map((c) => `- ${c.name} (maxScore: ${c.weight}): ${c.description}`)
      .join('\n');

    const userPrompt = `Challenge: ${challenge.title}
Language: ${langName}
Problem Description:
${challenge.description}

Score: ${passed}/${total} tests passed

Actual Execution Results:
${resultsSummary}

Rubric Criteria:
${rubricList}

Student's Actual Submitted Code:
\`\`\`${langName.toLowerCase()}
${code}
\`\`\``;

    const raw = await generateStructuredJSON<LLMFeedbackResponse>({
      systemPrompt,
      userPrompt,
      temperature: 0.2,
    });

    if (!raw?.formativeFeedback) return null;

    const ff = raw.formativeFeedback;
    if (!ff.wellDone || !ff.problem || !ff.why || !ff.improvement || !ff.nextStep) {
      return null;
    }

    const ratio = total > 0 ? passed / total : 0;
    const rubricBreakdown: RubricScoreItem[] = challenge.rubricCriteria.map((crit) => {
      const matched = raw.rubricBreakdown?.find(
        (r) => r.criterion?.trim().toLowerCase() === crit.name.trim().toLowerCase()
      );
      const rawScore =
        typeof matched?.score === 'number' && !Number.isNaN(matched.score)
          ? matched.score
          : Math.round(crit.weight * ratio);

      return {
        criterion: crit.name,
        score: Math.max(0, Math.min(crit.weight, Math.round(rawScore))),
        maxScore: crit.weight,
        citation: matched?.citation?.trim() || `${passed}/${total} tests passed`,
        comment: matched?.comment?.trim() || (ratio === 1 ? 'Criteria satisfied.' : 'Needs revision based on failing cases.'),
      };
    });

    return {
      formativeFeedback: {
        wellDone: ff.wellDone.trim(),
        problem: ff.problem.trim(),
        why: ff.why.trim(),
        improvement: ff.improvement.trim(),
        nextStep: ff.nextStep.trim(),
      },
      rubricBreakdown,
    };
  }

  private static buildDynamicFeedback(
    code: string,
    langName: string,
    challenge: AssessmentChallenge,
    passed: number,
    total: number,
    executionResults: TestCaseExecutionResult[]
  ): { formativeFeedback: FormativeFeedback; rubricBreakdown: RubricScoreItem[] } {
    const features = this.inspectCodeFeatures(code);
    const compileFailures = executionResults.filter((r) => r.actual === 'Compilation Error');
    const runtimeFailures = executionResults.filter((r) => r.actual === 'Runtime Error');
    const logicFailures = executionResults.filter(
      (r) => !r.passed && r.actual !== 'Compilation Error' && r.actual !== 'Runtime Error'
    );
    const passingTests = executionResults.filter((r) => r.passed);

    let wellDone = '';
    let problem = '';
    let why = '';
    let improvement = '';
    let nextStep = '';

    if (!code.trim()) {
      wellDone = `Workspace ready for ${langName}.`;
      problem = 'The editor is currently empty, so no solution could be executed.';
      why = 'No function implementation was provided for the test runner to invoke.';
      improvement = `Write the required ${langName} function matching the problem specification, or click Reset to restore starter code.`;
      nextStep = 'Implement the function body and click Run Tests.';
    } else if (compileFailures.length > 0) {
      const errMsg = compileFailures[0].error || 'Syntax or translation error';
      const strengths: string[] = [];
      if (features.hasFunction) strengths.push('a function signature');
      if (features.hasLoop) strengths.push('iteration logic');
      if (features.hasConditional) strengths.push('conditional branching');

      wellDone =
        strengths.length > 0
          ? `Your ${langName} submission (${features.lineCount} lines) includes ${strengths.join(', ')}.`
          : `You wrote ${features.lineCount} non-empty lines of ${langName} code to inspect.`;
      problem = `Compilation/parsing failed before any of the ${total} tests could run: ${errMsg}`;
      why = `The ${langName} runner encountered invalid syntax, an unmatched delimiter, or an unsupported construct (${errMsg}).`;
      improvement = `Fix the syntax error reported above (${errMsg}) and ensure the function name, parameters, braces/indentation, and return statement are valid ${langName}.`;
      nextStep = 'Resolve the compilation error and re-run the test suite.';
    } else if (runtimeFailures.length > 0) {
      const firstErr = runtimeFailures[0];
      wellDone =
        passingTests.length > 0
          ? `Your ${langName} code compiled and passed ${passingTests.length}/${total} test cases (${passingTests.map((t) => t.name).join(', ')}).`
          : `Your ${langName} code compiled cleanly without syntax errors.`;
      problem = `${runtimeFailures.length} test(s) crashed with a runtime error—for example, "${firstErr.name}" (input: ${firstErr.input}) threw: ${firstErr.error || 'Runtime Error'}.`;
      why =
        (firstErr.error || '').toLowerCase().includes('timed out')
          ? 'A loop condition never terminated, causing execution to exceed the safety time limit.'
          : `During execution on ${firstErr.input}, the function accessed an undefined value, threw an exception, or hit an invalid operation (${firstErr.error || 'Runtime Error'}).`;
      improvement = `Trace "${firstErr.name}" with input ${firstErr.input} line by line, verify loop termination conditions, and ensure variables/indices stay defined.`;
      nextStep = `Fix the runtime error on ${firstErr.name} and click Run Tests again.`;
    } else if (passed === total && total > 0) {
      const strengths: string[] = [`passed all ${total}/${total} test cases`];
      if (features.hasGuard) strengths.push('included an empty/boundary guard');
      if (features.hasCaseFold) strengths.push('normalized character casing');
      if (features.usesReverseIndexing) strengths.push('used symmetric mirror indexing');

      wellDone = `Strong ${langName} solution: your code ${strengths.join(', ')}.`;
      problem = `Zero failing tests. Every case (${executionResults.map((t) => t.name).join(', ') || `${total} cases`}) matched expected outputs.`;
      why = 'Your initialization, loop bounds, and conditional logic hold across both standard inputs and edge cases.';
      improvement = features.hasGuard
        ? 'Your implementation handles edge cases cleanly. Consider reviewing time/space complexity and alternative approaches before defending.'
        : 'All tests passed; adding an explicit guard for empty or invalid inputs (`size <= 0` / empty string) will make your code even safer in production.';
      nextStep = "Click 'Submit & Socratic Defend' to verify your reasoning on your implementation.";
    } else if (logicFailures.length > 0) {
      const sampleFailures = logicFailures
        .slice(0, 2)
        .map(
          (f) =>
            `"${f.name}" (input ${f.input}): expected ${f.expected}, got ${f.actual}`
        )
        .join('; ');

      wellDone =
        passingTests.length > 0
          ? `Your ${langName} code compiled cleanly and passed ${passingTests.length} of ${total} tests (${passingTests.map((t) => t.name).join(', ')}).`
          : `Your ${langName} code compiled and executed across all ${total} test cases without crashing.`;

      problem = `Failed ${logicFailures.length} of ${total} tests: ${sampleFailures}.`;

      // Diagnose root cause directly from observed code & actual outputs
      const reasons: string[] = [];
      const fixes: string[] = [];

      const hasUndefinedActual = logicFailures.some((f) => f.actual === 'undefined');
      const hasNaNActual = logicFailures.some((f) => f.actual === 'NaN');

      if (!features.hasReturn && hasUndefinedActual) {
        reasons.push('The function did not execute a `return` statement on at least one path, returning `undefined`.');
        fixes.push('Ensure your function returns the computed result along every execution path.');
      }
      if (hasNaNActual) {
        reasons.push('An arithmetic operation produced `NaN`, typically from reading an out-of-bounds index (`arr[size]`) or an uninitialized variable.');
        fixes.push('Check that all array accesses stay within `0 .. size - 1` and all accumulators are initialized before use.');
      }
      if (features.loopStartsAtOne) {
        reasons.push('Your loop starts at index `1`, which skips index `0` (the first element).');
        fixes.push('Start 0-indexed traversal at index `0` unless index `0` was already handled as the initial value.');
      }
      if (features.inclusiveSizeBound) {
        reasons.push('Your loop condition includes `size` (`<= size`), which reads one element past the valid array bounds.');
        fixes.push('Use a strict `< size` upper bound (indices `0` through `size - 1`).');
      }
      if (features.literalInits.length > 0 && logicFailures.some((f) => f.actual === features.literalInits[0]?.value)) {
        const init = features.literalInits[0];
        reasons.push(
          `The variable \`${init.name}\` is initialized to the literal \`${init.value}\`, and the function returned \`${init.value}\` instead of \`${logicFailures[0].expected}\`.`
        );
        fixes.push(`Verify whether \`${init.name}\` should be initialized from the input itself (e.g., first element) rather than \`${init.value}\`.`);
      }

      if (reasons.length === 0) {
        const first = logicFailures[0];
        reasons.push(
          `On "${first.name}" (${first.input}), your code produced \`${first.actual}\` instead of \`${first.expected}\`, indicating a mismatch in initialization, loop bounds, or branch condition.`
        );
        fixes.push(
          `Dry-run your ${langName} code step-by-step on ${first.input} and inspect why the computed value becomes \`${first.actual}\` instead of \`${first.expected}\`.`
        );
      }

      why = reasons.join(' ');
      improvement = fixes.join(' ');
      nextStep = `Update the logic for "${logicFailures[0].name}" and click 'Run Tests' to verify.`;
    } else {
      wellDone = `Code submitted in ${langName} (${features.lineCount} lines).`;
      problem = `Passed ${passed} of ${total} tests.`;
      why = 'One or more test assertions did not match the expected output.';
      improvement = 'Review the failing test inputs and trace each variable across loop iterations.';
      nextStep = 'Adjust your implementation and click Run Tests.';
    }

    const ratio = total > 0 ? passed / total : 0;
    const compiledOk = compileFailures.length === 0 && code.trim().length > 0;
    const hasRuntimeErr = runtimeFailures.length > 0;

    const rubricBreakdown: RubricScoreItem[] = challenge.rubricCriteria.map((crit, idx) => {
      let scoreRatio = ratio;
      let citation = `${passed}/${total} tests passed`;
      let comment = ratio === 1 ? 'All test invariants verified.' : `${total - passed} test case(s) failing.`;

      if (!compiledOk) {
        scoreRatio = 0;
        citation = compileFailures[0]?.error || 'Compilation failed';
        comment = 'Cannot verify criterion until compilation succeeds.';
      } else if (idx === 0 && ratio < 1 && !hasRuntimeErr) {
        // First criterion typically covers core implementation/syntax
        scoreRatio = Math.max(ratio, passingTests.length > 0 ? 0.5 : 0.25);
        citation = passingTests.length > 0 ? `Compiles cleanly; passed ${passingTests.length}/${total}` : 'Compiles cleanly';
        comment = passingTests.length > 0 ? 'Core structure executes; fix remaining edge cases.' : 'Compiles cleanly, but logic produces incorrect outputs.';
      } else if (hasRuntimeErr) {
        scoreRatio = Math.min(ratio, 0.3);
        citation = runtimeFailures[0]?.error || 'Runtime error encountered';
        comment = 'Runtime error interrupted execution on edge/test inputs.';
      }

      return {
        criterion: crit.name,
        score: Math.round(crit.weight * scoreRatio),
        maxScore: crit.weight,
        citation,
        comment,
      };
    });

    return {
      formativeFeedback: { wellDone, problem, why, improvement, nextStep },
      rubricBreakdown,
    };
  }
}
