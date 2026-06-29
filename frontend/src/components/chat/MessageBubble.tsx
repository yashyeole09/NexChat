import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
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
}

function formatTime(date: string) {
  return format(new Date(date), 'HH:mm');
}

export default function MessageBubble({ message, showAvatar = true }: Props) {
  const { user } = useAuthStore();
  const { updateMessage, deleteMessage: deleteMsgStore } = useChatStore();
  const isSelf = message.sender?.id === user?.id;
  const isAI = message.content?.startsWith('🤖');
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
      <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-4 py-0.5`}>
        <span className="text-xs italic px-3 py-1.5 rounded-full"
          style={{color:'#374151', background:'rgba(255,255,255,0.03)'}}>
          Message deleted
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className={`flex items-end gap-2 px-4 py-0.5 group w-full ${
        isSelf ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar for others only */}
      <div className="w-7 flex-shrink-0">
        {!isSelf && showAvatar && (
          <Avatar user={message.sender} size="xs" />
        )}
      </div>

      {/* Bubble container */}
      <div
        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
        style={{maxWidth:'70%'}}
      >
        {/* Sender name for others */}
        {!isSelf && showAvatar && (
          <span className="text-xs font-medium mb-1 px-1"
            style={{color: isAI ? '#818cf8' : '#64748b'}}>
            {isAI ? '🤖 NexBot' : (message.sender?.displayName || message.sender?.username)}
          </span>
        )}

        {/* Hover actions + bubble row */}
        <div className={`flex items-end gap-1 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>

          {/* Edit/Delete - only for own messages */}
          {isSelf && !message.deleted && (
            <div className="message-actions flex gap-0.5 mb-1">
              <button
                onClick={() => setEditing(true)}
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{color:'#475569', background:'rgba(255,255,255,0.05)'}}>
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{color:'#475569', background:'rgba(255,255,255,0.05)'}}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Bubble */}
          <div>
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEdit();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  className="input-field py-2 text-sm"
                  style={{width:'200px'}}
                />
                <button
                  onClick={handleEdit}
                  className="text-xs px-3 py-2 rounded-lg text-white"
                  style={{background:'#6366f1'}}>
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs px-2 py-2 rounded-lg"
                  style={{color:'#64748b'}}>
                  ✕
                </button>
              </div>
            ) : (
              <div style={{
                background: isSelf
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : isAI
                  ? 'rgba(99,102,241,0.1)'
                  : 'rgba(255,255,255,0.06)',
                color: isSelf ? 'white' : '#e2e8f0',
                borderRadius: isSelf
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                wordBreak: 'break-word',
                border: isAI
                  ? '1px solid rgba(99,102,241,0.2)'
                  : isSelf
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isSelf
                  ? '0 2px 12px rgba(99,102,241,0.25)'
                  : 'none',
              }}>
                <p style={{whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0}}>
                  {message.content}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <div className={`flex mt-0.5 px-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <span style={{fontSize:'0.65rem', color:'#374151'}}>
                {formatTime(message.createdAt)}
                {message.edited && <span className="ml-1 italic">· edited</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}