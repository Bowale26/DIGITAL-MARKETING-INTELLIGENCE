import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  ShoppingBag, 
  PenTool, 
  Mail, 
  Target, 
  Share2, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Globe, 
  Database, 
  ChevronRight, 
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  MoreHorizontal,
  Loader2,
  FileText,
  MousePointer2,
  TrendingUp,
  Scale,
  Brain,
  Link as LinkIcon,
  BarChart3,
  Lightbulb,
  Users,
  Video,
  Rocket
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LoyaltyAgentService, AgentHandoff, AgentRole } from '../services/loyaltyAgentService';

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  pillar: string;
  description: string;
  status: 'offline' | 'initialized' | 'active' | 'syncing';
}

const modules: Module[] = [
  { id: 'insight', name: 'Insight Agent', icon: BarChart3, color: 'text-indigo-500', pillar: 'Analytics', description: 'BigQuery aggregation, behavior prediction, and churn analysis.', status: 'offline' },
  { id: 'decisioning', name: 'Decisioning', icon: Lightbulb, color: 'text-emerald-500', pillar: 'Strategy', description: 'Budget allocation, channel optimization, and strategic ROI.', status: 'offline' },
  { id: 'content', name: 'Content Agent', icon: Video, color: 'text-amber-500', pillar: 'Creative', description: 'Veo/Imagen synthesized assets and multi-format scaling.', status: 'offline' },
  { id: 'audience', name: 'Audience Agent', icon: Users, color: 'text-rose-500', pillar: 'Segmentation', description: 'High-LTV profile mapping and behavioral cohorts.', status: 'offline' },
  { id: 'co-marketer', name: 'Co-Marketer', icon: Rocket, color: 'text-blue-500', pillar: 'Optimization', description: 'Automated A/B testing and performance bid loops.', status: 'offline' },
  { id: 'shopping', name: 'Shopping Agent', icon: ShoppingBag, color: 'text-purple-500', pillar: 'Conversion', description: 'Personalized offers and real-time cart recovery.', status: 'offline' },
];

export default function MarketingSuite() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'idle' | 'activating' | 'ready'>('idle');
  const [logs, setLogs] = useState<AgentHandoff[]>([]);
  const [moduleStatus, setModuleStatus] = useState<Record<string, 'offline' | 'initialized' | 'active' | 'syncing'>>(
    Object.fromEntries(modules.map(m => [m.id, 'offline']))
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'insight' | 'decisioning' | 'content' | 'audience' | 'co-marketer' | 'shopping'>('overview');
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const initializeAll = async () => {
    setIsInitializing(true);
    setSystemStatus('activating');
    
    // Using the specific Flux initializer
    const newLogs = await LoyaltyAgentService.getInstance().processAction("Activate All Systems: Initialize Flux Neural Mesh Workspace");
    setLogs(newLogs);

    // Simulate tiered activation
    for (const mod of modules) {
      setModuleStatus(prev => ({ ...prev, [mod.id]: 'syncing' }));
      await new Promise(r => setTimeout(r, 400));
      setModuleStatus(prev => ({ ...prev, [mod.id]: 'active' }));
    }

    setSystemStatus('ready');
    setIsInitializing(false);
  };

  const activateModule = async (id: string, name: string) => {
    setModuleStatus(prev => ({ ...prev, [id]: 'syncing' }));
    const newLogs = await LoyaltyAgentService.getInstance().processAction(`Activate ${name} Agent: Neural Node Synchronization`);
    setLogs(prev => [...newLogs, ...prev]);
    setModuleStatus(prev => ({ ...prev, [id]: 'active' }));
  };

  const handleAsyncAction = async (action: string, label: string) => {
    setProcessingAction(label);
    const newLogs = await LoyaltyAgentService.getInstance().processAction(action);
    setLogs(prev => [...newLogs, ...prev]);
    setProcessingAction(null);
    
    // Scrolled to logs automatically or show a toast if system had it
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Action Overlay */}
      <AnimatePresence>
        {processingAction && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 right-12 z-50 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4 min-w-[300px]"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Flux Mesh Engine</p>
              <h4 className="text-sm font-bold">{processingAction}...</h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
               <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Protocol: Flux Neural Mesh</span>
             </div>
             {systemStatus === 'ready' && (
               <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Mesh Synchronized</span>
               </div>
             )}
          </div>
          <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
            Digital Marketing <span className="text-slate-300 dark:text-slate-800">Integration Suite</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
            Google AI Studio & Gemini Enterprise Orchestration. Six specialized A2A modules synchronized via the Flux Neural Mesh.
          </p>
        </div>

        <div className="flex gap-4">
           {systemStatus !== 'ready' ? (
             <button 
               onClick={initializeAll}
               disabled={isInitializing}
               className="h-16 px-12 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all flex items-center gap-4 group"
             >
                {isInitializing ? (
                  <>Synchronizing <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Activate Flux Mesh <Zap size={18} className="text-purple-500" /></>
                )}
             </button>
           ) : (
             <button className="h-16 px-12 bg-emerald-500 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 flex items-center gap-4">
                Mesh Fully Online <CheckCircle2 size={18} />
             </button>
           )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Module Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-4">Neural Node Pillars</h3>
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id as any)}
              className={cn(
                "w-full p-4 rounded-3xl transition-all border text-left group flex items-center gap-4",
                activeTab === mod.id 
                  ? "bg-white dark:bg-slate-950 border-purple-500 shadow-xl" 
                  : "bg-slate-50 dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                activeTab === mod.id ? "bg-purple-500 text-white" : "bg-white dark:bg-slate-900 text-slate-400"
              )}>
                <mod.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{mod.pillar}</p>
                <h4 className="text-sm font-bold truncate">{mod.name}</h4>
              </div>
              <ChevronRight size={14} className={cn("transition-transform", activeTab === mod.id ? "text-purple-500 translate-x-1" : "text-slate-300")} />
            </button>
          ))}

          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full mt-8 p-4 rounded-3xl border transition-all text-left flex items-center gap-4",
              activeTab === 'overview' ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 dark:bg-slate-900/50 border-transparent"
            )}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Synchronization</p>
              <h4 className="text-sm font-bold">Flux Neural Mesh</h4>
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="card-agency p-12 bg-white dark:bg-slate-950 min-h-[600px]"
             >
                {activeTab === 'overview' ? (
                  <div className="space-y-12">
                     <div className="flex items-start justify-between">
                        <div>
                           <h2 className="text-4xl font-bold uppercase tracking-tighter">Flux Neural Synchronization</h2>
                           <p className="text-slate-500 mt-4 text-lg">Managing the unified "brain" across 6 specialized AI agents.</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Neural Tokens</p>
                              <p className="text-xl font-black">99.1% Fidelity</p>
                           </div>
                           <Brain size={32} className="text-purple-500" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatusCard title="Mesh Sync" value="Nominal" icon={CheckCircle2} color="text-emerald-500" />
                        <StatusCard title="A2A Signal" value="1.2ms" icon={Zap} color="text-purple-500" />
                        <StatusCard title="ROI Projection" value="4.8x" icon={TrendingUp} color="text-blue-500" />
                     </div>

                     <div className="p-8 bg-slate-100 dark:bg-slate-900/50 rounded-[40px] border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Mesh Orchestration Topology</h3>
                        
                        <div className="relative">
                          {/* Flow Diagram */}
                          <div className="grid grid-cols-3 gap-4 mb-20 relative z-10">
                             <FlowBox label="Insight Agent" icon={BarChart3} color="text-indigo-500" sub="BigQuery Data" />
                             <FlowBox label="Decisioning" icon={Lightbulb} color="text-emerald-500" sub="Strategy Node" />
                             <FlowBox label="Content Agent" icon={Video} color="text-amber-500" sub="Veo/Imagen Gen" />
                          </div>

                          <div className="flex justify-center mb-20 relative z-10">
                             <div className="relative group">
                                <div className="absolute -inset-4 bg-purple-500/10 blur-xl opacity-100 transition-opacity" />
                                <FlowBox 
                                  label="Flux Neural Mesh" 
                                  icon={Brain} 
                                  color="text-purple-500" 
                                  sub="Unified Synchronization Layer" 
                                  className="w-80 border-2 border-purple-500 shadow-xl shadow-purple-500/10"
                                />
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 relative z-10">
                             <FlowBox label="Audience Agent" icon={Users} color="text-rose-500" sub="Segmentation" />
                             <FlowBox label="Co-Marketer" icon={Rocket} color="text-blue-500" sub="Optimization" />
                             <FlowBox label="Shopping Agent" icon={ShoppingBag} color="text-slate-900" sub="Conversion Node" />
                          </div>

                          {/* Connection Lines (SVGs) */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                            <path d="M 15% 15 L 50% 45" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                            <path d="M 50% 15 L 50% 45" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                            <path d="M 85% 15 L 50% 45" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                            <path d="M 50% 55 L 15% 85" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                            <path d="M 50% 55 L 50% 85" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                            <path d="M 50% 55 L 85% 85" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-400" />
                          </svg>
                        </div>
                     </div>

                     <div className="flex justify-end gap-4 pt-8">
                        <button 
                          onClick={() => handleAsyncAction("Export Workspace Configuration: Marketing Integration Sync", "Exporting Mesh Config")}
                          className="px-8 py-4 bg-slate-900 border border-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-transparent hover:text-slate-900 transition-all"
                        >
                           Export Workspace Config
                        </button>
                        <button 
                          onClick={() => handleAsyncAction("Re-Initialize Neural Mesh: Hard Reset Marketing Sync", "Re-Initializing Mesh")}
                          className="px-8 py-4 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-600/20"
                        >
                           Re-Initialize Neural Mesh
                        </button>
                     </div>
                  </div>
                ) : (
                  <ModuleView 
                    mod={modules.find(m => m.id === activeTab)!} 
                    onActivate={() => activateModule(activeTab, modules.find(m => m.id === activeTab)!.name)}
                    onAction={handleAsyncAction}
                    status={moduleStatus[activeTab]}
                  />
                )}
             </motion.div>
           </AnimatePresence>

           {/* Live A2A Logs */}
           <div className="card-agency p-8 bg-slate-900">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-2">
                   <Brain size={14} /> Agent Mesh Telemetry
                 </h3>
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Live Pulse</span>
              </div>
              <div className="space-y-2 h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                 {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-left-4">
                       <div className="text-[9px] font-mono text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</div>
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-white">
                             <span className="text-purple-400">{log.source}</span> → <span className="text-emerald-400">{log.target}</span>
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5 italic">{log.payload?.from || 'A2A_MESH_SIGNAL'} | {log.payload?.status || 'COMMITTED'}</p>
                       </div>
                       {log.target === 'OUTPUT_AGENT' && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                 )) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                       <Activity size={24} className="animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Awaiting System Activation</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm", color)}>
             <Icon size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
       </div>
       <h4 className="text-xl font-bold uppercase tracking-tight">{value}</h4>
    </div>
  );
}

function FlowBox({ label, icon: Icon, color, sub, className }: { label: string, icon: any, color: string, sub: string, className?: string }) {
  return (
    <div className={cn(
      "p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:scale-105 hover:shadow-2xl z-10",
      className
    )}>
       <div className="flex flex-col items-center gap-4 text-center">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 mb-2", color)}>
             <Icon size={24} />
          </div>
          <div>
             <h4 className="text-xs font-black uppercase tracking-widest leading-none mb-2">{label}</h4>
             <p className="text-[10px] font-bold text-slate-400 uppercase">{sub}</p>
          </div>
       </div>
    </div>
  );
}

function IntegrationLink({ from, to, label }: { from: string, to: string, label: string }) {
  return (
    <div className="flex items-center gap-6 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-purple-500/50 transition-all">
       <div className="flex-1">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-400">{from}</span>
             <LinkIcon size={10} className="text-purple-500" />
             <span className="text-[10px] font-bold text-slate-400">{to}</span>
          </div>
          <p className="text-xs font-bold mt-1 uppercase tracking-tight">{label}</p>
       </div>
       <div className="px-2 py-1 bg-emerald-500/10 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">Connected</div>
    </div>
  );
}

function ModuleView({ mod, onActivate, onAction, status }: { mod: Module, onActivate: () => void, onAction: (a: string, l: string) => void, status: string }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl", mod.color.replace('text-', 'bg-').replace('500', '500/10'), mod.color)}>
            <mod.icon size={40} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{mod.pillar}</p>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">{mod.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {status === 'active' ? (
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => onAction(`Generate Performance Report for ${mod.name}`, "Synthesizing PDF Report")}
                 className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-white transition-all text-slate-500 hover:text-purple-500"
                 title="Generate Report"
               >
                 <FileText size={20} />
               </button>
               <div className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} /> Module Active
               </div>
             </div>
           ) : status === 'syncing' ? (
             <div className="px-6 py-2 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Synchronizing
             </div>
           ) : (
             <button 
               onClick={onActivate}
               className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl"
             >
                Initialize Module
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
         <div className="space-y-8">
            <div>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Core Capabilities</h3>
                  <button 
                    onClick={() => onAction(`Scale operations for ${mod.name} node`, "Scaling Infrastructure")}
                    className="text-[9px] font-black uppercase tracking-widest text-purple-500 hover:underline"
                  >
                    Scale Nodes
                  </button>
               </div>
               <div className="space-y-3">
                  {mod.description.split(',').map((cap, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                       <div className="w-2 h-2 rounded-full bg-purple-500" />
                       <span className="text-xs font-bold uppercase tracking-tight">{cap.trim()}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div>
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">A2A Protocols</h3>
               <div className="grid grid-cols-2 gap-3">
                  <ProtocolTag label="Neural Grounding" />
                  <ProtocolTag label="Ledger Sync" />
                  <ProtocolTag label="Tier Analysis" />
                  <ProtocolTag label="Audit Trail" />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 bg-slate-900 rounded-[40px] border border-white/5 h-full relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                  <TrendingUp size={120} className="text-white" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-400">Performance Target</h3>
                    <div className="px-2 py-1 bg-purple-500/20 rounded text-[8px] font-black text-purple-400 uppercase tracking-widest">Optimized</div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-4xl font-bold text-white tracking-tighter">+24.5%</span>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pb-1">Efficiency Baseline</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 w-[84%]" />
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Module is currently optimized for high-intensity scaling. All 14 data nodes are reporting low latency and high precision (99.1% target matched).
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Operational Parameters</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ParamItem label="Update Frequency" value="Real-time" />
            <ParamItem label="Logic Engine" value="Bayesian-V4" />
            <ParamItem label="Privacy" value="Tier 1" />
            <ParamItem label="ROI Predicted" value="4.8x" />
         </div>
      </div>
    </div>
  );
}

function ProtocolTag({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-transparent hover:border-purple-500/20 transition-all flex items-center gap-2">
       <CheckCircle2 size={12} className="text-emerald-500" />
       {label}
    </div>
  );
}

function ParamItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
       <p className="text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}
