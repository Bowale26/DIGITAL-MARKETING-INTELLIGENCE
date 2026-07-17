import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Cell,
  Legend
} from 'recharts';
import { 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Clock, 
  RefreshCw, 
  BarChart3, 
  LineChart 
} from 'lucide-react';

// Generates simulated historical API request data for the selected range
const generateApiData = (range: string) => {
  const data = [];
  const hours = range === '1H' ? 12 : range === '6H' ? 18 : range === '24H' ? 24 : 14;
  const labelPrefix = range === '1H' ? 'Min' : range === '7D' ? 'Day' : 'Hour';

  for (let i = hours; i >= 0; i--) {
    let label = '';
    if (range === '1H') {
      label = `-${i * 5}m`;
    } else if (range === '7D') {
      label = `Day -${i}`;
    } else {
      label = `${(24 - i) % 12 || 12}${24 - i >= 12 ? ' PM' : ' AM'}`;
    }

    // Baseline stats
    data.push({
      time: label,
      competitorCalls: Math.floor(Math.random() * 400 + 200),
      trendCalls: Math.floor(Math.random() * 300 + 150),
      seoCalls: Math.floor(Math.random() * 500 + 300),
      crisisCalls: Math.floor(Math.random() * 150 + 50),
    });
  }
  return data;
};

// Orchestration frequency of the 4 specialist nodes
const initialOrchestrationData = [
  { name: 'Competitor Node', frequency: 1428, color: '#00D9FF' },
  { name: 'Trend Node', frequency: 984, color: '#6366F1' },
  { name: 'SEO Node', frequency: 1852, color: '#10B981' },
  { name: 'Crisis Node', frequency: 412, color: '#F59E0B' },
];

export default function GovernanceDashboard() {
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [apiData, setApiData] = useState(() => generateApiData('24H'));
  const [orchestrationData, setOrchestrationData] = useState(initialOrchestrationData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalCalls: 34291,
    activeNodes: 4,
    complianceScore: 99.85,
    avgLatency: 84
  });

  // Regenerate data when range changes
  useEffect(() => {
    setApiData(generateApiData(timeRange));
  }, [timeRange]);

  // Simulate real-time live heartbeat updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Randomly increment metrics slightly to represent live traffic
      setMetrics(prev => ({
        totalCalls: prev.totalCalls + Math.floor(Math.random() * 8 + 2),
        activeNodes: 4,
        complianceScore: Number((99.8 + Math.random() * 0.15).toFixed(2)),
        avgLatency: Math.floor(80 + Math.random() * 8)
      }));

      // 2. Add slightly more orchestration points to one of the nodes
      setOrchestrationData(prev => {
        const indexToUpdate = Math.floor(Math.random() * prev.length);
        return prev.map((item, idx) => {
          if (idx === indexToUpdate) {
            return { ...item, frequency: item.frequency + Math.floor(Math.random() * 3 + 1) };
          }
          return item;
        });
      });

      // 3. Update the last data point of apiData to reflect live incremental calls
      setApiData(prev => {
        if (prev.length === 0) return prev;
        const lastIndex = prev.length - 1;
        const updatedLast = {
          ...prev[lastIndex],
          competitorCalls: prev[lastIndex].competitorCalls + Math.floor(Math.random() * 3),
          trendCalls: prev[lastIndex].trendCalls + Math.floor(Math.random() * 2),
          seoCalls: prev[lastIndex].seoCalls + Math.floor(Math.random() * 4),
          crisisCalls: prev[lastIndex].crisisCalls + Math.floor(Math.random() * 1),
        };
        return [...prev.slice(0, lastIndex), updatedLast];
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setApiData(generateApiData(timeRange));
      setIsRefreshing(false);
    }, 800);
  };

  // Sum total calls in current dataset for visual breakdown
  const currentTotalDatasetCalls = apiData.reduce((sum, item) => 
    sum + item.competitorCalls + item.trendCalls + item.seoCalls + item.crisisCalls, 0
  );

  return (
    <div id="governance-usage-dashboard" className="p-8 md:p-10 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl">
              <Activity size={16} className="animate-pulse" />
            </span>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#00D9FF]">
              SYSTEM RESOURCE TELEMETRY
            </span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
            Governance Usage & Orchestration OS
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time verification logs, active search workloads, and node telemetry performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range switcher */}
          <div className="flex items-center gap-1 bg-slate-950/60 border border-white/5 rounded-xl p-1">
            {(['1H', '6H', '24H', '7D'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block mb-1">TOTAL API REQUESTS</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white font-mono">
              {metrics.totalCalls.toLocaleString()}
            </span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tight font-mono">+Live</span>
          </div>
        </div>

        <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block mb-1">ACTIVE NODE CORES</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#00D9FF] font-mono">
              {metrics.activeNodes}/4
            </span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tight font-mono">100% Online</span>
          </div>
        </div>

        <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block mb-1">COMPLIANCE SCORE</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-500 font-mono">
              {metrics.complianceScore}%
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight font-mono">LKP Secure</span>
          </div>
        </div>

        <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block mb-1">LATENCY SPEEDS</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              {metrics.avgLatency}ms
            </span>
            <span className="text-[8px] font-bold text-[#00D9FF] uppercase tracking-tight font-mono">Ultra Low</span>
          </div>
        </div>
      </div>

      {/* Main Charts Matrix */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: AreaChart for Real-time API Call Counts */}
        <div className="lg:col-span-8 bg-slate-950/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">
                API Calls Stream Breakdown
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400">
              AGGREGATED {currentTotalDatasetCalls.toLocaleString()} CALLS
            </span>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompetitor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCrisis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderColor: '#ffffff10', 
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area 
                  name="Competitor Node" 
                  type="monotone" 
                  dataKey="competitorCalls" 
                  stroke="#00D9FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCompetitor)" 
                />
                <Area 
                  name="Trend Node" 
                  type="monotone" 
                  dataKey="trendCalls" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                />
                <Area 
                  name="SEO Node" 
                  type="monotone" 
                  dataKey="seoCalls" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSeo)" 
                />
                <Area 
                  name="Crisis Node" 
                  type="monotone" 
                  dataKey="crisisCalls" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCrisis)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: BarChart for Protocol Orchestration Frequency */}
        <div className="lg:col-span-4 bg-slate-950/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">
                  Node Orchestrations
                </h3>
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">
                LOCKED PROTOCOLS
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6">
              Breakdown of autonomous execution frequency of our A2A Orchestrator Core specialist node layers.
            </p>

            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orchestrationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => value.split(' ')[0]} // Show just "Competitor", "Trend", etc.
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#ffffff02' }}
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderColor: '#ffffff10', 
                      borderRadius: '16px',
                      fontSize: '11px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="frequency" radius={[6, 6, 0, 0]}>
                    {orchestrationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
            {orchestrationData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-[10px] font-mono font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-400 uppercase tracking-tight">{entry.name}</span>
                </div>
                <span className="text-white font-black">{entry.frequency.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Verification footer seal */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-cyan-500/80">
          <ShieldCheck size={12} className="text-[#00D9FF] shrink-0 animate-pulse" />
          GROUNDING VERIFIED: 100% SECURE CYBERNETIC AUDIT
        </span>
        <span className="flex items-center gap-1">
          <Cpu size={11} />
          SYSTEM CORE VERSION: 2.1.4_A2A
        </span>
      </div>
    </div>
  );
}
