import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Star, Shield, ArrowRight, Clock, User, Mail, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth, authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../lib/stripe';

export default function Pricing() {
  const { user, updatePlan, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (planId: 'monthly' | 'yearly') => {
    setError(null);
    setIsProcessing(planId);

    try {
      // 1. If not authenticated, perform the requested auth action
      if (!isAuthenticated) {
        if (isSignUp) {
          if (!formData.name || !formData.email || !formData.password) {
            throw new Error("Please complete all registration fields.");
          }
          await authService.signUp(formData.email, formData.password, formData.name);
        } else {
          if (!formData.email || !formData.password) {
            throw new Error("Please enter your email and password.");
          }
          await authService.signIn(formData.email, formData.password);
        }
      }

      // 2. Determine the correct Stripe Price ID based on selection
      const priceId = planId === 'monthly' ? 'price_1TSOJLBMbxh6jv0C9aEJBKRt' : 'price_1TSOKGBMbxh6jv0CMhUwlHYX';
      
      // 3. Use Intelligent Checkout Helper
      await checkout(priceId, {
        serviceId: planId === 'monthly' ? 'PROTOCOL' : 'ELITE_ENTERPRISE',
        email: formData.email || user?.email || undefined
      });
      
    } catch (err: any) {
      console.error("Action failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      
      // If payment fails but user was authenticated, we can fallback
      if (isAuthenticated || (isSignUp && formData.email)) {
         setTimeout(() => {
           updatePlan(planId === 'monthly' ? 'monthly' : 'annual');
           navigate('/billing');
         }, 2000);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-20 font-sans">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full"
        >
          <Zap size={14} className="text-[#FF6B00]" />
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">Global Growth Infrastructure</span>
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-display font-black text-slate-900 dark:text-white uppercase leading-[0.9] tracking-tighter"
          >
            CHOOSE YOUR <span className="text-orange-500">POWER</span> LEVEL.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Transparent pricing for high-performance marketing ecosystems. Join 50,000+ marketers scaling with autonomous intelligence.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Clock size={16} /> All plans start with a 7-day free trial.
          </motion.p>
        </div>

        {/* Integrated Auth Module */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto p-8 bg-slate-900 dark:bg-black rounded-[32px] border border-slate-800 shadow-2xl space-y-6"
          >
            <div className="flex bg-slate-800 p-1 rounded-2xl relative">
              <button 
                onClick={() => setIsSignUp(true)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest z-10 transition-colors",
                  isSignUp ? "text-white" : "text-slate-500"
                )}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setIsSignUp(false)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest z-10 transition-colors",
                  !isSignUp ? "text-white" : "text-slate-500"
                )}
              >
                Sign In
              </button>
              <motion.div 
                layoutId="authToggle"
                className="absolute inset-y-1 bg-orange-500 rounded-xl"
                initial={false}
                animate={{ 
                  x: isSignUp ? 0 : '100%',
                  left: 4,
                  right: isSignUp ? 'calc(50% + 4px)' : 4,
                  width: 'calc(50% - 8px)'
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800 text-white border-0 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-800 text-white border-0 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="password" 
                  placeholder="Secret Key (Password)" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-800 text-white border-0 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}
            </div>
            
            <p className="text-[9px] text-slate-500 font-bold text-center uppercase tracking-widest leading-relaxed">
              Your identity will be linked to the 7-day free trial protocols.
            </p>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
        {/* Protocol */}
        <div className="p-10 rounded-[48px] bg-white dark:bg-slate-900 border-2 border-[#FF6B00] shadow-2xl shadow-orange-500/10 space-y-12 h-full flex flex-col relative z-10 transition-transform hover:scale-[1.02]">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              Standard Intelligence
           </div>
           <div className="space-y-6 flex-1">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest pl-1">Stage 1</h4>
                 <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">PROTOCOL</h3>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-display font-black text-slate-900 dark:text-white">
                    $19.99
                 </span>
                 <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Everything you need to initiate market dominance. Includes a 7-day free trial on activation.</p>
              <ul className="space-y-4">
                 {['Unlimited Strategy Labs', 'Priority AI Routing', 'Analytics Dashboard', 'Custom Domain Sync', 'Priority Support'].map(f => (
                   <li key={f} className="flex items-center gap-3 text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                      <Star size={14} className="text-orange-500 shrink-0" /> {f}
                   </li>
                 ))}
              </ul>
           </div>
           <button 
             disabled={isProcessing !== null}
             onClick={() => handleSelectPlan('monthly')} 
             className="w-full py-6 bg-[#FF6B00] text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
           >
              {isProcessing === 'monthly' ? 'Initializing Secure Protocol...' : (isSignUp && !isAuthenticated ? 'START 7-DAY FREE TRIAL' : 'SUBSCRIBE MONTHLY')}
           </button>
        </div>

        {/* Elite Enterprise */}
        <div className="p-10 rounded-[48px] bg-slate-900 text-white space-y-12 h-full flex flex-col transition-transform hover:scale-[1.02]">
           <div className="space-y-6 flex-1">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest pl-1">Stage X</h4>
                 <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">ELITE ENTERPRISE</h3>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-display font-black text-white">
                    $199.99
                 </span>
                 <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/ Year</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Maximum power for enterprise-scale marketing dominance. Advanced API hooks and dedicated nodes.</p>
              <ul className="space-y-4">
                 {['Everything in Protocol', 'White-label Portal', 'Dedicated Strategist', 'V4 Compliance Engine', '24/7 Neural Support'].map(f => (
                   <li key={f} className="flex items-center gap-3 text-[10px] font-black text-blue-100 uppercase tracking-wide">
                      <Shield size={14} className="text-blue-500 shrink-0" /> {f}
                   </li>
                 ))}
              </ul>
           </div>
           <button 
             disabled={isProcessing !== null}
             onClick={() => handleSelectPlan('yearly')} 
             className="w-full py-6 bg-white text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
           >
              {isProcessing === 'yearly' ? 'Configuring Elite Tier...' : (isSignUp && !isAuthenticated ? 'START 7-DAY FREE TRIAL' : 'SUBSCRIBE YEARLY')}
           </button>
        </div>
      </div>

      {/* Trustproof Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
         <div className="flex items-center gap-12 grayscale opacity-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trustpilot 4.8 ★★★★★</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PCI Compliant</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">VAT Registered</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Shield size={14} />
               </div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">SSL Secure</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ArrowRight size={14} />
               </div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">7-Day Refund</span>
            </div>
         </div>
      </div>
    </div>
  );
}
