import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  CreditCard, 
  FileText,
  Zap,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { servicesData, ServiceDetail as ServiceDetailType } from '../data/servicesData';
import { cn } from '../lib/utils';
import { createCheckout, dispatchAudit } from '../services/apiService';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);

  const handleAuditRequest = async () => {
    if (!service) return;
    alert('Technical Audit initialized. Dispatching report to your command center...');
    await dispatchAudit('isadewum@gmail.com', service.id, { 
      status: 'pending_review',
      priority: 'high',
      timestamp: new Date().toISOString()
    });
  };

  if (!service) {
    return <Navigate to="/" />;
  }

  const Icon = service.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
               <Sparkles size={14} className="text-[#FF6B00]" />
               <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-[0.2em]">Our Core Offerings</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                {service.name}
              </h1>
              <p className="text-2xl font-medium text-[#00AEEF] italic">
                "{service.tagline}"
              </p>
            </div>

            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-sans">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-4">
               <button 
                 onClick={() => createCheckout(service.id, 49900)}
                 className="btn-primary px-8"
               >
                 <Zap size={18} /> Command New Project
               </button>
               {['shopify', 'social', 'ppc', 'seo', 'content', 'web'].includes(service.id) && (
                 <Link to={`/services/${service.id}/lab`} className="px-8 py-4 bg-[#00AEEF] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
                   <Layers size={18} /> Access Technical Lab
                 </Link>
               )}
               <button 
                 onClick={handleAuditRequest}
                 className="px-8 py-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:border-orange-500/50 transition-all"
               >
                 Request Technical Audit
               </button>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0 space-y-6">
             <div className="card-agency p-8 bg-[#FF6B00] border-transparent text-white dark:bg-[#FF6B00]">
                <Icon size={48} className="mb-6" />
                <h3 className="text-xl font-bold mb-2">Technical Delivery</h3>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between text-sm py-3 border-b border-white/20">
                    <span className="flex items-center gap-2 opacity-80"><Clock size={16} /> Timeline</span>
                    <span className="font-bold">{service.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 border-b border-white/20">
                    <span className="flex items-center gap-2 opacity-80"><ShieldCheck size={16} /> Assurance</span>
                    <span className="font-bold">SLA Guaranteed</span>
                  </div>
                </div>
             </div>

             <div className="card-agency p-6 border-dashed border-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={14} /> Global Prerequisites
                </h4>
                <ul className="space-y-3">
                  {service.clientInputs.map((input, i) => (
                    <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-start gap-2 italic">
                       <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0" />
                       {input}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {service.features.map((feature, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
             className="card-agency p-6 flex items-start gap-4"
           >
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center text-[#00AEEF] shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">{feature}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Industrial Grade</p>
              </div>
           </motion.div>
         ))}
      </section>

      {/* Process Workflow */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Project Workflow</h2>
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-900" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {service.workflow.map((w, i) => (
            <div key={i} className="relative group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center font-display font-bold text-lg text-slate-300 dark:text-slate-700 group-hover:border-[#FF6B00] group-hover:text-[#FF6B00] transition-all">
                  0{i + 1}
                </div>
                {i < service.workflow.length - 1 && (
                  <div className="hidden lg:block absolute left-[48px] top-[24px] w-[calc(100%+32px)] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10" />
                )}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{w.stage}</h4>
              <p className="text-sm text-slate-500 mb-4">{w.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{w.milestone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & Business Artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Pricing Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.pricing.map((p, i) => (
              <div key={i} className={cn(
                "card-agency p-8 flex flex-col h-full",
                i === 1 ? "border-[#FF6B00] border-2 shadow-xl shadow-orange-500/5 relative" : ""
              )}>
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Recommended</span>
                )}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{p.tier}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tighter">{p.price}</h3>
                <ul className="space-y-4 mb-10 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="text-sm text-slate-500 flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-orange-500" />
                       {f}
                    </li>
                  ))}
                </ul>
                <button className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all",
                  i === 1 ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20" : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200"
                )}>
                  Select Strategy
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Deliverables</h2>
          <div className="space-y-4">
             {service.deliverablesTemplates.map((d, i) => (
               <div key={i} className="card-agency p-6 group cursor-pointer hover:border-[#00AEEF]/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#00AEEF] transition-colors">
                        <FileText size={20} />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#00AEEF] transition-colors">{d.type}</h4>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-[#00AEEF] transition-all group-hover:translate-x-1" />
                  </div>
                  <div className="space-y-1">
                     {d.structure.map((item, j) => (
                       <p key={j} className="text-[10px] text-slate-500 font-medium uppercase truncate">• {item}</p>
                     ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
