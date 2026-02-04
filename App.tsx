
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
  ChevronDown,
  Radio,
  Navigation as NavIcon,
  Activity
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
import AutonomousCommand from './components/AutonomousCommand';
import SpatialCanvas from './components/SpatialCanvas';
import { AppRoute } from './types';

const Navigation = ({ onVoiceToggle }: { onVoiceToggle: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('MAINNET');
  const location = useLocation();

  const isActive = (path: string) => location.hash.includes(path) || (location.hash === '' && path === AppRoute.DASHBOARD);

  const navItems = [
    { label: 'Intelligence', icon: <LayoutDashboard size={18} />, path: AppRoute.DASHBOARD },
    { label: 'Command Hub', icon: <NavIcon size={18} />, path: AppRoute.COMMAND },
    { label: 'Neural Atlas', icon: <Map size={18} />, path: AppRoute.ATLAS },
    { label: 'Governance', icon: <Scale size={18} />, path: AppRoute.GOVERNANCE },
    { label: 'Spatial Mesh', icon: <Network size={18} />, path: AppRoute.NETWORK },
    { label: 'Security Unit', icon: <ShieldAlert size={18} />, path: AppRoute.SECURITY },
    { label: 'Verification', icon: <CheckCircle size={18} />, path: AppRoute.VERIFY },
    { label: 'Identity', icon: <Fingerprint size={18} />, path: AppRoute.IDENTITY },
  ];

  return (
    <>
      <nav className="hidden lg:flex flex-col w-64 bg-slate-950/20 backdrop-blur-3xl border-r border-white/5 h-screen sticky top-0 p-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] relative">
            <Globe className="text-white" size={20} />
            <div className="absolute inset-0 bg-white/20 animate-ping rounded-xl opacity-20"></div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">SOVEREIGN</h1>
            <p className="text-[9px] font-mono text-blue-500 font-black tracking-widest uppercase mt-0.5">Neural Mesh</p>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive(item.path) 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}>
                {item.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 mt-auto space-y-4">
          <button 
            onClick={onVoiceToggle}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl active:scale-95 group"
          >
            <Mic size={18} /> Neural Link
          </button>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <div className="flex-1 overflow-hidden">
                <p className="text-[8px] font-black text-slate-500 uppercase">Operator Core</p>
                <p className="text-[10px] font-mono text-slate-300 truncate">SOV-7-ALPHA-42</p>
             </div>
          </div>
        </div>
      </nav>

      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[60]">
        <Globe className="text-blue-500" size={24} />
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950 z-50 pt-20 px-6 space-y-2 animate-in fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-widest"
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <button onClick={onVoiceToggle} className="w-full mt-4 p-5 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-widest">
            Neural Link
          </button>
        </div>
      )}
    </>
  );
};

function App() {
  const [showVoice, setShowVoice] = useState(false);
  const location = useLocation();
  const isDroneMode = location.hash.includes(AppRoute.COMMAND) || location.hash.includes(AppRoute.BEACON);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-transparent overflow-hidden">
      <SpatialCanvas isDroneView={isDroneMode} />
      <Navigation onVoiceToggle={() => setShowVoice(true)} />
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
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
            <Route path="/command" element={<AutonomousCommand />} />
          </Routes>
        </div>
      </main>
      {showVoice && <VoiceTerminal onClose={() => setShowVoice(false)} />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
