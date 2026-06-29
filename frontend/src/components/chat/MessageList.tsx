import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import type { Message } from '../../types';
import { format, isToday, isYesterday } from 'date-fns';

interface Props { roomId: string; }

function isSameGroup(a: Message, b: Message) {
  return (
    a.sender.id === b.sender.id &&
    Math.abs(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) < 120_000
  );
}

function getDateLabel(date: string) {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
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
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-2xl"
          style={{background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.15)'}}>
          💬
        </div>
        <p className="text-slate-300 font-medium text-sm">Start the conversation</p>
        <p className="text-slate-600 text-xs mt-1">Say hello!</p>
      </div>
    );
  }

  let lastDate = '';

  return (
    <div className="messages-container">
      {msgs.map((msg, i) => {
        const prev = msgs[i - 1];
        const showAvatar = !prev || !isSameGroup(prev, msg);
        const msgDate = getDateLabel(msg.createdAt);
        const showDate = msgDate !== lastDate;
        if (showDate) lastDate = msgDate;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            showAvatar={showAvatar}
            showDate={showDate}
            prevDate={prev ? getDateLabel(prev.createdAt) : undefined}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
