
import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Wifi, 
  Database, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  UploadCloud
} from 'lucide-react';

const UplinkView: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [uplinkProgress, setUplinkProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

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
    }, 100);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Network Uplink</h2>
        <p className="text-slate-400">Contribute spatial data to the sovereign mesh.</p>
      </header>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-1 flex">
          <button 
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${!isScanning ? 'bg-blue-600 rounded-2xl text-white' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => { if (isScanning) stopScan(); }}
          >
            <Upload size={18} /> Static Payload
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isScanning ? 'bg-blue-600 rounded-2xl text-white' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={startScan}
          >
            <Scan size={18} /> Live Spatial Scan
          </button>
        </div>

        <div className="p-8">
          {isScanning ? (
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group border border-blue-500/30">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/20 m-8 rounded-lg flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
                  <div className="w-full h-[1px] bg-blue-500/50 absolute animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 px-2 py-1 rounded text-[10px] font-bold animate-pulse flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-white"></div> LIVE FEED
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg"><Wifi size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Signal Health</p>
                    <p className="text-sm font-bold text-blue-100">Optimal (92ms)</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                  <div className="p-2 bg-purple-600/10 text-purple-500 rounded-lg"><Database size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Data Capture</p>
                    <p className="text-sm font-bold text-blue-100">Point Cloud Active</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUplink}
                disabled={status === 'uploading'}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                {status === 'uploading' ? 'Uplinking Metadata...' : 'Commit Spatial Data'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 group hover:border-blue-500/50 transition-all">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-slate-500 group-hover:text-blue-500 transition-colors" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag and drop spatial logs</h3>
              <p className="text-slate-500 text-sm mb-8 text-center max-w-xs">Supports .json, .mesh, and encrypted .sov files exported from authorized nodes.</p>
              <input type="file" id="file-upload" className="hidden" />
              <label htmlFor="file-upload" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-colors border border-slate-700">
                 Select Files
              </label>
            </div>
          )}
        </div>

        {status !== 'idle' && (
          <div className="p-8 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold flex items-center gap-2">
                {status === 'complete' ? <CheckCircle2 className="text-green-500" /> : <Loader2 className="animate-spin text-blue-500" />}
                {status === 'complete' ? 'Uplink Complete' : 'Synchronizing with Mesh...'}
              </span>
              <span className="text-xs font-mono text-slate-500">{uplinkProgress}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uplinkProgress}%` }}></div>
            </div>
            {status === 'complete' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex gap-3">
                <AlertCircle className="text-green-500 shrink-0" size={18} />
                <p className="text-xs text-green-200">
                  Data successfully verified by 12 network nodes. Reputation +15.5 SOV awarded to your identity.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default UplinkView;
