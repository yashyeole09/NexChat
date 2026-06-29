import { Users, Phone, Video, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import type { ChatRoom } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';

interface Props {
  room: ChatRoom;
  onBack?: () => void;
}

export default function ChatHeader({ room, onBack }: Props) {
  const { user } = useAuthStore();

  const otherUser = room.type === 'DIRECT'
    ? room.members?.find(m => m.id !== user?.id) ?? undefined
    : undefined;

  const statusLabel = otherUser
    ? { ONLINE: 'Online', AWAY: 'Away', BUSY: 'Busy', OFFLINE: 'Offline' }[otherUser.status]
    : `${room.members?.length ?? 0} members`;

  const statusColor = otherUser
    ? { ONLINE: '#22c55e', AWAY: '#f59e0b', BUSY: '#ef4444', OFFLINE: '#475569' }[otherUser.status]
    : '#475569';

  return (
    <div className="flex items-center justify-between px-4 h-14 flex-shrink-0"
      style={{
        background: 'rgba(10,10,16,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>

      {/* Left */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-ghost md:hidden -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {room.type === 'DIRECT' ? (
          <Avatar user={otherUser} size="sm" showStatus />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            {room.name.slice(0,1).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="font-semibold text-slate-100 text-sm leading-tight">{room.name}</h2>
          <p className="text-xs leading-tight" style={{color: statusColor}}>{statusLabel}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5">
        <button className="btn-ghost hidden sm:flex"><Phone className="w-4 h-4" /></button>
        <button className="btn-ghost hidden sm:flex"><Video className="w-4 h-4" /></button>
        <button className="btn-ghost"><Search className="w-4 h-4" /></button>
        <button className="btn-ghost"><MoreVertical className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
