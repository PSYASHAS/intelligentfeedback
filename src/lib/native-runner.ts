import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { AssessmentChallenge, ProgrammingLanguage, TestCaseExecutionResult } from './types';

const execFileAsync = promisify(execFile);

interface NativeTestSpec {
  id: string;
  name: string;
  input: string;
  expected: string;
}

const TEST_SPECS: Record<string, NativeTestSpec[]> = {
  find_max: [
    { id: 'tc-max-1', name: 'Standard Positive Array', input: '{3, 7, 2, 9}, size = 4', expected: '9' },
    { id: 'tc-max-2', name: 'All Negative Array', input: '{-8, -3, -10}, size = 3', expected: '-3' },
    { id: 'tc-max-3', name: 'Single Negative Element', input: '{-42}, size = 1', expected: '-42' },
    { id: 'tc-max-4', name: 'Mixed Zero & Negatives', input: '{-5, 0, 12, -2}, size = 4', expected: '12' },
  ],
  count_vowels: [
    { id: 'tc-vow-1', name: 'All Lowercase', input: '"hello"', expected: '2' },
    { id: 'tc-vow-2', name: 'Leading Uppercase', input: '"Apple"', expected: '2' },
    { id: 'tc-vow-3', name: 'All Uppercase', input: '"PROGRAMMING"', expected: '3' },
    { id: 'tc-vow-4', name: 'Zero Vowels', input: '"rhythm"', expected: '0' },
  ],
  even_sum: [
    { id: 'tc-sum-1', name: 'All Even Numbers', input: '{2, 4, 6}, size = 3', expected: '12' },
    { id: 'tc-sum-2', name: 'First Element Crucial', input: '{8, 10}, size = 2', expected: '18' },
    { id: 'tc-sum-3', name: 'Mixed Odd & Even', input: '{1, 2, 3, 4, 5}, size = 5', expected: '6' },
    { id: 'tc-sum-4', name: 'Negative & Positive Evens', input: '{-2, 4, -6, 8}, size = 4', expected: '12' },
  ],
  reverse_list: [
    { id: 'tc-rev-1', name: 'Standard Even Length', input: '{1, 2, 3, 4}, size = 4', expected: '{4, 3, 2, 1}' },
    { id: 'tc-rev-2', name: 'Odd Length Array', input: '{10, 20, 30}, size = 3', expected: '{30, 20, 10}' },
    { id: 'tc-rev-3', name: 'Single Element', input: '{100}, size = 1', expected: '{100}' },
    { id: 'tc-rev-4', name: 'Two Elements', input: '{5, 99}, size = 2', expected: '{99, 5}' },
  ],
};

function cleanCompilerOutput(raw: string, tempDir: string): string {
  return raw
    .replaceAll(tempDir + path.sep, '')
    .replaceAll(tempDir + '/', '')
    .replaceAll(tempDir, '')
    .trim();
}

function makeAllFailed(
  challenge: AssessmentChallenge,
  actual: string,
  error: string
): TestCaseExecutionResult[] {
  return challenge.testCases.map((tc) => ({
    id: tc.id,
    name: tc.name,
    passed: false,
    input: tc.inputDescription,
    expected: tc.expectedOutput,
    actual,
    error,
  }));
}

function buildCRunner(code: string, challengeId: string): string {
  const needsStdio = !/#include\s*<stdio\.h>/.test(code);
  const header = needsStdio ? '#include <stdio.h>\n' : '';
  const bodyPrefix = `${code}\n`;

  let mainBody = '';
  if (challengeId === 'find_max') {
    mainBody = `
  int a1[] = {3, 7, 2, 9};
  int a2[] = {-8, -3, -10};
  int a3[] = {-42};
  int a4[] = {-5, 0, 12, -2};
  printf("%d\\n", findMax(a1, 4));
  printf("%d\\n", findMax(a2, 3));
  printf("%d\\n", findMax(a3, 1));
  printf("%d\\n", findMax(a4, 4));`;
  } else if (challengeId === 'count_vowels') {
    mainBody = `
  char s1[] = "hello";
  char s2[] = "Apple";
  char s3[] = "PROGRAMMING";
  char s4[] = "rhythm";
  printf("%d\\n", countVowels(s1));
  printf("%d\\n", countVowels(s2));
  printf("%d\\n", countVowels(s3));
  printf("%d\\n", countVowels(s4));`;
  } else if (challengeId === 'even_sum') {
    mainBody = `
  int a1[] = {2, 4, 6};
  int a2[] = {8, 10};
  int a3[] = {1, 2, 3, 4, 5};
  int a4[] = {-2, 4, -6, 8};
  printf("%d\\n", sumEvenNumbers(a1, 3));
  printf("%d\\n", sumEvenNumbers(a2, 2));
  printf("%d\\n", sumEvenNumbers(a3, 5));
  printf("%d\\n", sumEvenNumbers(a4, 4));`;
  } else if (challengeId === 'reverse_list') {
    mainBody = `
  int a1[] = {1, 2, 3, 4}, r1[4] = {0};
  int a2[] = {10, 20, 30}, r2[3] = {0};
  int a3[] = {100}, r3[1] = {0};
  int a4[] = {5, 99}, r4[2] = {0};
  reverseArray(a1, 4, r1);
  printf("{%d, %d, %d, %d}\\n", r1[0], r1[1], r1[2], r1[3]);
  reverseArray(a2, 3, r2);
  printf("{%d, %d, %d}\\n", r2[0], r2[1], r2[2]);
  reverseArray(a3, 1, r3);
  printf("{%d}\\n", r3[0]);
  reverseArray(a4, 2, r4);
  printf("{%d, %d}\\n", r4[0], r4[1]);`;
  }

  // Put user code first so compiler line numbers match editor line numbers
  return `${bodyPrefix}\n${header}int main(void) {\n${mainBody}\n  return 0;\n}\n`;
}

function buildCppRunner(code: string, challengeId: string): string {
  const needsIostream = !/#include\s*<iostream>/.test(code);
  const needsVector = !/#include\s*<vector>/.test(code);
  const needsString = !/#include\s*<string>/.test(code);
  const extraIncludes = [
    needsIostream ? '#include <iostream>' : '',
    needsVector ? '#include <vector>' : '',
    needsString ? '#include <string>' : '',
  ]
    .filter(Boolean)
    .join('\n');

  let mainBody = '';
  if (challengeId === 'find_max') {
    mainBody = `
  std::cout << findMax({3, 7, 2, 9}, 4) << "\\n";
  std::cout << findMax({-8, -3, -10}, 3) << "\\n";
  std::cout << findMax({-42}, 1) << "\\n";
  std::cout << findMax({-5, 0, 12, -2}, 4) << "\\n";`;
  } else if (challengeId === 'count_vowels') {
    mainBody = `
  std::cout << countVowels("hello") << "\\n";
  std::cout << countVowels("Apple") << "\\n";
  std::cout << countVowels("PROGRAMMING") << "\\n";
  std::cout << countVowels("rhythm") << "\\n";`;
  } else if (challengeId === 'even_sum') {
    mainBody = `
  std::cout << sumEvenNumbers({2, 4, 6}, 3) << "\\n";
  std::cout << sumEvenNumbers({8, 10}, 2) << "\\n";
  std::cout << sumEvenNumbers({1, 2, 3, 4, 5}, 5) << "\\n";
  std::cout << sumEvenNumbers({-2, 4, -6, 8}, 4) << "\\n";`;
  } else if (challengeId === 'reverse_list') {
    mainBody = `
  std::vector<int> r1(4, 0), r2(3, 0), r3(1, 0), r4(2, 0);
  reverseArray({1, 2, 3, 4}, 4, r1);
  std::cout << "{" << r1[0] << ", " << r1[1] << ", " << r1[2] << ", " << r1[3] << "}\\n";
  reverseArray({10, 20, 30}, 3, r2);
  std::cout << "{" << r2[0] << ", " << r2[1] << ", " << r2[2] << "}\\n";
  reverseArray({100}, 1, r3);
  std::cout << "{" << r3[0] << "}\\n";
  reverseArray({5, 99}, 2, r4);
  std::cout << "{" << r4[0] << ", " << r4[1] << "}\\n";`;
  }

  return `${code}\n${extraIncludes}\nint main() {\n${mainBody}\n  return 0;\n}\n`;
}

function buildPythonRunner(code: string, challengeId: string): string {
  const fnCandidates: Record<string, string[]> = {
    find_max: ['find_max', 'findMax'],
    count_vowels: ['count_vowels', 'countVowels'],
    even_sum: ['sum_even_numbers', 'sumEvenNumbers'],
    reverse_list: ['reverse_array', 'reverseArray'],
  };
  const candidates = fnCandidates[challengeId] || ['solution'];

  let testBlock = '';
  if (challengeId === 'find_max') {
    testBlock = `
print(__fn([3, 7, 2, 9], 4))
print(__fn([-8, -3, -10], 3))
print(__fn([-42], 1))
print(__fn([-5, 0, 12, -2], 4))`;
  } else if (challengeId === 'count_vowels') {
    testBlock = `
print(__fn("hello"))
print(__fn("Apple"))
print(__fn("PROGRAMMING"))
print(__fn("rhythm"))`;
  } else if (challengeId === 'even_sum') {
    testBlock = `
print(__fn([2, 4, 6], 3))
print(__fn([8, 10], 2))
print(__fn([1, 2, 3, 4, 5], 5))
print(__fn([-2, 4, -6, 8], 4))`;
  } else if (challengeId === 'reverse_list') {
    testBlock = `
for __arr in ([1, 2, 3, 4], [10, 20, 30], [100], [5, 99]):
    __res = [0] * len(__arr)
    __fn(__arr, len(__arr), __res)
    print("{" + ", ".join(str(x) for x in __res) + "}")`;
  }

  return `${code}

__fn = None
for __name in ${JSON.stringify(candidates)}:
    if __name in globals() and callable(globals()[__name]):
        __fn = globals()[__name]
        break
if __fn is None:
    raise NameError("Expected function (${candidates.join(' or ')}) is not defined")
${testBlock}
`;
}

function buildJavaMain(challengeId: string): string {
  let body = '';
  if (challengeId === 'find_max') {
    body = `
    System.out.println(Solution.findMax(new int[]{3, 7, 2, 9}, 4));
    System.out.println(Solution.findMax(new int[]{-8, -3, -10}, 3));
    System.out.println(Solution.findMax(new int[]{-42}, 1));
    System.out.println(Solution.findMax(new int[]{-5, 0, 12, -2}, 4));`;
  } else if (challengeId === 'count_vowels') {
    body = `
    System.out.println(Solution.countVowels("hello"));
    System.out.println(Solution.countVowels("Apple"));
    System.out.println(Solution.countVowels("PROGRAMMING"));
    System.out.println(Solution.countVowels("rhythm"));`;
  } else if (challengeId === 'even_sum') {
    body = `
    System.out.println(Solution.sumEvenNumbers(new int[]{2, 4, 6}, 3));
    System.out.println(Solution.sumEvenNumbers(new int[]{8, 10}, 2));
    System.out.println(Solution.sumEvenNumbers(new int[]{1, 2, 3, 4, 5}, 5));
    System.out.println(Solution.sumEvenNumbers(new int[]{-2, 4, -6, 8}, 4));`;
  } else if (challengeId === 'reverse_list') {
    body = `
    int[][] inputs = { {1, 2, 3, 4}, {10, 20, 30}, {100}, {5, 99} };
    for (int[] arr : inputs) {
      int[] res = new int[arr.length];
      Solution.reverseArray(arr, arr.length, res);
      StringBuilder sb = new StringBuilder("{");
      for (int i = 0; i < res.length; i++) {
        if (i > 0) sb.append(", ");
        sb.append(res[i]);
      }
      sb.append("}");
      System.out.println(sb.toString());
    }`;
  }
  return `public class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}\n`;
}

function mapStdoutToResults(
  challengeId: string,
  stdout: string
): TestCaseExecutionResult[] | null {
  const specs = TEST_SPECS[challengeId];
  if (!specs) return null;

  const lines = stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < specs.length) return null;

  const actualLines = lines.slice(lines.length - specs.length);
  return specs.map((spec, idx) => {
    const actual = actualLines[idx];
    return {
      id: spec.id,
      name: spec.name,
      passed: actual === spec.expected,
      input: spec.input,
      expected: spec.expected,
      actual,
    };
  });
}

async function execSafe(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<{ stdout: string; stderr: string; exitCode: number | string; notFound?: boolean }> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024,
    });
    return { stdout: stdout || '', stderr: stderr || '', exitCode: 0 };
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return { stdout: '', stderr: '', exitCode: 'ENOENT', notFound: true };
    }
    if (err?.killed || err?.signal === 'SIGTERM') {
      return {
        stdout: err?.stdout || '',
        stderr: `Execution timed out after ${timeoutMs}ms (possible infinite loop).`,
        exitCode: 'TIMEOUT',
      };
    }
    return {
      stdout: err?.stdout || '',
      stderr: err?.stderr || err?.message || 'Execution failed',
      exitCode: err?.code ?? 1,
    };
  }
}

/**
 * Runs student code using a genuine local compiler/runtime (gcc, g++, python, javac/java)
 * when available. Returns null if the language isn't natively configured or the compiler binary
 * is missing (allowing the caller to fall back to the JS/TS runner).
 */
export async function tryRunNativeTests(
  code: string,
  language: ProgrammingLanguage,
  challenge: AssessmentChallenge
): Promise<TestCaseExecutionResult[] | null> {
  if (!['c', 'cpp', 'python', 'java'].includes(language)) {
    return null;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ifb-run-'));
  const exeName = process.platform === 'win32' ? 'runner.exe' : 'runner';

  try {
    if (language === 'c' || language === 'cpp') {
      const compiler = language === 'c' ? 'gcc' : 'g++';
      const srcName = language === 'c' ? 'solution.c' : 'solution.cpp';
      const stdFlag = language === 'c' ? '-std=c11' : '-std=c++17';
      const srcPath = path.join(tempDir, srcName);
      const exePath = path.join(tempDir, exeName);
      const source =
        language === 'c'
          ? buildCRunner(code, challenge.id)
          : buildCppRunner(code, challenge.id);

      await fs.writeFile(srcPath, source, 'utf8');
      const compile = await execSafe(compiler, [stdFlag, srcPath, '-o', exePath], tempDir, 8000);
      if (compile.notFound) return null;

      if (compile.exitCode !== 0) {
        const msg = cleanCompilerOutput(compile.stderr || compile.stdout, tempDir) || 'Compilation failed';
        return makeAllFailed(challenge, 'Compilation Error', msg);
      }

      const run = await execSafe(exePath, [], tempDir, 1500);
      if (run.exitCode !== 0) {
        const msg = cleanCompilerOutput(run.stderr || run.stdout, tempDir) || 'Runtime Error';
        return makeAllFailed(challenge, 'Runtime Error', msg);
      }

      return mapStdoutToResults(challenge.id, run.stdout) ||
        makeAllFailed(challenge, 'Runtime Error', 'Unexpected output format from executable.');
    }

    if (language === 'python') {
      const scriptPath = path.join(tempDir, 'solution.py');
      await fs.writeFile(scriptPath, buildPythonRunner(code, challenge.id), 'utf8');

      let run = await execSafe('python', [scriptPath], tempDir, 2000);
      if (run.notFound) {
        run = await execSafe('python3', [scriptPath], tempDir, 2000);
      }
      if (run.notFound) return null;

      if (run.exitCode !== 0) {
        const errOut = cleanCompilerOutput(run.stderr || run.stdout, tempDir) || 'Python Error';
        const isSyntax = /SyntaxError|IndentationError|TabError/.test(errOut);
        return makeAllFailed(challenge, isSyntax ? 'Compilation Error' : 'Runtime Error', errOut);
      }

      return mapStdoutToResults(challenge.id, run.stdout) ||
        makeAllFailed(challenge, 'Runtime Error', 'Unexpected output from Python runner.');
    }

    if (language === 'java') {
      const solPath = path.join(tempDir, 'Solution.java');
      const mainPath = path.join(tempDir, 'Main.java');
      await fs.writeFile(solPath, code, 'utf8');
      await fs.writeFile(mainPath, buildJavaMain(challenge.id), 'utf8');

      const compile = await execSafe('javac', [solPath, mainPath], tempDir, 10000);
      if (compile.notFound) return null;

      if (compile.exitCode !== 0) {
        const msg = cleanCompilerOutput(compile.stderr || compile.stdout, tempDir) || 'Java compilation failed';
        return makeAllFailed(challenge, 'Compilation Error', msg);
      }

      const run = await execSafe('java', ['-cp', tempDir, 'Main'], tempDir, 2500);
      if (run.exitCode !== 0) {
        const msg = cleanCompilerOutput(run.stderr || run.stdout, tempDir) || 'Java runtime error';
        return makeAllFailed(challenge, 'Runtime Error', msg);
      }

      return mapStdoutToResults(challenge.id, run.stdout) ||
        makeAllFailed(challenge, 'Runtime Error', 'Unexpected output from Java runner.');
    }

    return null;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
