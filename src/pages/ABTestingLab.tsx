import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Split, 
  Sparkles, 
  BarChart3, 
  Zap, 
  RotateCw, 
  Plus, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Loader2,
  Settings,
  BrainCircuit,
  Target,
  FlaskConical,
  Globe,
  AlertTriangle,
  History,
  Terminal,
  Info,
  ShieldAlert
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
import { AIService } from '../services/aiService';
import { LoyaltyAgentService, AgentRole, AgentHandoff } from '../services/loyaltyAgentService';

interface Variant {
  id: string;
  label: string;
  content: string;
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    conversion_rate: number;
    spend: string;
    cpa: string;
  };
  allocation: number;
  isAiGenerated: boolean;
  type: 'CONTROL' | 'AI_GENERATED';
  synthesisParameters?: {
    tone_vector: string[];
    brand_alignment_score: number;
  };
}

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'completed';
  platform: string;
  objective: string;
  currentPhase: 'ideation' | 'synthesis' | 'validation' | 'deployment' | 'monitoring' | 'optimization' | 'conclusion';
  variants: Variant[];
  participants: {
    total: number;
    minRequired: number;
    split: string;
    estimatedCompletion?: string;
    audience_segment?: string;
  };
  significance?: {
    pBestControl: number;
    pBestVariant: number;
    expectedLift: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    predictionToSignificance: string;
    credibleInterval: string;
  };
  startDate: string;
}

const mockTests: ABTest[] = [
  {
    id: 'EXP-META-001',
    name: 'Q2 Titan Launch Headlines',
    status: 'active',
    platform: 'Meta Ads (Facebook + Instagram)',
    objective: 'Headline CTR Optimization',
    currentPhase: 'monitoring',
    participants: {
      total: 8472,
      minRequired: 10000,
      split: '50/50',
      estimatedCompletion: '18 hours remaining',
      audience_segment: 'High-intent luxury goods consumers, age 28-45, HHI $150K+'
    },
    significance: {
      pBestControl: 0.12,
      pBestVariant: 0.78,
      expectedLift: '+20.5% CTR, +38.6% CVR',
      confidence: 'HIGH',
      predictionToSignificance: '48 hours',
      credibleInterval: '[+12.3%, +28.7%]'
    },
    variants: [
      { 
        id: 'VAR-A-001', 
        label: 'Variant A', 
        type: 'CONTROL',
        content: 'Luxury Watches Reimagined.', 
        performance: { impressions: 4236, clicks: 212, ctr: 5.01, conversions: 19, conversion_rate: 8.96, spend: '$1,271.00', cpa: '$66.89' }, 
        allocation: 50, 
        isAiGenerated: false 
      },
      { 
        id: 'VAR-B-001', 
        label: 'Variant B', 
        type: 'AI_GENERATED',
        content: 'Precision Engineering Meets Timeless Ethics.', 
        performance: { impressions: 4236, clicks: 287, ctr: 6.78, conversions: 31, conversion_rate: 10.80, spend: '$1,271.00', cpa: '$41.00' }, 
        allocation: 50, 
        isAiGenerated: true,
        synthesisParameters: {
          tone_vector: ["luxury", "technical", "ethical", "aspirational"],
          brand_alignment_score: 0.94
        }
      }
    ],
    startDate: '2026-04-20'
  }
];

// Mock data for the Bayesian probability distribution
const bayesianData = [
  { x: 3, control: 0.05, variant: 0.01 },
  { x: 4, control: 0.20, variant: 0.05 },
  { x: 5, control: 0.50, variant: 0.15 },
  { x: 6, control: 0.20, variant: 0.45 },
  { x: 7, control: 0.04, variant: 0.30 },
  { x: 8, control: 0.01, variant: 0.04 },
];

export default function ABTestingLab() {
  const [tests, setTests] = useState<ABTest[]>(mockTests);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(mockTests[0]);
  const [activeGroundingSkill, setActiveGroundingSkill] = useState<string | null>(null);
  const [handoffLogs, setHandoffLogs] = useState<AgentHandoff[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  
  // New: Live Task Monitoring state reflecting the Orchestrator task
  const [liveTasks, setLiveTasks] = useState([
    {
      id: "task-idle-01a2-4f20",
      skill: null,
      status: "submitted",
      progress: 0,
      message: "No Intelligence Active. Select an intelligence card above to ground the neural engine with live Google Search data. Available modules: Market Intelligence, Competitor Intelligence, Trend Analysis, SEO Opportunity Matrix, Crisis Monitoring."
    },
    {
      id: "task-market-8821-4f1b",
      skill: "market_intelligence",
      status: "working",
      progress: 68,
      message: "Grounding Engine Active. Google Search API Connected. Live market intelligence feed initialized."
    },
    {
      id: "task-comp-92a1-4f1c",
      skill: "competitor_intelligence",
      status: "working",
      progress: 45,
      message: "Competitor Intelligence Module ACTIVE. Live Google Search data feed established for up-to-date research and competitor campaign monitoring."
    },
    {
      id: "task-trend-7292-4f1d",
      skill: "trend_analysis",
      status: "working",
      progress: 32,
      message: "Trend Analysis Module ACTIVE. Weekly monitoring of industry keywords, emerging topics, and seasonal patterns is now running."
    },
    {
      id: "task-seo-55b2-4f1e",
      skill: "seo_opportunity_matrix",
      status: "working",
      progress: 15,
      message: "SEO Opportunity Matrix ACTIVE. On-demand mapping of keyword rankings, SERP features, and content gaps is live."
    },
    {
      id: "task-crisis-33c1-4f1f",
      skill: "crisis_monitoring",
      status: "working",
      progress: 5,
      message: "Crisis Monitoring Module ACTIVE. Real-time monitoring of brand mentions and sentiment is now operational for proactive risk management."
    }
  ]);

  const generateAIVariants = async (testId: string) => {
    setIsGenerating(true);
    try {
      const ai = AIService.getInstance();
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      const baseContent = test.variants[0].content;
      const groundingContext = activeGroundingSkill ? `Activating A2A Capability: ${activeGroundingSkill}. Use live market intelligence for grounding.` : "";
      
      const prompt = `Act as a senior conversion optimization specialist using Bayesian Model V4. ${groundingContext}
      Analyze this ad copy: "${baseContent}". 
      Generate 3 distinct A/B test variations designed to increase click-through rate for a ${test.platform} campaign.
      
      Synthesis Parameters:
      - Tone: Luxury/Technical/Ethical
      - Context: ${test.objective}
      
      Return as a structured JSON object with variants containing "content", "trigger", and "alignment".`;

      const response = await ai.generateContent(
        prompt, 
        "You are an expert in A/B testing and Bayesian inference using architecture V4.2.1.",
        {
          type: "object",
          properties: {
            variants: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  trigger: { type: "string" },
                  alignment: { type: "number" }
                }
              }
            }
          }
        }
      );

      // Trigger A2A Handoff via Orchestrator
      const logs = await LoyaltyAgentService.getInstance().processAction(`Synthesize Variant: Bayesian-V4 for ${testId}`, {
        test_id: testId,
        grounding_skill: activeGroundingSkill,
        model_v: "4.2.1"
      });
      setHandoffLogs(prev => [...logs, ...prev]);

      if (response.data && response.data.variants) {
        setTests(prev => prev.map(t => {
          if (t.id === testId) {
            const newVariants = response.data.variants.map((v: any, i: number) => ({
              id: `ai-${Date.now()}-${i}`,
              label: `AI: ${v.trigger}`,
              type: 'AI_GENERATED',
              content: v.content,
              allocation: 0,
              isAiGenerated: true,
              synthesisParameters: {
                tone_vector: [v.trigger || "optimized"],
                brand_alignment_score: v.alignment || 0.9
              }
            }));
            return { ...t, variants: [...t.variants, ...newVariants] };
          }
          return t;
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleGroundingSkill = async (skill: string) => {
    const isActivating = skill !== activeGroundingSkill;
    setActiveGroundingSkill(isActivating ? skill : null);
    
    if (isActivating) {
      const logs = await LoyaltyAgentService.getInstance().processAction(`Grounding Sync: ${skill.replace(/_/g, ' ')}`, {
        skill_id: skill,
        engine: 'Orchestrator 1.0',
        priority: 'HIGH'
      });
      setHandoffLogs(prev => [...logs, ...prev]);
    }
  };

  const runAudit = async () => {
    setIsAuditing(true);
    const logs = await LoyaltyAgentService.getInstance().processAction('AB Testing Audit: Verify Bayesian Integrity', {
      pipeline: 'A/B Training Pipeline',
      threshold: '0.95'
    });
    setHandoffLogs(prev => [...logs, ...prev]);
    setTimeout(() => setIsAuditing(false), 1500);
  };

  const performanceData = useMemo(() => {
    if (!selectedTest || !selectedTest.variants[1]?.performance) return [];
    return [
      { name: 'Control', ctr: selectedTest.variants[0].performance?.ctr || 0 },
      { name: 'Variant B', ctr: selectedTest.variants[1].performance?.ctr || 0 },
    ];
  }, [selectedTest]);

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white px-4">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 bg-purple-500/10 rounded-full">
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">A2A Protocol: Bayesian-V4 Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
              <Globe size={10} className="text-blue-500" />
              <span>Grounding Engine: Orchestrator 1.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
              <Target size={10} className="text-emerald-500" />
              <span>Significance: Dynamic SVI</span>
            </div>
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight uppercase leading-[0.85] mb-8">
          A/B Training <span className="text-slate-300 dark:text-slate-800">Pipeline</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
          Precision neural synthesis meets Bayesian inference. Deploy variations grounded in live market intelligence.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            GROUNDING VERIFIED
          </span>
          <a href="https://www.optimizely.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
            Optimizely Premium ↗
          </a>
          <a href="https://vwo.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
            VWO Testing Suite ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Grounding Intelligence Panel */}
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8 overflow-x-auto gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Grounding Intelligence</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A2A Market Signal Orchestration</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {['market_intelligence', 'competitor_intelligence', 'trend_analysis', 'seo_opportunity_matrix', 'crisis_monitoring'].map(skill => (
                  <button 
                    key={skill}
                    onClick={() => toggleGroundingSkill(skill)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      activeGroundingSkill === skill ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-slate-950 border text-slate-400 font-bold"
                    )}
                  >
                    {skill.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {activeGroundingSkill ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {liveTasks.filter(t => t.skill === activeGroundingSkill).map(task => (
                    <div key={task.id} className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 relative">
                          <Sparkles size={24} />
                          {task.status === 'working' && (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 bg-blue-500/20 rounded-2xl"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-black text-blue-500 uppercase">Neural Insight via GroundingEngine_Orchestrator</p>
                            <span className="text-[9px] font-mono text-slate-400">{task.id}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic mb-4">
                            "{task.message}"
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase">{task.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!liveTasks.some(t => t.skill === activeGroundingSkill) && (
                    <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                          <Target size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Passive Monitoring Active</p>
                          <p className="text-sm text-slate-400 leading-relaxed italic">
                            No active intelligence tasks for this module. Listening for market signals...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="p-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                      <Terminal size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Grounding Engine Idle</p>
                      <p className="text-sm text-slate-500 leading-relaxed italic">
                        {liveTasks.find(t => t.id.startsWith('task-idle'))?.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Deep Inference View</h2>
            {tests.map((test) => (
              <motion.div
                layoutId={test.id}
                key={test.id}
                className={cn(
                  "p-10 bg-white dark:bg-slate-950 border rounded-[48px] border-purple-500 shadow-2xl ring-2 ring-purple-500/5"
                )}
              >
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white bg-emerald-500">
                        {test.status}
                      </span>
                      <span className="text-xs font-black text-slate-300 tracking-tighter">{test.id}</span>
                    </div>
                    <h3 className="text-5xl font-bold uppercase tracking-tighter leading-none">{test.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-2">{test.platform}</p>
                  </div>

                  <div className="flex gap-10 md:text-right w-full md:w-auto">
                    <div className="space-y-4 flex-1 md:flex-none">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Sample</p>
                        <div className="flex items-end gap-2 md:justify-end">
                          <p className="text-4xl font-bold">{test.participants.total.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold mb-1 pb-1">/ {test.participants.minRequired.toLocaleString()}</p>
                        </div>
                      </div>
                      {test.participants.estimatedCompletion && (
                        <div className="flex items-center md:justify-end gap-1.5 text-[10px] font-black text-purple-500 uppercase">
                          <Clock size={12} /> {test.participants.estimatedCompletion}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {test.significance && (
                  <div className="space-y-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">P(Best Variant B)</p>
                        <p className="text-3xl font-bold text-[#FF6B00]">{(test.significance.pBestVariant * 100).toFixed(1)}%</p>
                        <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${test.significance.pBestVariant * 100}%` }}
                            className="h-full bg-[#FF6B00]" 
                          />
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Expected Lift</p>
                        <p className="text-2xl font-bold text-emerald-500">{test.significance.expectedLift.split(',')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Relative Delta</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">HDI Interval</p>
                        <p className="text-sm font-mono font-bold leading-tight mt-1">{test.significance.credibleInterval}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">95% Accuracy</p>
                      </div>
                      <div className="p-6 bg-purple-500/5 rounded-[32px] border border-purple-500/10">
                        <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-2">Inference</p>
                        <p className="text-2xl font-bold text-purple-500">{test.significance.confidence}</p>
                        <p className="text-[10px] font-bold text-purple-400 mt-2">High Confidence</p>
                      </div>
                    </div>

                    {/* Density Plot */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-900/30 rounded-[40px] border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bayesian Posterior Density</h4>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
                            <div className="w-2 h-2 rounded-full bg-slate-400" /> Control
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-purple-500 uppercase">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /> Variant B (Neural)
                          </div>
                        </div>
                      </div>
                      <div className="w-full" style={{ width: '100%', height: 256, minHeight: 200 }}>
                        <ResponsiveContainer width="100%" height="100%" aspect={2.5} minWidth={0}>
                          <AreaChart data={bayesianData}>
                            <defs>
                              <linearGradient id="colorControl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorVariant" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="control" stroke="#94a3b8" fillOpacity={1} fill="url(#colorControl)" strokeWidth={3} />
                            <Area type="monotone" dataKey="variant" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVariant)" strokeWidth={3} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }}
                              itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {test.variants.map((v, idx) => (
                    <div key={v.id} className="relative group/variant">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[12px] font-black uppercase text-slate-400 tracking-[0.2em]">Variant {String.fromCharCode(65 + idx)}</span>
                          {v.isAiGenerated && (
                            <div className="px-3 py-1 bg-purple-500/10 rounded-full text-[8px] font-black text-purple-600 uppercase flex items-center gap-2 border border-purple-500/10">
                              <BrainCircuit size={14} /> AI Synthesis Active
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-10">
                          {v.performance && (
                            <div className="flex gap-10">
                              <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Perf Lift</p>
                                <p className="text-[12px] font-black text-emerald-500">+{v.performance.ctr}% CTR</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                                <p className="text-[12px] font-black">{v.performance.cpa}</p>
                              </div>
                            </div>
                          )}
                          <div className="w-16 text-right">
                            <span className="text-[12px] font-black text-slate-500">{v.allocation}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 transition-all group-hover/variant:border-slate-200">
                        <p className="text-2xl font-medium leading-tight mb-8 italic">"{v.content}"</p>
                        {v.synthesisParameters && (
                          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex gap-2">
                              {v.synthesisParameters.tone_vector.map(tone => (
                                <span key={tone} className="text-[10px] font-bold text-slate-400 uppercase bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">{tone}</span>
                              ))}
                            </div>
                            <div className="md:ml-auto flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alignment</p>
                                <p className="text-[10px] font-black">{(v.synthesisParameters.brand_alignment_score * 100).toFixed(0)}%</p>
                              </div>
                              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${v.synthesisParameters.brand_alignment_score * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {test.status === 'active' && (
                        <div className="mt-4 mx-2 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-1000", idx === 0 ? "bg-slate-300 dark:bg-slate-700" : "bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]")} 
                            style={{ width: `${v.allocation}%` }} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-16 flex flex-col md:flex-row justify-between items-center px-2 gap-8">
                  <div className="flex items-center gap-10 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><RotateCw size={16} className="text-blue-500" /> SVI Model V4.2</span>
                    {test.startDate !== 'TBD' && <span className="flex items-center gap-2 text-slate-300"><History size={16} /> Deployed: {test.startDate}</span>}
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={runAudit}
                      disabled={isAuditing}
                      className="flex-1 md:flex-none px-8 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-purple-500 transition-all disabled:opacity-50"
                    >
                      {isAuditing ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                      Audit Logs
                    </button>
                    <button 
                      onClick={() => generateAIVariants(test.id)}
                      disabled={isGenerating}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 shadow-2xl"
                    >
                      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                      Synthesize Variant
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A2A Agent Card */}
          <div className="card-agency p-8 bg-slate-900 dark:bg-slate-950 text-white border-transparent overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Globe size={16} className="text-blue-500" />
                </div>
                A2A Agent Card
              </h3>
              <Terminal size={14} className="text-slate-500" />
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Service ID</p>
                <p className="text-[11px] font-mono break-all text-blue-400">GroundingEngine_Orchestrator</p>
                <p className="text-[8px] font-mono text-slate-500 mt-2">https://grounding.flux-agency.a2a</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Version</p>
                  <p className="text-[10px] font-bold">1.0.0</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">A2A State</p>
                  <p className="text-[10px] font-bold text-emerald-400">SYNCED</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exposed Skills</p>
                {[
                  'Market Intelligence',
                  'Competitor Intelligence',
                  'Trend Analysis',
                  'SEO Opportunity Matrix',
                  'Crisis Monitoring'
                ].map(skill => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group/skill hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-bold text-slate-300">{skill}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Automated Action Board */}
          <div className="card-agency p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <Zap size={16} className="text-[#FF6B00]" /> Strategy Protocol
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'Promising Variant', badge: 'YELLOW', status: 'Active', trigger: 'p_best > 0.75', icon: AlertTriangle, recipient: 'Assigned Strategist' },
                { label: 'Strong Signal', badge: 'ORANGE', status: 'Auto-90/10', trigger: 'p_best > 0.90', icon: Zap, recipient: 'Strategist + Campaign Mgr' },
                { label: 'Winner Declared', badge: 'GREEN', status: 'Deploy 100%', trigger: 'p_best > 0.95', icon: CheckCircle2, recipient: 'Stakeholders + VP' },
                { label: 'Reversal Needed', badge: 'RED', status: 'Manual Rev', trigger: 'p_best < 0.50', icon: AlertTriangle, recipient: 'Strategist + Data Sci' },
                { label: 'SRM Critical', badge: 'RED', status: 'Paused', trigger: 'Sample Ratio Mismatch', icon: ShieldAlert, recipient: 'DevOps + Data Sci' },
              ].map((item, idx) => (
                <div key={item.label} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <item.icon size={14} className={cn(
                        item.badge === 'YELLOW' ? "text-amber-500" :
                        item.badge === 'ORANGE' ? "text-orange-500" : 
                        item.badge === 'GREEN' ? "text-emerald-500" : "text-rose-500"
                      )} />
                       <p className="text-[11px] font-black uppercase leading-tight">{item.label}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                      item.badge === 'YELLOW' ? "bg-amber-100 text-amber-600" :
                      item.badge === 'ORANGE' ? "bg-orange-100 text-orange-600" : 
                      item.badge === 'GREEN' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-mono text-slate-500 truncate uppercase">IF {item.trigger}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recipient</span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{item.recipient}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistical Architecture */}
          <div className="card-agency p-8 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-purple-500">
                <Terminal size={16} /> A2A Protocol Console
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {handoffLogs.length > 0 ? (
                  handoffLogs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-black text-purple-500 uppercase">{log.source} → {log.target}</span>
                        <span className="text-[8px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">
                        {log.payload.message || `Signal: ${log.payload.context?.intent || 'A2A_MESH_SYNC'}`}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Waiting for A2A burst...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <FlaskConical size={16} className="text-purple-500" /> Neural Controls
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'Inference', value: 'Variational (SVI)' },
                  { label: 'Uncertainty', value: 'MC Dropout V4' },
                  { label: 'Prior Dist.', value: 'Beta(1, 1)' },
                  { label: 'HDI Width', value: '95%' }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-slate-900 dark:text-white font-mono">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Inference Benchmarks</h4>
              <div className="space-y-4">
                {[
                  { label: 'VLB Score', value: '-2.41e2' },
                  { label: 'False Pos. Rate', value: '0.03' },
                  { label: 'Convergence', value: '0.0012' }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                    <span className="text-[11px] font-mono font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
