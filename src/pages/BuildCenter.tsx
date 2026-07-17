import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  Search, 
  Users, 
  Calendar, 
  Plus, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  Layout,
  Code,
  Sparkles,
  RefreshCw,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { generateBuildCenterContent } from '../services/geminiService';

interface AppTemplate {
  id: string;
  name: string;
  instructions: string;
  buttons: string[];
  icon: any;
  color: string;
  tag: string;
}

const templates: AppTemplate[] = [
  {
    id: "APP-AD-GEN",
    name: "Ad Campaign Generator",
    instructions: "Act as a senior performance marketer. Generate platform-optimized ad creatives with targeting recommendations.",
    buttons: ["Generate Ad Set", "Preview Across Platforms", "Export to Google Ads", "Export to Meta Ads Manager", "Schedule A/B Test"],
    icon: Target,
    color: "bg-orange-500",
    tag: "Performance"
  },
  {
    id: "APP-SEO-AUDIT",
    name: "SEO Audit & Optimizer",
    instructions: "Act as an SEO specialist. Analyze websites, identify issues, and generate optimization roadmaps.",
    buttons: ["Run Technical Audit", "Analyze Backlink Profile", "Generate Content Gap Analysis", "Create Optimization Plan", "Export to PM Tool"],
    icon: Search,
    color: "bg-blue-500",
    tag: "Search"
  },
  {
    id: "APP-LEAD-QUAL",
    name: "Lead Qualification Engine",
    instructions: "Act as a sales strategist. Score leads, prioritize follow-ups, and suggest nurturing sequences.",
    buttons: ["Score Incoming Lead", "Assign to Strategist", "Trigger Nurture Sequence", "Schedule Discovery Call", "Update CRM Status"],
    icon: Users,
    color: "bg-emerald-500",
    tag: "Sales"
  },
  {
    id: "APP-CONTENT-CAL",
    name: "Content Calendar Builder",
    instructions: "Act as a content strategist. Plan, schedule, and optimize content across all channels.",
    buttons: ["Generate Monthly Calendar", "Suggest Trending Topics", "Auto-Assign to Writers", "Set Publishing Schedule", "Track Performance"],
    icon: Calendar,
    color: "bg-purple-500",
    tag: "Strategy"
  }
];

export default function BuildCenter() {
  const [deploying, setDeploying] = useState<string | null>(null);
  const [deployedApps, setDeployedApps] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState<{
    id: string;
    button: string;
    content: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDeploy = (id: string) => {
    setDeploying(id);
    setTimeout(() => {
      setDeployedApps(prev => [...prev, id]);
      setDeploying(null);
    }, 2500);
  };

  const handleActionButton = async (template: AppTemplate, button: string) => {
    if (!deployedApps.includes(template.id)) return;
    
    setIsGenerating(`${template.id}-${button}`);
    try {
      const content = await generateBuildCenterContent(template.name, template.instructions, button);
      setActiveResult({ id: template.id, button, content });
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white px-4">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-orange-500/10 rounded-full">
                 <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Build Mode Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">V2.0.4 Staging</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Build <span className="text-slate-300 dark:text-slate-800">Center</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
             Instantiate specialized AI applications from prompt infrastructure. Turn strategy into reusable logic nodes.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Containers</p>
              <p className="text-2xl font-black font-mono">{deployedApps.length} / 12</p>
           </div>
           <button className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-all">
              <Plus size={24} />
           </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((template) => (
          <motion.div 
            key={template.id}
            whileHover={{ y: -4 }}
            className="group relative bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-900 p-10 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-10 transition-opacity", template.color)} />
            
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                  <div className={cn("p-4 rounded-3xl text-white shadow-xl shadow-current/10", template.color)}>
                     <template.icon size={28} />
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono italic">ID: {template.id}</span>
                     <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{template.tag}</span>
                     </div>
                  </div>
               </div>

               <h3 className="text-3xl font-bold uppercase tracking-tighter mb-4 leading-tight group-hover:text-orange-500 transition-colors">
                  {template.name}
               </h3>
               
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10">
                  {template.instructions}
               </p>

               <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Protocols</p>
                    </div>
                    {!deployedApps.includes(template.id) && (
                      <span className="text-[8px] font-black text-slate-400 uppercase italic">Deploy to unlock</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {template.buttons.map(btn => {
                        const isThisGenerating = isGenerating === `${template.id}-${btn}`;
                        return (
                          <button 
                            key={btn} 
                            onClick={() => handleActionButton(template, btn)}
                            disabled={!deployedApps.includes(template.id) || isGenerating !== null}
                            className={cn(
                              "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2",
                              deployedApps.includes(template.id) 
                                ? "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5" 
                                : "bg-slate-100/50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 border-dashed border-slate-200 dark:border-slate-800 cursor-not-allowed"
                            )}
                          >
                             {isThisGenerating ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} className={cn(deployedApps.includes(template.id) ? "text-orange-500" : "text-slate-400")} />}
                             {btn}
                          </button>
                        );
                     })}
                  </div>
               </div>

               <AnimatePresence>
                 {activeResult && activeResult.id === template.id && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="mb-8 overflow-hidden"
                   >
                     <div className="p-6 bg-slate-900 rounded-3xl border border-blue-500/30 relative">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{activeResult.button} Output</span>
                           </div>
                           <button onClick={() => setActiveResult(null)} className="text-slate-500 hover:text-white transition-colors">
                              <X size={14} />
                           </button>
                        </div>
                        <div className="prose prose-invert prose-xs max-w-none text-slate-300 text-[11px] leading-relaxed markdown-report">
                           <ReactMarkdown>{activeResult.content}</ReactMarkdown>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="flex items-center gap-4">
                  {deployedApps.includes(template.id) ? (
                     <div className="flex-1 flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Instance Live</span>
                        </div>
                        <button className="text-emerald-600 hover:scale-110 transition-transform">
                           <RefreshCw size={16} />
                        </button>
                     </div>
                  ) : (
                     <button 
                        onClick={() => handleDeploy(template.id)}
                        disabled={deploying !== null}
                        className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {deploying === template.id ? (
                           <>
                              <RefreshCw size={18} className="animate-spin" />
                              Instantiating...
                           </>
                        ) : (
                           <>
                              Deploy Application <Rocket size={18} />
                           </>
                        )}
                     </button>
                  )}
                  <button className="p-5 bg-slate-100 dark:bg-slate-900 rounded-[28px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-24 p-12 bg-slate-900 dark:bg-slate-950 rounded-[48px] border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={120} className="text-white" />
         </div>
         <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
               <ShieldCheck size={32} className="text-[#FF6B00]" />
               <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">Enterprise Deployment Protocol</h3>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
               Applications created in Build Mode are isolated in secure sandboxes with role-based access control. Every template is pre-vetted for marketing compliance.
            </p>
            <div className="flex flex-wrap gap-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white"><Layout size={20} /></div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Environment</p>
                     <p className="text-sm font-bold text-white uppercase italic">ais_production_v2</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white"><Code size={20} /></div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Language</p>
                     <p className="text-sm font-bold text-white uppercase italic">Neural_Python_3.11</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white"><Zap size={20} /></div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wait Time</p>
                     <p className="text-sm font-bold text-white uppercase italic">&lt; 3.2s Average</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
