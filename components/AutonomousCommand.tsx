
import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Cpu, 
  Wind, 
  Target, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Sparkles,
  Plane,
  Radio,
  GanttChartSquare
} from 'lucide-react';
import { planAutonomousMission } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';

const AutonomousCommand: React.FC = () => {
  const [missionPlan, setMissionPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'LOCKED'>('IDLE');

  const startMissionIntelligence = async () => {
    setLoading(true);
    const result = await planAutonomousMission("Sector-7", "Nexus-Alpha", 84);
    setMissionPlan(result || "");
    setLoading(false);
    setStatus('LOCKED');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Autonomous Command Hub</h2>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              Airspace Integrity: Nominal
            </span>
            <span className="text-slate-800">•</span>
            <span className="text-xs">Active Entities: 12 Swarm Nodes</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={startMissionIntelligence}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Target size={16} />}
            Generate Flight Intel
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical 3D Map */}
        <div className="lg:col-span-8 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] relative border-blue-500/10">
          <div className="absolute top-6 left-6 z-20 flex gap-3">
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/60 border-white/10">
                <Plane size={14} className="text-blue-400" /> Swarm-7 Active
             </div>
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/60 border-white/10">
                <Radio size={14} className="text-green-400" /> Telemetry Locked
             </div>
          </div>
          
          <div className="flex-1 relative bg-slate-950/40">
             <SpatialCanvas />
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { l: 'Flight Corridor', v: 'Verified', i: <Target size={14}/>, c: 'text-blue-400' },
               { l: 'Obstacle Density', v: 'Low', i: <Wind size={14}/>, c: 'text-green-400' },
               { l: 'PoLoc Trust', v: '98.8%', i: <ShieldCheck size={14}/>, c: 'text-purple-400' },
             ].map((st, i) => (
               <div key={i} className="glass-panel p-4 rounded-2xl border-white/5 bg-slate-950/80 backdrop-blur-2xl">
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                   {st.i} {st.l}
                 </div>
                 <div className={`text-sm font-bold ${st.c}`}>{st.v}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Mission Intelligence Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[600px]">
          <div className="glass-panel flex-1 rounded-[2.5rem] p-8 flex flex-col overflow-hidden relative border-blue-500/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Mission Oracle</h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Sovereign Logistics Unit</p>
              </div>
              <Sparkles size={20} className="ml-auto text-blue-400 animate-pulse" />
            </div>

            <div className="flex-1 bg-slate-950/40 p-6 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimizing Kinematics...</p>
                </div>
              ) : missionPlan ? (
                <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {missionPlan}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center opacity-30">
                  <GanttChartSquare size={48} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Ready for Mission Parameters</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-between p-4 glass-panel rounded-2xl border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-blue-600/20 transition-all">
                    <Zap size={14} className="text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Execute Kinematics</span>
                </div>
                <ChevronRight size={14} className="text-slate-600" />
              </button>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-[2rem] border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Coverage Rewards</span>
              <span className="text-sm font-bold text-green-400">+42.5 $SOV</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed italic">
              Drones are currently mapping Sector-7 blindspots. Real-time data synthesis generating sovereign yield.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousCommand;
