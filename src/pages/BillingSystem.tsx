import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  History, 
  Settings, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileDown,
  LayoutDashboard,
  ShieldCheck,
  Package
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function BillingSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'settings'>('overview');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div>
           <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">Billing System</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Manage corporate retainers, enterprise infrastructure, and licensing.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
           {(['overview', 'invoices', 'settings'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-white dark:bg-[#020617] text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <BillingCard title="Next Billing Cycle" value="June 01, 2026" subValue="3 Active Retainers" icon={History} />
               <BillingCard title="Current Monthly Spend" value="$14,500.00" subValue="+12.5% vs Prev Month" icon={TrendingUp} />
               <BillingCard title="Primary Toolset" value="Enterprise" subValue="Master Service Agreement" icon={ShieldCheck} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-8">
                  <div className="card-agency p-8">
                     <h3 className="text-xl font-bold mb-8">Active Subscriptions</h3>
                     <div className="space-y-6">
                        <SubscriptionItem name="Shopify Dominator Retainer" price="$4,500/mo" status="active" date="Next: Jun 01" />
                        <SubscriptionItem name="Lead Gen Engine - 1500 Leads" price="$7,500/mo" status="active" date="Next: Jun 12" />
                        <SubscriptionItem name="SEOHub Technical Managed" price="$2,500/mo" status="active" date="Next: Jun 15" />
                     </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Agency Refund Policy</h3>
                           <p className="text-sm text-slate-500 mt-2 leading-relaxed">Digital Marketing Intelligence operates on a strict output-based model. Once a strategy lab run has completed or a sprint has initialized, fees are non-refundable. For cancellation of retainers, a 15-day prior notice is required via the portal.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="card-agency p-8 space-y-8">
                  <h3 className="text-xl font-bold">Wallet</h3>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-[24px] text-white space-y-12 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-5 blur-3xl" />
                     <div className="flex justify-between items-start">
                        <CreditCard size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Mastercard Enterprise</span>
                     </div>
                     <div>
                        <p className="text-sm font-medium tracking-[0.3em] opacity-80">•••• •••• •••• 8402</p>
                        <p className="text-lg font-bold mt-2 font-display">AGENCY ADMIN CORP</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-all border border-slate-100 dark:border-slate-800">
                    Replace Primary Method
                  </button>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-900 space-y-4">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Reminders</h4>
                     <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
                       T1 (1d Overdue): Gentle Notification<br />
                       T2 (5d Overdue): System Warning<br />
                       T3 (7d Overdue): Service Pause
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div 
            key="invoices"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-agency p-8"
          >
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold">Transaction Ledger</h3>
                <button className="text-xs font-bold text-[#00AEEF] uppercase tracking-widest flex items-center gap-2">
                   <FileDown size={14} /> Download Annual Audit
                </button>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'DMI-8420-1', date: 'May 01, 2026', amount: '$4,500.00', status: 'Paid' },
                  { id: 'DMI-8420-2', date: 'Apr 01, 2026', amount: '$4,500.00', status: 'Paid' },
                  { id: 'DMI-7210-4', date: 'Mar 15, 2026', amount: '$12,000.00', status: 'Paid' },
                  { id: 'DMI-3102-1', date: 'Feb 01, 2026', amount: '$2,500.00', status: 'Paid' },
                ].map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                           <CheckCircle2 size={18} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">Invoice #{inv.id}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.date}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.amount}</p>
                        <button className="text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:underline">Receipt</button>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BillingCard({ title, value, subValue, icon: Icon }: any) {
  return (
    <div className="card-agency p-6 hover:border-orange-500/20 transition-all">
       <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-6">
          <Icon size={20} />
       </div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
       <h4 className="text-2xl font-bold dark:text-white tracking-tighter uppercase">{value}</h4>
       <p className="text-[10px] font-bold text-[#00AEEF] uppercase mt-2">{subValue}</p>
    </div>
  );
}

function SubscriptionItem({ name, price, status, date }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl">
       <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300">
             <Package size={24} />
          </div>
          <div>
             <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
             <p className="text-xs text-slate-500 italic">{date} • Monthly Auto-renew</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tighter">{price}</p>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
             <div className="w-1 h-1 bg-emerald-500 rounded-full" />
             <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{status}</span>
          </div>
       </div>
    </div>
  );
}
