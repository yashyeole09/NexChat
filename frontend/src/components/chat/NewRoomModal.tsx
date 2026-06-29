import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Search, Loader2, Hash } from 'lucide-react';
import { chatApi } from '../../api/chat';
import { userApi } from '../../api/user';
import { useChatStore } from '../../store/chatStore';
import type { User } from '../../types';
import Avatar from '../ui/Avatar';
import toast from 'react-hot-toast';

interface Props { onClose: () => void; }

export default function NewRoomModal({ onClose }: Props) {
  const [tab, setTab] = useState<'direct' | 'group'>('direct');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const { addRoom, setActiveRoom } = useChatStore();

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const users = await userApi.searchUsers(q);
      setResults(users);
    } finally {
      setSearching(false);
    }
  };

  const toggleUser = (user: User) => {
    setSelected((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreate = async () => {
    if (tab === 'direct') {
      if (!selected[0]) return toast.error('Select a user');
      setCreating(true);
      try {
        const room = await chatApi.getOrCreateDirectRoom(selected[0].id);
        addRoom(room);
        setActiveRoom(room.id);
        onClose();
      } catch { toast.error('Failed to create chat'); }
      finally { setCreating(false); }
    } else {
      if (!groupName.trim()) return toast.error('Enter a group name');
      if (selected.length === 0) return toast.error('Add at least one member');
      setCreating(true);
      try {
        const room = await chatApi.createRoom({
          name: groupName,
          memberIds: selected.map((u) => u.id),
        });
        addRoom(room);
        setActiveRoom(room.id);
        onClose();
      } catch { toast.error('Failed to create group'); }
      finally { setCreating(false); }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative glass-dark rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">New Conversation</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 pb-0">
          {(['direct', 'group'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {t === 'direct' ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Direct Message
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Group Chat
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Group name */}
          {tab === 'group' && (
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input-field"
            />
          )}

          {/* Selected users chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((u) => (
                <button
                  key={u.id}
                  onClick={() => toggleUser(u)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-600/20 border border-brand-500/30
                             text-brand-300 text-xs rounded-full hover:bg-rose-500/20 hover:border-rose-500/30
                             hover:text-rose-300 transition-colors"
                >
                  {u.displayName} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Results */}
          <div className="max-h-52 overflow-y-auto space-y-1">
            {searching ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              </div>
            ) : results.map((u) => {
              const isSelected = selected.some((s) => s.id === u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    if (tab === 'direct') setSelected([u]);
                    else toggleUser(u);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-brand-600/20 border border-brand-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Avatar user={u} size="sm" showStatus />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{u.displayName}</p>
                    <p className="text-xs text-slate-500">@{u.username}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={creating || selected.length === 0}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {creating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              tab === 'direct' ? 'Start Chat' : 'Create Group'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
