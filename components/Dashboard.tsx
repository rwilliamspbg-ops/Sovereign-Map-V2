
import React, { useState, useEffect, useMemo } from 'react';
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
  Scale,
  Radio,
  AlertCircle,
  Activity,
  ArrowUpRight,
  Wifi,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeSpatialTrends } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';
import { AppRoute } from '../types';

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Simulated Dynamic Metrics
  const [activePeers, setActivePeers] = useState(42891);
  const [throughput, setThroughput] = useState(842.5);
  const [syncEvents, setSyncEvents] = useState<any[]>([]);

  useEffect(() => {
    refreshInsight();
    
    // Simulate real-time metrics fluctuation
    const metricsInterval = setInterval(() => {
      setActivePeers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setThroughput(prev => parseFloat((prev + (Math.random() - 0.5) * 5).toFixed(1)));
    }, 3000);

    // Simulate incoming network events
    const eventInterval = setInterval(() => {
      const eventTypes = ['Handshake', 'Block Confirmed', 'Spatial Drift Corrected', 'Node Joined', 'Relay Active'];
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        value: (Math.random() * 100).toFixed(2)
      };
      setSyncEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 5000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(eventInterval);
    };
  }, []);

  const refreshInsight = async () => {
    setLoadingInsight(true);
    setHasError(false);
    try {
      const result = await analyzeSpatialTrends([{id: 'node-x', status: 'active'}]);
      if (result) {
        setAiInsight(result);
        if (result.includes("Quota Exceeded")) setHasError(true);
      } else {
        setAiInsight("Link to Mesh Intelligence unstable. Displaying local cache data.");
        setHasError(true);
      }
    } catch (e) {
      setAiInsight("Critical telemetry failure. Please check your uplink connection.");
      setHasError(true);
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
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
            to={`/${AppRoute.BEACON}`}
            className="flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl font-bold transition-all text-sm hover:bg-blue-600 hover:text-white"
          >
            <Radio size={16} />
            Beacon Transmitting
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

      {/* Main Stats Grid with Real-time metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Mesh Reach', value: activePeers.toLocaleString(), icon: <Layers className="text-blue-400" size={20} />, delta: '+1.2k', sub: 'Spatial peers' },
          { label: 'Avg Throughput', value: `${throughput} GB/s`, icon: <Wifi className="text-green-400" size={20} />, delta: 'Stable', sub: 'Live relay' },
          { label: 'Consensus Level', value: '98.4%', icon: <ShieldCheck className="text-indigo-400" size={20} />, delta: 'Optimal', sub: 'Self-governed' },
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
              <h3 className="text-xl font-bold text-white leading-tight font-mono tracking-tight">{stat.value}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Map Hub */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden flex flex-col h-[450px] lg:h-[550px] relative">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg border-white/5 bg-slate-950/40">
             <Globe size={14} className="text-blue-400 animate-pulse" />
             <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Neural Mesh Live Feed</span>
          </div>
          
          {/* Live Legend */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="glass-panel px-3 py-1.5 rounded-lg border-white/5 bg-slate-950/60 text-[8px] font-bold text-slate-300 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Active Nodes
            </div>
            <div className="glass-panel px-3 py-1.5 rounded-lg border-white/5 bg-slate-950/60 text-[8px] font-bold text-slate-300 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Drone Swarm
            </div>
          </div>

          <div className="flex-1 relative bg-slate-950/20">
             <SpatialCanvas />
             
             {/* Dynamic Feed Overlay */}
             <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 glass-panel p-4 rounded-2xl border-white/5 shadow-2xl backdrop-blur-2xl">
                   <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Economic Status</p>
                        <h4 className="text-xs font-bold text-white">Sovereign Yield: High</h4>
                      </div>
                      <TrendingUp size={12} className="text-green-400" />
                   </div>
                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                      <div className="bg-indigo-500 h-full w-4/5 animate-[pulse_2s_infinite]"></div>
                   </div>
                   <p className="text-[9px] text-slate-400 leading-tight">Mesh is self-sustaining. Yields optimized via Neural Atlas layer.</p>
                </div>

                <div className="hidden lg:block w-64 glass-panel p-4 rounded-2xl border-white/5 shadow-2xl backdrop-blur-2xl overflow-hidden">
                   <div className="flex items-center gap-2 mb-2">
                      <History size={12} className="text-slate-500" />
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Activity</p>
                   </div>
                   <div className="space-y-1.5">
                      {syncEvents.map((ev, idx) => (
                        <div key={ev.id} className="flex justify-between items-center text-[8px] animate-in slide-in-from-left-1" style={{ opacity: 1 - idx * 0.15 }}>
                           <span className="text-blue-400 font-bold truncate pr-2">{ev.type}</span>
                           <span className="text-slate-600 font-mono shrink-0">{ev.time}</span>
                        </div>
                      ))}
                      {syncEvents.length === 0 && <p className="text-[8px] text-slate-700 italic">Syncing stream...</p>}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Intelligence & Audit Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel flex-1 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden h-full border-blue-500/10 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity size={120} className="text-blue-500" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${hasError ? 'bg-amber-600/20 text-amber-400' : 'bg-blue-600/20 text-blue-400'}`}>
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-none">Sustainability Audit</h3>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${hasError ? 'text-amber-500' : 'text-blue-500/80'}`}>
                  {hasError ? 'System Resource Limited' : 'AI-Core Operational'}
                </p>
              </div>
            </div>

            <div className={`flex-1 p-4 rounded-2xl border overflow-y-auto custom-scrollbar shadow-inner relative ${hasError ? 'bg-amber-950/20 border-amber-500/10' : 'bg-slate-950/40 border-white/5'}`}>
              <div className={`text-[12px] leading-relaxed font-medium whitespace-pre-wrap ${hasError ? 'text-amber-200/70 italic' : 'text-slate-300'}`}>
                {loadingInsight ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <Sparkles size={24} className="text-blue-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auditing Mesh Sustainability...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {hasError && (
                      <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2 rounded-lg mb-2">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold">Latency Detected in Neural Uplink</span>
                      </div>
                    )}
                    {aiInsight}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
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
              
              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-green-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Pulse</span>
                </div>
                <div className="flex gap-0.5 items-end h-4">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
                    <div key={i} className="w-1 bg-green-500/40 rounded-t-[1px]" style={{ height: `${h * 100}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
