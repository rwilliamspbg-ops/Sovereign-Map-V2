
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  Fingerprint, 
  UploadCloud, 
  Cpu, 
  ShieldCheck, 
  Menu, 
  X,
  Activity,
  Globe
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import NetworkView from './components/NetworkView';
import IdentityView from './components/IdentityView';
import UplinkView from './components/UplinkView';
import { AppRoute } from './types';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.hash.includes(path);

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: AppRoute.DASHBOARD },
    { label: 'Network', icon: <Network size={20} />, path: AppRoute.NETWORK },
    { label: 'Identity', icon: <Fingerprint size={20} />, path: AppRoute.IDENTITY },
    { label: 'Uplink', icon: <UploadCloud size={20} />, path: AppRoute.UPLINK },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-screen sticky top-0 p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Globe className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-blue-100">SOVEREIGN<span className="text-blue-500">MAP</span></h1>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path) 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-900 mt-auto">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-green-500" />
              <span className="text-xs font-mono text-slate-500 uppercase">Mesh Status</span>
            </div>
            <p className="text-sm font-semibold text-green-400">99.98% Synchronized</p>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Globe className="text-blue-500" size={24} />
          <span className="font-bold tracking-tight">SOVEREIGN MAP</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950 z-40 pt-20 px-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 text-lg"
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
  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-50">
        <Navigation />
        <main className="flex-1 relative overflow-y-auto">
          <div className="mesh-gradient absolute inset-0 pointer-events-none"></div>
          <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/network" element={<NetworkView />} />
              <Route path="/identity" element={<IdentityView />} />
              <Route path="/uplink" element={<UplinkView />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
