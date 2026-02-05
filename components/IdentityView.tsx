
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Copy, 
  CheckCircle,
  Hexagon,
  Coins,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Key,
  Database,
  Lock,
  Zap,
  UserCheck,
  Cpu,
  Globe,
  ArrowRight,
  ChevronRight,
  Target,
  Waves,
  Eye,
  // Fix: Added missing Brain icon from lucide-react
  Brain
} from 'lucide-react';
import { generateSovereignNarrative, generateStakingAdvisory } from '../services/geminiService';
import { SovereignIdentity } from '../types';

type OnboardingStep = 'welcome' | 'did_gen' | 'biometric_verify' | 'spatial_anchor' | 'active';

const IdentityView: React.FC = () => {
  const [identity, setIdentity] = useState<SovereignIdentity>({
    alias: "Alpha-Omega-42",
    worldIdVerified: false,
    stakedMovement: 1240.50,
    reputation: 98.4,
    hapticLinkActive: false,
    did: "did:sov:eth:0x74B...8F2C"
  });

  const [briefing, setBriefing] = useState("");
  const [stakingAdvisory, setStakingAdvisory] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Onboarding Flow State
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [narrative, advisory] = await Promise.all([
        generateSovereignNarrative(identity.alias),
        generateStakingAdvisory(identity.did)
      ]);
      setBriefing(narrative);
      setStakingAdvisory(advisory);
      setLoading(false);
    };
    fetchData();
  }, [identity.alias]);

  const advanceStep = (next: OnboardingStep) => {
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep(next);
        setProgress(0);
        if (next === 'active') {
          setIdentity(prev => ({ ...prev, worldIdVerified: true }));
        }
      }
    }, 40);
  };

  const toggleHaptic = () => {
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    setIdentity(prev => ({ ...prev, hapticLinkActive: !prev.hapticLinkActive }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5">Sovereign Terminal</h2>
          <p className="text-slate-400 text-xs italic">Identity 2.0: Decentralized biometrics and spatial staking active.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleHaptic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              identity.hapticLinkActive 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
              : 'bg-slate-900 text-slate-500 border-white/5'
            }`}
          >
            <Waves size={14} className={identity.hapticLinkActive ? 'animate-pulse' : ''} />
            {identity.hapticLinkActive ? 'Haptic Link: Active' : 'Enable Haptic Link'}
          </button>
          {identity.worldIdVerified && (
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in">
              <UserCheck size={16} /> World-ID Verified
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile/Onboarding Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden shadow-2xl flex flex-col min-h-[550px]">
            {step === 'welcome' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 group hover:scale-110 transition-transform relative">
                  <Globe className="text-blue-400" size={48} />
                  <div className="absolute -bottom-1 -right-1 p-2 bg-slate-950 rounded-full border border-white/10">
                    <Target size={16} className="text-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Enter the 2026 Mesh</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Verify your World-ID biometrics and start staking your movement directly to the Sovereign spatial ledger.
                  </p>
                </div>
                <button 
                  onClick={() => advanceStep('did_gen')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-900/30"
                >
                  Initiate Secure Link <ArrowRight size={18} />
                </button>
              </div>
            )}

            {(step === 'did_gen' || step === 'biometric_verify' || step === 'spatial_anchor') && (
              <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Phase {step === 'did_gen' ? '1' : step === 'biometric_verify' ? '2' : '3'} of 3
                  </p>
                  <h3 className="text-2xl font-black text-white">
                    {step === 'did_gen' ? 'Identity Anchor' : step === 'biometric_verify' ? 'Biometric Mesh Check' : 'Spatial Synthesis'}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    {step === 'did_gen' ? 'Rotating cryptographic master seeds and anchoring DID-v4...' : 
                     step === 'biometric_verify' ? 'Scanning neural signature and verifying via World-ID Oracle...' : 
                     'Synchronizing local movement telemetry with global mesh headers...'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Neural Link Pulse</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-300 shadow-[0_0_15px_#2563eb]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-5 font-mono text-[9px] text-blue-400/80 border border-white/5 flex items-center gap-3">
                   <Lock size={14} className="opacity-50" />
                   <span className="truncate">
                    {step === 'did_gen' ? identity.did : 
                     step === 'biometric_verify' ? 'BIOMETRIC_SIGNATURE: VERIFIED_HASH_9F2' : 
                     'MOVEMENT_ANCHOR: SEC_7_GRID_ALPHA_LOCKED'}
                   </span>
                </div>

                {progress === 0 && (
                   <button 
                    onClick={() => advanceStep(step === 'did_gen' ? 'biometric_verify' : step === 'biometric_verify' ? 'spatial_anchor' : 'active')}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/5"
                   >
                     Confirm Neural Step
                   </button>
                )}
              </div>
            )}

            {step === 'active' && (
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
                 <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center border border-green-500/20 relative">
                   <ShieldCheck className="text-green-400" size={48} />
                   <div className="absolute inset-0 border-2 border-green-500/40 rounded-[2.5rem] animate-pulse"></div>
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Identity Sovereign</h3>
                   <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                     Biometrics matched. Movement staking activated. You are now earning $SOV for every spatial block you verify.
                   </p>
                 </div>
                 <div className="w-full grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Staked Path</p>
                       <p className="text-xs font-bold text-blue-400 font-mono">{identity.stakedMovement} $SOV</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">World-ID Tier</p>
                       <p className="text-xs font-bold text-green-400">FOUNDER_ELITE</p>
                    </div>
                 </div>
                 <div className="w-full p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Zap size={12} className="text-blue-400" /> Mesh Contribution
                    </span>
                    <span className="text-[10px] font-bold text-white">Active (8.4 Gb/s)</span>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Intelligence/Staking Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-8 rounded-[3rem] border-white/5 h-[350px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
               <Fingerprint size={160} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Brain size={20} className="text-blue-400" /> Neural Briefing: 2026.04
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                 <Zap size={10} /> Edge-AI Synced
              </div>
            </div>
            <div className="flex-1 bg-slate-950/40 p-6 rounded-3xl overflow-y-auto custom-scrollbar border border-white/5 shadow-inner">
              <p className="text-slate-300 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                {loading ? "Decrypting briefing data stream..." : briefing}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between hover:bg-slate-900/40 transition-all border-indigo-500/10 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                     <Coins size={20} />
                   </div>
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Proof of Movement</h4>
                 </div>
                 <span className="font-bold text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">+24.5 $SOV/H</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-6 italic leading-relaxed">
                {stakingAdvisory || "Calculating spatial yield across Sector 7 grid..."}
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                  Claim $SOV
                </button>
                <button className="p-4 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-4 bg-slate-950/20">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Cpu size={14} className="text-blue-400" /> Decentralized Trust
               </h4>
               {[
                 { l: 'Mesh Reputation', v: identity.reputation + ' (Elite)' },
                 { l: 'Biometric Status', v: identity.worldIdVerified ? 'World-ID V3' : 'Pending' },
                 { l: 'Consensus Weight', v: '0.42% Global' },
               ].map((row, i) => (
                 <div key={i} className="flex justify-between items-center text-xs p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
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
