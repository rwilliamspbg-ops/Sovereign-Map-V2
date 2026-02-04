
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  Fingerprint, 
  UploadCloud, 
  ShieldAlert, 
  Menu, 
  X,
  Globe,
  Wallet,
  CheckCircle,
  Scale,
  Map,
  Mic,
  Activity,
  ChevronDown,
  Radio
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import NetworkView from './components/NetworkView';
import IdentityView from './components/IdentityView';
import UplinkView from './components/UplinkView';
import SecurityView from './components/SecurityView';
import VerificationHub from './components/VerificationHub';
import GovernanceCore from './components/GovernanceCore';
import AtlasView from './components/AtlasView';
import VoiceTerminal from './components/VoiceTerminal';
import BeaconTerminal from './components/BeaconTerminal';
import { AppRoute } from './types';

const Navigation = ({ onVoiceToggle }: { onVoiceToggle: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('MAINNET');
  const location = useLocation();

  const isActive = (path: string) => location.hash.includes(path) || (location.hash === '' && path === AppRoute.DASHBOARD);

  const navItems = [
    { label: 'Intelligence', icon: <LayoutDashboard size={20} />, path: AppRoute.DASHBOARD },
    { label: 'Active Beacon', icon: <Radio size={20} />, path: AppRoute.BEACON },
    { label: 'Neural Atlas', icon: <Map size={20} />, path: AppRoute.ATLAS },
    { label: 'Governance', icon: <Scale size={20} />, path: AppRoute.GOVERNANCE },
    { label: 'Spatial Mesh', icon: <Network size={20} />, path: AppRoute.NETWORK },
    { label: 'Security Unit', icon: <ShieldAlert size={20} />, path: AppRoute.SECURITY },
    { label: 'Verification', icon: <CheckCircle size={20} />, path: AppRoute.VERIFY },
    { label: 'Data Uplink', icon: <UploadCloud size={20} />, path: AppRoute.UPLINK },
    { label: 'Identity', icon: <Fingerprint size={20} />, path: AppRoute.IDENTITY },
  ];

  return (
    <>
      <nav className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-900/50 h-screen sticky top-0 p-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6 px-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.4)] relative overflow-hidden">
            <Globe className="text-white z-10 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">SOVEREIGN</h1>
            <p className="text-[10px] font-mono text-blue-500 font-bold tracking-widest uppercase">Mesh Network</p>
          </div>
        </div>

        {/* Network Toggle */}
        <div className="mb-6 px-2">
           <button 
            onClick={() => setNetwork(prev => prev === 'MAINNET' ? 'TESTNET' : 'MAINNET')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
           >
             <span className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${network === 'MAINNET' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500 animate-pulse'}`}></div>
               {network}
             </span>
             <ChevronDown size={12} />
           </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path) 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-900 mt-auto space-y-4">
          <button 
            onClick={onVoiceToggle}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 group"
          >
            <Mic size={18} className="group-hover:scale-110 transition-transform" />
            Neural Link
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/60 transition-colors group">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Wallet size={16} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Operator Address</p>
              <p className="text-[11px] font-mono text-slate-300 truncate">0x74B...8F2C</p>
            </div>
          </button>
        </div>
      </nav>

      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-50 backdrop-blur-md bg-opacity-80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Globe className="text-blue-500" size={24} />
          <span className="font-bold text-white tracking-tight">SOVEREIGN MAP</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400 hover:text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950 z-40 pt-20 px-6 space-y-2 animate-in fade-in duration-200">
          <button onClick={() => { setIsOpen(false); onVoiceToggle(); }} className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-600 text-white font-bold">
            <Mic size={20} /> Neural Link
          </button>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

function App() {
  const [showVoice, setShowVoice] = useState(false);

  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-50 overflow-hidden">
        <Navigation onVoiceToggle={() => setShowVoice(true)} />
        <main className="flex-1 relative overflow-y-auto custom-scrollbar">
          <div className="relative z-10 p-5 md:p-8 lg:p-10 max-w-full mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/network" element={<NetworkView />} />
              <Route path="/identity" element={<IdentityView />} />
              <Route path="/uplink" element={<UplinkView />} />
              <Route path="/security" element={<SecurityView />} />
              <Route path="/verify" element={<VerificationHub />} />
              <Route path="/governance" element={<GovernanceCore />} />
              <Route path="/atlas" element={<AtlasView />} />
              <Route path="/beacon" element={<BeaconTerminal />} />
            </Routes>
          </div>
        </main>
        {showVoice && <VoiceTerminal onClose={() => setShowVoice(false)} />}
      </div>
    </HashRouter>
  );
}

export default App;
