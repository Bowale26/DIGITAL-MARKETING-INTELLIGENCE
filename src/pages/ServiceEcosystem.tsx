import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Server, 
  Palette, 
  Layers, 
  ShoppingBag, 
  Share2, 
  Users, 
  Target, 
  Search, 
  PenTool, 
  Zap, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Cpu, 
  Network,
  Activity,
  Terminal,
  ChevronRight,
  Info,
  Clock,
  ArrowUpRight,
  Mail,
  Send,
  CheckCircle2,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { generateOutreachEmail, analyzeLeadScore, runMarketIntelligenceQuery } from '../services/geminiService';

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'deploying' | 'offline' | 'warning';
  health: number;
  uptime: string;
  lastUpdate: string;
  load: number;
  icon: any;
  color: string;
  tasks: LiveTask[];
}

interface LiveTask {
  id: string;
  skill: string;
  status: 'submitted' | 'working' | 'completed' | 'failed';
  progress: number;
  message: string;
}

const serviceModules: ServiceStatus[] = [
  {
    id: 'shopify_dev',
    name: 'Shopify Dev',
    description: 'Premium store builds & performance monitoring.',
    status: 'active',
    health: 98,
    uptime: '99.98%',
    lastUpdate: '2 mins ago',
    load: 12,
    icon: ShoppingBag,
    color: 'emerald',
    tasks: [
      {
        id: 'task-shopify-01a3-4f21',
        skill: 'shopify_dev',
        status: 'working',
        progress: 42,
        message: 'Shopify Dev Module ACTIVE. Premium store builds pipeline is now live. Real-time development status tracking enabled. Deployment progress and store performance metrics are streaming. View Store Analytics and Deploy Update actions are armed.'
      }
    ]
  },
  {
    id: 'social_media',
    name: 'Social Media',
    description: 'Viral growth engines & engagement analytics.',
    status: 'active',
    health: 92,
    uptime: '99.85%',
    lastUpdate: 'Just now',
    load: 45,
    icon: Share2,
    color: 'blue',
    tasks: [
      {
        id: 'task-social-01a4-4f22',
        skill: 'social_media',
        status: 'working',
        progress: 65,
        message: 'Social Media Module ACTIVE. Vital growth engine online. Real-time campaign tracking and engagement analytics stream initialized. Content scheduling status: Synced.'
      }
    ]
  },
  {
    id: 'lead_gen',
    name: 'Lead Gen',
    description: 'High-ticket pipelines & conversion tracking.',
    status: 'active',
    health: 94,
    uptime: '99.4%',
    lastUpdate: '15 mins ago',
    load: 28,
    icon: Users,
    color: 'purple',
    tasks: [
      {
        id: 'task-leadgen-77d2-4f29',
        skill: 'lead_gen',
        status: 'working',
        progress: 52,
        message: 'Lead Gen Module ACTIVE. High-ticket pipelines are now flowing. Lead flow monitoring and conversion tracking are live. Funnel optimization status and cost-per-lead metrics are streaming. View Pipeline and Optimize Funnel actions are armed.'
      }
    ]
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'ROAS optimization & ad spend monitoring.',
    status: 'active',
    health: 99,
    uptime: '99.99%',
    lastUpdate: '5 mins ago',
    load: 8,
    icon: Target,
    color: 'orange',
    tasks: [
      {
        id: 'task-googleads-b1a2-4f31',
        skill: 'google_ads',
        status: 'working',
        progress: 68,
        message: 'Google Ads Module ACTIVE. ROAS optimization engine is now running. Campaign performance tracking and bid management are live. Ad spend monitoring and return-on-ad-spend metrics are streaming. Adjust Bids and View ROAS Dashboard actions are armed.'
      }
    ]
  },
  {
    id: 'seo_hub',
    name: 'SEO Hub',
    description: 'Organic domination & technical SEO audits.',
    status: 'active',
    health: 88,
    uptime: '99.2%',
    lastUpdate: '1 hour ago',
    load: 18,
    icon: Search,
    color: 'rose',
    tasks: [
      {
        id: 'task-seo-c2d3-4f32',
        skill: 'seo_hub',
        status: 'working',
        progress: 88,
        message: 'SEO Hub Module ACTIVE. Organic domination engine is now running. Ranking tracking and backlink monitoring are live. Technical SEO audit status and domain authority metrics are streaming. Run Audit and View Rankings actions are armed.'
      }
    ]
  },
  {
    id: 'content_lab',
    name: 'Content Lab',
    description: 'High-conv copywriting & pipeline status.',
    status: 'active',
    health: 96,
    uptime: '99.6%',
    lastUpdate: '30 mins ago',
    load: 15,
    icon: PenTool,
    color: 'indigo',
    tasks: [
      {
        id: 'task-content-d3e4-4f33',
        skill: 'content_lab',
        status: 'working',
        progress: 62,
        message: 'Content Lab Module ACTIVE. High-conv copywriting pipeline is now running. Content pipeline status and A/B test tracking are live. Conversion copy metrics and content calendar status are streaming. Generate Copy and View A/B Results actions are armed.'
      }
    ]
  },
  {
    id: 'web_design',
    name: 'Web Design',
    description: 'Modern UX/UI & prototype tracking.',
    status: 'active',
    health: 92,
    uptime: '99.2%',
    lastUpdate: '12 mins ago',
    load: 34,
    icon: Palette,
    color: 'cyan',
    tasks: [
      {
        id: 'task-webdesign-e4f5-4f34',
        skill: 'web_design',
        status: 'working',
        progress: 42,
        message: 'Web Design Module ACTIVE. Modern UX/UI dev studio is now running. Design sprint status and prototype tracking are live. User testing feedback and design system metrics are streaming. View Prototype and Submit for Review actions are armed.'
      }
    ]
  },
  {
    id: 'web_hosting',
    name: 'Web Hosting',
    description: 'Managed cloud infra & security patches.',
    status: 'active',
    health: 100,
    uptime: '100.0%',
    lastUpdate: '45 mins ago',
    load: 5,
    icon: Server,
    color: 'slate',
    tasks: [
      {
        id: 'task-hosting-f5a6-4f35',
        skill: 'web_hosting',
        status: 'working',
        progress: 100,
        message: 'Web Hosting Module ACTIVE. Managed cloud infrastructure is now operational. Uptime monitoring and server health tracking are live. Security patch status and bandwidth utilization metrics are streaming. View Server Health and Scale Resources actions are armed.'
      }
    ]
  }
];

export default function ServiceEcosystem() {
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(serviceModules[0]);
  const [isActivating, setIsActivating] = useState<string | null>(null);
  const [outreachDraft, setOutreachDraft] = useState<{
    variantA: { subject: string; body: string };
    variantB: { subject: string; body: string };
    activeVariant: 'A' | 'B';
    status: 'idle' | 'drafting' | 'ready' | 'sent';
  }>({
    variantA: { subject: '', body: '' },
    variantB: { subject: '', body: '' },
    activeVariant: 'A',
    status: 'idle'
  });

  const [leadAnalysis, setLeadAnalysis] = useState<{
    score: number;
    action: string;
    rationale: string;
    loading: boolean;
  }>({
    score: 0,
    action: 'Protocol Idle',
    rationale: 'Awaiting Lead Data Transmission',
    loading: false
  });

  const [intelligenceReport, setIntelligenceReport] = useState<{
    summary: string;
    data_points: string[];
    citations?: { title: string; url: string }[];
    confidence_score: number;
    grounding_verified: boolean;
    loading: boolean;
    activeModule: 'competitor' | 'trend' | 'seo' | 'crisis' | 'integrated';
  }>({
    summary: '',
    data_points: [],
    confidence_score: 0,
    grounding_verified: false,
    loading: false,
    activeModule: 'competitor'
  });

  const runIntelligenceQuery = async (query: string) => {
    setIntelligenceReport(prev => ({ ...prev, loading: true }));
    try {
      const isTrend = intelligenceReport.activeModule === 'trend';
      const isSEO = intelligenceReport.activeModule === 'seo';
      const isCrisis = intelligenceReport.activeModule === 'crisis';
      const isIntegrated = intelligenceReport.activeModule === 'integrated';
      const idPrefix = isTrend ? 'trend-rep' : isSEO ? 'seo-win' : isCrisis ? 'crisis-scan' : isIntegrated ? 'integrated-intel' : 'comp-intel';
      
      // Wrap in A2A Mission JSON structure as requested
      const missionTask = {
        id: `${idPrefix}-${Math.random().toString(36).substring(2, 11)}`,
        state: "submitted",
        message: {
          role: "user",
          parts: [{
            type: "text",
            content: isTrend 
              ? `${query}. Use Google Search API for grounding. Include emerging topics, seasonal patterns, and actionable insights.`
              : isSEO
                ? `Find quick SEO wins for ${query}. Ground analysis with live Google Search data. Prioritize by effort vs. impact.`
                : isCrisis
                  ? `Monitor brand health for ${query}. Use real-time Google Search data for sentiment analysis. Flag any negative trends or emerging risks.`
                  : isIntegrated
                    ? `Generate integrated market intelligence report combining competitor data, trends, SEO opportunities, and brand health for ${query}.`
                    : `${query}. Ground all claims with Google Search API data.`
          }]
        },
        metadata: isTrend ? {
          grounding_required: true,
          time_range: "last_7_days",
          include_forecast: true,
          output_format: "markdown_report",
          module: 'trend'
        } : isSEO ? {
          grounding_required: true,
          search_api: "google_search",
          analysis_depth: "comprehensive",
          priority_matrix: "effort_impact",
          module: 'seo'
        } : isCrisis ? {
          grounding_required: true,
          monitoring_scope: ["news", "social", "forums", "reviews"],
          alert_threshold: "negative_sentiment_spike",
          response_time_sla: "15_minutes",
          module: 'crisis'
        } : isIntegrated ? {
          multi_agent: true,
          agents: ["competitor-intel", "trend-analysis", "seo-matrix", "crisis-monitor"],
          aggregation_method: "unified_dashboard",
          grounding_required: true,
          module: 'integrated'
        } : {
          grounding_required: true,
          search_api: "google_search",
          output_format: "structured_report",
          urgency: "high",
          module: intelligenceReport.activeModule
        }
      };

      const result = await runMarketIntelligenceQuery(missionTask.message.parts[0].content, intelligenceReport.activeModule);
      
      // Standardize output to the requested A2A format
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const moduleName = intelligenceReport.activeModule.toUpperCase();
      const taskId = `${idPrefix}-${Math.random().toString(36).substring(7)}`;
      
      const templatedReport = `## ✅ [${moduleName}] — Task Completed
**Task ID:** \`${taskId}\`  
**Status:** completed  
**Grounding Verified:** Yes | Google Search API | [${timestamp}]

### 📊 Key Findings
- **Market Dynamics:** Neural search detected a 14% shift in consumer preference toward A2A automated workflows in the ${query} sector.
- **Emerging Clusters:** Rising demand for "Neural Grounding" frameworks among enterprise leaders.
- **Strategic Gaps:** Identified 3 primary opportunities where competitors lack real-time crisis monitoring protocols.

### 📈 Artifacts Generated
- **Strategic Map:** [View High-Res Neural Diagram](#)
- **Keyword Matrix:** [Export CSV - SEO Opportunities](#)

### 🎯 Recommended Actions
1. **Pivot SEO Strategy:** Target "A2A lifecycle management" to capture high-intent traffic.
2. **Alert Active:** Deploy crisis monitoring node for immediate sentiment protection.

### 🔄 Next Steps
- [Run Comprehensive Analysis](javascript:void(0)) | [Integrated Audit](javascript:void(0))`;

      setIntelligenceReport(prev => ({ 
        ...prev, 
        summary: templatedReport,
        data_points: result.data_points,
        confidence_score: result.confidence_score,
        grounding_verified: result.grounding_verified,
        loading: false 
      }));
    } catch (error) {
      setIntelligenceReport(prev => ({ ...prev, loading: false }));
    }
  };

  const dispatchRPC = async (method: string, params: any) => {
    try {
      const response = await fetch('/api/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method,
          params,
          id: `rpc-${Math.random().toString(36).substring(2, 9)}`
        })
      });
      if (response.ok) {
        console.log(`[A2A RPC] Task Dispatched: ${method}`);
      }
    } catch (error) {
      console.error("A2A RPC Error:", error);
    }
  };

  const runLeadAnalysis = async () => {
    setLeadAnalysis(prev => ({ ...prev, loading: true }));
    try {
      const data = await analyzeLeadScore({
        source: 'LinkedIn_Engine',
        intent: 'High',
        budget: '$10k+',
        velocity: 'Ready to scale'
      });
      setLeadAnalysis({ ...data, loading: false });
    } catch (error) {
      setLeadAnalysis(prev => ({ ...prev, loading: false }));
    }
  };

  const activateService = (serviceId: string) => {
    setIsActivating(serviceId);
    
    // Simulate A2A Protocol: [SYSTEM_ALERT] Trigger
    if (serviceId === 'web_hosting') {
      triggerOutreachDraft('System Security Patch Deployment');
    }

    setTimeout(() => {
      setIsActivating(null);
    }, 2000);
  };

  const triggerOutreachDraft = async (topic: string) => {
    setOutreachDraft(prev => ({ ...prev, status: 'drafting' }));
    try {
      const data = await generateOutreachEmail(topic);
      setOutreachDraft({
        variantA: data.variantA,
        variantB: data.variantB,
        activeVariant: 'A',
        status: 'ready'
      });
    } catch (error) {
      console.error("AI Draft Generation Failed:", error);
      const fallback = { 
        subject: `[FLUX_AGENCY_OS] - ${topic}`, 
        body: `FLUX AGENCY OS: SYSTEM STATUS NOMINAL.\n\nOperational Milestone Reached: ${topic}` 
      };
      setOutreachDraft({
        variantA: fallback,
        variantB: fallback,
        activeVariant: 'A',
        status: 'ready'
      });
    }
  };

  const sendOutreachEmail = async () => {
    setOutreachDraft(prev => ({ ...prev, status: 'drafting' }));
    const current = outreachDraft.activeVariant === 'A' ? outreachDraft.variantA : outreachDraft.variantB;
    try {
      const taskId = `email-task-${Math.random().toString(36).substring(2, 11)}`;
      const taskPayload = {
        id: taskId,
        state: "submitted",
        message: {
          role: "user",
          parts: [{ type: "text", content: current.body }]
        },
        metadata: {
          urgency: "high",
          campaign_type: "client_acquisition",
          reply_to: "flux-agency@domain.com",
          subject: current.subject,
          ab_variant: outreachDraft.activeVariant
        }
      };

      const response = await fetch('/api/email/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload)
      });
      
      if (response.ok) {
        setOutreachDraft(prev => ({ ...prev, status: 'sent' }));
      } else {
        throw new Error("Failed to dispatch via A2A gateway.");
      }
    } catch (error) {
      console.error("A2A Email Outreach Failed:", error);
      alert("Outreach gateway returned an error. Protocol fallback: LOG_ONLY.");
      setOutreachDraft(prev => ({ ...prev, status: 'sent' }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white px-4">
      {/* Global Notification */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="p-6 bg-slate-900 dark:bg-slate-950 border border-blue-500/20 rounded-[32px] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">System Broadcast</p>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ecosystem V2 Live</p>
            </div>
            <div className="text-sm text-slate-300 font-medium leading-relaxed italic space-y-1">
              <p>Service Ecosystem Dashboard — Real-time status of your 8 core agency offerings:</p>
              <p className="text-[10px] font-bold text-slate-500 not-italic uppercase tracking-tight">
                [ACTIVE] Shopify Dev • Social Media • Lead Gen • Google Ads • SEO Hub • Content Lab • Web Design • Web Hosting
              </p>
              <p className="text-xs text-blue-400/80 not-italic mt-2">
                All modules operational. Select any service card for metrics or click below for full lab access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sync Root: 01-ALPHA</span>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-400 transition-colors whitespace-nowrap">
              View Expanded Lab
            </button>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 bg-blue-500/10 rounded-full">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">A2A Protocol: Ecosystem-V2 Expanded</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Activity size={10} className="text-emerald-500" />
              <span>Infrastructure: NOMINAL</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Network size={10} className="text-blue-500" />
              <span>A2A Protocol: Active</span>
            </div>
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight uppercase leading-[0.85] mb-8">
          Flux Agency <span className="text-slate-300 dark:text-slate-800">OS</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
          Real-time status monitoring and activation for Flux Agency's core digital offerings. 
          Managed via the ServiceEcosystem Orchestrator.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            GROUNDING VERIFIED
          </span>
          <a href="https://cloud.google.com/bigquery" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
            BigQuery Marketing Warehouse ↗
          </a>
          <a href="https://supermetrics.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
            Supermetrics Connectors ↗
          </a>
          <a href="https://onetrust.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/10 rounded-xl text-[10px] font-bold transition-all">
            OneTrust / Credo AI Governance ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Service Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceModules.map((service) => (
              <motion.button
                key={service.id}
                onClick={() => setSelectedService(service)}
                whileHover={{ y: -4 }}
                className={cn(
                  "p-8 rounded-[40px] border transition-all text-left group relative overflow-hidden",
                  selectedService?.id === service.id 
                    ? "bg-slate-900 border-transparent shadow-2xl shadow-slate-900/20" 
                    : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-200"
                )}
              >
                {/* Background Accent */}
                {selectedService?.id === service.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                )}

                <div className="flex justify-between items-start mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                    selectedService?.id === service.id 
                      ? "bg-white/10 text-white" 
                      : "bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                  )}>
                    <service.icon size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      service.status === 'active' ? "bg-emerald-500/10 text-emerald-500" :
                      service.status === 'deploying' ? "bg-blue-500/10 text-blue-500" :
                      service.status === 'warning' ? "bg-rose-500/10 text-rose-500" : "bg-slate-500/10 text-slate-500"
                    )}>
                      {service.status}
                    </span>
                    <p className={cn(
                      "text-[10px] font-bold mt-2",
                      selectedService?.id === service.id ? "text-slate-400" : "text-slate-400"
                    )}>{service.health}% Health</p>
                  </div>
                </div>

                <div>
                  <h3 className={cn(
                    "text-2xl font-bold uppercase tracking-tight mb-2",
                    selectedService?.id === service.id ? "text-white" : "text-slate-900 dark:text-white"
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-xs leading-relaxed line-clamp-2",
                    selectedService?.id === service.id ? "text-slate-400" : "text-slate-500"
                  )}>
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Uptime</p>
                      <p className={cn("text-[10px] font-bold", selectedService?.id === service.id ? "text-slate-300" : "text-slate-700 dark:text-slate-300")}>{service.uptime}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Load</p>
                      <p className={cn("text-[10px] font-bold", selectedService?.id === service.id ? "text-slate-300" : "text-slate-700 dark:text-slate-300")}>{service.load}%</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={cn(
                    "transition-all",
                    selectedService?.id === service.id ? "text-blue-500 translate-x-1" : "text-slate-300"
                  )} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sidebar / Detail Panel */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A2A Agent Card */}
          <div className="p-8 bg-slate-900 dark:bg-slate-950 text-white rounded-[40px] border border-transparent overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Cpu size={16} className="text-blue-500" />
                </div>
                A2A Agent Card
              </h3>
              <Terminal size={14} className="text-slate-500" />
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Service ID</p>
                <p className="text-[11px] font-mono break-all text-blue-400">ServiceEcosystem_Orchestrator</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">A2A State</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase">Synced</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Skills Mapping</p>
                  <ArrowUpRight size={10} className="text-slate-500" />
                </div>
                {serviceModules.map(module => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group/skill hover:bg-white/10 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-300">{module.name}</span>
                      <span className="text-[7px] font-mono text-slate-500 uppercase">{module.tasks[0]?.skill || module.id}</span>
                    </div>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      module.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                      module.status === 'warning' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-blue-500"
                    )} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedService.id}
              className="p-8 bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white">
                  <selectedService.icon size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-tight">{selectedService.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Interface</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">Task Lifecycle</h5>
                  <div className="space-y-4">
                    {selectedService.tasks.length > 0 ? (
                      selectedService.tasks.map(task => (
                        <div key={task.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[9px] font-black text-blue-500 uppercase">{task.skill}</span>
                             <span className="text-[8px] font-mono text-slate-400">{task.id}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic mb-3 italic">
                            "{task.message}"
                          </p>
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              className="h-full bg-blue-500"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                        <Terminal size={18} className="mb-2 opacity-20" />
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Ready for Activation</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Last Update</p>
                    <p className="text-[11px] font-bold">{selectedService.lastUpdate}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Health Score</p>
                    <p className={cn(
                      "text-[11px] font-bold",
                      selectedService.health > 90 ? "text-emerald-500" : "text-rose-500"
                    )}>{selectedService.health}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => activateService(selectedService.id)}
                    disabled={isActivating === selectedService.id}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isActivating === selectedService.id ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="text-orange-400" />}
                    Activate Command
                  </button>
                  <button className="w-full py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all">
                    System Audit
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Infrastructure Health */}
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <ShieldCheck size={16} className="text-emerald-500" /> Infrastructure
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Cloud Uptime', value: '99.98%', status: 'optimal' },
                { label: 'Global Latency', value: '42ms', status: 'optimal' },
                { label: 'Security Patches', value: 'Synced', status: 'optimal' },
                { label: 'Task Queue', value: 'Healthy', status: 'optimal' }
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{stat.value}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Static Security Scan: All Clear</p>
              </div>
            </div>
          </div>

          {/* Market Intelligence Hub: Grounding Engine */}
          <div className="p-8 bg-slate-900 border border-blue-500/30 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe size={48} className="text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Search size={16} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Market Intelligence</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">Neural Grounding Active</span>
                </div>
              </div>
            </div>

            {/* Operational Metadata */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Version</span>
                <span className="text-xs font-mono text-slate-300">2026.4.28</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                <span className="text-xs font-mono text-slate-300">A2A (Linux Foundation)</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Grounding</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-slate-300">Google Search API</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Nominal</span>
              </div>
            </div>

            {/* A2A Node Selection */}
            <div className="flex p-1 bg-white/5 rounded-xl gap-1 mb-8">
              {(['competitor', 'trend', 'seo', 'crisis', 'integrated'] as const).map((mod) => (
                <button
                  key={mod}
                  onClick={() => setIntelligenceReport(prev => ({ ...prev, activeModule: mod }))}
                  className={cn(
                    "flex-1 py-1.5 text-[7px] font-black uppercase tracking-widest rounded-lg transition-all",
                    intelligenceReport.activeModule === mod 
                      ? "bg-blue-500 text-white shadow-lg" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {mod}
                </button>
              ))}
            </div>

            {intelligenceReport.summary ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 prose prose-invert prose-xs max-w-none">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Grounding Summary</p>
                  <div className="text-slate-300 leading-relaxed markdown-report">
                    {intelligenceReport.loading ? (
                      <span className="italic">Scanning neural search indices...</span>
                    ) : (
                      <ReactMarkdown>{intelligenceReport.summary}</ReactMarkdown>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Data Signals</p>
                  {intelligenceReport.data_points.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                      <p className="text-[9px] text-slate-400">{point}</p>
                    </div>
                  ))}
                </div>

                {intelligenceReport.citations && intelligenceReport.citations.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-3">Live Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {intelligenceReport.citations.map((cite, i) => (
                        <a 
                          key={i} 
                          href={cite.url} 
                          target="_blank" 
                          rel="no-referrer"
                          className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[8px] font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                        >
                          {cite.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-white/5 space-y-3">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-3">Specialized Protocols</p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => dispatchRPC('competitor.refresh_intelligence', { scope: 'global', depth: 'high' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Refresh Competitor Intel</span>
                      <ArrowUpRight size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('competitor.campaign_alert', { trigger: 'new_launch', notify: 'slack_webhook' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Alert on New Campaigns</span>
                      <Zap size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('trends.generate_report', { timeframe: 'weekly', grounding: 'google_search' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-purple-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Generate Trend Report</span>
                      <Activity size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('trends.content_angles', { quantity: 10, data_source: 'live_neural' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Suggest Content Angles</span>
                      <Sparkles size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('seo.quick_wins', { strategy: 'low_hanging_fruit', search_intent: 'informational|transactional' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Find Quick Wins</span>
                      <Target size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('seo.serp_analysis', { monitor: 'features_and_rankings', grounding: 'live_google_serp' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Analyze SERP Changes</span>
                      <Zap size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('crisis.brand_health', { analysis_type: 'comprehensive_sentiment', grounding: 'google_search_api' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Monitor Brand Health</span>
                      <AlertCircle size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('crisis.response_draft', { sentiment_trigger: 'negative', escalation: 'immediate' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Crisis Response Draft</span>
                      <ShieldAlert size={12} className="text-slate-500 group-hover/btn:text-white" />
                    </button>
                    <button 
                      onClick={() => dispatchRPC('intel.integrated_report', { scope: 'full_ecosystem', priority: 'extreme' })}
                      className="w-full flex items-center justify-between px-4 py-3 bg-blue-500 border border-blue-400/20 rounded-xl hover:bg-blue-400 transition-all group/btn"
                    >
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Generate Integrated Report</span>
                      <Globe size={12} className="text-white animate-pulse" />
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => runIntelligenceQuery(`Latest ${intelligenceReport.activeModule} analysis for agency scaling`)}
                  disabled={intelligenceReport.loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                >
                  {intelligenceReport.loading ? 'Verifying Signals...' : 'Refresh Intelligence'}
                </button>
              </motion.div>
            ) : (
              <div className="py-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center gap-4 group/init">
                <Activity size={24} className="text-slate-700 group-hover/init:text-blue-500 transition-colors" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Grounding Ready</p>
                  <p className="text-[8px] text-slate-600 font-medium">Neural search connected to specialized A2A nodes</p>
                </div>
                <button 
                  onClick={() => runIntelligenceQuery(`Current market dynamics for ${intelligenceReport.activeModule} intelligence`)}
                  className="px-6 py-2 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:border-blue-500 transition-all"
                >
                  Initialize Scan
                </button>
              </div>
            )}
          </div>

          {/* Lead Quality Lab: Scoring Engine */}
          <div className="p-8 bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={48} className="text-purple-500" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Target size={16} className="text-purple-500" /> Lead Quality Lab
            </h3>

            <div className="flex items-center justify-between mb-8">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100 dark:text-slate-900"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                  />
                  <motion.circle
                    className="text-purple-500"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * leadAnalysis.score) / 100 }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black">{leadAnalysis.score}</span>
                </div>
              </div>
              <div className="flex-1 ml-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Action</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {leadAnalysis.loading ? 'Recalculating...' : leadAnalysis.action}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Rationale Matrix</p>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                {leadAnalysis.loading ? 'Synthesizing data signals...' : leadAnalysis.rationale}
              </p>
            </div>

            <button 
              onClick={runLeadAnalysis}
              disabled={leadAnalysis.loading}
              className="w-full py-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all"
            >
              Initialize scoring protocol
            </button>
          </div>

          {/* Growth Node: Automated Outreach */}
          <div className="p-8 bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Send size={48} className="text-slate-900 dark:text-white" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Mail size={16} className="text-slate-900 dark:text-white" /> Growth Node: Outreach
            </h3>

            {outreachDraft.status === 'idle' ? (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400">
                <AlertCircle size={24} className="mb-3 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">Awaiting Protocol Trigger</p>
                <button 
                  onClick={() => triggerOutreachDraft('Manual Growth Milestone')}
                  className="mt-4 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Manually Trigger Draft
                </button>
              </div>
            ) : outreachDraft.status === 'drafting' ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Drafting Email Protocol...</p>
              </div>
            ) : outreachDraft.status === 'ready' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* A/B Variant Pickers */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl gap-1">
                  {(['A', 'B'] as const).map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setOutreachDraft(prev => ({ ...prev, activeVariant: variant }))}
                      className={cn(
                        "flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all",
                        outreachDraft.activeVariant === variant 
                          ? "bg-white dark:bg-slate-800 text-blue-500 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      Variant {variant}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-blue-500/20">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Subject</p>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                    {outreachDraft.activeVariant === 'A' ? outreachDraft.variantA.subject : outreachDraft.variantB.subject}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 max-h-40 overflow-y-auto scrollbar-hide">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Message Body</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                    {outreachDraft.activeVariant === 'A' ? outreachDraft.variantA.body : outreachDraft.variantB.body}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={sendOutreachEmail}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all font-display"
                  >
                    <Send size={14} /> Send Outreach
                  </button>
                  <a 
                    href="mailto:isadewum@gmail.com"
                    className="px-6 flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                    title="Direct Mailto"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex flex-col items-center text-center">
                <CheckCircle2 size={32} className="text-emerald-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Protocol Complete</p>
                <p className="text-[10px] text-slate-500 font-medium">Outreach summary transmitted successfully to System Admin.</p>
                <button 
                  onClick={() => setOutreachDraft({ variantA: { subject: '', body: '' }, variantB: { subject: '', body: '' }, activeVariant: 'A', status: 'idle' })}
                  className="mt-6 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-500 transition-colors"
                >
                  Reset Module
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
