import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Calendar, 
  Target, 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  AlertTriangle,
  Camera,
  PlayCircle,
  Hash,
  Users,
  Layout,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Globe,
  Scissors
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { socialMediaStrategy, toneDefinitions } from '../data/creativeToolsData';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';
import { socialAiService, SocialPostVariation } from '../services/socialAiService';

const analyticsData = [
  { day: 'Mon', engagement: 4500, reach: 12000 },
  { day: 'Tue', engagement: 5200, reach: 15400 },
  { day: 'Wed', engagement: 4800, reach: 14200 },
  { day: 'Thu', engagement: 6100, reach: 18900 },
  { day: 'Fri', engagement: 5900, reach: 17500 },
  { day: 'Sat', engagement: 7200, reach: 22100 },
  { day: 'Sun', engagement: 6800, reach: 21000 },
];

const influencerData = [
  { name: '@TechNova', platform: 'Instagram', followers: '1.2M', status: 'Active', roi: '4.2x' },
  { name: '@SaaS_Master', platform: 'LinkedIn', followers: '450K', status: 'Negotiating', roi: 'N/A' },
  { name: '@GrowthHacker', platform: 'Twitter', followers: '890K', status: 'Active', roi: '3.8x' },
];

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState<'scheduler' | 'voice' | 'crisis' | 'post-lab' | 'analytics' | 'campaigns'>('scheduler');
  const [isSyncing, setIsSyncing] = useState(false);
  const [postPrompt, setPostPrompt] = useState('');
  const [postTone, setPostTone] = useState('Bold & Technical');
  const [postLength, setPostLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiVariations, setAiVariations] = useState<SocialPostVariation[]>([]);

  const handleAction = async (action: string) => {
    setIsSyncing(true);
    await LoyaltyAgentService.getInstance().processAction(action);
    setIsSyncing(false);
  };

  const handleGeneratePosts = async () => {
    if (!postPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const results = await socialAiService.generatePostVariations(
        postPrompt, 
        "Flux Luxury Technical Optimization",
        {
          tone: postTone,
          length: postLength,
          keywords: keywords
        }
      );
      setAiVariations(results);
    } catch (error) {
      console.error("Post generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (tag: string) => {
    setKeywords(keywords.filter(k => k !== tag));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold tracking-tight uppercase">Social Empire</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Algorithmic dominance and omnichannel brand resonance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="BTN-POST-003"
            disabled={isSyncing}
            onClick={() => handleAction('Schedule Social Deployment: Brand Resonance Mapping')}
            className="btn-primary relative group overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white transform translate-y-full group-active:translate-y-0 transition-transform duration-75 opacity-20" />
            <Plus size={18} className={cn(isSyncing && "animate-spin")} /> 
            {isSyncing ? 'Deploying...' : 'Schedule Deployment'}
          </button>
        </div>
      </div>

      {/* Primary Navigation Rail */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl scrollbar-hide">
         {(['scheduler', 'post-lab', 'campaigns', 'analytics', 'voice', 'crisis'] as const).map(tab => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
              activeTab === tab ? "bg-[#FF6B00] text-white shadow-xl shadow-orange-500/20" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            )}
           >
             {tab.replace('-', ' ')}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {activeTab === 'scheduler' ? (
                <motion.div key="scheduler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-bold uppercase tracking-tight">Deployment Calendar</h3>
                      <div className="flex gap-2">
                         <button className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-400"><Calendar size={18} /></button>
                         <button className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-400"><Layout size={18} /></button>
                      </div>
                   </div>

                   <div className="grid grid-cols-7 gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                        <div key={d} className="text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                      ))}
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className={cn(
                          "aspect-square bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl p-2 relative group cursor-pointer hover:border-orange-500/50 transition-all",
                          i === 12 || i === 15 ? "border-orange-500/30" : ""
                        )}>
                           <span className="text-[8px] font-bold text-slate-300 group-hover:text-orange-500">{i + 1}</span>
                           {(i === 12 || i === 15) && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                        </div>
                      ))}
                   </div>

                   <div className="card-agency p-8 space-y-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming High-Impact Drops</h4>
                      <div className="space-y-4">
                         <ScheduleItem platform="Instagram" type="Reel" time="Today, 11:15 AM" title="The Future of E-comm" status="Ready" />
                         <ScheduleItem platform="LinkedIn" type="Article" time="Tomorrow, 09:00 AM" title="Neural Scaling 101" status="Drafting" />
                         <ScheduleItem platform="TikTok" type="Video" time="Monday, 07:30 PM" title="Shopify Secrets Exposed" status="Review" />
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'post-lab' ? (
                <motion.div key="post-lab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="card-agency p-8 space-y-8">
                      <div className="flex items-center gap-4 text-orange-500">
                         <Sparkles size={24} />
                         <h3 className="text-xl font-bold uppercase tracking-tight">AI Content Deployment Engine</h3>
                      </div>
                      
                      <div className="space-y-6">
                         {/* Core Prompt */}
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Campaign Topic & Goal</label>
                           <textarea 
                             placeholder="Describe the campaign topic or value proposition..."
                             value={postPrompt}
                             onChange={(e) => setPostPrompt(e.target.value)}
                             className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] transition-all"
                           />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Tone Control */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Tactical Tone</label>
                              <div className="flex flex-wrap gap-2">
                                {['Bold & Technical', 'Professional', 'Minimalist', 'High-Performance', 'Luxury/Elite'].map(t => (
                                  <button 
                                    key={t}
                                    onClick={() => setPostTone(t)}
                                    className={cn(
                                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                      postTone === t ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                                    )}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Length Control */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Constraint: Length</label>
                              <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl">
                                {(['short', 'medium', 'long'] as const).map(l => (
                                  <button 
                                    key={l}
                                    onClick={() => setPostLength(l)}
                                    className={cn(
                                      "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                      postLength === l ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-500"
                                    )}
                                  >
                                    {l}
                                  </button>
                                ))}
                              </div>
                            </div>
                         </div>

                         {/* Keyword Injector */}
                         <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Neural Keyword Injection</label>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               placeholder="Add mandatory keyword..."
                               value={keywordInput}
                               onChange={(e) => setKeywordInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                               className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl px-6 py-3 text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                             />
                             <button 
                               onClick={addKeyword}
                               className="px-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest"
                             >
                               Inject
                             </button>
                           </div>
                           <div className="flex flex-wrap gap-2 min-h-[24px]">
                             {keywords.map(k => (
                               <span key={k} className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                 {k}
                                 <button onClick={() => removeKeyword(k)} className="hover:text-red-500 transition-colors">×</button>
                               </span>
                             ))}
                           </div>
                         </div>

                         <button 
                           onClick={handleGeneratePosts}
                           disabled={isGenerating || !postPrompt.trim()}
                           className="w-full py-5 bg-orange-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110"
                         >
                            {isGenerating ? (
                              <>
                                <Zap className="animate-spin" size={18} /> 
                                Synthesizing Content...
                              </>
                            ) : (
                              <>
                                <Sparkles size={18} />
                                Calibrate & Generate Deployment Plan
                              </>
                            )}
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {aiVariations.map((v, i) => (
                        <div key={i} className="card-agency p-6 space-y-4 group">
                           <div className="flex justify-between items-center">
                              <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest">{v.platform}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">{v.optimalTime}</span>
                           </div>
                           <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-300">{v.content}</p>
                           <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
                              <h5 className="text-[8px] font-black uppercase text-orange-500 tracking-widest">Mandatory CTA</h5>
                              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{v.cta}</p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {v.hashtags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold text-blue-500">{tag}</span>
                              ))}
                           </div>
                           <button className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                              Deploy to {v.platform}
                           </button>
                        </div>
                      ))}
                   </div>
                </motion.div>
              ) : activeTab === 'campaigns' ? (
                <motion.div key="campaigns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="card-agency p-6 bg-slate-900 text-white">
                         <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-2">Total Partnerships</p>
                         <h4 className="text-3xl font-black italic">142</h4>
                         <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                            <TrendingUp size={12} /> +12% this month
                         </div>
                      </div>
                      <div className="card-agency p-6">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Reach</p>
                         <h4 className="text-3xl font-black italic">4.2M</h4>
                         <p className="text-[10px] text-slate-500 mt-4 font-bold">Optimized for Conversion</p>
                      </div>
                      <div className="card-agency p-6">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Avg. Engagement</p>
                         <h4 className="text-3xl font-black italic">6.8%</h4>
                         <p className="text-[10px] text-slate-500 mt-4 font-bold">High Resonance Index</p>
                      </div>
                   </div>

                   <div className="card-agency overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Influencer</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">ROI</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            {influencerData.map((inf, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <p className="text-sm font-black">{inf.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{inf.followers} Followers</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{inf.platform}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={cn(
                                      "text-[8px] font-black px-2 py-1 rounded-md uppercase",
                                      inf.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-600"
                                    )}>{inf.status}</span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <p className="text-sm font-black italic">{inf.roi}</p>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              ) : activeTab === 'analytics' ? (
                <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="card-agency p-8 space-y-8">
                      <div className="flex justify-between items-center">
                         <div>
                            <h3 className="text-xl font-bold uppercase">Engagement Analytics</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Omnichannel Resonance Tracking</p>
                         </div>
                         <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-orange-500" />
                               <span className="text-[10px] font-black uppercase text-slate-400">Interaction</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                               <span className="text-[10px] font-black uppercase text-slate-400">Reach</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="w-full" style={{ width: '100%', height: 350, minHeight: 250 }}>
                         <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
                            <AreaChart data={analyticsData}>
                               <defs>
                                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2}/>
                                     <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                               <XAxis 
                                 dataKey="day" 
                                 axisLine={false} 
                                 tickLine={false} 
                                 tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                               />
                               <YAxis hide />
                               <Tooltip 
                                 contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                 itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                               />
                               <Area 
                                 type="monotone" 
                                 dataKey="engagement" 
                                 stroke="#FF6B00" 
                                 strokeWidth={3}
                                 fillOpacity={1} 
                                 fill="url(#colorEngagement)" 
                               />
                               <Area 
                                 type="monotone" 
                                 dataKey="reach" 
                                 stroke="#94a3b8" 
                                 strokeWidth={2}
                                 strokeDasharray="5 5"
                                 fill="transparent" 
                               />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sans text-xs">
                    <div className="card-agency p-8 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Performance Distribution</h4>
                        <div className="space-y-4">
                           {[
                             { p: 'Instagram', v: 85, color: '#FF6B00' },
                             { p: 'TikTok', v: 72, color: '#000000' },
                             { p: 'LinkedIn', v: 94, color: '#00AEEF' },
                             { p: 'Twitter/X', v: 45, color: '#ef4444' }
                           ].map(item => (
                             <div key={item.p} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                   <span>{item.p}</span>
                                   <span>{item.v}% Resonance</span>
                                </div>
                                <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${item.v}%` }}
                                     className="h-full rounded-full"
                                     style={{ backgroundColor: item.color }}
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                    </div>
                    <div className="card-agency p-8 flex flex-col justify-center items-center space-y-4 text-center">
                        <BarChart3 size={48} className="text-orange-500" />
                        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Predictive Growth Engine</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Based on current neural trends, your omnichannel presence is set to scale 45% in the next quarter.</p>
                        <button className="px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest">Generate Full Report</button>
                    </div>
                   </div>
                </motion.div>
              ) : activeTab === 'voice' ? (
                <motion.div key="voice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                   {toneDefinitions.map((tone, i) => (
                     <div key={i} className="card-agency p-8 hover:border-[#00AEEF]/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="text-lg font-bold uppercase tracking-tighter text-slate-900 dark:text-white">{tone.style}</h4>
                           <CheckCircle2 size={16} className="text-slate-100 dark:text-slate-800 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest mb-4">{tone.keywords}</p>
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl italic text-xs text-slate-500 leading-relaxed">
                           "{tone.example}"
                        </div>
                     </div>
                   ))}
                </motion.div>
              ) : (
                <motion.div key="crisis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card-agency p-10 space-y-8">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4 text-orange-500">
                         <AlertTriangle size={32} />
                         <div>
                           <h3 className="text-2xl font-bold uppercase tracking-tight">Crisis Protocols</h3>
                           <p className="text-sm text-slate-500 font-medium">Standard Operating Procedures for Brand Protection.</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Sentiment: Stable</span>
                      </div>
                   </div>
                   <div className="space-y-6">
                      {socialMediaStrategy.crisisProtocol.map((step, i) => (
                         <div key={i} className="flex items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-900 last:border-0 last:pb-0">
                            <span className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center font-bold text-slate-300 shrink-0">{i + 1}</span>
                            <div>
                               <h4 className="font-bold uppercase tracking-widest text-[#FF6B00] text-xs">{step.stage}</h4>
                               <p className="text-sm text-slate-500 mt-1 font-medium">{step.action}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="card-agency p-8 bg-slate-900 text-white border-transparent">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Target size={20} className="text-orange-500" /> Optimal Windows
              </h3>
              <div className="space-y-6">
                 {socialMediaStrategy.postingTimes.map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                         <p className="text-xs font-bold">{item.platform}</p>
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">EST</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                         {item.bestTime}
                      </div>
                      <p className="text-[9px] text-white/50">{item.reason}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-100 dark:bg-slate-950 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                 <Hash size={14} /> Neural Hashtag Engine
              </h4>
              <div className="flex flex-wrap gap-2">
                 {['#ShopifyScaling', '#NeuralD2C', '#PPCKings', '#SEOAuthority', '#AlgorithmHacks', '#D2CDomination'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-400 cursor-pointer hover:border-[#00AEEF] hover:text-[#00AEEF] transition-all">
                      {tag}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ platform, type, time, title, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-orange-500/10">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-all">
            {platform === 'Instagram' ? <Camera size={18} /> : platform === 'LinkedIn' ? <Users size={18} /> : <PlayCircle size={18} />}
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[150px]">{title}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{platform} {type} • {time}</p>
          </div>
       </div>
       <span className={cn(
         "text-[8px] font-bold px-2 py-0.5 rounded-full uppercase",
         status === 'Ready' ? "bg-emerald-500/10 text-emerald-500" : status === 'Drafting' ? "bg-slate-200 text-slate-400" : "bg-orange-500/10 text-orange-600"
       )}>{status}</span>
    </div>
  );
}
