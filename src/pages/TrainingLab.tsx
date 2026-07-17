import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  BarChart, 
  Zap, 
  Clock, 
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Play,
  Upload,
  ChevronRight,
  Loader2,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LoyaltyAgentService, AgentHandoff } from '../services/loyaltyAgentService';

interface Dataset {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  status: 'imported' | 'preparing' | 'ready';
}

const initialDatasets: Dataset[] = [
  {
    id: "DATA-BRAND-001",
    name: "Success Ad Corpus",
    description: "Historical high-performing ad copy and performance metrics.",
    type: "Performance Data",
    size: "24.2 MB",
    status: 'ready'
  },
  {
    id: "DATA-BRAND-002",
    name: "Style Guide v4.1",
    description: "Brand voice components, linguistic rules, and style parameters.",
    type: "Documentation",
    size: "1.5 MB",
    status: 'ready'
  },
  {
    id: "DATA-BRAND-003",
    name: "Email Pipeline Log",
    description: "Multi-touch email sequence drafts and engagement stats.",
    type: "Interaction Data",
    size: "8.8 MB",
    status: 'ready'
  },
  {
    id: "DATA-BRAND-004",
    name: "Sentiment Vault",
    description: "Raw customer reviews and qualitative sentiment maps.",
    type: "Feedback",
    size: "12.4 MB",
    status: 'ready'
  }
];

export default function TrainingLab() {
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);
  const [isTuning, setIsTuning] = useState(false);
  const [tuningStep, setTuningStep] = useState(0);
  const [tuningComplete, setTuningComplete] = useState(false);
  const [logs, setLogs] = useState<AgentHandoff[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tuningSteps = [
    "Preprocessing Uploaded Datasets",
    "Initializing Supervised Fine-Tuning",
    "Weight Recalibration (Epoch 1/3)",
    "Gradient Mapping (Epoch 2/3)",
    "Linguistic Alignment (Epoch 3/3)",
    "Validating perplexity + human preference score",
    "Deploying Dedicated Endpoint"
  ];

  const handleStartTuning = async () => {
    setIsTuning(true);
    setTuningStep(0);
    setTuningComplete(false);
    
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction("Execute Fine-Tuning Sequence: Supervised Weights Alignment");
    setLogs(prev => [...meshLogs, ...prev]);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < tuningSteps.length) {
        setTuningStep(currentStep);
      } else {
        clearInterval(interval);
        setIsTuning(false);
        setTuningComplete(true);
      }
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    const mesh = LoyaltyAgentService.getInstance();
    
    // Create simulated new dataset
    const newDoc: Dataset = {
      id: `DATA-BRAND-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      description: `User-uploaded corpus: ${file.type}`,
      type: "User Data",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'ready'
    };

    setDatasets(prev => [newDoc, ...prev]);
    const meshLogs = await mesh.processAction(`Upload Dataset: ${file.name} (${file.size} bytes)`);
    setLogs(prev => [...meshLogs, ...prev]);
    setIsSyncing(false);
  };

  const handleDeleteDataset = async (id: string, name: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction(`Delete Dataset: ${name}`);
    setLogs(prev => [...meshLogs, ...prev]);
  };

  const handleGenericAction = async (action: string) => {
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction(action);
    setLogs(prev => [...meshLogs, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-purple-500/10 rounded-full">
                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Tuning Lab Active</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                 <Settings size={10} className="text-purple-500" />
                 <span>Dedicated Model Protocol V1.5</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Training <span className="text-slate-300 dark:text-slate-800">Lab</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
             Fine-tune Gemini on your specific brand artifacts. Transcend generic AI with weighted linguistic alignment.
           </p>
        </div>
        
        <div className="flex gap-4">
           <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isSyncing}
             className="h-14 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
           >
              {isSyncing ? 'Ingesting...' : 'Upload Dataset'} 
              <Upload size={18} className={cn(isSyncing && "animate-bounce")} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Datasets Management */}
        <div className="lg:col-span-12 space-y-4">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Model Training Data</h2>
             <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
                <span>Total Payload: 46.9MB</span>
                <span>Tuning Buffer: 100GB</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {datasets.map((d) => (
              <div key={d.id} className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleDeleteDataset(d.id, d.name)}
                     className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                   >
                    <Trash2 size={14} />
                   </button>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-2xl w-fit mb-6 text-purple-500">
                  <Database size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight mb-2">{d.name}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-6 line-clamp-2">{d.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-900">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{d.size}</span>
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{d.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tuning Console */}
        <div className="lg:col-span-8">
          <div className="p-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] shadow-2xl relative overflow-hidden">
             {isTuning && (
               <div className="absolute top-0 left-0 w-full h-1">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 14, ease: "linear" }}
                   className="h-full bg-purple-500"
                 />
               </div>
             )}

             <div className="flex flex-col xl:flex-row justify-between gap-8 mb-12">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", isTuning ? "bg-purple-500 animate-pulse" : "bg-slate-900 dark:bg-white dark:text-slate-900")}>
                         <Cpu size={24} />
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter">Model Orchestrator</h3>
                   </div>
                   <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
                     Supervised fine-tuning focused on linguistic alignment. We apply low-rank adaptation to maintain base model reasoning while specializing the output style.
                   </p>
                </div>

                <div className="space-y-4 min-w-[240px]">
                   <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Model Architecture</p>
                      <p className="text-sm font-bold uppercase font-mono">gemini-1.5-pro</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Compute Infrastructure</p>
                      <p className="text-sm font-bold uppercase font-mono">TPU v4 Instance</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Epochs</label>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold">3.0 (Linear)</div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learning Rate</label>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold">2e-5</div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validation Split</label>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold">20.0%</div>
                   </div>
                </div>

                <AnimatePresence mode="wait">
                  {isTuning ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 bg-purple-50 dark:bg-purple-500/5 rounded-3xl border border-purple-200 dark:border-purple-900/40"
                    >
                       <div className="flex items-center gap-4 mb-6">
                          <Loader2 size={24} className="animate-spin text-purple-500" />
                          <h4 className="text-xl font-bold uppercase tracking-tight text-purple-900 dark:text-purple-400">Tuning Active...</h4>
                       </div>
                       <div className="space-y-3">
                          {tuningSteps.map((step, i) => (
                            <div key={i} className={cn(
                              "flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                              tuningStep === i ? "text-purple-600 dark:text-purple-300" : tuningStep > i ? "text-emerald-500 opacity-60" : "text-slate-400 opacity-30"
                            )}>
                               {tuningStep > i ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                               {step}
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  ) : tuningComplete ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-12 bg-emerald-50 dark:bg-emerald-500/5 rounded-[40px] border border-emerald-500/20 text-center"
                    >
                       <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                          <ShieldCheck size={40} />
                       </div>
                       <h4 className="text-3xl font-bold uppercase tracking-tighter mb-2 text-emerald-900 dark:text-emerald-400">Tuning Successful</h4>
                       <p className="text-emerald-600/80 mb-8 max-w-sm mx-auto font-medium">Model fine-grained weights have been successfully re-indexed. Dedicated endpoint is now live.</p>
                       <div className="flex gap-4 justify-center">
                          <button 
                            onClick={() => handleGenericAction("View Fine-Tuning Evaluation Report")}
                            className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                          >
                             View Evaluation Report
                          </button>
                          <button 
                            onClick={handleStartTuning}
                            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                          >
                             Re-run Tuning
                          </button>
                       </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleStartTuning}
                      className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] text-lg font-black uppercase tracking-[0.2em] shadow-xl hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-4"
                    >
                       Execute Fine-Tuning Sequence <Play size={24} />
                    </button>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 bg-slate-900 dark:bg-slate-950 border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <BarChart size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Performance Targets</h3>
                 
                 <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                           <span>Human Preference Score</span>
                           <span className="text-emerald-500">Target: 94%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[94%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                           <span>Model Perplexity</span>
                           <span className="text-blue-500">Target: {"< 1.2"}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[88%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                           <span>Style Divergence</span>
                           <span className="text-orange-500">Target: Secure</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500 w-[92%]" />
                        </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Mesh Logs Layer */}
           <div className="p-8 bg-slate-900 rounded-[32px] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-2">
                   <Activity size={14} /> Training Mesh Log
                 </h3>
              </div>
              <div className="space-y-2 h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-left-4">
                      <div className="text-[9px] font-mono text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</div>
                      <div className="flex-1">
                         <p className="text-[10px] font-bold text-white">
                            <span className="text-amber-400">{log.source}</span> → <span className="text-purple-400">{log.target}</span>
                         </p>
                         <p className="text-[9px] text-slate-400 mt-0.5 italic">{log.payload?.from || 'TRAINING_MESH_SIGNAL'} | {log.payload?.status || 'COMMITTED'}</p>
                      </div>
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                      <Clock size={24} className="animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Awaiting Signals</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Tuning History</h3>
              <div className="space-y-4">
                 {[
                   { date: 'Oct 24, 2023', ver: 'v1.4.2', score: '92.1', status: 'Archive' },
                   { date: 'Sep 12, 2023', ver: 'v1.3.1', score: '88.5', status: 'Archive' },
                   { date: 'Aug 01, 2023', ver: 'v1.2.0', score: '84.2', status: 'Archive' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-purple-500/30 transition-all">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-tight">{log.ver}</p>
                         <p className="text-[8px] font-bold text-slate-400">{log.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-emerald-500">{log.score}</p>
                         <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">{log.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => handleGenericAction("View Full Tuning Audit Trail: Immutable Ledger Access")}
                className="mt-6 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                View Full Audit Trail <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
