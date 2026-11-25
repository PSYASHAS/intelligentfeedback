import { NextRequest, NextResponse } from 'next/server';
import { IntelligentFeedbackEngine } from '@/lib/feedback-engine';
import { ASSESSMENT_CHALLENGES } from '@/lib/assessment-bank';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, challengeId, testResults, executionResults, telemetry } = body;

    const challenge = ASSESSMENT_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json({ error: 'Assessment challenge not found' }, { status: 404 });
    }

    const report = await IntelligentFeedbackEngine.analyzeSubmission({
      code: code || '',
      language: language || 'javascript',
      challenge,
      testResults: testResults || { passed: 0, failed: 0, total: 0, failures: [] },
      executionResults: Array.isArray(executionResults) ? executionResults : [],
      telemetry,
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Feedback engine error:', error);
    return NextResponse.json(
      { error: 'Failed to generate intelligent feedback report', details: error?.message },
      { status: 500 }
    );
  }
}
