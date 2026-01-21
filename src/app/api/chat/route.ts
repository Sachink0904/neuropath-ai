import { NextRequest } from 'next/server';
import { detectEmotion } from '@/lib/emotion';
import { getSystemPrompt, streamGroqResponse, streamMockResponse } from '@/lib/ai';

export const POST = async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const user = (body?.user || '') as string;
  const messages = (body?.messages || []) as Array<{ role: string; content: string }>;

  const emotion = detectEmotion(user || messages.map((m) => m.content).join('\n'));

  // Build system prompt
  const system = getSystemPrompt();

  // Try Groq streaming if configured, otherwise fallback to mock stream
  const stream = await streamGroqResponse({ system, user, emotion }).catch(() =>
    streamMockResponse({ system, user, emotion })
  );

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
};
