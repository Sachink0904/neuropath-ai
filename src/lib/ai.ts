import { Emotion } from './emotion';

export function getSystemPrompt() {
  return `You are NeuroPath AI, an emotion-adaptive tutor.
Your job is to first detect the student's emotional state, then teach using a style appropriate to that emotion.
You MUST follow these steps for every user message:
1) INTERNALLY determine the user's emotional state (CONFUSED, BORED, CONFIDENT, OVERWHELMED, or NEUTRAL) from wording, repetition, hesitation, and question complexity. DO NOT reveal internal reasoning to the user.
2) ADAPT your explanation style to that emotion (see examples below).
3) Produce a short, focused teaching response optimized for learning psychology.

Behavior examples (apply exactly):
- CONFUSED: very simple language; use analogies; step-by-step; reassuring tone; include 3 small steps max.
- BORED: concise and fast; energetic tone; include a 1-line summary and 1 challenge question.
- CONFIDENT: advanced explanation; include deeper theory and interview-level problems; concise tone.
- OVERWHELMED: calm tone; very short answers; focus on a single concept; include emotional support language.
- NEUTRAL: balanced explanation with 2 short examples.

Respond only with helpful teaching content. Never give unrelated or excessive information. If the user asks to stop, acknowledge briefly and offer to resume later.`;
}

type MockOpts = { system: string; user: string; emotion: Emotion };

export async function streamMockResponse(opts: MockOpts): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  const { emotion, user } = opts;

  // Simple mapping of styles
  const styles: Record<string, string> = {
    CONFUSED:
      "I sense you might be confused. Let's break this down step-by-step. First, think of it like an analogy...",
    BORED: 'Quick version: [concise explanation]. Try this challenge: ...',
    CONFIDENT:
      "Great — you're doing well. Here is a deeper dive with interview-style questions and theory...",
    OVERWHELMED: 'Take a breath. Short answer: ... We will focus on one small concept at a time.',
    NEUTRAL: 'Here is an explanation tailored to your question.',
  };

  const message = `${styles[emotion]}\n\nUser said: ${user}`;

  // Stream the message slowly to emulate streaming AI and prefix emotion token
  return new ReadableStream({
    async start(controller) {
      // send emotion header first so clients can update UI immediately
      controller.enqueue(encoder.encode(`EMOTION:${emotion}\n\n`));

      const chunkSize = 40;
      for (let i = 0; i < message.length; i += chunkSize) {
        const chunk = message.slice(i, i + chunkSize);
        controller.enqueue(encoder.encode(chunk));
        // small delay to simulate streaming
        await new Promise((r) => setTimeout(r, 60));
      }
      controller.close();
    },
  });
}

// Stream from Groq API if env is configured; otherwise fall back to mock.
export async function streamGroqResponse(opts: MockOpts): Promise<ReadableStream> {
  // Use Vercel AI SDK's `streamText` with `@ai-sdk/groq` model helper.
  // If `GROQ_API_KEY` is not set, fall back to the mock streamer.
  if (!process.env.GROQ_API_KEY) return streamMockResponse(opts);

  try {
    // dynamic imports to avoid hard TypeScript deps at build-time
    const ai = (await import('ai')) as any;
    const groqSdk = (await import('@ai-sdk/groq')) as any;

    const prompt = `${opts.system}\n\nUser: ${opts.user}`;

    // `streamText` should return a ReadableStream (SDK handles auth via env)
    const remoteStream: ReadableStream | undefined = await ai.streamText({
      model: groqSdk.groq('llama3-70b-8192'),
      input: prompt,
    });

    if (!remoteStream || typeof (remoteStream as any).getReader !== 'function') {
      return streamMockResponse(opts);
    }

    const reader = (remoteStream as any).getReader();
    const encoder = new TextEncoder();

    return new ReadableStream({
      async start(controller) {
        // send emotion header first so clients can react immediately
        controller.enqueue(encoder.encode(`EMOTION:${opts.emotion}\n\n`));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });
  } catch (err) {
    // any error -> return a stream that first signals an ERROR header and then falls
    // back to the mock streamer so the client can surface a user-facing banner.
    const encoder = new TextEncoder();
    const fallback = await streamMockResponse(opts);
    const reader = (fallback as any).getReader();

    return new ReadableStream({
      async start(controller) {
        const msg = String(err instanceof Error ? err.message : err);
        controller.enqueue(encoder.encode(`ERROR:${msg}\nEMOTION:NEUTRAL\n\n`));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });
  }
}
