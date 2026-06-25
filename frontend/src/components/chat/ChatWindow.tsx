import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { chatApi } from '../../api/chat';
import type { ChatRoom } from '../../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Loader2 } from 'lucide-react';

interface Props {
  roomId: string;
  onBack?: () => void;
}

export default function ChatWindow({ roomId, onBack }: Props) {
  const { fetchMessages } = useChatStore();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      chatApi.getRoom(roomId).then(setRoom),
      fetchMessages(roomId),
    ]).finally(() => setLoading(false));
  }, [roomId, fetchMessages]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-400">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!room) return null;

  return (
 <div className="h-full flex flex-col chat-bg">
      <ChatHeader room={room} onBack={onBack} />
      <MessageList roomId={roomId} />
      <TypingIndicator roomId={roomId} />
      <MessageInput roomId={roomId} />
    </div>
  );
}