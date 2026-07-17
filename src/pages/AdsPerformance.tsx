import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  MousePointer2, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ChevronRight,
  Sparkles,
  PieChart,
  Activity,
  CheckCircle2,
  Copy,
  ShoppingBag,
  Calculator,
  FileText,
  Link,
  BrainCircuit,
  Terminal,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  adHeadlineFormulas, 
  shopifyAdsData, 
  googleAdsCampaignBuilder, 
  adCopyLibrary, 
  ppcPerformanceTracking 
} from '../data/creativeToolsData';
import { AdsAgentService, AdsHandoff, AdsAgentRole } from '../services/adsAgentService';

const campaignData = [
  { name: 'Mon', spend: 2400, conv: 400 },
  { name: 'Tue', spend: 1398, conv: 300 },
  { name: 'Wed', spend: 9800, conv: 2000 },
  { name: 'Thu', spend: 3908, conv: 2780 },
  { name: 'Fri', spend: 4800, conv: 1890 },
  { name: 'Sat', spend: 3800, conv: 2390 },
  { name: 'Sun', spend: 4300, conv: 3490 },
];

export default function AdsPerformance() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'builder' | 'copy' | 'tracking' | 'merchant'>('portfolio');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [handoffs, setHandoffs] = useState<AdsHandoff[]>([]);
  
  // Simple ROAS Calculator State
  const [spend, setSpend] = useState(1000);
  const [revenue, setRevenue] = useState(5000);
  const roas = (revenue / spend).toFixed(2);

  const [lastRecommendation, setLastRecommendation] = useState<string>("Our neural engine is analyzing cross-channel signals. Trigger an audit for the latest ROI brief.");

  const triggerOrchestration = async (signal: string, context: any = {}) => {
    setIsOrchestrating(true);
    try {
      const logs = await AdsAgentService.getInstance().processRequest(signal, context);
      setHandoffs(logs);
      
      const growthPayload = logs.find(l => l.source === AdsAgentRole.GROWTH)?.payload;
      if (growthPayload) {
        setLastRecommendation(growthPayload.recommendation);
      }
    } catch (e) {
      console.error("Ads Orchestration error:", e);
    } finally {
      setIsOrchestrating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold tracking-tight uppercase">Ads Command</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Neural ad management and cross-channel ROI engineering.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1 text-right mr-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Sync</span>
             <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", isOrchestrating ? "bg-blue-500 animate-pulse" : "bg-emerald-500")} />
                <span className="text-[9px] font-mono font-bold">{isOrchestrating ? 'A2A_ORCHESTRATING' : 'READY'}</span>
             </div>
          </div>
          <button 
            id="BTN-FETCH-001"
            onClick={() => triggerOrchestration('Audit pixel health across all channels and generate tracking brief')}
            className="group relative px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-orange-500 transform translate-y-full group-active:translate-y-0 transition-transform duration-75 opacity-20" />
            <RefreshCw size={14} className={cn(isOrchestrating && "animate-spin")} /> Global Audit
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className="px-6 py-3 bg-[#00AEEF] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <Plus size={16} className="inline mr-2" /> Create Campaign
          </button>
        </div>
      </div>

      {/* Neural Integration Dashboard */}
      <AnimatePresence>
        {(isOrchestrating || handoffs.length > 0) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6"
          >
            {handoffs.length > 0 && !isOrchestrating && (
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold uppercase flex items-center gap-2">
                       <BrainCircuit size={20} className="text-blue-400" /> Neural ROI Synthesis
                    </h3>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-400/10 rounded-full">OutputAgent Sync</span>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 font-sans text-sm leading-relaxed overflow-y-auto max-h-[400px]">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{handoffs.find(h => h.source === AdsAgentRole.OUTPUT)?.payload.message}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card-agency p-6 bg-black border-slate-800 text-white overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-sans">Ads Agent Mesh Persistence</span>
                </div>
                {isOrchestrating && <Activity size={12} className="text-blue-500 animate-pulse" />}
              </div>
              <div className="space-y-1 font-mono text-[9px]">
                {handoffs.map((h, i) => (
                  <div key={i} className="flex items-start gap-4 py-1 border-b border-white/5">
                    <span className="text-slate-600">[{h.timestamp.split('T')[1].split('.')[0]}]</span>
                    <div className="flex items-center gap-2 w-48 shrink-0">
                      <span className="text-blue-400 px-1 bg-blue-400/5 rounded">{h.source}</span>
                      <ArrowRightLeft size={10} className="text-slate-700" />
                      <span className="text-slate-400 px-1 bg-white/5 rounded">{h.target}</span>
                    </div>
                    <span className="text-slate-500 italic truncate flex-grow">Payload: {JSON.stringify(h.payload).substring(0, 120)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar self-start">
           {(['portfolio', 'builder', 'copy', 'tracking', 'merchant'] as const).map(tab => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIItem title="Total Spend" value="$24.2k" change="+8.4%" icon={DollarSign} color="text-blue-500" />
        <KPIItem title="Impressions" value="1.2M" change="+12%" icon={Activity} color="text-[#FF6B00]" />
        <KPIItem title="Avg. ROAS" value="4.8x" change="+15%" icon={TrendingUp} color="text-emerald-500" />
        <KPIItem title="Conversions" value="3,420" change="+14%" icon={Target} color="text-[#00AEEF]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === 'portfolio' ? (
                <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="card-agency p-8">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-bold uppercase tracking-tighter">Live Portfolio</h3>
                         <div className="flex items-center gap-4">
                            <button 
                              onClick={() => triggerOrchestration('Rebalance budgets across Google, Meta, and TikTok based on ROAS performance')}
                              className="px-4 py-2 bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#00AEEF] hover:text-white transition-all flex items-center gap-2"
                            >
                              <ArrowRightLeft size={12} /> Rebalance Budgets
                            </button>
                            <div className="relative">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                               <input type="text" placeholder="Search..." className="bg-slate-50 dark:bg-slate-900 border-none rounded-xl pl-9 pr-4 py-2 text-xs outline-none" />
                            </div>
                         </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800">
                                 <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign</th>
                                 <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                 <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Spend</th>
                                 <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">ROAS</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              <CampaignRow name="Nike RT-1 Build" status="Scaling" spend="$12,400" roas="5.2x" onSync={() => triggerOrchestration('Audit Nike RT-1 Build campaign for ROI optimization')} />
                              <CampaignRow name="Blue Bottle Subscriptions" status="Optimizing" spend="$4,200" roas="2.8x" onSync={() => triggerOrchestration('Performance scan for Blue Bottle campaign')} />
                              <CampaignRow name="Tesla Rentals PPC" status="Neural Bidding" spend="$38,500" roas="5.1x" onSync={() => triggerOrchestration('Deep analysis of Tesla Rentals PPC performance')} />
                              <CampaignRow name="Wildflower Retargeting" status="At Risk" spend="$850" roas="1.2x" isWarning onSync={() => triggerOrchestration('Emergency audit for Wildflower Retargeting (At Risk)')} />
                           </tbody>
                        </table>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'builder' ? (
                <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8">Campaign Architect</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {googleAdsCampaignBuilder.structureTemplates.map((template, i) => (
                           <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{template.name}</h4>
                              <p className="text-xs text-slate-500 mb-4">{template.description}</p>
                              <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest">Use: {template.useCase}</span>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="card-agency p-8">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Keyword Match Types</h4>
                         <div className="space-y-4">
                            {googleAdsCampaignBuilder.matchTypeGuide.map((match, i) => (
                               <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                  <div>
                                     <p className="text-xs font-bold">{match.type}</p>
                                     <p className="text-[10px] text-slate-400 font-mono">{match.syntax}</p>
                                  </div>
                                  <span className="text-[10px] font-medium text-slate-500">{match.usage}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="card-agency p-8">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Master Negatives</h4>
                         <div className="flex flex-wrap gap-2">
                            {googleAdsCampaignBuilder.negativeKeywords.map(word => (
                               <span key={word} className="px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">{word}</span>
                            ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'copy' ? (
                <motion.div key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8">Responsive Copy Library</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {adCopyLibrary.rsaTemplates.map((ad, i) => (
                            <div key={i} className="p-6 bg-slate-900 text-white rounded-2xl relative group">
                               <button className="absolute top-4 right-4 text-white/20 group-hover:text-white transition-colors"><Copy size={14} /></button>
                               <span className="text-[9px] font-bold text-[#FF6B00] uppercase tracking-widest mb-2 block">{ad.type} Headline</span>
                               <p className="text-sm font-bold leading-tight uppercase tracking-tight italic">"{ad.headline}"</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">YouTube Ad Scripts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {adCopyLibrary.youtubeScripts.map((script, i) => (
                            <div key={i} className="space-y-6">
                               <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                  <h5 className="text-lg font-bold">Duration: {script.duration}</h5>
                                  <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center"><Activity size={14} /></div>
                               </div>
                               <div className="space-y-4">
                                  <div>
                                     <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest mb-1">Hook</p>
                                     <p className="text-sm font-medium text-slate-500 italic">"{script.hook}"</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest mb-1">Body</p>
                                     <p className="text-sm font-medium text-slate-500 leading-relaxed text-sans">{script.body}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest mb-1">CTA</p>
                                     <p className="text-sm font-bold uppercase underline tracking-tighter">{script.cta}</p>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'tracking' ? (
                <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="card-agency p-8">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-bold uppercase">Benchmark Command</h3>
                         <button 
                           onClick={() => triggerOrchestration('Audit PPC tracking efficiency and pixel health across Google and Meta')}
                           className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest px-3 py-1.5 border border-[#00AEEF]/20 rounded-xl hover:bg-[#00AEEF] hover:text-white transition-all flex items-center gap-2"
                         >
                            <Activity size={12} /> Audit Tracking Health
                         </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTR Target Tables</h4>
                            <div className="space-y-4">
                               {ppcPerformanceTracking.ctrBenchmarks.map((bench, i) => (
                                  <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                     <span className="text-sm font-bold text-slate-900 dark:text-white">{bench.channel}</span>
                                     <span className="text-lg font-display font-bold text-emerald-500">{bench.benchmark}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Score checklist</h4>
                            <div className="space-y-3">
                               {ppcPerformanceTracking.qualityScoreChecklist.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                     <CheckCircle2 size={16} className="text-emerald-500" />
                                     <span className="text-xs font-medium text-slate-500">{item}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="card-agency p-8 bg-[#020617] text-white">
                      <div className="flex items-center justify-between mb-8">
                         <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Optimization Workflow</h4>
                         <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">Automated Reminders Active</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Weekly Sprints</p>
                            <div className="space-y-2">
                               {ppcPerformanceTracking.optimizationChecklist.weekly.map((task, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {task}
                                  </div>
                               ))}
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Monthly Pivots</p>
                            <div className="space-y-2">
                               {ppcPerformanceTracking.optimizationChecklist.monthly.map((task, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                                     <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {task}
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'merchant' ? (
                <motion.div key="merchant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="card-agency p-8">
                         <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                            <ShoppingBag className="text-orange-500" /> Shopify Feed Logic
                         </h3>
                         <div className="space-y-4">
                            {shopifyAdsData.feedSetup.map((item, i) => (
                               <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                  <div className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{item}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="card-agency p-8">
                         <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3 text-sans">
                            <Calculator className="text-[#00AEEF]" /> ROAS Target Logic
                         </h3>
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ad Spend</label>
                               <input 
                                 type="number" 
                                 value={spend} 
                                 onChange={(e) => setSpend(Number(e.target.value))}
                                 className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm outline-none"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projected Revenue</label>
                               <input 
                                 type="number" 
                                 value={revenue} 
                                 onChange={(e) => setRevenue(Number(e.target.value))}
                                 className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm outline-none"
                               />
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Calculated Goal</p>
                               <div className="text-4xl font-display font-bold text-[#00AEEF]">{roas}x ROAS</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold uppercase flex items-center gap-3">
                           <FileText className="text-emerald-500" /> Creative Brief Template
                        </h3>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => triggerOrchestration('Generate full creative brief using Hook/Body/CTA framework for Meta Ads channel')}
                            className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-3 py-1.5 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                          >
                             <BrainCircuit size={12} /> Generate Brief
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Copy size={16} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {Object.entries(shopifyAdsData.creativeBriefTemplate).map(([key, val]) => (
                            <div key={key} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                               <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">{key}</p>
                               <p className="text-xs font-medium text-slate-500 leading-relaxed">{val}</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#020617] rounded-[32px] p-8 text-white relative overflow-hidden">
                      <div className="absolute top-4 right-8 z-10">
                         <button 
                           onClick={() => triggerOrchestration('Run deep pixel and catalog health check. Verify CAPI status and EMQ scores.')}
                           className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-4 py-2 border border-blue-400/20 rounded-xl hover:bg-blue-400 hover:text-white transition-all flex items-center gap-2"
                         >
                            <Activity size={14} /> Audit Pixel Status
                         </button>
                      </div>
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                         <Link size={14} className="text-[#00AEEF]" /> Pixel & Catalog Integration
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                         {shopifyAdsData.pixelGuide.map((item, i) => (
                           <div key={i} className="space-y-2">
                              <CheckCircle2 size={18} className="text-emerald-500" />
                              <p className="text-[11px] font-medium text-white/70 leading-relaxed">{item}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              ) : (
                <motion.div key="forecast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-agency p-8">
                   <h3 className="text-xl font-bold mb-8">Neural Budget Forecasting</h3>
                   <div className="w-full" style={{ width: '100%', height: 350, minHeight: 250 }}>
                      <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
                         <BarChart data={campaignData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="spend" fill="#00AEEF" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="conv" fill="#FF6B00" radius={[6, 6, 0, 0]} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="card-agency p-8 bg-[#020617] text-white border-transparent">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <PieChart size={20} className="text-[#00AEEF]" /> Channel Split
              </h3>
              <div className="space-y-6">
                 <ChannelItem label="Google Search" value={65} color="bg-blue-500" />
                 <ChannelItem label="Meta Ads" value={25} color="bg-[#FF6B00]" />
                 <ChannelItem label="TikTok Spark" value={10} color="bg-slate-700" />
              </div>
           </div>

           <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-[32px] p-8">
              <div className="flex items-center gap-3 text-emerald-600 mb-4">
                 <CheckCircle2 size={20} />
                 <h4 className="text-sm font-bold uppercase tracking-widest">Growth Recommendation</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                "{lastRecommendation}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function KPIItem({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="card-agency p-6 hover:border-slate-200 transition-all group">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.replace('text-', 'bg-') + '/10', color)}>
             <Icon size={20} />
          </div>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{change}</span>
       </div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
       <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 uppercase tracking-tighter">{value}</h4>
    </div>
  );
}

function CampaignRow({ name, status, spend, roas, isWarning, onSync }: any) {
  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-950 transition-all cursor-pointer">
       <td className="py-5 font-bold text-sm text-slate-900 dark:text-white">{name}</td>
       <td className="py-5">
          <span className={cn(
             "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
             isWarning ? "bg-orange-500/10 text-orange-600" : "bg-emerald-500/10 text-emerald-600"
          )}>{status}</span>
       </td>
       <td className="py-5 text-right font-bold text-sm text-slate-500">{spend}</td>
       <td className="py-5 text-right">
          <div className="flex items-center justify-end gap-3">
             <span className="text-xs font-bold text-[#00AEEF] px-2 py-1 border border-[#00AEEF]/20 rounded-lg">{roas}</span>
             <button 
                onClick={(e) => { e.stopPropagation(); onSync(); }}
                className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
             >
                <RefreshCw size={12} />
             </button>
          </div>
       </td>
    </tr>
  );
}

function ChannelItem({ label, value, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>{label}</span>
          <span>{value}%</span>
       </div>
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}
