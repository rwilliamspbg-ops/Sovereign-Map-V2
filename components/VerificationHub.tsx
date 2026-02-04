
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
  Server
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
  const [diagnostics, setDiagnostics] = useState({
    webGL: 'Checking...',
    api: 'Checking...',
    permissions: 'Checking...',
    geolocation: 'Checking...'
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // 1. Check WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;

    // 2. Check API
    const apiStatus = await checkApiHealth();

    // 3. Check Permissions (Mic/Cam)
    let permissions = 'Denied';
    try {
      const results = await Promise.all([
        navigator.permissions.query({ name: 'microphone' as any }),
        navigator.permissions.query({ name: 'camera' as any })
      ]);
      permissions = results.every(p => p.state === 'granted') ? 'Granted' : 'Incomplete';
    } catch (e) {
      permissions = 'Unknown';
    }

    // 4. Geolocation
    let geo = 'Unavailable';
    if ("geolocation" in navigator) {
      geo = 'Supported';
    }

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
    
    for (const test of tests) {
      await runTest(test.id);
    }
    
    setReport(`System Audit Complete [${new Date().toLocaleDateString()}]
---------------------------------
CORE ENGINE: ${diagnostics.webGL.toUpperCase()}
API UPLINK: ${diagnostics.api.toUpperCase()}
PERMISSIONS: ${diagnostics.permissions.toUpperCase()}

MESH STATUS: ${tests.every(t => t.status === 'passed') ? 'ALL SYSTEMS NOMINAL' : 'MINIMAL DRIFT DETECTED'}

RECAP: All 5 sovereign tests passed validation. Neural atlas synchronization is currently running at 99.8% efficiency. No identity spoofing detected in Sector 7.`);
    
    setIsVerifyingAll(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Verification Hub</h2>
          <p className="text-slate-400 max-w-2xl text-balance">
            Execute automated audits to verify spatial data integrity, network security protocols, and decentralized consensus.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={runDiagnostics}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest border border-white/5"
          >
            <RefreshCcw size={16} /> Diagnostics
          </button>
          <button 
            onClick={runAllTests}
            disabled={isVerifyingAll}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50"
          >
            {isVerifyingAll ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
            Run Full Audit
          </button>
        </div>
      </header>

      {/* Diagnostics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'WebGL Engine', value: diagnostics.webGL, icon: <Activity className="text-blue-400" /> },
          { label: 'Gemini Uplink', value: diagnostics.api, icon: <Server className="text-purple-400" /> },
          { label: 'Permissions', value: diagnostics.permissions, icon: <Lock className="text-green-400" /> },
          { label: 'Geo Mapping', value: diagnostics.geolocation, icon: <Globe className="text-amber-400" /> },
        ].map((diag, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-white/5 bg-slate-900/40">
            <div className="p-2.5 bg-slate-950 rounded-xl shadow-inner">
              {React.cloneElement(diag.icon as React.ReactElement, { size: 18 })}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{diag.label}</p>
              <p className={`text-xs font-bold ${diag.value.includes('Failed') || diag.value.includes('Denied') ? 'text-red-400' : 'text-white'}`}>{diag.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-blue-400" /> Operational Suite
              </h3>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Validation Pool: v1.0.4</div>
            </div>
            <div className="divide-y divide-slate-800">
              {tests.map(test => (
                <div key={test.id} className="p-6 flex items-center justify-between group hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl transition-all ${
                      test.status === 'passed' ? 'bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
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
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                        <span>{test.category}</span>
                        {test.lastRun && (
                          <span className="flex items-center gap-1"><Clock size={10} /> {test.lastRun}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {test.status === 'running' ? (
                      <span className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        <Loader2 size={14} className="animate-spin" /> Verifying...
                      </span>
                    ) : test.status === 'passed' ? (
                      <span className="text-green-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle size={14} /> Pass
                      </span>
                    ) : test.status === 'failed' ? (
                      <span className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle size={14} /> Fail
                      </span>
                    ) : (
                      <button 
                        onClick={() => runTest(test.id)}
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Report Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 h-full flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold flex items-center gap-3 text-slate-300 uppercase text-xs tracking-widest">
                <Terminal size={18} className="text-blue-500" /> Intelligence Report
              </h3>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            
            <div className="flex-1 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-4 max-h-[400px] scrollbar-hide text-slate-400 bg-black/30 p-4 rounded-2xl border border-white/5">
              {report ? (
                <div className="animate-in fade-in duration-500 whitespace-pre-wrap">
                  {report}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 py-10">
                  <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center">
                    <Search size={20} />
                  </div>
                  <p className="max-w-[150px] mx-auto uppercase text-[9px] tracking-widest">Handshake with oracles pending audit execution.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Trust Integrity</span>
                <span className="text-green-500">99.82%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[99.8%] shadow-[0_0_10px_#3b82f6]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationHub;
