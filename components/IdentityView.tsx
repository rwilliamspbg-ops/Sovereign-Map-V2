
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
  ChevronRight
} from 'lucide-react';
import { generateSovereignNarrative, generateStakingAdvisory } from '../services/geminiService';

type OnboardingStep = 'welcome' | 'did_gen' | 'spatial_anchor' | 'hardware_attest' | 'active';

const IdentityView: React.FC = () => {
  const [alias, setAlias] = useState("Alpha-Omega-42");
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
        generateSovereignNarrative(alias),
        generateStakingAdvisory("0x74B...8F2C")
      ]);
      setBriefing(narrative);
      setStakingAdvisory(advisory);
      setLoading(false);
    };
    fetchData();
  }, [alias]);

  const advanceStep = (next: OnboardingStep) => {
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep(next);
        setProgress(0);
      }
    }, 50);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5">Sovereign Identity</h2>
          <p className="text-slate-400 text-xs italic">Securely anchor your device and join the digital sovereign mesh.</p>
        </div>
        {step === 'active' && (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in">
            <UserCheck size={16} /> Contributor Active
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile/Onboarding Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
            {step === 'welcome' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 group hover:scale-110 transition-transform">
                  <Globe className="text-blue-400" size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Join the Sovereign Mesh</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Convert your device's spatial awareness into a network asset. Start contributing and earn $SOV.
                  </p>
                </div>
                <button 
                  onClick={() => advanceStep('did_gen')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-900/30"
                >
                  Begin Onboarding <ArrowRight size={18} />
                </button>
              </div>
            )}

            {(step === 'did_gen' || step === 'spatial_anchor' || step === 'hardware_attest') && (
              <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Step {step === 'did_gen' ? '1' : step === 'spatial_anchor' ? '2' : '3'} of 3
                  </p>
                  <h3 className="text-2xl font-black text-white">
                    {step === 'did_gen' ? 'Generating DID' : step === 'spatial_anchor' ? 'Anchoring Coordinates' : 'Hardware Attestation'}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    {step === 'did_gen' ? 'Creating unique cryptographic fingerprint for this device...' : 
                     step === 'spatial_anchor' ? 'Synchronizing L1 spatial headers with mesh oracles...' : 
                     'Verifying sensor integrity and compute capabilities...'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>In Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-300 shadow-[0_0_10px_#2563eb]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-4 font-mono text-[9px] text-blue-400/80 border border-white/5">
                   {step === 'did_gen' ? 'did:sov:eth:0x74B...8F2C' : 
                    step === 'spatial_anchor' ? 'LAT: 51.5074 | LNG: -0.1278 | DRIFT: <0.001' : 
                    'IMU_BIAS: VERIFIED | CAM_FOV: 120DEG | RSA-Q: ACTIVE'}
                </div>

                {progress === 0 && (
                   <button 
                    onClick={() => advanceStep(step === 'did_gen' ? 'spatial_anchor' : step === 'spatial_anchor' ? 'hardware_attest' : 'active')}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                   >
                     Continue Integration
                   </button>
                )}
              </div>
            )}

            {step === 'active' && (
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
                 <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center border border-green-500/20 relative">
                   <ShieldCheck className="text-green-400" size={48} />
                   <div className="absolute inset-0 border-2 border-green-500/40 rounded-[2.5rem] animate-ping"></div>
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-white mb-2">Network Bonded</h3>
                   <p className="text-slate-400 text-xs max-w-xs mx-auto">
                     Your device is now a verified node in the Sovereign Mesh. Contributions are now being recorded.
                   </p>
                 </div>
                 <div className="w-full grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Node ID</p>
                       <p className="text-[10px] font-bold text-white">SOV-7-ALPHA</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Reputation</p>
                       <p className="text-[10px] font-bold text-green-400">EXEMPLARY</p>
                    </div>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Intelligence/Staking Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-8 rounded-[3rem] border-white/5 h-[350px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
               <Fingerprint size={160} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Shield size={20} className="text-blue-400" /> Neural Mesh Briefing
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                 <Zap size={10} /> Active Uplink
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
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Yield Protocol</h4>
                 </div>
                 <span className="font-bold text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">+15.8% APY</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-6 italic leading-relaxed">
                {stakingAdvisory || "Optimization strategy pending network sync..."}
              </p>
              <button className="w-full py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                Stake $SOV
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-4 bg-slate-950/20">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Cpu size={14} className="text-blue-400" /> Hardware Telemetry
               </h4>
               {[
                 { l: 'Network Reputation', v: step === 'active' ? '98.2 (Tier 1)' : '72.4' },
                 { l: 'Uptime Score', v: '99.9%' },
                 { l: 'Mapping Quality', v: 'High (4K/60)' },
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
