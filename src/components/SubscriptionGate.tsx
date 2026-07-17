import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Shield, AlertTriangle, CreditCard, Check, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../services/authService';

export default function SubscriptionGate() {
  const { user, updatePlan } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Calculate remaining trial duration and update string
  useEffect(() => {
    if (!user || user.status !== 'TRIAL') return;

    const updateCountdown = () => {
      const now = Date.now();
      const difference = user.trialEndDate - now;

      if (difference <= 0) {
        setTimeLeftStr('Expired');
        // Force state refresh
        window.location.reload();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeftStr(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeftStr(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeftStr(`${minutes}m left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [user]);

  // Handle Automatic Redirection upon Expiration
  useEffect(() => {
    if (user) {
      const isTrialExpired = Date.now() > user.trialEndDate || user.status === 'EXPIRED';
      const hasNoActiveSub = user.plan === 'free';

      if (isTrialExpired && hasNoActiveSub) {
        // Redirect to pricing page if they are trying to access any page other than /pricing or /auth
        if (location.pathname !== '/pricing' && location.pathname !== '/auth' && location.pathname !== '/onboarding') {
          navigate('/pricing');
        }
      }
    }
  }, [user, location.pathname, navigate]);

  if (!user) return null;

  const isTrialExpired = Date.now() > user.trialEndDate || user.status === 'EXPIRED';
  const hasNoActiveSub = user.plan === 'free';
  const isGateActive = isTrialExpired && hasNoActiveSub;

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    setIsProcessing(plan);
    try {
      // Simulate immediate subscription upgrade
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await updatePlan(plan);
      navigate('/');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <>
      {/* 1. ADVANCE NOTIFICATION BANNER (Displays during active trial) */}
      {!isGateActive && user.status === 'TRIAL' && (
        <div className="bg-gradient-to-r from-[#FF6B00] via-orange-600 to-amber-600 text-white border-b border-orange-500/10">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                7-Day Trial Active
              </span>
              <span className="font-mono text-[11px] font-bold text-orange-100 flex items-center gap-1">
                <Clock size={13} className="inline shrink-0 text-white" />
                Time Remaining: <span className="text-white underline decoration-wavy font-black">{timeLeftStr || 'Calculating...'}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-[10px] text-orange-100 uppercase tracking-widest font-bold">
                Protect your access: {user.projectsCreated} active projects configured
              </span>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white text-[#FF6B00] hover:bg-orange-50 active:scale-95 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
              >
                Upgrade to Paid Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STRICT SUBSCRIPTION ACCESS BLOCK OVERLAY (Displays when trial expires & no plan active) */}
      <AnimatePresence>
        {isGateActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-950/95 dark:bg-black/98 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl my-8 text-slate-200"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-amber-500" />
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-800/80 mb-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                    <AlertTriangle size={12} className="text-red-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-black uppercase text-red-500 tracking-widest">
                      Session Terminated — Access Restricted
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">
                    Your 7-Day Free Trial has <span className="text-orange-500">Expired</span>
                  </h1>
                  <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                    The 7-Day trial period for the <strong className="text-white">Flux Governance OS Platform</strong> has completed. To prevent data losses and continue utilizing your campaign optimization engines, select a subscription plan below.
                  </p>
                </div>
                
                <div className="shrink-0 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">YOUR TRIAL START DATE</span>
                  <span className="font-mono text-sm font-black text-slate-300">
                    {new Date(user.trialStartDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase text-red-500 block mt-2 mb-1">EXPIRED ON</span>
                  <span className="font-mono text-sm font-black text-red-400">
                    {new Date(user.trialEndDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>

              {/* Plans Selection Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Monthly Plan */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-widest block mb-1">PRO</span>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Monthly Subscription</h3>
                      </div>
                      <span className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                        <CreditCard size={18} />
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-black text-white">$19.99</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-black">/ Month</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Full access to the core strategy labs, compliance engine, neural planners, and ROI trackers. Billed monthly.
                    </p>
                    <ul className="space-y-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Unlimited Projects</li>
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Priority Node Access</li>
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Real-time Compliance</li>
                    </ul>
                  </div>
                  <button
                    disabled={isProcessing !== null}
                    onClick={() => handleSubscribe('monthly')}
                    className="w-full mt-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing === 'monthly' ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Activate Monthly Plan</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>

                {/* Annual Plan */}
                <div className="bg-slate-950/40 border-2 border-orange-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                    SAVE 17%
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-widest block mb-1">ELITE ENTERPRISE</span>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Annual Subscription</h3>
                      </div>
                      <span className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                        <Shield size={18} />
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-black text-white">$199.99</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-black">/ Year</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Full enterprise dominance suite, advanced API integrations, premium telemetry, and dedicated system support nodes.
                    </p>
                    <ul className="space-y-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Everything in Monthly</li>
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> White-label Reports</li>
                      <li className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> 24/7 Priority Support</li>
                    </ul>
                  </div>
                  <button
                    disabled={isProcessing !== null}
                    onClick={() => handleSubscribe('annual')}
                    className="w-full mt-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing === 'annual' ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Activate Annual Plan</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Trust Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <Shield size={12} className="text-slate-500" />
                  SSL ENCRYPTED SECURE PAYMENT SYSTEM
                </span>
                <span>SECURED BY STRIPE CLOUD PROTOCOLS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
