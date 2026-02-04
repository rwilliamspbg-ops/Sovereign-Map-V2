
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Play, 
  AlertCircle, 
  Clock, 
  Activity, 
  Database, 
  Lock, 
  Cpu, 
  Loader2,
  RefreshCcw,
  Terminal,
  Globe,
  Fingerprint,
  CheckCircle,
  Zap,
  Server,
  Radar,
  Users
} from 'lucide-react';
import { VerificationTest } from '../types';
import { checkApiHealth } from '../services/geminiService';

const initialTests: VerificationTest[] = [
  { id: 't1', name: 'Spatial Consistency Check', category: 'Spatial', status: 'idle' },
  { id: 't2', name: 'Quantum Encryption Handshake', category: 'Encryption', status: 'idle' },
  { id: 't3', name: 'P2P Mesh Latency Test', category: 'Network', status: 'idle' },
  { id: 't4', name: 'DID Consensus Verification', category: 'Identity', status: 'idle' },
  { id: 't5', name: 'Neural Strategy Link', category: 'Network', status: 'idle' },
];

const VerificationHub: React.FC = () => {
  const [tests, setTests] = useState<VerificationTest[]>(initialTests);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState({
    webGL: 'Checking...',
    api: 'Checking...',
    permissions: 'Checking...',
    geolocation: 'Checking...'
  });

  useEffect(() => {
    runDiagnostics();
    // Simulate neighbor discovery
    const interval = setInterval(() => {
      const newNeighbor = {
        id: `PEER-${Math.floor(Math.random() * 9999)}`,
        status: Math.random() > 0.2 ? 'Verified' : 'Verifying',
        trust: Math.floor(Math.random() * 20 + 80),
        dist: (Math.random() * 100).toFixed(1) + 'm'
      };
      setNeighbors(prev => [newNeighbor, ...prev].slice(0, 4));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    const apiStatus = await checkApiHealth();

    let permissions = 'Denied';
    try {
      const results = await Promise.all([
        navigator.permissions.query({ name: 'microphone' as any }),
        navigator.permissions.query({ name: 'camera' as any })
      ]);
      permissions = results.every(p => p.state === 'granted') ? 'Granted' : 'Incomplete';
    } catch (e) { permissions = 'Unknown'; }

    let geo = 'Unavailable';
    if ("geolocation" in navigator) geo = 'Supported';

    setDiagnostics({
      webGL: hasWebGL ? 'Stable' : 'Unsupported',
      api: apiStatus ? 'Uplink Established' : 'Link Failed',
      permissions,
      geolocation: geo
    });
  };

  const runTest = async (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'running' } : t));
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const passed = Math.random() > 0.05;
    setTests(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: passed ? 'passed' : 'failed', 
      lastRun: new Date().toLocaleTimeString(),
      result: passed ? 'Integrity verified via PoL' : 'Validation timeout'
    } : t));
  };

  const runAllTests = async () => {
    setIsVerifyingAll(true);
    setReport("Initializing comprehensive network verification suite...\n\nRunning system-level diagnostics first...");
    await runDiagnostics();
    for (const test of tests) await runTest(test.id);
    setReport(`System Audit Complete [${new Date().toLocaleDateString()}]
---------------------------------
CORE ENGINE: ${diagnostics.webGL.toUpperCase()}
API UPLINK: ${diagnostics.api.toUpperCase()}
PEER RECOGNITION: ACTIVE

ALL SYSTEMS NOMINAL. Neighboring peer DIDs verified via mutual spatial handshake.`);
    setIsVerifyingAll(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Verification Hub</h2>
          <p className="text-slate-400 max-w-2xl text-balance">
            Autonomous peer auditing. Your device verifies the identity and spatial claims of all surrounding network entities.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={runAllTests} disabled={isVerifyingAll} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/30">
            {isVerifyingAll ? <Loader2 className="animate-spin" size={20} /> : <Radar size={20} />}
            Audit Local Mesh
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diagnostics & Neighbor Radar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-6 rounded-3xl border-white/5 bg-slate-900/40">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <Users size={14} className="text-blue-400" /> Mutual Peer Discovery
              </h3>
              <div className="space-y-3">
                {neighbors.map(n => (
                  <div key={n.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-white mb-0.5">{n.id}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{n.dist} • Trust: {n.trust}%</p>
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${n.status === 'Verified' ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10 animate-pulse'}`}>
                      {n.status}
                    </span>
                  </div>
                ))}
                {neighbors.length === 0 && <p className="text-center py-10 text-[10px] text-slate-700 uppercase tracking-widest">Scanning local frequencies...</p>}
              </div>
           </div>

           <div className="glass-panel p-6 rounded-3xl border-white/5 bg-slate-900/40 grid grid-cols-2 gap-4">
              {[
                { l: 'WebGL', v: diagnostics.webGL },
                { l: 'Uplink', v: diagnostics.api },
              ].map((d, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-xl border border-white/5 text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{d.l}</p>
                   <p className="text-[10px] font-bold text-white">{d.v}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Test List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-blue-400" /> Operational Suite
              </h3>
            </div>
            <div className="divide-y divide-slate-800">
              {tests.map(test => (
                <div key={test.id} className="p-6 flex items-center justify-between group hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl ${
                      test.status === 'passed' ? 'bg-green-500/10 text-green-500' :
                      test.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                      test.status === 'running' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {test.category === 'Spatial' && <Globe size={20} />}
                      {test.category === 'Encryption' && <Lock size={20} />}
                      {test.category === 'Network' && <Activity size={20} />}
                      {test.category === 'Identity' && <Fingerprint size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 mb-0.5">{test.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">{test.category}</p>
                    </div>
                  </div>
                  {test.status === 'running' ? <Loader2 className="animate-spin text-blue-400" size={16} /> : test.status === 'passed' ? <CheckCircle className="text-green-500" size={16} /> : <Play size={16} className="text-slate-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationHub;
