import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  BrainCircuit, 
  Zap, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const steps = [
  {
    title: "Define Your Mission",
    description: "Welcome to Flux Agency. We've built an autonomous growth engine. Let's align your brand goals.",
    icon: Rocket,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Configure Neural Lab",
    description: "Our AI systems (Cortex) handle copywriting, SEO, and social scaling. Choose your primary growth channel.",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Pipeline Sovereignty",
    description: "Unified lead tracking and ROI analytics. You have full visibility into every conversion event.",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Deployment Ready",
    description: "Your workspace is optimized. Access your 8 core service modules from the dashboard.",
    icon: CheckCircle2,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboarded', 'true');
      navigate('/');
      window.location.reload(); // Force App.tsx to re-run effect or just navigate
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Element */}
        <div className="hidden lg:block relative">
           <div className="absolute -inset-20 bg-[#00AEEF]/10 blur-[100px] rounded-full" />
           <div className="absolute -inset-20 bg-[#FF6B00]/5 blur-[80px] rounded-full translate-x-20" />
           <motion.div 
             key={currentStep}
             initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ type: 'spring', damping: 15 }}
             className={cn(
               "relative z-10 aspect-square rounded-[64px] flex items-center justify-center shadow-2xl",
               steps[currentStep].bg
             )}
           >
              <StepIcon size={120} className={steps[currentStep].color} />
           </motion.div>
        </div>

        {/* Content Area */}
        <div className="space-y-12">
           <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === currentStep ? "w-12 bg-orange-500" : i < currentStep ? "w-6 bg-orange-500/30" : "w-6 bg-slate-100 dark:bg-slate-900"
                )} />
              ))}
           </div>

           <AnimatePresence mode="wait">
             <motion.div 
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Step 0{currentStep + 1}</p>
                   <h2 className="text-5xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                      {steps[currentStep].title}
                   </h2>
                </div>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {steps[currentStep].description}
                </p>
             </motion.div>
           </AnimatePresence>

           <div className="flex items-center gap-6 pt-8">
              <button 
                onClick={handleNext}
                className="btn-primary px-10 py-5 rounded-[24px] text-lg"
              >
                {currentStep === steps.length - 1 ? 'Enter Core' : 'Proceed'} <ChevronRight size={20} />
              </button>
              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="p-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
           </div>

           <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="flex -space-x-3">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#020617] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                    </div>
                 ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 Joined by <span className="text-orange-500">240+</span> High-Growth Merchants
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
