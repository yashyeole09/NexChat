import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';

export default function TypingIndicator({ roomId }: { roomId: string }) {
  const { typingUsers } = useChatStore();
  const { user } = useAuthStore();

  const typers = (typingUsers[roomId] || []).filter((u) => u !== user?.username);

  if (typers.length === 0) return null;

  const label =
    typers.length === 1
      ? `${typers[0]} is typing`
      : typers.length === 2
      ? `${typers[0]} and ${typers[1]} are typing`
      : 'Several people are typing';

  return (
    <div className="flex items-center gap-2 px-6 pb-1 h-6">
      <div className="flex gap-1 items-center">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
