import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  LayoutDashboard,
  Activity,
  X
} from 'lucide-react';
import { agencyKPIs } from '../data/analyticsData';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { FunctionCallingService } from '../services/functionCallingService';

const data = [
  { month: 'Jan', revenue: 45000, roas: 3.2 },
  { month: 'Feb', revenue: 52000, roas: 3.5 },
  { month: 'Mar', revenue: 48000, roas: 3.8 },
  { month: 'Apr', revenue: 61000, roas: 4.2 },
  { month: 'May', revenue: 55000, roas: 4.5 },
  { month: 'Jun', revenue: 72000, roas: 4.8 },
];

export default function Analytics() {
  const [adSpend, setAdSpend] = useState('10000');
  const [cpc, setCpc] = useState('1.50');
  const [convRate, setConvRate] = useState('3.0');
  const [avgTicket, setAvgTicket] = useState('500');
  const [isSyncing, setIsSyncing] = useState(false);
  const [pythonResult, setPythonResult] = useState<any>(null);

  const handlePythonSync = async () => {
    setIsSyncing(true);
    try {
      const response = await FunctionCallingService.getInstance().executeFunction('WF-CALC-001', {
        campaign_spend: adSpend,
        revenue: results.revenue,
        touchpoint_data: "Pixel-v3-Trace"
      });
      setPythonResult(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const calculateROI = () => {
    const spendNum = parseFloat(adSpend);
    const cpcNum = parseFloat(cpc);
    const convNum = parseFloat(convRate) / 100;
    const ticketNum = parseFloat(avgTicket);

    const clicks = spendNum / cpcNum;
    const leads = clicks * convNum;
    const revenue = leads * ticketNum;
    const roas = revenue / spendNum;

    return { leads: leads.toFixed(0), revenue: revenue.toFixed(2), roas: roas.toFixed(1) };
  };

  const results = calculateROI();

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">Performance Analytics</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Deep-dive into cross-channel ROAS and algorithmic efficiency.</p>
           <div className="flex flex-wrap gap-2 pt-3">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-0.5" />
               GROUNDING VERIFIED
             </span>
             <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
               Google Analytics GA4 ↗
             </a>
             <a href="https://business.adobe.com/products/analytics/adobe-analytics.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
               Adobe Analytics ↗
             </a>
           </div>
        </div>
        <button 
          onClick={handlePythonSync}
          disabled={isSyncing}
          className="btn-primary"
        >
          {isSyncing ? <Activity size={18} className="animate-spin" /> : <Zap size={18} />} 
          {isSyncing ? 'Architecting ROAS...' : 'Re-sync Global Pixels'}
        </button>
      </div>

      {pythonResult && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-900 border border-blue-500/30 rounded-[32px] p-6 text-blue-400 font-mono text-[10px]"
        >
           <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase tracking-widest text-[#00AEEF]">Python Execution Trace: WF-CALC-001</span>
              <button onClick={() => setPythonResult(null)} className="text-white/20 hover:text-white transition-colors">
                 <X size={14} />
              </button>
           </div>
           <div className="space-y-1">
              {pythonResult.execution_trace.map((line: string, i: number) => (
                 <div key={i} className="flex gap-4">
                    <span className="opacity-30">[{i}]</span>
                    <span>{line}</span>
                 </div>
              ))}
           </div>
           <div className="mt-4 pt-4 border-t border-white/10 text-white italic">
              Attribution Handshake Complete: {pythonResult.message}
           </div>
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agencyKPIs.map(kpi => (
          <div key={kpi.id} className="card-agency p-6 group cursor-help relative">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.name}</span>
              <Info size={14} className="text-slate-200 dark:text-slate-800" />
            </div>
            <h4 className="text-3xl font-bold dark:text-white mb-1 uppercase tracking-tighter">{kpi.current}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500">Target: {kpi.target}</span>
            </div>
            
            {/* Tooltip on Hover */}
            <div className="absolute inset-0 bg-slate-900 text-white p-6 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-center pointer-events-none">
               <p className="text-[10px] font-bold text-orange-400 uppercase mb-2">Formula</p>
               <p className="text-sm font-mono mb-4">{kpi.formula}</p>
               <p className="text-[10px] leading-relaxed opacity-70">{kpi.definition}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card-agency p-8">
           <h3 className="text-xl font-bold mb-10">Efficiency Trend (6 Mo)</h3>
           <div className="w-full" style={{ width: '100%', height: 350, minHeight: 250 }}>
              <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
                 <AreaChart data={data}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#00AEEF" fill="url(#colorRev)" strokeWidth={3} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* ROI Calculator */}
        <div className="card-agency p-8 bg-slate-900 text-white border-transparent">
           <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
             <Calculator size={20} className="text-orange-500" /> Impact Forecast
           </h3>
           <div className="space-y-6">
              <CalcInput label="Monthly Ad Spend" value={adSpend} onChange={setAdSpend} prefix="$" />
              <CalcInput label="Avg. CPC" value={cpc} onChange={setCpc} prefix="$" />
              <CalcInput label="Target Conv %" value={convRate} onChange={setConvRate} suffix="%" />
              <CalcInput label="Avg. Ticket Size" value={avgTicket} onChange={setAvgTicket} prefix="$" />

              <div className="pt-8 border-t border-white/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 font-bold uppercase">Est. Monthly Leads</span>
                    <span className="text-xl font-bold font-display">{results.leads}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 font-bold uppercase">Est. Gross Revenue</span>
                    <span className="text-xl font-bold font-display">${results.revenue}</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-orange-500 rounded-2xl">
                    <span className="text-xs font-bold uppercase">Predictive ROAS</span>
                    <span className="text-2xl font-bold font-display">{results.roas}x</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function CalcInput({ label, value, onChange, prefix, suffix }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">{prefix}</span>}
        <input 
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-bold outline-none focus:border-orange-500 transition-all",
            prefix ? "pl-8 pr-4" : "px-4"
          )}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">{suffix}</span>}
      </div>
    </div>
  );
}
