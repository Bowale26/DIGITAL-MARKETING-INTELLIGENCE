import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { enrichLead } from '../services/leadService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { 
  Users, Search, Sparkles, TrendingUp, BarChart3, AlertCircle, 
  CheckCircle2, Clock, Shield, ArrowUpRight, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Lead {
  id: string;
  companyName: string;
  website?: string;
  status: 'qualified' | 'unqualified' | 'pending' | 'contacted';
  score: number;
  enrichedData?: {
    industry: string;
    revenue: string;
    employeeCount: string;
    techStack: string[];
    summary: string;
    citations?: { uri: string; title: string }[];
  };
  scoreDetails?: {
    fitScore: number;
    intentScore: number;
    reasoning: string;
  };
  createdAt: any;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLead, setNewLead] = useState({ companyName: '', website: '' });
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData: Lead[] = [];
      snapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsData);
    });
    return () => unsubscribe();
  }, []);

  const filteredLeads = leads.filter(l => 
    l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.enrichedData?.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.companyName) return;
    
    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        status: 'pending',
        score: 0,
        createdAt: serverTimestamp()
      });
      setNewLead({ companyName: '', website: '' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEnrich = async (lead: Lead) => {
    setEnrichingId(lead.id);
    try {
      await enrichLead(lead.id, lead.companyName, lead.website);
    } catch (error) {
      console.error("Enrichment failed:", error);
    } finally {
      setEnrichingId(null);
    }
  };

  // Metrics calculation
  const statusData = [
    { name: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: '#10b981' },
    { name: 'Pending', value: leads.filter(l => l.status === 'pending').length, color: '#6366f1' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: '#f59e0b' },
    { name: 'Unqualified', value: leads.filter(l => l.status === 'unqualified').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const scoreDistribution = [
    { range: '0-20', count: leads.filter(l => l.score <= 20).length },
    { range: '21-40', count: leads.filter(l => l.score > 20 && l.score <= 40).length },
    { range: '41-60', count: leads.filter(l => l.score > 40 && l.score <= 60).length },
    { range: '61-80', count: leads.filter(l => l.score > 60 && l.score <= 80).length },
    { range: '81-100', count: leads.filter(l => l.score > 80).length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} /> AI Grounding Active
          </div>
          <h1 className="text-5xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Intelligence <span className="text-orange-500">Pipeline</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Autonomous lead enrichment and scoring engine powered by digital intelligence grounding.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search intelligence pool..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
          >
            <Plus size={16} /> Initialize Lead
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Status Distribution</h3>
            <BarChart3 size={18} className="text-blue-500" />
          </div>
          <div className="w-full" style={{ width: '100%', height: 240, minHeight: 180 }}>
            <ResponsiveContainer width="100%" height="100%" aspect={1.5} minWidth={0}>
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lead Velocity / Scoring */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Score Intensity</h3>
            <TrendingUp size={18} className="text-orange-500" />
          </div>
          <div className="w-full" style={{ width: '100%', height: 240, minHeight: 180 }}>
            <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis 
                  dataKey="range" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 107, 0, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '900'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#FF6B00" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-2xl font-display font-black text-slate-900 dark:text-white">{leads.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Protocols</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1">
              <p className="text-2xl font-display font-black text-emerald-500">
                {leads.filter(l => l.score > 70).length}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">High Trust Leads</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lead Grid/List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Repositories</h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {leads.length} Entities Monitored
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-lg group",
                  lead.score > 70 ? "border-emerald-500/20 shadow-emerald-500/5" : "border-slate-200 dark:border-slate-800"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      lead.score > 70 ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}>
                      {lead.score > 70 ? <Shield size={24} /> : <Clock size={24} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{lead.companyName}</h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                          lead.status === 'qualified' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          lead.status === 'pending' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                          "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        )}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{lead.website || 'No URI associated'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    {/* Score Ring */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{lead.score || 0}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Score</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-orange-500 origin-bottom transition-all duration-1000"
                          style={{ transform: `scaleY(${lead.score / 100})` }}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleEnrich(lead)}
                      disabled={enrichingId === lead.id}
                      className={cn(
                        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        lead.enrichedData 
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200" 
                          : "bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20"
                      )}
                    >
                      {enrichingId === lead.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enriching...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          {lead.enrichedData ? 'Deep Update' : 'Initialize enrichment'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Enriched Content Details */}
                {(lead.enrichedData || lead.scoreDetails) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Search size={12} /> Strategic Snapshot
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "{lead.enrichedData?.summary}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lead.enrichedData?.techStack.map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={12} /> Scoring Matrix
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                            <span>Market Fit</span>
                            <span>{lead.scoreDetails?.fitScore}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${lead.scoreDetails?.fitScore}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                            <span>Intent Signal</span>
                            <span>{lead.scoreDetails?.intentScore}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${lead.scoreDetails?.intentScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={12} /> Intelligence Reasoning
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {lead.scoreDetails?.reasoning}
                      </p>
                      {lead.enrichedData?.citations && lead.enrichedData.citations.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                           <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grounding Citations</h5>
                           <div className="flex flex-wrap gap-2">
                             {lead.enrichedData.citations.slice(0, 3).map((cite, idx) => (
                               <a 
                                 key={idx} 
                                 href={cite.uri} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="text-[9px] font-bold text-blue-500 hover:underline flex items-center gap-1"
                               >
                                 <ArrowUpRight size={10} /> {cite.title.length > 20 ? cite.title.substring(0, 20) + '...' : cite.title}
                               </a>
                             ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {leads.length === 0 && (
            <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[48px]">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Users size={32} />
              </div>
              <p className="text-slate-500 font-medium">No leads in the intelligence pool.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[48px] p-10 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">Initialize Entity</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Add a new company to the intelligence pipeline.</p>
              </div>

              <form onSubmit={handleAddLead} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Domain/Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newLead.companyName}
                    onChange={(e) => setNewLead({...newLead, companyName: e.target.value})}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corporate URI</label>
                  <input 
                    type="text" 
                    value={newLead.website}
                    onChange={(e) => setNewLead({...newLead, website: e.target.value})}
                    placeholder="e.g. https://acme.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-orange-500/20 transition-all"
                  >
                    Deploy to Pipeline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
