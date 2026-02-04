
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  MapPin, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  Clock,
  Hexagon
} from 'lucide-react';
import { generateSovereignNarrative } from '../services/geminiService';

const IdentityView: React.FC = () => {
  const [alias, setAlias] = useState("Alpha-Omega-42");
  const [briefing, setBriefing] = useState("");
  const [loadingBriefing, setLoadingBriefing] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      setLoadingBriefing(true);
      const text = await generateSovereignNarrative(alias);
      setBriefing(text);
      setLoadingBriefing(false);
    };
    fetchBriefing();
  }, [alias]);

  const identityStats = [
    { label: 'Uptime', value: '1,492 hours' },
    { label: 'Verified Links', value: '438' },
    { label: 'Sovereign Tier', value: 'Architect' },
    { label: 'Reputation', value: '98.2%' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Sovereign Identity</h2>
        <p className="text-slate-400">Manage your digital footprint and network standing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ID Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-20">
                <Hexagon size={120} className="text-blue-500" />
            </div>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mb-4 relative">
                <Shield className="text-blue-500" size={40} />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-4 border-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{alias}</h3>
              <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.2em]">Sovereign Node Operator</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-mono uppercase tracking-widest text-[10px]">Public Key</span>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-mono text-xs">0x74B...8F2C</span>
                  <button className="text-slate-600 hover:text-blue-400"><Copy size={12} /></button>
                </div>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[85%]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>REPUTATION SYNC</span>
                <span>85% COMPLETED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {identityStats.map((s, i) => (
                 <div key={i} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">{s.label}</p>
                   <p className="text-sm font-bold text-blue-100">{s.value}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Key className="text-blue-500" size={16} /> Secure Access Logs
            </h4>
            <div className="space-y-3">
               {[
                 { action: 'Node Uplink', time: '2 mins ago', status: 'Success' },
                 { action: 'Key Rotation', time: '1 hour ago', status: 'Success' },
                 { action: 'Encrypted Fetch', time: '3 hours ago', status: 'Success' },
               ].map((log, i) => (
                 <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="text-slate-200">{log.action}</p>
                      <p className="text-slate-500 flex items-center gap-1"><Clock size={10} /> {log.time}</p>
                    </div>
                    <span className="text-green-500 font-bold">{log.status}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Briefing & Credentials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Shield className="text-blue-400" /> Neural Briefing
              </h3>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                AI GENERATED • TOP SECRET
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none text-blue-100/80 leading-relaxed font-mono text-sm whitespace-pre-wrap">
              {loadingBriefing ? (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                  Generating sector intelligence...
                </div>
              ) : briefing}
            </div>

            <div className="mt-8 pt-6 border-t border-blue-500/10 flex flex-wrap gap-4">
               <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                 <MapPin size={14} /> View Sector Influence
               </button>
               <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                 <ExternalLink size={14} /> Export Credentials
               </button>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Active Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Spatial Architect', description: 'Verified ability to map complex 3D meshes.', date: 'Dec 2023', icon: <Hexagon /> },
                { title: 'Data Guardian', description: 'Maintained 100% data integrity for 6 months.', date: 'Jan 2024', icon: <Shield /> },
              ].map((cred, i) => (
                <div key={i} className="bg-slate-800/30 border border-slate-700 p-4 rounded-2xl flex gap-4 hover:border-blue-500/40 transition-colors cursor-pointer group">
                  <div className="p-3 bg-slate-800 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                    {cred.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{cred.title}</h4>
                    <p className="text-xs text-slate-500 mb-1">{cred.description}</p>
                    <span className="text-[10px] font-mono text-blue-500/60">{cred.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityView;
