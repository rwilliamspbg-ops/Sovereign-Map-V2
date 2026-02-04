
import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ShieldAlert, 
  RefreshCcw,
  Sparkles,
  Globe,
  ShieldCheck,
  Lock,
  Coins,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeSpatialTrends } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';
import { AppRoute } from '../types';

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    refreshInsight();
  }, []);

  const refreshInsight = async () => {
    setLoadingInsight(true);
    const result = await analyzeSpatialTrends([{id: 'node-x', status: 'active'}]);
    setAiInsight(result || "Analysis complete. Mesh stable.");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">Command Dashboard</h2>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              Mesh Sustainability: 94% (Stable)
            </span>
            <span className="text-slate-800">•</span>
            <span className="text-xs">Uplink: Sector 7 Alpha-4 (Verified)</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/${AppRoute.GOVERNANCE}`}
            className="flex items-center gap-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-5 py-2.5 rounded-xl font-bold transition-all text-sm hover:bg-indigo-600 hover:text-white"
          >
            <Scale size={16} />
            Governance Active
          </Link>
          <button 
            onClick={refreshInsight}
            disabled={loadingInsight}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm"
          >
            <RefreshCcw size={16} className={loadingInsight ? 'animate-spin' : ''} />
            Recalibrate
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Mesh Reach', value: '42,891', icon: <Layers className="text-blue-400" size={20} />, delta: '+1.2k', sub: 'Spatial peers' },
          { label: 'Consensus', value: '98.4%', icon: <ShieldCheck className="text-green-400" size={20} />, delta: 'Stable', sub: 'Trust verified' },
          { label: 'Sustainability', value: '94.2%', icon: <Zap className="text-indigo-400" size={20} />, delta: 'Optimal', sub: 'Self-governed' },
          { label: 'Network Value', value: '1.2M $SOV', icon: <Coins className="text-amber-400" size={20} />, delta: '+42k', sub: 'Total pool' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 md:p-5 rounded-2xl group cursor-default hover:bg-slate-900/40 transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-800/50 rounded-lg text-white group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.delta === 'Optimal' ? 'text-indigo-400' : 'text-green-400'}`}>
                  {stat.delta}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{stat.value}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden flex flex-col h-[400px] lg:h-[500px] relative">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg border-white/5 bg-slate-950/40">
             <Globe size={14} className="text-blue-400 animate-pulse" />
             <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Neural Mesh Live Feed</span>
          </div>
          <div className="flex-1 relative bg-slate-950/20">
             <SpatialCanvas />
             <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-4">
                <div className="flex-1 glass-panel p-4 rounded-2xl border-white/5 shadow-2xl backdrop-blur-2xl">
                   <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Economic Status</p>
                        <h4 className="text-xs font-bold text-white">Sovereign Yield: High</h4>
                      </div>
                      <TrendingUp size={12} className="text-green-400" />
                   </div>
                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                      <div className="bg-indigo-500 h-full w-4/5"></div>
                   </div>
                   <p className="text-[9px] text-slate-400 leading-tight">Mesh is self-sustaining. Yields optimized via Neural Atlas layer.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden h-[400px] lg:h-[500px]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">Sustainability Audit</h3>
              <p className="text-[9px] font-black text-blue-500/80 uppercase tracking-widest mt-1">AI-Core Operational</p>
            </div>
          </div>
          <div className="flex-1 bg-slate-950/40 p-4 rounded-2xl border border-white/5 overflow-y-auto custom-scrollbar shadow-inner relative">
            <div className="text-[12px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
              {loadingInsight ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <Sparkles size={24} className="text-blue-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auditing Mesh Sustainability...</p>
                </div>
              ) : aiInsight}
            </div>
          </div>
          <Link 
            to={`/${AppRoute.ATLAS}`}
            className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-[11px] font-bold text-white">Semantic Atlas Layer</span>
            </div>
            <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
