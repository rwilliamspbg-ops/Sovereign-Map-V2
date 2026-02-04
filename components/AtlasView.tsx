
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  MapPin, 
  Layers, 
  Info, 
  ChevronRight, 
  Scan, 
  Brain,
  Sparkles,
  Loader2,
  Navigation2
} from 'lucide-react';
import { generateAtlasSynthesis } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';

const AtlasView: React.FC = () => {
  const [sector, setSector] = useState("Alpha-7");
  const [synthesis, setSynthesis] = useState("");
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Navigation2 className="text-blue-500 fill-blue-500/20" size={24} />
             <h2 className="text-3xl font-extrabold tracking-tight text-white">Neural Atlas</h2>
          </div>
          <p className="text-slate-400 text-sm">3D Spatiotemporal synthesis of decentralized mesh data. Virtual walking mode active.</p>
        </div>
        <div className="flex bg-slate-900/60 rounded-2xl p-1.5 glass-panel">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg">
             3D Perspective
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
             Data Sub-Layers
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Interactive 3D Walkway */}
        <div className="lg:col-span-8 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative h-full group">
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/60 border-white/10">
                <MapPin size={12} className="text-blue-400" /> Sector: {sector}
             </div>
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/60 border-white/10">
                <Scan size={12} className="text-purple-400" /> Immersive Mode: On
             </div>
          </div>

          <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal Density</div>
             <div className="flex gap-1 h-8 items-end">
               {[0.2, 0.4, 0.8, 0.3, 0.9, 0.6, 0.4].map((v, i) => (
                 <div key={i} className="w-1.5 bg-blue-500/40 rounded-t-sm" style={{ height: `${v*100}%` }}></div>
               ))}
             </div>
          </div>
          
          <div className="flex-1 relative bg-slate-950/40">
             <SpatialCanvas />
             
             <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {['Alpha-7', 'Delta-4', 'Sierra-9', 'Zulu-2'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSector(s)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                      sector === s ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_#2563eb44]' : 'glass-panel border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s} Point
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Intelligence Synthesis Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          <div className="glass-panel flex-1 rounded-[2.5rem] p-8 flex flex-col overflow-hidden relative border-blue-500/10 shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl">
                  <Brain size={20} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white leading-tight">Spatial Intel</h3>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Autonomous Logic Unit</p>
                </div>
                <Sparkles size={20} className="ml-auto text-blue-400 animate-pulse" />
             </div>

             <div className="flex-1 bg-slate-950/40 p-6 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar">
                {loading ? (
                   <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                     <Loader2 className="animate-spin text-blue-500" size={32} />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Sector Nodes...</p>
                   </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {synthesis}
                  </p>
                )}
             </div>

             <div className="mt-6 space-y-3">
                <button className="w-full flex items-center justify-between p-4 glass-panel rounded-2xl border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all text-left">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-950 rounded-lg"><Layers size={14} className="text-blue-400" /></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural SDK Export</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-600" />
                </button>
                <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Walking Speed</p>
                   <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-2/3"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasView;
