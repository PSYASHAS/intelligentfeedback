import { NextRequest, NextResponse } from 'next/server';
import { SocraticDefenseAgent } from '@/lib/socratic-agent';
import { ASSESSMENT_CHALLENGES } from '@/lib/assessment-bank';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, challengeId, code, question, answer } = body;

    const challenge = ASSESSMENT_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    if (action === 'start') {
      const questions = SocraticDefenseAgent.generateQuestions(challenge, code || '');
      return NextResponse.json({ success: true, questions });
    }

    if (action === 'evaluate') {
      if (!question || !answer) {
        return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
      }
      const evaluation = SocraticDefenseAgent.evaluateAnswer(question, answer);
      return NextResponse.json({ success: true, evaluation });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Socratic defense error:', error);
    return NextResponse.json({ error: error?.message || 'Defense error' }, { status: 500 });
  }
}
