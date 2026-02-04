
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Waves, X, Loader2, Zap } from 'lucide-react';

const VoiceTerminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const toggleConnection = async () => {
    if (isActive) {
      setIsActive(false);
      onClose();
      return;
    }

    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const audioData = decode(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const buffer = await decodeAudioData(audioData, outputCtx);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              const start = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(start);
              nextStartTimeRef.current = start + buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.outputTranscription) {
              setResponse(prev => prev + msg.serverContent!.outputTranscription!.text);
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are the SovereignMap Mesh Oracle. You provide voice-based tactical data to spatial mapping operators. Keep responses concise, helpful, and technically advanced."
        }
      });
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-lg p-10 rounded-[3rem] border-white/10 shadow-3xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8 p-6 rounded-full bg-blue-600/10 relative">
          {isActive ? (
            <div className="flex gap-1 h-12 items-center">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`w-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite]`} style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random()*100 + 20}%` }}></div>
              ))}
            </div>
          ) : isConnecting ? (
            <Loader2 className="text-blue-500 animate-spin" size={48} />
          ) : (
            <Mic className="text-slate-500" size={48} />
          )}
        </div>

        <h3 className="text-2xl font-black text-white mb-2">Neural Voice Link</h3>
        <p className="text-slate-400 text-sm mb-10 max-w-xs">
          Direct cognitive interface with the Mesh Oracle. Hands-free spatial data querying enabled.
        </p>

        <div className="w-full bg-slate-950/50 p-6 rounded-2xl border border-white/5 min-h-[100px] mb-10 text-left overflow-y-auto max-h-[150px] custom-scrollbar">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Zap size={12} /> Oracle Feed
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            {isActive ? (response || "Listening to sector telemetry...") : "Awaiting operator handshake..."}
          </p>
        </div>

        <button 
          onClick={toggleConnection}
          className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
            isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl'
          }`}
        >
          {isActive ? <MicOff size={20} /> : <Mic size={20} />}
          {isActive ? 'Disconnect Oracle' : isConnecting ? 'Establishing Link...' : 'Initiate Neural Link'}
        </button>
      </div>
    </div>
  );
};

export default VoiceTerminal;
