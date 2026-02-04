
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
  Loader2
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
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Neural Atlas</h2>
          <p className="text-slate-400 text-sm">Semantic topological synthesis of decentralized mesh data.</p>
        </div>
        <div className="flex bg-slate-900/60 rounded-2xl p-1.5 glass-panel">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg">
             Surface Map
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
             Sub-Mesh Layers
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Interactive Map Column */}
        <div className="lg:col-span-7 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative h-full">
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/40">
                <MapPin size={12} className="text-blue-400" /> Sector: {sector}
             </div>
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-slate-950/40">
                <Scan size={12} className="text-purple-400" /> PoLoc Verified
             </div>
          </div>
          
          <div className="flex-1 relative bg-slate-950/20">
             <SpatialCanvas />
             
             <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {['Alpha-7', 'Delta-4', 'Sierra-9', 'Zulu-2'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSector(s)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                      sector === s ? 'bg-blue-600 border-blue-400 text-white' : 'glass-panel border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s} Focus
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Intelligence Synthesis Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
          <div className="glass-panel flex-1 rounded-[2.5rem] p-8 flex flex-col overflow-hidden relative">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl">
                  <Brain size={20} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">Semantic Synthesis</h3>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Sovereign Intel Stream</p>
                </div>
                <Sparkles size={20} className="ml-auto text-blue-400 animate-pulse" />
             </div>

             <div className="flex-1 bg-slate-950/30 p-6 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar">
                {loading ? (
                   <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                     <Loader2 className="animate-spin text-blue-500" size={32} />
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Topological Report...</p>
                   </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {synthesis}
                  </p>
                )}
             </div>

             <div className="mt-6 flex flex-col gap-3">
                <button className="flex items-center justify-between p-4 glass-panel rounded-2xl border-white/5 hover:bg-white/5 transition-all text-left">
                   <div className="flex items-center gap-3">
                      <Layers size={16} className="text-blue-400" />
                      <span className="text-xs font-bold text-white">Download Topological SDK</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-600" />
                </button>
                <button className="flex items-center justify-between p-4 glass-panel rounded-2xl border-white/5 hover:bg-white/5 transition-all text-left">
                   <div className="flex items-center gap-3">
                      <Info size={16} className="text-purple-400" />
                      <span className="text-xs font-bold text-white">Verify Mesh Sovereignty</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-600" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasView;
