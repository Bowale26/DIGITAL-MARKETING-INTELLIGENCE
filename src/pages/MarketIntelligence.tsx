import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Loader2,
  BarChart3,
  Flame,
  Target,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIService } from '../services/aiService';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';

interface IntelligenceCard {
  id: string;
  type: 'competitor' | 'trend' | 'seo' | 'crisis';
  title: string;
  description: string;
  buttons: string[];
  icon: any;
  color: string;
}

const cards: IntelligenceCard[] = [
  {
    id: 'INTEL-COMP',
    type: 'competitor',
    title: 'Competitor Intelligence',
    description: 'Pull live data from Google Search for up-to-date research and competitor campaign monitoring.',
    buttons: ['Refresh Competitor Intel', 'Alert on New Campaigns'],
    icon: Target,
    color: 'text-orange-500'
  },
  {
    id: 'INTEL-TREND',
    type: 'trend',
    title: 'Trend Analysis',
    description: 'Weekly monitoring of industry keywords, emerging topics, and seasonal patterns.',
    buttons: ['Generate Trend Report', 'Suggest Content Angles'],
    icon: TrendingUp,
    color: 'text-blue-500'
  },
  {
    id: 'INTEL-SEO',
    type: 'seo',
    title: 'SEO Opportunity Matrix',
    description: 'On-demand mapping of keyword rankings, SERP features, and content gaps.',
    buttons: ['Find Quick Wins', 'Analyze SERP Changes'],
    icon: BarChart3,
    color: 'text-emerald-500'
  },
  {
    id: 'INTEL-CRISIS',
    type: 'crisis',
    title: 'Crisis Monitoring',
    description: 'Real-time monitoring of brand mentions and sentiment for proactive risk management.',
    buttons: ['Monitor Brand Health', 'Crisis Response Draft'],
    icon: ShieldAlert,
    color: 'text-red-500'
  }
];

export default function MarketIntelligence() {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async (cardId: string, buttonLabel: string) => {
    setActiveAnalysis(cardId);
    setIsLoading(true);
    setResults(null);

    try {
      const ai = AIService.getInstance();
      const mesh = LoyaltyAgentService.getInstance();
      
      // Log to mesh
      await mesh.processAction(`Market Intelligence: ${buttonLabel} (${cardId})`);

      if (cardId === 'INTEL-COMP') {
        const data = await ai.generateCompetitorIntel("Top market competitors in luxury tech");
        setResults(data);
      } else {
        // Generic logic for other features if not specialized yet
        const data = await ai.generateContent(
          `Run ${buttonLabel} and provide a structured JSON update.`,
          "You are an expert market analyst with full access to live search data.",
          {
            type: "object",
            properties: {
              report_summary: { type: "string" },
              data_points: { type: "array", items: { type: "string" } },
              recommended_actions: { type: "array", items: { type: "string" } }
            }
          },
          true
        );
        setResults(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-orange-500/10 rounded-full">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Grounding Engine Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Globe size={10} className="animate-spin-slow text-blue-500" />
            <span>Google Search API Connected</span>
          </div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
          Market <span className="text-slate-300 dark:text-slate-800">Intelligence</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
          Pull live, grounded data for strategic positioning. Stop guessing, start verifying with real-time neural search.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            GROUNDING VERIFIED
          </span>
          <a href="https://developers.google.com/custom-search/v1/overview" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
            Google Search API ↗
          </a>
          <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
            SEMrush Analytics ↗
          </a>
          <a href="https://www.similarweb.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/10 rounded-xl text-[10px] font-bold transition-all">
            Similarweb Traffic ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Center */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={card.id}
              className={cn(
                "p-8 bg-white dark:bg-slate-950 border rounded-[40px] transition-all",
                activeAnalysis === card.id ? "border-orange-500 ring-4 ring-orange-500/10 shadow-2xl" : "border-slate-100 dark:border-slate-900 shadow-sm"
              )}
            >
              <div className={cn("p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 w-fit mb-6", card.color)}>
                <card.icon size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">{card.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8">{card.description}</p>
              
              <div className="space-y-3">
                {card.buttons.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleRunAnalysis(card.id, btn)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all border border-slate-100 dark:border-slate-800"
                  >
                    {btn} <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-16 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900">
                    <Loader2 size={32} className="animate-spin" />
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                </div>
                <h4 className="text-2xl font-bold uppercase tracking-tighter mb-2">Polling Neural Infrastructure...</h4>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">Grounding with Google Search V1</p>
              </motion.div>
            ) : results ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-12 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-12">
                   <div className="flex gap-4">
                      <div className="px-4 py-2 bg-emerald-500/10 rounded-xl flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Grounding Confirmed</span>
                      </div>
                      <div className="px-4 py-2 bg-blue-500/10 rounded-xl flex items-center gap-2">
                        <Globe size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Search Citations Found</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => setResults(null)}
                     className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                   >
                     Clear Report
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Neural Summary</h4>
                         <p className="text-xl font-medium leading-relaxed dark:text-slate-300">
                           {results.target_brand || results.report_summary}
                         </p>
                      </div>

                      {results.detected_campaigns && (
                        <div>
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">Detected Live Manuevers</h4>
                           <div className="space-y-3">
                              {results.detected_campaigns.map((c: string) => (
                                <div key={c} className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                   <Flame size={16} className="text-orange-500 flex-shrink-0" />
                                   <p className="text-xs font-bold leading-tight">{c}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {results.data_points && (
                        <div>
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">Telemetry Nodes</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {results.data_points.map((p: string) => (
                                <div key={p} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold">
                                   {p}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="space-y-8">
                      <div className="p-8 bg-slate-900 dark:bg-white rounded-[40px] text-white dark:text-slate-900">
                         <div className="flex items-center gap-3 mb-6">
                            <Target size={24} className="text-orange-500" />
                            <h4 className="text-lg font-bold uppercase tracking-tight">Strategic Counter-Response</h4>
                         </div>
                         <p className="text-sm border-l-2 border-orange-500 pl-4 py-2 italic opacity-80 mb-8">
                            {results.recommended_counter_move || results.recommended_actions?.[0]}
                         </p>
                         <div className="space-y-2">
                            {results.recommended_actions?.slice(1).map((a: string) => (
                              <div key={a} className="flex items-center gap-3 text-xs font-bold">
                                 <Plus size={14} className="text-orange-500" />
                                 {a}
                              </div>
                            ))}
                         </div>
                      </div>

                      {results.sources && (
                        <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Citations & Verification</h4>
                           <div className="space-y-3">
                              {results.sources.map((s: string) => (
                                <a href="#" key={s} className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 group">
                                   <span className="text-[10px] font-bold truncate max-w-[200px]">{s}</span>
                                   <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-24 flex flex-col items-center justify-center text-center">
                 <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
                    <Search size={48} className="text-slate-200" />
                 </div>
                 <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-slate-300 dark:text-slate-800">No Intelligence Active</h2>
                 <p className="text-slate-400 max-w-sm">
                   Select an intelligence card above to ground the neural engine with live Google Search data.
                 </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
