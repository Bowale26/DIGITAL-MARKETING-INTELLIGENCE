import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  Target, 
  History, 
  Edit2, 
  Save, 
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Zap,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { Lead, LeadActivity, stages } from '../data/leadData';
import { cn } from '../lib/utils';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { leads, updateLead } = useLeads();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const foundLead = leads.find(l => l.id === id);
    if (foundLead) {
      setLead(foundLead);
      setEditedLead(foundLead);
    }
  }, [id, leads]);

  if (!lead || !editedLead) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 animate-pulse">
           <Target size={32} />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Lead context not found...</p>
        <button onClick={() => navigate('/pipeline')} className="text-[#FF6B00] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
           <ArrowLeft size={14} /> Return to Pipeline
        </button>
      </div>
    );
  }

  const handleSave = () => {
    if (editedLead) {
      updateLead(editedLead);
      setIsEditing(false);
      // Log an activity for the edit
      const editActivity: LeadActivity = {
        id: `ea-${Date.now()}`,
        type: 'note',
        title: 'Information Updated',
        description: 'Lead profile was manually updated via System Intelligence.',
        timestamp: 'Just now'
      };
      updateLead({
        ...editedLead,
        recentActivity: [editActivity, ...editedLead.recentActivity]
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={16} className="text-blue-500" />;
      case 'call': return <Phone size={16} className="text-emerald-500" />;
      case 'meeting': return <Users size={16} className="text-purple-500" />;
      case 'score_change': return <Zap size={16} className="text-orange-500" />;
      case 'stage_change': return <Target size={16} className="text-indigo-500" />;
      default: return <MessageSquare size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/pipeline')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Strategic Pipeline</span>
          </button>
          
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[32px] flex items-center justify-center text-slate-300">
                   <Target size={40} />
                </div>
                <div className={cn(
                  "absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-950 flex items-center justify-center text-xs font-black text-white",
                  lead.score >= 90 ? "bg-emerald-500 neon-glow-green" : lead.score >= 80 ? "bg-orange-500 shadow-orange-500/50" : "bg-slate-500"
                )}>
                  {lead.score}
                </div>
             </div>
             <div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editedLead.name} 
                    onChange={e => setEditedLead({...editedLead, name: e.target.value})}
                    className="text-4xl font-display font-bold text-slate-900 dark:text-white bg-transparent border-b-2 border-orange-500 outline-none w-full max-w-md uppercase tracking-tight"
                  />
                ) : (
                  <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    {lead.name}
                  </h1>
                )}
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Building2 size={16} />
                      <span className="text-sm font-bold uppercase tracking-tight">{lead.company}</span>
                   </div>
                   <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{lead.stage}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <X size={14} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-3 bg-[#FF6B00] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
              >
                <Save size={14} /> Commit Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-orange-500 border border-transparent hover:border-orange-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Edit2 size={14} /> Modify Dossier
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-8">
           <div className="card-agency p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Contact Information */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                       <Mail size={16} className="text-[#00AEEF]" /> Contact Infrastructure
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Direct Email</label>
                          {isEditing ? (
                             <input 
                               type="email" 
                               value={editedLead.email} 
                               onChange={e => setEditedLead({...editedLead, email: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50"
                             />
                          ) : (
                             <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl group cursor-pointer hover:border-orange-500/30 transition-all border border-transparent">
                                <Mail size={18} className="text-slate-400 group-hover:text-orange-500" />
                                <span className="text-sm font-bold dark:text-white">{lead.email}</span>
                             </div>
                          )}
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Access</label>
                          {isEditing ? (
                             <input 
                               type="text" 
                               value={editedLead.phone} 
                               onChange={e => setEditedLead({...editedLead, phone: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50"
                             />
                          ) : (
                             <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl group cursor-pointer hover:border-orange-500/30 transition-all border border-transparent">
                                <Phone size={18} className="text-slate-400 group-hover:text-orange-500" />
                                <span className="text-sm font-bold dark:text-white">{lead.phone}</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Economic Metrics */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                       <DollarSign size={16} className="text-emerald-500" /> Economic Parameters
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Contract Potential</label>
                          {isEditing ? (
                             <input 
                               type="text" 
                               value={editedLead.value} 
                               onChange={e => setEditedLead({...editedLead, value: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50"
                             />
                          ) : (
                             <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <span className="text-2xl font-display font-bold text-emerald-500 uppercase tracking-tight">{lead.value}</span>
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Projected Annual Recurring Revenue</p>
                             </div>
                          )}
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Acquisition Source</label>
                          {isEditing ? (
                             <input 
                               type="text" 
                               value={editedLead.source} 
                               onChange={e => setEditedLead({...editedLead, source: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50"
                             />
                          ) : (
                             <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent">
                                <Star size={18} className="text-orange-500/50" />
                                <span className="text-sm font-bold dark:text-white uppercase tracking-tight">{lead.source}</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Stage Transition */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                   <Target size={16} className="text-indigo-500" /> Pipeline Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                   {stages.map((stage) => (
                     <button 
                       key={stage}
                       disabled={!isEditing}
                       onClick={() => setEditedLead({...editedLead, stage})}
                       className={cn(
                         "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                         (isEditing ? editedLead.stage : lead.stage) === stage 
                           ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" 
                           : "bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50",
                         !isEditing && "cursor-default"
                       )}
                     >
                       {stage}
                     </button>
                   ))}
                </div>
              </div>
           </div>

           {/* Performance Insights */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-agency p-6 border-transparent bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Neural Engine</span>
                 </div>
                 <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Intent Detection</h4>
                 <p className="text-[10px] font-medium leading-relaxed opacity-80 uppercase tracking-widest">
                    Based on recent interactions, this lead shows a high preference for technical growth over luxury positioning. Recommend deep-dive technical demo.
                 </p>
              </div>

              <div className="card-agency p-6 border-[#00AEEF]/20 bg-[#00AEEF]/5">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center text-[#00AEEF]">
                       <Clock size={20} />
                    </div>
                    <span className="text-[10px] font-black text-[#00AEEF] uppercase tracking-widest">Velocity Status</span>
                 </div>
                 <h4 className="text-lg font-bold uppercase tracking-tight mb-2 dark:text-white">Deal Speed</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-widest">
                    Lead is moving 15% faster than average. Expect proposal acceptance within 72 hours if neural engagement strategy is maintained.
                 </p>
              </div>
           </div>
        </div>

        {/* Sidebar: Activity Log */}
        <div className="lg:col-span-4 space-y-8">
           <div className="card-agency p-8 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <History size={18} className="text-slate-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">Neural Activity Stream</h3>
                 </div>
                 <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">
                    Audit_Ready
                 </div>
              </div>

              <div className="space-y-6">
                 {lead.recentActivity.map((activity, idx) => (
                   <motion.div 
                     key={activity.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className="relative pl-8 before:absolute before:left-[11px] before:top-8 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden"
                   >
                     <div className="absolute left-0 top-1 w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center z-10 shadow-sm">
                        {getActivityIcon(activity.type)}
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white">{activity.title}</h4>
                           <span className="text-[8px] font-bold text-slate-500 uppercase">{activity.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                           {activity.description}
                        </p>
                     </div>
                   </motion.div>
                 ))}
                 
                 {lead.recentActivity.length === 0 && (
                   <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                      <Clock size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No historical data<br/>ingested yet.</p>
                   </div>
                 )}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                 <button className="w-full py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> Log Customer Interaction
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
