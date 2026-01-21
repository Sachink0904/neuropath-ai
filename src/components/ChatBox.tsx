"use client";
import React from 'react';
import useChat from '@ai-sdk/react';
import MessageBubble from './MessageBubble';
import EmotionBadge from './EmotionBadge';

export default function ChatBox() {
  const { messages, input, setInput, isLoading, send, emotion, error, clearError } = useChat();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div />
        <EmotionBadge emotion={emotion ?? '—'} />
      </div>

      {error ? (
        <div className="bg-red-700 text-white px-3 py-2 rounded mb-3 flex items-center justify-between">
          <div className="text-sm">Error: {error}</div>
          <button onClick={clearError} className="text-sm underline">
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex-1 overflow-auto p-3 space-y-3" id="chat-scroll" ref={scrollRef}>
        {messages.map((m: any) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
      </div>

      <div className="mt-2 border-t border-zinc-800 pt-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send({ message: input });
              }
            }}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border border-zinc-800 rounded px-3 py-2 outline-none"
          />
          <button
            onClick={() => send({ message: input })}
            disabled={isLoading}
            className="px-4 py-2 bg-accent rounded disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
