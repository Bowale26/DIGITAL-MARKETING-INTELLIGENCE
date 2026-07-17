import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  ShoppingBag, 
  Gift, 
  Mail, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Loader2, 
  Layout,
  Search,
  ChevronRight,
  ArrowRight,
  Heart,
  Star,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIService } from '../services/aiService';

interface MonetizationWorkflow {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  actions: string[];
}

const workflows: MonetizationWorkflow[] = [
  {
    id: 'REC',
    name: 'Product Recommender',
    description: 'Build smart widgets that analyze user intent and serve high-converting affiliate products.',
    icon: ShoppingBag,
    color: 'text-emerald-500',
    actions: ['Generate Recommendation Widget', 'Update Product Catalog']
  },
  {
    id: 'CONTENT',
    name: 'Review Factory',
    description: 'Auto-generate SEO-optimized review articles with embedded monetization links.',
    icon: FileText,
    color: 'text-blue-500',
    actions: ['Generate Review Article', 'Optimize for SEO']
  },
  {
    id: 'EMAIL',
    name: 'Revenue Drips',
    description: 'Personalized email sequences triggered by purchase behavior or signups.',
    icon: Mail,
    color: 'text-orange-500',
    actions: ['Create Welcome Sequence', 'Build Abandoned Cart Flow']
  }
];

export default function MonetizationStudio() {
  const [activeTab, setActiveTab] = useState(workflows[0].id);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExecute = async (action: string) => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setResults(null);

    const ai = AIService.getInstance();
    try {
      if (activeTab === 'REC') {
        const data = await ai.generateProductRecommendations(query);
        setResults({ type: 'REC', data });
      } else if (activeTab === 'CONTENT') {
        const data = await ai.generateSEOReview(query);
        setResults({ type: 'CONTENT', data });
      } else {
        const data = await ai.generateContent(
          `Generate an email drip sequence for: ${query}. Include 3 emails with CTA.`,
          "You are a direct response email copywriter specializing in affiliate marketing.",
          {
            type: "object",
            properties: {
              sequence_name: { type: "string" },
              emails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    subject: { type: "string" },
                    body: { type: "string" },
                    cta: { type: "string" }
                  }
                }
              }
            }
          }
        );
        setResults({ type: 'EMAIL', data: data.data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-emerald-500/10 rounded-full">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Revenue Engine Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <DollarSign size={10} className="text-emerald-500" />
            <span>Affiliate Model V4.2 Locked</span>
          </div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
          Monetization <span className="text-slate-300 dark:text-slate-800">Studio</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
          Automate the pipeline from content to commission. Deploy high-converting widgets and sequences in seconds.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-12">
        {workflows.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setActiveTab(w.id);
              setResults(null);
            }}
            className={cn(
              "px-8 py-5 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-4",
              activeTab === w.id 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                : "bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <w.icon size={18} className={cn(activeTab === w.id ? "text-emerald-400" : w.color)} />
            {w.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Editor Config */}
        <div className="lg:col-span-12">
           <div className="p-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-[20px] flex items-center justify-center">
                    <Zap size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter">Workflow Trigger</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                       {workflows.find(w => w.id === activeTab)?.description}
                    </p>
                 </div>
              </div>

              <div className="relative mb-8">
                <input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    activeTab === 'REC' ? "e.g. Products for professional landscape photographers..." :
                    activeTab === 'CONTENT' ? "e.g. Sony A7R IV Expert Review..." :
                    "e.g. Welcome sequence for a high-end coffee subscription service..."
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium pr-72"
                />
                <div className="absolute right-4 top-4 bottom-4 flex gap-2">
                   {workflows.find(w => w.id === activeTab)?.actions.map(action => (
                      <button
                        key={action}
                        onClick={() => handleExecute(action)}
                        disabled={isGenerating || !query.trim()}
                        className="h-full px-6 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                      >
                         {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                         {action.split(' ').slice(0, 2).join(' ')}
                      </button>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-12">
           <AnimatePresence mode="wait">
              {isGenerating ? (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="p-24 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800"
                 >
                    <Loader2 size={48} className="animate-spin text-emerald-500 mb-6" />
                    <h4 className="text-2xl font-bold uppercase tracking-tighter mb-2">Calculating Commission Loops...</h4>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Linguistic Optimization Active</p>
                 </motion.div>
              ) : results ? (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-8"
                 >
                    {results.type === 'REC' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {results.data.recommendations.map((prod: any, idx: number) => (
                             <div key={idx} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm group hover:border-emerald-500/30 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                      <ShoppingBag size={20} className="text-emerald-500" />
                                   </div>
                                   <div className="flex items-center gap-1 text-orange-500">
                                      <Star size={12} fill="currentColor" />
                                      <span className="text-[10px] font-black">HIGH-CONV</span>
                                   </div>
                                </div>
                                <h4 className="text-lg font-bold uppercase tracking-tight mb-2">{prod.product_name}</h4>
                                <p className="text-xl font-mono font-bold text-emerald-500 mb-6">{prod.price}</p>
                                <div className="space-y-2 mb-8">
                                   {prod.features.slice(0, 3).map((f: string) => (
                                      <div key={f} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                         <CheckCircle2 size={12} className="text-emerald-500" /> {f}
                                      </div>
                                   ))}
                                </div>
                                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-8">
                                   <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">Conversion Angle</p>
                                   <p className="text-[10px] text-slate-500 leading-tight italic">"{prod.conversion_angle}"</p>
                                </div>
                                <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                   Embed Link <ExternalLink size={14} />
                                </button>
                             </div>
                          ))}
                       </div>
                    )}

                    {results.type === 'CONTENT' && (
                       <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] p-12 shadow-2xl">
                          <div className="flex items-center justify-between mb-12">
                             <div className="flex gap-4">
                                <div className="px-4 py-2 bg-blue-500/10 rounded-xl flex items-center gap-2 text-blue-500">
                                   <TrendingUp size={16} />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">SEO Optimized Score: 98/100</span>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-blue-500 transition-colors"><Edit3 size={18} /></button>
                                <button className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-blue-500 transition-colors"><RefreshCw size={18} /></button>
                             </div>
                          </div>

                          <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-8 leading-tight">{results.data.article_title}</h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                             <div className="lg:col-span-8 space-y-12">
                                {results.data.key_sections.map((section: any, i: number) => (
                                   <div key={i}>
                                      <h3 className="text-xl font-bold uppercase tracking-tight mb-4 text-slate-400"># {section.heading}</h3>
                                      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{section.content}</p>
                                   </div>
                                ))}
                             </div>
                             <div className="lg:col-span-4 space-y-8">
                                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800">
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Linguistic Meta</h4>
                                   <div className="space-y-4">
                                      <div>
                                         <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-2">Meta Description</p>
                                         <p className="text-[10px] text-slate-500 leading-tight">{results.data.meta_description}</p>
                                      </div>
                                      <div>
                                         <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-3">SEO Keywords</p>
                                         <div className="flex flex-wrap gap-2">
                                            {results.data.seo_keywords.map((k: string) => (
                                               <span key={k} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[8px] font-black text-slate-500">{k}</span>
                                            ))}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                                <div className="p-8 bg-emerald-500 text-white rounded-[40px] shadow-xl shadow-emerald-500/20">
                                   <Target size={24} className="mb-4" />
                                   <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Target CTA</h4>
                                   <p className="text-xs font-medium opacity-90 mb-6 leading-relaxed">{results.data.call_to_action}</p>
                                   <button className="w-full py-4 bg-white text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                      Copy for Publish
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {results.type === 'EMAIL' && (
                       <div className="space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Generated Sequence: {results.data.sequence_name}</h3>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             {results.data.emails.map((e: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm h-full flex flex-col">
                                   <div className="flex justify-between items-center mb-6">
                                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">EMAIL 0{i+1}</span>
                                      </div>
                                      <div className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                         <BarChart3 size={10} /> 32% OPEN-TARGET
                                      </div>
                                   </div>
                                   <h4 className="text-sm font-black uppercase tracking-tight mb-6 line-clamp-2">"Subject: {e.subject}"</h4>
                                   <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl mb-8">
                                      <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-[12] whitespace-pre-wrap">{e.body}</p>
                                   </div>
                                   <div className="space-y-4">
                                      <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                                         <p className="text-[8px] font-black text-orange-500 uppercase mb-1">Embedded CTA</p>
                                         <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400">{e.cta}</p>
                                      </div>
                                      <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                         Export Sequence
                                      </button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </motion.div>
              ) : (
                 <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
                       <DollarSign size={48} className="text-slate-300" />
                    </div>
                    <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-slate-300 dark:text-slate-800">Ready for Commissioning</h2>
                    <p className="text-slate-400 max-w-sm">
                       Enter your target keyword or product list above to begin the high-performance revenue loop.
                    </p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
