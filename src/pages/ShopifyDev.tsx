import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Code2, 
  Zap, 
  Layout, 
  Smartphone, 
  CreditCard,
  Plus,
  ExternalLink,
  ChevronRight,
  Target,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Activity,
  Wand2,
  Heart,
  ShoppingCart,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  shopifySetupWizard, 
  shopifyThemes, 
  shopifyAppStack, 
  conversionOptimization 
} from '../data/creativeToolsData';

export default function ShopifyDev() {
  const [activeTab, setActiveTab] = useState<'stack' | 'wizard' | 'conversion' | 'blueprints'>('stack');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold tracking-tight uppercase">Shopify Forge</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Headless commerce architecture and Liquid theme engineering.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
           {(['stack', 'wizard', 'conversion', 'blueprints'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "bg-[#00AEEF] text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === 'stack' ? (
                <motion.div key="stack" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase tracking-tighter mb-8 text-slate-900 dark:text-white">Active Ecosystem</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <StackItem name="NIKE RT-1 BUILD" stack="Hydrogen / Remix / Sanity" status="Production" />
                         <StackItem name="Blue Bottle Coffee" stack="Shopify Plus / Custom Theme" status="Staging" />
                         <StackItem name="Tesla Rentals" stack="Next.js / Shopify Buy SDK" status="Optimizing" />
                         <StackItem name="Everlane Winter" stack="Liquid / Tailwind" status="Live" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card-agency p-6 hover:border-[#00AEEF]/20 transition-all">
                         <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                            <Code2 size={24} />
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white">API Integrations</h4>
                         <p className="text-xs text-slate-500 mt-2 leading-relaxed">Developing custom Shopify Functions and App Bridge extensions for enterprise loyalty flows.</p>
                      </div>
                      <div className="card-agency p-6 hover:border-emerald-500/20 transition-all">
                         <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                            <Zap size={24} />
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Performance Ops</h4>
                         <p className="text-xs text-slate-500 mt-2 leading-relaxed">Scaling edge delivery and image optimization via Cloudflare/Croudinary for sub-1s LCP.</p>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'wizard' ? (
                <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="card-agency p-8 space-y-8">
                      <div className="flex items-center gap-4 text-orange-500 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <Wand2 size={32} />
                        <div>
                          <h3 className="text-2xl font-bold uppercase tracking-tight">Setup Navigator</h3>
                          <p className="text-sm text-slate-500 font-medium">Step-by-step merchant configuration logic.</p>
                        </div>
                      </div>
                      <div className="space-y-10">
                        {shopifySetupWizard.map((step, i) => (
                           <div key={i} className="flex gap-6 relative">
                              {i < shopifySetupWizard.length - 1 && (
                                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-900 -mb-10" />
                              )}
                              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center font-bold text-slate-300 shrink-0 border border-slate-100 dark:border-slate-800 relative z-10">
                                {step.step}
                              </div>
                              <div className="pt-1">
                                 <h4 className="font-bold uppercase tracking-widest text-[#FF6B00] text-xs pb-1">{step.title}</h4>
                                 <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{step.description}</p>
                                 <div className="flex gap-2 mt-3">
                                   {step.tags.map(tag => (
                                     <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[8px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                                   ))}
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card-agency p-8">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Theme Recommendations</h4>
                         <div className="space-y-4">
                            {shopifyThemes.map(theme => (
                              <div key={theme.name} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent hover:border-orange-500/20 transition-all">
                                 <h5 className="font-bold text-sm">{theme.name}</h5>
                                 <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter mt-1">{theme.vibe}</p>
                                 <p className="text-[9px] text-slate-400 mt-1">{theme.bestFor}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="card-agency p-8">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Approved App Stack</h4>
                         <div className="space-y-6">
                            {shopifyAppStack.map(group => (
                              <div key={group.category}>
                                 <h5 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full" /> {group.category}
                                 </h5>
                                 <div className="flex flex-wrap gap-1">
                                    {group.apps.map(app => (
                                      <span key={app} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-[9px] font-bold text-slate-500">{app}</span>
                                    ))}
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'conversion' ? (
                <motion.div key="conversion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="card-agency p-8">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                            <ShoppingCart size={20} />
                         </div>
                         <h3 className="text-xl font-bold uppercase">Checkout Audit</h3>
                      </div>
                      <div className="space-y-4">
                        {conversionOptimization.checkoutAudit.map((item, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item}</span>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sans">
                      <div className="card-agency p-8">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Product Copy Formulas</h4>
                        <div className="space-y-4">
                           {conversionOptimization.productCopyFormulas.map(f => (
                              <div key={f.name} className="p-4 bg-slate-900 text-white rounded-2xl border border-white/10">
                                 <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">{f.name}</p>
                                 <p className="font-mono text-[11px] text-white/70">{f.formula}</p>
                              </div>
                           ))}
                        </div>
                      </div>
                      <div className="card-agency p-8">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                           <ShieldCheck size={14} className="text-[#00AEEF]" /> Trust Badge Placement
                        </h4>
                        <div className="space-y-4">
                           {conversionOptimization.trustBadgeGuide.map((guide, i) => (
                              <div key={i} className="flex items-start gap-3">
                                 <div className="w-1 h-1 bg-[#00AEEF] rounded-full mt-2" />
                                 <p className="text-[11px] font-medium leading-relaxed">{guide}</p>
                              </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="card-agency p-8 bg-[#020617] text-white border-transparent">
                      <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-8">Abandoned Cart Recovery (3-Email)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {conversionOptimization.abandonedCartFlow.map(email => (
                            <div key={email.email} className="p-5 bg-white/5 rounded-2xl border border-white/10 relative group hover:border-[#FF6B00]/30 transition-all">
                               <div className="absolute -top-3 left-4 bg-[#FF6B00] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Email {email.email}</div>
                               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 mt-2">Delay: {email.delay}</p>
                               <p className="text-[11px] font-bold text-white leading-relaxed">{email.focus}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              ) : (
                <motion.div key="blueprints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     "Hybrid Multi-Store Connector",
                     "Neural Checkout Extensibility",
                     "Headless Sanity x Hydrogen Starter",
                     "B2B Wholesale Channel Logic"
                   ].map((title, i) => (
                     <div key={i} className="card-agency p-8 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950 transition-all">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#00AEEF] transition-all">
                              <Layers size={18} />
                           </div>
                           <ExternalLink size={14} className="text-slate-200 group-hover:text-slate-400 transition-all" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Blueprint v1.2 • Verified</p>
                     </div>
                   ))}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="card-agency p-8 bg-[#020617] text-white border-transparent">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" /> Active Pulse
              </h3>
              <div className="space-y-6">
                 <StoreStatus name="Nike Global" health={98} sales="$12k/day" />
                 <StoreStatus name="Blue Bottle" health={84} sales="$4.2k/day" />
                 <StoreStatus name="Tesla Rentals" health={92} sales="$38k/day" />
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                 Open Merchant Cloud
              </button>
           </div>

           <div className="bg-slate-100 dark:bg-slate-950 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Target size={14} /> Production Queue
              </h4>
              <div className="space-y-3">
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">3 deployments pending for Nike Winter 2026 drop.</p>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Scale Active</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StackItem({ name, stack, status }: any) {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-[#00AEEF]/20 transition-all">
       <div className="flex justify-between items-start mb-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 uppercase tracking-widest">{status}</span>
       </div>
       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{stack}</p>
    </div>
  );
}

function AuditRow({ label, score, status, warning }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
       <div className="flex items-center gap-4">
          <div className={cn(
             "w-2 h-2 rounded-full",
             warning ? "bg-orange-500" : "bg-emerald-500"
          )} />
          <span className="text-xs font-bold text-slate-900 dark:text-white">{label}</span>
       </div>
       <div className="flex items-center gap-4">
          <span className={cn(
             "text-[9px] font-bold uppercase",
             warning ? "text-orange-500" : "text-emerald-500"
          )}>{status}</span>
          <span className="text-sm font-bold font-display">{score}</span>
       </div>
    </div>
  );
}

function StoreStatus({ name, health, sales }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>{name}</span>
          <span>{health}% Health</span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00AEEF] rounded-full" style={{ width: `${health}%` }} />
       </div>
       <p className="text-[9px] text-emerald-500 font-bold">{sales}</p>
    </div>
  );
}
