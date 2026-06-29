import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, LogOut, Settings, Hash, Bot, Users, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import NewRoomModal from '../chat/NewRoomModal';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Props { onRoomSelect: (roomId: string) => void; }

export default function Sidebar({ onRoomSelect }: Props) {
  const { rooms, activeRoomId, isLoadingRooms, fetchRooms } = useChatStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showNewRoom, setShowNewRoom] = useState(false);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const filtered = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  return (
    <>
      <div className="sidebar-bg flex flex-col h-full" style={{width:'280px', flexShrink:0}}>

        {/* Logo + New button */}
        <div className="px-4 pt-4 pb-3" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                N
              </div>
              <span className="font-bold text-base text-white">
                Nex<span className="gradient-text">Chat</span>
              </span>
            </div>
            <button onClick={() => setShowNewRoom(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-80"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{color:'#374151'}} />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-slate-300 outline-none"
              style={{
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.06)',
                fontSize:'0.8125rem'
              }}
            />
          </div>
        </div>

        {/* AI Bot promo */}
        <div className="mx-3 mt-2.5 p-2.5 rounded-xl flex items-center gap-2.5"
          style={{background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.15)'}}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold" style={{color:'#a5b4fc'}}>NexBot AI</p>
            <p className="text-xs truncate" style={{color:'#374151'}}>Type @ai in any chat</p>
          </div>
        </div>

        {/* Rooms label */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{color:'#374151'}}>
            Conversations
          </span>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {isLoadingRooms ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <Hash className="w-6 h-6 mx-auto mb-2 opacity-20" style={{color:'#6366f1'}} />
              <p className="text-xs" style={{color:'#374151'}}>No conversations yet</p>
              <p className="text-xs mt-1" style={{color:'#1f2937'}}>Click + to start one</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map(room => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onRoomSelect(room.id)}
                  className={`sidebar-item mb-0.5 ${activeRoomId === room.id ? 'sidebar-item-active' : ''}`}
                >
                  {/* Avatar */}
                  {room.type === 'GROUP' ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white"
                      style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                      {room.name.slice(0,1).toUpperCase()}
                    </div>
                  ) : (
                    <Avatar user={room.members?.find(m => m.id !== user?.id)} size="md" showStatus />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-medium truncate" style={{color: activeRoomId === room.id ? '#a5b4fc' : '#e2e8f0'}}>
                        {room.name}
                      </span>
                      {room.lastMessage && (
                        <span className="text-xs flex-shrink-0" style={{color:'#374151', fontSize:'0.65rem'}}>
                          {formatDistanceToNow(new Date(room.lastMessage.createdAt), {addSuffix: false})}
                        </span>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-xs truncate mt-0.5" style={{color:'#374151'}}>
                        {room.lastMessage.deleted ? 'Message deleted' : room.lastMessage.content.replace('🤖 ', '')}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* User footer */}
        <div className="p-3 flex items-center gap-2.5"
          style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
          <Avatar user={user || undefined} size="sm" showStatus />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-slate-200">{user?.displayName}</p>
            <p className="text-xs truncate" style={{color:'#374151'}}>@{user?.username}</p>
          </div>
          <div className="flex gap-0.5">
            <button className="btn-ghost p-1.5"><Settings className="w-3.5 h-3.5" /></button>
            <button onClick={handleLogout} className="btn-ghost p-1.5 hover:text-red-400">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showNewRoom && <NewRoomModal onClose={() => setShowNewRoom(false)} />}
    </>
  );
}
