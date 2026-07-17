import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Code, 
  ShieldCheck, 
  Settings, 
  Box, 
  Layers, 
  Smartphone, 
  Cpu, 
  Search, 
  CheckCircle2, 
  RefreshCcw, 
  Shield, 
  Clock, 
  FileText 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { webDesignDevData } from '../data/creativeToolsData';

export default function WebDev() {
  const [activeTab, setActiveTab] = useState<'design' | 'development' | 'maintenance'>('design');

  const { designSystem, developmentSpecs, maintenancePlans } = webDesignDevData;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
        <div className="px-2">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] flex items-center justify-center">
                 <Palette size={24} />
              </div>
              <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em]">Engineering Hub</span>
           </div>
           <h1 className="text-4xl font-display font-bold tracking-tight uppercase">Web & Product Dev</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Architecture, aesthetics, and long-term ecosystem stability.</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
           {(['design', 'development', 'maintenance'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               {tab}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
           {activeTab === 'design' ? (
             <motion.div key="design" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <Box className="text-[#00AEEF]" /> Wireframe Components
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                         {designSystem.wireframeComponents.map((comp, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" /> {comp}
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <Palette className="text-pink-500" /> Color Psychology
                      </h3>
                      <div className="space-y-4">
                         {designSystem.colorPsychology.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                               <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.color}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{item.mood}</p>
                               </div>
                               <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest bg-pink-500/10 px-2 py-0.5 rounded-full">{item.useCase}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3 text-sans">
                         <Layers className="text-violet-500" /> Typography Pairings
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                         {designSystem.typographyPairing.map((item, i) => (
                            <div key={i} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-violet-500/30 transition-all">
                               <div className="flex justify-between items-start mb-4">
                                  <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">{item.vibe}</span>
                               </div>
                               <h4 className="text-2xl font-bold mb-1" style={{ fontFamily: item.heading }}>{item.heading}</h4>
                               <p className="text-sm text-slate-500" style={{ fontFamily: item.body }}>{item.body} — Designing for the next generation of D2C brands.</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#020617] rounded-[32px] p-8 text-white">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <ShieldCheck className="text-[#00AEEF]" /> Accessibility (WCAG 2.1)
                      </h3>
                      <div className="space-y-6">
                         {designSystem.accessibilityChecklist.map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                               <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={18} />
                               <p className="text-xs font-medium text-white/70 leading-relaxed">{item}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>
           ) : activeTab === 'development' ? (
             <motion.div key="development" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {developmentSpecs.techStacks.map((stack, i) => (
                      <div key={i} className="card-agency p-8 hover:border-[#00AEEF]/30 transition-all group">
                         <h4 className="text-lg font-bold mb-2">{stack.name}</h4>
                         <p className="text-xs font-bold text-[#00AEEF] uppercase tracking-widest mb-6">{stack.stack}</p>
                         <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Benchmark</span>
                            <span className="text-sm font-bold text-emerald-500">{stack.score}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <Cpu className="text-orange-500" /> Speed Optimization
                      </h3>
                      <div className="space-y-4">
                         {developmentSpecs.speedOptimization.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                               <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                               <span className="text-xs font-bold text-slate-500">{item}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <Shield className="text-emerald-500" /> Security Hardening
                      </h3>
                      <div className="space-y-4">
                         {developmentSpecs.securityHardening.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                               <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item}</span>
                               <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-[#0033FF] rounded-[32px] p-10 text-white overflow-hidden relative">
                   <div className="relative z-10">
                      <h3 className="text-2xl font-bold uppercase mb-8 italic tracking-tight">Launch Sequence Checklist</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                         {developmentSpecs.launchChecklist.map((item, i) => (
                            <div key={i} className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-center border border-white/10">
                               {item}
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                </div>
             </motion.div>
           ) : (
             <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <RefreshCcw className="text-[#00AEEF]" /> Update & Backup Protocol
                      </h3>
                      <div className="space-y-6">
                         <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={12} /> Schedule</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{maintenancePlans.updateSchedule}</p>
                         </div>
                         <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Settings size={12} /> Backup Protocol</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{maintenancePlans.backupProtocol}</p>
                         </div>
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <FileText className="text-emerald-500" /> Monitoring & Reports
                      </h3>
                      <div className="space-y-6">
                         <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Shield size={12} /> Security Scan</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{maintenancePlans.securityScan}</p>
                         </div>
                         <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Smartphone size={12} /> Uptime Tracking</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{maintenancePlans.uptimeMonitoring}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="card-agency p-12 text-center bg-slate-100 dark:bg-slate-900 border-none">
                   <h3 className="text-2xl font-bold uppercase mb-4">Request Custom Maintenance Quote</h3>
                   <p className="text-slate-500 mb-8 max-w-xl mx-auto">Scalable infrastructure management for enterprise grade performance and zero-downtime deployments.</p>
                   <button className="px-10 py-4 bg-[#00AEEF] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-500/25 hover:scale-105 transition-all">Contact Operations</button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
    </div>
  );
}
