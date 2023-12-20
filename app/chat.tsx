'use client';

import { useRef, useState } from 'react';

import { z } from 'zod';

import { useJsonStream } from '@hackdance/hooks';
import { coreAgentSchema } from './agents/example/schema';

type Message = {
  content: string;
  list?: string[];
  role: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const lastMessages = useRef<Message[]>(messages);

  const { startStream, loading } = useJsonStream({
    onReceive: async (content: z.infer<typeof coreAgentSchema>) => {
      console.log(content);
      setMessages([
        ...lastMessages.current,
        {
          role: 'assistant',
          content: content?.content,
          list: content?.list,
        },
      ]);
    },
    onEnd: async (content) => {
      const response: z.infer<typeof coreAgentSchema> = content;
      lastMessages.current = [
        ...lastMessages.current,
        {
          role: 'assistant',
          content: response?.content,
          list: response?.list,
        },
      ];

      setMessages(lastMessages.current);
    },
    schema: coreAgentSchema,
  });

  const sendMessage = async () => {
    if (!prompt.length || loading) return;
    lastMessages.current = messages;

    lastMessages.current = [
      ...lastMessages.current,
      {
        role: 'user',
        content: prompt,
      },
    ];

    setPrompt('');

    setMessages(lastMessages.current);

    try {
      startStream({
        ctx: {
          prompt,
          messages: lastMessages.current,
        },
        url: '/api/chat',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPrompt(event.target.value ?? '');
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {loading && <p>loading...</p>}
      <ul className="space-y-4">
        {messages.map((message, index) => {
          return (
            <li key={index}>
              {message.content}

              {message?.list && (
                <>
                  {message.list.length} items:
                  <pre>{JSON.stringify(message.list, null, 2)}</pre>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <div>
        <input
          onKeyDown={handleKeyDown}
          value={prompt}
          onChange={handleInput}
        />
        <button onClick={sendMessage}>send</button>
      </div>
    </>
  );
}
