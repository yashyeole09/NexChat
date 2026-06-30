import { useState, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
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
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  const isAI = content.startsWith('@ai ') || content.startsWith('@nexbot ');

  return (
    <div className="px-2 sm:px-3 pb-3 sm:pb-4 pt-1" style={{borderTop:'1px solid rgba(255,255,255,0.03)'}}>
      {isAI && (
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Bot className="w-3 h-3" style={{color:'#a78bfa'}} />
          <span className="text-xs" style={{color:'#a78bfa'}}>NexBot will respond</span>
        </div>
      )}

      <div className={`input-bar flex items-end gap-2 px-3 py-2`}>
        <textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message... or @ai to ask"
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 text-sm resize-none focus:outline-none py-1.5 leading-relaxed min-w-0"
          style={{ maxHeight: '100px', minHeight: '34px' }}
        />
        <button onClick={handleSend} disabled={!content.trim() || sending} className="send-btn">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}