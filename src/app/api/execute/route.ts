import { NextRequest, NextResponse } from 'next/server';
import { ASSESSMENT_CHALLENGES } from '@/lib/assessment-bank';

function compileAndRunC(cCode: string, challengeId: string) {
  const js = cCode
    .replace(/#include\s*<.*?>/g, '')
    .replace(/\bint\s+findMax\s*\([^)]*\)/g, 'function findMax(numbers, size)')
    .replace(/\bint\s+countVowels\s*\([^)]*\)/g, 'function countVowels(text)')
    .replace(/\bint\s+sumEvenNumbers\s*\([^)]*\)/g, 'function sumEvenNumbers(arr, size)')
    .replace(/\bvoid\s+reverseArray\s*\([^)]*\)/g, 'function reverseArray(arr, size, result)')
    .replace(/tolower\s*\((.*?)\)/g, '($1.toLowerCase ? $1.toLowerCase() : String.fromCharCode($1).toLowerCase())')
    .replace(/\[i\]\s*!=\s*['"]\\0['"]/g, '.length > i')
    .replace(/text\[i\]\s*!=\s*['"]\\0['"]/g, 'i < text.length')
    .replace(/text\[i\]\s*!=\s*0/g, 'i < text.length')
    .replace(/strlen\s*\((.*?)\)/g, '$1.length')
    .replace(/\bint\s+/g, 'let ')
    .replace(/\bchar\s+/g, 'let ')
    .replace(/\bfloat\s+/g, 'let ')
    .replace(/\bdouble\s+/g, 'let ');

  const fnName = challengeId === 'find_max' ? 'findMax' :
                 challengeId === 'count_vowels' ? 'countVowels' :
                 challengeId === 'even_sum' ? 'sumEvenNumbers' : 'reverseArray';

  const sandbox = new Function(`${js}; return ${fnName};`);
  return sandbox();
}

export async function POST(req: NextRequest) {
  try {
    const { code, challengeId } = await req.json();

    const challenge = ASSESSMENT_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    let studentFn: any;
    try {
      studentFn = compileAndRunC(code, challenge.id);
    } catch (compileErr: any) {
      return NextResponse.json({
        results: challenge.testCases.map((tc) => ({
          id: tc.id,
          name: tc.name,
          passed: false,
          input: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: 'Compilation Error',
          error: compileErr.message,
        })),
        summary: { passed: 0, failed: challenge.testCases.length, total: challenge.testCases.length },
      });
    }

    const testResults: Array<{
      id: string;
      name: string;
      passed: boolean;
      input: string;
      expected: string;
      actual: string;
      error?: string;
    }> = [];

    let passedCount = 0;

    for (const tc of challenge.testCases) {
      let passed = false;
      let actual: any = '';

      try {
        if (challenge.id === 'find_max') {
          if (tc.id === 'tc-max-1') {
            actual = studentFn([3, 7, 2, 9], 4);
            passed = actual === 9;
          } else if (tc.id === 'tc-max-2') {
            actual = studentFn([-8, -3, -10], 3);
            passed = actual === -3;
          } else if (tc.id === 'tc-max-3') {
            actual = studentFn([-42], 1);
            passed = actual === -42;
          } else if (tc.id === 'tc-max-4') {
            actual = studentFn([-5, 0, 12, -2], 4);
            passed = actual === 12;
          }
        } else if (challenge.id === 'count_vowels') {
          if (tc.id === 'tc-vow-1') {
            actual = studentFn('hello');
            passed = actual === 2;
          } else if (tc.id === 'tc-vow-2') {
            actual = studentFn('Apple');
            passed = actual === 2;
          } else if (tc.id === 'tc-vow-3') {
            actual = studentFn('PROGRAMMING');
            passed = actual === 3;
          } else if (tc.id === 'tc-vow-4') {
            actual = studentFn('rhythm');
            passed = actual === 0;
          }
        } else if (challenge.id === 'even_sum') {
          if (tc.id === 'tc-sum-1') {
            actual = studentFn([2, 4, 6], 3);
            passed = actual === 12;
          } else if (tc.id === 'tc-sum-2') {
            actual = studentFn([8, 10], 2);
            passed = actual === 18;
          } else if (tc.id === 'tc-sum-3') {
            actual = studentFn([1, 2, 3, 4, 5], 5);
            passed = actual === 6;
          } else if (tc.id === 'tc-sum-4') {
            actual = studentFn([-2, 4, -6, 8], 4);
            passed = actual === 12;
          }
        } else if (challenge.id === 'reverse_list') {
          const resArr: number[] = [];
          if (tc.id === 'tc-rev-1') {
            studentFn([1, 2, 3, 4], 4, resArr);
            passed = JSON.stringify(resArr) === JSON.stringify([4, 3, 2, 1]);
            actual = `{${resArr.join(', ')}}`;
          } else if (tc.id === 'tc-rev-2') {
            studentFn([10, 20, 30], 3, resArr);
            passed = JSON.stringify(resArr) === JSON.stringify([30, 20, 10]);
            actual = `{${resArr.join(', ')}}`;
          } else if (tc.id === 'tc-rev-3') {
            studentFn([100], 1, resArr);
            passed = JSON.stringify(resArr) === JSON.stringify([100]);
            actual = `{${resArr.join(', ')}}`;
          } else if (tc.id === 'tc-rev-4') {
            studentFn([5, 99], 2, resArr);
            passed = JSON.stringify(resArr) === JSON.stringify([99, 5]);
            actual = `{${resArr.join(', ')}}`;
          }
        }

        if (passed) passedCount++;

        testResults.push({
          id: tc.id,
          name: tc.name,
          passed,
          input: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: typeof actual === 'object' ? JSON.stringify(actual) : String(actual),
        });
      } catch (err: any) {
        testResults.push({
          id: tc.id,
          name: tc.name,
          passed: false,
          input: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: 'Runtime Error',
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      results: testResults,
      summary: {
        passed: passedCount,
        failed: challenge.testCases.length - passedCount,
        total: challenge.testCases.length,
      },
    });
  } catch (error: any) {
    console.error('Execution handler error:', error);
    return NextResponse.json(
      { error: 'Failed to execute test cases', details: error?.message },
      { status: 500 }
    );
  }
}
