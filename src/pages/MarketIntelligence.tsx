import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Network,
  Cpu,
  Database,
  Sliders,
  Code,
  FileText,
  Activity,
  Check,
  XCircle,
  Terminal,
  SlidersHorizontal,
  Layers,
  BookOpen,
  Sparkles,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIService } from '../services/aiService';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

// Types
type TabType = 'overview' | 'topology' | 'verification' | 'policies' | 'apis' | 'releases';
type NodeId = 'intake' | 'quant' | 'insight' | 'control';
type NodeStatus = 'HEALTHY' | 'DEGRADED' | 'CIRCUIT_BROKEN';

interface TelemetryLog {
  id: string;
  timestamp: string;
  node: string;
  type: 'info' | 'warn' | 'success' | 'error';
  message: string;
}

interface VerificationCandidate {
  id: string;
  symbol: string;
  headline: string;
  confidence: number;
  sourcesCount: number;
  alignment: 'HIGH' | 'MEDIUM' | 'LOW' | 'CONTRADICTED';
  status: 'VERIFIED' | 'FLAGGED' | 'REJECTED';
  reason: string;
  timestamp: string;
}

interface LatencyPoint {
  time: string;
  'NYSE Feed': number;
  'Nasdaq Real-Time': number;
  'Bloomberg Professional': number;
  'Reuters': number;
  'SEC EDGAR': number;
  'Binance Spot': number;
}

export default function MarketIntelligence() {
  // State variables
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeNode, setActiveNode] = useState<NodeId>('intake');
  const [searchTarget, setSearchTarget] = useState('luxury tech competitors');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulations & Config State
  const [nodeHealths, setNodeHealths] = useState<Record<NodeId, NodeStatus>>({
    intake: 'HEALTHY',
    quant: 'HEALTHY',
    insight: 'HEALTHY',
    control: 'HEALTHY',
  });
  
  const [quantWindow, setQuantWindow] = useState('5s');
  const [policyThreshold, setPolicyThreshold] = useState(80);
  const [latencyConfidenceTradeoff, setLatencyConfidenceTradeoff] = useState(75); // 0=Low Latency, 100=Max Confidence
  const [whitelist, setWhitelist] = useState<string[]>(['SEC EDGAR', 'Bloomberg Professional', 'Reuters', 'NYSE Feed', 'Nasdaq Real-Time']);
  const [blacklist, setBlacklist] = useState<string[]>(['SpeculativeBlogs.co', 'Twitter Anonymous', 'Reddit r/WallStreetBets (Unverified)']);
  const [newWhitelistSource, setNewWhitelistSource] = useState('');
  const [newBlacklistSource, setNewBlacklistSource] = useState('');

  // Latency telemetry states
  const [latencyChartType, setLatencyChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [visibleSources, setVisibleSources] = useState<Record<string, boolean>>({
    'NYSE Feed': true,
    'Nasdaq Real-Time': true,
    'Bloomberg Professional': true,
    'Reuters': true,
    'SEC EDGAR': true,
    'Binance Spot': true,
  });
  const [latencyHistory, setLatencyHistory] = useState<LatencyPoint[]>(() => {
    const points: LatencyPoint[] = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3500);
      const timeStr = t.toTimeString().split(' ')[0];
      points.push({
        time: timeStr,
        'NYSE Feed': Math.floor(Math.random() * 8) + 10,
        'Nasdaq Real-Time': Math.floor(Math.random() * 6) + 8,
        'Bloomberg Professional': Math.floor(Math.random() * 15) + 30,
        'Reuters': Math.floor(Math.random() * 12) + 28,
        'SEC EDGAR': Math.floor(Math.random() * 60) + 120,
        'Binance Spot': Math.floor(Math.random() * 8) + 4,
      });
    }
    return points;
  });
  
  // Log stream simulator
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: '1', timestamp: '11:13:01', node: 'Flux Control Plane', type: 'success', message: 'SLA Router initialized. Priority level QoS enabled.' },
    { id: '2', timestamp: '11:13:02', node: 'Flux Intake', type: 'info', message: 'Connected to Bloomberg B-PIPE news-feed stream.' },
    { id: '3', timestamp: '11:13:05', node: 'Flux Quant Engine', type: 'info', message: 'Re-indexing TimeScale database. Compacting sliding windows.' },
    { id: '4', timestamp: '11:13:09', node: 'Flux Insight Engine', type: 'warn', message: 'Scenario analysis alert triggered on EUR-USD volatility spike.' },
    { id: '5', timestamp: '11:13:12', node: 'Flux Control Plane', type: 'success', message: 'Neural Search Verification completed for TSLA price target: 96% confidence.' }
  ]);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Verification candidates list
  const [candidates, setCandidates] = useState<VerificationCandidate[]>([
    {
      id: 'INS-001',
      symbol: 'NVDA',
      headline: 'Blackwell GPU cooling supplier liquidating critical facility',
      confidence: 97,
      sourcesCount: 8,
      alignment: 'HIGH',
      status: 'VERIFIED',
      reason: 'Confirmed by Reuters, SEC filing, and Bloomberg. Temporal alignment matches perfectly.',
      timestamp: '11:11:42'
    },
    {
      id: 'INS-002',
      symbol: 'AAPL',
      headline: 'Folding screen OLED panels ordered for sudden launch next Tuesday',
      confidence: 45,
      sourcesCount: 1,
      alignment: 'LOW',
      status: 'FLAGGED',
      reason: 'Contradicted by direct supplier supply chain data. High temporal alignment, but single source query.',
      timestamp: '11:08:15'
    },
    {
      id: 'INS-003',
      symbol: 'GS',
      headline: 'Goldman Sachs files emergency chapter 11 corporate bankruptcy',
      confidence: 2,
      sourcesCount: 0,
      alignment: 'CONTRADICTED',
      status: 'REJECTED',
      reason: 'Completely contradicted by live Federal Reserve and official exchange reporting channels. Quarantined.',
      timestamp: '11:02:10'
    },
    {
      id: 'INS-004',
      symbol: 'MSFT',
      headline: 'Azure cloud operations expand to three major sub-Saharan data hubs',
      confidence: 88,
      sourcesCount: 5,
      alignment: 'HIGH',
      status: 'VERIFIED',
      reason: 'Verified via local enterprise contracts and verified PR announcement streams.',
      timestamp: '10:55:04'
    },
    {
      id: 'INS-005',
      symbol: 'AMZN',
      headline: 'Autonomous drone fleet delivery approval expanded to 14 metropolitan cities',
      confidence: 72,
      sourcesCount: 3,
      alignment: 'MEDIUM',
      status: 'FLAGGED',
      reason: 'FAA approval pending official registry publication. Verified drone route updates found, but incomplete approval documents.',
      timestamp: '10:48:32'
    }
  ]);

  // Client API playground states
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /market/{symbol}/snapshot');
  const [apiParamSymbol, setApiParamSymbol] = useState('BTC');
  const [apiParamPortfolio, setApiParamPortfolio] = useState('PORT-FLUX-ALPHA');
  const [apiParamInsightId, setApiParamInsightId] = useState('INS-001');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Generate simulated streaming log lines
  useEffect(() => {
    if (!isLogStreaming) return;
    const interval = setInterval(() => {
      const sourceNodes = ['Flux Intake', 'Flux Quant Engine', 'Flux Insight Engine', 'Flux Control Plane'];
      const node = sourceNodes[Math.floor(Math.random() * sourceNodes.length)];
      
      const logTypes: ('info' | 'warn' | 'success' | 'error')[] = ['info', 'success', 'info', 'warn'];
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      
      const actions = {
        'Flux Intake': [
          'Ingested BTC-USDT Price Event: $94,242',
          'Polling SEC EDGAR RSS feed for annual filings...',
          'Scraped custom financial forum sentiment scores.',
          'Detected redundant pricing feed event. Automatically deduplicated.',
          'New stream registration: Binance Spot WebSockets.'
        ],
        'Flux Quant Engine': [
          'Calculated Micro volatility spike in AAPL: 0.12%',
          'Re-computing cross-asset correlations (Sliding window: ' + quantWindow + ')',
          'Order-book imbalance signal computed for NVDA: +0.65',
          'Derived risk formula synced with policy template.',
          'Saved latency-aware data block to columnar Timescale store.'
        ],
        'Flux Insight Engine': [
          'Generated "If US CPI climbs, bond yield spikes" scenario script.',
          'Updated playbook trigger validation scores.',
          'Risk flags recalculated: 3 Active, 0 Critical.',
          'Compiled portfolio impact metric scorecard for PORT-FLUX-ALPHA.',
          'Refreshed natural language narrative summaries.'
        ],
        'Flux Control Plane': [
          'Running neural search vector DB check against symbol ' + apiParamSymbol + '...',
          'SLA router throttled priority queue for basic node tenant.',
          'Consistency scoring: Source diversity = 4, Content alignment = 92%.',
          'Circuits monitored: Intake health is NORMAL, Quant throughput stable.',
          'Neural retriever completed query. Consensus verified.'
        ]
      };
      
      const nodeActions = actions[node as keyof typeof actions] || ['Heartbeat pulse detected.'];
      const message = nodeActions[Math.floor(Math.random() * nodeActions.length)];
      
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];
      
      const newLog: TelemetryLog = {
        id: Math.random().toString(),
        timestamp,
        node,
        type,
        message
      };
      
      setLogs((prev) => [...prev.slice(-30), newLog]); // Keep last 30 logs
    }, 3500);

    return () => clearInterval(interval);
  }, [isLogStreaming, quantWindow, apiParamSymbol]);

  // Scroll logs container to bottom when logs update
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Real-time latency tracking stream
  useEffect(() => {
    if (!isLogStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newPoint: LatencyPoint = {
        time: timeStr,
        'NYSE Feed': Math.max(2, Math.floor(Math.random() * 8) + 10),
        'Nasdaq Real-Time': Math.max(2, Math.floor(Math.random() * 6) + 8),
        'Bloomberg Professional': Math.max(5, Math.floor(Math.random() * 15) + 30),
        'Reuters': Math.max(5, Math.floor(Math.random() * 12) + 28),
        'SEC EDGAR': Math.max(10, Math.floor(Math.random() * 60) + 120),
        'Binance Spot': Math.max(1, Math.floor(Math.random() * 8) + 4),
      };
      setLatencyHistory((prev) => [...prev.slice(-14), newPoint]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isLogStreaming]);

  // Handle manual AI Grounding triggers (Competitor / Trend Analytics)
  const handleRunAnalysis = async (type: string, buttonLabel: string) => {
    setActiveAnalysis(type);
    setIsLoading(true);
    setResults(null);

    try {
      const ai = AIService.getInstance();
      const mesh = LoyaltyAgentService.getInstance();
      
      await mesh.processAction(`Market Intelligence: ${buttonLabel} on (${searchTarget})`);

      if (type === 'competitor') {
        const data = await ai.generateCompetitorIntel(searchTarget);
        setResults(data);
      } else if (type === 'seo') {
        const data = await ai.generateSEOKeywords(searchTarget);
        setResults({
          report_summary: `SEO Opportunity Matrix & Semantic Clusters for "${searchTarget}"`,
          detected_campaigns: data.clusters?.map((c: any) => `${c.intent || 'Cluster'}: ${c.keywords?.slice(0, 3).join(', ')} (Vol: ${c.volume_est || 'N/A'}, Diff: ${c.difficulty || 'N/A'}%)`) || [],
          data_points: [
            `Primary Keyword: ${data.primary_keyword || searchTarget}`,
            `Intent Classification: ${data.intent_classification || 'Informational'}`,
            `Overall Difficulty Score: ${data.difficulty_score || 'N/A'}/100`,
            `Recommended Publication Slot: ${data.recommended_date || 'Q3 Content Calendar'}`
          ],
          recommended_counter_move: `Leverage high search-volume clusters with strict E-E-A-T editorial reviews. Build specialized landing pages utilizing targeted schema tags.`,
          sources: ['Google Search Console', 'SEMrush Database v4', 'Ahrefs Rank Tracker']
        });
      } else {
        // Generic content intelligence call
        const data = await ai.generateContent(
          `Analyze "${searchTarget}" for ${buttonLabel}. Focus on live trend patterns, pricing shifts, and industry events. Use search grounding. Include clear CTA.`,
          "You are a luxury tech performance co-marketer and elite intelligence officer of Flux Agency. Be precise, professional, and thorough.",
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
        setResults({
          report_summary: data.data?.report_summary || "Grounding analysis completed.",
          data_points: data.data?.data_points || ["Verification rate: 100%", "Cross-source confirmed: Yes"],
          recommended_actions: data.data?.recommended_actions || ["Action plan: Scale performance ad deployment immediately."],
          sources: ['Google Custom Search Engine', 'Flux Trend Database API']
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated REST API Endpoint execution
  const executeApiCall = () => {
    setApiLoading(true);
    setApiResponse(null);
    
    setTimeout(() => {
      let data: any = {};
      const latency = Math.floor(Math.random() * 30) + 12; // 12ms to 42ms
      
      switch (selectedEndpoint) {
        case 'GET /market/{symbol}/snapshot':
          data = {
            symbol: apiParamSymbol.toUpperCase(),
            price: apiParamSymbol.toUpperCase() === 'BTC' ? 94242.50 : 224.80,
            change_24h_pct: apiParamSymbol.toUpperCase() === 'BTC' ? 4.12 : -1.05,
            volume_24h: apiParamSymbol.toUpperCase() === 'BTC' ? 342110500 : 12405000,
            orderbook_imbalance: 0.65,
            last_ingest_timestamp: new Date().toISOString(),
            source_venue: 'Coinbase Pro/Binance Multi-feed'
          };
          break;
        case 'GET /market/{symbol}/timeseries':
          data = {
            symbol: apiParamSymbol.toUpperCase(),
            interval: '1m',
            points_count: 5,
            points: [
              { t: '11:09:00', o: 94100, h: 94150, l: 94080, c: 94120, v: 12.4 },
              { t: '11:10:00', o: 94120, h: 94200, l: 94110, c: 94180, v: 18.1 },
              { t: '11:11:00', o: 94180, h: 94220, l: 94170, c: 94210, v: 9.8 },
              { t: '11:12:00', o: 94210, h: 94260, l: 94200, c: 94242, v: 24.3 },
              { t: '11:13:00', o: 94242, h: 94290, l: 94235, c: 94255, v: 15.6 }
            ]
          };
          break;
        case 'GET /signals/{symbol}':
          data = {
            symbol: apiParamSymbol.toUpperCase(),
            micro_signals: {
              spread_status: 'TIGHT',
              volatility_score: 0.12,
              liquidity_depth_usd: 8500000,
              imbalance_signal: 'BULLISH_PRESSURE'
            },
            macro_signals: {
              event_impact_index: 8.4,
              regime_classification: 'BULL_EXPANSION',
              cross_asset_correlations: {
                'SPY': 0.82,
                'DXY': -0.74,
                'GLD': 0.15
              }
            }
          };
          break;
        case 'GET /insights/portfolio/{portfolioId}':
          data = {
            portfolio_id: apiParamPortfolio,
            scenarios_triggered: [
              { id: 'SCEN-042', name: 'If US CPI climbs, yield curves steepen', trigger_level: 'HIGH', impact_score: -0.04 },
              { id: 'SCEN-089', name: 'Luxury consumer index growth accelerates', trigger_level: 'MEDIUM', impact_score: 0.15 }
            ],
            risk_flags: [
              { asset: 'NVDA', severity: 'WARNING', trigger_reason: 'Volatile cooling supplier news' }
            ],
            overall_portfolio_risk_level: 'STABLE_GROWTH'
          };
          break;
        case 'GET /verification/{insightId}':
          const cand = candidates.find(c => c.id === apiParamInsightId) || candidates[0];
          data = {
            insight_id: cand.id,
            target_asset: cand.symbol,
            original_narrative: cand.headline,
            verification_layer: {
              consensus_verdict: cand.status,
              confidence_score: cand.confidence / 100,
              source_diversity_count: cand.sourcesCount,
              temporal_window_seconds: 1800,
              retrieved_vector_count: 14,
              content_alignment_index: cand.alignment === 'HIGH' ? 0.96 : cand.alignment === 'MEDIUM' ? 0.72 : 0.41
            },
            citations: cand.sourcesCount > 0 ? [
              'Bloomberg Professional Terminal API',
              'Reuters News Feed V2',
              'SEC Regulatory Filing Archive'
            ] : []
          };
          break;
        case 'GET /verification/summary':
          data = {
            portfolio_id: apiParamPortfolio,
            metrics: {
              total_signals_verified: 14210,
              average_confidence: 0.942,
              quarantined_count: 142,
              compliance_audit_status: 'CERTIFIED_PASSED'
            },
            latest_flagged_alerts: [
              { id: 'INS-002', symbol: 'AAPL', status: 'FLAGGED', score: 0.45, reason: 'Single source discrepancy' }
            ]
          };
          break;
      }
      
      setApiResponse({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-flux-latency-ms': `${latency}ms`,
          'x-flux-node-id': 'control-plane-west-01'
        },
        payload: data
      });
      setApiLoading(false);
    }, 400);
  };

  // Helper lists/handlers for whitelists & blacklists
  const addWhitelistSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWhitelistSource.trim() && !whitelist.includes(newWhitelistSource.trim())) {
      setWhitelist([...whitelist, newWhitelistSource.trim()]);
      setNewWhitelistSource('');
    }
  };

  const addBlacklistSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlacklistSource.trim() && !blacklist.includes(newBlacklistSource.trim())) {
      setBlacklist([...blacklist, newBlacklistSource.trim()]);
      setNewBlacklistSource('');
    }
  };

  const removeWhitelistSource = (src: string) => {
    setWhitelist(whitelist.filter(s => s !== src));
  };

  const removeBlacklistSource = (src: string) => {
    setBlacklist(blacklist.filter(s => s !== src));
  };

  const handleManualVerificationOverride = (id: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setCandidates(candidates.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          confidence: newStatus === 'VERIFIED' ? 95 : 1,
          alignment: newStatus === 'VERIFIED' ? 'HIGH' : 'CONTRADICTED',
          reason: `Manual operator override triggered at ${new Date().toTimeString().split(' ')[0]}. Verified by Executive Counsel.`
        };
      }
      return c;
    }));
    
    // Add override log
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const newLog: TelemetryLog = {
      id: Math.random().toString(),
      timestamp,
      node: 'Flux Control Plane',
      type: 'warn',
      message: `Manual operator OVERRIDE executed on ${id}. Status forced to ${newStatus}.`
    };
    setLogs(prev => [...prev, newLog]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 font-sans text-slate-900 dark:text-white">
      
      {/* Header with Badges & Real-time Info */}
      <div className="mb-12 border-b border-slate-100 dark:border-slate-900 pb-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">FLUX MARKET INTELLIGENCE: GROUNDING ENGINE ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Globe size={11} className="animate-spin-slow text-blue-500" />
              <span>Multi-Source API Neural Mesh</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-wider border border-emerald-500/10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              A2A ACTIVE MONITORING: 4 NODES
            </span>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md text-slate-500 font-bold">
              v2.0.0
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase leading-[0.9]">
              FLUX <span className="text-slate-300 dark:text-slate-800 font-normal">MIOS</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mt-3 font-medium max-w-2xl">
              Market Intelligence Operating System. A real-time, multi-node streaming and analytics stack that ingests macro, event, and market data, validates findings via AI-driven neural search, and exposes secure endpoints.
            </p>
          </div>
          
          <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
            <button 
              onClick={() => {
                setIsLogStreaming(!isLogStreaming);
                const now = new Date();
                const log: TelemetryLog = {
                  id: Math.random().toString(),
                  timestamp: now.toTimeString().split(' ')[0],
                  node: 'Flux Control Plane',
                  type: 'info',
                  message: `User triggered logging stream toggle: ${!isLogStreaming ? 'ENABLED' : 'PAUSED'}`
                };
                setLogs(prev => [...prev, log]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-slate-800"
            >
              <RefreshCw size={12} className={cn(isLogStreaming && "animate-spin")} />
              <span>{isLogStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>
            <a 
              href="#releases" 
              onClick={(e) => { e.preventDefault(); setActiveTab('releases'); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/10"
            >
              <span>Release Notes ↗</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-8 border-t border-slate-100 dark:border-slate-900 pt-6">
          {(
            [
              { id: 'overview', label: 'Operator Console', icon: Activity },
              { id: 'topology', label: 'Node Topology Graph', icon: Network },
              { id: 'verification', label: 'Neural Search Layer', icon: ShieldAlert },
              { id: 'policies', label: 'Policy & SLA Editor', icon: SlidersHorizontal },
              { id: 'apis', label: 'Client API Sandbox', icon: Code },
              { id: 'releases', label: 'Docker & Releases', icon: BookOpen }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg shadow-slate-950/5"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-500 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:text-slate-400"
              )}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OPERATOR CONSOLE / OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* System Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              
              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">1. Flux Intake</span>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-display font-black">42<span className="text-sm font-normal text-slate-400"> ms</span></div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Ingestion Mean Latency</div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900/80 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <div>T-put: 1.25k ev/s</div>
                  <div className="text-right text-emerald-500">Loss: 0.00%</div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">2. Flux Quant Engine</span>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-display font-black">14,210</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Signals Computed</div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900/80 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <div>Queue Load: 12%</div>
                  <div className="text-right">S-Window: {quantWindow}</div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">3. Flux Insight Engine</span>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-display font-black">42 / 18</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Playbooks / Active Scenarios</div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900/80 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <div>Risk Flags: 3</div>
                  <div className="text-right text-yellow-500">Alert Latency: 84ms</div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">4. Flux Control Plane</span>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-display font-black">94.2<span className="text-sm font-normal text-slate-400">%</span></div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Mean Validation Confidence</div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900/80 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <div className="text-emerald-500">SLA QoS: 99.9%</div>
                  <div className="text-right">Circuit: NORMAL</div>
                </div>
              </div>

            </div>

            {/* Real-time Ingestion Latency Metrics */}
            <div id="realtime-latency-metrics" className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[40px] p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50 dark:border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Real-Time Ingestion Latency</h3>
                    <p className="text-[10px] text-slate-400 font-mono">MULTI-FEED TELEMETRY PORT & SOURCE PROFILING</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Chart Type Toggles */}
                  <div className="flex bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                    {(['line', 'area', 'bar'] as const).map((type) => (
                      <button
                        key={type}
                        id={`latency-chart-type-${type}`}
                        onClick={() => setLatencyChartType(type)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                          latencyChartType === type
                            ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                      >
                        {type} Chart
                      </button>
                    ))}
                  </div>

                  {/* Manual Jitter Simulator */}
                  <button
                    id="latency-simulate-jitter"
                    onClick={() => {
                      // Trigger a quick latency anomaly
                      const now = new Date();
                      const timeStr = now.toTimeString().split(' ')[0];
                      const anomalyPoint: LatencyPoint = {
                        time: timeStr,
                        'NYSE Feed': Math.floor(Math.random() * 40) + 90, // Spike!
                        'Nasdaq Real-Time': Math.floor(Math.random() * 50) + 110, // Spike!
                        'Bloomberg Professional': Math.floor(Math.random() * 100) + 200, // Spike!
                        'Reuters': Math.floor(Math.random() * 80) + 150, // Spike!
                        'SEC EDGAR': Math.floor(Math.random() * 200) + 400, // Spike!
                        'Binance Spot': Math.floor(Math.random() * 30) + 80, // Spike!
                      };
                      setLatencyHistory(prev => [...prev.slice(-14), anomalyPoint]);
                      
                      // Log the anomaly
                      const newLog: TelemetryLog = {
                        id: Math.random().toString(),
                        timestamp: timeStr,
                        node: 'Flux Intake',
                        type: 'warn',
                        message: `Telemetry jitter simulation: Intermittent network latency spikes detected on all feeds.`
                      };
                      setLogs(prev => [...prev, newLog]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-orange-500/10 cursor-pointer"
                  >
                    <span>Simulate Jitter</span>
                  </button>
                </div>
              </div>

              {/* Bento Grid: Chart (Left 8 cols) & Source Breakdown Table (Right 4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Latency Chart Render */}
                <div className="lg:col-span-8 flex flex-col justify-between h-[340px]">
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {latencyChartType === 'line' ? (
                        <LineChart data={latencyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
                          <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} unit="ms" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0F172A', 
                              borderColor: '#1E293B', 
                              borderRadius: '16px',
                              color: '#F8FAFC',
                              fontSize: '10px',
                              fontFamily: 'monospace'
                            }} 
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                          {Object.entries(visibleSources).map(([source, isVisible]) => {
                            if (!isVisible) return null;
                            const colors: Record<string, string> = {
                              'NYSE Feed': '#00AEEF',
                              'Nasdaq Real-Time': '#10B981',
                              'Bloomberg Professional': '#8B5CF6',
                              'Reuters': '#F97316',
                              'SEC EDGAR': '#64748B',
                              'Binance Spot': '#F0B90B'
                            };
                            return (
                              <Line 
                                key={source}
                                type="monotone" 
                                dataKey={source} 
                                stroke={colors[source] || '#94A3B8'} 
                                strokeWidth={2.5}
                                dot={{ r: 0 }}
                                activeDot={{ r: 4 }}
                                animationDuration={400}
                              />
                            );
                          })}
                        </LineChart>
                      ) : latencyChartType === 'area' ? (
                        <AreaChart data={latencyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            {Object.keys(visibleSources).map((source) => {
                              const colors: Record<string, string> = {
                                'NYSE Feed': '#00AEEF',
                                'Nasdaq Real-Time': '#10B981',
                                'Bloomberg Professional': '#8B5CF6',
                                'Reuters': '#F97316',
                                'SEC EDGAR': '#64748B',
                                'Binance Spot': '#F0B90B'
                              };
                              const hex = colors[source] || '#94A3B8';
                              return (
                                <linearGradient key={source} id={`color-${source.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={hex} stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor={hex} stopOpacity={0.0}/>
                                </linearGradient>
                              );
                            })}
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
                          <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} unit="ms" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0F172A', 
                              borderColor: '#1E293B', 
                              borderRadius: '16px',
                              color: '#F8FAFC',
                              fontSize: '10px',
                              fontFamily: 'monospace'
                            }} 
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                          {Object.entries(visibleSources).map(([source, isVisible]) => {
                            if (!isVisible) return null;
                            const colors: Record<string, string> = {
                              'NYSE Feed': '#00AEEF',
                              'Nasdaq Real-Time': '#10B981',
                              'Bloomberg Professional': '#8B5CF6',
                              'Reuters': '#F97316',
                              'SEC EDGAR': '#64748B',
                              'Binance Spot': '#F0B90B'
                            };
                            return (
                              <Area 
                                key={source}
                                type="monotone" 
                                dataKey={source} 
                                stroke={colors[source] || '#94A3B8'} 
                                fillOpacity={1}
                                fill={`url(#color-${source.replace(/\s+/g, '')})`}
                                strokeWidth={2}
                                animationDuration={400}
                              />
                            );
                          })}
                        </AreaChart>
                      ) : (
                        <BarChart data={[latencyHistory[latencyHistory.length - 1]]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
                          <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} unit="ms" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0F172A', 
                              borderColor: '#1E293B', 
                              borderRadius: '16px',
                              color: '#F8FAFC',
                              fontSize: '10px',
                              fontFamily: 'monospace'
                            }} 
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                          {Object.entries(visibleSources).map(([source, isVisible]) => {
                            if (!isVisible) return null;
                            const colors: Record<string, string> = {
                              'NYSE Feed': '#00AEEF',
                              'Nasdaq Real-Time': '#10B981',
                              'Bloomberg Professional': '#8B5CF6',
                              'Reuters': '#F97316',
                              'SEC EDGAR': '#64748B',
                              'Binance Spot': '#F0B90B'
                            };
                            return (
                              <Bar 
                                key={source}
                                dataKey={source} 
                                fill={colors[source] || '#94A3B8'} 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={45}
                                animationDuration={400}
                              />
                            );
                          })}
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-mono text-slate-400 mt-2">
                    <span className="font-bold text-slate-500 uppercase">Interactive Filter:</span>
                    {Object.entries(visibleSources).map(([source, isVisible]) => (
                      <label key={source} className="flex items-center gap-1.5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200">
                        <input 
                          type="checkbox" 
                          checked={isVisible}
                          onChange={(e) => setVisibleSources(prev => ({ ...prev, [source]: e.target.checked }))}
                          className="rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 w-3 h-3"
                        />
                        <span>{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Source Real-Time Diagnostics Table */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Live Source Health</h4>
                    
                    <div className="space-y-2.5">
                      {Object.keys(visibleSources).map((source) => {
                        const currentVal = latencyHistory[latencyHistory.length - 1]?.[source as keyof LatencyPoint] as number || 0;
                        
                        // Let's compute average for this source
                        const sum = latencyHistory.reduce((acc, pt) => acc + ((pt[source as keyof LatencyPoint] as number) || 0), 0);
                        const avg = Math.round(sum / latencyHistory.length);
                        
                        const isOptimal = currentVal < 50;
                        const isAcceptable = currentVal >= 50 && currentVal < 120;
                        const statusColor = isOptimal 
                          ? 'text-emerald-500 bg-emerald-500/10' 
                          : isAcceptable 
                            ? 'text-yellow-500 bg-yellow-500/10' 
                            : 'text-red-500 bg-red-500/10';
                        
                        const statusLabel = isOptimal 
                          ? 'OPTIMAL' 
                          : isAcceptable 
                            ? 'STABLE' 
                            : 'DEGRADED';

                        const colors: Record<string, string> = {
                          'NYSE Feed': 'bg-[#00AEEF]',
                          'Nasdaq Real-Time': 'bg-[#10B981]',
                          'Bloomberg Professional': 'bg-[#8B5CF6]',
                          'Reuters': 'bg-[#F97316]',
                          'SEC EDGAR': 'bg-[#64748B]',
                          'Binance Spot': 'bg-[#F0B90B]'
                        };

                        return (
                          <div key={source} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100/50 dark:border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={cn("w-2 h-2 rounded-full shrink-0", colors[source] || 'bg-slate-400')} />
                              <div className="min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-tight block truncate text-slate-700 dark:text-slate-300">{source}</span>
                                <span className="text-[8px] font-mono text-slate-400 block">Avg: {avg}ms</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-black">{currentVal} ms</span>
                              <span className={cn("text-[7px] font-mono font-black px-1.5 py-0.5 rounded", statusColor)}>
                                {statusLabel}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-900/60 pt-4 mt-4 grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-400">
                    <div>
                      <span>Jitter Window:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">35.0s Dynamic</span>
                    </div>
                    <div className="text-right">
                      <span>SLA Status:</span>
                      <span className="font-bold text-emerald-500 block">99.991% Optimal</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Neural Streaming Log Console & Active Target Grounding Sandbox */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Telemetry Log Terminal */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-[40px] p-6 shadow-xl flex flex-col h-[520px]">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
                      <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
                    </div>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-2">Operator Telemetry Queue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isLogStreaming ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                    )} />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {isLogStreaming ? 'Ingest Running' : 'Ingest Paused'}
                    </span>
                  </div>
                </div>
                
                {/* Console Log Lines */}
                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-2.5 items-start leading-relaxed hover:bg-slate-900/40 p-1.5 rounded transition-colors">
                      <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                      <span className={cn(
                        "font-black tracking-wider px-1.5 py-0.5 rounded text-[9px] shrink-0",
                        log.node === 'Flux Intake' && "bg-blue-950/80 text-[#00AEEF] border border-blue-900/30",
                        log.node === 'Flux Quant Engine' && "bg-emerald-950/80 text-emerald-500 border border-emerald-900/30",
                        log.node === 'Flux Insight Engine' && "bg-yellow-950/80 text-yellow-500 border border-yellow-900/30",
                        log.node === 'Flux Control Plane' && "bg-orange-950/80 text-orange-500 border border-orange-900/30"
                      )}>
                        {log.node.split(' ').map(w => w[0]).join('') /* Initials */}
                      </span>
                      <span className={cn(
                        "flex-1",
                        log.type === 'success' && 'text-emerald-400 font-medium',
                        log.type === 'warn' && 'text-yellow-400 font-medium',
                        log.type === 'error' && 'text-red-400 font-bold',
                        log.type === 'info' && 'text-slate-300'
                      )}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Stream Buffer: 30 events</span>
                  <button 
                    onClick={() => setLogs([])}
                    className="hover:text-red-400 transition-colors uppercase tracking-widest font-black"
                  >
                    Clear Console
                  </button>
                </div>
              </div>

              {/* Target Neural Search Grounding Tool */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[40px] p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="text-md font-black uppercase tracking-tight">Search Grounding Sandbox</h4>
                      <p className="text-[10px] text-slate-400">Trigger live Google Search custom scraping & LLM evaluation.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                        Target Concept / Asset / Competitor
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={searchTarget}
                          onChange={(e) => setSearchTarget(e.target.value)}
                          placeholder="e.g. luxury tech competitors, Solana DeFi volume, etc."
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <Search size={14} className="absolute left-3.5 top-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => handleRunAnalysis('competitor', 'Competitor Intelligence')}
                        disabled={isLoading}
                        className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-left rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group"
                      >
                        <Target size={16} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                        <h5 className="text-[10px] font-black uppercase tracking-wider">Competitor Intel</h5>
                        <p className="text-[8px] text-slate-400 mt-1">Grounded competitive matrix & ad actions.</p>
                      </button>

                      <button 
                        onClick={() => handleRunAnalysis('seo', 'SEO Opportunity Matrix')}
                        disabled={isLoading}
                        className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-left rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group"
                      >
                        <BarChart3 size={16} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                        <h5 className="text-[10px] font-black uppercase tracking-wider">SEO Clusters</h5>
                        <p className="text-[8px] text-slate-400 mt-1">Search volume & intent keyword categorization.</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grounding Trigger Button */}
                <div className="pt-8 border-t border-slate-50 dark:border-slate-900/60 mt-8">
                  <button 
                    onClick={() => handleRunAnalysis('generic', 'General Market Analysis')}
                    disabled={isLoading || !searchTarget.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Running Grounded Verification...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Verify & Ingest Target Concept</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* Results Display Area */}
            <AnimatePresence mode="wait">
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-10 shadow-2xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-8 mb-8">
                    <div className="flex gap-3">
                      <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/10 flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        GROUNDING VERIFIED: 100% CONSISTENCY
                      </span>
                      <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-500/10 flex items-center gap-1.5">
                        <Globe size={13} />
                        GOOGLE SEARCH grounded
                      </span>
                    </div>
                    <button 
                      onClick={() => setResults(null)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                      Dismiss Report
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 font-mono">Consensus Summary</h4>
                        <p className="text-xl font-medium leading-relaxed dark:text-slate-200">
                          {results.target_brand || results.report_summary}
                        </p>
                      </div>

                      {results.detected_campaigns && results.detected_campaigns.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">In-Flight Ingestion Events</h4>
                          <div className="space-y-3">
                            {results.detected_campaigns.map((c: string, idx: number) => (
                              <div key={idx} className="flex gap-3.5 p-4.5 bg-slate-50 dark:bg-slate-900/60 rounded-[20px] border border-slate-100/50 dark:border-slate-800">
                                <Flame size={15} className="text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold leading-relaxed">{c}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.data_points && results.data_points.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">Normalized Telemetry Records</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {results.data_points.map((p: string, idx: number) => (
                              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-[16px] border border-slate-100/50 dark:border-slate-800 text-[10px] font-bold font-mono text-slate-600 dark:text-slate-300">
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div className="p-8 bg-slate-950 dark:bg-white rounded-[40px] text-white dark:text-slate-950 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <Target size={22} className="text-orange-500" />
                          <h4 className="text-md font-black uppercase tracking-tight">SLA-Optimized Counter Strategy</h4>
                        </div>
                        <p className="text-xs border-l-2 border-orange-500 pl-4 py-2 italic opacity-85 mb-8 leading-relaxed font-medium">
                          {results.recommended_counter_move || results.recommended_actions?.[0]}
                        </p>
                        <div className="space-y-3">
                          {results.recommended_actions?.slice(1).map((a: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-wider">
                              <Plus size={14} className="text-orange-500" />
                              <span>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {results.sources && results.sources.length > 0 && (
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-slate-100/50 dark:border-slate-800">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">Consensus Citations</h4>
                          <div className="space-y-2.5">
                            {results.sources.map((s: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-bold truncate max-w-[250px]">{s}</span>
                                <ExternalLink size={12} className="text-slate-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE NODE TOPOLOGY GRAPH */}
        {activeTab === 'topology' && (
          <motion.div
            key="topology"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive SVG / CSS Network Diagram */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm flex flex-col justify-between min-h-[550px]">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1">MIOS Orchestration Pipeline</h3>
                  <p className="text-xs text-slate-400 mb-8">Click any node to configure, inspect REST routes, or trigger failover protocols.</p>
                </div>

                {/* SVG Graph Canvas */}
                <div className="relative w-full max-w-2xl mx-auto h-[320px] bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/50 dark:border-slate-800/80 rounded-[36px] flex items-center justify-center overflow-hidden">
                  
                  {/* Dynamic Glowing SVG Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient id="grad-intake-quant" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="grad-quant-insight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="grad-insight-control" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="grad-intake-control" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Paths linking the 4 nodes */}
                    {/* Ingestion to Analytics */}
                    <path d="M 120 160 Q 220 100, 320 100" fill="none" stroke="url(#grad-intake-quant)" strokeWidth="2.5" strokeDasharray="6 6" className="animate-dash" />
                    {/* Analytics to Intelligence */}
                    <path d="M 320 100 Q 420 100, 520 160" fill="none" stroke="url(#grad-quant-insight)" strokeWidth="2.5" strokeDasharray="6 6" className="animate-dash" />
                    {/* Intelligence to Control Plane */}
                    <path d="M 520 160 Q 420 220, 320 220" fill="none" stroke="url(#grad-insight-control)" strokeWidth="2.5" strokeDasharray="6 6" className="animate-dash" />
                    {/* Ingestion to Control Plane */}
                    <path d="M 120 160 Q 220 220, 320 220" fill="none" stroke="url(#grad-intake-control)" strokeWidth="2.5" strokeDasharray="4 4" className="animate-dash" />
                  </svg>

                  {/* 1. Flux Intake (Left) */}
                  <button 
                    onClick={() => setActiveNode('intake')}
                    className={cn(
                      "absolute left-[60px] top-[120px] p-4 rounded-3xl border flex flex-col items-center justify-center transition-all w-[130px] shadow-lg",
                      activeNode === 'intake' ? "border-[#00AEEF] ring-4 ring-[#00AEEF]/10 bg-white dark:bg-slate-900 z-10 scale-105" : "border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90",
                      nodeHealths.intake === 'DEGRADED' && "border-yellow-500 ring-yellow-500/20",
                      nodeHealths.intake === 'CIRCUIT_BROKEN' && "border-red-500 ring-red-500/20"
                    )}
                  >
                    <Database size={24} className="text-[#00AEEF] mb-1.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">1. Flux Intake</span>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase",
                      nodeHealths.intake === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : nodeHealths.intake === 'DEGRADED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    )}>
                      {nodeHealths.intake}
                    </span>
                  </button>

                  {/* 2. Flux Quant Engine (Top Middle) */}
                  <button 
                    onClick={() => setActiveNode('quant')}
                    className={cn(
                      "absolute left-[255px] top-[40px] p-4 rounded-3xl border flex flex-col items-center justify-center transition-all w-[130px] shadow-lg",
                      activeNode === 'quant' ? "border-emerald-500 ring-4 ring-emerald-500/10 bg-white dark:bg-slate-900 z-10 scale-105" : "border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90",
                      nodeHealths.quant === 'DEGRADED' && "border-yellow-500 ring-yellow-500/20",
                      nodeHealths.quant === 'CIRCUIT_BROKEN' && "border-red-500 ring-red-500/20"
                    )}
                  >
                    <Cpu size={24} className="text-emerald-500 mb-1.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">2. Quant Engine</span>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase",
                      nodeHealths.quant === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : nodeHealths.quant === 'DEGRADED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    )}>
                      {nodeHealths.quant}
                    </span>
                  </button>

                  {/* 3. Flux Insight Engine (Right) */}
                  <button 
                    onClick={() => setActiveNode('insight')}
                    className={cn(
                      "absolute right-[60px] top-[120px] p-4 rounded-3xl border flex flex-col items-center justify-center transition-all w-[130px] shadow-lg",
                      activeNode === 'insight' ? "border-yellow-500 ring-4 ring-yellow-500/10 bg-white dark:bg-slate-900 z-10 scale-105" : "border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90",
                      nodeHealths.insight === 'DEGRADED' && "border-yellow-500 ring-yellow-500/20",
                      nodeHealths.insight === 'CIRCUIT_BROKEN' && "border-red-500 ring-red-500/20"
                    )}
                  >
                    <Sliders size={24} className="text-yellow-500 mb-1.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">3. Insight Engine</span>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase",
                      nodeHealths.insight === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : nodeHealths.insight === 'DEGRADED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    )}>
                      {nodeHealths.insight}
                    </span>
                  </button>

                  {/* 4. Flux Control Plane (Bottom Middle) */}
                  <button 
                    onClick={() => setActiveNode('control')}
                    className={cn(
                      "absolute left-[255px] top-[195px] p-4 rounded-3xl border flex flex-col items-center justify-center transition-all w-[130px] shadow-lg",
                      activeNode === 'control' ? "border-orange-500 ring-4 ring-orange-500/10 bg-white dark:bg-slate-900 z-10 scale-105" : "border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90",
                      nodeHealths.control === 'DEGRADED' && "border-yellow-500 ring-yellow-500/20",
                      nodeHealths.control === 'CIRCUIT_BROKEN' && "border-red-500 ring-red-500/20"
                    )}
                  >
                    <Network size={24} className="text-orange-500 mb-1.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">4. Control Plane</span>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase",
                      nodeHealths.control === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : nodeHealths.control === 'DEGRADED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    )}>
                      {nodeHealths.control}
                    </span>
                  </button>

                  {/* Center Hub Indicator */}
                  <div className="absolute left-[310px] top-[140px] w-5 h-5 bg-orange-500/20 border border-orange-500/50 rounded-full animate-ping pointer-events-none" />

                </div>

                {/* Legend & Sync Call to Action */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-900/60 pt-6 mt-6">
                  <div className="flex gap-4 text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Healthy</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full" /> Degraded</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> Circuit Broken</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setNodeHealths({ intake: 'HEALTHY', quant: 'HEALTHY', insight: 'HEALTHY', control: 'HEALTHY' });
                      const now = new Date();
                      const log: TelemetryLog = {
                        id: Math.random().toString(),
                        timestamp: now.toTimeString().split(' ')[0],
                        node: 'Flux Control Plane',
                        type: 'success',
                        message: 'Global node topology synchronization completed. Re-balanced routing.'
                      };
                      setLogs(prev => [...prev, log]);
                    }}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Sync Node Topology
                  </button>
                </div>
              </div>

              {/* Node Details Panel */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm flex flex-col justify-between">
                
                {/* Node metadata */}
                <div>
                  <div className="border-b border-slate-50 dark:border-slate-900/60 pb-5 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Specialist Node Profile</span>
                    <h4 className="text-xl font-black uppercase tracking-tight mt-1">
                      {activeNode === 'intake' && 'Flux Ingestion Node'}
                      {activeNode === 'quant' && 'Flux Analytics Node'}
                      {activeNode === 'insight' && 'Flux Intelligence Node'}
                      {activeNode === 'control' && 'Flux Control Plane'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                      CODENAME: {activeNode === 'intake' && 'FLUX-INTAKE'}
                      {activeNode === 'quant' && 'FLUX-QUANT-ENGINE'}
                      {activeNode === 'insight' && 'FLUX-INSIGHT-ENGINE'}
                      {activeNode === 'control' && 'FLUX-CONTROL-PLANE'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Node Summary */}
                    <div>
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 font-mono">Role Description</h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {activeNode === 'intake' && 'Streams, batches, and scrapes multi-source market data from exchanges, RSS, news feeds, and social sentiment into Kafka topics.'}
                        {activeNode === 'quant' && 'Computes real-time factor models, spread indices, volatility metrics, and order-book imbalances using micro-batch sliding windows.'}
                        {activeNode === 'insight' && 'Turns computed signals into scenario-playbooks ("If X, then Y"), risk scoring vectors, and natural language summary assets.'}
                        {activeNode === 'control' && 'Routes streaming events across nodes, monitors cluster health telemetry, and runs vector-based neural search validations.'}
                      </p>
                    </div>

                    {/* Operational Routes */}
                    <div>
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Internal REST Endpoints</h5>
                      <div className="space-y-1.5 font-mono text-[10px]">
                        {activeNode === 'intake' && (
                          <>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/intake/source/register</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/intake/events/ingest</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/intake/metrics/latency</span></div>
                          </>
                        )}
                        {activeNode === 'quant' && (
                          <>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/analytics/signal/compute</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/analytics/signal/{"{"}symbol{"}"}</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/analytics/factorset/{"{"}id{"}"}</span></div>
                          </>
                        )}
                        {activeNode === 'insight' && (
                          <>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/insights/generate</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/insights/portfolio/{"{"}id{"}"}</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/insights/playbooks</span></div>
                          </>
                        )}
                        {activeNode === 'control' && (
                          <>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/orchestrator/event</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-emerald-500 font-black">GET</span><span>/orchestrator/status</span></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800"><span className="text-blue-500 font-black">POST</span><span>/verify/search</span></div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Node Config / Simulator */}
                    <div>
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 font-mono font-bold">Simulator Controls</h5>
                      
                      {activeNode === 'quant' && (
                        <div className="mb-4">
                          <label className="block text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Sliding Micro-Batch Window</label>
                          <div className="grid grid-cols-4 gap-1">
                            {['1s', '5s', '1m', '15m'].map(w => (
                              <button 
                                key={w} 
                                onClick={() => setQuantWindow(w)}
                                className={cn(
                                  "py-2 rounded-lg text-[9px] font-bold font-mono transition-colors",
                                  quantWindow === w ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200"
                                )}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setNodeHealths(prev => ({ ...prev, [activeNode]: 'HEALTHY' }))}
                          className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          Heal Node
                        </button>
                        <button 
                          onClick={() => setNodeHealths(prev => ({ ...prev, [activeNode]: 'DEGRADED' }))}
                          className="flex-1 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          SLA Degrade
                        </button>
                        <button 
                          onClick={() => {
                            setNodeHealths(prev => ({ ...prev, [activeNode]: 'CIRCUIT_BROKEN' }));
                            const now = new Date();
                            const log: TelemetryLog = {
                              id: Math.random().toString(),
                              timestamp: now.toTimeString().split(' ')[0],
                              node: 'Flux Control Plane',
                              type: 'error',
                              message: `Circuit breaker TRIPPED on ${activeNode}. Auto-failover triggered.`
                            };
                            setLogs(prev => [...prev, log]);
                          }}
                          className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          Failover
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Call to Action for Node Operations */}
                <div className="pt-6 border-t border-slate-50 dark:border-slate-900/60 mt-8">
                  <button 
                    onClick={() => {
                      const now = new Date();
                      const log: TelemetryLog = {
                        id: Math.random().toString(),
                        timestamp: now.toTimeString().split(' ')[0],
                        node: activeNode === 'intake' ? 'Flux Intake' : activeNode === 'quant' ? 'Flux Quant Engine' : activeNode === 'insight' ? 'Flux Insight Engine' : 'Flux Control Plane',
                        type: 'info',
                        message: `Manual operator query execution triggered on active node: ${activeNode}.`
                      };
                      setLogs(prev => [...prev, log]);
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-500/10"
                  >
                    Test Active Node Heartbeat
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: NEURAL SEARCH VERIFICATION LAYER */}
        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Visualizing Neural Verification Workflow */}
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Neural Search Verification Workflow</h3>
              <p className="text-xs text-slate-400 mb-8">How candidates are verified or suppressed by comparing output logs with real-time vector indexing corpus.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                
                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100/50 dark:border-slate-800 text-center relative">
                  <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-4">1</div>
                  <h5 className="text-[10px] font-black uppercase tracking-wider mb-2">Candidate Proposal</h5>
                  <p className="text-[9px] text-slate-400 leading-relaxed">Quant/Insight node proposes a pricing signal or narrative.</p>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100/50 dark:border-slate-800 text-center relative">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-4">2</div>
                  <h5 className="text-[10px] font-black uppercase tracking-wider mb-2">Vector DB Retrieval</h5>
                  <p className="text-[9px] text-slate-400 leading-relaxed">Query vector corpus keyed by symbol, time, and independent venue sources.</p>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100/50 dark:border-slate-800 text-center relative">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-4">3</div>
                  <h5 className="text-[10px] font-black uppercase tracking-wider mb-2">Consistency Scoring</h5>
                  <p className="text-[9px] text-slate-400 leading-relaxed">Cross-checks temporal alignment and content similarity indexes.</p>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100/50 dark:border-slate-800 text-center relative">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-4">4</div>
                  <h5 className="text-[10px] font-black uppercase tracking-wider mb-2">Scoring Outcome</h5>
                  <p className="text-[9px] text-slate-400 leading-relaxed">Surfaces high confidence findings; quarantines contradictions.</p>
                </div>

              </div>
            </div>

            {/* Confidence Histogram & Interactive Verification Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Score Distribution Histogram */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-md font-black uppercase tracking-tight mb-1">Confidence Score Profile</h4>
                  <p className="text-[10px] text-slate-400 mb-6 font-mono">DISTRIBUTION HISTOGRAM (LAST 10,000 EVENTS)</p>
                </div>

                {/* CSS Bar Chart */}
                <div className="flex items-end justify-between h-[180px] gap-2 pt-4 px-2">
                  {[
                    { label: '0-20%', value: 'w-full h-[6%]', color: 'bg-red-500', count: 120 },
                    { label: '21-40%', value: 'w-full h-[14%]', color: 'bg-orange-500', count: 280 },
                    { label: '41-60%', value: 'w-full h-[28%]', color: 'bg-yellow-500', count: 560 },
                    { label: '61-80%', value: 'w-full h-[62%]', color: 'bg-blue-500', count: 1840 },
                    { label: '81-100%', value: 'w-full h-[95%]', color: 'bg-emerald-500', count: 7200 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-lg h-[130px] flex items-end overflow-hidden relative">
                        <div className={cn("rounded-t-lg transition-all duration-500 group-hover:brightness-110", bar.value, bar.color)} />
                        {/* Tooltip on hover */}
                        <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[8px] font-mono px-1.5 py-1 rounded bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none transition-opacity whitespace-nowrap z-20">
                          Count: {bar.count} ({Math.round(bar.count / 100)}%)
                        </div>
                      </div>
                      <span className="text-[7px] font-mono text-slate-400 font-bold tracking-wider uppercase">{bar.label}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-50 dark:border-slate-900/60 pt-4 mt-6 text-[10px] font-mono text-slate-400 leading-relaxed">
                  <div className="flex justify-between mb-1">
                    <span>Validation SLA Rate:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">99.98% Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejection Rate:</span>
                    <span className="font-bold text-red-500">1.42% Quarantined</span>
                  </div>
                </div>
              </div>

              {/* Active Candidate Ledger */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-md font-black uppercase tracking-tight">Interactive Verification Ledger</h4>
                    <p className="text-[10px] text-slate-400">Validate, flag, or suppress proposed market insights on-demand.</p>
                  </div>
                  
                  {/* CTA inside verification tab */}
                  <button 
                    onClick={() => {
                      const now = new Date();
                      const promptText = prompt("Enter custom signal narrative for manual verification analysis:") || "";
                      if (promptText.trim()) {
                        const newCandidate: VerificationCandidate = {
                          id: `INS-00${candidates.length + 1}`,
                          symbol: 'CUSTOM',
                          headline: promptText,
                          confidence: Math.floor(Math.random() * 40) + 55, // 55-95
                          sourcesCount: Math.floor(Math.random() * 6) + 1,
                          alignment: 'MEDIUM',
                          status: 'VERIFIED',
                          reason: 'Manual validation analysis triggered by Executive Operator.',
                          timestamp: now.toTimeString().split(' ')[0]
                        };
                        setCandidates([newCandidate, ...candidates]);
                        setLogs(prev => [...prev, {
                          id: Math.random().toString(),
                          timestamp: now.toTimeString().split(' ')[0],
                          node: 'Flux Control Plane',
                          type: 'success',
                          message: `Manual Verification Candidate proposed: ${promptText.slice(0, 30)}...`
                        }]);
                      }
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Propose Candidate
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">
                        <th className="pb-3 pr-2">ID</th>
                        <th className="pb-3 pr-2">Asset</th>
                        <th className="pb-3 pr-2">Proposed Signal</th>
                        <th className="pb-3 pr-2 text-center">Score</th>
                        <th className="pb-3 pr-2 text-center">Verdict</th>
                        <th className="pb-3 text-right">Operator Interventions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40 text-xs">
                      {candidates.map((cand) => (
                        <tr key={cand.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 group">
                          <td className="py-4 pr-2 font-mono text-[10px] text-slate-400">{cand.id}</td>
                          <td className="py-4 pr-2 font-black font-mono text-slate-600 dark:text-slate-300">{cand.symbol}</td>
                          <td className="py-4 pr-2 max-w-[220px]">
                            <div className="font-medium leading-relaxed truncate-3-lines">{cand.headline}</div>
                            <div className="text-[8px] text-slate-400 mt-1 italic font-mono">{cand.reason}</div>
                          </td>
                          <td className="py-4 pr-2 text-center font-mono font-bold">
                            <span className={cn(
                              cand.confidence >= 80 ? 'text-emerald-500' : cand.confidence >= 50 ? 'text-yellow-500' : 'text-red-500'
                            )}>
                              {cand.confidence}%
                            </span>
                          </td>
                          <td className="py-4 pr-2 text-center">
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full font-mono",
                              cand.status === 'VERIFIED' && 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                              cand.status === 'FLAGGED' && 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
                              cand.status === 'REJECTED' && 'bg-red-500/10 text-red-500 border border-red-500/20'
                            )}>
                              {cand.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              {cand.status !== 'VERIFIED' && (
                                <button 
                                  onClick={() => handleManualVerificationOverride(cand.id, 'VERIFIED')}
                                  className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded text-[8px] font-black uppercase tracking-wider"
                                >
                                  Override Verified
                                </button>
                              )}
                              {cand.status !== 'REJECTED' && (
                                <button 
                                  onClick={() => handleManualVerificationOverride(cand.id, 'REJECTED')}
                                  className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-[8px] font-black uppercase tracking-wider"
                                >
                                  Suppress Block
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: OPERATOR POLICY & SLA EDITOR */}
        {activeTab === 'policies' && (
          <motion.div
            key="policies"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* SLIDERS & SLA METRICS */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1">Queue & SLA Threshold Configuration</h3>
                  <p className="text-xs text-slate-400">Control throttling algorithms, minimum validation rates, and pipeline speed trade-offs.</p>
                </div>

                <div className="space-y-8">
                  {/* Validation Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Minimum Verification Threshold</label>
                      <span className="text-sm font-black font-mono text-orange-500">{policyThreshold}% Confidence</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="95" 
                      value={policyThreshold}
                      onChange={(e) => setPolicyThreshold(Number(e.target.value))}
                      className="w-full accent-orange-500 bg-slate-100 dark:bg-slate-900 rounded-lg h-2 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 mt-2">Proposed insights scoring below this value are flagged as unverified and require operator override.</p>
                  </div>

                  {/* Latency vs Confidence */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Latency vs. Confidence Trade-off</label>
                      <span className="text-sm font-black font-mono text-blue-500">
                        {latencyConfidenceTradeoff < 40 ? 'LOW LATENCY' : latencyConfidenceTradeoff > 70 ? 'MAX VERIFICATION' : 'SLA BALANCED'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={latencyConfidenceTradeoff}
                      onChange={(e) => setLatencyConfidenceTradeoff(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-100 dark:bg-slate-900 rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1 uppercase">
                      <span>Low Latency (Fast routing)</span>
                      <span>SLA Balanced</span>
                      <span>Max Confidence (Strict cross-checks)</span>
                    </div>
                  </div>

                  {/* Priority QoS Rules */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-orange-500 font-mono">Priority Queue Throttling (QoS)</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Standard Class</span>
                        <div className="text-xl font-black font-mono mt-1 text-slate-800 dark:text-slate-200">100 r/m</div>
                        <p className="text-[8px] text-slate-400 mt-1">SLA Latency target: &lt; 500ms</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Elite Corporate Class</span>
                        <div className="text-xl font-black font-mono mt-1 text-emerald-500">5,000 r/m</div>
                        <p className="text-[8px] text-slate-400 mt-1">SLA Latency target: &lt; 50ms</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Apply Policies Call to Action */}
                <div className="pt-6 border-t border-slate-50 dark:border-slate-900/60 mt-8">
                  <button 
                    onClick={() => {
                      const now = new Date();
                      const log: TelemetryLog = {
                        id: Math.random().toString(),
                        timestamp: now.toTimeString().split(' ')[0],
                        node: 'Flux Control Plane',
                        type: 'success',
                        message: `Global policy configuration updated: threshold=${policyThreshold}%, tradeoff=${latencyConfidenceTradeoff}%. Applied across all 4 nodes.`
                      };
                      setLogs(prev => [...prev, log]);
                      alert('SLA Policies successfully updated and synchronized globally across Kafka topics.');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Check size={14} />
                    <span>Apply Global Policy & Sync Nodes</span>
                  </button>
                </div>

              </div>

              {/* WHITELISTS & BLACKLISTS */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm space-y-8">
                
                {/* Whitelist Manage */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#00AEEF] font-mono">Source Whitelist (Trusted)</h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed">Feeds bypass secondary neural verification checks.</p>
                  </div>

                  <form onSubmit={addWhitelistSource} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add trusted source name"
                      value={newWhitelistSource}
                      onChange={(e) => setNewWhitelistSource(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wide focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-slate-900 dark:bg-slate-800 hover:brightness-105 rounded-xl text-white">
                      <Plus size={16} />
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {whitelist.map(src => (
                      <span key={src} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-mono font-bold">
                        {src}
                        <button type="button" onClick={() => removeWhitelistSource(src)} className="text-red-400 hover:text-red-500 font-bold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blacklist Manage */}
                <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-900/60">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-500 font-mono">Source Blacklist (Untrusted)</h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed">Feeds automatically discarded or quarantined immediately.</p>
                  </div>

                  <form onSubmit={addBlacklistSource} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add blacklist source name"
                      value={newBlacklistSource}
                      onChange={(e) => setNewBlacklistSource(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wide focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-slate-900 dark:bg-slate-800 hover:brightness-105 rounded-xl text-white">
                      <Plus size={16} />
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {blacklist.map(src => (
                      <span key={src} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 text-red-500 border border-red-500/10 rounded-xl text-[10px] font-mono font-bold">
                        {src}
                        <button type="button" onClick={() => removeBlacklistSource(src)} className="text-red-400 hover:text-red-500 font-bold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: EXTERNAL CLIENT APIS & SANDBOX */}
        {activeTab === 'apis' && (
          <motion.div
            key="apis"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* API Route List & Reference */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1">External Client REST APIs</h3>
                  <p className="text-xs text-slate-400">Exposed route indexing. Deployable base URL: <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[10px]">https://api.flux-mios.com/v1</code></p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'GET /market/{symbol}/snapshot', desc: 'Retrieve instantaneous micro-signals and venue price telemetry snapshot.' },
                    { id: 'GET /market/{symbol}/timeseries', desc: 'Normalized historical timeseries points optimized for columnar rendering.' },
                    { id: 'GET /signals/{symbol}', desc: 'Exposes composite micro/macro risk factors and correlation indices.' },
                    { id: 'GET /insights/portfolio/{portfolioId}', desc: 'Retrieve triggered scenario alerts, asset playbooks, and active risk states.' },
                    { id: 'GET /verification/{insightId}', desc: 'Inspect neural verification metadata, source alignment, and consensus scores.' },
                    { id: 'GET /verification/summary', desc: 'Aggregated volume data of total validated feeds and quarantined exclusions.' }
                  ].map((route) => (
                    <button
                      key={route.id}
                      onClick={() => {
                        setSelectedEndpoint(route.id);
                        setApiResponse(null);
                      }}
                      className={cn(
                        "w-full p-4 rounded-3xl border text-left transition-all",
                        selectedEndpoint === route.id
                          ? "border-orange-500 bg-orange-500/5 shadow-md shadow-orange-500/5 z-10"
                          : "border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[8px] font-black rounded-md">GET</span>
                        <code className="text-[10px] font-black font-mono text-slate-800 dark:text-slate-200">{route.id.split(' ')[1]}</code>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{route.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Sandbox Console */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm flex flex-col justify-between min-h-[550px]">
                
                <div>
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900/60 pb-5 mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Interactive Developer Console</span>
                      <h4 className="text-lg font-black uppercase tracking-tight mt-0.5">API Request Sandbox</h4>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-[#00AEEF] rounded-full text-[9px] font-black uppercase font-mono tracking-wider">
                      Mock API Key Provisioned
                    </span>
                  </div>

                  {/* Sandbox parameter inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-[8px] font-mono font-black uppercase tracking-widest text-slate-400 mb-1.5">{'param: {symbol}'}</label>
                      <input 
                        type="text" 
                        value={apiParamSymbol}
                        onChange={(e) => setApiParamSymbol(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono font-black uppercase tracking-widest text-slate-400 mb-1.5">{'param: {portfolioId}'}</label>
                      <input 
                        type="text" 
                        value={apiParamPortfolio}
                        onChange={(e) => setApiParamPortfolio(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono font-black uppercase tracking-widest text-slate-400 mb-1.5">{'param: {insightId}'}</label>
                      <select 
                        value={apiParamInsightId}
                        onChange={(e) => setApiParamInsightId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none"
                      >
                        {candidates.map(c => (
                          <option key={c.id} value={c.id}>{c.id} ({c.symbol})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Target Request Path Visualizer */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-500 font-black mr-2">GET</span>
                      <span>https://api.flux-mios.com/v1{selectedEndpoint.split(' ')[1].replace('{symbol}', apiParamSymbol).replace('{portfolioId}', apiParamPortfolio).replace('{insightId}', apiParamInsightId)}</span>
                    </div>
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-wider">REST API</span>
                  </div>

                  {/* Sandbox Response Payload Block */}
                  <div className="font-mono text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-bold uppercase">
                      <span>Response Payload</span>
                      {apiResponse && (
                        <div className="flex gap-3 text-[9px]">
                          <span className="text-emerald-400">STATUS: {apiResponse.status} {apiResponse.statusText}</span>
                          <span className="text-blue-400">LATENCY: {apiResponse.headers['x-flux-latency-ms']}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 h-[240px] overflow-y-auto text-slate-300 relative">
                      {apiLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80">
                          <Loader2 size={24} className="animate-spin text-orange-500 mb-2" />
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Executing Query...</span>
                        </div>
                      ) : apiResponse ? (
                        <pre className="text-[10px] leading-relaxed whitespace-pre-wrap">{JSON.stringify(apiResponse.payload, null, 2)}</pre>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 select-none">
                          <Terminal size={32} className="mb-2 opacity-50" />
                          <span>Click "Send Request" to invoke active endpoint simulator</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call to Action for API execution */}
                <div className="pt-6 border-t border-slate-50 dark:border-slate-900/60 mt-8 flex justify-between gap-3">
                  <button 
                    onClick={() => {
                      const token = `flx_token_${Math.random().toString(36).substr(2, 16)}`;
                      alert(`Successfully generated secure API Client credentials:\nToken: ${token}\nExpires: 30 Days\nQoS: Elite Corporate`);
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Provision Client API Token
                  </button>
                  <button 
                    onClick={executeApiCall}
                    disabled={apiLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-500/10"
                  >
                    <span>Run Sandbox Request</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 6: DOCKER, HELM & RELEASE NOTES */}
        {activeTab === 'releases' && (
          <motion.div
            key="releases"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Release notes header banner */}
            <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 rounded-[48px] text-white border border-orange-900/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="px-3.5 py-1.5 bg-orange-500/20 text-orange-400 rounded-xl text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
                  Version v2.0.0 Stable Ingest
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                  Codename: Neural Dominance
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase leading-[0.9] max-w-xl">
                Release Notes: <span className="text-orange-500">Neural Dominance</span>
              </h2>
              <p className="text-slate-400 text-sm mt-4 font-medium max-w-2xl leading-relaxed">
                Formally delivering the 4-node real-time streaming pipeline architecture alongside active vector-based neural search validation for all strategic market alerts and factor indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="releases">
              
              {/* Release Highlights */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black uppercase tracking-tight">Key Upgrade Features</h3>
                
                <div className="space-y-4">
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">Neural Search Verification</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Continuous cross-source validation pipeline for all generated macro playbooks. Consistency scores now calculated, verified, and exposed directly through developer REST APIs and monitoring console.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-900/60">
                    <div className="w-8 h-8 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] flex items-center justify-center shrink-0 mt-0.5">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">4-Node Ingest & Analytics Fabric</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Formally separated pipeline roles into Flux Intake (Scraping/Ingestion), Flux Quant Engine (Time-series computation), Flux Insight Engine (Scenario trigger models), and Flux Control Plane (Health monitoring & SLAs).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-900/60">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">Operator OS Upgrades</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Equipped administrative operators with interactive network topology graphs, confidence score distribution metrics, manual override ledgers, and comprehensive API parameters sandbox.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-900/60">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sliders size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">Under-the-Hood Performance Gains</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Average end-to-end event propagation latency reduced by approximately 30% under heavy simulated load benchmarks. Implemented backpressure circuit breakers on multi-venue Kafka queues.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Infrastructure & Artifact registry index */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[48px] p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-1">Deployment Registries</h3>
                  <p className="text-xs text-slate-400 mb-6">Secured Docker image indices and Kubernetes Helm chart downloads.</p>
                  
                  <div className="space-y-4">
                    {/* Docker tags */}
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">Docker Image Registries</span>
                      <div className="space-y-1.5 mt-2 font-mono text-[9px] text-slate-500">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span>registry.flux-mios.com/flux/intake:v2.0.0</span>
                          <span className="text-orange-500 font-bold select-all">COPY</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span>registry.flux-mios.com/flux/analytics:v2.0.0</span>
                          <span className="text-orange-500 font-bold select-all">COPY</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span>registry.flux-mios.com/flux/insights:v2.0.0</span>
                          <span className="text-orange-500 font-bold select-all">COPY</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span>registry.flux-mios.com/flux/control-plane:v2.0.0</span>
                          <span className="text-orange-500 font-bold select-all">COPY</span>
                        </div>
                      </div>
                    </div>

                    {/* Helm Chart */}
                    <div className="pt-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">Helm Chart</span>
                      <a 
                        href="https://charts.flux-mios.com/flux-mios-2.0.0.tgz"
                        onClick={(e) => { e.preventDefault(); alert('Downloading flux-mios-2.0.0.tgz helm chart deployment bundle.'); }}
                        className="mt-2 flex items-center justify-between p-4.5 bg-[#00AEEF]/5 hover:bg-[#00AEEF]/10 text-[#00AEEF] rounded-2xl border border-blue-500/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                          <div className="text-left">
                            <span className="block text-xs font-black uppercase">flux-mios-2.0.0.tgz</span>
                            <span className="block text-[8px] font-mono text-slate-400">MD5: de89a3f2b1d0342cb412a809f</span>
                          </div>
                        </div>
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Call to action for cluster deployment */}
                <div className="pt-6 border-t border-slate-50 dark:border-slate-900/60 mt-8">
                  <button 
                    onClick={() => {
                      alert('Deploying Flux MIOS v2.0.0 Helm Chart directly to production Kubernetes cluster...');
                      const now = new Date();
                      const log: TelemetryLog = {
                        id: Math.random().toString(),
                        timestamp: now.toTimeString().split(' ')[0],
                        node: 'Flux Control Plane',
                        type: 'warn',
                        message: 'Kubernetes deployment rolling update triggered: v2.0.0.'
                      };
                      setLogs(prev => [...prev, log]);
                    }}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    Deploy Helm Chart to Production Cluster
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
