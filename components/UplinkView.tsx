
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
  Plane
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
        // Simulate real-time object detection
        const types: DetectedObject['type'][] = ['Humanoid', 'Drone', 'Obstacle'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newObj: DetectedObject = {
          id: `OBJ-${Math.floor(Math.random() * 999)}`,
          type,
          label: `${type} Alpha`,
          confidence: 0.85 + Math.random() * 0.1,
          status: Math.random() > 0.4 ? 'Verified' : 'Unregistered',
          pos: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }
        };
        setDetectedObjects(prev => [newObj, ...prev].slice(0, 3));
      }, 3000);
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
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
    addToast("Mesh Oracle analyzing spatial entities...");
    try {
      const analysis = await classifySpatialObject(base64, "Sector 7-G Urban Mesh");
      console.log("Spatial Intelligence:", analysis);
    } catch (e) {
      console.error(e);
    }
  };

  const addToast = (msg: string) => {
    // Simple toast or log mechanism if needed
    console.log(msg);
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
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
           Sovereign Data Contribution
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white">Network Uplink</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Propagate spatial telemetry to the mesh. Our SLAM engine identifies objects and verifies their DIDs simultaneously.
        </p>
      </header>

      <div className="glass-panel rounded-[3rem] overflow-hidden shadow-3xl border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>
        
        <div className="p-2 flex bg-slate-900/60 m-4 rounded-[2rem]">
          <button 
            className={`flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-[1.6rem] ${!isScanning ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => { if (isScanning) stopScan(); }}
          >
            <UploadCloud size={18} /> Static Payload
          </button>
          <button 
            className={`flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-[1.6rem] ${isScanning ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={startScan}
          >
            <Scan size={18} /> Live Spatial Scan
          </button>
        </div>

        <div className="p-10">
          {isScanning ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 relative aspect-video bg-black/40 rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-inner">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* OBJECT AWARENESS HUD */}
                  {detectedObjects.map(obj => (
                    <div 
                      key={obj.id} 
                      className="absolute border-2 rounded-xl transition-all duration-500 flex flex-col items-start p-2 pointer-events-none"
                      style={{ 
                        left: `${obj.pos.x}%`, 
                        top: `${obj.pos.y}%`, 
                        width: '120px', 
                        height: '80px',
                        borderColor: obj.status === 'Verified' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)',
                        backgroundColor: obj.status === 'Verified' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {obj.type === 'Humanoid' && <User size={12} className="text-white" />}
                        {obj.type === 'Drone' && <Plane size={12} className="text-white" />}
                        {obj.type === 'Obstacle' && <Target size={12} className="text-white" />}
                        <span className="text-[8px] font-black text-white uppercase">{obj.type}</span>
                      </div>
                      <div className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm ${obj.status === 'Verified' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {obj.status}
                      </div>
                      <div className="mt-auto flex justify-between w-full text-[6px] font-mono text-slate-300 uppercase">
                         <span>CONF: {(obj.confidence * 100).toFixed(0)}%</span>
                         <span>{obj.id}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Modernized Scan HUD */}
                  <div className="absolute inset-0 pointer-events-none p-12 flex items-center justify-center">
                    <div className="relative w-full h-full border-2 border-blue-500/20 rounded-3xl">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl shadow-[0_0_15px_#3b82f6]"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl shadow-[0_0_15px_#3b82f6]"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl shadow-[0_0_15px_#3b82f6]"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl shadow-[0_0_15px_#3b82f6]"></div>
                    </div>
                  </div>

                  <div className="absolute top-6 left-6 bg-red-600/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-red-500/30 text-[10px] font-black text-red-500 animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> SENSOR LINK ACTIVE
                  </div>
                  
                  <button 
                    onClick={captureAndClassify}
                    className="absolute bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all active:scale-90"
                  >
                    <Zap size={20} />
                  </button>
                </div>

                {/* SLAM Engine Telemetry */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-[2rem] border-white/5 space-y-6 flex flex-col justify-center">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">SLAM Engine</p>
                      <h4 className="text-sm font-bold text-white">ORB-SLAM3 v1.0</h4>
                   </div>
                   <div className="space-y-3">
                      {[
                        { l: 'Object Detection', v: detectedObjects.length > 0 ? 'ACTIVE' : 'IDLE', c: 'text-green-400' },
                        { l: 'Tracking', v: 'LOCKED', c: 'text-green-400' },
                        { l: 'Loop Closure', v: 'ENABLED', c: 'text-blue-400' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between p-2 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                          <span className="text-slate-500">{s.l}</span>
                          <span className={s.c}>{s.v}</span>
                        </div>
                      ))}
                   </div>
                   <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase">
                         <Target size={14} /> Spatial Continuity: 98%
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { l: 'Signal Quality', v: '98.2%', icon: <Wifi size={20} />, c: 'text-blue-400' },
                  { l: 'Awareness Index', v: `${detectedObjects.length} Entities`, icon: <Box size={20} />, c: 'text-purple-400' },
                  { l: 'Verification', v: 'Mutual DID Ready', icon: <ShieldCheck size={20} />, c: 'text-green-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-5 rounded-[1.8rem] flex items-center gap-5 border-white/5 bg-slate-900/40">
                    <div className={`p-3 bg-slate-950 rounded-2xl ${stat.c}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.l}</p>
                      <p className="text-sm font-bold text-white">{stat.v}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleUplink}
                disabled={status === 'uploading'}
                className="w-full py-5 bg-white text-slate-950 hover:bg-slate-200 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                {status === 'uploading' ? 'Committing Telemetry...' : 'Publish Spatial Data'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-10 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-950/20 group hover:bg-slate-900/40 hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="w-24 h-24 bg-slate-900/60 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-slate-600 group-hover:text-blue-500 transition-colors" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Initialize Spatial Mesh</h3>
              <p className="text-slate-500 text-sm mb-10 text-center max-w-sm leading-relaxed">
                Connect your device to begin the sovereign mapping protocol. Verify surrounding entities and anchor their coordinates to the L1 mesh.
              </p>
              <input type="file" id="file-upload" className="hidden" />
              <label htmlFor="file-upload" className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer transition-all border border-white/5 active:scale-95">
                 Load Manifest
              </label>
            </div>
          )}
        </div>

        {status !== 'idle' && (
          <div className="p-10 border-t border-white/5 bg-slate-950/60 backdrop-blur-3xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                {status === 'complete' ? <ShieldCheck className="text-green-500" /> : <Loader2 className="animate-spin text-blue-500" />}
                {status === 'complete' ? 'Spatial Consistency Achieved' : 'Broadcasting Awareness Feed...'}
              </span>
              <span className="text-[10px] font-black font-mono text-blue-400">{uplinkProgress}% Complete</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner p-0.5">
               <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(59,130,246,0.5)]" style={{ width: `${uplinkProgress}%` }}></div>
            </div>
            {status === 'complete' && (
              <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-3xl flex items-center gap-5 group hover:bg-green-500/10 transition-all">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                   <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-100 mb-1">Mesh Sync Complete</p>
                  <p className="text-xs text-green-400/80 leading-relaxed font-medium">
                    {detectedObjects.length} surrounding objects mapped and verified. Sovereignty score boosted.
                  </p>
                </div>
                <ChevronRight size={20} className="text-green-900 ml-auto" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UplinkView;
