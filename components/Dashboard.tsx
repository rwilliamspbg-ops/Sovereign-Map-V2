
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Zap, 
  Cpu, 
  Layers, 
  AlertCircle, 
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
  Globe,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { analyzeSpatialTrends } from '../services/geminiService';
import SpatialCanvas from './SpatialCanvas';

const mockData = [
  { time: '00:00', load: 40, nodes: 2400 },
  { time: '04:00', load: 30, nodes: 2580 },
  { time: '08:00', load: 65, nodes: 2800 },
  { time: '12:00', load: 85, nodes: 3200 },
  { time: '16:00', load: 70, nodes: 3100 },
  { time: '20:00', load: 50, nodes: 3400 },
];

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    refreshInsight();
  }, []);

  const refreshInsight = async () => {
    setLoadingInsight(true);
    const result = await analyzeSpatialTrends([{id: 'node-x', status: 'active'}]);
    setAiInsight(result || "Analysis complete. Mesh stable.");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mesh Overview</h2>
          <p className="text-slate-400">Monitoring sovereign digital expansion across nodes.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshInsight}
            disabled={loadingInsight}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loadingInsight ? 'animate-spin' : ''} />
            Recalibrate Mesh
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Mesh Nodes', value: '42,891', icon: <Layers className="text-blue-500" />, trend: '+12%' },
          { label: 'Network Throughput', value: '1.4 PB/s', icon: <Zap className="text-amber-500" />, trend: '+5%' },
          { label: 'Neural Processing', value: '88.4 TFLOPS', icon: <Cpu className="text-purple-500" />, trend: '+22%' },
          { label: 'Reputation Pool', value: '984K $SOV', icon: <ShieldCheck className="text-green-500" />, trend: '+2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-mono">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Spatial Map */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-blue-400">
              <Globe size={14} /> Real-time Spatial Awareness
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> NODES ACTIVE
              </span>
            </div>
          </div>
          <div className="flex-1 relative bg-[#020617]">
             <SpatialCanvas />
          </div>
        </div>

        {/* Gemini AI Intelligence Sidebar */}
        <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Sparkles size={120} className="text-blue-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-blue-400" size={20} />
            <h3 className="font-bold text-blue-100 uppercase tracking-widest text-xs">AI Strategy Unit</h3>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-blue-500/10 flex-1 overflow-y-auto font-mono text-sm text-blue-100 leading-relaxed whitespace-pre-wrap">
            {loadingInsight ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <RefreshCcw className="animate-spin text-blue-500" size={32} />
                <p className="text-blue-400/60 animate-pulse uppercase tracking-widest text-[10px]">Analyzing Mesh Integrity...</p>
              </div>
            ) : aiInsight}
          </div>
          <button 
            onClick={() => window.alert('Opening detailed strategy portal...')}
            className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold transition-all text-xs uppercase tracking-widest"
          >
            Explore Neural Strategy
          </button>
        </div>
      </div>

      {/* Network Load Graph */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <Activity size={14} className="text-blue-500" />
          Synchronized Mesh Throughput
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
