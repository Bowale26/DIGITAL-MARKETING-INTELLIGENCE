import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  BarChart3, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Globe,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Target,
  Layers,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { seoChecklist } from '../data/creativeToolsData';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';

export default function SEOHub() {
  const [activeTab, setActiveTab] = useState<'audit' | 'keywords' | 'checklists'>('audit');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAction = async (action: string, label: string) => {
    setIsSyncing(true);
    await LoyaltyAgentService.getInstance().processAction(action);
    setIsSyncing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold tracking-tight uppercase">SEO Command Center</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Domain authority engines and technical organic dominance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="BTN-ANALYZE-004"
            disabled={isSyncing}
            onClick={() => handleAction('Initialize SEO Audit: Technical Health Scan', 'Scanning')}
            className="group relative px-6 py-3 bg-[#00AEEF] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white transform translate-y-full group-active:translate-y-0 transition-transform duration-75 opacity-20" />
            <Zap size={16} className={cn("inline mr-2", isSyncing && "animate-pulse")} /> 
            {isSyncing ? 'Scanning...' : 'Initialize Audit'}
          </button>
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
             {(['audit', 'keywords', 'checklists'] as const).map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-[#00AEEF] text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                )}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           {activeTab === 'audit' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="card-agency p-8 flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter">Technical Health Score</h3>
                      <p className="text-sm text-slate-500 mt-1">Lighthouse v10 Core Web Vitals Audit</p>
                   </div>
                   <div className="w-24 h-24 border-8 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500">
                      <span className="text-2xl font-bold font-display">94</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AuditCard label="Indexability" status="Optimal" score="100%" />
                   <AuditCard label="On-Page Logic" status="Needs Pivot" score="72%" isWarning />
                   <AuditCard label="Security SSL" status="Hardened" score="A+" />
                   <AuditCard label="Mobile Flow" status="Excellent" score="98%" />
                </div>
             </motion.div>
           )}

           {activeTab === 'checklists' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-agency p-8 space-y-6">
                <h3 className="text-xl font-bold mb-4">Phase 1: Foundation Triage</h3>
                <div className="space-y-4">
                   {seoChecklist.map((check, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 group cursor-pointer hover:border-[#00AEEF]/50 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-6 h-6 border-2 border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-emerald-500 group-hover:border-[#00AEEF] transition-all">
                              {i % 3 === 0 && <CheckCircle2 size={14} />}
                           </div>
                           <div>
                              <p className="text-sm font-bold">{check.item}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{check.category}</p>
                           </div>
                        </div>
                        {check.required && <span className="text-[8px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">Required</span>}
                     </div>
                   ))}
                </div>
             </motion.div>
           )}

           {activeTab === 'keywords' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="card-agency p-8">
                   <h3 className="text-xl font-bold mb-8">Topical Authority Map</h3>
                   <div className="space-y-4">
                      <KeywordItem term="Headless Shopify Hydrogen" volume="12k" kd="Hard" status="Trending" />
                      <KeywordItem term="Custom Remix E-commerce" volume="2.4k" kd="Med" status="Low Hanging" />
                      <KeywordItem term="Enterprise Lead Gen AI" volume="5.6k" kd="High" status="Winning" />
                   </div>
                </div>
             </motion.div>
           )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="card-agency p-8 bg-slate-900 text-white border-transparent">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" /> Link Building Engine
              </h3>
              <div className="space-y-6">
                 <div className="pb-6 border-b border-white/10">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Outreaches</p>
                    <p className="text-3xl font-bold mt-2 font-display">142</p>
                 </div>
                 <div className="space-y-3">
                    <p className="text-xs text-white/80 leading-relaxed italic">
                      "Leveraging neural search to identify high-DR domains for guest placement and resource links."
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-[32px] p-8">
              <h4 className="text-xs font-bold text-[#00AEEF] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <BarChart3 size={14} /> Organic ROI Calculator
              </h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                SEO value is calculated as: (Organic Traffic * Avg. Market CPC). Current moat value: $4,200/mo.
              </p>
              <button 
                onClick={() => handleAction('Generate SEO Audit Report: CSV/PDF Export', 'Exporting')}
                className="w-full mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#00AEEF] hover:bg-slate-50 dark:hover:bg-slate-950 transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpRight size={14} /> Export Audit Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AuditCard({ label, status, score, isWarning }: any) {
  return (
    <div className="card-agency p-6 hover:border-[#00AEEF]/20 transition-all">
       <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <span className={cn(
             "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
             isWarning ? "bg-orange-500/10 text-orange-600" : "bg-emerald-500/10 text-emerald-600"
          )}>{status}</span>
       </div>
       <h4 className="text-2xl font-bold uppercase tracking-tighter">{score}</h4>
    </div>
  );
}

function KeywordItem({ term, volume, kd, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
       <div>
          <p className="text-sm font-bold uppercase tracking-tight">{term}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase">{volume} Monthly Volume • KD: {kd}</p>
       </div>
       <span className="text-[9px] font-bold text-[#00AEEF] uppercase tracking-widest border border-[#00AEEF]/20 px-3 py-1 rounded-full">{status}</span>
    </div>
  );
}
