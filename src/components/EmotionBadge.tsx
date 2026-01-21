"use client";
import React from 'react';

export default function EmotionBadge({ emotion }: { emotion: string }) {
  return (
    <div className="px-3 py-1 border rounded-full text-sm bg-zinc-900 border-zinc-800">
      Emotion: {emotion}
    </div>
  );
}
