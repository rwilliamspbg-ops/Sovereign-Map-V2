
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  Layers, 
  Zap, 
  Database,
  Globe
} from 'lucide-react';
import SpatialCanvas from './SpatialCanvas';

const NetworkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  const nodes = [
    { id: 'LDN-01', location: 'London, UK', status: 'Active', latency: '42ms', throughput: '850GB/s' },
    { id: 'NYC-04', location: 'New York, USA', status: 'Active', latency: '12ms', throughput: '1.2TB/s' },
    { id: 'TKO-09', location: 'Tokyo, JP', status: 'Syncing', latency: '158ms', throughput: '240GB/s' },
    { id: 'BER-11', location: 'Berlin, DE', status: 'Active', latency: '28ms', throughput: '600GB/s' },
    { id: 'SGP-02', location: 'Singapore, SG', status: 'Offline', latency: '--', throughput: '--' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mesh Explorer</h2>
          <p className="text-slate-400">Discover and manage decentralized spatial nodes.</p>
        </div>
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <MapIcon size={16} /> Map
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <Database size={16} /> List
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search node alias, location, or hash..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden min-h-[500px] flex flex-col shadow-inner">
        {activeTab === 'map' ? (
          <div className="flex-1 relative bg-black">
             <SpatialCanvas />
             <div className="absolute bottom-6 left-6 p-4 bg-slate-950/80 border border-blue-500/20 backdrop-blur-md rounded-2xl max-w-xs space-y-4 shadow-xl">
               <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400">Node Insight</h4>
               <p className="text-xs text-slate-300 leading-relaxed">
                 High density of nodes detected in the North Atlantic sector. Sovereign mesh stability at 94% in this region.
               </p>
               <div className="flex gap-2">
                 <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
                 <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
                 <div className="flex-1 h-1 bg-green-500/20 rounded-full"></div>
               </div>
             </div>
             
             {/* Map HUD Controls */}
             <div className="absolute top-6 right-6 flex flex-col gap-2">
                {[<Layers size={20} />, <Zap size={20} />, <Globe size={20} />].map((icon, i) => (
                  <button key={i} className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-lg backdrop-blur-sm">
                    {icon}
                  </button>
                ))}
             </div>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="pb-4 font-normal">Node Alias</th>
                  <th className="pb-4 font-normal">Location</th>
                  <th className="pb-4 font-normal">Status</th>
                  <th className="pb-4 font-normal">Latency</th>
                  <th className="pb-4 font-normal">Throughput</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {nodes.map((node) => (
                  <tr key={node.id} className="group hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 font-bold text-sm text-blue-100">{node.id}</td>
                    <td className="py-4 text-sm text-slate-400">{node.location}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        node.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        node.status === 'Syncing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-mono text-slate-500">{node.latency}</td>
                    <td className="py-4 text-sm font-mono text-slate-500">{node.throughput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkView;
