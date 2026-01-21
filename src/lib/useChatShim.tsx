"use client";
import { useState, useRef, useCallback } from 'react';

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string };

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('—');
  const [error, setError] = useState('');

  const append = useCallback((m: Message) => setMessages((s) => [...s, m]), []);

  const send = useCallback(
    async (opts: { message?: string }) => {
      const content = opts.message ?? input;
      if (!content) return;
      setLoading(true);
      const userMsg: Message = { id: String(Date.now()), role: 'user', content };
      append(userMsg);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: content, messages }),
        });

        if (!res.body) throw new Error('No stream');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        const id = String(Date.now() + 1);
        append({ id, role: 'assistant', content: '' });

        // read stream and parse header block (supports multiple header lines)
        let buffer = '';
        let headerParsed = false;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);

          if (!headerParsed) {
            buffer += chunk;
            const headerEnd = buffer.indexOf('\n\n');
            if (headerEnd !== -1) {
              const headerBlock = buffer.slice(0, headerEnd).trim();
              const rest = buffer.slice(headerEnd + 2);
              const headerLines = headerBlock.split(/\r?\n/).map((l) => l.trim());
              for (const line of headerLines) {
                if (line.startsWith('EMOTION:')) {
                  const label = line.split(':')[1] ?? '—';
                  setEmotion(label);
                }
                if (line.startsWith('ERROR:')) {
                  const msg = line.split(':').slice(1).join(':') || 'Unknown error';
                  setError(msg.trim());
                }
              }
              assistantContent += rest;
              setMessages((s) => s.map((m) => (m.id === id ? { ...m, content: assistantContent } : m)));
              headerParsed = true;
            }
            // if header not complete yet, continue reading
          } else {
            assistantContent += chunk;
            setMessages((s) => s.map((m) => (m.id === id ? { ...m, content: assistantContent } : m)));
          }
        }
      } catch (e) {
        const msg = String(e instanceof Error ? e.message : e);
        setError(msg);
        append({ id: String(Date.now() + 2), role: 'assistant', content: 'Error: ' + msg });
      } finally {
        setLoading(false);
        setInput('');
      }
    },
    [append, input, messages]
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    emotion,
    error,
    clearError: () => setError(''),
    send,
  };
}

export default useChat;
