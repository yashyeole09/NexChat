import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, MessageSquare, Users, LogOut,
  Settings, Hash, Bot, Loader2
} from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import NewRoomModal from '../chat/NewRoomModal';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface SidebarProps {
  onRoomSelect: (roomId: string) => void;
}

export default function Sidebar({ onRoomSelect }: SidebarProps) {
  const { rooms, activeRoomId, isLoadingRooms, fetchRooms } = useChatStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showNewRoom, setShowNewRoom] = useState(false);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  return (
    <>
      <div className="w-72 h-full flex flex-col sidebar-bg">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Nex<span className="gradient-text">Chat</span>
              </span>
            </div>
            <button
              onClick={() => setShowNewRoom(true)}
              className="w-8 h-8 bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-400 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm
                         text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>
        </div>

        {/* AI Bot promo */}
        <div className="mx-3 mt-3 p-3 bg-brand-600/10 border border-brand-500/20 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-300">NexBot AI</p>
            <p className="text-xs text-slate-500 truncate">Type @ai in any chat</p>
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs mt-1">Create one to get started</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onRoomSelect(room.id)}
                  className={`sidebar-item group ${
                    activeRoomId === room.id ? 'sidebar-item-active' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {room.type === 'GROUP' ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Avatar
                        user={room.members?.find((m) => m.id !== user?.id)}
                        size="md"
                        showStatus
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200 truncate">{room.name}</span>
                      {room.lastMessage && (
                        <span className="text-xs text-slate-600 flex-shrink-0 ml-1">
                          {formatDistanceToNow(new Date(room.lastMessage.createdAt), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {room.lastMessage.deleted
                          ? '[Message deleted]'
                          : room.lastMessage.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-white/5 flex items-center gap-2">
          <Avatar user={user || undefined} size="sm" showStatus />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.displayName}</p>
            <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
          </div>
          <div className="flex gap-1">
            <button className="btn-ghost p-1.5 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="btn-ghost p-1.5 rounded-lg hover:text-rose-400">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showNewRoom && <NewRoomModal onClose={() => setShowNewRoom(false)} />}
    </>
  );
}
