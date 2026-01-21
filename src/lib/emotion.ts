export type Emotion = 'CONFUSED' | 'BORED' | 'CONFIDENT' | 'OVERWHELMED' | 'NEUTRAL';

const keywords: Record<Emotion, string[]> = {
  CONFUSED: ['don\'t understand', "i'm lost", 'confused', 'what do you mean', 'how does', 'stuck'],
  BORED: ['bored', 'too easy', 'another', 'again', 'meh'],
  CONFIDENT: ['i got it', 'i understand', 'done', 'check my', 'correct'],
  OVERWHELMED: ['overwhelmed', 'too much', 'panic', 'anxious', 'stress', "can't"],
  NEUTRAL: [],
};

const hesitation = ['um', 'uh', 'hmm', 'hrrm', '...'];

export function detectEmotion(text: string): Emotion {
  if (!text) return 'NEUTRAL';
  const lower = text.toLowerCase();

  // repetition check
  const repeated = /(\b\w+\b)[\s\S]*\1/; // naive
  if (repeated.test(lower) && lower.split(' ').length < 12) {
    return 'CONFUSED';
  }

  for (const e of (Object.keys(keywords) as Emotion[])) {
    for (const k of keywords[e]) {
      if (lower.includes(k)) return e;
    }
  }

  for (const h of hesitation) if (lower.includes(h)) return 'CONFUSED';

  // Heuristic: lots of punctuation and short question => confused
  if ((lower.match(/\?/g) || []).length >= 2) return 'CONFUSED';

  return 'NEUTRAL';
}
