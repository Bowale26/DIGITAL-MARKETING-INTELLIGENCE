import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  MessageSquare, 
  Zap, 
  Send, 
  PhoneCall, 
  Mail,
  ArrowRight,
  LifeBuoy,
  CheckCircle2
} from 'lucide-react';
import { faqDatabase, FAQItem, escalationPaths } from '../data/supportData';
import { cn } from '../lib/utils';

export default function SupportCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = ['All', 'General', 'Services', 'Technical', 'Billing', 'Support'];

  const filteredFaqs = faqDatabase.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 font-sans">
      {/* Hero */}
      <section className="text-center space-y-8 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
           <LifeBuoy size={14} className="text-[#00AEEF]" />
           <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em]">Intelligence Support Center</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-tight">How can we solve today?</h1>
        
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search the 50+ item FAQ database for instant answers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-900 rounded-[32px] pl-16 pr-8 py-6 text-lg outline-none focus:border-orange-500/50 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all"
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar/Categories */}
        <div className="lg:col-span-3 space-y-8">
           <div className="space-y-2">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Knowledge Clusters</h4>
             <div className="flex flex-col gap-1">
               {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-left text-sm font-bold transition-all",
                    activeCategory === cat ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                 >
                   {cat}
                 </button>
               ))}
             </div>
           </div>

           <div className="card-agency p-6 bg-slate-900 text-white border-transparent">
              <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">Direct Access</h4>
              <div className="space-y-4">
                 <ContactLink icon={PhoneCall} label="Callback Request" desc="Typical response: 15m" />
                 <ContactLink icon={Mail} label="Email Strategy" desc="Response: < 4h" />
                 <ContactLink icon={MessageSquare} label="Live AI Chat" desc="Instant Deployment" />
              </div>
           </div>
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-9 space-y-4">
           {filteredFaqs.length > 0 ? (
             filteredFaqs.map((faq, i) => (
               <div key={i} className="card-agency overflow-hidden p-0">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{faq.question}</span>
                    <ChevronDown className={cn("text-slate-400 transition-transform", openFaqIndex === i && "rotate-180")} size={20} />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             ))
           ) : (
             <div className="text-center py-20 opacity-20">
               <HelpCircle size={64} className="mx-auto mb-4" />
               <p className="text-xl font-bold uppercase tracking-tight">No results found in data cluster</p>
             </div>
           )}
        </div>
      </div>

      {/* Ticket Submission */}
      <section className="bg-slate-100 dark:bg-slate-950 rounded-[48px] p-8 lg:p-16">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
               <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Unresolved issue?</h2>
               <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Start a technical ticket. Our triaging engine will assign your inquiry to the most appropriate specialist in under 4 hours.</p>
               
               <div className="space-y-6">
                 {escalationPaths.map(path => (
                   <div key={path.level} className="flex items-start gap-4">
                     <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center shrink-0 text-xs font-bold">{path.level}</span>
                     <div>
                       <h4 className="font-bold text-slate-900 dark:text-white">{path.name} <span className="ml-2 text-[10px] text-orange-500 font-bold uppercase">{path.time}</span></h4>
                       <p className="text-xs text-slate-500 mt-1">{path.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="card-agency p-10 bg-white dark:bg-[#020617] shadow-2xl">
               {openFaqIndex === 999 ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle2 size={32} />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold uppercase tracking-tight">Ticket Deployed</h4>
                       <p className="text-sm text-slate-500 font-medium">Strategic Triage Engine #84210 initialized.</p>
                    </div>
                    <button onClick={() => setOpenFaqIndex(null)} className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">Deploy Another Ticket</button>
                 </motion.div>
               ) : (
                 <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
                      <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-orange-500/50 text-slate-900 dark:text-white">
                         <option>Technical Bug</option>
                         <option>Billing Conflict</option>
                         <option>Strategy Pivot</option>
                         <option>Portal Feedback</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Context / Description</label>
                      <textarea 
                        placeholder="Please provide exhaustive details including project ID if applicable..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-orange-500/50 min-h-[150px] resize-none text-slate-900 dark:text-white"
                      />
                   </div>
                   <button 
                     onClick={() => setOpenFaqIndex(999)}
                     className="btn-primary w-full py-5"
                   >
                     Deploy Support Ticket <Send size={18} />
                   </button>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

function ContactLink({ icon: Icon, label, desc }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all group cursor-pointer">
       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:text-orange-500 transition-colors">
          <Icon size={16} />
       </div>
       <div>
         <p className="text-xs font-bold">{label}</p>
         <p className="text-[9px] text-white/50 font-medium">{desc}</p>
       </div>
    </div>
  );
}
