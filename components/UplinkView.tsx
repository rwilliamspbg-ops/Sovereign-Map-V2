
import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Wifi, 
  Database, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  Box,
  User,
  Plane,
  Waves
} from 'lucide-react';
import { classifySpatialObject } from '../services/geminiService';

interface DetectedObject {
  id: string;
  type: 'Humanoid' | 'UGV' | 'Drone' | 'Obstacle' | 'Ghost';
  label: string;
  confidence: number;
  status: 'Verified' | 'Unregistered';
  pos: { x: number; y: number };
}

const UplinkView: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [uplinkProgress, setUplinkProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let interval: number;
    if (isScanning) {
      interval = window.setInterval(() => {
        const types: DetectedObject['type'][] = ['Humanoid', 'Drone', 'Obstacle', 'Ghost'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newObj: DetectedObject = {
          id: `SOV-${Math.floor(Math.random() * 999)}`,
          type,
          label: `${type} Alpha`,
          confidence: 0.88 + Math.random() * 0.1,
          status: Math.random() > 0.3 ? 'Verified' : 'Unregistered',
          pos: { x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 }
        };
        setDetectedObjects(prev => [newObj, ...prev].slice(0, 4));
      }, 2500);
    } else {
      setDetectedObjects([]);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = async () => {
    setIsScanning(true);
    setStatus('idle');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Spatial scan failed: Camera access restricted.", err);
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  const captureAndClassify = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    try {
      await classifySpatialObject(base64, "High-Density Spatial Mesh Sector 7");
    } catch (e) { console.error("Neural analysis timed out.", e); }
  };

  const handleUplink = () => {
    setStatus('uploading');
    setUplinkProgress(0);
    const interval = setInterval(() => {
      setUplinkProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-5 py-2 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
           <Waves size={12} className="animate-pulse" /> Kinetic Data Contribution v2.6
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Sovereign Uplink</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Propagate your kinetic path and spatial telemetry to the mesh. Verification occurs in real-time across the neural backbone.
        </p>
      </header>

      <div className="glass-panel rounded-[3.5rem] overflow-hidden shadow-3xl border-white/5 relative">
        <div className="p-2 flex bg-slate-900/60 m-6 rounded-[2.5rem] border border-white/5">
          <button 
            className={`flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-[2.2rem] ${!isScanning ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => { if (isScanning) stopScan(); }}
          >
            <UploadCloud size={18} /> Static Manifest
          </button>
          <button 
            className={`flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-[2.2rem] ${isScanning ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={startScan}
          >
            <Scan size={18} /> Spatial Kinetic Scan
          </button>
        </div>

        <div className="p-8">
          {isScanning ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 relative aspect-video bg-black/60 rounded-[3rem] overflow-hidden border border-white/10 shadow-inner group">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                  <canvas ref={canvasRef} className="hidden" />

                  {detectedObjects.map(obj => (
                    <div 
                      key={obj.id} 
                      className="absolute border-2 rounded-2xl transition-all duration-700 flex flex-col items-start p-3 pointer-events-none backdrop-blur-sm"
                      style={{ 
                        left: `${obj.pos.x}%`, 
                        top: `${obj.pos.y}%`, 
                        width: '140px', 
                        height: '90px',
                        borderColor: obj.status === 'Verified' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)',
                        backgroundColor: obj.status === 'Verified' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {obj.type === 'Humanoid' && <User size={14} className="text-white" />}
                        {obj.type === 'Drone' && <Plane size={14} className="text-white" />}
                        <span className="text-[10px] font-black text-white uppercase">{obj.type}</span>
                      </div>
                      <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-md mb-2 ${obj.status === 'Verified' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {obj.status}
                      </div>
                      <div className="mt-auto flex justify-between w-full text-[7px] font-mono text-slate-300 uppercase tracking-widest font-bold">
                         <span>STAKE_MATCH: {(obj.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="absolute inset-0 pointer-events-none p-16">
                    <div className="relative w-full h-full border border-blue-500/10 rounded-[3rem]">
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500 rounded-tl-[3rem] shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500 rounded-br-[3rem] shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                    </div>
                  </div>

                  <div className="absolute top-8 left-8 bg-blue-600/20 backdrop-blur-xl px-5 py-2 rounded-full border border-blue-500/30 text-[10px] font-black text-blue-400 animate-pulse flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div> KINETIC LINK ESTABLISHED
                  </div>
                  
                  <button 
                    onClick={captureAndClassify}
                    className="absolute bottom-8 right-8 p-5 bg-white text-slate-950 rounded-full shadow-3xl transition-all active:scale-90 hover:scale-110"
                  >
                    <Target size={24} />
                  </button>
                </div>

                <div className="lg:col-span-1 glass-panel p-8 rounded-[3rem] border-white/5 space-y-8 flex flex-col justify-center bg-slate-950/40">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural SLAM v2.6</p>
                      <h4 className="text-lg font-bold text-white tracking-tight leading-none">Edge Logic Engine</h4>
                   </div>
                   <div className="space-y-4">
                      {[
                        { l: 'Mesh Synchronization', v: 'SYNCED', c: 'text-green-400' },
                        { l: 'Kinetic Tracking', v: 'ACTIVE', c: 'text-blue-400' },
                        { l: 'Oracle Feedback', v: 'NOMINAL', c: 'text-blue-400' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-wider group hover:bg-white/10 transition-colors">
                          <span className="text-slate-500">{s.l}</span>
                          <span className={s.c}>{s.v}</span>
                        </div>
                      ))}
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                         <Zap size={16} /> Movement Proof: OK
                      </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleUplink}
                disabled={status === 'uploading'}
                className="w-full py-6 bg-white text-slate-950 hover:bg-slate-200 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-3xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
                {status === 'uploading' ? 'Publishing Kinetic Mesh...' : 'Commit Movement to Blockchain'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-10 border-2 border-dashed border-white/10 rounded-[3.5rem] bg-slate-950/20 group hover:bg-slate-900/40 hover:border-blue-500/40 transition-all cursor-pointer">
              <div className="w-28 h-28 bg-slate-900/60 rounded-[3rem] flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform shadow-2xl">
                <Scan className="text-slate-600 group-hover:text-blue-400 transition-colors" size={56} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Initialize Mesh Scanners</h3>
              <p className="text-slate-500 text-sm mb-12 text-center max-w-sm leading-relaxed font-medium">
                Activate your spatial sensors to verify neighboring entities and begin staking your movement in the $SOV economy.
              </p>
              <button className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                 Synchronize Sensors
              </button>
            </div>
          )}
        </div>

        {status !== 'idle' && (
          <div className="p-12 border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                {status === 'complete' ? <CheckCircle2 className="text-green-500" size={24} /> : <Loader2 className="animate-spin text-blue-500" size={24} />}
                {status === 'complete' ? 'Consensus Achieved: Block #48291 Anchored' : 'Negotiating Peer Handshakes...'}
              </span>
              <span className="text-xs font-black font-mono text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg border border-blue-500/20">{uplinkProgress}% SYNC</span>
            </div>
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden shadow-inner p-1">
               <div className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]" style={{ width: `${uplinkProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UplinkView;
