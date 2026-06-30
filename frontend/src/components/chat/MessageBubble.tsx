import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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
      <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-3 sm:px-4 py-0.5`}>
        <span className="text-xs italic px-3 py-1.5 rounded-full"
          style={{color:'#3f3f4d', background:'rgba(255,255,255,0.03)'}}>
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
      className={`flex items-end gap-2 px-3 sm:px-4 py-0.5 group ${
        isSelf ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className="w-6 sm:w-7 flex-shrink-0">
        {!isSelf && showAvatar && <Avatar user={message.sender} size="xs" />}
      </div>

      <div
        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} min-w-0`}
        style={{ maxWidth: '78%' }}
      >
        {!isSelf && showAvatar && (
          <span className="text-xs font-medium mb-1 px-1"
            style={{color: isAI ? '#a78bfa' : '#5c5c6e'}}>
            {isAI ? '🤖 NexBot' : (message.sender?.displayName || message.sender?.username)}
          </span>
        )}

        <div className={`flex items-end gap-1 ${isSelf ? 'flex-row-reverse' : 'flex-row'} min-w-0`}>
          {isSelf && !message.deleted && (
            <div className="message-actions flex gap-0.5 mb-1 flex-shrink-0">
              <button onClick={() => setEditing(true)}
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{color:'#4b4b5a', background:'rgba(255,255,255,0.04)'}}>
                <Pencil className="w-3 h-3" />
              </button>
              <button onClick={handleDelete}
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{color:'#4b4b5a', background:'rgba(255,255,255,0.04)'}}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="min-w-0">
            {editing ? (
              <div className="flex gap-2 items-center">
                <input autoFocus value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEdit();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  className="input-field py-2 text-sm" style={{ width: '180px' }} />
                <button onClick={handleEdit}
                  className="text-xs px-3 py-2 rounded-lg text-white flex-shrink-0"
                  style={{background:'#5b5bd6'}}>Save</button>
                <button onClick={() => setEditing(false)}
                  className="text-xs px-2 py-2 rounded-lg flex-shrink-0"
                  style={{color:'#5c5c6e'}}>✕</button>
              </div>
            ) : (
              <div style={{
                background: isSelf
                  ? '#5b5bd6'
                  : isAI
                  ? 'rgba(124,124,255,0.08)'
                  : 'rgba(255,255,255,0.045)',
                color: isSelf ? 'white' : '#dde2eb',
                borderRadius: isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '9px 13px',
                fontSize: '0.875rem',
                lineHeight: '1.55',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                border: isAI ? '1px solid rgba(124,124,255,0.15)'
                  : isSelf ? 'none'
                  : '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message.content}</p>
              </div>
            )}

            <div className={`flex mt-0.5 px-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <span style={{ fontSize: '0.65rem', color: '#3f3f4d' }}>
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