
import React, { useState, useEffect } from 'react';
import { 
  Vote, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  Activity, 
  Loader2,
  RefreshCcw,
  Scale
} from 'lucide-react';
import { generateGovernanceProposals } from '../services/geminiService';

const GovernanceCore: React.FC = () => {
  const [proposalsText, setProposalsText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(94);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    const result = await generateGovernanceProposals(health);
    setProposalsText(result || "");
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Governance Core</h2>
          <p className="text-slate-400 max-w-2xl text-sm">
            Autonomous Network Orchestration (ANO) automatically generates mesh optimization protocols. Operators vote to finalize deployment.
          </p>
        </div>
        <button 
          onClick={fetchProposals}
          disabled={loading}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-900/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />}
          Recalculate Proposals
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sustainability Dashboard */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 relative">
              <Activity className="text-indigo-400" size={40} />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-[spin_4s_linear_infinite]"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Sustainability Index</h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Autonomous Mesh Health</p>
            <div className="text-4xl font-black text-white mb-6">{health}%</div>
            
            <div className="w-full space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Treasury Pool</span>
                <span className="text-indigo-400 font-mono font-bold">4.2M $SOV</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Peer Consensus</span>
                <span className="text-green-400 font-mono font-bold">Optimal</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-white/5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Cpu size={14} /> Network Parameters
             </h4>
             <div className="space-y-3">
               {[
                 { l: 'Min. Stake', v: '100 $SOV' },
                 { l: 'Slashing Rate', v: '0.05%' },
                 { l: 'Sync Period', v: '150ms' },
               ].map((p, i) => (
                 <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400">{p.l}</span>
                    <span className="text-[11px] font-bold text-white font-mono">{p.v}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* AI Proposals List */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] p-10 flex flex-col h-full min-h-[600px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
                <Scale size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Autonomous Proposals</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Generated via Mesh Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-green-400 bg-green-400/10 px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-[0.2em]">
               System Optimal
            </div>
          </div>

          <div className="flex-1 bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner overflow-y-auto custom-scrollbar">
             <div className="text-slate-300 leading-relaxed font-medium text-sm whitespace-pre-wrap selection:bg-indigo-500/30">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40 py-12">
                   <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin"></div>
                   <p className="text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Consulting Network Oracles...</p>
                 </div>
               ) : proposalsText}
             </div>
          </div>

          <div className="mt-8 flex gap-4">
             <button className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2">
               Approve Implementation <ShieldCheck size={18} />
             </button>
             <button className="px-10 py-4 glass-panel text-slate-400 hover:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all">
               Deliberate
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceCore;
