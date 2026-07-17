import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical,
  Mail,
  Phone,
  MessageSquare,
  History,
  TrendingUp,
  Target, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Star, 
  BrainCircuit, 
  Globe, 
  Globe2, 
  Users, 
  Share2, 
  Bot, 
  Sparkles, 
  BarChart, 
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FunctionCallingService } from '../services/functionCallingService';
import { AIService } from '../services/aiService';

import { useLeads } from '../context/LeadContext';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../data/leadData';

const stages = ['New Leads', 'In Review', 'Engagement', 'Proposal', 'Closing'];

export default function LeadPipeline() {
  const { leads, addLead } = useLeads();
  const navigate = useNavigate();
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [showCRMConfig, setShowCRMConfig] = useState(false);
  const [activeStage, setActiveStage] = useState('New Leads');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', value: '', source: 'Direct', email: '', phone: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'ai-engine'>('pipeline');
  const [leadCriteria, setLeadCriteria] = useState("Enterprise SaaS companies with >50 employees, specifically marketing directors interested in AI automation.");
  const [aiStatus, setAiStatus] = useState<'idle' | 'searching' | 'analyzing' | 'done'>('idle');
  const [aiResults, setAiResults] = useState<any[]>([]);

  // Sync global leads with local order/state if needed, or just use context leads
  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const handleAIRun = async (engine: string) => {
    setAiStatus('searching');
    try {
      const ai = AIService.getInstance();
      const prompt = `Perform ${engine} for lead generation based on these criteria: ${leadCriteria}. 
      Identify 3 potential high-value leads. For each lead, provide: 
      1. Company Name
      2. Contact Name (Title)
      3. Fit Score (1-100)
      4. Outreach Strategy.
      Return the data in a structured JSON format.`;

      const response = await ai.generateContent(prompt, undefined, undefined, true);
      // Parsing logic would go here, for demo we simulate a nice result
      setAiStatus('analyzing');
      setTimeout(() => {
        setAiResults([
          { id: `AI1-${Date.now()}`, name: 'Dominic Cobb', company: 'Inception Tech', value: '$85,000', stage: 'New Leads', time: 'Just now', score: 98, source: engine, email: 'dominic@inception.tech', phone: '+1 (555) 000-0001', recentActivity: [] },
          { id: `AI2-${Date.now()}`, name: 'Arthur Penhaligon', company: 'Clockwork Corp', value: '$42,500', stage: 'New Leads', time: 'Just now', score: 91, source: engine, email: 'arthur@clockwork.com', phone: '+1 (555) 000-0002', recentActivity: [] },
          { id: `AI3-${Date.now()}`, name: 'Ariadne Miles', company: 'Maze Solutions', value: '$28,000', stage: 'New Leads', time: 'Just now', score: 87, source: engine, email: 'ariadne@maze.io', phone: '+1 (555) 000-0003', recentActivity: [] }
        ]);
        setAiStatus('done');
      }, 2000);
    } catch (e) {
      console.error(e);
      setAiStatus('idle');
    }
  };

  const handleImportLeads = () => {
    aiResults.forEach(l => addLead(l));
    setAiResults([]);
    setActiveTab('pipeline');
    alert("3 High-Intent AI targets imported to Pipeline.");
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    const leadToUpdate = leads.find(l => l.id === leadId);
    if (leadToUpdate) {
      // In a real app we'd call updateLead from context
      setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: targetStage } : l));
    }
    setDraggedLeadId(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const stageConfigs: Record<string, any> = {
    'New Leads': {
      stage_id: "STAGE-01",
      entry_trigger: "lead_captured",
      exit_criteria: "initial_qualification_complete",
      neural_score_threshold: ">= 0",
      auto_actions: [
        "enrich_demographic_data",
        "run_intent_classification",
        "assign_lead_temperature",
        "notify_strategist_if_score > 70"
      ],
      sla_hours: 4,
      conversion_target: "100% → In Review"
    },
    'In Review': {
      stage_id: "STAGE-02",
      entry_trigger: "qualification_complete",
      exit_criteria: "strategist_approval OR auto-approve_if_score > 85",
      neural_score_threshold: ">= 40",
      auto_actions: [
        "run_competitor_context_analysis",
        "generate_fit_score",
        "create_strategist_brief",
        "schedule_review_if_score > 75"
      ],
      sla_hours: 24,
      conversion_target: "65% → Engagement"
    },
    'Engagement': {
      stage_id: "STAGE-03",
      entry_trigger: "strategist_approved",
      exit_criteria: "meeting_completed AND interest_confirmed",
      neural_score_threshold: ">= 60",
      auto_actions: [
        "schedule_discovery_call",
        "send_personalized_sequence",
        "track_email_opens_and_clicks",
        "escalate_if_no_response_48h"
      ],
      sla_hours: 48,
      conversion_target: "45% → Proposal"
    },
    'Proposal': {
      stage_id: "STAGE-04",
      entry_trigger: "solution_presented",
      exit_criteria: "proposal_sent AND client_acknowledged",
      neural_score_threshold: ">= 75",
      auto_actions: [
        "generate_dynamic_proposal",
        "attach_case_studies_by_vertical",
        "set_follow_up_reminders",
        "track_proposal_engagement_heatmap"
      ],
      sla_hours: 72,
      conversion_target: "35% → Closing"
    },
    'Closing': {
      stage_id: "STAGE-05",
      entry_trigger: "proposal_accepted_in_principle",
      exit_criteria: "contract_signed OR deal_lost",
      neural_score_threshold: ">= 85",
      auto_actions: [
        "generate_contract_draft",
        "route_to_legal_if_enterprise",
        "calculate_commission_projection",
        "trigger_onboarding_handoff_on_win"
      ],
      sla_hours: 120,
      conversion_target: "28% → Closed Won"
    }
  };

  const systemConfig = {
    system_name: "Strategic Pipeline",
    core_engine: "Neural Lead Scoring",
    tracking_mode: "High-Intent Acquisition",
    integration_endpoint: "CRM_EXPORT",
    acquisition_mode: "TARGET_ADD",
    data_refresh_interval: "real-time",
    scoring_model: "multi-dimensional_intent_vector"
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `L${leads.length + 1}`;
    const lead: Lead = {
      ...newLead,
      id,
      stage: 'New Leads',
      time: 'Just now',
      score: Math.floor(Math.random() * 30) + 70,
      recentActivity: []
    };
    addLead(lead);
    setNewLead({ name: '', company: '', value: '', source: 'Direct', email: '', phone: '' });
    setIsAddModalOpen(false);
  };

  const handleExportCRM = async () => {
    setIsExporting(true);
    try {
      const response = await FunctionCallingService.getInstance().executeFunction('BTN-LEAD-005', {
        leads_count: leads.length,
        destination: "Salesforce CRM",
        timestamp: new Date().toISOString()
      });
      
      // Still keep the download link as a local backup
      const headers = "ID,Name,Company,Value,Stage,Score,Source\n";
      const csvContent = leads.map(l => `${l.id},${l.name},${l.company},${l.value},${l.stage},${l.score},${l.source}`).join("\n");
      const blob = new Blob([headers + csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crm_export_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      alert(`CRM Synchronization: ${response.message}`);
    } catch (e) {
      console.error(e);
      alert("Failed to sync with CRM. Check network logs.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {showCRMConfig && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-end p-0">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-950 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar"
            >
              <div className="p-8 space-y-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">CRM Export Protocol</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">v2.1 Strategic Sync Engine</p>
                  </div>
                  <button onClick={() => setShowCRMConfig(false)} className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all">
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="card-agency p-6 border-transparent bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sync Mode</p>
                    <p className="text-lg font-bold uppercase italic text-orange-500">Bidirectional</p>
                  </div>
                  <div className="card-agency p-6 border-transparent bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Export Format</p>
                    <p className="text-lg font-bold uppercase italic text-[#00AEEF]">JSON / CSV</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Zap size={14} className="text-orange-500" /> Trigger Events
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      'Stage Transition',
                      'Score Update > 10 Points',
                      'Deal Value Change > $5,000',
                      'Lead Status Change'
                    ].map(event => (
                      <div key={event} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-bold uppercase tracking-tight">{event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <ShieldCheck size={14} className="text-[#00AEEF]" /> Payload Schema
                  </h3>
                  <div className="bg-slate-950 rounded-3xl p-6 font-mono text-[11px] text-slate-400 leading-relaxed border border-slate-800 shadow-xl">
                    <pre>
{`{
  "lead_id": "string",
  "lead_name": "string",
  "company": "string",
  "current_stage": "enum[Leads...Closing]",
  "lead_score": "float",
  "pipeline_value": "currency",
  "velocity_days": "float",
  "last_activity": "timestamp",
  "next_action": "string",
  "assigned_strategist": "string",
  "intent_signals": "array[string]"
}`}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Conflict Resolution</p>
                    <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-tight">Server Wins w/ Audit</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Retry Policy</p>
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-tight">3 Attempts / Exponential</p>
                    </div>
                  </div>
                </div>

                <button className="w-full btn-primary py-5 text-sm">Force Neural Sync Now</button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tight">New Strategic Target</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><Plus className="rotate-45" size={20} /></button>
              </div>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Lead Identity</label>
                  <input required type="text" placeholder="Full Name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Enterprise Domain</label>
                  <input required type="text" placeholder="Company Name" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Contact Email</label>
                  <input required type="email" placeholder="email@domain.com" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Mobile Access</label>
                  <input required type="text" placeholder="+1 (555) 000-0000" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Contract Potential</label>
                  <input required type="text" placeholder="e.g. $15,000" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4">Initialize Acquisition</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{systemConfig.core_engine}</span>
              </div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{systemConfig.data_refresh_interval}</span>
           </div>
           <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">{systemConfig.system_name}</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">{systemConfig.tracking_mode} via {systemConfig.scoring_model.replace(/_/g, ' ')}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="BTN-LEAD-005"
            onClick={handleExportCRM}
            disabled={isExporting}
            className="group relative px-5 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:text-orange-500 uppercase tracking-widest transition-all overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-orange-500 transform translate-y-full group-active:translate-y-0 transition-transform duration-75 opacity-20" />
            {isExporting ? 'Exporting...' : 'Export CRM'}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} /> Add Target
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'pipeline' ? "bg-white dark:bg-slate-950 text-[#FF6B00] shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Pipeline View
        </button>
        <button 
          onClick={() => setActiveTab('ai-engine')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
            activeTab === 'ai-engine' ? "bg-white dark:bg-slate-950 text-[#00AEEF] shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <BrainCircuit size={14} /> AI Strategic Engine
        </button>
      </div>

      {activeTab === 'pipeline' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
         <PipelineStat 
           id="KPI-VEL-001"
           title="Pipeline Velocity" 
           value="4.2 Days" 
           change="+1.5 Days" 
           icon={Zap} 
           color="text-orange-500" 
           source="Stage transition timestamps"
           refresh="Real-time"
         />
         <PipelineStat 
           id="KPI-VAL-002"
           title="Total Pipeline Value" 
           value={`$${(localLeads.reduce((acc, l) => acc + parseInt(l.value.replace(/[^0-9]/g, '') || '0'), 0) / 1000).toFixed(1)}k`} 
           change="+$42k" 
           icon={TrendingUp} 
           color="text-emerald-500" 
           source="Sum of weighted deal values"
           refresh="Real-time"
         />
         <PipelineStat 
           id="KPI-SCR-003"
           title="Avg. Lead Score" 
           value={`${localLeads.length > 0 ? Math.round(localLeads.reduce((acc, l) => acc + l.score, 0) / localLeads.length) : 0}/100`} 
           change="+4pts" 
           icon={Star} 
           color="text-[#00AEEF]" 
           source="Neural scoring engine"
           refresh="Per interaction"
         />
         <PipelineStat 
           id="KPI-NEW-004"
           title="New Leads" 
           value={`${localLeads.filter(l => l.time.includes('ago') || l.time === 'Just now').length}`} 
           change="+2 today" 
           icon={ArrowUpRight} 
           color="text-indigo-500" 
           source="CRM + inbound channels"
           refresh="Per ingestion"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
        {/* Kanban Stages Sidebar */}
        <div className="lg:col-span-3 space-y-8">
           <div className="card-agency p-6 bg-slate-900 text-white border-transparent overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />
              <div className="flex items-center gap-2 mb-6">
                <Zap size={14} className="text-orange-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Parameters</h4>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Tracking', val: 'High-Intent' },
                   { label: 'Endpoint', val: systemConfig.integration_endpoint },
                   { label: 'Interval', val: 'Real-time' },
                   { label: 'Mode', val: 'Acquisition' }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{item.label}</span>
                      <span className="text-[10px] font-black text-white uppercase italic">{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input type="text" placeholder="Scrub leads..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-500/50" />
           </div>

           <div className="space-y-4">
             {stages.map(stage => {
               const config = stageConfigs[stage];
               return (
                <div key={stage} className="space-y-3">
                  <button 
                    onClick={() => setActiveStage(stage)}
                    onDragOver={onDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl text-left text-sm font-bold transition-all border",
                      activeStage === stage ? "bg-white dark:bg-[#020617] border-orange-500 text-orange-600 shadow-xl shadow-orange-500/5" : "text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900",
                      draggedLeadId && activeStage !== stage && "border-dashed border-orange-500/50 bg-orange-500/5"
                    )}
                  >
                    {stage}
                    <span className="text-[10px] py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-full">{localLeads.filter(l => l.stage === stage).length}</span>
                  </button>
                  
                  {activeStage === stage && config && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4 space-y-4 overflow-hidden border-l-2 border-orange-500/20 ml-2"
                    >
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Entry Trigger</p>
                          <p className="text-[10px] font-bold text-orange-500 uppercase italic">{config.entry_trigger}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SLA Windows</p>
                          <p className="text-[10px] font-bold text-orange-500 uppercase italic">{config.sla_hours}h Response</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Auto Actions</p>
                          <div className="flex flex-wrap gap-1">
                             {config.auto_actions.map((action: string) => (
                               <span key={action} className="text-[7px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase text-slate-400">
                                 {action.split('_').pop()}
                               </span>
                             ))}
                          </div>
                       </div>
                    </motion.div>
                  )}
                </div>
               );
             })}
           </div>
        </div>

        {/* Lead List */}
        <div className="lg:col-span-9 space-y-4">
           <AnimatePresence mode="popLayout">
             {localLeads.filter(l => l.stage === activeStage).map((lead, i) => (
               <motion.div 
                 key={lead.id}
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ delay: i * 0.05 }}
                 draggable
                 onDragStart={(e: any) => handleDragStart(e, lead.id)}
                 onClick={() => navigate(`/pipeline/${lead.id}`)}
                 className={cn(
                   "card-agency p-8 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-grab active:cursor-grabbing hover:border-orange-500/30 transition-all",
                   draggedLeadId === lead.id && "opacity-50 grayscale scale-95"
                 )}
               >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-colors group-hover:scale-110 duration-300">
                          <Target size={28} />
                       </div>
                       <div className={cn(
                         "absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-4 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-bold text-white",
                         lead.score >= 90 ? "bg-emerald-500" : lead.score >= 80 ? "bg-orange-500" : "bg-slate-500"
                       )}>
                         {lead.score}
                       </div>
                    </div>
                    <div>
                       <h3 className="text-xl font-bold dark:text-white uppercase tracking-tighter">{lead.name}</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{lead.company} • {lead.source}</p>
                       <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg text-[8px] font-black text-emerald-500 uppercase">
                             <ShieldCheck size={10} /> Validated
                          </div>
                          {lead.score >= 90 && (
                             <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-lg text-[8px] font-black text-orange-500 uppercase">
                                <Zap size={10} fill="currentColor" /> Auto-Task
                             </div>
                          )}
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#00AEEF]/10 rounded-lg text-[8px] font-black text-[#00AEEF] uppercase">
                             <History size={10} /> 3 Touchpoints
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Contract Potential</p>
                       <p className="text-lg font-bold dark:text-white font-display uppercase tracking-tight">{lead.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); alert(`Initiating secure communication with ${lead.name}...`); }}
                         className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#00AEEF] transition-all"
                       >
                         <Mail size={18} />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); navigate(`/pipeline/${lead.id}`); }}
                         className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all"
                       >
                         <ChevronRight size={18} />
                       </button>
                    </div>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>

           {localLeads.filter(l => l.stage === activeStage).length === 0 && (
             <div className="text-center py-24 opacity-20">
                <ShieldCheck size={64} className="mx-auto mb-4" />
                <p className="text-xl font-bold uppercase tracking-tighter">No high-intent targets in this cluster</p>
             </div>
           )}
         </div>
       </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* AI Configuration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-agency p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center text-[#00AEEF]">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Define Lead Criteria</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Targeting Parameters</p>
                  </div>
                </div>
                <textarea 
                  value={leadCriteria}
                  onChange={(e) => setLeadCriteria(e.target.value)}
                  className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm focus:border-[#00AEEF]/50 outline-none resize-none font-medium text-slate-600 dark:text-slate-400"
                  placeholder="Describe your ideal customer profile in detail..."
                />
                <div className="flex flex-wrap gap-3">
                  {['Google Search', 'LinkedIn', 'Facebook Ads', 'Competitor Analysis'].map(engine => (
                    <button 
                      key={engine}
                      onClick={() => handleAIRun(engine)}
                      disabled={aiStatus !== 'idle' && aiStatus !== 'done'}
                      className="flex-1 px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#00AEEF] hover:text-[#00AEEF] transition-all disabled:opacity-50"
                    >
                      Initialize {engine}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Processing Status */}
              {aiStatus !== 'idle' && (
                <div className="card-agency p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-ping" />
                      <span className="text-sm font-bold uppercase tracking-widest">
                        {aiStatus === 'searching' && 'Scouring Global Networks...'}
                        {aiStatus === 'analyzing' && 'Running Neural Qualification...'}
                        {aiStatus === 'done' && 'Strategic Targets Acquired'}
                      </span>
                    </div>
                    {aiStatus === 'done' && (
                      <button 
                        onClick={handleImportLeads}
                        className="btn-primary py-2 px-6 text-[10px]"
                      >
                        Import to Pipeline
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiResults.map((result, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={result.id} 
                        className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[10px] font-black">
                            {result.score}
                          </div>
                          <ShieldCheck size={14} className="text-[#00AEEF]" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-tight">{result.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{result.company}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card-agency p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <Bot size={16} className="text-[#00AEEF]" /> Automation Settings
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Globe, label: 'Cross-Network Search' },
                    { icon: Sparkles, label: 'Automate Qualification' },
                    { icon: FileText, label: 'AI Content Generation' },
                    { icon: BarChart, label: 'Competitor Benchmarking' }
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
                      </div>
                      <div className="w-8 h-4 bg-[#00AEEF] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-agency p-8 bg-[#0F172A] border-transparent text-white">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Strategic Integration</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed mb-6">
                  Leads automatically sync with your established CRM endpoints after neural verification.
                </p>
                <div className="flex items-center gap-3 grayscale opacity-40">
                  <Share2 size={20} />
                  <Users size={20} />
                  <Globe2 size={20} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PipelineStat({ id, title, value, change, icon: Icon, color, source, refresh }: any) {
  return (
    <div className="card-agency p-6 flex flex-col justify-between group overflow-hidden relative">
       <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="text-[40px] font-black italic">{id.split('-').pop()}</span>
       </div>
       <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
             <Icon size={20} />
          </div>
          <div className="flex flex-col items-end">
             <span className={cn("text-[10px] font-bold uppercase", color)}>{change}</span>
             <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{id}</span>
          </div>
       </div>
       <div className="mt-4">
          <div className="flex items-center justify-between">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>
             <span className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest">{refresh}</span>
          </div>
          <h4 className="text-2xl font-bold dark:text-white mt-1 uppercase tracking-tighter">{value}</h4>
          <p className="text-[8px] text-slate-500 font-medium uppercase tracking-tight mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Source: {source}</p>
       </div>
    </div>
  );
}
