import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag,
  Share2,
  Search,
  PenTool,
  Globe,
  Server,
  Zap,
  ChevronRight,
  FileText,
  MousePointer2,
  Calendar,
  Layers,
  Inbox,
  Trophy,
  Mic,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import { notificationTemplates } from '../data/notificationTemplates';
import AudioTranscriber from '../components/AudioTranscriber';
import { dispatchAudit } from '../services/apiService';
import { useLeads } from '../context/LeadContext';

const data = [
  { name: 'W1', leads: 400, revenue: 2400 },
  { name: 'W2', leads: 300, revenue: 3398 },
  { name: 'W3', leads: 200, revenue: 5800 },
  { name: 'W4', leads: 278, revenue: 4908 },
  { name: 'W5', leads: 189, revenue: 6800 },
  { name: 'W6', leads: 239, revenue: 7800 },
  { name: 'W7', leads: 349, revenue: 9300 },
];

const services = [
  { id: 'competitor', name: 'Competitor Node', icon: Users, color: 'bg-orange-500', path: '/services/leads', desc: 'Product & Pricing Intel' },
  { id: 'trend', name: 'Trend Node', icon: TrendingUp, color: 'bg-pink-500', path: '/services/social', desc: 'Cultural Shift Monitor' },
  { id: 'seo', name: 'SEO Node', icon: Search, color: 'bg-indigo-500', path: '/services/seo', desc: 'Keyword Gap Discovery' },
  { id: 'crisis', name: 'Crisis Node', icon: AlertTriangle, color: 'bg-red-500', path: '/services/ppc', desc: 'Sentiment Anomaly Detection' },
  { id: 'content', name: 'Content Lab', icon: PenTool, color: 'bg-yellow-500', path: '/services/content', desc: 'High-conv copywriting' },
  { id: 'web', name: 'Web Design', icon: Globe, color: 'bg-cyan-500', path: '/services/web', desc: 'Modern UX/UI dev' },
  { id: 'host', name: 'Web Hosting', icon: Server, color: 'bg-slate-500', path: '/services/hosting', desc: 'Managed cloud infra' },
  { id: 'strategy', name: 'AI Strategy', icon: Zap, color: 'bg-purple-500', path: '/strategy', desc: 'Neural Growth Engine' },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscriberOpen, setIsTranscriberOpen] = useState(false);
  const { leads } = useLeads();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleExportAudit = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Global Growth Audit Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("--------------------------------------------------", 20, 35);
    doc.text("Revenue: $142,840", 20, 45);
    doc.text("Active Leads: 2,842", 20, 55);
    doc.text("PPC ROAS: 4.8x", 20, 65);
    doc.text("Ad Spend: $24,500", 20, 75);
    doc.text("--------------------------------------------------", 20, 80);
    doc.text("Neural Verification: S-Tier Performance Detected.", 20, 90);
    doc.save(`global_audit_${Date.now()}.pdf`);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-10 pb-24">
      <AudioTranscriber isOpen={isTranscriberOpen} onClose={() => setIsTranscriberOpen(false)} />
      
      {/* Grounding Status */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">GROUNDING VERIFIED</span>
      </motion.div>

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Flux Market <span className="text-orange-500">Intelligence</span> OS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 font-medium max-w-xl">
            Orchestrating 4 specialist nodes for real-time market dominance. Neural search verification active.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/engagement" className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">
              <Trophy size={14} /> View Loyalty Hub
            </Link>
            <Link to="/marketing-suite" className="inline-flex items-center gap-2 text-xs font-bold text-purple-500 uppercase tracking-widest hover:underline">
              <Zap size={14} /> Initialize Digital Marketing Suite
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTranscriberOpen(true)}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold hover:border-orange-500/50 transition-all flex items-center gap-2"
          >
            <Mic size={18} /> Transcribe Audio
          </button>
          <button 
            onClick={async () => {
              alert('Global Growth Audit initialized. Transmitting secure report...');
              await dispatchAudit('isadewum@gmail.com', 'Global Command Center', { 
                revenue: '$142,840', 
                leads: '2,842', 
                roas: '4.8x' 
              });
              handleExportAudit();
              alert('Strategic report delivered successfully and downloaded.');
            }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold hover:border-orange-500/50 transition-all font-sans"
          >
            Export Global Audit
          </button>
          <Link to="/strategy" className="btn-primary">
            <Zap size={18} /> Run AI Strategy
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Global Revenue" value="$142,840" change="+24.5%" isUp icon={DollarSign} />
        <StatCard title="Active Leads" value={leads.length.toLocaleString()} change="+38.2%" isUp icon={Users} />
        <StatCard title="PPC ROAS" value="4.8x" change="+1.2x" isUp icon={Target} />
        <StatCard title="Ad Spend" value="$24,500" change="-4.3%" isUp={false} icon={TrendingUp} />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="xl:col-span-2 card-agency p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Performance</h3>
              <p className="text-sm text-slate-500 mt-1">Unified growth data across all agency services.</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-orange-500/50">
              <option>Last 7 Weeks</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          
          <div className="w-full" style={{ width: '100%', height: 350, minHeight: 250 }}>
            <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                  itemStyle={{ fontSize: '12px', color: '#fff' }}
                  cursor={{ stroke: '#FF6B00', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} dot={{ r: 4, fill: '#FF6B00', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Activity */}
        <div className="card-agency p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 select-none tracking-tight flex items-center justify-between">
            Node Protocol Activity
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">LIVE SYNC</span>
          </h3>
          <div className="space-y-8">
            <ActivityItem icon={Users} color="text-orange-500" bg="bg-orange-500/10" title="Competitor Node" time="2m ago" desc="Detected price drop across 3 direct competitor storefronts." />
            <ActivityItem icon={TrendingUp} color="text-pink-500" bg="bg-pink-500/10" title="Trend Node" time="1h ago" desc="Emerging search volume for 'Autonomous AI Agents' up 340%." />
            <ActivityItem icon={Search} color="text-indigo-500" bg="bg-indigo-500/10" title="SEO Node" titleIcon={Shield} titleIconColor="text-emerald-500" time="3h ago" desc="Identified 12 untapped keyword clusters in the SaaS sector." />
            <ActivityItem icon={AlertTriangle} color="text-red-500" bg="bg-red-500/10" title="Crisis Node" time="5h ago" desc="Sentiment anomaly detected in Reddit thread /r/marketing." />
          </div>
          <button className="w-full mt-12 py-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-orange-500 hover:border-orange-500/50 transition-all uppercase tracking-widest">
            Audit Complete History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent System Updates</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time alerts from your growth engine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.slice(0, 4).map((n) => (
              <div key={n.id} className="card-agency p-6 border-l-4 border-l-orange-500">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.category}</p>
                   <span className="text-[10px] text-orange-500 font-bold uppercase">Now</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">{n.message}</p>
                {n.action && (
                  <button className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest hover:underline flex items-center gap-1">
                    {n.action} <ChevronRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8 bg-slate-900 rounded-[32px] p-8 text-white">
           <h3 className="text-xl font-bold">Quick Execution</h3>
           <div className="space-y-1">
             <QuickAction label="Initialize Lead Scraping" />
             <QuickAction label="Clear Marketing Cache" />
             <QuickAction label="Download Weekly Blueprint" isDownload />
             <QuickAction label="Sync CRM Data" />
           </div>
           <div className="pt-8 border-t border-white/10">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">Account Manager - JD</p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-orange-500">JD</div>
                 <button className="btn-primary w-full py-3 text-xs">Direct Thread</button>
              </div>
           </div>
        </div>
      </div>

      {/* Services Grid (8 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Service Ecosystem</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time status of your 8 core agency offerings.</p>
          </div>
          <button className="text-[#00AEEF] text-sm font-bold flex items-center gap-1 hover:underline">
            View Expanded Lab <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(v => (
          <div key={v} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 h-[450px] bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
        <div className="h-[450px] bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isUp, icon: Icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-agency p-6"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-slate-400" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
          isUp ? "bg-emerald-400/10 text-emerald-500" : "bg-red-400/10 text-red-500"
        )}>
          {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-bold dark:text-white mt-1 uppercase tracking-tighter">{value}</h4>
      </div>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, color, bg, title, time, desc, titleIcon: TitleIcon, titleIconColor }: any) {
  return (
    <div className="flex gap-4 group cursor-pointer">
      <div className={cn("w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", bg, color)}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</p>
            {TitleIcon && <TitleIcon size={12} className={titleIconColor} />}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase">{time}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, isDownload }: any) {
  const handleAction = () => {
    if (isDownload) {
      const doc = new jsPDF();
      doc.text("Weekly Strategic Blueprint", 20, 20);
      doc.text(`Timeline: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text("Focus: ROAS Optimization & CRM Scaling", 20, 40);
      doc.save(`weekly_blueprint_${Date.now()}.pdf`);
      alert(`Blueprinting complete. ${label} downloaded.`);
    } else {
      alert(`Action initialized: ${label}`);
    }
  };

  return (
    <button 
      onClick={handleAction}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
    >
       <span className="text-xs font-medium text-white/80 group-hover:text-white">{label}</span>
       <ChevronRight size={14} className="text-white/20 group-hover:text-[#00AEEF]" />
    </button>
  );
}

function ServiceCard({ service, delay }: { service: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={service.path} className="card-agency flex flex-col items-center text-center group">
        <div className={cn("w-14 h-14 rounded-[20px] flex items-center justify-center text-white mb-4 shadow-xl shadow-opacity-30", service.color)}>
           <service.icon size={28} />
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">{service.name}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">{service.desc}</p>
        
        <div className="w-full h-1 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
           <div className={cn("h-full w-2/3 rounded-full", service.color)} />
        </div>
        <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase">92% Operational</span>
      </Link>
    </motion.div>
  );
}
