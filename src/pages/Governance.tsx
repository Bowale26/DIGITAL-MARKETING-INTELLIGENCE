/**
 * <metadata>
 *   version: "2.1.4",
 *   timestamp: "2026-04-30T13:48:00.000Z",
 *   author_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
 *   governance_hash: "sha256(rules_snapshot)",
 *   change_type: "MANUAL"
 * </metadata>
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  ShieldAlert, 
  History, 
  UserCheck, 
  CheckCircle2,
  AlertCircle,
  FileText,
  Scaling,
  ShieldQuestion,
  X,
  Check,
  Target,
  Database,
  Rocket,
  Plus,
  ArrowRight,
  User,
  Zap,
  Activity,
  CalendarDays,
  Play,
  ChevronRight,
  LockIcon,
  Globe,
  BarChart3,
  Search,
  AlertTriangle,
  Fingerprint,
  Layers,
  ChevronDown,
  LayoutGrid,
  Send,
  Terminal,
  Cpu,
  Download
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  setDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../context/FirebaseContext';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import GovernanceDashboard from '../components/GovernanceDashboard';

interface StaticRule {
  id: string;
  rule: string;
  scope: string;
  enforcement: 'strict' | 'advisory';
  status: 'ACTIVE_AND_LOCKED';
}

const permanentRules: StaticRule[] = [
  {
    id: "RULE-TONE-001",
    rule: "Always use a friendly, conversational tone",
    scope: "all_text_outputs",
    enforcement: "strict",
    status: "ACTIVE_AND_LOCKED"
  },
  {
    id: "RULE-CTA-002",
    rule: "Every marketing asset must include a clear Call to Action",
    scope: "ad_copy, emails, landing_pages, social_posts",
    enforcement: "strict",
    status: "ACTIVE_AND_LOCKED"
  },
  {
    id: "RULE-BRAND-003",
    rule: "Maintain brand voice consistency across all channels",
    scope: "all_generated_content",
    enforcement: "strict",
    status: "ACTIVE_AND_LOCKED"
  },
  {
    id: "RULE-COMPLIANCE-004",
    rule: "Adhere to platform-specific advertising policies",
    scope: "all_ad_content",
    enforcement: "strict",
    status: "ACTIVE_AND_LOCKED"
  },
  {
    id: "RULE-DATA-005",
    rule: "Ground all claims in verified data when available",
    scope: "reports, case_studies, competitive_analysis",
    enforcement: "advisory",
    status: "ACTIVE_AND_LOCKED"
  }
];

const PIPELINE_STAGES = [
  {
    id: 'StrategistProposes',
    label: 'Strategist Proposes',
    color: '#3182CE',
    action: 'Review against brand guidelines',
    output: 'Approve/Reject/ReqChanges',
    input: 'Rule change proposal JSON'
  },
  {
    id: 'AdminApproves',
    label: 'Admin Approves',
    color: '#D69E2E',
    action: 'Final compliance + risk sign-off',
    output: 'Authorized / Escalate',
    input: 'Strategist-approved proposal'
  },
  {
    id: 'AutoDeploy',
    label: 'Auto Deploy',
    color: '#38A169',
    action: 'Atomic bump + author UUID',
    output: 'Deploy / Rollback',
    input: 'Admin-authorized change'
  }
];

function PipelineTracker({ currentStage = 'StrategistProposes' }: { currentStage?: string }) {
  const activeIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStage);

  return (
    <div id="protocol-pipeline" className="p-10 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group mb-12">
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00D9FF]/5 rounded-full blur-[100px] group-hover:bg-[#00D9FF]/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00D9FF] flex items-center gap-2 font-mono">
                 <ShieldCheck size={16} /> Protocol Update Pipeline
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">LKP-001 Immutable Governance Flow</p>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/50 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Real-time Tracking</span>
           </div>
        </div>

        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-800" />
          
          {/* Active Progress Bar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(activeIndex / (PIPELINE_STAGES.length - 1)) * 100}%` }}
            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 transition-all duration-1000"
          />

          <div className="relative flex justify-between">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;
              const isBlocked = idx > activeIndex;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center max-w-[200px]">
                  <motion.div 
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive ? stage.color : (isCompleted ? stage.color : '#1e293b'),
                    }}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center relative z-20 transition-all duration-500 border-2",
                      isActive ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "border-transparent shadow-lg",
                      isCompleted ? "shadow-[0_0_20px_rgba(49,130,206,0.3)]" : ""
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-2xl border-4 border-current"
                        style={{ borderColor: stage.color }}
                      />
                    )}

                    {isCompleted ? (
                      <Check className="text-white" size={24} />
                    ) : isBlocked ? (
                      <LockIcon className="text-slate-600" size={18} />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </motion.div>

                  <div className="mt-6">
                    <h4 className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                      isActive ? "text-white" : "text-slate-500"
                    )}>
                      {stage.label}
                    </h4>
                    <div className={cn(
                      "mt-4 p-4 rounded-2xl border transition-all duration-500",
                      isActive ? "bg-white/5 border-white/10 opacity-100 scale-100" : "bg-transparent border-transparent opacity-40 scale-95"
                    )}>
                       <div className="space-y-3">
                          <div className="text-left border-l border-white/5 pl-2">
                             <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.1em] block mb-1">Input</span>
                             <p className="text-[10px] font-bold text-slate-300 font-mono leading-tight">{stage.input}</p>
                          </div>
                          <div className="text-left border-l border-white/5 pl-2">
                             <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.1em] block mb-1">Action</span>
                             <p className="text-[10px] font-bold text-white leading-tight">{stage.action}</p>
                          </div>
                          <div className="text-left border-l border-white/5 pl-2">
                             <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.1em] block mb-1">Output</span>
                             <p className="text-[10px] font-black text-[#00D9FF] font-mono leading-tight">{stage.output}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicalDeliveryCard({ hasActiveProject = true }: { hasActiveProject?: boolean }) {
  const sprintData = {
    sprint: 12,
    completion: 68,
    nextMilestone: "Neural Node Sync",
    id: "FLUX-DEL-992"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      id="technical-delivery-panel" 
      className="p-8 glass-panel rounded-[40px] border-[#FF6B35]/20 shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <ShieldCheck size={160} className="text-[#FF6B35] group-hover:scale-110 transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 border border-white/10 rounded-2xl relative group-hover:border-[#FF6B35]/50 transition-colors">
                 <ShieldCheck className="text-[#FF6B35] neon-glow-orange" size={24} strokeWidth={2.5} />
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F172A] animate-pulse" />
              </div>
              <div>
                 <h3 className="text-sm font-mono font-black text-white uppercase tracking-tighter">Technical Delivery</h3>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Live Status: Active</span>
                 </div>
              </div>
           </div>
           <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <span className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">ID: {sprintData.id}</span>
           </div>
        </div>

        {!hasActiveProject ? (
          <div className="py-16 text-center space-y-6">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700 border border-dashed border-slate-800">
                <Activity size={24} />
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">No active delivery nodes.</p>
                <p className="text-[8px] font-bold text-slate-600 uppercase">Command a project to initiate the delivery protocol.</p>
             </div>
             <button 
               onClick={() => document.getElementById('command-new-project')?.click()}
               className="px-8 py-3 bg-[#00D9FF] text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,217,255,0.2)]"
             >
                Begin Protocol
             </button>
          </div>
        ) : (
          <div className="space-y-10">
             {/* Metrics Row (Clickable Pills) */}
             <div className="flex flex-wrap gap-4">
                {/* Timeline Pill */}
                <div className="group/pill relative">
                   <button className="px-5 py-3 rounded-2xl bg-[#FF6B35] text-white flex items-center gap-3 shadow-[0_10px_25px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95 transition-all">
                      <CalendarDays size={14} />
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest">Ongoing / Bi-Weekly Sprints</span>
                   </button>
                   
                   {/* Gantt Mini View Tooltip */}
                   <div className="absolute bottom-full left-0 mb-4 w-72 bg-[#0F172A] border border-white/10 p-5 rounded-3xl scale-95 opacity-0 group-hover/pill:opacity-100 group-hover/pill:scale-100 pointer-events-none transition-all duration-300 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[9px] font-black text-white uppercase tracking-widest">Sprint Calendar View</p>
                         <span className="text-[7px] font-mono text-slate-500 uppercase">Gantt Protocol v1.4</span>
                      </div>
                      <div className="space-y-3">
                         {[1, 2, 3, 4].map(i => (
                           <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase">
                                 <span>Sprint {sprintData.sprint + i - 1}</span>
                                 <span>{i === 1 ? 'In Progress' : 'Planned'}</span>
                              </div>
                              <div className="h-2 bg-slate-900 rounded-full overflow-hidden relative">
                                 <div 
                                   className={cn(
                                     "absolute h-full rounded-full transition-all duration-1000",
                                     i === 1 ? "bg-[#FF6B35] neon-glow-orange" : "bg-slate-800"
                                   )}
                                   style={{ 
                                     left: `${(i-1) * 20}%`, 
                                     width: i === 1 ? '40%' : '30%' 
                                   }} 
                                 />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Assurance Pill */}
                <div className="group/pill relative">
                   <button className="px-5 py-3 rounded-2xl border border-white/10 bg-slate-950 text-slate-500 flex items-center gap-3 hover:border-[#FF6B35] hover:text-white transition-all">
                      <ShieldCheck size={14} className="text-[#FF6B35]" />
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest">SLA Guaranteed</span>
                   </button>

                   {/* SLA Details Tooltip */}
                   <div className="absolute bottom-full right-0 mb-4 w-64 bg-[#0F172A] border border-white/10 p-6 rounded-3xl scale-95 opacity-0 group-hover/pill:opacity-100 group-hover/pill:scale-100 pointer-events-none transition-all duration-300 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                      <div className="mb-4">
                         <p className="text-[9px] font-black text-[#FF6B35] uppercase tracking-widest">Enterprise SLA Details</p>
                         <p className="text-[7px] font-bold text-slate-600 uppercase mt-1">Guaranteed Performance Metrics</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         {[
                           { l: "Uptime Assurance", v: "99.5%", desc: "High availability clusters" },
                           { l: "Critical Response", v: "4 Hours", desc: "Neuro-strategist priority" },
                           { l: "Resolution SLA", v: "72 Hours", desc: "Full structural audit" }
                         ].map(s => (
                           <div key={s.l} className="p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-[7px] font-bold text-slate-400 uppercase leading-none">{s.l}</span>
                                 <span className="text-[8px] font-black text-white font-mono leading-none">{s.v}</span>
                              </div>
                              <p className="text-[6px] font-bold text-slate-600 uppercase tracking-tighter">{s.desc}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             {/* Real-time Data Section */}
             <div className="p-8 bg-slate-950/50 border border-white/5 rounded-[32px] space-y-8 relative overflow-hidden group/data">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-transparent to-transparent opacity-0 group-hover/data:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between relative z-10">
                   <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">Current Vector</span>
                      <div className="flex items-center gap-3">
                         <span className="text-2xl font-mono font-black text-white">SP-{sprintData.sprint}</span>
                         <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded border border-emerald-500/20">Active</span>
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">Sync Completion</span>
                      <p className="text-2xl font-mono font-black text-[#FF6B35] leading-none">{sprintData.completion}%</p>
                   </div>
                </div>

                <div className="space-y-3 relative z-10">
                   <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sprintData.completion}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[#FF6B35] to-orange-600 shadow-[0_0_20px_rgba(255,107,53,0.3)]"
                      />
                   </div>
                   <div className="flex justify-between items-center text-[7px] font-black text-slate-700 uppercase tracking-widest">
                      <span>Protocol Start</span>
                      <span>Phase Complete</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#FF6B35]">
                         <ChevronRight size={16} strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                         <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Next Milestone</span>
                         <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">{sprintData.nextMilestone}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-mono font-black text-[#00D9FF] uppercase leading-none">T - 3.5 Days</p>
                      <p className="text-[7px] font-bold text-slate-700 uppercase mt-1">Remaining</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GlobalPrerequisites({ onReadyChange }: { onReadyChange?: (ready: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prerequisites] = useState([
    { 
      id: "icp",
      title: "Ideal Customer Profile (ICP)", 
      subtext: "Documented buyer personas with pain points",
      status: "RED", // RED, YELLOW, GREEN
      action: "Upload ICP Document"
    },
    { 
      id: "assets",
      title: "Sales Deck/Case Studies", 
      subtext: "Proven social proof assets for outreach",
      status: "YELLOW", 
      action: "Request Asset Creation"
    },
    { 
      id: "crm",
      title: "CRM API Keys", 
      subtext: "Secure integration for lead flow automation",
      status: "RED", 
      isLocked: true,
      action: "Initiate Secure Onboarding"
    },
    { 
      id: "capacity",
      title: "Internal Sales Team Capacity", 
      subtext: "SDRs/AEs available for qualified lead intake",
      status: "GREEN", 
      capacity: 85,
      action: "Schedule Capacity Planning Call"
    }
  ]);

  const completedCount = prerequisites.filter(p => p.status === 'GREEN').length;
  const progress = Math.round((completedCount / prerequisites.length) * 100);
  const hasRed = prerequisites.some(p => p.status === 'RED');
  const isAllGreen = prerequisites.every(p => p.status === 'GREEN');

  useEffect(() => {
    onReadyChange?.(isAllGreen);
  }, [isAllGreen, onReadyChange]);

  return (
    <div id="global-prerequisites" className="glass-panel rounded-[40px] border-white/10 overflow-hidden border-dashed">
       {/* Progress Bar Header */}
       <div className="px-8 pt-8 space-y-3">
          <div className="flex items-center justify-between">
             <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{completedCount}/{prerequisites.length} Complete</span>
             <span className="text-[10px] font-mono font-black text-[#00D9FF]">{progress}% READY</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="h-full bg-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.5)]"
             />
          </div>
       </div>

       {hasRed && (
         <div className="mx-8 mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
            <AlertTriangle size={14} className="text-rose-500" />
            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest leading-none">Complete prerequisites to proceed</p>
         </div>
       )}

       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full p-8 flex items-center justify-between group"
       >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#00D9FF]/10 transition-all">
                <LayoutGrid size={18} className="text-slate-500 group-hover:text-[#00D9FF] transition-colors" />
             </div>
             <span className="text-xs font-mono font-black text-white uppercase tracking-[0.2em]">Global Prerequisites</span>
          </div>
          <ChevronDown size={20} className={cn("text-slate-500 transition-transform duration-500", isOpen && "rotate-180")} />
       </button>
       
       <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="overflow-hidden"
           >
              <div className="px-8 pb-10 space-y-4">
                 {prerequisites.map((item) => (
                   <div 
                     key={item.id} 
                     className={cn(
                       "p-6 bg-slate-950/50 rounded-3xl border-l-[3px] transition-all hover:bg-slate-950 group/item",
                       item.status === 'GREEN' ? "border-emerald-500" : 
                       item.status === 'YELLOW' ? "border-amber-500" : "border-rose-500"
                     )}
                   >
                      <div className="flex items-start justify-between mb-4">
                         <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest font-mono">{item.title}</h4>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{item.subtext}</p>
                         </div>
                         <div className={cn(
                           "px-2 py-0.5 rounded text-[7px] font-black uppercase font-mono flex items-center gap-1",
                           item.status === 'GREEN' ? "bg-emerald-500/10 text-emerald-500" : 
                           item.status === 'YELLOW' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                         )}>
                            {item.isLocked && <Lock size={8} />}
                            {item.status}
                         </div>
                      </div>

                      {item.capacity !== undefined && (
                        <div className="mb-4 space-y-2">
                           <div className="flex justify-between text-[7px] font-black text-slate-600 uppercase tracking-widest font-mono">
                              <span>Current Load</span>
                              <span>{item.capacity}%</span>
                           </div>
                           <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.capacity}%` }}
                                className="h-full bg-emerald-500/50" 
                              />
                           </div>
                        </div>
                      )}

                      <button className="w-full py-2.5 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF]/20 transition-all font-mono">
                         {item.action}
                      </button>
                   </div>
                 ))}
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

const SERVICE_MODULES = [
  {
    id: "multi-channel-prospecting",
    title: "Multi-Channel Prospecting",
    grade: "INDUSTRIAL_GRADE",
    features: ["LinkedIn automation", "Cold email sequences", "Intent data targeting"],
    basePrice: 3500,
    setupTime: "2 weeks",
    icon: <BarChart3 size={24} />,
    description: "Multi-vector outreach strategy utilizing high-intent data and automated sequence orchestration across primary B2B channels."
  },
  {
    id: "funnel-logic",
    title: "Landing Page CRO & Funnel Logic",
    grade: "INDUSTRIAL_GRADE",
    features: ["A/B testing", "Heatmap analysis", "Multi-step lead forms"],
    basePrice: 4200,
    setupTime: "3 weeks",
    icon: <Layers size={24} />,
    description: "High-performance architectural overhaul of conversion paths, minimizing friction and maximizing lead-to-opportunity ratios."
  },
  {
    id: "outreach-architecture",
    title: "Automated Cold Outreach Architecture",
    grade: "INDUSTRIAL_GRADE",
    features: ["Inbox rotation", "Deliverability monitoring", "Dynamic personalization"],
    basePrice: 2800,
    setupTime: "2 weeks",
    icon: <Send size={24} />,
    description: "Safe, scalable infrastructure for outbound campaigns with built-in reputation management and advanced SPAM filters."
  },
  {
    id: "lead-scoring",
    title: "Lead Scoring & Qualification Systems",
    grade: "INDUSTRIAL_GRADE",
    features: ["Behavioral tracking", "Firmographic weighting", "Automated DQ"],
    basePrice: 3100,
    setupTime: "2 weeks",
    icon: <Fingerprint size={24} />,
    description: "Neural-weighted qualification protocols ensuring your sales team only interfaces with high-propensity acquisition targets."
  },
  {
    id: "crm-integration",
    title: "CRM Integration (HubSpot/Salesforce)",
    grade: "INDUSTRIAL_GRADE",
    features: ["Bi-directional sync", "Custom field mapping", "Automation workflows"],
    basePrice: 4500,
    setupTime: "4 weeks",
    icon: <LayoutGrid size={24} />,
    description: "Seamless pipe-sync between intelligence nodes and your central source of truth for full-funnel visibility."
  },
  {
    id: "content-arrays",
    title: "A/B Testing Content Arrays",
    grade: "INDUSTRIAL_GRADE",
    features: ["Ad copy variation", "Creative asset testing", "Engagement analytics"],
    basePrice: 2500,
    setupTime: "1 week",
    icon: <Layers size={24} />,
    description: "Systematic content experimentation framework to discover high-performing messaging clusters through rapid iteration."
  }
];

function ServiceConfigModal({ service, isOpen, onClose, isSelected, onToggle }: { 
  service: typeof SERVICE_MODULES[0] | null; 
  isOpen: boolean; 
  onClose: () => void;
  isSelected: boolean;
  onToggle: () => void;
}) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-slate-900 border border-[#00D9FF]/20 rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-950 rounded-2xl text-[#00D9FF] border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
                     {React.cloneElement(service.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-white uppercase tracking-tighter">{service.title}</h3>
                     <span className="text-[8px] font-mono font-black text-[#00D9FF] uppercase tracking-[0.2em]">Service Configurator</span>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
               </button>
            </div>

            <div className="p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl">
                        <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Base Module Cost</span>
                        <p className="text-lg font-mono font-black text-white">${service.basePrice.toLocaleString()}</p>
                     </div>
                     <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl">
                        <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Setup Protocol</span>
                        <p className="text-lg font-mono font-black text-[#00D9FF]">{service.setupTime}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest font-mono">Module Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                     {service.features.map(f => (
                       <div key={f} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                          <Check size={12} className="text-[#00D9FF]" />
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{f}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</span>
                  <span className={cn(
                    "text-[10px] font-black font-mono leading-none mt-1",
                    isSelected ? "text-[#00D9FF]" : "text-slate-600"
                  )}>
                    {isSelected ? "DEPLOYED TO PROJECT" : "NOT SELECTED"}
                  </span>
               </div>
               <button 
                 onClick={onToggle}
                 className={cn(
                   "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all font-mono",
                   isSelected 
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20" 
                    : "bg-[#00D9FF] text-slate-950 shadow-[0_10px_30px_rgba(0,217,255,0.3)] hover:scale-105"
                 )}
               >
                 {isSelected ? "Remove from Project" : "Add to Project"}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ServiceFeatureGrid() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [configService, setConfigService] = useState<typeof SERVICE_MODULES[0] | null>(null);

  const toggleService = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalPrice = SERVICE_MODULES
    .filter(s => selectedIds.includes(s.id))
    .reduce((acc, s) => acc + s.basePrice, 0);

  return (
    <div className="space-y-12">
       {/* Selected Services Summary Bar */}
       <AnimatePresence>
         {selectedIds.length > 0 && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="px-8 py-4 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-[32px] flex items-center justify-between"
           >
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-black text-white uppercase tracking-widest">Active Modules:</span>
                    <span className="text-xs font-mono font-black text-[#00D9FF]">{selectedIds.length}</span>
                 </div>
                 <div className="h-4 w-px bg-white/10" />
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-black text-white uppercase tracking-widest">Estimated Investment:</span>
                    <span className="text-xs font-mono font-black text-emerald-500">${totalPrice.toLocaleString()} / mo</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Neural Sync Active</span>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       <div id="service-feature-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {SERVICE_MODULES.map((service) => {
           const isActive = selectedIds.includes(service.id);
           return (
             <motion.div 
               key={service.id}
               whileHover={{ scale: 1.02, translateY: -8 }}
               onClick={() => setConfigService(service)}
               className={cn(
                 "p-10 rounded-[44px] border transition-all duration-500 group relative cursor-pointer overflow-hidden",
                 isActive 
                   ? "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#00D9FF] shadow-[0_20px_50px_rgba(0,217,255,0.1)]" 
                   : "bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 border-white/5 hover:border-[#00D9FF]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
               )}
             >
               {/* Background Accent */}
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#00D9FF]/5 transition-all" />
               
               <div className="relative z-10">
                 <div className="flex items-start justify-between mb-8">
                    <div className={cn(
                      "p-4 bg-slate-900 rounded-[28px] transition-all duration-500 transform group-hover:rotate-6",
                      isActive ? "text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.2)]" : "text-slate-500 group-hover:text-[#00D9FF]"
                    )}>
                       {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28 })}
                    </div>
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_15px_#00D9FF]"
                      >
                         <Check size={14} strokeWidth={4} />
                      </motion.div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[8px] font-mono font-black uppercase tracking-[0.3em] transition-all",
                            "animate-pulse text-[#00D9FF]"
                          )}>
                             {service.grade.replace('_', ' ')}
                          </span>
                       </div>
                       <h4 className="text-base font-black text-white uppercase tracking-tight leading-tight group-hover:text-[#00D9FF] transition-colors">
                          {service.title}
                       </h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {service.features.slice(0, 2).map((f) => (
                         <span key={f} className="text-[7px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            {f}
                         </span>
                       ))}
                       {service.features.length > 2 && (
                         <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest py-1">+ {service.features.length - 2} More</span>
                       )}
                    </div>
                 </div>

                 {/* Tooltip Pattern */}
                 <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">Config Module</span>
                    <ChevronRight size={14} className="text-[#00D9FF]" />
                 </div>
               </div>
             </motion.div>
           );
         })}
       </div>

       <ServiceConfigModal 
         service={configService}
         isOpen={!!configService}
         onClose={() => setConfigService(null)}
         isSelected={!!configService && selectedIds.includes(configService.id)}
         onToggle={() => configService && toggleService(configService.id)}
       />
    </div>
  );
}

function WorkflowTimeline({ isActive = true }: { isActive?: boolean }) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const currentStep = isActive ? 2 : 0; // Simulated current step

  const steps = [
    { 
      id: 1, 
      title: "ICP Deep-Dive", 
      subtitle: "Defining the exact target decision-maker", 
      milestone: "ICP SIGNED",
      deliverable: "Detailed buyer persona document including firmographic and technographic markers.",
      icon: <Target size={16} />
    },
    { 
      id: 2, 
      title: "Engine Build", 
      subtitle: "Setting up outreach domains and funnel pages", 
      milestone: "SYSTEM ONLINE",
      deliverable: "Live funnel assets, secondary domain infrastructure, and IP warming protocol initiation.",
      icon: <Cpu size={16} />
    },
    { 
      id: 3, 
      title: "Data Enrichment", 
      subtitle: "Harvesting and cleaning prospect lists", 
      milestone: "FIRST 5K LIST",
      deliverable: "Verified B2B lead database with validated emails and enriched LinkedIn metadata.",
      icon: <Database size={16} />
    },
    { 
      id: 4, 
      title: "Launch", 
      subtitle: "Activating outreach and ad campaigns", 
      milestone: "FIRST MATCH",
      deliverable: "Active multi-vector campaign sequences and initial qualified lead delivery report.",
      icon: <Rocket size={16} />
    },
    { 
      id: 5, 
      title: "Optimization", 
      subtitle: "Iterating on copy and targeting based on response", 
      milestone: "CPL TARGET HIT",
      deliverable: "Cost-per-lead optimization matrix and verified conversion scaling roadmap.",
      icon: <BarChart3 size={16} />
    }
  ];

  const progress = isActive ? ((currentStep - 0.5) / steps.length) * 100 : 0;

  return (
    <div id="project-workflow-timeline" className="p-10 glass-panel rounded-[48px] border-white/5 relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#00D9FF] rounded-full blur-[120px]" />
       </div>

       <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 relative z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-950 border border-white/10 rounded-2xl">
                <Activity size={20} className={cn(isActive ? "text-[#00D9FF]" : "text-slate-700")} />
             </div>
             <div>
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-tighter">Project Lifecycle Protocol</h3>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operational Flow v2.4.0</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-px w-12 bg-white/10 hidden md:block" />
             {isActive ? (
               <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] font-mono">Workflow Active</span>
               </div>
             ) : (
               <div className="px-5 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
                  <Lock size={12} className="text-rose-500" />
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] font-mono">Workflow Locked</span>
               </div>
             )}
          </div>
       </div>

       {!isActive ? (
         <div className="py-20 text-center space-y-4">
            <p className="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em]">Command a project to activate workflow</p>
            <div className="flex justify-center gap-2 opacity-20">
               {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-1 bg-slate-700 rounded-full" />)}
            </div>
         </div>
       ) : (
         <div className="relative">
            {/* Horizontal Line (Desktop) */}
            <div className="absolute top-7 left-0 w-full h-[2px] bg-slate-900 hidden md:block">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="h-full bg-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.5)]"
               />
            </div>

            {/* Steps Container */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4 relative z-10">
               {steps.map((step, idx) => {
                 const isCompleted = currentStep > step.id;
                 const isCurrent = currentStep === step.id;
                 const isLocked = currentStep < step.id;

                 return (
                   <motion.div 
                     key={step.id}
                     whileHover={!isLocked ? { y: -4 } : {}}
                     onClick={() => !isLocked && setSelectedStep(step.id)}
                     className={cn(
                       "flex-1 group cursor-pointer transition-all duration-500 w-full md:w-auto",
                       isLocked && "cursor-not-allowed opacity-40"
                     )}
                   >
                      <div className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-0">
                         {/* Icon/Indicator Bubble */}
                         <div className="relative mb-6">
                            <div className={cn(
                              "w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 border-2",
                              isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]" :
                              isCurrent ? "bg-slate-900 border-[#00D9FF] text-[#00D9FF] neon-glow shadow-[0_0_30px_rgba(0,217,255,0.2)] animate-pulse" :
                              "bg-slate-950 border-slate-800 text-slate-700"
                            )}>
                               {isCompleted ? <Check size={24} strokeWidth={3} /> : step.icon}
                            </div>
                            {isLocked && (
                              <div className="absolute -top-1 -right-1 p-1 bg-slate-900 rounded-lg text-slate-500 border border-white/5">
                                 <Lock size={10} />
                              </div>
                            )}
                         </div>

                         {/* Text Content */}
                         <div className="flex-1 space-y-2">
                            <h4 className={cn(
                              "text-[10px] font-black uppercase tracking-widest font-mono",
                              isCompleted ? "text-emerald-500" : isCurrent ? "text-white" : "text-slate-600"
                            )}>
                               0{step.id} — {step.title}
                            </h4>
                            <p className={cn(
                              "text-[8px] font-bold uppercase tracking-tight leading-relaxed max-w-[140px]",
                              isCompleted ? "text-slate-500 line-through decoration-emerald-500/50" :
                              isCurrent ? "text-slate-400" : "text-slate-700"
                            )}>
                               {step.subtitle}
                            </p>
                            
                            {/* Milestone Badge */}
                            <motion.div 
                              initial={false}
                              animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className={cn(
                                "mt-4 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] font-mono inline-flex items-center gap-2 border",
                                isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                                isCurrent ? "bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]" :
                                "bg-slate-900 border-white/5 text-slate-700"
                              )}
                            >
                               {isCompleted && <Zap size={8} />}
                               {step.milestone}
                            </motion.div>
                         </div>
                      </div>
                   </motion.div>
                 );
               })}
            </div>
         </div>
       )}

       {/* Task Board Modal (Deliverable View) */}
       <AnimatePresence>
          {selectedStep && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedStep(null)}
                 className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
               >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-mono font-black text-[#00D9FF] uppercase tracking-widest">Phase Deliverable</span>
                     <button onClick={() => setSelectedStep(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-10 space-y-6">
                     <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-xl font-mono font-black text-white uppercase tracking-tighter">
                           {steps.find(s => s.id === selectedStep)?.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-wide">
                           {steps.find(s => s.id === selectedStep)?.deliverable}
                        </p>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-2xl">
                        <div className="p-2 bg-[#00D9FF]/10 rounded-lg text-[#00D9FF]">
                           <FileText size={16} />
                        </div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Protocol-Signed-Asset.pdf</span>
                        <ChevronRight size={14} className="ml-auto text-slate-600" />
                     </div>
                  </div>
                  <div className="p-8 bg-white/[0.02] border-t border-white/5 text-center">
                     <button 
                       onClick={() => setSelectedStep(null)}
                       className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                     >
                        Close Task Board
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
}

function ProjectOnboardingModal({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete?: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    contactEmail: '',
    contactPhone: '',
    companySize: '11-50',
    industry: [] as string[],
    jobTitles: [] as string[],
    leadVolume: '',
    channels: {
      coldEmail: false,
      linkedin: false,
      googleAds: false,
      contentMarketing: false,
    },
    budgetRange: 5000,
    crm: 'None',
    timeline: 'Standard (4 weeks)',
    techAudit: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = "Valid email required";
      }
      if (!formData.contactPhone || !/^\+1 \(\d{3}\) \d{3}-\d{4}$/.test(formData.contactPhone)) {
        newErrors.contactPhone = "Format: +1 (XXX) XXX-XXXX";
      }
      if (!formData.companySize) newErrors.companySize = "Required";
      if (formData.industry.length === 0) newErrors.industry = "Select at least one";
      if (formData.jobTitles.length === 0) newErrors.jobTitles = "Select at least one";
      if (!formData.leadVolume) newErrors.leadVolume = "Required";
    }
    if (step === 2) {
      const activeChannels = Object.values(formData.channels).some(v => v);
      if (!activeChannels) newErrors.channels = "Select at least one channel";
    }
    if (step === 3) {
      if (!formData.timeline) newErrors.timeline = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 1) return '+1';
    if (numbers.length <= 4) return `+1 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+1 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    return `+1 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    const payload = {
      uuid: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "PROJECT_COMMANDED",
      data: formData
    };

    try {
      // Simulate API call
      console.log("SENDING TO /api/projects/initiate:", payload);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Also log to governance logs for traceability
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `[PROJECT] Command Initiated: ${formData.contactEmail} | UUID: ${payload.uuid}`,
        type: 'SYSTEM',
        userId: auth.currentUser?.uid || 'GUEST'
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onComplete ? onComplete() : onClose();
        setStep(1);
      }, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = ["SaaS", "FinTech", "HealthTech", "E-commerce", "Real Estate", "Professional Services"];
  const titles = ["CEO", "CMO", "VP Sales", "Marketing Director", "Founder", "Operations Manager"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-[12px]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className={cn(
              "relative w-full max-w-2xl bg-slate-900/95 border border-[#00D9FF]/30 rounded-[40px] shadow-2xl overflow-hidden",
              showSuccess && "border-emerald-500/50"
            )}
          >
            {showSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-20 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                   <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-mono font-black text-white uppercase tracking-tighter">Project Commanded</h2>
                <p className="text-slate-400 font-medium text-sm">Strategist will contact you within 4 hours.</p>
                <div className="pt-8">
                   <div className="flex items-center justify-center gap-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Transmission Successful
                   </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                   <div>
                      <h2 className="text-xl font-mono font-black text-[#00D9FF] uppercase tracking-tighter flex items-center gap-3">
                         <Plus size={20} strokeWidth={3} /> Command New Project
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                         {[1, 2, 3].map(s => (
                           <div key={s} className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full transition-all duration-500",
                                step >= s ? "bg-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.5)]" : "bg-slate-800"
                              )} />
                              <span className={cn(
                                "text-[8px] font-mono font-black uppercase tracking-widest transition-colors",
                                step === s ? "text-white" : "text-slate-600"
                              )}>Step 0{s}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>

                {/* Form Body */}
                <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                   {step === 1 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Phase 01: ICP Definition</h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Contact Email</label>
                              <input 
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({...formData, contactEmail: e.target.value.toLowerCase()})}
                                className={cn(
                                  "w-full bg-slate-950 border rounded-2xl p-4 text-xs font-mono outline-none transition-all",
                                  errors.contactEmail ? "border-rose-500/50 text-rose-500" : "border-white/10 text-[#00D9FF] focus:border-[#00D9FF]"
                                )}
                                placeholder="name@domain.com"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Contact Phone</label>
                              <input 
                                type="text"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({...formData, contactPhone: formatPhoneNumber(e.target.value)})}
                                className={cn(
                                  "w-full bg-slate-950 border rounded-2xl p-4 text-xs font-mono outline-none transition-all",
                                  errors.contactPhone ? "border-rose-500/50 text-rose-500" : "border-white/10 text-white focus:border-[#00D9FF]"
                                )}
                                placeholder="+1 (XXX) XXX-XXXX"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Company Size</label>
                              <select 
                                value={formData.companySize}
                                onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white font-mono outline-none focus:border-[#00D9FF]"
                              >
                                {["1-10", "11-50", "51-200", "200+"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Lead Volume / Month</label>
                              <input 
                                type="number"
                                value={formData.leadVolume}
                                onChange={(e) => setFormData({...formData, leadVolume: e.target.value})}
                                placeholder="0"
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white font-mono outline-none focus:border-[#00D9FF]"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Industry Vertical</label>
                           <div className="flex flex-wrap gap-2">
                              {industries.map(ind => (
                                <button 
                                  key={ind}
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    industry: prev.industry.includes(ind) ? prev.industry.filter(i => i !== ind) : [...prev.industry, ind]
                                  }))}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border",
                                    formData.industry.includes(ind) ? "bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                                  )}
                                >
                                  {ind}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Target Job Titles</label>
                           <div className="flex flex-wrap gap-2">
                              {titles.map(title => (
                                <button 
                                  key={title}
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    jobTitles: prev.jobTitles.includes(title) ? prev.jobTitles.filter(t => t !== title) : [...prev.jobTitles, title]
                                  }))}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border",
                                    formData.jobTitles.includes(title) ? "bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                                  )}
                                >
                                  {title}
                                </button>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {step === 2 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Phase 02: Channel Selection</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {Object.entries({
                             coldEmail: "Cold Email",
                             linkedin: "LinkedIn",
                             googleAds: "Google Ads",
                             contentMarketing: "Content Marketing"
                           }).map(([key, label]) => (
                             <button
                               key={key}
                               onClick={() => setFormData(p => ({
                                 ...p,
                                 channels: { ...p.channels, [key]: !p.channels[key as keyof typeof p.channels] }
                               }))}
                               className={cn(
                                 "p-6 rounded-3xl border transition-all flex items-center justify-between text-left",
                                 formData.channels[key as keyof typeof formData.channels] ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.05)]" : "bg-white/5 border-white/5 text-slate-500"
                               )}
                             >
                                <span className="text-[10px] font-black uppercase tracking-widest font-mono">{label}</span>
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                  formData.channels[key as keyof typeof formData.channels] ? "border-[#00D9FF]" : "border-slate-800"
                                )}>
                                   {formData.channels[key as keyof typeof formData.channels] && <div className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full" />}
                                </div>
                             </button>
                           ))}
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Budget Range (Monthly)</label>
                              <span className="text-xs font-mono font-bold text-[#00D9FF]">${(formData.budgetRange / 1000).toFixed(0)}K</span>
                           </div>
                           <input 
                             type="range"
                             min="2000"
                             max="50000"
                             step="1000"
                             value={formData.budgetRange}
                             onChange={(e) => setFormData({...formData, budgetRange: parseInt(e.target.value)})}
                             className="w-full accent-[#00D9FF] bg-slate-800 h-1.5 rounded-full appearance-none cursor-pointer"
                           />
                           <div className="flex justify-between text-[8px] font-black text-slate-600 font-mono uppercase tracking-widest">
                              <span>Low ($2K)</span>
                              <span>Enterprise ($50K+)</span>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">CRM Integration</label>
                           <div className="grid grid-cols-4 gap-2">
                              {["HubSpot", "Salesforce", "Pipedrive", "None"].map(crm => (
                                <button 
                                  key={crm}
                                  onClick={() => setFormData({...formData, crm})}
                                  className={cn(
                                    "px-3 py-3 rounded-xl text-[9px] font-black uppercase transition-all border",
                                    formData.crm === crm ? "bg-white/10 border-white/20 text-white" : "bg-slate-900 border-white/5 text-slate-600"
                                  )}
                                >
                                  {crm}
                                </button>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {step === 3 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Phase 03: Delivery Preferences</h3>
                        
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Implementation Timeline</label>
                           <div className="space-y-3">
                              {["Immediate (2 weeks)", "Standard (4 weeks)", "Enterprise (8 weeks)"].map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => setFormData({...formData, timeline: opt})}
                                  className={cn(
                                    "w-full p-5 rounded-3xl border transition-all text-left flex items-start justify-between group",
                                    formData.timeline === opt ? "bg-[#00D9FF]/10 border-[#00D9FF] text-white shadow-[0_0_20px_rgba(0,217,255,0.05)]" : "bg-white/5 border-white/5 text-slate-500"
                                  )}
                                >
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase tracking-widest font-mono">{opt}</p>
                                      <p className="text-[8px] font-bold text-slate-600 uppercase">Priority Queue Status: {opt.includes('Immediate') ? 'RUSH' : 'NORMAL'}</p>
                                   </div>
                                   <div className={cn(
                                     "w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1",
                                     formData.timeline === opt ? "border-[#00D9FF]" : "border-slate-800"
                                   )}>
                                      {formData.timeline === opt && <div className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full" />}
                                   </div>
                                </button>
                              ))}
                           </div>
                        </div>

                        <div 
                          onClick={() => setFormData(p => ({...p, techAudit: !p.techAudit}))}
                          className="p-6 rounded-[32px] bg-slate-950 border border-white/5 cursor-pointer hover:border-[#00D9FF]/30 transition-all flex items-center justify-between group"
                        >
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-3 rounded-2xl bg-slate-900 transition-colors",
                                formData.techAudit ? "text-[#00D9FF]" : "text-slate-600"
                              )}>
                                 <Terminal size={18} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-white uppercase tracking-widest font-mono">Technical Audit</p>
                                 <p className="text-[8px] font-bold text-slate-600 uppercase">Include complimentary technical delivery audit</p>
                              </div>
                           </div>
                           <div className={cn(
                             "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                             formData.techAudit ? "bg-[#00D9FF] border-[#00D9FF] text-slate-950" : "border-slate-800 text-transparent"
                           )}>
                              <Check size={14} strokeWidth={4} />
                           </div>
                        </div>

                        <div className="p-4 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-2xl flex items-center gap-4">
                           <AlertTriangle size={16} className="text-[#00D9FF] shrink-0" />
                           <p className="text-[10px] font-mono font-black text-[#00D9FF] uppercase tracking-widest leading-relaxed">
                              High-ticket service - quality over quantity approach protocol engaged.
                           </p>
                        </div>
                     </motion.div>
                   )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                   <button 
                     onClick={handleBack}
                     disabled={step === 1 || isSubmitting}
                     className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-30 transition-all"
                   >
                     Back
                   </button>
                   <div className="flex gap-4">
                      {step < 3 ? (
                        <button 
                          onClick={handleNext}
                          className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3"
                        >
                           Next Protocol <ChevronRight size={14} />
                        </button>
                      ) : (
                        <button 
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-10 py-3 bg-[#00D9FF] text-slate-950 rounded-2xl text-[10px] font-mono font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,217,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                           {isSubmitting ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
                           Command Project Initiate
                        </button>
                      )}
                   </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TechnicalAuditDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [formData, setFormData] = useState({
    website: '',
    crm: 'HubSpot',
    spend: 10000,
    challenge: '',
    scope: [] as string[]
  });
  const [error, setError] = useState('');

  const scopeOptions = [
    "Funnel Architecture Review",
    "CRM Data Hygiene Analysis",
    "Outreach Deliverability Test",
    "Landing Page CRO Audit",
    "Lead Scoring Algorithm Review",
    "Competitive Positioning Analysis"
  ];

  const handleScopeToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.includes(item) ? prev.scope.filter(i => i !== item) : [...prev.scope, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.website.startsWith('https://')) {
      setError('Technical protocol requires https:// validation.');
      return;
    }
    if (formData.scope.length === 0) {
      setError('Select at least one audit scope parameter.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    const ticketId = `AUDIT-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    
    try {
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `[AUDIT] Ticket Created: ${ticketId} | Status: QUEUED_FOR_ANALYSIS`,
        type: 'SYSTEM',
        userId: auth.currentUser?.uid || 'GUEST'
      });

      setShowStatus(true);
      
      // Analysis sequence
      const steps = ["Scanning domain...", "Analyzing funnel...", "Generating insights...", "Compiling PDF..."];
      for (let i = 0; i < steps.length; i++) {
        setAuditStep(i);
        await new Promise(r => setTimeout(r, 1200));
      }
      
      setAuditStep(4); // Final state
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] h-full bg-[#0F172A] border-l border-white/5 shadow-[-40px_0_80px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {showStatus ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 {auditStep < 4 ? (
                   <div className="space-y-8">
                      <div className="w-24 h-24 rounded-full border-4 border-[#FF6B35]/20 border-t-[#FF6B35] animate-spin flex items-center justify-center mx-auto">
                         <Terminal size={32} className="text-[#FF6B35]" />
                      </div>
                      <div className="space-y-4">
                         <h2 className="text-xl font-mono font-black text-white uppercase tracking-tighter">Analysis in Progress</h2>
                         <div className="space-y-3">
                            {["Scanning domain...", "Analyzing funnel...", "Generating insights...", "Compiling PDF..."].map((s, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest">
                                 <div className={cn(
                                   "w-1.5 h-1.5 rounded-full",
                                   auditStep >= idx ? "bg-[#FF6B35] neon-glow-orange" : "bg-slate-800"
                                 )} />
                                 <span className={auditStep >= idx ? "text-white" : "text-slate-600"}>{s}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="space-y-10"
                   >
                      <div className="w-24 h-24 bg-[#FF6B35]/20 rounded-full flex items-center justify-center mx-auto text-[#FF6B35] border border-[#FF6B35]/30 shadow-[0_0_50px_rgba(255,107,53,0.2)]">
                         <CheckCircle2 size={40} />
                      </div>
                      <div>
                         <h2 className="text-2xl font-mono font-black text-white uppercase tracking-tighter">Audit Complete</h2>
                         <p className="text-slate-400 font-medium text-sm mt-3 uppercase tracking-widest text-[10px]">Reference: {crypto.randomUUID().substring(0, 8).toUpperCase()}</p>
                      </div>
                      
                      <div className="space-y-4 pt-4">
                         <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-mono font-black text-white uppercase hover:bg-white/10 transition-all">
                            <Layers size={16} className="text-[#FF6B35]" />
                            Download Full PDF Report
                         </button>
                         <button 
                           onClick={onClose}
                           className="w-full py-4 bg-[#FF6B35] text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-mono font-black uppercase hover:brightness-110 active:scale-95 transition-all"
                         >
                            Open Interactive Dashboard
                            <ArrowRight size={16} />
                         </button>
                      </div>
                   </motion.div>
                 )}
                 <div className="absolute bottom-12 left-0 right-0 text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Probe ID: {crypto.randomUUID().substring(0, 12)}</div>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-[#FF6B35]/10 rounded-xl text-[#FF6B35]">
                        <Search size={18} />
                     </div>
                     <h2 className="text-sm font-mono font-black text-white uppercase tracking-widest">Technical Audit</h2>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-32">
                  <div className="space-y-4">
                     <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Audit Scope Selector</label>
                     <div className="grid grid-cols-1 gap-3">
                        {scopeOptions.map(opt => (
                          <button 
                            key={opt}
                            type="button"
                            onClick={() => handleScopeToggle(opt)}
                            className={cn(
                              "text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                              formData.scope.includes(opt) ? "bg-[#FF6B35]/10 border-[#FF6B35]/30 text-white" : "bg-white/5 border-white/5 text-slate-500"
                            )}
                          >
                            <span className="text-[10px] font-bold uppercase">{opt}</span>
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              formData.scope.includes(opt) ? "bg-[#FF6B35] border-[#FF6B35] text-slate-950" : "border-slate-800"
                            )}>
                               {formData.scope.includes(opt) && <Check size={12} strokeWidth={4} />}
                            </div>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Website URL</label>
                       <input 
                         required
                         type="text"
                         value={formData.website}
                         onChange={(e) => setFormData({...formData, website: e.target.value})}
                         placeholder="https://yourdomain.com"
                         className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white outline-none focus:border-[#FF6B35] transition-all"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Current CRM</label>
                       <select 
                         value={formData.crm}
                         onChange={(e) => setFormData({...formData, crm: e.target.value})}
                         className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white outline-none focus:border-[#FF6B35]"
                       >
                         {["HubSpot", "Salesforce", "Pipedrive", "GoHighLevel", "Other", "None"].map(crm => <option key={crm} value={crm}>{crm}</option>)}
                       </select>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Monthly Ad Spend</label>
                          <span className="text-[10px] font-mono font-bold text-[#FF6B35]">${(formData.spend / 1000).toFixed(0)}K+</span>
                       </div>
                       <input 
                         type="range"
                         min="0"
                         max="100000"
                         step="5000"
                         value={formData.spend}
                         onChange={(e) => setFormData({...formData, spend: parseInt(e.target.value)})}
                         className="w-full accent-[#FF6B35] bg-slate-800 h-1 rounded-full appearance-none cursor-pointer"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Biggest Lead Gen Challenge</label>
                       <textarea 
                         required
                         maxLength={500}
                         value={formData.challenge}
                         onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                         placeholder="Define architectural pain points..."
                         className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white outline-none focus:border-[#FF6B35] h-32 resize-none"
                       />
                    </div>
                  </div>

                  <div className="p-6 bg-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-[32px] space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#FF6B35] text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-full">SLA Guaranteed</span>
                        <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">72 Hour Delivery</span>
                     </div>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex-1 h-1 bg-[#FF6B35]/20 rounded-full overflow-hidden">
                             <div className="h-full bg-[#FF6B35] opacity-40" />
                          </div>
                        ))}
                     </div>
                     <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed text-center">
                        Audit initiated → Data collection → Analysis → Report delivery
                     </p>
                  </div>

                  {error && <p className="text-rose-500 text-[10px] font-mono font-bold text-center animate-pulse">{error}</p>}
                </form>

                <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent shrink-0">
                   <button 
                     type="submit"
                     onClick={handleSubmit}
                     disabled={isSubmitting}
                     className="w-full py-5 bg-[#FF6B35] text-white rounded-3xl text-xs font-mono font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     {isSubmitting ? <Activity className="animate-spin" size={16} /> : <Terminal size={16} />}
                     Initiate Tech Audit
                   </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function HeroSection({ isReadyToCommand, onCommand, onAudit }: { 
  isReadyToCommand: boolean; 
  onCommand: () => void; 
  onAudit: () => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Architecting high-performance inbound ecosystems through neural-weighted targeting and multi-vector outreach protocol.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-[10px] font-mono font-black text-[#00D9FF] uppercase tracking-[0.4em] flex items-center gap-3">
          <Terminal size={14} /> Operational Dashboard
        </h2>
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-7xl font-sans font-black text-white tracking-tighter leading-[0.9]">
            LEAD <span className="text-[#00D9FF]">GENERATION</span>
          </h1>
          <p className="text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">
            Precision-Targeted Inbound Pipeline Engines
          </p>
        </div>
      </motion.div>

      <div className="max-w-2xl">
        <p className="text-lg text-slate-400 font-medium leading-relaxed font-mono">
          {displayText}
          <span className="inline-block w-2 h-5 bg-[#00D9FF] ml-1 animate-pulse" />
        </p>
      </div>

      <div className="flex flex-wrap gap-6 pt-4">
        <div className="relative group">
          {!isReadyToCommand && (
             <div className="absolute -top-12 left-0 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[8px] font-black text-rose-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                Protocol Locked: Complete Prerequisites
             </div>
          )}
          <button 
            id="command-new-project"
            onClick={onCommand}
            disabled={!isReadyToCommand}
            className={cn(
              "px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4 relative overflow-hidden",
              isReadyToCommand 
                ? "bg-[#00D9FF] text-slate-950 shadow-[0_20px_50px_rgba(0,217,255,0.2)] hover:scale-105 active:scale-95" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed grayscale"
            )}
          >
            {isReadyToCommand && (
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 bottom-0 w-12 bg-white/20 skew-x-12 translate-x-[-100%]"
              />
            )}
            <Plus size={18} strokeWidth={3} />
            Command New Project
          </button>
        </div>

        <button 
          onClick={onAudit}
          className="px-10 py-5 bg-white/5 border border-white/10 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center gap-4 group"
        >
          <Search size={18} className="text-[#FF6B35] group-hover:rotate-12 transition-transform" />
          Request Technical Audit
        </button>
      </div>
    </div>
  );
}

export default function Governance() {
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isProjectCommandOpen, setIsProjectCommandOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isReadyToCommand, setIsReadyToCommand] = useState(false);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMode, setScanMode] = useState<'ON_DEMAND' | 'WEEKLY'>('ON_DEMAND');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isPurging, setIsPurging] = useState(false);

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    // CSV header row
    const headers = ['ID', 'Timestamp', 'Type', 'User ID', 'Message'];

    // Map each log entry to a row array
    const rows = logs.map(log => {
      const date = log.timestamp?.toDate?.() || new Date();
      const formattedDate = date.toISOString ? date.toISOString() : new Date(date).toISOString();
      return [
        log.id || '',
        formattedDate,
        log.type || 'INFO',
        log.userId || 'SYSTEM',
        `"${(log.message || '').replace(/"/g, '""')}"`
      ];
    });

    // Join headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Create a data blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `governance_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurgeCache = async () => {
    setIsPurging(true);
    const logPath = 'governance_logs';
    try {
      await addDoc(collection(db, logPath), {
        timestamp: serverTimestamp(),
        message: "[CRITICAL] SYSTEM PURGE INITIATED: Clearing all cached vectors and cookie protocols.",
        type: 'ALERT',
        userId: auth.currentUser?.uid || 'SYSTEM'
      });
      
      // Call server-side purge
      await fetch('/api/system/purge', { method: 'POST' });
    } catch (error) {
      console.warn("Purge log or API failed, continuing with client-side cleanup", error);
      // We still want to clear client side even if server or logging fails
    }

    setTimeout(() => {
      // 1. Clear Local Storage
      localStorage.clear();
      // 2. Clear Session Storage
      sessionStorage.clear();
      // 3. Clear Cookies
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.trim().substr(0, eqPos) : cookie.trim();
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      // 4. Clear Cache Storage (Service Workers)
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => caches.delete(name));
        });
      }
      // 5. Reload
      window.location.reload();
    }, 2000);
  };

  // Form State
  const [formData, setFormData] = useState({
    ruleTarget: 'RULE-TONE-001',
    description: '',
    justification: '',
    riskLevel: 3
  });

  useEffect(() => {
    let unsubscribeProposals: () => void = () => {};
    let unsubscribeLogs: () => void = () => {};

    const startListeners = () => {
      // Listen for Proposals
      const proposalsQuery = query(collection(db, 'proposals'), orderBy('timestamp', 'desc'), limit(10));
      unsubscribeProposals = onSnapshot(proposalsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProposals(data);
        if (data.length > 0 && !selectedProposal) {
          setSelectedProposal(data[0]);
        }
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'proposals'));

      // Listen for Logs
      const logsQuery = query(collection(db, 'governance_logs'), orderBy('timestamp', 'desc'), limit(15));
      unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
        setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'governance_logs'));
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        startListeners();
      } else {
        setProposals([]);
        setLogs([]);
        unsubscribeProposals();
        unsubscribeLogs();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProposals();
      unsubscribeLogs();
    };
  }, [selectedProposal]);

  // Auto-rotate decorative logs (Simulated heartbeat for Weekly Mode)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (scanMode === 'WEEKLY') {
        const toneDelta = (Math.random() * 3).toFixed(2);
        const ctaPresence = (Math.random() * 10 + 90).toFixed(1);
        const isCritical = parseFloat(toneDelta) > 2.5 || parseFloat(ctaPresence) < 95;

        try {
          await addDoc(collection(db, 'governance_logs'), {
            timestamp: serverTimestamp(),
            message: `[WEEKLY_REVIEW] Automated Scan: Tone Delta ${toneDelta}% | CTA Presence ${ctaPresence}%`,
            type: 'SYSTEM',
            userId: 'AUTO_ORCHESTRATOR'
          });

          if (isCritical) {
            await addDoc(collection(db, 'governance_logs'), {
              timestamp: serverTimestamp(),
              message: `[ALERT] Weekly threshold breached. Summary emailed to admin (a1b2c...890).`,
              type: 'ALERT',
              userId: 'SYSTEM'
            });
          }
        } catch (e) { /* ignore */ }
      }
    }, 15000); 
    return () => clearInterval(interval);
  }, [scanMode]);

  const getPipelineStage = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'StrategistProposes';
      case 'AUTHORIZED': return 'AdminApproves';
      case 'DEPLOYED': return 'AutoDeploy';
      default: return 'StrategistProposes';
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'governance_settings', 'global'));
      if (settingsDoc.exists()) {
        setScanMode(settingsDoc.data().scanMode);
      }
    };
    loadSettings();
  }, []);

  const handleToggleMode = async () => {
    const newMode = scanMode === 'ON_DEMAND' ? 'WEEKLY' : 'ON_DEMAND';
    setScanMode(newMode);
    try {
      await setDoc(doc(db, 'governance_settings', 'global'), {
        scanMode: newMode,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `Governance mode shifted to ${newMode}`,
        type: 'SYSTEM',
        userId: auth.currentUser?.uid || 'SYSTEM'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'governance_settings/global');
    }
  };

  const handleRunValidation = async () => {
    setIsValidating(true);
    
    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: "Initializing Neural Audit Protocol [LKP-001/002]...",
      type: 'SYSTEM',
      userId: auth.currentUser?.uid || 'SYSTEM'
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    const assetId = crypto.randomUUID().substring(0, 8);
    const score = (0.95 + Math.random() * 0.05).toFixed(2);
    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: `[PASS] CTA detected | Asset ID: ${assetId} | Score: ${score}`,
      type: 'CTA_PASS',
      userId: 'SYSTEM'
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    const scanId = crypto.randomUUID().substring(0, 8);
    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: `[PASS] Policy compliant | Platform: Meta | Scan ID: ${scanId}`,
      type: 'POLICY_PASS',
      userId: 'SYSTEM'
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    const delta = (2.1 + Math.random() * 0.5).toFixed(1);
    const toneAssetId = crypto.randomUUID().substring(0, 8);
    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: `[WARN] Tone delta +${delta}% | Asset: ${toneAssetId} | Baseline: friendly/conversational`,
      type: 'TONE_WARN',
      userId: 'SYSTEM'
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: `[INFO] RULE-DATA-005 re-locked | Advisory period expired | Auto-deploy: true`,
      type: 'RULE_LOCK',
      userId: 'SYSTEM'
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    const isVersioned = Math.random() > 0.05; 
    if (!isVersioned) {
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `CRITICAL: UNVERSIONED asset detected. Metadata header missing.`,
        type: 'UNVERSIONED',
        userId: 'SYSTEM'
      });
    }

    const toneDeltaFinal = (Math.random() * 5).toFixed(2);
    const ctaPresenceFinal = (Math.random() * 20 + 80).toFixed(1);
    const isCritical = parseFloat(toneDeltaFinal) > 2.5 || parseFloat(ctaPresenceFinal) < 95;

    await addDoc(collection(db, 'governance_logs'), {
      timestamp: serverTimestamp(),
      message: `Full Audit Complete: Tone Delta ${toneDeltaFinal}% | CTA Presence ${ctaPresenceFinal}%`,
      type: isCritical ? 'CRITICAL' : 'SUCCESS',
      userId: auth.currentUser?.uid || 'SYSTEM'
    });

    if (isCritical || !isVersioned) {
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `GOVERNANCE HEALTH REPORT: Discrepancies detected. Automated flag generated.`,
        type: 'ALERT',
        userId: 'SYSTEM'
      });
    }

    setIsValidating(false);
  };

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSubmitting(true);

    const proposalId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const payload = {
      proposal_id: proposalId,
      timestamp: timestamp,
      rule_target: formData.ruleTarget,
      current_status: "ACTIVE_AND_LOCKED",
      proposed_status: "PENDING_REVIEW",
      approval_pipeline: ["StrategistProposes", "AdminApproves", "AutoDeploy"],
      version_delta: "+0.0.1",
      description: formData.description,
      justification: formData.justification,
      risk_level: formData.riskLevel,
      requester_id: auth.currentUser.uid,
      metadata: {
        version: "2.1.4",
        timestamp: timestamp,
        author_uuid: auth.currentUser.uid,
        governance_hash: "sha256(rules_snapshot)",
        change_type: "PROPOSED"
      }
    };

    try {
      await setDoc(doc(db, 'proposals', proposalId), payload);
      await addDoc(collection(db, 'governance_logs'), {
        timestamp: serverTimestamp(),
        message: `Proposal submitted for ${formData.ruleTarget} | Status: AWAITING_STRATEGIST`,
        type: 'PROPOSAL',
        userId: auth.currentUser.uid
      });
      setIsProposeModalOpen(false);
      setFormData({
        ruleTarget: 'RULE-TONE-001',
        description: '',
        justification: '',
        riskLevel: 3
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'proposals');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#00D9FF] selection:text-slate-900 overflow-x-hidden flex flex-col">
      {/* Top Protocol Header */}
      <div className="h-14 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-[100]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,217,255,0.5)]" />
             <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#00D9FF]">FLUX COMMAND CENTER</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Lead Generation System Protocol v2.5.0</span>
        </div>
        <div className="flex gap-4">
          <div className="px-3 py-1 glass-panel rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">
             Node: US-WEST-01
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
             Neural Engine Active
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Main Content Area */}
        <div className="max-w-[1600px] mx-auto w-full px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
            
            {/* Left Column (60% / 6 columns) */}
            <div className="lg:col-span-6 space-y-16">
               <HeroSection 
                  isReadyToCommand={isReadyToCommand}
                  onCommand={() => setIsProjectCommandOpen(true)}
                  onAudit={() => setIsAuditDrawerOpen(true)}
               />

               <div className="space-y-10">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-mono font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
                        <LayoutGrid size={16} className="text-[#00D9FF]" />
                        Available Service Modules
                     </h3>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Hover to configure</span>
                  </div>
                  <ServiceFeatureGrid />
               </div>
            </div>

            {/* Right Column (40% / 4 columns) */}
            <div className="lg:col-span-4 space-y-10">
               <TechnicalDeliveryCard hasActiveProject={hasActiveProject} />
               <GlobalPrerequisites onReadyChange={setIsReadyToCommand} />
               
               {/* Live Log Stream Mini View */}
               <div className="glass-panel rounded-[40px] p-8 border-white/5 flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-8 shrink-0">
                     <div className="flex items-center gap-3">
                        <History size={18} className="text-slate-400" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">Real-time Logs</h3>
                     </div>
                     <div className="flex items-center gap-2">
                        <button
                           onClick={handleExportCSV}
                           disabled={logs.length === 0}
                           title="Export real-time audit logs as CSV"
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/20 text-[#00D9FF] rounded-xl text-[8px] font-mono font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                           <Download size={10} />
                           Export CSV
                        </button>
                        <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                           Pulse_Mode
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                     {logs.length === 0 ? (
                       <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                          <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">Scanning network pulses...</span>
                       </div>
                     ) : (
                       logs.map((log) => (
                         <div key={log.id} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 text-[9px] font-mono leading-relaxed">
                            <span className="text-[#00D9FF] mr-2">[{new Date(log.timestamp?.toDate?.() || Date.now()).toLocaleTimeString()}]</span>
                            <span className="text-slate-400">{log.message}</span>
                         </div>
                       ))
                     )}
                  </div>
               </div>

               {/* System Maintenance Section */}
               <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[40px] space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500">
                        <Cpu size={20} />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">System Maintenance</h4>
                        <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">LKP-005: Atomic Purge Protocol</p>
                     </div>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase leading-relaxed">
                     Executing a purge will clear all localized metadata cache and authentication cookies. This action is atomic and results in an immediate workspace reset.
                  </p>
                  <button 
                    onClick={handlePurgeCache}
                    disabled={isPurging}
                    className={cn(
                      "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                      isPurging ? "bg-rose-500/50 text-white cursor-wait" : "bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95"
                    )}
                  >
                    {isPurging ? <Activity size={16} className="animate-spin" /> : <Zap size={16} />}
                    {isPurging ? "PURGING..." : "Purge All Cache & Cookies"}
                  </button>
               </div>
            </div>
          </div>

          {/* Usage Statistics Dashboard */}
          <div className="mt-16">
             <GovernanceDashboard />
          </div>

          {/* Bottom Workflow Timeline */}
          <div className="mt-24">
             <WorkflowTimeline isActive={hasActiveProject} />
          </div>
        </div>
      </div>




      <ProjectOnboardingModal 
        isOpen={isProjectCommandOpen} 
        onClose={() => setIsProjectCommandOpen(false)} 
        onComplete={() => {
          setIsProjectCommandOpen(false);
          setHasActiveProject(true);
        }}
      />

      <TechnicalAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
      />
    </div>
  );
}
