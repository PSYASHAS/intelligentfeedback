import { NextRequest, NextResponse } from 'next/server';
import { ASSESSMENT_CHALLENGES } from '@/lib/assessment-bank';

export async function POST(req: NextRequest) {
  try {
    const { code, challengeId } = await req.json();

    const challenge = ASSESSMENT_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
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

    if (challenge.id === 'inverted-ai-sanitizer') {
      // Evaluate safeSanitize function
      for (const tc of challenge.testCases) {
        try {
          // Wrapped evaluation in sandbox
          const sandbox = new Function(`
            ${code}
            if (typeof safeSanitize !== 'function') {
              throw new Error("safeSanitize function is not defined or not exported");
            }
            return safeSanitize;
          `);
          const fn = sandbox();

          let passed = false;
          let actual = '';

          if (tc.id === 'tc-1') {
            actual = fn('Hello <script>alert(1)</script> World');
            passed = actual === 'Hello  World';
          } else if (tc.id === 'tc-2') {
            actual = fn('Safe <scr<script>ipt>evil()</script>text');
            passed = actual === 'Safe text';
          } else if (tc.id === 'tc-3') {
            actual = fn('<img src="avatar.png"   onerror = "malicious()" />');
            passed = !actual.toLowerCase().includes('onerror') && !actual.includes('malicious');
          } else if (tc.id === 'tc-4') {
            const start = Date.now();
            actual = fn('<script ' + 'a'.repeat(500));
            const elapsed = Date.now() - start;
            passed = elapsed < 50;
          }

          testResults.push({
            id: tc.id,
            name: tc.name,
            passed,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual: typeof actual === 'string' ? JSON.stringify(actual) : String(actual),
          });
        } catch (err: any) {
          testResults.push({
            id: tc.id,
            name: tc.name,
            passed: false,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual: 'Error',
            error: err.message,
          });
        }
      }
    } else if (challenge.id === 'algorithmic-lru-cache') {
      for (const tc of challenge.testCases) {
        try {
          const sandbox = new Function(`
            ${code}
            if (typeof LRUCache !== 'function') {
              throw new Error("LRUCache class is not defined");
            }
            return LRUCache;
          `);
          const LRUClass = sandbox();

          let passed = false;
          let actual = '';

          if (tc.id === 'tc-lru-1') {
            const cache = new LRUClass(2);
            cache.put(1, 1);
            cache.put(2, 2);
            const val = cache.get(1);
            actual = String(val);
            passed = val === 1;
          } else if (tc.id === 'tc-lru-2') {
            const cache = new LRUClass(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.put(3, 3); // evicts key 1
            const val = cache.get(1);
            actual = String(val);
            passed = val === -1;
          } else if (tc.id === 'tc-lru-3') {
            const cache = new LRUClass(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.get(1); // key 1 is now MRU, key 2 is LRU
            cache.put(3, 3); // evicts key 2
            const val2 = cache.get(2);
            const val1 = cache.get(1);
            actual = `get(2): ${val2}, get(1): ${val1}`;
            passed = val2 === -1 && val1 === 1;
          }

          testResults.push({
            id: tc.id,
            name: tc.name,
            passed,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual,
          });
        } catch (err: any) {
          testResults.push({
            id: tc.id,
            name: tc.name,
            passed: false,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual: 'Error',
            error: err.message,
          });
        }
      }
    } else {
      // Token bucket tests
      for (const tc of challenge.testCases) {
        try {
          const sandbox = new Function(`
            ${code}
            if (typeof TokenBucket !== 'function') {
              throw new Error("TokenBucket class is not defined");
            }
            return TokenBucket;
          `);
          const TBClass = sandbox();
          let passed = false;
          let actual = '';

          if (tc.id === 'tc-tb-1') {
            const tb = new TBClass(5, 1);
            const r1 = tb.allowRequest(5);
            const r2 = tb.allowRequest(1);
            passed = r1 === true && r2 === false;
            actual = `First request(5): ${r1}, Second request(1): ${r2}`;
          } else if (tc.id === 'tc-tb-2') {
            const tb = new TBClass(10, 2);
            tb.allowRequest(10, 1000); // drain all 10 tokens at time 1000
            const allowed = tb.allowRequest(4, 3000); // 2 seconds later -> +4 tokens
            passed = allowed === true;
            actual = `Allow 4 tokens after 2s: ${allowed}`;
          } else if (tc.id === 'tc-tb-3') {
            const tb = new TBClass(5, 1);
            tb.allowRequest(1, 10000);
            const res = tb.allowRequest(1, 5000); // clock jumped back
            passed = typeof res === 'boolean';
            actual = `Clock drift handled without crash: ${res}`;
          }

          testResults.push({
            id: tc.id,
            name: tc.name,
            passed,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual,
          });
        } catch (err: any) {
          testResults.push({
            id: tc.id,
            name: tc.name,
            passed: false,
            input: tc.inputDescription,
            expected: tc.expectedOutput,
            actual: 'Error',
            error: err.message,
          });
        }
      }
    }

    const passedCount = testResults.filter((r) => r.passed).length;

    return NextResponse.json({
      success: true,
      summary: {
        passed: passedCount,
        failed: testResults.length - passedCount,
        total: testResults.length,
        failures: testResults.filter((t) => !t.passed).map((t) => ({ testId: t.id, name: t.name, error: t.error })),
      },
      results: testResults,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Execution error' }, { status: 500 });
  }
}
