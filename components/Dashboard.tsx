
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
  Fingerprint,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeSpatialTrends } from '../services/geminiService';
import { AppRoute } from '../types';

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("Initializing 2026 Sovereign Intelligence...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  // Real-time metrics
  const [metrics, setMetrics] = useState({ peers: 84291, throughput: 2842.5, consensus: 98.4, sovereignIndex: 82 });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    refreshInsight();
    const interval = setInterval(() => {
      setMetrics(prev => ({
        peers: prev.peers + (Math.random() > 0.5 ? 5 : -2),
        throughput: parseFloat((prev.throughput + (Math.random() - 0.5) * 15).toFixed(1)),
        consensus: parseFloat((98.2 + Math.random() * 0.4).toFixed(1)),
        sovereignIndex: Math.min(100, prev.sovereignIndex + (Math.random() > 0.7 ? 1 : 0))
      }));
      
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        type: ['Neural Handshake', 'World-ID Sync', 'Spatial Proof Confirmed', 'Drift Corrected', 'Node Bonded'][Math.floor(Math.random() * 5)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const refreshInsight = async () => {
    setLoadingInsight(true);
    const result = await analyzeSpatialTrends([{id: 'node-local', status: 'active'}]);
    setAiInsight(result || "Mesh v2.6.4 online. Global Spatial Constitution verified.");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Neural Command Deck</h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-600/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
               Sovereign Mesh: Global Grid 7
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">Uptime: 1.4y 12d 08h</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={refreshInsight} disabled={loadingInsight} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-50">
            {loadingInsight ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
            Synchronize Oracle
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Global Peers', value: metrics.peers.toLocaleString(), icon: <Layers size={18} />, delta: '+4.2k', c: 'blue' },
          { label: 'Edge Bandwidth', value: `${metrics.throughput} GB/s`, icon: <Wifi size={18} />, delta: 'High', c: 'green' },
          { label: 'Sovereign Index', value: `${metrics.sovereignIndex}%`, icon: <Scale size={18} />, delta: '+1.2%', c: 'indigo' },
          { label: 'Mesh Rewards', value: '4.8M $SOV', icon: <Coins size={18} />, delta: '+12.4%', c: 'amber' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-6 rounded-[2.5rem] hud-border group hover:bg-slate-900/60 transition-all border-white/10 shadow-2xl">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 bg-slate-900 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                   {s.icon}
                </div>
                <span className={`text-[9px] font-black uppercase text-blue-400 tracking-widest`}>{s.delta}</span>
             </div>
             <h3 className="text-2xl font-black text-white font-mono tracking-tighter mb-1">{s.value}</h3>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Intelligence HUD */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="glass-panel rounded-[3rem] p-10 flex flex-col gap-8 hud-border relative min-h-[450px] border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <Globe size={300} className="text-blue-500" />
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-600/10 text-blue-400 rounded-3xl border border-blue-500/20">
                       <BrainCircuit size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tight leading-none uppercase">Spatial Constitution</h3>
                       <p className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                          <Target size={12} /> Neural Synthesis Protocol v2.6.4
                       </p>
                    </div>
                 </div>
                 <Sparkles className="text-blue-500 animate-pulse" size={28} />
              </div>

              <div className="flex-1 bg-black/60 rounded-[2.5rem] p-8 border border-white/5 overflow-y-auto custom-scrollbar font-medium text-slate-300 leading-relaxed text-sm italic shadow-inner">
                {loadingInsight ? (
                   <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Consulting Edge-AI Nodes...</p>
                   </div>
                ) : (
                  <div className="animate-in fade-in duration-700">
                    <span className="text-blue-500 font-black mr-2">ORACLE_MSG:</span>
                    {aiInsight}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-5 relative z-10">
                <Link to="/identity" className="flex-1 py-5 bg-white text-slate-950 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-200 transition-all active:scale-95">
                   <Fingerprint size={20} /> Identity 2.0 (World-ID)
                </Link>
                <div className="flex-[0.6] p-5 bg-slate-900/60 rounded-[1.8rem] border border-white/10 flex items-center justify-between group cursor-pointer hover:border-blue-500/40 transition-all">
                   <div className="flex items-center gap-3">
                      <Activity size={18} className="text-green-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Sync</span>
                   </div>
                   <div className="flex gap-1.5 items-end h-6">
                      {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
                        <div key={i} className="w-2 bg-blue-500 rounded-t-sm group-hover:bg-blue-400 transition-colors" style={{ height: `${h * 100}%` }}></div>
                      ))}
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Tactical Feed Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="glass-panel flex-1 rounded-[3rem] p-8 flex flex-col hud-border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <History size={20} className="text-slate-500" />
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Global Event Log</h3>
              </div>
              <div className="space-y-4">
                 {events.map((ev, i) => (
                   <div key={ev.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-right-3 group hover:bg-white/10 transition-all" style={{ opacity: 1 - i * 0.15 }}>
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Target size={14} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{ev.type}</p>
                            <p className="text-[8px] text-slate-500 font-mono">{ev.time}</p>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-500" />
                   </div>
                 ))}
                 {events.length === 0 && (
                   <div className="py-20 flex flex-col items-center gap-4 opacity-20">
                      <Wifi size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Searching Mesh Signal...</p>
                   </div>
                 )}
              </div>
              
              <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Scale size={14} /> Global Compliance
                    </span>
                    <span className="text-[10px] font-black text-green-400">PASSED (v2.6)</span>
                 </div>
                 <div className="h-2 bg-slate-950 rounded-full overflow-hidden shadow-inner p-0.5">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 w-[94%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                 </div>
                 <p className="text-[8px] text-slate-600 uppercase font-black text-center tracking-[0.2em]">Sovereign Decentralization Complete</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
