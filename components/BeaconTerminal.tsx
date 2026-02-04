
import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Search, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Loader2, 
  RefreshCcw,
  Wifi,
  Signal,
  AlertCircle,
  EyeOff,
  Crosshair
} from 'lucide-react';
import { SpatialNode } from '../types';

const BeaconTerminal: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isStealth, setIsStealth] = useState(false);
  const [discoveredNodes, setDiscoveredNodes] = useState<SpatialNode[]>([]);
  const [currentFreq, setCurrentFreq] = useState(433.5);
  const [log, setLog] = useState<{ msg: string; type: 'info' | 'success' | 'alert' | 'stealth' }[]>([]);
  
  const addLog = (msg: string, type: 'info' | 'success' | 'alert' | 'stealth' = 'info') => {
    setLog(prev => [{ msg, type }, ...prev].slice(0, 15));
  };

  const toggleBeacon = () => {
    setIsActive(!isActive);
    if (!isActive) {
      addLog("Active Beacon initialized. Scanning wide-spectrum spatial frequencies...", 'info');
    } else {
      addLog("Beacon deactivated. Autonomous discovery suspended.", 'alert');
      setIsStealth(false);
    }
  };

  const toggleStealth = () => {
    if (!isActive) return;
    setIsStealth(!isStealth);
    if (!isStealth) {
      addLog("STEALTH MODE ACTIVE: Initiating FHSS (Frequency Hopping Spread Spectrum).", 'stealth');
    } else {
      addLog("Stealth Mode deactivated. Resuming standard broad-spectrum broadcast.", 'info');
    }
  };

  useEffect(() => {
    let freqInterval: number;
    if (isStealth) {
      freqInterval = window.setInterval(() => {
        setCurrentFreq(parseFloat((Math.random() * 500 + 100).toFixed(1)));
      }, 1000);
    }
    return () => clearInterval(freqInterval);
  }, [isStealth]);

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        if (Math.random() > 0.7) {
          const id = `NODE-EXT-${Math.floor(Math.random() * 9000 + 1000)}`;
          addLog(`Signal detected: ${id}. Analyzing spatiotemporal signature...`, 'info');
          
          setTimeout(() => {
            addLog(`Identity verified. Handshaking with ${id}...`, 'success');
            const newNode: SpatialNode = {
              id,
              lat: Math.random() * 180 - 90,
              lng: Math.random() * 360 - 180,
              intensity: Math.random(),
              status: isStealth ? 'cloaked' : 'active',
              label: `External Node ${id}`,
              encryption: 'P2P-Layer',
              discoveredAt: Date.now()
            };
            setDiscoveredNodes(prev => [newNode, ...prev]);
            addLog(`${id} autonomously integrated into mesh.`, 'success');
          }, 2000);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, isStealth]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Active Beacon</h2>
          <p className="text-slate-400 max-w-2xl text-sm">
            The Beacon autonomously broadcasts network presence. Use Stealth Mode to evade detection during high-threat incursions.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleStealth}
            disabled={!isActive}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border ${
              isStealth 
              ? 'bg-purple-600/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
              : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white disabled:opacity-30'
            }`}
          >
            <EyeOff size={18} className={isStealth ? 'animate-pulse' : ''} />
            {isStealth ? 'Stealth Active' : 'Enter Stealth'}
          </button>
          <button 
            onClick={toggleBeacon}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl ${
              isActive 
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {isActive ? <Radio className="animate-pulse" size={20} /> : <Signal size={20} />}
            {isActive ? 'Deactivate Beacon' : 'Activate Autonomous Beacon'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden">
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 animate-pulse ${isStealth ? 'bg-purple-600/5' : 'bg-blue-600/5'}`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border rounded-full animate-[ping_4s_linear_infinite] ${isStealth ? 'border-purple-500/10' : 'border-blue-500/20'}`}></div>
              </div>
            )}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative transition-colors ${isActive ? (isStealth ? 'bg-purple-500/10' : 'bg-blue-500/10') : 'bg-slate-800'}`}>
              {isStealth ? <EyeOff className="text-purple-400" size={40} /> : <Wifi className={isActive ? 'text-blue-400' : 'text-slate-500'} size={40} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Discovery Engine</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isStealth ? 'text-purple-400' : 'text-blue-400'}`}>
              {isActive ? (isStealth ? 'FHSS CLOAKED' : 'Transmitting Broad-Spectrum') : 'Standby Mode'}
            </p>
            
            <div className="w-full space-y-4 pt-6 border-t border-white/5 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Current Freq</span>
                <span className={`font-mono font-bold ${isStealth ? 'text-purple-400' : 'text-blue-400'}`}>
                   {isActive ? `${currentFreq} MHz` : '--'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Mode</span>
                <span className="text-white font-mono font-bold">{isStealth ? 'DYNAMIC' : 'STATIC'}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-slate-950/40">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <AlertCircle size={14} /> Mesh Protocols
             </h4>
             <div className="space-y-2">
                {[
                  { l: 'Cloaking', v: isStealth ? 'ACTIVE' : 'OFF', c: isStealth ? 'text-purple-400' : 'text-slate-500' },
                  { l: 'Auto-Recruit', v: 'ENABLED', c: 'text-green-400' },
                  { l: 'Encryption', v: 'RSA-Q 8k', c: 'text-blue-400' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{s.l}</span>
                    <span className={`text-[10px] font-black ${s.c}`}>{s.v}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Discovery Log */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] p-10 flex flex-col h-full min-h-[600px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isStealth ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}`}>
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Live Discovery Feed</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                   {isStealth ? 'Stealth Recruitment Active' : 'Real-time Node Integration'}
                </p>
              </div>
            </div>
            {isActive && (
              <div className={`flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-[0.2em] animate-pulse ${isStealth ? 'text-purple-400 bg-purple-400/10 border-purple-500/20' : 'text-blue-400 bg-blue-400/10 border-blue-500/20'}`}>
                {isStealth ? 'Cloaked Scan' : 'Active Scan'}
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner overflow-y-auto custom-scrollbar font-mono text-xs">
            {log.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                <Radio size={40} />
                <p className="uppercase tracking-widest">Awaiting Beacon Activation</p>
              </div>
            ) : (
              <div className="space-y-3">
                {log.map((entry, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-xl border border-white/5 animate-in slide-in-from-left-2 ${
                    entry.type === 'success' ? 'bg-green-500/5 text-green-400' :
                    entry.type === 'alert' ? 'bg-red-500/5 text-red-400' :
                    entry.type === 'stealth' ? 'bg-purple-500/5 text-purple-400 border-purple-500/20' :
                    'bg-white/5 text-slate-400'
                  }`}>
                    <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                    <span className="font-bold">{entry.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <div className="flex-1 p-6 glass-panel rounded-2xl border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neighbor Density</span>
                 <span className="text-sm font-bold text-white">{discoveredNodes.length}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {discoveredNodes.slice(0, 5).map((n, i) => (
                  <div key={i} className={`flex-shrink-0 px-3 py-1 border rounded-lg text-[10px] font-bold ${n.status === 'cloaked' ? 'bg-purple-600/10 border-purple-500/20 text-purple-400' : 'bg-blue-600/10 border-blue-500/20 text-blue-400'}`}>
                    {n.id}
                  </div>
                ))}
                {discoveredNodes.length > 5 && <span className="text-[10px] text-slate-600 flex items-center">+{discoveredNodes.length - 5} more</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeaconTerminal;
