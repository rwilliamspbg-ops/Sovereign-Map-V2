
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
  Fingerprint
} from 'lucide-react';
import { generateSovereignNarrative, generateStakingAdvisory } from '../services/geminiService';

const IdentityView: React.FC = () => {
  const [alias, setAlias] = useState("Alpha-Omega-42");
  const [briefing, setBriefing] = useState("");
  const [stakingAdvisory, setStakingAdvisory] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5">Sovereign Identity</h2>
          <p className="text-slate-400 text-xs">Credentials and staking management console.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-white/10 relative overflow-hidden shadow-2xl flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mb-4">
              <Fingerprint className="text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-black text-white">{alias}</h3>
            <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.3em] mb-4">L2 Spatial Architect</p>
            <div className="flex items-center gap-2 glass-panel px-3 py-1 rounded-full border-white/5 text-[9px] font-mono text-slate-500">
               0x74...F2C <Copy size={10} className="hover:text-white cursor-pointer" />
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                 <span>Mesh Reputation</span>
                 <span className="text-blue-400">88%</span>
               </div>
               <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-[88%]"></div>
               </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-3">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
               <Hexagon size={14} className="text-blue-400" /> Key Credentials
             </h4>
             {[
               { name: 'Architecture Pass', level: 'Verified' },
               { name: 'Spatial Validator', level: 'Tier 3' },
             ].map((c, i) => (
               <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5 items-center">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className="text-[9px] font-bold text-blue-400 px-2 py-0.5 bg-blue-400/10 rounded-full">{c.level}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Briefing Box - Fixed height for consistency */}
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

          {/* Staking & Assets - Compact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <Coins size={18} className="text-purple-400" />
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest">Rewards</h4>
                 </div>
                 <span className="text-green-400 font-bold text-xs">+12.4% APY</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 italic">
                {stakingAdvisory || "Optimization strategy pending network sync..."}
              </p>
              <button className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 shadow-lg">
                Stake $SOV
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-white/5 space-y-3">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Info size={14} /> Quick Stats
               </h4>
               {[
                 { l: 'Available', v: '1,248.5 $SOV' },
                 { l: 'Network Reputation', v: 'Exemplary' },
               ].map((row, i) => (
                 <div key={i} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg border border-white/5">
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
