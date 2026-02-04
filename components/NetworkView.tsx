
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Network as NetworkIcon,
  Shield,
  EyeOff,
  Signal,
  Zap,
  Lock,
  Clock,
  BarChart3,
  Waves
} from 'lucide-react';
import SpatialCanvas from './SpatialCanvas';
import { SpatialNode } from '../types';

interface NodeUI extends SpatialNode {
  location: string;
  region: string;
  latency: string;
  throughput: string;
  health: number;
}

const NodeSignalHUD = ({ status }: { status: string }) => {
  const [points, setPoints] = useState<number[]>([]);
  const [strength, setStrength] = useState(90);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize and update raw data points
  useEffect(() => {
    setPoints(Array.from({ length: 24 }, () => 30 + Math.random() * 60));
    
    const interval = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1), 30 + Math.random() * 60];
        return next;
      });
      // Fluctuate strength slightly
      setStrength(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(70, Math.min(100, prev + delta));
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  // Canvas animation for a "Mini-Waveform"
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const color = status === 'active' ? '#3b82f6' : 
                    status === 'defending' ? '#ef4444' : 
                    status === 'cloaked' ? '#a855f7' : '#64748b';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const width = canvas.width;
      const height = canvas.height;
      const step = width / (points.length - 1);

      ctx.moveTo(0, height / 2);
      
      points.forEach((p, i) => {
        const x = i * step;
        const y = (height / 2) + Math.sin((frame * 0.05) + i) * (p / 4);
        ctx.lineTo(x, y);
      });
      
      ctx.stroke();
      
      // Glow effect
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [points, status]);

  const getThemeColor = () => {
    switch (status) {
      case 'active': return 'text-blue-500 bg-blue-500/10';
      case 'defending': return 'text-red-500 bg-red-500/10';
      case 'cloaked': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Waves size={12} className={status === 'active' ? 'text-blue-400' : 'text-slate-500'} />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Spectral Density</span>
        </div>
        <div className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${getThemeColor()}`}>
           {strength.toFixed(1)}% SIG_STRENGTH
        </div>
      </div>

      <div className="relative h-12 bg-slate-950/60 rounded-2xl border border-white/5 overflow-hidden group">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={48} 
          className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity"
        />
        
        {/* Multi-segment overlay bars */}
        <div className="absolute inset-0 flex items-end justify-between px-2 py-1 gap-1 pointer-events-none">
          {points.map((p, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t-[1px] transition-all duration-700 ${
                status === 'active' ? 'bg-blue-500/10' : 
                status === 'defending' ? 'bg-red-500/10' : 'bg-slate-500/10'
              }`}
              style={{ height: `${p}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-[7px] font-mono text-slate-600 uppercase tracking-tighter">
        <div className="flex gap-2">
          <span>jitter: <span className="text-slate-400">{(Math.random() * 2).toFixed(2)}ms</span></span>
          <span>packet_loss: <span className="text-slate-400">0.00%</span></span>
        </div>
        <span>neural_verified_v1</span>
      </div>
    </div>
  );
};

const NetworkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [isGrouped, setIsGrouped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const nodes: NodeUI[] = useMemo(() => [
    { id: 'LDN-01', lat: 51.5, lng: -0.1, intensity: 0.8, location: 'London', region: 'Europe', status: 'active', latency: '42ms', throughput: '850GB/s', health: 98, label: 'London Node', encryption: 'Quantum-Resistant', discoveredAt: Date.now() - 3600000 * 24 },
    { id: 'NYC-04', lat: 40.7, lng: -74.0, intensity: 0.9, location: 'New York', region: 'North America', status: 'active', latency: '12ms', throughput: '1.2TB/s', health: 100, label: 'NY Node', encryption: 'Quantum-Resistant', discoveredAt: Date.now() - 3600000 * 5 },
    { id: 'TKO-09', lat: 35.6, lng: 139.6, intensity: 0.5, location: 'Tokyo', region: 'Asia', status: 'syncing', latency: '158ms', throughput: '240GB/s', health: 65, label: 'Tokyo Node', encryption: 'AES-256', discoveredAt: Date.now() - 3600000 * 48 },
    { id: 'BER-11', lat: 52.5, lng: 13.4, intensity: 0.7, location: 'Berlin', region: 'Europe', status: 'defending', latency: '28ms', throughput: '600GB/s', health: 92, label: 'Berlin Sentry', encryption: 'P2P-Layer', discoveredAt: Date.now() - 3600000 * 12 },
    { id: 'SGP-02', lat: 1.3, lng: 103.8, intensity: 0.0, location: 'Singapore', region: 'Asia', status: 'offline', latency: '--', throughput: '--', health: 0, label: 'SG Hub', encryption: 'None', discoveredAt: Date.now() - 3600000 * 72 },
    { id: 'PAR-03', lat: 48.8, lng: 2.3, intensity: 0.75, location: 'Paris', region: 'Europe', status: 'cloaked', latency: '31ms', throughput: '720GB/s', health: 95, label: 'Paris Node', encryption: 'P2P-Layer', discoveredAt: Date.now() - 3600000 * 2 },
    { id: 'SFO-07', lat: 37.7, lng: -122.4, intensity: 0.95, location: 'San Francisco', region: 'North America', status: 'active', latency: '15ms', throughput: '1.1TB/s', health: 99, label: 'SF Node', encryption: 'Quantum-Resistant', discoveredAt: Date.now() - 3600000 * 1 },
  ], []);

  const filteredNodes = nodes.filter(n => 
    n.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: SpatialNode['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'syncing': return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
      case 'defending': return 'text-red-400 bg-red-400/10 border-red-500/20';
      case 'cloaked': return 'text-purple-400 bg-purple-400/10 border-purple-500/20';
      case 'offline': return 'text-slate-500 bg-slate-800 border-slate-700';
      default: return 'text-slate-500 bg-slate-800 border-slate-700';
    }
  };

  const getStatusIcon = (status: SpatialNode['status']) => {
    if (status === 'defending') return <Shield size={22} />;
    if (status === 'cloaked') return <EyeOff size={22} />;
    return <Globe size={22} />;
  };

  const formatDiscoveryTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown Origin';
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Discovered Just Now';
    if (hours < 24) return `Discovered ${hours}h ago`;
    return `Discovered ${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Mesh Explorer</h2>
          <p className="text-slate-400 text-sm">Real-time tactical overview of sovereign nodes and their encryption postures.</p>
        </div>
        <div className="flex bg-slate-900/60 rounded-2xl p-1.5 glass-panel border-white/5">
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
            placeholder="Search city, ID, or encryption tier..." 
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
          />
        </div>
        <button 
          onClick={() => setIsGrouped(!isGrouped)}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 glass-panel rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isGrouped ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-slate-400 hover:text-white border-white/5'}`}
        >
          <Layers size={18} /> {isGrouped ? 'Ungroup Nodes' : 'Regional Groups'}
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative min-h-[500px] border-white/5">
        {activeTab === 'map' ? (
          <div className="flex-1 relative bg-black/20">
             <SpatialCanvas isDroneView={false} />
             <div className="absolute top-6 left-6 flex flex-col gap-4 max-w-[240px] z-10 pointer-events-none">
                <div className="glass-panel p-5 rounded-3xl border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-left-4 duration-500 shadow-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                       <Signal size={12} /> Neural Mesh Uplink
                    </p>
                    <h4 className="text-sm font-bold text-white mb-2">
                        {isGrouped ? 'Strategic Hub Analysis' : 'Tactical Node Visualization'}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        {isGrouped 
                          ? `Clustering ${nodes.length} nodes by geographic proximity. Network consensus remains stable.`
                          : `Monitoring individual node health, encryption layers, and peer-to-peer handshakes.`}
                    </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {filteredNodes.map(node => (
                  <div key={node.id} className="glass-panel p-6 rounded-[2.5rem] hover:bg-slate-900/60 transition-all group relative overflow-hidden border-white/5 shadow-xl hover:shadow-2xl">
                    {node.status === 'defending' && (
                      <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none"></div>
                    )}
                    
                    {/* Header: Icon and Status */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`p-3.5 rounded-2xl shadow-lg ${
                        node.status === 'active' ? 'bg-green-500/10 text-green-400 shadow-green-900/10' : 
                        node.status === 'defending' ? 'bg-red-500/10 text-red-400 shadow-red-900/10' :
                        node.status === 'cloaked' ? 'bg-purple-500/10 text-purple-400 shadow-purple-900/10' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {getStatusIcon(node.status)}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border shadow-sm ${getStatusBadge(node.status)}`}>
                        {node.status}
                      </span>
                    </div>
                    
                    {/* Title and ID */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{node.location}</h3>
                      <div className="flex gap-1.5 mt-1">
                         {[...Array(4)].map((_, i) => (
                           <div 
                             key={i} 
                             className={`w-1.5 h-4 rounded-full transition-colors ${i < (node.status === 'active' || node.status === 'defending' ? 4 : node.status === 'syncing' ? 2 : 0) ? 'bg-blue-500' : 'bg-slate-800'}`} 
                           />
                         ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest font-mono">
                       {node.id} <span className="w-1 h-1 rounded-full bg-slate-700"></span> {node.region}
                    </div>

                    {/* Technical Grid: Throughput, Health, Encryption, Discovery */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 group-hover:bg-slate-950/60 transition-colors">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Zap size={10} className="text-amber-400" /> Throughput
                        </p>
                        <p className="text-sm font-bold text-white font-mono">{node.throughput}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 group-hover:bg-slate-950/60 transition-colors">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Activity size={10} className="text-green-400" /> Integrity
                        </p>
                        <p className="text-sm font-bold text-green-400 font-mono">{node.health}%</p>
                      </div>
                      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 group-hover:bg-slate-950/60 transition-colors">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Lock size={10} className="text-blue-400" /> Encryption
                        </p>
                        <p className="text-[10px] font-bold text-white truncate">{node.encryption}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 group-hover:bg-slate-950/60 transition-colors">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Clock size={10} className="text-slate-400" /> Identity
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{formatDiscoveryTime(node.discoveredAt)}</p>
                      </div>
                    </div>

                    {/* Latency Visualization Section: Sophisticated Signal HUD */}
                    <div className="mb-6 p-5 bg-slate-950/60 rounded-[2rem] border border-white/10 shadow-inner group-hover:border-blue-500/20 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={14} className="text-blue-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link Latency</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">
                          <Zap size={10} /> {node.latency}
                        </div>
                      </div>
                      
                      <NodeSignalHUD status={node.status} />
                    </div>

                    <button className="w-full py-4 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 group-hover:shadow-blue-900/20">
                       Examine Telemetry <ArrowRight size={14} />
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
