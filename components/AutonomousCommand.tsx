
import React, { useState, useEffect, useMemo } from 'react';
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
  GanttChartSquare,
  Activity,
  BarChart3,
  Crosshair,
  Gauge,
  Waves
} from 'lucide-react';
import { planAutonomousMission } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';

interface SwarmNode {
  id: string;
  battery: number;
  altitude: number;
  speed: number;
  status: 'ACTIVE' | 'SCANNING' | 'HOLD';
  scannedNodes: number;
}

const AutonomousCommand: React.FC = () => {
  const [missionPlan, setMissionPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'LOCKED'>('IDLE');
  const [scannedObstacles, setScannedObstacles] = useState(0);
  
  // Real-time swarm telemetry
  const [swarm, setSwarm] = useState<SwarmNode[]>([
    { id: 'DRONE-01', battery: 98, altitude: 45, speed: 12.4, status: 'ACTIVE', scannedNodes: 12 },
    { id: 'DRONE-02', battery: 84, altitude: 52, speed: 10.1, status: 'SCANNING', scannedNodes: 8 },
    { id: 'DRONE-03', battery: 92, altitude: 38, speed: 14.5, status: 'ACTIVE', scannedNodes: 15 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwarm(prev => prev.map(drone => ({
        ...drone,
        battery: Math.max(0, drone.battery - Math.random() * 0.1),
        altitude: parseFloat((drone.altitude + (Math.random() - 0.5) * 2).toFixed(1)),
        speed: parseFloat((drone.speed + (Math.random() - 0.5) * 1).toFixed(1)),
        scannedNodes: drone.scannedNodes + (Math.random() > 0.8 ? 1 : 0)
      })));
      
      if (status === 'SCANNING' || status === 'LOCKED') {
        setScannedObstacles(prev => prev + (Math.random() > 0.9 ? 1 : 0));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status]);

  const startMissionIntelligence = async () => {
    setLoading(true);
    setStatus('SCANNING');
    const result = await planAutonomousMission("Sector-7", "Nexus-Alpha", 84);
    setMissionPlan(result || "");
    setLoading(false);
    setStatus('LOCKED');
  };

  const totalScanned = useMemo(() => swarm.reduce((acc, d) => acc + d.scannedNodes, 0), [swarm]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Autonomous Command Hub</h2>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></span>
              Airspace Integrity: Nominal
            </span>
            <span className="text-slate-800">•</span>
            <span className="text-xs">Active Entities: {swarm.length} Swarm Units</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={startMissionIntelligence}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Target size={16} />}
            {loading ? 'Analyzing Vector...' : 'Generate Flight Intel'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical 3D Map with HUD Overlay */}
        <div className="lg:col-span-8 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[650px] relative border-white/5 shadow-2xl">
          {/* HUD Top Overlays */}
          <div className="absolute top-8 left-8 z-20 flex flex-col gap-4 pointer-events-none">
             <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] bg-slate-950/80 border-blue-500/20 shadow-2xl">
                <Plane size={16} className="text-blue-400" /> 
                <span>Swarm_Active: Grid_Alpha</span>
                <div className="flex gap-1 ml-4">
                   {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-3 bg-blue-500/40 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-2">
               {swarm.map(drone => (
                 <div key={drone.id} className="glass-panel px-4 py-2 rounded-xl flex items-center justify-between gap-6 bg-slate-950/60 border-white/5 min-w-[200px] animate-in slide-in-from-left-4">
                   <div className="flex items-center gap-3">
                     <div className={`w-1.5 h-1.5 rounded-full ${drone.status === 'SCANNING' ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                     <span className="text-[9px] font-black text-white font-mono">{drone.id}</span>
                   </div>
                   <div className="flex gap-4 text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                      <span>ALT: {drone.altitude}m</span>
                      <span>SPD: {drone.speed}km/h</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-3 pointer-events-none">
             <div className="glass-panel p-5 rounded-[2rem] bg-slate-950/80 border-white/5 text-right space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mesh Discovery Rate</p>
                <div className="flex items-center gap-4 justify-end">
                   <span className="text-xl font-black text-blue-400 font-mono tracking-tighter">{(totalScanned / 60).toFixed(2)}/s</span>
                   <BarChart3 size={20} className="text-blue-500" />
                </div>
             </div>
          </div>
          
          <div className="flex-1 relative bg-slate-950/40 cursor-crosshair">
             <SpatialCanvas isDroneView={true} />
             
             {/* Center Crosshair Overlay */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="relative w-64 h-64 border border-blue-500/30 rounded-full flex items-center justify-center">
                   <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full animate-pulse"></div>
                   <Crosshair size={32} className="text-blue-500" />
                   {/* HUD Compass Lines */}
                   <div className="absolute top-0 w-px h-4 bg-blue-500"></div>
                   <div className="absolute bottom-0 w-px h-4 bg-blue-500"></div>
                   <div className="absolute left-0 w-4 h-px bg-blue-500"></div>
                   <div className="absolute right-0 w-4 h-px bg-blue-500"></div>
                </div>
             </div>
          </div>

          {/* Bottom HUD Metrics Bar */}
          <div className="absolute bottom-8 left-8 right-8 z-20 grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-none">
             {[
               { l: 'Flight Corridor', v: status === 'LOCKED' ? 'Verified' : 'Calculating', i: <Target size={16}/>, c: 'text-blue-400' },
               { l: 'Obstacles Scanned', v: scannedObstacles, i: <AlertCircle size={16}/>, c: 'text-amber-400' },
               { l: 'Total Nodes', v: totalScanned, i: <Activity size={16}/>, c: 'text-green-400' },
               { l: 'Consensus Trust', v: '99.2%', i: <ShieldCheck size={16}/>, c: 'text-purple-400' },
             ].map((st, i) => (
               <div key={i} className="glass-panel p-5 rounded-[1.8rem] border-white/10 bg-slate-950/80 backdrop-blur-3xl shadow-2xl pointer-events-auto hover:scale-105 transition-transform group">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 group-hover:text-white transition-colors">
                   <span className={st.c}>{st.i}</span> {st.l}
                 </div>
                 <div className={`text-xl font-black font-mono tracking-tighter ${st.c}`}>{st.v}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Mission Intelligence Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[650px]">
          <div className="glass-panel flex-1 rounded-[3rem] p-10 flex flex-col overflow-hidden relative border-white/5 shadow-2xl bg-slate-900/40">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-900/10">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white leading-tight tracking-tight uppercase">Mission Oracle</h3>
                <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-1.5">Sovereign Logistics Unit 2.6</p>
              </div>
              <Sparkles size={20} className="ml-auto text-blue-400 animate-pulse" />
            </div>

            <div className="flex-1 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 overflow-y-auto custom-scrollbar shadow-inner relative group">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Running Neural Simulation...</p>
                    <p className="text-[9px] font-mono text-blue-400 italic">Sector-7 Pathfinding v4.2</p>
                  </div>
                </div>
              ) : missionPlan ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                     <Waves size={14} /> Mission_Synthesis_Complete
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap selection:bg-blue-500/30 italic">
                    {missionPlan}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center opacity-20 grayscale group-hover:opacity-40 transition-opacity">
                  <GanttChartSquare size={64} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Standby</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Awaiting Mission Vectors</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">
                 <span>Swarm Health</span>
                 <span className="text-green-400">Nominal</span>
              </div>
              <button className="w-full flex items-center justify-between p-5 bg-white text-slate-950 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-200 transition-all active:scale-95 group overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <Zap size={18} className="text-blue-600" />
                  <span>Commit Flight Vectors</span>
                </div>
                <ChevronRight size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-blue-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-slate-950/40 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
               <Gauge size={100} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Gauge size={14} className="text-blue-400" /> Kinetic Yield Forecast
              </span>
              <span className="text-lg font-black text-green-400 font-mono tracking-tighter">{(totalScanned * 0.42).toFixed(1)} $SOV</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
              Swarm performance is exceeding baseline. Predictive mapping rewards estimated to peak in T-minus 14 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousCommand;
