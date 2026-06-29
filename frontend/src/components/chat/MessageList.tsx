import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import type { Message } from '../../types';

interface Props { roomId: string; }

function isSameGroup(a: Message, b: Message) {
  return (
    a.sender.id === b.sender.id &&
    Math.abs(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) < 120_000
  );
}

export default function MessageList({ roomId }: Props) {
  const { messages, isLoadingMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgs = messages[roomId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (msgs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="text-3xl mb-3">💬</div>
        <p className="text-slate-400 font-medium text-sm">Start the conversation</p>
        <p className="text-xs mt-1" style={{color:'#374151'}}>Say hello!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4" style={{display:'flex', flexDirection:'column', gap:'2px'}}>
      {msgs.map((msg, i) => {
        const prev = msgs[i - 1];
        const showAvatar = !prev || !isSameGroup(prev, msg);
        return (
          <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}