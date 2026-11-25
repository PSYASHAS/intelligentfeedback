/**
 * Lightweight, zero-dependency structured JSON LLM client.
 * Supports Google Gemini (GEMINI_API_KEY), OpenAI-compatible APIs (OPENAI_API_KEY),
 * and local Ollama instances (OLLAMA_URL). Returns null if no provider is configured
 * or if the remote call fails so callers can gracefully fall back to dynamic local analysis.
 */

export interface LLMJsonRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

function extractJsonObject<T>(raw: string): T | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Strip markdown code fences if present
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch?.[1]) {
      try {
        return JSON.parse(fenceMatch[1].trim()) as T;
      } catch {
        // continue
      }
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callGemini<T>(req: LLMJsonRequest): Promise<T | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: req.userPrompt }] }],
      generationConfig: {
        temperature: req.temperature ?? 0.3,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? extractJsonObject<T>(text) : null;
}

async function callOpenAICompatible<T>(req: LLMJsonRequest): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      model,
      temperature: req.temperature ?? 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: req.systemPrompt },
        { role: 'user', content: req.userPrompt },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  return text ? extractJsonObject<T>(text) : null;
}

async function callOllama<T>(req: LLMJsonRequest): Promise<T | null> {
  const ollamaUrl = process.env.OLLAMA_URL?.trim();
  if (!ollamaUrl) return null;

  const baseUrl = ollamaUrl.replace(/\/$/, '');
  const model = process.env.OLLAMA_MODEL?.trim() || 'llama3.1';

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      options: { temperature: req.temperature ?? 0.3 },
      messages: [
        { role: 'system', content: req.systemPrompt },
        { role: 'user', content: req.userPrompt },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text: string | undefined = data?.message?.content;
  return text ? extractJsonObject<T>(text) : null;
}

export async function generateStructuredJSON<T>(req: LLMJsonRequest): Promise<T | null> {
  try {
    if (process.env.GEMINI_API_KEY?.trim()) {
      const result = await callGemini<T>(req);
      if (result) return result;
    }
    if (process.env.OPENAI_API_KEY?.trim()) {
      const result = await callOpenAICompatible<T>(req);
      if (result) return result;
    }
    if (process.env.OLLAMA_URL?.trim()) {
      const result = await callOllama<T>(req);
      if (result) return result;
    }
  } catch (err) {
    console.warn('LLM structured generation failed, falling back to dynamic analysis:', err);
  }
  return null;
}
