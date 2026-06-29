import { MessageSquare, Bot, Zap, Shield, Plus } from 'lucide-react';

export default function WelcomePanel() {
  const features = [
    { icon: Zap, title: 'Real-time', desc: 'Instant messaging via WebSocket' },
    { icon: Bot, title: 'AI Built-in', desc: 'Type @ai in any chat' },
    { icon: Shield, title: 'Secure', desc: 'JWT authenticated sessions' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center chat-bg text-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{background:'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)'}} />
      </div>

      <div className="relative z-10">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 8px 30px rgba(99,102,241,0.35)'}}>
          N
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to Nex<span className="gradient-text">Chat</span>
        </h2>
        <p className="text-sm mb-8" style={{color:'#475569', maxWidth:'320px', margin:'0 auto 32px'}}>
          Select a conversation or create a new one to start chatting
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-3" style={{maxWidth:'360px', margin:'0 auto'}}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-3 rounded-xl text-left"
              style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                style={{background:'rgba(99,102,241,0.15)'}}>
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xs font-semibold text-slate-300">{title}</p>
              <p className="text-xs mt-0.5" style={{color:'#374151'}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
