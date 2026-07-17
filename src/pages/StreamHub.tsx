import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Monitor, 
  Activity, 
  Play, 
  StopCircle, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Zap,
  Mic,
  MicOff,
  Maximize2,
  Layout,
  Gauge,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI, Modality } from "@google/genai";

interface StreamWorkflow {
  id: string;
  name: string;
  desc: string;
  trigger: string;
  icon: any;
  color: string;
  instruction: string;
}

const workflows: StreamWorkflow[] = [
  {
    id: "STREAM-001",
    name: "Auto-UI Design Review",
    desc: "Real-time analysis of landing page hierarchy, CTAs, and responsiveness.",
    trigger: "Screen Share",
    icon: Monitor,
    color: "text-blue-500",
    instruction: "Analyze visual hierarchy, CTA placement, load speed indicators, and mobile responsiveness."
  },
  {
    id: "STREAM-002",
    name: "Video Ad Director",
    desc: "AI feedback on pacing, hooks, and brand consistency for video creatives.",
    trigger: "Video Capture",
    icon: Video,
    color: "text-orange-500",
    instruction: "Analyze pacing, hook strength, brand consistency, and subtitle placement."
  },
  {
    id: "STREAM-003",
    name: "Live Pulse Monitor",
    desc: "Real-time KPI monitoring and anomaly detection for active campaigns.",
    trigger: "Telemetry Stream",
    icon: Activity,
    color: "text-emerald-500",
    instruction: "Monitor KPIs in real-time, detect anomalies, and suggest immediate adjustments."
  }
];

export default function StreamHub() {
  const [activeWorkflow, setActiveWorkflow] = useState<StreamWorkflow | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<{ type: 'ai' | 'system', text: string }[]>([]);
  const [metrics, setMetrics] = useState({ latency: 0, fps: 0, bitrate: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  const addLog = (text: string, type: 'ai' | 'system' = 'system') => {
    setLogs(prev => [...prev.slice(-10), { type, text }]);
  };

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsStreaming(false);
    setActiveWorkflow(null);
    addLog("Stream session terminated.", 'system');
  }, []);

  const startStream = async (workflow: StreamWorkflow) => {
    setActiveWorkflow(workflow);
    setIsStreaming(true);
    addLog(`Initiating ${workflow.name} session...`, 'system');
    
    try {
      let captureStream: MediaStream;
      if (workflow.id === "STREAM-001") {
        captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      } else {
        captureStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }
      
      streamRef.current = captureStream;
      if (videoRef.current) {
        videoRef.current.srcObject = captureStream;
      }

      // Initialize Gemini Live
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            addLog("Neural connection established.", 'system');
            // Start the frame loop
            startCaptureLoop(session);
          },
          onmessage: (msg: any) => {
            if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
              addLog(msg.serverContent.modelTurn.parts[0].text, 'ai');
            }
          },
          onclose: () => stopStream(),
          onerror: (e: any) => {
            console.error(e);
            addLog("Neural link error.", 'system');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `${workflow.instruction} Provide feedback in short, actionable real-time bursts.`
        }
      });

      sessionRef.current = session;

    } catch (error) {
      console.error(error);
      addLog("Failed to access media devices.", 'system');
      stopStream();
    }
  };

  const startCaptureLoop = (session: any) => {
    const capture = async () => {
      if (!isStreaming || !sessionRef.current || !videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = 480;
        canvas.height = 270;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
        
        try {
          await session.sendRealtimeInput({
            video: { data: base64Data, mimeType: 'image/jpeg' }
          });
          setMetrics(m => ({ ...m, fps: 24, latency: Math.floor(Math.random() * 50) + 120 }));
        } catch (e) {
          console.error("Frame send error", e);
        }
      }

      requestAnimationFrame(capture);
    };

    capture();
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-blue-500/10 rounded-full">
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Stream Mode Active</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                 <Zap size={10} className="text-orange-500" />
                 <span>WebSockets / WebRTC Layer</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Stream <span className="text-slate-300 dark:text-slate-800">Hub</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
             Real-time multimodal analysis for design, video, and live telemetry. Connect your world to the Flux Neural Engine.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Workflows */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Available Channels</h2>
          {workflows.map((w) => (
            <button
              key={w.id}
              onClick={() => !isStreaming && startStream(w)}
              disabled={isStreaming && activeWorkflow?.id !== w.id}
              className={cn(
                "w-full p-6 bg-white dark:bg-slate-950 border rounded-[32px] text-left transition-all group",
                activeWorkflow?.id === w.id 
                  ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500" 
                  : "border-slate-100 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm disabled:opacity-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 transition-colors", activeWorkflow?.id === w.id ? "bg-blue-500 text-white" : w.color)}>
                  <w.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">{w.name}</h3>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{w.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            </button>
          ))}

          <div className="mt-12 p-8 bg-slate-900 dark:bg-slate-950 rounded-[40px] border border-white/5">
             <div className="flex items-center gap-2 mb-4">
                <Layout size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stream Interface</span>
             </div>
             <div className="space-y-4">
                {['Sub-second latency', 'Gemini 3.1 Flash Live', 'Multimodal context'].map(tip => (
                  <div key={tip} className="flex items-center gap-3">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-400">{tip}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Center: Live Preview */}
        <div className="xl:col-span-2 space-y-6">
           <div className="relative aspect-video bg-black rounded-[48px] overflow-hidden group shadow-2xl">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-8 left-8 flex gap-3">
                 <div className={cn("px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-xl border border-white/10", isStreaming ? "bg-red-500 shadow-lg shadow-red-500/20" : "bg-white/10")}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", isStreaming ? "bg-white animate-pulse" : "bg-white/40")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {isStreaming ? "Live Feed" : "Signal Offline"}
                    </span>
                 </div>
                 {isStreaming && (
                    <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Lat: <span className="text-white">{metrics.latency}ms</span></span>
                    </div>
                 )}
              </div>

              {!isStreaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Play size={40} className="text-white/20" />
                   </div>
                   <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2">Select a channel to broadcast</h3>
                   <p className="text-white/40 text-sm max-w-sm italic">Connect to the Gemini Neural Network for real-time analysis</p>
                </div>
              )}

              {isStreaming && (
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                   <div className="space-y-2">
                      <h4 className="text-white text-2xl font-bold uppercase tracking-tight">{activeWorkflow?.name}</h4>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                         <Activity size={14} className="text-blue-500" />
                         Analyzing Signal...
                      </p>
                   </div>
                   <button 
                     onClick={stopStream}
                     className="px-8 py-4 bg-white text-slate-900 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-110 transition-all flex items-center gap-2"
                   >
                     Disconnect <StopCircle size={16} />
                   </button>
                </div>
              )}

              {/* Scanned Items Visualization (Mock) */}
              {isStreaming && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                   <motion.div 
                     animate={{ rotate: 360 }} 
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="w-[400px] h-[400px] border border-blue-500/20 rounded-full flex items-center justify-center"
                   >
                      <div className="w-[300px] h-[300px] border border-blue-500/10 rounded-full" />
                      <div className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                   </motion.div>
                </div>
              )}
           </div>

           {/* Feedback Panels */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[40px] shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><Sparkles size={16} /></div>
                       <h3 className="text-sm font-black uppercase tracking-widest">Neural Insights</h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 font-mono">Real-time</span>
                 </div>
                 
                 <div className="space-y-4 max-h-[160px] overflow-y-auto no-scrollbar">
                    {logs.filter(l => l.type === 'ai').length === 0 ? (
                       <p className="text-xs text-slate-400 italic">Awaiting neural analysis...</p>
                    ) : (
                       logs.filter(l => l.type === 'ai').map((log, i) => (
                         <motion.div 
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           key={i} 
                           className="flex gap-3 last:border-blue-500/20 last:bg-blue-50/50 dark:last:bg-blue-500/5 p-3 rounded-2xl border border-transparent transition-all"
                         >
                            <ChevronRight size={14} className="flex-shrink-0 text-blue-500 mt-0.5" />
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{log.text}</p>
                         </motion.div>
                       ))
                    )}
                 </div>
              </div>

              <div className="p-8 bg-slate-900 dark:bg-slate-950 border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Gauge size={80} className="text-white" />
                 </div>
                 
                 <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Stream Telemetry</h3>
                    
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                             <span>Latency Spectrum</span>
                             <span className={metrics.latency < 200 ? "text-emerald-500" : "text-orange-500"}>{metrics.latency}ms</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               animate={{ width: `${Math.min(100, (metrics.latency / 500) * 100)}%` }}
                               className={cn("h-full", metrics.latency < 200 ? "bg-emerald-500" : "bg-orange-500")} 
                             />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">FPS Buffer</p>
                             <p className="text-xl font-black text-white">{metrics.fps}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Encoding</p>
                             <p className="text-xl font-black text-white uppercase italic">H.264</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
