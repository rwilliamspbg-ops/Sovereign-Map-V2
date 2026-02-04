
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Fingerprint
} from 'lucide-react';

const SecurityView: React.FC = () => {
  const [threatLevel, setThreatLevel] = useState(12);
  const [isRotating, setIsRotating] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: Math.random() > 0.8 ? 'intrusion_blocked' : 'encryption_rotation',
        node: `NODE-${Math.floor(Math.random() * 999)}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'SUCCESS'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const rotateKeys = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
  };

  const getThreatColor = () => {
    if (threatLevel < 20) return 'text-blue-400';
    if (threatLevel < 50) return 'text-amber-400';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5">Security Perimeter</h2>
          <p className="text-slate-400 text-xs italic">Quantum-shielding active across mesh defense.</p>
        </div>
        <button 
          onClick={rotateKeys}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm active:scale-95"
        >
          <RefreshCw size={16} className={isRotating ? 'animate-spin' : ''} />
          Rotate Master Keys
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Gauge - Compact Column */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
          <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
              <circle
                cx="50%" cy="50%" r="42%"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 * (1 - threatLevel / 100)}
                className={`${getThreatColor()} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${getThreatColor()}`}>{threatLevel}%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Threat Index</span>
            </div>
          </div>
          <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 text-[10px] font-bold inline-flex items-center gap-1.5">
            <ShieldCheck size={12} /> Perimeter Secure
          </div>
        </div>

        {/* Tactical Controls - Grid Column */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Neural Crypto', desc: 'RSA-Q 8k Layer', icon: <Lock size={20} />, status: 'ACTIVE', color: 'text-purple-400' },
            { title: 'DID Handshake', desc: 'Sovereign Verified', icon: <Fingerprint size={20} />, status: 'SECURE', color: 'text-blue-400' },
            { title: 'AI Sentry', desc: 'Pattern Recognition', icon: <ShieldAlert size={20} />, status: 'WATCHING', color: 'text-amber-400' },
            { title: 'Trust Pool', desc: 'P2P Reputation', icon: <Zap size={20} />, status: 'SYNCED', color: 'text-green-400' },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:bg-slate-900/40 transition-all border-white/5">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-slate-900/60 rounded-xl ${item.color} shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
              <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs & Integrity Grid - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
        {/* Terminal Logs */}
        <div className="glass-panel bg-black/40 rounded-3xl p-6 font-mono overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Terminal size={12} className="text-blue-400" /> Tactical Log
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <div className="space-y-2 text-[10px] overflow-y-auto custom-scrollbar flex-1">
            {logs.map(log => (
              <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 items-center bg-white/5 p-1.5 rounded-lg">
                <span className="text-slate-600 font-bold shrink-0">{log.timestamp}</span>
                <span className={`font-black uppercase shrink-0 text-[8px] ${log.type === 'intrusion_blocked' ? 'text-red-400' : 'text-purple-400'}`}>
                  {log.type.replace('_', ' ')}
                </span>
                <span className="text-slate-400 truncate text-[9px]">{log.node}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spatial Integrity Grid */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2 text-white uppercase tracking-widest">
              <Activity className="text-blue-400" size={16} /> Mesh Integrity
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-10 gap-1 overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded shadow-inner ${
                  Math.random() > 0.96 ? 'bg-amber-400/80 animate-pulse' : 
                  Math.random() > 0.8 ? 'bg-blue-500/40' : 
                  'bg-white/5'
                }`}
              ></div>
            ))}
          </div>
          <div className="mt-4 p-3 glass-panel rounded-xl border-white/5 flex items-center gap-3">
             <AlertTriangle className="text-amber-400 shrink-0" size={18} />
             <div className="text-[9px] leading-tight text-slate-400">
                Drift detected in Sector 5. Automated resync active.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
