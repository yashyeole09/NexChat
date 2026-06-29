import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Reply } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { Message } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import { chatApi } from '../../api/chat';
import { useChatStore } from '../../store/chatStore';
import toast from 'react-hot-toast';

interface Props {
  message: Message;
  showAvatar?: boolean;
  showDate?: boolean;
  prevDate?: string;
}

function formatTime(date: string) {
  return format(new Date(date), 'HH:mm');
}

function formatDate(date: string) {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

export default function MessageBubble({ message, showAvatar = true, showDate = false, prevDate }: Props) {
  const { user } = useAuthStore();
  const { updateMessage, deleteMessage: deleteMsgStore } = useChatStore();
  const isSelf = message.sender.id === user?.id;
  const isAI = message.content.startsWith('🤖');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const updated = await chatApi.editMessage(message.id, editContent);
      updateMessage(updated);
      setEditing(false);
    } catch { toast.error('Failed to edit'); }
  };

  const handleDelete = async () => {
    try {
      await chatApi.deleteMessage(message.id);
      deleteMsgStore(message.roomId, message.id);
    } catch { toast.error('Failed to delete'); }
  };

  if (message.deleted) {
    return (
      <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-2 py-0.5`}>
        <span className="text-xs text-slate-600 italic px-3 py-1.5 rounded-full" style={{background:'rgba(255,255,255,0.03)'}}>
          Message deleted
        </span>
      </div>
    );
  }

  const currentDate = formatDate(message.createdAt);
  const showDateSep = showDate || (prevDate && prevDate !== currentDate);

  return (
    <>
      {showDateSep && (
        <div className="time-separator my-3">
          <span>{currentDate}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12 }}
        className={`flex items-end gap-2 px-2 py-0.5 group ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar - only for others */}
        <div className="w-7 flex-shrink-0 mb-1">
          {!isSelf && showAvatar && (
            <Avatar user={message.sender} size="xs" />
          )}
        </div>

        <div className={`flex flex-col gap-0.5 ${isSelf ? 'items-end' : 'items-start'}`} style={{maxWidth: 'min(75%, 380px)'}}>
          {/* Sender name for groups */}
          {!isSelf && showAvatar && (
            <span className="text-xs font-medium px-1" style={{color: isAI ? '#818cf8' : '#94a3b8'}}>
              {isAI ? '🤖 NexBot' : message.sender.displayName}
            </span>
          )}

          <div className={`relative flex items-end gap-1.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Hover actions */}
            <div className={`message-actions flex items-center gap-0.5 mb-1`}>
              {isSelf && !message.deleted && (
                <>
                  <button onClick={() => setEditing(true)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 text-slate-500 hover:text-slate-300">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={handleDelete}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>

            {/* Bubble */}
            <div>
              {editing ? (
                <div className="flex gap-2 items-center">
                  <input autoFocus value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    onKeyDown={e => { if(e.key==='Enter') handleEdit(); if(e.key==='Escape') setEditing(false); }}
                    className="input-field py-2 text-sm w-52" />
                  <button onClick={handleEdit} className="btn-primary py-2 px-3 text-xs" style={{width:'auto'}}>Save</button>
                  <button onClick={() => setEditing(false)} className="btn-ghost text-xs py-2 px-2">✕</button>
                </div>
              ) : (
                <div className={isSelf ? 'message-bubble-self' : `message-bubble-other ${isAI ? 'border-indigo-500/20' : ''}`}
                  style={isAI ? {background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)'} : undefined}>
                  <p style={{whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{message.content}</p>
                </div>
              )}

              {/* Time */}
              <div className={`flex items-center gap-1 mt-0.5 px-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs" style={{color:'#374151', fontSize:'0.65rem'}}>
                  {formatTime(message.createdAt)}
                  {message.edited && <span className="ml-1 italic">· edited</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
