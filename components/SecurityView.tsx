
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Fingerprint,
  Radio,
  Eye,
  Crosshair,
  Shield,
  Loader2,
  AlertCircle,
  Minimize2,
  Share2,
  Ghost,
  Cpu,
  Search,
  ChevronRight,
  ShieldQuestion
} from 'lucide-react';
import { analyzeThreatVector, determineDefenseManeuver } from '../services/geminiService';

const SecurityView: React.FC = () => {
  const [threatLevel, setThreatLevel] = useState(12);
  const [isRotating, setIsRotating] = useState(false);
  const [continuousProtection, setContinuousProtection] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [firewallBlocks, setFirewallBlocks] = useState<any[]>([]);
  const [aiAdvisory, setAiAdvisory] = useState<string>("Initializing neural defense monitoring. Awaiting network telemetry...");
  const [loadingAdvisory, setLoadingAdvisory] = useState(false);
  const [activeManeuvers, setActiveManeuvers] = useState<string[]>([]);
  const [isDeepScanning, setIsDeepScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const logTypes = [
        { type: 'encryption_rotation', status: 'SUCCESS', weight: 0.6 },
        { type: 'handshake_verified', status: 'SUCCESS', weight: 0.2 },
        { type: 'intrusion_blocked', status: 'SUCCESS', weight: 0.1 },
        { type: 'unusual_peer_density', status: 'WARNING', weight: 0.05 },
        { type: 'latency_spike_detected', status: 'WARNING', weight: 0.05 }
      ];

      const r = Math.random();
      let selectedType = logTypes[0];
      let sum = 0;
      for (const t of logTypes) {
        sum += t.weight;
        if (r <= sum) {
          selectedType = t;
          break;
        }
      }

      const newLog = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        type: selectedType.type,
        node: `NODE-${Math.floor(Math.random() * 999)}`,
        timestamp: new Date().toLocaleTimeString(),
        status: selectedType.status,
        payloadSize: `${(Math.random() * 100).toFixed(2)} KB`,
        origin: `SEC-${Math.floor(Math.random() * 100)}`
      };

      setLogs(prev => [newLog, ...prev].slice(0, 20));

      if (selectedType.type === 'intrusion_blocked' || Math.random() > 0.8) {
        const block = {
          id: `BLOCK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          reason: ['Protocol Mismatch', 'Unverified DID', 'Spatial Drift Limit Exceeded', 'Excessive Handshake', 'Sync Divergence'][Math.floor(Math.random() * 5)],
          time: new Date().toLocaleTimeString(),
          severity: Math.random() > 0.7 ? 'HIGH' : 'MEDIUM'
        };
        setFirewallBlocks(prev => [block, ...prev].slice(0, 10));
        
        if (block.severity === 'HIGH' && threatLevel < 80) {
          setThreatLevel(prev => Math.min(100, prev + 5));
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [threatLevel]);

  const triggerAutoDefense = async (vector: string) => {
    setLoadingAdvisory(true);
    const recommendation = await determineDefenseManeuver(vector, threatLevel);
    if (recommendation) {
      setAiAdvisory(`AUTONOMOUS DEFENSE TRIGGERED: ${recommendation}`);
      if (recommendation.toLowerCase().includes('isolation')) setActiveManeuvers(p => [...p, 'Isolation']);
      if (recommendation.toLowerCase().includes('scrambling')) setActiveManeuvers(p => [...p, 'Signal Scrambling']);
    }
    setLoadingAdvisory(false);
    setThreatLevel(prev => Math.min(100, prev + 15));
  };

  const handleDeepScan = async () => {
    setIsDeepScanning(true);
    setLoadingAdvisory(true);
    setAiAdvisory("Performing deep packet inspection and heuristic log analysis...");
    
    // Combine logs and blocks for a richer analysis context
    const analysisContext = {
      recentLogs: logs,
      firewallBlocks: firewallBlocks,
      currentThreatLevel: threatLevel,
      activeManeuvers: activeManeuvers
    };

    try {
      const result = await analyzeThreatVector(analysisContext as any);
      if (result) {
        setAiAdvisory(result);
        // If Gemini detects a specific serious threat, we might react
        if (result.toLowerCase().includes("attack") || result.toLowerCase().includes("sybil") || result.toLowerCase().includes("eclipse")) {
          setThreatLevel(prev => Math.min(100, prev + 10));
        }
      }
    } catch (error) {
      setAiAdvisory("Neural link error during deep scan. Falling back to local heuristic monitoring.");
    } finally {
      setLoadingAdvisory(false);
      setIsDeepScanning(false);
    }
  };

  const rotateKeys = () => {
    setIsRotating(true);
    setAiAdvisory("Initiating master key rotation across all mesh nodes. Synchronizing new entropy seeds...");
    setTimeout(() => {
      setIsRotating(false);
      setThreatLevel(prev => Math.max(8, prev - 10));
      setAiAdvisory("Master key rotation successful. Network integrity re-established.");
    }, 2500);
  };

  const clearManeuver = (name: string) => {
    setActiveManeuvers(prev => prev.filter(m => m !== name));
    setThreatLevel(prev => Math.max(12, prev - 10));
  };

  const getThreatColor = () => {
    if (threatLevel < 20) return 'text-blue-400';
    if (threatLevel < 50) return 'text-amber-400';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1 uppercase">Security Ops</h2>
          <div className="flex items-center gap-3">
            <p className="text-slate-400 text-xs italic">Quantum-shielding active across mesh defense.</p>
            <div className="flex items-center gap-2 ml-2">
              <span className={`w-2 h-2 rounded-full ${continuousProtection ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Auto-Mitigation</span>
              <button 
                onClick={() => setContinuousProtection(!continuousProtection)}
                className={`w-8 h-4 rounded-full transition-colors ${continuousProtection ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${continuousProtection ? 'translate-x-4' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDeepScan}
            disabled={isDeepScanning || loadingAdvisory}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all border border-white/5 text-sm active:scale-95 disabled:opacity-50"
          >
            {isDeepScanning ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Deep Threat Scan
          </button>
          <button 
            onClick={rotateKeys}
            disabled={isRotating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRotating ? 'animate-spin' : ''} />
            {isRotating ? 'Rotating Keys...' : 'Rotate Keys'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Gauge & Intelligence Advisory */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden flex-1 min-h-[350px] hud-border">
            {activeManeuvers.length > 0 && (
               <div className="absolute inset-0 border-4 border-red-500/20 rounded-[2.5rem] animate-[pulse_2s_infinite] pointer-events-none"></div>
            )}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.03)" strokeWidth="14" fill="transparent" />
                <circle
                  cx="50%" cy="50%" r="42%"
                  stroke="currentColor" strokeWidth="14" fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - threatLevel / 100)}
                  className={`${getThreatColor()} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black font-mono tracking-tighter ${getThreatColor()}`}>{threatLevel}%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Threat Index</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 ${threatLevel > 50 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
              <ShieldCheck size={14} /> {threatLevel < 20 ? 'Optimal' : threatLevel < 50 ? 'Elevated' : 'Defensive Action'}
            </div>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-6 flex flex-col gap-4 bg-slate-950/40 hud-border">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-amber-400" /> Active Maneuvers
             </h4>
             <div className="space-y-2">
                {[
                  { name: 'Isolation', icon: <Minimize2 size={12} />, desc: 'Node Sandbox active' },
                  { name: 'Signal Scrambling', icon: <Ghost size={12} />, desc: 'FHSS decoy frequency' },
                  { name: 'Consensus Migration', icon: <Share2 size={12} />, desc: 'Parallel L2 relocation' },
                ].map((m) => (
                  <button 
                    key={m.name}
                    onClick={() => activeManeuvers.includes(m.name) ? clearManeuver(m.name) : setActiveManeuvers(p => [...p, m.name])}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      activeManeuvers.includes(m.name) 
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-xl' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${activeManeuvers.includes(m.name) ? 'bg-red-500/20' : 'bg-slate-900'}`}>
                        {m.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{m.name}</p>
                        <p className="text-[9px] text-slate-500 font-medium">{m.desc}</p>
                      </div>
                    </div>
                    {activeManeuvers.includes(m.name) ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Tactical Controls & Advisory */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Neural Advisory HUD */}
          <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col gap-4 bg-blue-950/10 border-blue-500/10 min-h-[180px] hud-border">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={16} /> Neural Defense Intelligence
              </h4>
              <div className="flex items-center gap-2">
                 {loadingAdvisory && <span className="text-[9px] font-black text-blue-500 animate-pulse">ANALYZING...</span>}
                 <ShieldQuestion size={14} className="text-blue-500/40" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/60 rounded-3xl border border-white/5 font-mono text-xs shadow-inner">
              <div className="flex gap-3">
                 <span className="text-blue-500 font-bold shrink-0">ORACLE@SOVEREIGN:~$</span>
                 <p className="text-slate-200 leading-relaxed font-medium">
                    {loadingAdvisory ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> 
                        Performing heuristic correlation on {logs.length} data points...
                      </span>
                    ) : aiAdvisory}
                 </p>
              </div>
            </div>
            {aiAdvisory.length > 100 && !loadingAdvisory && (
               <div className="flex justify-end">
                  <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                     Export Mitigation Report <Share2 size={10} />
                  </button>
               </div>
            )}
          </div>

          {/* Core Monitoring Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Neural Crypto', desc: 'RSA-Q 8k Layer', icon: <Lock size={20} />, status: 'VERIFIED', color: 'text-purple-400' },
              { title: 'DID Handshake', desc: 'Trust Level: High', icon: <Fingerprint size={20} />, status: 'SECURE', color: 'text-blue-400' },
              { title: 'Sentry Pulse', desc: 'Deep Packet Inspection', icon: <Activity size={20} />, status: activeManeuvers.length > 0 ? 'ALERT' : 'NOMINAL', color: 'text-amber-400' },
              { title: 'Auto-Block', desc: 'Adaptive Firewall', icon: <Radio size={20} />, status: continuousProtection ? 'ENABLED' : 'MANUAL', color: 'text-green-400' },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 rounded-[2rem] flex items-center justify-between group hover:bg-slate-900/40 transition-all border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 bg-slate-900/60 rounded-2xl ${item.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Firewall Logs */}
          <div className="glass-panel flex-1 rounded-[2.5rem] p-8 flex flex-col bg-red-950/5 border-red-500/10 overflow-hidden min-h-[300px] hud-border">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={18} /> Firewall Intercepts
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-slate-600">CAPACITY: 2.4 TB/S</span>
                  <div className="flex gap-1 h-3 items-center">
                    {[0.2, 0.4, 0.8, 0.5, 0.3].map((h, i) => (
                      <div key={i} className="w-1 bg-red-500/30 rounded-full" style={{ height: `${h * 100}%` }}></div>
                    ))}
                  </div>
                </div>
             </div>
             <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
                {firewallBlocks.map((block, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-red-600/5 border border-red-500/10 rounded-2xl animate-in slide-in-from-right-2 hover:bg-red-600/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-xl"><Crosshair size={14}/></div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-[11px] font-black text-white">{block.id}</p>
                           {block.severity === 'HIGH' && <span className="text-[7px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded">CRITICAL</span>}
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">{block.reason}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-400/60">{block.time}</span>
                  </div>
                ))}
                {firewallBlocks.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-3 grayscale">
                    <ShieldCheck size={48} />
                    <p className="italic text-[10px] text-slate-500 font-black uppercase tracking-widest">Awaiting sector incursions</p>
                  </div>
                )}
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] font-black text-slate-600 uppercase">Auto-rejection enabled</p>
                <button className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Clear Stack</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
