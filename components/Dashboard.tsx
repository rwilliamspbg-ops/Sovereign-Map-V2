
import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  RefreshCcw,
  Sparkles,
  Globe,
  ShieldCheck,
  Coins,
  ChevronRight,
  BrainCircuit,
  Zap,
  Activity,
  Wifi,
  History,
  Target,
  Fingerprint
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeSpatialTrends } from '../services/geminiService';
import { AppRoute } from '../types';

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  // Real-time metrics
  const [metrics, setMetrics] = useState({ peers: 42891, throughput: 842.5, consensus: 98.4 });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    refreshInsight();
    const interval = setInterval(() => {
      setMetrics(prev => ({
        peers: prev.peers + (Math.random() > 0.5 ? 2 : -1),
        throughput: parseFloat((prev.throughput + (Math.random() - 0.5) * 5).toFixed(1)),
        consensus: parseFloat((98 + Math.random()).toFixed(1))
      }));
      
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        type: ['Handshake', 'Block Confirmed', 'Drift Corrected', 'Node Joined'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshInsight = async () => {
    setLoadingInsight(true);
    const result = await analyzeSpatialTrends([{id: 'node-local', status: 'active'}]);
    setAiInsight(result || "Uplink stable. Local spatial coherence verified.");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Command Deck</h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-600/10 px-3 py-1 rounded-lg border border-blue-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
               Mesh Active: Sector 7
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">Uptime: 42d 08h 12m</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={refreshInsight} disabled={loadingInsight} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-50">
            {loadingInsight ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
            Recalibrate
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Spatial Reach', value: metrics.peers.toLocaleString(), icon: <Layers size={18} />, delta: '+1.4k', c: 'blue' },
          { label: 'Throughput', value: `${metrics.throughput} GB/s`, icon: <Wifi size={18} />, delta: 'Steady', c: 'green' },
          { label: 'Consensus', value: `${metrics.consensus}%`, icon: <ShieldCheck size={18} />, delta: 'Optimal', c: 'indigo' },
          { label: 'Network Pool', value: '1.2M $SOV', icon: <Coins size={18} />, delta: '+8.2%', c: 'amber' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-6 rounded-[2rem] hud-border group hover:bg-slate-900/60 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-${s.c}-500/10 text-${s.c}-400 rounded-xl group-hover:scale-110 transition-transform`}>
                   {s.icon}
                </div>
                <span className={`text-[9px] font-black uppercase text-${s.c}-400 tracking-widest`}>{s.delta}</span>
             </div>
             <h3 className="text-2xl font-black text-white font-mono tracking-tighter mb-1">{s.value}</h3>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Intelligence HUD */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col gap-6 hud-border relative min-h-[400px]">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl">
                       <BrainCircuit size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white tracking-tight leading-none uppercase">Neural Synthesis</h3>
                       <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-1">Sector Analysis v4.2</p>
                    </div>
                 </div>
                 <Sparkles className="text-blue-500 animate-pulse" size={24} />
              </div>

              <div className="flex-1 bg-black/40 rounded-[2rem] p-6 border border-white/5 overflow-y-auto custom-scrollbar font-medium text-slate-300 leading-relaxed text-sm italic">
                {loadingInsight ? (
                   <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Decrypting Mesh Stream...</p>
                   </div>
                ) : aiInsight}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Link to="/identity" className="flex-1 py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-200 transition-all">
                   <Fingerprint size={18} /> Join Identity Hub
                </Link>
                <div className="flex-[0.6] p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Activity size={16} className="text-green-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Pulse</span>
                   </div>
                   <div className="flex gap-1 items-end h-5">
                      {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
                        <div key={i} className="w-1.5 bg-blue-500/40 rounded-t-sm" style={{ height: `${h * 100}%` }}></div>
                      ))}
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Tactical Feed Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="glass-panel flex-1 rounded-[2.5rem] p-8 flex flex-col hud-border">
              <div className="flex items-center gap-3 mb-8">
                 <History size={18} className="text-slate-500" />
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mesh History</h3>
              </div>
              <div className="space-y-4">
                 {events.map((ev, i) => (
                   <div key={ev.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-right-2" style={{ opacity: 1 - i * 0.15 }}>
                      <div className="flex items-center gap-3">
                         <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                            <Target size={12} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white uppercase">{ev.type}</p>
                            <p className="text-[8px] text-slate-500 font-mono">{ev.time}</p>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-700" />
                   </div>
                 ))}
                 {events.length === 0 && <p className="text-center py-10 text-[10px] text-slate-600 uppercase tracking-widest italic">Awaiting sync...</p>}
              </div>
              
              <div className="mt-auto pt-8 border-t border-white/5">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Yield Protocol</span>
                    <span className="text-[10px] font-black text-green-400">+12.4 $SOV/H</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4 animate-[pulse_1.5s_infinite]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
