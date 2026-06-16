import { MessageSquare, Bot, Zap, Shield } from 'lucide-react';

export default function WelcomePanel() {
  const features = [
    { icon: Zap, title: 'Real-time Messaging', desc: 'Instant delivery via WebSockets' },
    { icon: Bot, title: 'AI Assistant', desc: 'Type @ai in any chat for help' },
    { icon: Shield, title: 'JWT Secured', desc: 'End-to-end authenticated sessions' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-dark-400 text-center px-8">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-600/40">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome to Nex<span className="gradient-text">Chat</span>
        </h2>
        <p className="text-slate-400 mb-10 max-w-sm">
          Select a conversation from the sidebar or create a new one to start chatting.
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-dark rounded-xl p-4 text-left">
              <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
