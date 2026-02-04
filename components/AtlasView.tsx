
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  Brain,
  Sparkles,
  Loader2,
  Navigation2,
  Maximize2,
  Activity,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import { generateAtlasSynthesis } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';

const AtlasView: React.FC = () => {
  const [sector, setSector] = useState("Alpha-7");
  const [synthesis, setSynthesis] = useState("");
  const [loading, setLoading] = useState(true);
  const [showIntel, setShowIntel] = useState(true);

  useEffect(() => {
    fetchSynthesis();
  }, [sector]);

  const fetchSynthesis = async () => {
    setLoading(true);
    const result = await generateAtlasSynthesis(sector);
    setSynthesis(result || "");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 pt-20 px-6 pb-6 animate-in fade-in duration-1000">
      {/* Immersive 3D Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <SpatialCanvas />
      </div>

      {/* Floating Tactical HUD */}
      <div className="relative z-10 h-full w-full pointer-events-none flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] pointer-events-auto">
               <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_#2563eb66]">
                  <Navigation2 className="text-white" size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white tracking-tight leading-none uppercase">Neural Atlas</h2>
                  <p className="text-[10px] font-mono text-blue-400 font-bold mt-1">Live Mesh Telemetry: Active</p>
               </div>
            </div>
            
            <div className="flex gap-2 pointer-events-auto">
               {['Sector A-7', 'Relay Hub-4', 'Border-Sierra'].map(s => (
                 <button 
                  key={s}
                  className="px-4 py-2 bg-slate-950/40 backdrop-blur border border-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-500/30 hover:text-white transition-all"
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="bg-slate-950/80 backdrop-blur border border-white/10 p-4 rounded-2xl flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Mesh Consensus</p>
                  <p className="text-xs font-bold text-green-400">98.4% STABLE</p>
               </div>
               <div className="w-10 h-10 flex items-center justify-center bg-green-500/10 rounded-xl">
                  <Activity size={18} className="text-green-500" />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Intel & Controls Row */}
        <div className="flex items-end justify-between gap-6 h-[250px] mb-8">
          {/* Left: Intelligence Summary */}
          <div className={`w-[400px] h-full glass-panel rounded-[2.5rem] p-6 flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ${showIntel ? 'translate-x-0' : '-translate-x-[420px]'}`}>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <Brain size={16} className="text-blue-400" />
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Synthesis Feed</h3>
                </div>
                <button onClick={() => setShowIntel(false)} className="text-slate-600 hover:text-white"><Maximize2 size={12} /></button>
             </div>
             
             <div className="flex-1 bg-black/40 rounded-2xl p-4 overflow-y-auto custom-scrollbar border border-white/5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 gap-3">
                     <Loader2 className="animate-spin" size={20} />
                     <p className="text-[8px] uppercase tracking-widest font-black">Decrypting...</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    {synthesis}
                  </p>
                )}
             </div>
          </div>

          {!showIntel && (
            <button 
              onClick={() => setShowIntel(true)}
              className="pointer-events-auto p-4 bg-blue-600 text-white rounded-full animate-in slide-in-from-left-4"
            >
              <Brain size={20} />
            </button>
          )}

          {/* Right: Interaction HUD */}
          <div className="flex flex-col gap-4 pointer-events-auto items-end">
             <div className="flex gap-2">
                <button className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                  Sync Coordinates
                </button>
                <button className="p-3 bg-slate-950/60 backdrop-blur border border-white/10 rounded-2xl text-white">
                   <Search size={18} />
                </button>
             </div>
             
             <div className="bg-slate-950/80 backdrop-blur border border-white/10 p-5 rounded-[2rem] min-w-[300px]">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Database size={14} className="text-blue-400" /> Mesh Integrity
                   </span>
                   <span className="text-xs font-bold text-white">LOW DRIFT</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-blue-600 w-4/5 animate-[pulse_2s_infinite]"></div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase">
                   <span>Lat: 51.5074</span>
                   <span>Lng: -0.1278</span>
                   <span className="text-blue-400">Locked</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasView;
