
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  Database,
  Globe,
  Wifi,
  Activity,
  ArrowRight
} from 'lucide-react';
import SpatialCanvas from './SpatialCanvas';

const NetworkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  const nodes = [
    { id: 'LDN-01', location: 'London, UK', status: 'Active', latency: '42ms', throughput: '850GB/s', health: 98 },
    { id: 'NYC-04', location: 'New York, USA', status: 'Active', latency: '12ms', throughput: '1.2TB/s', health: 100 },
    { id: 'TKO-09', location: 'Tokyo, JP', status: 'Syncing', latency: '158ms', throughput: '240GB/s', health: 65 },
    { id: 'BER-11', location: 'Berlin, DE', status: 'Active', latency: '28ms', throughput: '600GB/s', health: 92 },
    { id: 'SGP-02', location: 'Singapore, SG', status: 'Offline', latency: '--', throughput: '--', health: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Mesh Explorer</h2>
          <p className="text-slate-400 text-sm">Monitor and interface with decentralized spatial node infrastructure.</p>
        </div>
        <div className="flex bg-slate-900/60 rounded-2xl p-1.5 glass-panel">
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MapIcon size={14} /> Spatial Map
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Database size={14} /> Node Registry
          </button>
        </div>
      </header>

      {/* Control Bar - Cleaner Human Input */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Find a node, city, or sector..." 
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 glass-panel rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all">
          <Filter size={18} /> Sort & Filter
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative min-h-[500px]">
        {activeTab === 'map' ? (
          <div className="flex-1 relative bg-black/20">
             <SpatialCanvas />
             
             {/* Dynamic Info Cards for key nodes */}
             <div className="absolute top-6 left-6 flex flex-col gap-4 max-w-[240px] z-10">
                {nodes.slice(0, 2).map(node => (
                  <div key={node.id} className="glass-panel p-4 rounded-3xl border-white/5 backdrop-blur-3xl animate-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{node.id}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{node.location}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3">
                       <span className="flex items-center gap-1"><Wifi size={10} /> {node.latency}</span>
                       <span className="flex items-center gap-1"><Activity size={10} /> {node.health}% Health</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-[10px] font-bold uppercase transition-all">
                      Link Terminal
                    </button>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8 no-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {nodes.map(node => (
                  <div key={node.id} className="glass-panel p-6 rounded-[2rem] hover:bg-slate-900/60 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${node.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Globe size={24} />
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                          node.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-slate-500 bg-slate-800'
                        }`}>
                          {node.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{node.location}</h3>
                    <p className="text-xs font-mono text-slate-500 mb-6">{node.id}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                        <p className="text-sm font-bold text-blue-400">{node.latency}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Health</p>
                        <p className="text-sm font-bold text-green-400">{node.health}%</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                       Interface <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkView;
