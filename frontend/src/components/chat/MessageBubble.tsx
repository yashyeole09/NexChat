import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Reply, MoreHorizontal, Bot } from 'lucide-react';
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

export default function MessageBubble({ message, showAvatar = true }: Props) {
  const { user } = useAuthStore();
  const { updateMessage, deleteMessage: deleteMsgStore } = useChatStore();
  const isSelf = message.sender.id === user?.id;
  const isAI = message.type === 'AI_RESPONSE' || message.content.startsWith('🤖');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const updated = await chatApi.editMessage(message.id, editContent);
      updateMessage(updated);
      setEditing(false);
    } catch {
      toast.error('Failed to edit message');
    }
  };

  const handleDelete = async () => {
    try {
      await chatApi.deleteMessage(message.id);
      deleteMsgStore(message.roomId, message.id);
    } catch {
      toast.error('Failed to delete message');
    }
  };

  if (message.deleted) {
    return (
      <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-4 py-0.5`}>
        <span className="text-xs text-slate-600 italic px-3 py-1.5 bg-dark-200/50 rounded-full">
          Message deleted
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex items-end gap-2 px-4 py-0.5 group ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="w-8 flex-shrink-0">
        {showAvatar && !isSelf && (
          <Avatar user={message.sender} size="sm" />
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-xs lg:max-w-md ${isSelf ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        {!isSelf && showAvatar && (
          <span className="text-xs font-medium text-slate-400 px-1">
            {isAI ? '🤖 NexBot' : message.sender.displayName}
          </span>
        )}

        <div className="relative flex items-end gap-2">
          {/* Hover actions */}
          {!message.deleted && (
            <div className={`message-actions flex items-center gap-1 ${isSelf ? 'order-first' : 'order-last'}`}>
              <button className="p-1 rounded-lg bg-dark-200 hover:bg-dark-100 text-slate-400 hover:text-slate-200">
                <Reply className="w-3 h-3" />
              </button>
              {isSelf && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 rounded-lg bg-dark-200 hover:bg-dark-100 text-slate-400 hover:text-slate-200"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 rounded-lg bg-dark-200 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Bubble */}
          <div>
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEdit();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  className="input-field py-2 text-sm w-64"
                />
                <button onClick={handleEdit} className="btn-primary text-xs py-2 px-3">Save</button>
                <button onClick={() => setEditing(false)} className="btn-ghost text-xs py-2 px-3">Cancel</button>
              </div>
            ) : (
              <div
                className={`
                  ${isSelf ? 'message-bubble-self' : 'message-bubble-other'}
                  ${isAI ? 'border border-brand-500/30 bg-brand-600/10 text-slate-100' : ''}
                `}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            )}

            {/* Timestamp + edited */}
            <div className={`flex items-center gap-1 mt-0.5 ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-slate-600">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
              {message.edited && (
                <span className="text-xs text-slate-600 italic">· edited</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
