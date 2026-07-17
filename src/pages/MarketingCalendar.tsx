import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  Search,
  Filter,
  Brain,
  Video,
  PenTool,
  Target,
  ShoppingBag,
  Mail,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CalendarService, MarketingEvent } from '../services/calendarService';
import { LoyaltyAgentService, AgentHandoff } from '../services/loyaltyAgentService';

export default function MarketingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<AgentHandoff[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Suggestions
  const suggestions = [
    { id: 's1', title: 'AI Ethics Trend Post', trend: 'Search volume for AI Governance up 45%', time: 'Tomorrow, 10:00 AM', type: 'content' },
    { id: 's2', title: 'Q2 E-commerce Audit', trend: 'Conversion drop detected in cart flow', time: 'Friday, 2:00 PM', type: 'audit' },
    { id: 's3', title: 'Flash Prep: Summer Launch', trend: 'Competitor announced dynamic pricing', time: 'Monday, 9:00 AM', type: 'campaign' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await CalendarService.getInstance().getEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendToTask = async (s: typeof suggestions[0]) => {
    setIsProcessing(true);
    const mesh = LoyaltyAgentService.getInstance();
    
    // Simulate trend-to-task translation
    const newLogs = await mesh.processAction(`Trend-to-Task: ${s.trend}. Suggesting schedule for ${s.title}`);
    setLogs(prev => [...newLogs, ...prev]);

    // Schedule it
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      await CalendarService.getInstance().createEvent({
        title: s.title,
        description: `Automated via Flux Neural Mesh. Trend Source: ${s.trend}`,
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        type: s.type as any,
        status: 'scheduled'
      });

      await mesh.processAction(`create_calendar_event: ${s.title} scheduled for ${tomorrow.toLocaleDateString()}`);
      fetchEvents();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const renderCalendar = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const days = daysInMonth(y, m);
    const startOffset = firstDayOfMonth(y, m);
    const calendarDays = [];

    // Padding for previous month
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(<div key={`pad-${i}`} className="h-40 border-r border-b border-slate-100 dark:border-slate-800 opacity-20 bg-slate-50 dark:bg-slate-900/20" />);
    }

    // Actual days
    for (let d = 1; d <= days; d++) {
      const dayEvents = events.filter(e => e.startTime.getDate() === d && e.startTime.getMonth() === m);
      const isToday = d === new Date().getDate() && m === new Date().getMonth();

      calendarDays.push(
        <div key={d} className={cn(
          "h-40 p-4 border-r border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all group relative",
          isToday && "bg-purple-500/5"
        )}>
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              "text-sm font-bold",
              isToday ? "w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center -ml-1 -mt-1" : "text-slate-400"
            )}>{d}</span>
            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-purple-500 transition-all">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-hide">
            {dayEvents.map((e, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-bold border truncate",
                  e.type === 'campaign' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  e.type === 'content' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  e.type === 'audit' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                  "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}
              >
                {e.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 flex items-center gap-2">
               <Brain size={12} className="text-purple-500" />
               <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Digital Marketing Intelligence</span>
             </div>
             {isProcessing && (
               <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center gap-2">
                 <Loader2 size={12} className="text-amber-500 animate-spin" />
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Processing Trend</span>
               </div>
             )}
          </div>
          <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
            Marketing <span className="text-slate-300 dark:text-slate-800">Omni-Schedule</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
            Synchronized campaign orchestration and trend translation.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              GROUNDING VERIFIED
            </span>
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
              Google Calendar AI ↗
            </a>
            <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
              Vertex AI Forecasting ↗
            </a>
            <a href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/10 rounded-xl text-[10px] font-bold transition-all">
              Looker Studio Dashboards ↗
            </a>
          </div>
        </div>

        <div className="flex gap-4">
           <button className="h-14 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <Filter size={14} /> Filter Pillar
           </button>
           <button className="h-14 px-10 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 flex items-center gap-3">
              <Plus size={16} /> New Campaign
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Calendar Grid */}
         <div className="lg:col-span-9 space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex items-center gap-8">
                     <h2 className="text-2xl font-bold uppercase tracking-tight">
                        {currentDate.toLocaleString('default', { month: 'long' })} <span className="text-slate-400">{currentDate.getFullYear()}</span>
                     </h2>
                     <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden p-1 shadow-sm">
                        <button 
                          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Today</button>
                     <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                     <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        {['Week', 'Month', 'List'].map(mode => (
                          <button key={mode} className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            mode === 'Month' ? "bg-white dark:bg-slate-800 shadow-sm text-purple-500" : "text-slate-400"
                          )}>{mode}</button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">{day}</div>
                  ))}
               </div>

               <div className="grid grid-cols-7">
                  {renderCalendar()}
               </div>
            </div>

            {/* Mesh Logs */}
            <div className="p-8 bg-slate-900 rounded-[32px]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-2">
                    <ActivityIcon size={14} /> Schedule Intelligence Log
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
                          <p className="text-[9px] text-slate-400 mt-0.5 italic">{log.payload?.from || 'SCHEDULER_MESH_SIGNAL'} | {log.payload?.status || 'COMMITTED'}</p>
                       </div>
                       <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                       <Clock size={24} className="animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Intelligent Suggestions</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Sidebar: AI Suggestions */}
         <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-purple-600 rounded-[40px] text-white shadow-2xl shadow-purple-600/20 relative overflow-hidden group">
               <div className="absolute -top-12 -right-12 p-8 opacity-20 group-hover:rotate-12 transition-transform">
                  <Zap size={140} className="text-white" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <Brain size={20} className="text-purple-200" />
                     <h3 className="text-xs font-black uppercase tracking-[0.2em]">Intelligence Node</h3>
                  </div>
                  <h4 className="text-2xl font-bold uppercase tracking-tight leading-tight mb-4">Trend-to-Task <br />Translation</h4>
                  <p className="text-[11px] text-purple-100 font-medium leading-relaxed opacity-80">
                     Flux Neural Mesh has identified high- resonance market signals. These entries avoid conflicts and match your strategic goals.
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-4">Suggested Actions</h3>
               {suggestions.map((s) => (
                  <div key={s.id} className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] hover:border-purple-500/50 transition-all group">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          s.type === 'content' ? "bg-amber-500/10 text-amber-500" :
                          s.type === 'audit' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                           {s.type === 'content' ? <PenTool size={18} /> : 
                            s.type === 'audit' ? <Search size={18} /> : <Target size={18} />}
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{s.type}</p>
                           <h5 className="text-sm font-bold">{s.title}</h5>
                        </div>
                     </div>
                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6 italic">
                        "{s.trend}"
                     </p>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-900">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Clock size={12} />
                           <span className="text-[10px] font-bold">{s.time}</span>
                        </div>
                        <button 
                          onClick={() => handleTrendToTask(s)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all disabled:opacity-50"
                        >
                          Schedule
                        </button>
                     </div>
                  </div>
               ))}
               
               <p className="text-center text-[10px] font-bold text-slate-400 py-4 italic">
                  Would you like me to identify more opportunities?
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function ActivityIcon({ size, ...props }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
