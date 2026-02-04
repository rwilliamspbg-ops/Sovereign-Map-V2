
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  Hexagon,
  Coins,
  ArrowUpRight,
  Info,
  QrCode,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Key,
  Database,
  Lock,
  Zap,
  UserCheck
} from 'lucide-react';
import { generateSovereignNarrative, generateStakingAdvisory } from '../services/geminiService';

type VerificationStatus = 'unverified' | 'challenging' | 'signing' | 'verifying' | 'verified';

const IdentityView: React.FC = () => {
  const [alias, setAlias] = useState("Alpha-Omega-42");
  const [briefing, setBriefing] = useState("");
  const [stakingAdvisory, setStakingAdvisory] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Verification State
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [challenge, setChallenge] = useState<string>("");
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [narrative, advisory] = await Promise.all([
        generateSovereignNarrative(alias),
        generateStakingAdvisory("0x74B...8F2C")
      ]);
      setBriefing(narrative);
      setStakingAdvisory(advisory);
      setLoading(false);
    };
    fetchData();
  }, [alias]);

  const initiateVerification = () => {
    setVerificationStatus('challenging');
    const randomChallenge = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setChallenge(randomChallenge);
  };

  const signChallenge = () => {
    setVerificationStatus('signing');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setVerificationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        verifyOnMesh();
      }
    }, 30);
  };

  const verifyOnMesh = () => {
    setVerificationStatus('verifying');
    // Simulate mesh consensus verification
    setTimeout(() => {
      setVerificationStatus('verified');
      setBriefing(prev => `[IDENTITY VERIFIED] ${prev}\n\nTrust Level: ARCHITECT. Your spatial credentials have been anchored to the global L1 mesh.`);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5">Sovereign Identity</h2>
          <p className="text-slate-400 text-xs">Credentials and staking management console.</p>
        </div>
        {verificationStatus === 'verified' && (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in">
            <UserCheck size={16} /> Verified Architect
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-white/10 relative overflow-hidden shadow-2xl flex flex-col items-center">
            {verificationStatus === 'verified' && (
              <div className="absolute top-4 right-4 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                <ShieldCheck size={20} />
              </div>
            )}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mb-4 group relative">
              <Fingerprint className={`text-blue-400 group-hover:scale-110 transition-transform ${verificationStatus === 'verifying' ? 'animate-pulse' : ''}`} size={32} />
              {verificationStatus === 'verified' && (
                <div className="absolute inset-0 rounded-2xl border-2 border-green-500/50 animate-[ping_3s_linear_infinite]"></div>
              )}
            </div>
            <h3 className="text-xl font-black text-white">{alias}</h3>
            <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.3em] mb-4">L2 Spatial Architect</p>
            <div className="flex items-center gap-2 glass-panel px-3 py-1 rounded-full border-white/5 text-[9px] font-mono text-slate-500">
               0x74...F2C <Copy size={10} className="hover:text-white cursor-pointer" />
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                 <span>Mesh Reputation</span>
                 <span className={verificationStatus === 'verified' ? 'text-green-400' : 'text-blue-400'}>
                   {verificationStatus === 'verified' ? '98%' : '88%'}
                 </span>
               </div>
               <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-1000 ${verificationStatus === 'verified' ? 'bg-green-500 w-[98%]' : 'bg-blue-600 w-[88%]'}`}></div>
               </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-3">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
               <Hexagon size={14} className="text-blue-400" /> Key Credentials
             </h4>
             {[
               { name: 'Architecture Pass', level: verificationStatus === 'verified' ? 'Anchored' : 'Verified' },
               { name: 'Spatial Validator', level: verificationStatus === 'verified' ? 'Tier 5 (Max)' : 'Tier 3' },
             ].map((c, i) => (
               <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5 items-center">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${verificationStatus === 'verified' ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{c.level}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* DID Verification Challenge Block */}
          {verificationStatus !== 'verified' ? (
            <div className="glass-panel p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-950/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                 <Lock size={160} />
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
                    <ShieldAlert size={12} /> Identity Unanchored
                  </div>
                  <h3 className="text-2xl font-black text-white">Anchor Identity to Mesh</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Initiate a challenge-response handshake to verify your spatial coordinates and anchor your DID to the decentralized L1 layer.
                  </p>
                  
                  {verificationStatus === 'unverified' && (
                    <button 
                      onClick={initiateVerification}
                      className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Key size={18} /> Initiate Challenge
                    </button>
                  )}

                  {verificationStatus === 'challenging' && (
                    <div className="space-y-4 animate-in slide-in-from-top-4">
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-blue-400 break-all">
                        <p className="text-slate-500 mb-1 uppercase tracking-widest text-[8px]">Spatial Proof Challenge</p>
                        {challenge}
                      </div>
                      <button 
                        onClick={signChallenge}
                        className="w-full px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <Lock size={18} /> Sign with Neural Key
                      </button>
                    </div>
                  )}

                  {verificationStatus === 'signing' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Generating Neural Signature</span>
                        <span>{verificationProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${verificationProgress}%` }}></div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono animate-pulse">
                        <Loader2 size={12} className="animate-spin" /> Finalizing cryptographic proof...
                      </div>
                    </div>
                  )}

                  {verificationStatus === 'verifying' && (
                    <div className="space-y-4 animate-in zoom-in-95 text-center p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10">
                       <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-2" />
                       <h4 className="text-sm font-bold text-white uppercase tracking-widest">Mesh Consensus Sync</h4>
                       <p className="text-xs text-slate-400">Broadcasting proof to 12 neighboring nodes for multi-party spatial verification.</p>
                       <div className="flex gap-1 justify-center h-4 items-end">
                         {[0.5, 0.8, 0.4, 0.9, 0.7].map((v, i) => (
                           <div key={i} className="w-1.5 bg-blue-500/40 rounded-t-sm" style={{ height: `${v*100}%` }}></div>
                         ))}
                       </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex w-48 h-48 bg-slate-950/60 rounded-[3rem] border border-white/5 items-center justify-center relative shadow-inner">
                   <Database size={64} className="text-slate-800" />
                   <div className="absolute inset-0 border-2 border-white/5 rounded-[3rem] animate-[spin_10s_linear_infinite]"></div>
                   <div className="absolute inset-4 border-2 border-blue-500/10 rounded-[2.5rem] animate-[spin_15s_linear_infinite_reverse]"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl border-green-500/20 bg-green-500/5 flex items-center justify-between animate-in zoom-in-95 duration-500">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                     <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Trust Anchor Verified</h3>
                    <p className="text-xs text-green-500/80 font-medium">Your identity is cryptographically bonded to the Sector-7 Neural Mesh.</p>
                  </div>
               </div>
               <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Anchor ID</span>
                  <span className="text-xs font-mono text-green-400">SOV-7-ALPHA-VER-42</span>
               </div>
            </div>
          )}

          {/* Briefing Box */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield size={18} className="text-blue-400" /> Neural Briefing
              </h3>
              <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">LIVE FEED</span>
            </div>
            <div className="flex-1 bg-slate-950/40 p-5 rounded-2xl overflow-y-auto custom-scrollbar border border-white/5">
              <p className="text-slate-300 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                {loading ? "Decrypting briefing data stream..." : briefing}
              </p>
            </div>
          </div>

          {/* Staking & Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <Coins size={18} className="text-purple-400" />
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest">Rewards</h4>
                 </div>
                 <span className={`font-bold text-xs ${verificationStatus === 'verified' ? 'text-green-400' : 'text-slate-500'}`}>
                   {verificationStatus === 'verified' ? '+15.8% APY' : '+12.4% APY'}
                 </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 italic">
                {stakingAdvisory || "Optimization strategy pending network sync..."}
              </p>
              <button className="w-full py-3 bg-white text-slate-950 hover:bg-slate-200 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 shadow-lg transition-all">
                Stake $SOV
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-white/5 space-y-3">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Info size={14} /> Quick Stats
               </h4>
               {[
                 { l: 'Available', v: '1,248.5 $SOV' },
                 { l: 'Network Reputation', v: verificationStatus === 'verified' ? 'Exemplary (Tier 1)' : 'High' },
                 { l: 'Identity Score', v: verificationStatus === 'verified' ? '98.2' : '72.4' },
               ].map((row, i) => (
                 <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-slate-400 font-medium">{row.l}</span>
                   <span className="text-white font-bold">{row.v}</span>
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
