import { Users, Phone, Video, Search, MoreVertical } from 'lucide-react';
import type { ChatRoom } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';

interface Props {
  room: ChatRoom;
}

export default function ChatHeader({ room }: Props) {
  const { user } = useAuthStore();

  const otherUser =
    room.type === 'DIRECT'
      ? room.members?.find((m) => m.id !== user?.id) ?? undefined
      : undefined;

  const statusLabel = otherUser
    ? { ONLINE: 'Online', AWAY: 'Away', BUSY: 'Busy', OFFLINE: 'Offline' }[otherUser.status]
    : `${room.members?.length ?? 0} members`;

  const statusColor = otherUser
    ? {
        ONLINE: 'text-emerald-400',
        AWAY: 'text-amber-400',
        BUSY: 'text-rose-400',
        OFFLINE: 'text-slate-500',
      }[otherUser.status]
    : 'text-slate-500';

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-dark-300/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {room.type === 'DIRECT' ? (
          <Avatar user={otherUser} size="md" showStatus />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h2 className="font-semibold text-slate-100 text-sm leading-tight">{room.name}</h2>
          <p className={`text-xs ${statusColor}`}>{statusLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="btn-ghost p-2 rounded-xl"><Phone className="w-4 h-4" /></button>
        <button className="btn-ghost p-2 rounded-xl"><Video className="w-4 h-4" /></button>
        <button className="btn-ghost p-2 rounded-xl"><Search className="w-4 h-4" /></button>
        <button className="btn-ghost p-2 rounded-xl"><MoreVertical className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
