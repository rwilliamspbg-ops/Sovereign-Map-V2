
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  Database,
  Globe,
  Wifi,
  Activity,
  ArrowRight,
  Layers,
  Box,
  ChevronRight,
  Network as NetworkIcon
} from 'lucide-react';
import SpatialCanvas from './SpatialCanvas';

interface Node {
  id: string;
  location: string;
  region: string;
  status: 'Active' | 'Syncing' | 'Offline';
  latency: string;
  throughput: string;
  health: number;
}

const NetworkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [isGrouped, setIsGrouped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const nodes: Node[] = useMemo(() => [
    { id: 'LDN-01', location: 'London', region: 'Europe', status: 'Active', latency: '42ms', throughput: '850GB/s', health: 98 },
    { id: 'NYC-04', location: 'New York', region: 'North America', status: 'Active', latency: '12ms', throughput: '1.2TB/s', health: 100 },
    { id: 'TKO-09', location: 'Tokyo', region: 'Asia', status: 'Syncing', latency: '158ms', throughput: '240GB/s', health: 65 },
    { id: 'BER-11', location: 'Berlin', region: 'Europe', status: 'Active', latency: '28ms', throughput: '600GB/s', health: 92 },
    { id: 'SGP-02', location: 'Singapore', region: 'Asia', status: 'Offline', latency: '--', throughput: '--', health: 0 },
    { id: 'PAR-03', location: 'Paris', region: 'Europe', status: 'Active', latency: '31ms', throughput: '720GB/s', health: 95 },
    { id: 'SFO-07', location: 'San Francisco', region: 'North America', status: 'Active', latency: '15ms', throughput: '1.1TB/s', health: 99 },
  ], []);

  const clusters = useMemo(() => {
    const groups: Record<string, Node[]> = {};
    nodes.forEach(node => {
      if (!groups[node.region]) groups[node.region] = [];
      groups[node.region].push(node);
    });
    return Object.entries(groups).map(([region, regionNodes]) => {
      const activeCount = regionNodes.filter(n => n.status === 'Active').length;
      const avgHealth = Math.round(regionNodes.reduce((acc, n) => acc + n.health, 0) / regionNodes.length);
      const totalThroughput = regionNodes.reduce((acc, n) => {
        if (n.throughput.includes('TB')) return acc + parseFloat(n.throughput) * 1000;
        if (n.throughput.includes('GB')) return acc + parseFloat(n.throughput);
        return acc;
      }, 0);

      return {
        region,
        nodes: regionNodes,
        count: regionNodes.length,
        activeCount,
        avgHealth,
        totalThroughput: totalThroughput >= 1000 ? `${(totalThroughput / 1000).toFixed(1)}TB/s` : `${totalThroughput}GB/s`,
        status: activeCount > 0 ? 'Active' : 'Offline'
      };
    });
  }, [nodes]);

  const filteredNodes = nodes.filter(n => 
    n.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a node, city, or sector..." 
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsGrouped(!isGrouped)}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 glass-panel rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isGrouped ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers size={18} /> {isGrouped ? 'Ungroup Nodes' : 'Group by Region'}
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 glass-panel rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative min-h-[500px]">
        {activeTab === 'map' ? (
          <div className="flex-1 relative bg-black/20">
             <SpatialCanvas grouped={isGrouped} />
             
             <div className="absolute top-6 left-6 flex flex-col gap-4 max-w-[240px] z-10 pointer-events-none">
                <div className="glass-panel p-4 rounded-3xl border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-left-4 duration-500">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Map Intelligence</p>
                    <h4 className="text-sm font-bold text-white mb-2">
                        {isGrouped ? 'Active Mesh Clusters' : 'Direct Node Visualization'}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        {isGrouped 
                          ? `Consolidating ${nodes.length} nodes into ${clusters.length} strategic regions for optimized spatial management.`
                          : `Visualizing raw decentralized infrastructure across the global coordinate plane.`}
                    </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
             {isGrouped ? (
               /* Grouped View (Clusters) */
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                 {clusters.map(cluster => (
                   <div key={cluster.region} className="glass-panel p-6 rounded-[2rem] hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         <NetworkIcon size={80} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                           <Box size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400">
                           {cluster.count} Nodes
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-1">{cluster.region}</h3>
                      <p className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-6">Mesh Cluster Alpha</p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Throughput</p>
                           <p className="text-sm font-bold text-white">{cluster.totalThroughput}</p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Health</p>
                           <p className="text-sm font-bold text-green-400">{cluster.avgHealth}%</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {cluster.nodes.slice(0, 3).map(n => (
                          <div key={n.id} className="flex justify-between items-center text-[10px] text-slate-400 border-b border-white/5 pb-1">
                             <span className="font-bold">{n.location}</span>
                             <span className="font-mono">{n.latency}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20">
                         Expand Cluster <ChevronRight size={14} />
                      </button>
                   </div>
                 ))}
               </div>
             ) : (
               /* List View (Individual Nodes) */
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  {filteredNodes.map(node => (
                    <div key={node.id} className="glass-panel p-6 rounded-[2rem] hover:bg-slate-900/60 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${node.status === 'Active' ? 'bg-green-500/10 text-green-400' : node.status === 'Syncing' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                          <Globe size={24} />
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            node.status === 'Active' ? 'text-green-400 bg-green-400/10' : node.status === 'Syncing' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 bg-slate-800'
                          }`}>
                            {node.status}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{node.location}</h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6 uppercase tracking-widest">
                         {node.id} <span className="w-1 h-1 rounded-full bg-slate-700"></span> {node.region}
                      </div>
                      
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
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkView;
