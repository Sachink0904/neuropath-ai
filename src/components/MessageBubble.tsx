import React from 'react';

export default function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] p-3 rounded-md ${isUser ? 'bg-zinc-800' : 'bg-zinc-700'}`}>
        <div className="whitespace-pre-wrap text-sm text-zinc-100">{content}</div>
      </div>
    </div>
  );
}
