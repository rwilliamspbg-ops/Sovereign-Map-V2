
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
  AlertCircle
} from 'lucide-react';
import { SpatialNode } from '../types';

const BeaconTerminal: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [discoveredNodes, setDiscoveredNodes] = useState<SpatialNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [log, setLog] = useState<{ msg: string; type: 'info' | 'success' | 'alert' }[]>([]);
  
  const addLog = (msg: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setLog(prev => [{ msg, type }, ...prev].slice(0, 15));
  };

  const toggleBeacon = () => {
    setIsActive(!isActive);
    if (!isActive) {
      addLog("Active Beacon initialized. Scanning wide-spectrum spatial frequencies...", 'info');
    } else {
      addLog("Beacon deactivated. Autonomous discovery suspended.", 'alert');
    }
  };

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
              status: 'active',
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
  }, [isActive]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Active Beacon</h2>
          <p className="text-slate-400 max-w-2xl text-sm">
            The Beacon autonomously broadcasts network presence to identify and recruit external spatial nodes into the Sovereign Mesh.
          </p>
        </div>
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden">
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-blue-500/20 rounded-full animate-[ping_4s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-blue-500/10 rounded-full animate-[ping_6s_linear_infinite]"></div>
              </div>
            )}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative ${isActive ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
              <Wifi className={isActive ? 'text-blue-400' : 'text-slate-500'} size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Discovery Engine</h3>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
              {isActive ? 'Transmitting On-Frequency' : 'Standby Mode'}
            </p>
            
            <div className="w-full space-y-4 pt-6 border-t border-white/5 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase">Signal Strength</span>
                <span className="text-blue-400 font-mono font-bold">{isActive ? '92dBm' : '0'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase">Coverage Radius</span>
                <span className="text-blue-400 font-mono font-bold">{isActive ? '5.2km' : '0'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase">Nodes Discovered</span>
                <span className="text-green-400 font-mono font-bold">{discoveredNodes.length}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-white/5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <AlertCircle size={14} /> Protocol Status
             </h4>
             <div className="space-y-2">
                {[
                  { l: 'Auto-Recruit', v: 'ENABLED', c: 'text-green-400' },
                  { l: 'Auth Method', v: 'SPATIAL-CERT', c: 'text-blue-400' },
                  { l: 'Encryption', v: 'LOCKED', c: 'text-purple-400' },
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
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Live Discovery Feed</h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Real-time Node Recruitment</p>
              </div>
            </div>
            {isActive && (
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-[0.2em] animate-pulse">
                Active Scan
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
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Newly Integrated Nodes</span>
                 <span className="text-sm font-bold text-white">{discoveredNodes.length}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {discoveredNodes.slice(0, 5).map((n, i) => (
                  <div key={i} className="flex-shrink-0 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-400">
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
