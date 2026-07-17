import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  BookOpen, 
  Users, 
  Zap, 
  Target, 
  Search, 
  Mail,
  ChevronRight, 
  Code, 
  BrainCircuit, 
  ShoppingCart, 
  Smile, 
  Lock,
  MessageSquare,
  Award,
  Star,
  Gift,
  Activity,
  Terminal,
  ArrowRightLeft,
  Scale,
  FileText,
  ShieldCheck,
  Plus,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { achievementSystem, educationalContent, communityFeatures } from '../data/engagementData';
import { LoyaltyAgentService, AgentHandoff, AgentRole } from '../services/loyaltyAgentService';

const iconMap: Record<string, any> = {
  Zap, Code, Target, Smile, ShoppingCart, BrainCircuit, Search, Users
};

export default function EngagementHub() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'academy' | 'community' | 'system' | 'legal'>('achievements');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [handoffs, setHandoffs] = useState<AgentHandoff[]>([]);
  const [loyaltyState, setLoyaltyState] = useState(LoyaltyAgentService.getInstance().getState());

  useEffect(() => {
    setLoyaltyState(LoyaltyAgentService.getInstance().getState());
  }, []);

  const triggerOrchestration = async (action: string, xp: number) => {
    setIsOrchestrating(true);
    
    // Trigger Mesh Sync if it's a system initialization
    if (action.includes('Initialize System Module')) {
      try {
        await fetch('/api/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'engagement.agent_mesh_sync',
            params: { timestamp: new Date().toISOString() },
            id: Date.now()
          })
        });
      } catch (e) {
        console.error("Mesh sync failed", e);
      }
    }

    const result = await LoyaltyAgentService.getInstance().processAction(action, { xp });
    setHandoffs(result);
    setLoyaltyState({ ...LoyaltyAgentService.getInstance().getState() });
    setIsOrchestrating(false);
  };

  const quizQuestions = [
    { q: "What is the primary factor in Shopify Core Web Vitals?", a: ["LCP", "FID", "CLS", "All of the above"] },
    { q: "Which neural model is best for ad copy generation?", a: ["Gemini 1.5", "GPT-3.5", "LLaMA 2", "Claude 2"] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
        <AnimatePresence>
          {isQuizOpen && (
            <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-[40px] p-10 w-full max-w-xl shadow-2xl border border-white/20"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Neural Assessment Phase {quizStep + 1}</span>
                  <button onClick={() => setIsQuizOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><Zap className="rotate-45" size={20} /></button>
                </div>
                
                {quizStep < quizQuestions.length ? (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-display font-bold leading-tight">{quizQuestions[quizStep].q}</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[quizStep].a.map((opt, i) => (
                        <button 
                          key={i}
                          onClick={() => setQuizStep(quizStep + 1)}
                          className="w-full p-5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-500 hover:text-white border border-slate-100 dark:border-slate-800 rounded-2xl text-left font-bold transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6 py-10">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-bold uppercase">Assessment Verified</h2>
                    <p className="text-slate-500 font-medium">+250 Knowledge Points deployed to your profile.</p>
                    <button onClick={async () => { 
                      setIsQuizOpen(false); 
                      setQuizStep(0);
                      await triggerOrchestration('Assessment Verified', 250);
                    }} className="px-10 py-4 bg-[#FF6B00] text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl">Secure Points</button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="px-2">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                 <Trophy size={24} />
              </div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Loyalty & Growth</span>
           </div>
           <div className="flex justify-between items-end">
             <div>
               <h1 className="text-4xl font-display font-bold tracking-tight uppercase">Engagement Hub</h1>
               <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium italic">System Status: A2A_HANDOFF_IN_PROGRESS | ORCHESTRATION SYNC ACTIVE | LEDGER: IMMUTABLE</p>
             </div>
             <div className="flex items-end gap-4">
               <button 
                  id="BTN-TRIGGER-002"
                  onClick={() => alert('Neural Email Sequence Triggered. Monitoring segment engagement...')}
                  className="group relative px-6 py-3 bg-[#FF6B00] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 transition-all overflow-hidden"
               >
                  <div className="absolute inset-0 bg-white transform translate-y-full group-active:translate-y-0 transition-transform duration-75 opacity-10" />
                  <Mail size={16} className="inline mr-2" /> Trigger Sequence
               </button>
               <div className="hidden md:flex flex-col items-end gap-2 text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orchestration status</span>
                <div className="flex items-center gap-2">
                   <div className={cn("w-2 h-2 rounded-full", isOrchestrating ? "bg-orange-500 animate-pulse" : "bg-emerald-500")} />
                   <span className="text-xs font-mono font-bold tracking-tighter">{isOrchestrating ? 'A2A_HANDOFF_IN_PROGRESS' : 'AGENTS_STANDBY'}</span>
                </div>
               </div>
             </div>
           </div>
         </div>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
           {(['achievements', 'academy', 'community', 'legal', 'system'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Final Agent Message Display */}
        <AnimatePresence>
          {handoffs.length > 0 && !isOrchestrating && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2"
            >
              <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Terminal: OutputAgent</span>
                    <Activity size={14} className="text-indigo-200" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                     <BrainCircuit size={20} /> Neural Synthesis
                  </h3>
                  <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/10 font-sans text-sm leading-relaxed markdown-report">
                    <ReactMarkdown>
                      {handoffs.find(h => h.source === 'OUTPUT_AGENT' || h.source === AgentRole.OUTPUT)?.payload.message || ''}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="absolute top-0 left-0 -ml-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent Orchestration Live Feed - Only show when active or has recent */}
        <AnimatePresence>
          {(isOrchestrating || handoffs.length > 0) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-2"
            >
              <div className="card-agency p-6 bg-slate-950 border-slate-800 text-white overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Agent-to-Agent Mesh Feed</span>
                  </div>
                  {isOrchestrating && <Activity size={14} className="text-orange-500 animate-pulse" />}
                </div>
                <div className="space-y-1 font-mono">
                  {handoffs.map((handoff, i) => {
                    const taskType = (handoff.payload?.context?.intent || handoff.payload?.operation || handoff.payload?.lesson_event?.lesson_id || "A2A_MESH_SIGNAL").toLowerCase();
                    const status = (handoff.payload?.status || (handoff.target === 'OUTPUT_AGENT' ? "COMPLETED" : "TRIGGERED")).toLowerCase();
                    // Format: 2026-04-28T18:11:32Z
                    const timestamp = handoff.timestamp.replace(/\.\d{3}Z$/, 'Z');
                    const source = handoff.source.replace('Agent', '').replace('_AGENT', '').toUpperCase();
                    const target = handoff.target.replace('Agent', '').replace('_AGENT', '').toUpperCase();

                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-[9px] flex items-center gap-3 whitespace-nowrap overflow-hidden py-0.5 border-b border-white/5 last:border-0"
                      >
                        <span className="text-slate-500 shrink-0">{timestamp}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-orange-400 font-bold w-20 text-right">{source}</span>
                          <span className="text-slate-600">→</span>
                          <span className="text-indigo-400 font-bold w-20 text-left">{target}</span>
                        </div>
                        <span className="text-slate-700 shrink-0">|</span>
                        <span className="text-emerald-500 font-medium w-32 truncate shrink-0">{taskType}</span>
                        <span className="text-slate-700 shrink-0">|</span>
                        <span className="text-blue-400 font-black shrink-0 tracking-widest">{status}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
           {activeTab === 'achievements' ? (
             <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <StatCard label="Total Points" value={loyaltyState.points.toLocaleString()} icon={Zap} color="text-orange-500" />
                   <StatCard label="Current Level" value={`${loyaltyState.tier} (${loyaltyState.mappedTier})`} icon={Award} color="text-blue-500" />
                   <StatCard label="Rank" value="#124" icon={Trophy} color="text-emerald-500" />
                   <StatCard label="XP to Next" value={(50000 - loyaltyState.points).toLocaleString()} icon={Star} color="text-purple-500" />
                </div>

                <div className="card-agency p-8 bg-slate-950 border-slate-800 text-white">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                         <h3 className="text-sm font-black uppercase tracking-[0.2em]">Achievement Protocols</h3>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">A2A_DELEGATION_ENABLED</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => triggerOrchestration('View Achievement Progress', 0)}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-left flex flex-col gap-2 group"
                      >
                         <div className="flex items-center justify-between">
                            <Activity size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            <ArrowRightLeft size={12} className="text-slate-600" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">View Progress</span>
                         <p className="text-[9px] text-slate-500 leading-tight">Sector-specific visual progress mapping delegate.</p>
                      </button>

                      <button 
                        onClick={() => triggerOrchestration('Claim Reward/Badge', 0)}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/40 transition-all text-left flex flex-col gap-2 group"
                      >
                         <div className="flex items-center justify-between">
                            <Gift size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                            <ArrowRightLeft size={12} className="text-slate-600" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Claim Reward</span>
                         <p className="text-[9px] text-slate-500 leading-tight">Immutable reward verification & NFT minting node.</p>
                      </button>

                      <button 
                        onClick={() => triggerOrchestration('Leaderboard Refresh', 0)}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left flex flex-col gap-2 group"
                      >
                         <div className="flex items-center justify-between">
                            <Users size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <ArrowRightLeft size={12} className="text-slate-600" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Refresh Leaderboard</span>
                         <p className="text-[9px] text-slate-500 leading-tight">Multi-sector engagement ranking synchronization.</p>
                      </button>
                   </div>
                </div>

                <div className="card-agency p-8">
                   <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                      <Award className="text-[#FF6B00]" /> Achievement Badges
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {achievementSystem.badges.map((badge, i) => {
                        const Icon = iconMap[badge.icon] || Zap;
                        const isOwned = loyaltyState.badges.includes(badge.name);
                        return (
                          <div 
                            key={i} 
                            onClick={() => !isOwned && triggerOrchestration(`Unlock Badge: ${badge.name}`, 1000)}
                            className={cn(
                              "p-6 rounded-3xl border text-center group transition-all cursor-crosshair",
                              isOwned ? "bg-orange-500/5 border-orange-500/20" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-[#FF6B00]/30"
                            )}
                          >
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all",
                               isOwned ? "bg-orange-500 text-white border-orange-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 group-hover:scale-110"
                             )}>
                                <Icon size={24} className={isOwned ? "text-white" : "text-slate-400 group-hover:text-[#FF6B00]"} />
                             </div>
                             <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                             <p className="text-[10px] text-slate-400 leading-relaxed">{badge.description}</p>
                             {isOwned && (
                               <div className="mt-4 flex items-center justify-center gap-1 text-[8px] font-bold text-orange-500 uppercase">
                                 <Activity size={10} /> Verified by LedgerAgent
                               </div>
                             )}
                          </div>
                        );
                      })}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8">Leaderboard Categories</h3>
                      <div className="space-y-4">
                         {achievementSystem.leaderboards.map((lb, i) => (
                            <div 
                              key={i} 
                              onClick={() => triggerOrchestration(`Leaderboard Access: ${lb}`, 50)}
                              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-orange-500/30 transition-all font-sans"
                            >
                               <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{lb}</span>
                               <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full">Active</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#020617] rounded-[32px] p-8 text-white">
                      <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
                         <Gift className="text-[#FF6B00]" /> Rewards Catalog
                      </h3>
                      <div className="space-y-4 font-sans">
                          <RewardItem label="$500 Ad Credit" cost="5,000 pts" locked onClaim={() => triggerOrchestration('Reward Claim: Ad Credit', 0)} />
                          <RewardItem label="Expert SEO Site Audit" cost="12,000 pts" locked onClaim={() => triggerOrchestration('Reward Claim: SEO Audit', 0)} />
                          <RewardItem label="Custom UI Kit (Figma)" cost="3,000 pts" onClaim={() => triggerOrchestration('Reward Claim: UI Kit', 0)} />
                          <RewardItem label="Flux Swag Bundle" cost="2,500 pts" onClaim={() => triggerOrchestration('Reward Claim: Swag', 0)} />
                      </div>
                   </div>
                </div>
             </motion.div>
           ) : activeTab === 'academy' ? (
              <motion.div key="academy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="card-agency p-8 bg-slate-950 border-slate-800 text-white">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Academy Protocols</h3>
                       </div>
                       <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">A2A_DELEGATION_ENABLED</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <button 
                         onClick={() => triggerOrchestration('Browse Courses', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Search size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Browse Catalog</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Query course catalog & learning paths.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Start Lesson: L-204', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <BookOpen size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Start Lesson</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Initialize progress tracker node.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Take Assessment', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-500/10 hover:border-purple-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Zap size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Take Quiz</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Generate adaptive A2A-graded quiz.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Generate Certificate', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Award size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Mint Credential</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Verify via ledger & mint certificate.</p>
                       </button>
                    </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {educationalContent.courses.map(course => (
                      <div 
                        key={course.id} 
                        onClick={() => triggerOrchestration(`Course Init: ${course.title}`, 100)}
                        className="card-agency p-8 group hover:border-[#0088CC]/30 transition-all cursor-pointer font-sans"
                      >
                         <div className="mb-6 flex justify-between items-start">
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase rounded-lg">{course.level}</span>
                            <BookOpen size={16} className="text-slate-200 group-hover:text-blue-500 transition-all" />
                         </div>
                         <h4 className="font-bold text-lg mb-4 leading-tight">{course.title}</h4>
                         <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>{course.lessons} LESSONS</span>
                            <ChevronRight size={14} />
                         </div>
                      </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h3 className="text-xl font-bold uppercase mb-8">Certification Programs</h3>
                      <div className="space-y-4">
                         {educationalContent.certificationTypes.map((cert, i) => (
                            <div 
                              key={i} 
                              onClick={() => triggerOrchestration(`Certification Path: ${cert}`, 200)}
                              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-indigo-500/5 transition-all border border-transparent hover:border-indigo-500/20 font-sans"
                            >
                               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                                  <Award size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold">{cert}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Industry Standard</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="card-agency p-8 flex flex-col justify-center text-center bg-indigo-600 text-white border-none relative overflow-hidden">
                      <div className="relative z-10">
                         <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-indigo-200">Knowledge Bank</h4>
                         <p className="text-4xl font-display font-bold mb-2">{educationalContent.quizCount}+</p>
                         <p className="text-sm font-medium text-indigo-100 opacity-80">Interactive quizzes and flashcards available for tactical mastery.</p>
                         <button 
                         onClick={() => setIsQuizOpen(true)}
                         className="mt-8 px-8 py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
                       >
                         Start Prep
                       </button>
                      </div>
                      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                   </div>
                </div>
             </motion.div>
            ) : activeTab === 'community' ? (
              <motion.div key="community" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="card-agency p-8 bg-slate-950 border-slate-800 text-white mb-8">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Community Protocols</h3>
                       </div>
                       <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">A2A_DELEGATION_ENABLED</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <button 
                         onClick={() => triggerOrchestration('Join Discussion', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-500/10 hover:border-purple-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <MessageSquare size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Join Thread</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Load context & contribute to threads.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Start New Topic', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Plus size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">New Topic</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Generate SEO-optimized discussion.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Find Collaborators', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Users size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Find Partners</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Mesh-sync skills with community needs.</p>
                       </button>

                       <button 
                         onClick={() => triggerOrchestration('Event Registration', 0)}
                         className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-left flex flex-col gap-2 group"
                       >
                          <Calendar size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Register Event</span>
                          <p className="text-[9px] text-slate-500 leading-tight">Trigger reminder & ledger sync.</p>
                       </button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="card-agency p-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Nexus Forum Categories</h4>
                      <div className="space-y-3">
                         {communityFeatures.forumCategories.map((cat, i) => (
                            <div 
                              key={i} 
                              onClick={() => triggerOrchestration(`Forum Access: ${cat.name}`, 10)}
                              className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group font-sans"
                            >
                               <div className="flex items-center gap-4">
                                  <MessageSquare size={18} className="text-slate-300 group-hover:text-orange-500" />
                                  <span className="text-sm font-bold">{cat.name}</span>
                               </div>
                               <span className="text-[10px] font-bold text-slate-400">{cat.threads} threads</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="card-agency p-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Expert Q&A Availability</h4>
                      <div className="space-y-6">
                         {communityFeatures.expertQA.map((exp, i) => (
                            <div 
                              key={i} 
                              onClick={() => exp.available ? triggerOrchestration(`Expert Connect: ${exp.expert}`, 150) : alert(`${exp.expert} is busy.`)}
                              className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950 p-2 rounded-2xl transition-all font-sans"
                            >
                               <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                  <img src={`https://i.pravatar.cc/150?u=${exp.expert}`} alt={exp.expert} />
                                </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                     <h5 className="text-sm font-bold">{exp.expert}</h5>
                                     {exp.available ? (
                                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                     ) : (
                                       <span className="text-[8px] font-bold text-slate-400 uppercase">Offline</span>
                                     )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{exp.role}</p>
                               </div>
                               <button className="p-2 text-slate-300 hover:text-orange-500"><ChevronRight size={18} /></button>
                            </div>
                         ))}
                      </div>
                      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                         <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Next Webinar: Tomorrow @ 11AM PST</p>
                      </div>
                   </div>
                </div>

                <div className="bg-[#FF6B00] rounded-[32px] p-12 text-white text-center">
                   <h3 className="text-3xl font-display font-bold uppercase mb-4 italic">Sovereign Referral Program</h3>
                   <p className="text-orange-100 mb-8 max-w-xl mx-auto font-medium">Help other brands scale and secure your rewards.</p>
                   <div className="inline-flex items-center gap-8 p-6 bg-white/10 rounded-3xl border border-white/20">
                      <div>
                         <p className="text-3xl font-bold">$500</p>
                         <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">CASH CREDIT</p>
                      </div>
                      <div className="w-px h-12 bg-white/20" />
                      <button onClick={() => triggerOrchestration('Referral Action', 500)} className="px-8 py-3 bg-white text-[#FF6B00] rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Copy Invite Link</button>
                   </div>
                </div>
             </motion.div>
           ) : activeTab === 'legal' ? (
              <motion.div key="legal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 px-2 text-slate-900 dark:text-white">
                <div className="card-agency p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                         <Scale size={28} className="text-indigo-500" /> Legal Repository
                      </h2>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Compliance & Governance Protocol A2A</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Verbatim Authority Active</span>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'DOC_01', title: 'Accessibility Statement', icon: FileText, color: 'text-blue-500' },
                      { id: 'DOC_02', title: 'Anti-Spam Policy', icon: ShieldCheck, color: 'text-emerald-500' },
                      { id: 'DOC_03', title: 'Payment Security Disclosure', icon: Zap, color: 'text-orange-500' },
                      { id: 'DOC_04', title: 'Data Retention Policy', icon: Activity, color: 'text-indigo-500' },
                      { id: 'DOC_05', title: 'Incident Response Plan', icon: Terminal, color: 'text-rose-500' },
                      { id: 'DOC_06', title: 'Custom Service Agreement', icon: Award, color: 'text-amber-500' },
                    ].map((doc) => (
                      <div key={doc.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 transition-all hover:border-slate-300 dark:hover:border-white/10 group overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn("p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm", doc.color)}>
                            <doc.icon size={18} />
                          </div>
                          <span className="text-[10px] font-black font-mono text-slate-400">{doc.id}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-6 leading-tight h-10">{doc.title}</h4>
                        <button 
                          onClick={() => triggerOrchestration(`Retrieve verbatim legal authority for ${doc.id}: ${doc.title}`, 0)}
                          disabled={isOrchestrating}
                          className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                        >
                          Query Registry
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Expert Delegation Protocols</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                          onClick={() => triggerOrchestration('View ToS Summary / Terms', 0)}
                          className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all text-left flex flex-col gap-2 group"
                        >
                           <Search size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-900 dark:group-hover:text-white">View Terms</span>
                           <p className="text-[9px] text-slate-500 leading-tight">Generate plain-language summary of TOS.</p>
                        </button>

                        <button 
                          onClick={() => triggerOrchestration('Privacy Policy Data Inventory', 0)}
                          className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all text-left flex flex-col gap-2 group"
                        >
                           <Lock size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-900 dark:group-hover:text-white">Privacy Policy</span>
                           <p className="text-[9px] text-slate-500 leading-tight">Export personal data inventory & policy.</p>
                        </button>

                        <button 
                          onClick={() => triggerOrchestration('Generate Custom Contract Template', 0)}
                          className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all text-left flex flex-col gap-2 group"
                        >
                           <Plus size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-900 dark:group-hover:text-white">Generate Contract</span>
                           <p className="text-[9px] text-slate-500 leading-tight">Initialize customized agreement draft.</p>
                        </button>

                        <button 
                          onClick={() => triggerOrchestration('Compliance Audit Check', 0)}
                          className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all text-left flex flex-col gap-2 group"
                        >
                           <Target size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-900 dark:group-hover:text-white">Compliance Check</span>
                           <p className="text-[9px] text-slate-500 leading-tight">Audit operations against regulations.</p>
                        </button>
                     </div>
                  </div>
  
                  <div className="mt-8 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity size={16} className="text-indigo-500" />
                      <h5 className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-500">LegalContactAgent Protocol</h5>
                    </div>
                    <p className="text-xs text-slate-500">For unresolved governance queries or specific MSA/SOW escalations, the Orchestrator will autonomously co-trigger individual merchant reviews via LegalContactAgent.</p>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'system' ? (
            <motion.div key="system" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 px-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-agency p-8 bg-slate-950 border-slate-800 text-white font-mono">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Terminal size={18} className="text-orange-500" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">A2A Protocol Configuration</h3>
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">Flux Hub Orchestrator v2.6.4</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                    <pre className="text-[10px] text-blue-300/80 leading-relaxed">
{JSON.stringify({
  "name": "flux-engagement-hub-orchestrator",
  "description": "Central orchestrator for Engagement Hub with 5 sector agents and immutable ledger sync",
  "version": "2026.4.28",
  "endpoint": "https://flux-agency.a2a/v1/engagement-hub",
  "capabilities": {
    "sectors": ["achievements", "academy", "community", "legal", "system"],
    "automation": ["trigger_sequences", "agent_mesh_sync", "predictive_scaling"],
    "ledger": ["immutable_history", "on_chain_sync", "audit_trail"]
  },
  "authentication": {
    "type": "OAuth2",
    "scopes": ["engagement.read", "engagement.write", "ledger.sync", "mesh.feed"]
  },
  "modalities": ["text", "json", "markdown", "structured_data", "event_stream"]
}, null, 2)}
                    </pre>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                       <p className="text-xs text-slate-400 mb-4 tracking-tight leading-relaxed">Execute a multi-agent workflow sequence across the Mesh or force a full state reconciliation.</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={() => triggerOrchestration('TRIGGER SEQUENCE', 250)}
                            disabled={isOrchestrating}
                            className="py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                          >
                            <Zap size={16} />
                            Trigger Sequence
                          </button>
                          <button 
                            onClick={() => triggerOrchestration('SYNCHRONIZE AGENTS', 150)}
                            disabled={isOrchestrating}
                            className="py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowRightLeft size={16} />
                            Sync Agents
                          </button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-[9px] text-slate-500 block mb-1">CORTEX_UPTIME</span>
                          <span className="text-xs font-bold text-emerald-400">99.98%</span>
                       </div>
                       <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-[9px] text-slate-500 block mb-1">MAPPING_EFFICIENCY</span>
                          <span className="text-xs font-bold text-orange-400">8.4x</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="card-agency p-8 font-sans">
                  <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                     <Activity size={20} className="text-indigo-500" /> AUTOMATION MATRIX
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "High-Intensity Mode", desc: "Enable aggressive scaling notifications", id: "sys-toggle-him" },
                      { label: "Immutable History", desc: "Sync all transactions to on-chain ledger", id: "sys-toggle-ih" },
                      { label: "Agent Hot-Swapping", desc: "Allow autonomous intent routing", id: "sys-toggle-hs" },
                      { label: "Predictive Scaling", desc: "Auto-trigger ScalingAgent on revenue signals", id: "sys-toggle-ps" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                         <div>
                            <p className="text-sm font-bold">{item.label}</p>
                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                         </div>
                         <button 
                           onClick={() => triggerOrchestration(`Toggle: ${item.label}`, 50)}
                           className={cn("w-10 h-6 rounded-full p-1 transition-colors relative", "bg-orange-500")}
                         >
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-5")} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card-agency p-6 text-center">
       <div className={cn("inline-flex p-3 rounded-2xl mb-4", color.replace('text-', 'bg-') + '/10', color)}>
          <Icon size={20} />
       </div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h4 className="text-2xl font-bold tracking-tight uppercase">{value}</h4>
    </div>
  );
}

function RewardItem({ label, cost, locked, onClaim }: any) {
  return (
    <div 
      onClick={() => onClaim?.()}
      className={cn(
        "flex justify-between items-center p-4 bg-white/5 rounded-2xl border transition-all font-sans",
        locked ? "border-white/5 opacity-50 cursor-not-allowed" : "border-white/10 hover:border-[#FF6B00]/30 cursor-pointer"
      )}>
       <div className="flex items-center gap-3">
          {locked ? <Lock size={14} className="text-white/30" /> : <Gift size={14} className="text-orange-500" />}
          <span className="text-sm font-medium">{label}</span>
       </div>
       <span className="text-[10px] font-bold text-white/50">{cost}</span>
    </div>
  );
}
