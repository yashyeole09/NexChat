import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import type { Message } from '../../types';

interface Props {
  roomId: string;
}

function isSameGroup(a: Message, b: Message) {
  return (
    a.sender.id === b.sender.id &&
    Math.abs(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) < 60_000
  );
}

export default function MessageList({ roomId }: Props) {
  const { messages, isLoadingMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgs = messages[roomId] || [];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (msgs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="w-16 h-16 bg-dark-200 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">👋</span>
        </div>
        <p className="text-slate-300 font-medium">Start the conversation!</p>
        <p className="text-slate-600 text-sm mt-1">Be the first one to say hello</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
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
