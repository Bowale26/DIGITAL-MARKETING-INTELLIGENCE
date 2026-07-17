import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Layout, 
  Zap, 
  Code, 
  Globe, 
  Cpu, 
  Layers, 
  Settings, 
  Activity, 
  CheckCircle2, 
  Box, 
  Ruler, 
  Palette, 
  Terminal, 
  Cloud,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Cpu as CpuIcon,
  Server,
  Sparkles,
  Database,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LoyaltyAgentService, AgentHandoff } from '../services/loyaltyAgentService';

export default function WebDesignLab() {
  const [activeTab, setActiveTab] = useState<'genesis' | 'ux-engine' | 'performance' | 'codebase'>('genesis');
  const [logs, setLogs] = useState<AgentHandoff[]>([]);
  const [isActivating, setIsActivating] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(-1);

  const steps = [
    { id: 'INTENT', label: 'Intent Parser', icon: Search, intent: 'INTEL_TREND_TASK' },
    { id: 'REQS', label: 'Requirements', icon: Box, intent: 'REQUIREMENTS_GEN' },
    { id: 'DESIGN', label: 'Design System', icon: Palette, intent: 'DESIGN_SYSTEM_GEN' },
    { id: 'CODE', label: 'Component Code', icon: Code, intent: 'CODE_GEN_PIPELINE' },
    { id: 'PAGE', label: 'Page Assembler', icon: Layout, intent: 'PAGE_ASSEMBLER' },
    { id: 'BACKEND', label: 'Backend Gen', icon: Database, intent: 'BACKEND_INFRA_GEN' },
    { id: 'QA', label: 'QA & Audit', icon: ShieldCheck, intent: 'PERFORMANCE_AUDIT' },
    { id: 'DEPLOY', label: 'Deployment', icon: Cloud, intent: 'EDGE_DEPLOY_STRATEGY' }
  ];

  const handleMeshAction = async (intent: string, action: string) => {
    setIsActivating(intent);
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction(action);
    setLogs(prev => [...meshLogs, ...prev]);
    setIsActivating(null);
  };

  const runGenesisPipeline = async () => {
    setPipelineStep(0);
    const mesh = LoyaltyAgentService.getInstance();
    
    for (let i = 0; i < steps.length; i++) {
      setPipelineStep(i);
      const step = steps[i];
      const meshLogs = await mesh.processAction(`Genesis Execution: ${step.label} Stage`);
      setLogs(prev => [...meshLogs, ...prev]);
      await new Promise(r => setTimeout(r, 800));
    }
    setPipelineStep(-1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center gap-2">
                <CpuIcon size={12} className="text-blue-500" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Engineering Framework V4</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Web Design <span className="text-slate-300 dark:text-slate-800">& Dev Lab</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
             Autonomous design systems and performance-first engineering pipelines.
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-3xl">
           {[
             { id: 'genesis', label: 'Genesis Engine', icon: Sparkles },
             { id: 'ux-engine', label: 'UX/UI Engine', icon: Layout },
             { id: 'performance', label: 'Performance', icon: Zap },
             { id: 'codebase', label: 'Code Pipeline', icon: Terminal }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               <tab.icon size={14} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
             {activeTab === 'genesis' ? (
                <motion.div 
                   key="genesis"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                >
                   <div className="card-agency p-12 bg-slate-900 border-none relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                         <Sparkles size={240} />
                      </div>
                      <div className="relative z-10 space-y-8">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                               <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white">Genesis Protocol</h2>
                               <p className="text-slate-400 font-medium max-w-sm">Autonomous blueprint-to-code orchestration. Launching 8 independent specialist nodes.</p>
                            </div>
                            <button 
                              onClick={runGenesisPipeline}
                              disabled={pipelineStep !== -1}
                              className={cn(
                                "h-20 px-12 bg-white text-slate-950 rounded-[32px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                                pipelineStep !== -1 ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                              )}
                            >
                               {pipelineStep === -1 ? (
                                 <>Initialize Engineering Loop <ChevronRight size={16} /></>
                               ) : (
                                 <><Loader2 className="animate-spin" size={16} /> Pipeline Running...</>
                               )}
                            </button>
                         </div>

                         {/* Pipeline Visualization */}
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 pt-8">
                            {steps.map((step, i) => (
                               <div key={step.id} className="relative">
                                  <div className={cn(
                                    "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-500",
                                    pipelineStep === i ? "bg-white/10 scale-110 shadow-xl border border-white/20" : 
                                    pipelineStep > i || pipelineStep === -1 ? "opacity-100" : "opacity-30 grayscale"
                                  )}>
                                     <div className={cn(
                                       "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                       pipelineStep === i ? "bg-blue-500 text-white" : 
                                       pipelineStep > i ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500"
                                     )}>
                                        {pipelineStep > i ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                                     </div>
                                     <p className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400">{step.label}</p>
                                  </div>
                                  {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-9 -right-2 w-4 h-px bg-white/10" />
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card-agency p-8 bg-blue-500/5 border-blue-500/20">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Input & Intake Engine</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 italic">
                           "The Intake Engine sanitizes user intent into structured engineering requirements across 5 documentation pillars."
                         </p>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><Search size={12} /> NLP Parse</span>
                            <span className="flex items-center gap-1"><Monitor size={12} /> Tech Intent</span>
                         </div>
                      </div>
                      <div className="card-agency p-8 bg-emerald-500/5 border-emerald-500/20">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">QA & Audit Pipeline</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 italic">
                           "Every synthesized component undergoes Lighthouse audit and responsive collision testing before deployment."
                         </p>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><Zap size={12} /> Perf Scan</span>
                            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Sec Audit</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
             ) : activeTab === 'ux-engine' ? (
                <motion.div 
                  key="ux-engine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   {/* Design System Generator Card */}
                   <div className="p-10 bg-slate-900 rounded-[48px] text-white overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                         <Layout size={180} />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                               <Palette size={24} />
                            </div>
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Design System Generator</h3>
                         </div>
                         <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                            Synthesize a complete design system including semantic tokens, atomic component libraries, and global style guides tailored to your brand DNA.
                         </p>
                         <div className="flex gap-4">
                            <button 
                              onClick={() => handleMeshAction('DESIGN_SYSTEM_GEN', 'Synthesize Design System: Multi-platform Atomic Architecture')}
                              disabled={isActivating === 'DESIGN_SYSTEM_GEN'}
                              className="px-8 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                            >
                               {isActivating === 'DESIGN_SYSTEM_GEN' ? <Loader2 className="animate-spin" size={14} /> : 'Generate UI Kit'}
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { title: 'Wireframe Auto-Gen', description: 'Convert market intent into high-fidelity structural wireframes.', icon: Monitor },
                        { title: 'AI Personalization', description: 'Dynamic UI adjustments based on user behavior clusters.', icon: Box },
                        { title: 'Micro-Interactions', description: 'Fluid motion paths and state transitions for enhanced UX.', icon: Ruler },
                        { title: 'VUI/AR Strategy', description: 'Extended reality and voice interface mapping protocols.', icon: Globe }
                      ].map((item, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] hover:border-blue-500/30 transition-all cursor-pointer group">
                           <item.icon size={24} className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                           <h4 className="text-lg font-bold mb-2 uppercase tracking-tight">{item.title}</h4>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                   </div>
                </motion.div>
             ) : activeTab === 'performance' ? (
                <motion.div 
                  key="performance"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                   <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                              <Zap size={24} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-bold uppercase tracking-tight">Performance Budget Enforcer</h3>
                              <p className="text-sm text-slate-500 font-medium">Core Web Vitals optimization and bundle size regulation.</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => handleMeshAction('PERFORMANCE_AUDIT', 'Execute Performance Audit: Core Web Vitals Optimization Protocol')}
                           className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                         >
                            Audit Vitals
                         </button>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                         {[
                           { label: 'LCP', value: '0.8s', status: 'Optimal' },
                           { label: 'FID', value: '12ms', status: 'Optimal' },
                           { label: 'CLS', value: '0.02', status: 'Optimal' }
                         ].map(metric => (
                           <div key={metric.label} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{metric.value}</p>
                              <div className="flex items-center gap-1 mt-2 text-[8px] font-black uppercase text-emerald-500">
                                 <CheckCircle2 size={10} /> {metric.status}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px]">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00] mb-6">Edge Deployment Strategy</h4>
                         <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                            Intelligent global traffic steering and serverless edge worker integration for sub-50ms TTFB.
                         </p>
                         <button 
                           onClick={() => handleMeshAction('EDGE_DEPLOY_STRATEGY', 'Configure Edge Deployment: Global Traffic Steering Setup')}
                           className="flex items-center gap-2 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:underline"
                         >
                            Deploy to Edge <ChevronRight size={14} />
                         </button>
                      </div>
                      <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px]">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6">Caching Strategy Engine</h4>
                         <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                            Multilayer cache invalidation and predictive prefetching algorithms to maximize hit rates.
                         </p>
                         <button className="flex items-center gap-2 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:underline">
                            Configure Policy <ChevronRight size={14} />
                         </button>
                      </div>
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                  key="codebase"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                   <div className="p-10 bg-slate-900 rounded-[48px] border border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                         <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      </div>
                      
                      <div className="relative z-10 space-y-8">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                               <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-white">Custom Code Generation</h3>
                               <p className="text-slate-400 max-w-sm font-medium">Per-user component synthesis and automated deployment pipelines.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                               <button 
                                 onClick={() => handleMeshAction('CODE_GEN_FREE', 'Synthesize Portfolio: Static HTML/Tailwind Pipeline')}
                                 className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
                               >
                                  Free Tier
                               </button>
                               <button 
                                 onClick={() => handleMeshAction('CODE_GEN_PRO', 'Synthesize SaaS Landing: Next.js + Pro Protocol')}
                                 className="px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-500/20"
                               >
                                  Pro Tier
                               </button>
                               <button 
                                 onClick={() => handleMeshAction('CODE_GEN_ENTERPRISE', 'Synthesize E-commerce: Enterprise Full-Stack Engine')}
                                 className="px-6 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                               >
                                  Enterprise
                               </button>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { label: 'FREE', stack: 'HTML/Tailwind/JS', extras: 'Static Hosting' },
                              { label: 'PRO', stack: 'Next.js/Framer/GA4', extras: 'Custom Domain' },
                              { label: 'ENT', stack: 'tRPC/Stripe/SSO', extras: 'Edge Deploy' }
                            ].map((tier, i) => (
                              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-3">
                                 <h4 className="text-[10px] font-black text-[#FF6B00] tracking-[0.2em]">{tier.label}</h4>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white">{tier.stack}</p>
                                    <p className="text-[9px] text-slate-500 font-medium italic">Incl: {tier.extras}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00]">User Intake Engine</h4>
                         <p className="text-sm text-slate-500 font-medium">Structured requirement gathering via autonomous agent clarification loops.</p>
                         <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-slate-400">Step 01/05</span>
                            <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Active</span>
                         </div>
                      </div>
                      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Tier Gating Protocol</h4>
                         <p className="text-sm text-slate-500 font-medium">Logical access control and resource allocation based on user engagement tier.</p>
                         <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-slate-400">Enforced by LEDGER</span>
                            <span className="text-blue-500 flex items-center gap-1"><ShieldCheck size={12} /> Secure</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Sidebar Log/Metrics */}
        <div className="lg:col-span-4 space-y-8">
           {/* Engineering Mesh Log */}
           <div className="p-8 bg-slate-900 rounded-[32px] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                   <Activity size={14} /> Engineering Protocol
                 </h3>
              </div>
              <div className="space-y-2 h-[240px] overflow-y-auto pr-4 scrollbar-hide">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-left-4">
                      <div className="text-[9px] font-mono text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</div>
                      <div className="flex-1">
                         <p className="text-[10px] font-bold text-white">
                            <span className="text-blue-400">{log.source}</span> → <span className="text-emerald-400">{log.target}</span>
                         </p>
                         <p className="text-[9px] text-slate-400 mt-0.5 italic">{log.payload?.operation || 'DEPLOYMENT_SIGNAL'} | {log.payload?.status || 'COMMITTED'}</p>
                      </div>
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                      <Clock size={24} className="animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">System Standby</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                 <Server size={18} className="text-slate-400 mb-4" />
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Servers</p>
                 <p className="text-xl font-bold">142</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                 <Settings size={18} className="text-slate-400 mb-4" />
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Mesh Health</p>
                 <p className="text-xl font-bold text-emerald-500">99.9%</p>
              </div>
           </div>

           {/* Infrastructure Advisory */}
           <div className="card-agency p-8 bg-blue-500/5 border-blue-500/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                 <ShieldCheck size={14} /> Security Advisory
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                "Autonomous code generation pipeline is active under Tier Gating. All generated assets are sanitized and snapshot-tested before production deployment."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
