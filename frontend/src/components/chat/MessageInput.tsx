import { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Smile, Bot } from 'lucide-react';
import { chatApi } from '../../api/chat';
import { useChatStore } from '../../store/chatStore';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Props { roomId: string; }

export default function MessageInput({ roomId }: Props) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const { addMessage } = useChatStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const text = content.trim();
    if (!text || sending) return;
    setSending(true);
    setContent('');

    try {
      const msg = await chatApi.sendMessage({ content: text, roomId });
      addMessage(msg);

      if (text.startsWith('@ai ') || text.startsWith('@nexbot ')) {
        const query = text.substring(text.indexOf(' ') + 1);
        try {
          const res = await api.post<string>('/users/ai/ask', { message: query, context: '' });
          const aiText = typeof res.data === 'string' ? res.data : String(res.data);
          if (aiText && aiText !== 'undefined') {
            const aiMsg = await chatApi.sendMessage({ content: '🤖 ' + aiText, roomId });
            addMessage(aiMsg);
          }
        } catch { toast.error('AI unavailable'); }
      }
    } catch {
      toast.error('Failed to send');
      setContent(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const isAI = content.startsWith('@ai ') || content.startsWith('@nexbot ');

  return (
    <div className="px-3 pb-4 pt-1" style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
      {isAI && (
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Bot className="w-3 h-3 text-indigo-400" />
          <span className="text-xs text-indigo-400">NexBot AI will respond</span>
        </div>
      )}

      <div className={`input-bar flex items-end gap-2 px-3 py-2 ${isAI ? 'border-indigo-500/30' : ''}`}>
        <textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message... or @ai to ask NexBot"
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 text-sm
                     resize-none focus:outline-none py-1.5 leading-relaxed"
          style={{ maxHeight: '120px', minHeight: '36px' }}
        />
        <div className="flex items-center gap-1.5 pb-1">
          <button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className="send-btn"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-center mt-1.5 hidden sm:block"
        style={{fontSize:'0.6rem', color:'#1f2937'}}>
        Enter to send · Shift+Enter for new line · @ai for AI
      </p>
    </div>
  );
}
