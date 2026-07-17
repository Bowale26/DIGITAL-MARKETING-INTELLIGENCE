import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  Briefcase,
  Target,
  ArrowRight,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  { id: 'profile', title: 'Personal Identity', icon: User },
  { id: 'business', title: 'Organization', icon: Building2 },
  { id: 'goals', title: 'Growth Goals', icon: Target },
  { id: 'finish', title: 'Verification', icon: ShieldCheck },
];

export default function RegistrationFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    budgetCateogry: '',
    goals: [] as string[]
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  const updateForm = (updates: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...updates }));

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
           {steps.map((step, i) => {
             const Icon = step.icon;
             const isComplete = i < currentStep;
             const isActive = i === currentStep;
             return (
               <div key={step.id} className="flex-1 flex flex-col items-center gap-2 relative">
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                   isComplete ? "bg-emerald-500 text-white" : isActive ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20" : "bg-slate-100 dark:bg-slate-900 text-slate-400"
                 )}>
                    {isComplete ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                 </div>
                 <span className={cn(
                   "text-[10px] font-bold uppercase tracking-widest",
                   isActive ? "text-[#FF6B00]" : "text-slate-400"
                 )}>{step.title}</span>
                 {i < steps.length - 1 && (
                    <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-px bg-slate-100 dark:bg-slate-800" />
                 )}
               </div>
             )
           })}
        </div>
      </div>

      <div className="card-agency p-10">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Identity</h2>
              <div className="grid grid-cols-2 gap-4">
                 <InputField label="First Name" value={formData.firstName} onChange={v => updateForm({ firstName: v })} />
                 <InputField label="Last Name" value={formData.lastName} onChange={v => updateForm({ lastName: v })} />
              </div>
              <InputField label="Work Email" type="email" icon={Mail} value={formData.email} onChange={v => updateForm({ email: v })} />
              <InputField label="Phone Number" icon={Phone} value={formData.phone} onChange={v => updateForm({ phone: v })} />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Organization</h2>
              <InputField label="Company Name" icon={Building2} value={formData.companyName} onChange={v => updateForm({ companyName: v })} />
              <InputField label="Website URL" icon={Globe} placeholder="https://" value={formData.website} onChange={v => updateForm({ website: v })} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry Cluster</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-[#FF6B00]/50"
                  value={formData.industry}
                  onChange={e => updateForm({ industry: e.target.value })}
                >
                   <option value="">Select Industry</option>
                   <option>E-commerce / D2C</option>
                   <option>SaaS / Tech</option>
                   <option>Professional Services</option>
                   <option>Real Estate</option>
                </select>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
             <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">Growth Goals</h2>
                <div className="grid grid-cols-1 gap-3">
                   {['Scale Revenue', 'Increase Lead Quality', 'Cost Efficiency', 'Market Domination'].map(goal => (
                     <button 
                       key={goal}
                       onClick={() => {
                          const newGoals = formData.goals.includes(goal) 
                            ? formData.goals.filter(g => g !== goal)
                            : [...formData.goals, goal];
                          updateForm({ goals: newGoals });
                       }}
                       className={cn(
                         "p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between",
                         formData.goals.includes(goal) ? "bg-orange-500/10 border-orange-500 text-orange-600" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400"
                       )}
                     >
                       {goal}
                       {formData.goals.includes(goal) && <CheckCircle2 size={18} />}
                     </button>
                   ))}
                </div>
             </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight">System Ready</h2>
                <p className="text-slate-500 mt-4 max-w-sm mx-auto">We've architected your initial environment based on your goals. Your Account Manager will be initialized in 5 minutes.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Initial Setup Checklist</h4>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                     <CheckCircle2 size={16} className="text-emerald-500" /> Identity Verified
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                     <CheckCircle2 size={16} className="text-emerald-500" /> Growth Blueprint Drafted
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 opacity-50">
                     <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-700 rounded-full" /> Assign Dedicated Strategist
                   </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
           <button 
             onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
             disabled={currentStep === 0}
             className="text-slate-400 font-bold uppercase tracking-widest text-xs disabled:opacity-0 transition-all hover:text-slate-900 dark:hover:text-white"
           >
             Back
           </button>
           <button 
             onClick={nextStep}
             className="btn-primary group"
           >
             {currentStep === steps.length - 1 ? 'Start Dominating' : 'Next Stage'}
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', icon: Icon, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-colors" size={18} />}
        <input 
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 text-sm outline-none focus:border-[#FF6B00]/50 transition-all",
            Icon ? "pl-12 pr-6" : "px-6"
          )}
        />
      </div>
    </div>
  );
}
