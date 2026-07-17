import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  Layers, 
  ShieldCheck, 
  Image as ImageIcon, 
  Send, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Globe,
  Settings,
  MoreHorizontal,
  Loader2,
  ArrowRight,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';

interface WorkflowStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  description: string;
  subtasks: string[];
}

const initialSteps: WorkflowStep[] = [
  { id: 1, label: 'Brief Parsing', status: 'pending', description: 'Extracting structured parameters from raw campaign input.', subtasks: ['Identify Objectives', 'Extract Target Audience', 'Map Key Messaging'] },
  { id: 2, label: 'Variant Engine', status: 'pending', description: 'Synthesizing platform-specific ad sets for Google, Meta, and LinkedIn.', subtasks: ['Search Ad Copy', 'Display Headings', 'Social Captions'] },
  { id: 3, label: 'Brand Lock', status: 'pending', description: 'Enforcing linguistic alignment via the tuned Flux model.', subtasks: ['Apply RULE-BRAND-003', 'Validate RULE-TONE-001', 'Inject RULE-CTA-002'] },
  { id: 4, label: 'Compliance Scan', status: 'pending', description: 'Scanning creatives against global platform policies.', subtasks: ['Check Google Policy', 'Scan Meta Guidelines', 'LinkedIn Professional Filter'] },
  { id: 5, label: 'Media Synthesis', status: 'pending', description: 'Generating high-fidelity visual assets from copy prompts.', subtasks: ['Image Generation', 'Motion Mockups', 'Aspect Ratio Sizing'] },
  { id: 6, label: 'Publishing', status: 'pending', description: 'Pushing approved creatives to live ad endpoints.', subtasks: ['API Token Auth', 'Budget Allocation', 'Targeting Injection'] },
];

export default function AdOrchestrator() {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [brief, setBrief] = useState('');

  const startOrchestration = async () => {
    if (!brief.trim()) return;
    setIsOrchestrating(true);
    setActiveStep(1);
    
    // Log to mesh
    await LoyaltyAgentService.getInstance().processAction(`Ad Orchestration: ${brief.substring(0, 30)}...`);

    // Simulate orchestration sequence
    const processStep = (index: number) => {
      if (index > steps.length) {
        setIsOrchestrating(false);
        return;
      }

      setSteps(prev => prev.map(s => {
        if (s.id === index) return { ...s, status: 'active' };
        if (s.id < index) return { ...s, status: 'completed' };
        return s;
      }));
      setActiveStep(index);

      setTimeout(() => processStep(index + 1), 2500);
    };

    processStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-orange-500/10 rounded-full">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Automation Level: FULL</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Rocket size={10} className="text-orange-500" />
            <span>Flux Neural Orchestrator V2.1</span>
          </div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
          Ad <span className="text-slate-300 dark:text-slate-800">Orchestrator</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
          Complete campaign automation. From raw brief to live ROI—orchestrated by a single neural clock-cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Mission Entry (Brief) */}
        <div className="lg:col-span-12">
           <div className="p-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] flex items-center justify-center shadow-xl">
                    <FileText size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter">Campaign Objective Brief</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Input requirements to trigger multi-channel synthesis</p>
                 </div>
              </div>

              <textarea 
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. Launching a high-end sustainable watch brand. Target: HNWI, 30-55, interested in tech and ethics. Need Google Search, Instagram Stories, and LinkedIn Sponsored Content. Focus on craftsmanship and ROI."
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-lg min-h-[180px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />

              <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
                 <div className="flex gap-4">
                    <button className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-slate-100 dark:border-slate-800">
                       Load App Template
                    </button>
                    <button className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-slate-100 dark:border-slate-800">
                       Style Lock: Editorial
                    </button>
                 </div>
                 <button 
                   onClick={startOrchestration}
                   disabled={isOrchestrating || !brief.trim()}
                   className="h-16 px-12 bg-orange-500 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                 >
                    {isOrchestrating ? (
                      <>
                        Generating <Loader2 size={18} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Generate Campaign <ArrowRight size={18} />
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>

        {/* Real-time Pipeline Visualizer */}
        <div className="lg:col-span-8">
           <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Orchestration Pipeline</h2>
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-8 border rounded-[32px] transition-all relative overflow-hidden",
                    step.status === 'active' ? "bg-white dark:bg-slate-950 border-orange-500 shadow-2xl ring-4 ring-orange-500/5 scale-[1.02] z-10" : 
                    step.status === 'completed' ? "bg-white dark:bg-slate-950 border-emerald-500/20" : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60"
                  )}
                >
                   {step.status === 'active' && (
                     <div className="absolute top-0 left-0 h-full w-1.5 bg-orange-500 animate-pulse" />
                   )}
                   
                   <div className="flex items-start justify-between gap-8">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black font-mono text-slate-400">0{step.id}</span>
                            <div className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                              step.status === 'active' ? "bg-orange-500 text-white" : 
                              step.status === 'completed' ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                            )}>
                               {step.status}
                            </div>
                         </div>
                         <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{step.label}</h3>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.description}</p>
                         
                         {step.status === 'active' && (
                           <div className="mt-6 flex flex-wrap gap-2">
                              {step.subtasks.map(t => (
                                <div key={t} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-[8px] font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                                   {t}
                                </div>
                              ))}
                           </div>
                         )}
                      </div>

                      <div className="flex flex-col items-center justify-center">
                         {step.status === 'completed' ? (
                           <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 size={24} />
                           </div>
                         ) : step.status === 'active' ? (
                           <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                              <Loader2 size={24} className="animate-spin" />
                           </div>
                         ) : (
                           <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                              <MoreHorizontal size={24} />
                           </div>
                         )}
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Quick Actions & Live Logs */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 bg-slate-900 dark:bg-slate-950 border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#FF6B00] mb-8">Direct Execution</h3>
                 
                 <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Create Platform Variants', icon: Layers, action: 'Ad Orchestration: Create Platform Variants' },
                      { label: 'Run Compliance Check', icon: ShieldCheck, action: 'Ad Orchestration: Run Compliance Scan' },
                      { label: 'Generate Media Assets', icon: ImageIcon, action: 'Ad Orchestration: Media Synthesis Generate' },
                      { label: 'Publish to Google Ads', icon: Send, action: 'Ad Orchestration: Push to Google Ads API' },
                      { label: 'Publish to Meta Ads', icon: Send, action: 'Ad Orchestration: Push to Meta Ads API' },
                      { label: 'Schedule A/B Test', icon: Clock, action: 'Ad Orchestration: Schedule Bayesian A/B Test' },
                      { label: 'Auto-Optimize', icon: TrendingUp, action: 'Ad Orchestration: Auto-Optimize ROI Loop' }
                    ].map((btn) => (
                      <button 
                        key={btn.label}
                        onClick={() => LoyaltyAgentService.getInstance().processAction(btn.action)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <btn.icon size={16} className="text-slate-400 group-hover:text-[#FF6B00]" />
                            {btn.label}
                         </div>
                         <ChevronRight size={14} className="text-slate-600" />
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Execution Telemetry</h3>
              <div className="space-y-4">
                 {[
                   { t: '14:20:11', msg: 'Neural Brief Mapping: Confirmed', color: 'text-emerald-500' },
                   { t: '14:20:09', msg: 'Auth Token Secured: Google Ads API', color: 'text-blue-500' },
                   { t: '14:19:55', msg: 'System Ready for Synthesis', color: 'text-slate-400' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-3">
                      <div className="flex-1">
                         <p className={cn("text-[10px] font-black uppercase", log.color)}>{log.msg}</p>
                         <p className="text-[8px] font-mono text-slate-400 font-bold">{log.t} UTC</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">ROI Prediction</span>
                    <span className="text-[10px] font-black text-emerald-500">+14.2%</span>
                 </div>
                 <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[74%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
