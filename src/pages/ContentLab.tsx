import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Sparkles, 
  Zap, 
  Send, 
  Copy, 
  CheckCircle2, 
  MessageSquare,
  FileText,
  Target,
  Layers,
  ChevronRight,
  Lightbulb,
  Wand2,
  Loader2,
  ShieldCheck,
  Brain,
  History,
  Activity,
  UserCheck,
  Flame,
  Scale,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { adHeadlineFormulas } from '../data/creativeToolsData';
import { FunctionCallingService } from '../services/functionCallingService';
import { LoyaltyAgentService, AgentHandoff } from '../services/loyaltyAgentService';

export default function ContentLab() {
  const [activeTab, setActiveTab] = useState<'writer' | 'formulas' | 'narrative' | 'voice' | 'psychology'>('writer');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<any>(null);
  const [logs, setLogs] = useState<AgentHandoff[]>([]);
  const [isActivating, setIsActivating] = useState<string | null>(null);

  const handleMeshAction = async (intent: string, action: string) => {
    setIsActivating(intent);
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction(action);
    setLogs(prev => [...meshLogs, ...prev]);
    setIsActivating(null);
  };

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setStructuredOutput(null);

    // 1. Log to mesh and process action
    const mesh = LoyaltyAgentService.getInstance();
    const meshLogs = await mesh.processAction(prompt);
    setLogs(prev => [...meshLogs, ...prev]);
    
    // Find the final synthesis if it exists
    const finalOutput = meshLogs.find(l => l.source === 'OUTPUT_AGENT' && l.target === 'ORCHESTRATOR_AGENT')?.payload?.message;
    
    // Simulate generation and validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Determine the type of output to show based on the prompt/intent
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('sales page') || lowerPrompt.includes('generate_sales_page')) {
      const salesData = {
        type: 'sales_page',
        headline: "The Zero-Latency Scale: From $0 to $10M ARR",
        subheadline: "Stop fighting your infrastructure. Start dominating your market with the Flux Neural Mesh.",
        sections: [
          { title: "The Problem", content: "Most marketing teams spend 80% of their time on manual operations and 20% on strategy. We've flipped the script." },
          { title: "The Solution", content: "Flux Agency provides an autonomous A2A protocol that manages your SEO, PPC, and Creative synthesis while you sleep." },
          { title: "The Transformation", content: "Imagine a world where your creative variants are generated, tested, and optimized in a Bayesian loop before your morning coffee." }
        ],
        cta: "Request Early Access to V4"
      };
      setStructuredOutput(salesData);
    } else if (lowerPrompt.includes('email') || lowerPrompt.includes('generate_email_sequence')) {
      const emailData = {
        type: 'email_sequence',
        subject: "Phase 1: The Technical Debt Tax [Action Required]",
        body: "Hey there,\n\nDid you know the average enterprise wastes $2.4M annually on mismanaged ad-spend loops?\n\nThat's not just a statistic—it's a tactical vulnerability.\n\nOur latest whitepaper deconstructs how to patch these leaks using the Neural Mesh.\n\nRead more below.",
        sequence_info: "Email 1 of 5 | Nurture Sequence"
      };
      setStructuredOutput(emailData);
    } else {
      const adCopyData = {
        type: 'ad_copy',
        headline: "Scale Your SaaS to $10M ARR",
        description: "Our neural infrastructure handles the heavy lifting while you focus on roadmap innovation.",
        cta_text: "Deploy Now",
        target_audience: "CTOs & Engineering Leads",
        platform: "LinkedIn" as const,
        tone: "Authoritative & Technical",
        keywords: ["Scaling", "Neural", "Infrastructure"],
        compliance_flags: ["GDPR Ready", "AI Act Compliant"]
      };
      setStructuredOutput(adCopyData);
    }

    setIsGenerating(false);
  };

  const insertCommand = (cmd: string) => {
    setPrompt(cmd);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 flex items-center gap-2">
                <Sparkles size={12} className="text-orange-500" />
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Neural Engineering Engine</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Content <span className="text-slate-300 dark:text-slate-800">Architecture</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">High-conversion narrative systems powered by psychological triggers.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-3xl">
           {[
             { id: 'writer', label: 'Copywriter', icon: PenTool },
             { id: 'formulas', label: 'Frameworks', icon: Layers },
             { id: 'narrative', label: 'Narrative', icon: MessageSquare },
             { id: 'psychology', label: 'Psychology', icon: Brain },
             { id: 'voice', label: 'Voice DNA', icon: UserCheck }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               <tab.icon size={14} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Interaction Area */}
        <div className="lg:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
             {activeTab === 'writer' ? (
                <motion.div 
                  key="writer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                   <div className="card-agency p-8 bg-white dark:bg-[#020617] border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                               <Wand2 size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Neural Copywriter</h3>
                         </div>
                         <div className="flex gap-2">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded-lg border border-emerald-500/20">AIDA Active</span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase rounded-lg border border-blue-500/20">PAS Ready</span>
                         </div>
                      </div>

                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                         {[
                            { label: '/SALES_PAGE', cmd: 'GENERATE_SALES_PAGE [product] [audience] [price]' },
                            { label: '/EMAIL_SEQ', cmd: 'GENERATE_EMAIL_SEQUENCE [goal] [segment] [length]' },
                            { label: '/AD_COPY', cmd: 'GENERATE_AD_COPY [platform] [offer] [trigger]' },
                            { label: '/REWRITE', cmd: 'REWRITE_COPY [text] [new_tone]' },
                            { label: '/DECON', cmd: 'DECONSTRUCT_COMPETITOR [URL]' }
                         ].map(cmd => (
                            <button 
                               key={cmd.label}
                               onClick={() => insertCommand(cmd.cmd)}
                               className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[9px] font-black text-slate-400 hover:text-[#FF6B00] hover:border-[#FF6B00]/30 transition-all whitespace-nowrap"
                            >
                               {cmd.label}
                            </button>
                         ))}
                      </div>

                      <textarea 
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         placeholder="Draft a 3-email sequence for a high-ticket SaaS launch focusing on 'Implementation Speed'..."
                         className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 text-lg outline-none focus:border-orange-500/50 border border-transparent min-h-[200px] resize-none mb-6 transition-all"
                      />
                      <div className="flex items-center justify-between">
                         <div className="flex gap-2">
                            <button className="p-3 text-slate-400 hover:text-orange-500 transition-colors"><FileText size={18} /></button>
                            <button className="p-3 text-slate-400 hover:text-orange-500 transition-colors"><Zap size={18} /></button>
                         </div>
                         <button 
                            onClick={handleSynthesize}
                            disabled={isGenerating}
                            className="h-14 px-10 bg-[#FF6B00] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 flex items-center gap-3"
                         >
                            Synthesize Copy {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                         </button>
                      </div>
                   </div>

                   {structuredOutput && (
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       className="card-agency p-0 border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl z-20">
                          {structuredOutput.type === 'sales_page' ? 'Long-Form Sales Page' : structuredOutput.type === 'email_sequence' ? 'Email Sequence' : 'Ad Creative'} // Schema Verified
                       </div>

                       {structuredOutput.type === 'sales_page' ? (
                         <div className="p-10 space-y-8">
                            <div className="space-y-4">
                               <h1 className="text-4xl font-display font-black uppercase leading-[0.9] text-slate-900 dark:text-white">
                                 {structuredOutput.headline}
                               </h1>
                               <p className="text-lg text-slate-500 font-medium">{structuredOutput.subheadline}</p>
                            </div>
                            
                            <div className="space-y-6">
                               {structuredOutput.sections.map((sec: any, i: number) => (
                                 <div key={i} className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00]">{sec.title}</h4>
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{sec.content}</p>
                                 </div>
                               ))}
                            </div>

                            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                               {structuredOutput.cta}
                            </button>
                         </div>
                       ) : structuredOutput.type === 'email_sequence' ? (
                         <div className="p-10 space-y-6">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-600">
                               <div className="flex items-center gap-2"><Send size={12} /> {structuredOutput.sequence_info}</div>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-500/10">
                               <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Subject: {structuredOutput.subject}</p>
                               <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                  {structuredOutput.body}
                               </p>
                            </div>
                         </div>
                       ) : (
                         <div className="p-8 space-y-6">
                           <div className="flex items-center gap-2 text-emerald-500 mb-6">
                              <CheckCircle2 size={16} />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Generated Ad Creative</span>
                           </div>
                           
                           <div className="space-y-6">
                              <div>
                                 <h4 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 dark:text-white leading-tight mb-2">
                                    {structuredOutput.headline}
                                 </h4>
                                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {structuredOutput.description}
                                 </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Audience</p>
                                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{structuredOutput.target_audience}</p>
                                 </div>
                                 <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CTA Text</p>
                                    <p className="text-[10px] font-bold text-[#FF6B00]">{structuredOutput.cta_text}</p>
                                 </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                 {structuredOutput.compliance_flags.map((f: string) => (
                                    <span key={f} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-[8px] font-black text-emerald-600 uppercase tracking-widest rounded border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                                       <ShieldCheck size={10} /> {f}
                                    </span>
                                 ))}
                              </div>
                           </div>
                         </div>
                       )}

                       <div className="px-8 py-6 bg-slate-950/5 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2">
                                <button className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 hover:text-blue-500 shadow-sm border border-slate-100 dark:border-slate-800"><Copy size={12} /></button>
                                <button className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 hover:text-emerald-500 shadow-sm border border-slate-100 dark:border-slate-800"><CheckCircle2 size={12} /></button>
                             </div>
                          </div>
                          <button 
                            onClick={() => LoyaltyAgentService.getInstance().processAction(`Export ${structuredOutput.type} to Pipeline: Content Lab Transfer`)}
                            className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                          >
                             Export to Mesh <ChevronRight size={12} />
                          </button>
                       </div>
                    </motion.div>
                   )}
                </motion.div>
             ) : activeTab === 'formulas' ? (
                <motion.div 
                  key="formulas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                   {adHeadlineFormulas.map((f) => (
                     <div key={f.id} className="card-agency p-6 hover:border-orange-500/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.category}</span>
                           <Copy size={14} className="text-slate-200 group-hover:text-orange-500 transition-colors cursor-pointer" />
                        </div>
                        <h4 className="font-bold mb-2">{f.name}</h4>
                        <div className="space-y-2 mt-4">
                           {f.structure.map((s, i) => (
                             <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                                {s}
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </motion.div>
             ) : activeTab === 'narrative' ? (
                <motion.div 
                  key="narrative"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="p-12 bg-slate-900 rounded-[48px] text-white overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                        <MessageSquare size={180} />
                     </div>
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                              <History size={24} />
                           </div>
                           <h3 className="text-2xl font-bold uppercase tracking-tight">Narrative Architect</h3>
                        </div>
                        <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                           Activate the Hero's Journey framework to transform clinical product features into compelling human transformations.
                        </p>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => handleMeshAction('NARRATIVE_ENG_INIT', 'Activate Narrative Engineering: Hero\'s Journey Mapping v1')}
                             disabled={isActivating === 'NARRATIVE_ENG_INIT'}
                             className="px-8 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                           >
                              {isActivating === 'NARRATIVE_ENG_INIT' ? <Loader2 className="animate-spin" size={14} /> : 'Initialize Framework'}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     {[
                       { title: 'Origin Story', description: 'Craft the brand genesis narrative.', icon: Sparkles },
                       { title: 'Conflict-Resolution', description: 'Map pain points to triumphs.', icon: Flame },
                       { title: 'Customer Success', description: 'Turn data into storytelling.', icon: CheckCircle2 },
                       { title: 'Plot Twist', description: 'Pattern interrupt methodology.', icon: Zap }
                     ].map((item, i) => (
                       <div key={i} className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] hover:border-blue-500/30 transition-all cursor-pointer group">
                          <item.icon size={24} className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                       </div>
                     ))}
                  </div>
                </motion.div>
             ) : activeTab === 'psychology' ? (
                <motion.div 
                   key="psychology"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="space-y-6"
                >
                   <div className="p-8 bg-purple-500/10 rounded-[40px] border border-purple-500/20 flex items-center justify-between">
                      <div className="space-y-2">
                         <h3 className="text-xl font-bold flex items-center gap-2">
                            <Brain className="text-purple-500" /> Trigger Matrix Activation
                         </h3>
                         <p className="text-sm text-slate-500 font-medium">Inject Cialdini's 7 Principles and behavioral economics triggers.</p>
                      </div>
                      <button 
                        onClick={() => handleMeshAction('PSYCH_TRIGGER_MAP', 'Sync Psychological Trigger Matrix: Cognitive Bias Injection')}
                        className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 hover:scale-105 transition-all"
                      >
                         Sync Matrix
                      </button>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: 'FOMO', desc: 'Urgency & Limited Access' },
                        { name: 'Social Proof', desc: 'Consensus of Action' },
                        { name: 'Authority', desc: 'Expert Credibility' },
                        { name: 'Scarcity', desc: 'Quantity depletion' },
                        { name: 'Reciprocity', desc: 'Value-first altruism' },
                        { name: 'Unity', desc: 'Shared Identity' }
                      ].map((t, i) => (
                        <div key={i} className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-purple-500/5 transition-all cursor-pointer group">
                           <div className="w-2 h-2 bg-purple-500 rounded-full mb-4 group-hover:scale-150 transition-transform" />
                           <h5 className="text-[10px] font-black uppercase tracking-widest mb-1">{t.name}</h5>
                           <p className="text-[9px] text-slate-500 font-bold uppercase">{t.desc}</p>
                        </div>
                      ))}
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                   key="voice"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-6"
                >
                   <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                               <UserCheck size={24} />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold">Brand Voice DNA</h3>
                               <p className="text-xs text-slate-500 font-medium italic">Establishing the neural signature of your communication.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => handleMeshAction('VOICE_DNA_PROFILE', 'Perform Brand Voice DNA Profiling: Multi-corpus Analyis')}
                           className="px-6 py-3 border border-emerald-500 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                         >
                            Initialize Profiler
                         </button>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Attributes</h4>
                            <div className="space-y-2">
                               <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-slate-50 dark:border-slate-900">
                                  <span className="text-slate-400 uppercase">Personality</span>
                                  <span className="text-emerald-500 uppercase">Bold & Technical</span>
                               </div>
                               <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-slate-50 dark:border-slate-900">
                                  <span className="text-slate-400 uppercase">Formality</span>
                                  <span className="text-emerald-500 uppercase">Professional (Luxe)</span>
                               </div>
                               <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-slate-50 dark:border-slate-900">
                                  <span className="text-slate-400 uppercase">Vocabulary</span>
                                  <span className="text-emerald-500 uppercase">Grade 12+ Specialized</span>
                               </div>
                            </div>
                         </div>
                         <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Voice Guardian Protocol</h4>
                            <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                  <ShieldCheck size={14} className="text-emerald-500 mt-0.5" />
                                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Real-time tone monitoring is active. Flagging off-brand semantics in current buffer.</p>
                               </div>
                               <div className="flex items-start gap-3">
                                  <Activity size={14} className="text-emerald-500 mt-0.5" />
                                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Sentiment balance: 84% Conviction, 12% Empathy, 4% Urgency.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Sidebar Constraints */}
        <div className="lg:col-span-4 space-y-8">
           {/* Mesh Logs Layer */}
           <div className="p-8 bg-slate-900 rounded-[32px] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-2">
                   <Activity size={14} /> Neural Content Log
                 </h3>
              </div>
              <div className="space-y-2 h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-left-4">
                      <div className="text-[9px] font-mono text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</div>
                      <div className="flex-1">
                         <p className="text-[10px] font-bold text-white">
                            <span className="text-amber-400">{log.source}</span> → <span className="text-purple-400">{log.target}</span>
                         </p>
                         <p className="text-[9px] text-slate-400 mt-0.5 italic">{log.payload?.from || 'CONTENT_LAB_SIGNAL'} | {log.payload?.status || 'COMMITTED'}</p>
                      </div>
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                      <Clock size={24} className="animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Awaiting Signals</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="card-agency p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Lightbulb size={20} className="text-[#00AEEF]" /> Prompt Engineering
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Pattern</p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-[10px] text-slate-500">
                       [Role] + [Context] + [Constraint] + [Target Audience] + [CTA]
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                    "Act as a Senior Conversion Copywriter. Draft a Facebook Ad for the 'Shopify Dominator' tier. Use the PAS formula. Tone: Bold. Max 150 words."
                 </p>
              </div>
           </div>

           <div className="bg-slate-100 dark:bg-black rounded-[32px] p-8 border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Target size={14} /> Quality Gates
              </h4>
              <div className="space-y-4">
                 <GateItem label="Plagiarism Scan - 100% Unique" />
                 <GateItem label="Readability Index - Grade 8" />
                 <GateItem label="SEO Topical Cluster Mapping" />
                 <GateItem label="Sentiment Balance Check" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function GateItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{label}</p>
    </div>
  );
}
