import { useState, useRef } from 'react';
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

      // Handle AI via direct REST call
      if (text.startsWith('@ai ') || text.startsWith('@nexbot ')) {
        const query = text.substring(text.indexOf(' ') + 1);
        try {
          const res = await api.post('/users/ai/ask', {
            message: query,
            context: ''
          });
          // Handle different response formats
          let aiText = '';
          const data = res.data as any;
          if (typeof data === 'string') {
            aiText = data;
          } else if (data && typeof data === 'object') {
            aiText = data.result || data.value || data.text || JSON.stringify(data);
          }

          if (aiText) {
            const aiMsg = await chatApi.sendMessage({
              content: '🤖 ' + aiText,
              roomId
            });
            addMessage(aiMsg);
          }
        } catch {
          toast.error('AI is unavailable right now');
        }
      }
    } catch {
      toast.error('Failed to send message');
      setContent(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const isAiMessage = content.startsWith('@ai ') || content.startsWith('@nexbot ');

  return (
    <div className="px-2 sm:px-4 pb-4 pt-2">
      {isAiMessage && (
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Bot className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs text-brand-400">NexBot AI will respond</span>
        </div>
      )}
      <div className={`flex items-end gap-2 bg-dark-200 rounded-2xl border transition-colors ${
        isAiMessage
          ? 'border-brand-500/40'
          : 'border-white/5 focus-within:border-white/15'
      }`}>
        <div className="flex items-center pl-3 pb-3">
          <button className="btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-slate-300">
            <Paperclip className="w-4 h-4" />
          </button>
        </div>
        <textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… or @ai to ask NexBot"
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 text-sm
                     resize-none focus:outline-none py-3 leading-relaxed max-h-32"
          style={{ height: '44px' }}
        />
        <div className="flex items-center gap-1 pr-2 pb-2.5">
          <button className="btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hidden sm:flex">
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
              content.trim()
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/30 active:scale-90'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-slate-700 mt-2 hidden sm:block">
        Enter to send · Shift+Enter for new line · @ai for AI assistant
      </p>
    </div>
  );
}