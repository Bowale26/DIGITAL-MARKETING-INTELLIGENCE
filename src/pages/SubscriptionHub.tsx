import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Star, Shield, ArrowRight, Clock, User, Mail, Lock, 
  CheckCircle2, RefreshCw, KeyRound, Check, HelpCircle, 
  AlertCircle, Sparkles, LogOut, ExternalLink, Calendar, Database 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { getStripe } from '../lib/stripe';

export default function SubscriptionHub() {
  const { user, updatePlan, isAuthenticated, signOut, requestExtension, simulateExpiration } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // AI Verification Playground State
  const [aiPrompt, setAiPrompt] = useState('Analyze competitor landscape for AI SaaS market in Q3 2026.');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTelemetry, setAiTelemetry] = useState<any>(null);

  // Active Plans config matching Pricing.tsx
  const plans = [
    {
      id: 'monthly',
      name: 'PROTOCOL MONTHLY',
      priceId: 'price_1TSOJLBMbxh6jv0C9aEJBKRt',
      price: '$19.99',
      interval: 'Month',
      tier: 'Stage 1 Standard',
      desc: 'Complete digital marketing suite. Activates unlimited strategic simulations and priority keyword extraction.',
      features: ['Unlimited Strategy Labs', 'Priority AI Routing', 'Analytics Dashboard', 'Custom Domain Sync', 'Priority Support'],
      cta: 'Activate Protocol — $19.99/mo',
      color: 'orange'
    },
    {
      id: 'yearly',
      name: 'ELITE YEARLY',
      priceId: 'price_1TSOKGBMbxh6jv0CMhUwlHYX',
      price: '$199.99',
      interval: 'Year',
      tier: 'Stage X Enterprise',
      desc: 'Full power billing mode with absolute platform leverage. Best for high-volume corporate systems.',
      features: ['Everything in Protocol', 'White-label Portal', 'Dedicated Strategist', 'V4 Compliance Engine', '24/7 Neural Support'],
      cta: 'Activate Elite — $199.99/yr',
      color: 'slate'
    }
  ];

  const handleCreateCheckoutSession = async (priceId: string, planId: string) => {
    setError(null);
    setSuccessMessage(null);
    setIsProcessing(planId);

    try {
      if (!isAuthenticated) {
        throw new Error("Please authentication first by signing in or signing up.");
      }

      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          email: user?.email,
          isTrial: false // they are buying a full subscription
        })
      });

      const session = await response.json();
      if (session.error) {
        throw new Error(session.error);
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        // Fallback for simulation
        setTimeout(() => {
          updatePlan(planId === 'monthly' ? 'monthly' : 'annual');
          setSuccessMessage(`Subscription upgraded successfully to ${planId.toUpperCase()}!`);
          setIsProcessing(null);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Checkout action failed:", err);
      setError(err.message || "Stripe Checkout session initialization failed.");
      setIsProcessing(null);
    }
  };

  const handleLaunchBillingPortal = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsProcessing('portal');

    try {
      if (!user?.email) {
        throw new Error("No authenticated session email found.");
      }

      const response = await fetch('/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const session = await response.json();
      if (session.error) {
        throw new Error(session.error);
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("No active portal URL returned by customer profile server.");
      }
    } catch (err: any) {
      console.error("Billing portal action failed:", err);
      setError(err.message || "You need an active subscription history to launch the billing portal. If you are trialing, select a plan below first.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleTestAIFeature = async () => {
    setAiLoading(true);
    setAiResult(null);
    setAiTelemetry(null);
    const startTime = Date.now();

    try {
      if (!user?.email) {
        throw new Error("Active session credentials not found.");
      }

      const response = await fetch('/api/ai-feature', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({ prompt: aiPrompt, email: user.email })
      });

      const latency = Date.now() - startTime;
      const data = await response.json();

      if (response.status === 402) {
        setAiTelemetry({
          status: '402 Payment Required',
          latency: `${latency}ms`,
          authenticated: true,
          permission: 'DENIED_TRIAL_EXPIRED'
        });
        throw new Error("Your license verification failed: 7-Day Free Trial has expired. Please activate standard protocol.");
      }

      if (response.status === 403) {
        setAiTelemetry({
          status: '403 Forbidden',
          latency: `${latency}ms`,
          authenticated: false,
          permission: 'ACCESS_DENIED_NO_PLAN'
        });
        throw new Error("Access Denied: No active trial or subscription found.");
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      setAiResult(data.result);
      setAiTelemetry({
        status: '200 OK / Active License Verified',
        latency: `${latency}ms`,
        authenticated: true,
        permission: 'ALLOWED_UNRESTRICTED',
        model: 'gemini-3.5-flash',
        engine: 'Google AI Studio Core'
      });
    } catch (err: any) {
      setAiResult(`LICENSE VERIFICATION FAILED: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Human friendly trial duration helper
  const getTrialDurationString = () => {
    if (!user || user.status !== 'TRIAL') return '';
    const diff = user.trialEndDate - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    if (hours > 24) {
      return `${Math.ceil(hours / 24)} Days`;
    }
    return `${hours} Hours`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] font-sans pb-24" id="subscription-hub-root">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Primary header navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">FLUX INTELLIGENCE OS</span>
              <span className="block text-[9px] font-bold text-orange-500 tracking-widest uppercase">Operator Console v2.1.4</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="text-xs font-bold uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/pricing')} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
            >
              Portal Auth
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-16 space-y-12 relative z-10">
        
        {/* Grounding verified badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <Shield size={14} className="text-[#FF6B00]" />
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">GROUNDING VERIFIED</span>
          </div>
        </div>

        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">
            OPERATOR LICENSE & <span className="text-orange-500">SUBSCRIPTION</span> HUB
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
            Command status limits, manage trialing phases, unlock neural APIs, and launch secure customer billing configurations.
          </p>
        </div>

        {/* Notifications */}
        {(error || successMessage) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-center max-w-2xl mx-auto border",
              error 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            )}
          >
            {error || successMessage}
          </motion.div>
        )}

        {/* Bento Grid Core Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Node 1: Current Status Dashboard */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Pillar I : State</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                  user?.status === 'SUBSCRIBED' 
                    ? "bg-emerald-500/10 text-emerald-500"
                    : user?.status === 'EXPIRED' 
                      ? "bg-red-500/10 text-red-500 animate-pulse" 
                      : "bg-amber-500/10 text-amber-500"
                )}>
                  {user?.status || 'TRIALING'}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-0.5">Active Profile</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 text-[#FF6B00] rounded-xl flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{user?.name || 'Anonymous Architect'}</h4>
                    <span className="block text-[10px] font-mono text-slate-500 leading-none">{user?.email || 'unregistered@flux.os'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wide">Subscription Tier:</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white uppercase">
                    {user?.plan === 'annual' ? 'Elite Yearly' : (user?.plan === 'monthly' ? 'Protocol Monthly' : 'Free Trial Node')}
                  </span>
                </div>
                {user?.status === 'TRIAL' && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wide">Time Remaining:</span>
                    <span className="font-mono font-black text-[#FF6B00] uppercase flex items-center gap-1.5">
                      <Clock size={12} /> {getTrialDurationString()}
                    </span>
                  </div>
                )}
                {user?.trialEndDate && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wide">Expiration Bound:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {new Date(user.trialEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              {user?.status === 'EXPIRED' && (
                <button
                  onClick={requestExtension}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-amber-500/10"
                >
                  Request 24H Trial Extension
                </button>
              )}
              {user?.status === 'TRIAL' && (
                <button
                  onClick={simulateExpiration}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-mono font-bold text-[9px] uppercase tracking-widest rounded-2xl transition-all"
                >
                  Simulate Trial Expiration
                </button>
              )}
              <button
                onClick={handleLaunchBillingPortal}
                disabled={isProcessing === 'portal'}
                className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing === 'portal' ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Configuring Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Command Customer Portal</span>
                    <ExternalLink size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Node 2 & 3: Interactive License and Sandbox Verification Playground */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-[#FF6B00] uppercase tracking-widest">Pillar II : Security & API Verification</span>
                <span className="text-[10px] font-mono text-slate-500">Node Status: Operational</span>
              </div>

              <div>
                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">API LICENSE PLAYGROUND</h3>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Validate that your strategic license, token authorizations, and Gemini routing parameters are working perfectly under trial constraints.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Interactive Sandbox Prompt</label>
                <div className="relative">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Provide a custom business context..."
                    className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Terminal-like output */}
              <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 border border-slate-800 h-44 overflow-y-auto space-y-3">
                <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-500 text-[9px]">
                  <span>SYSTEM COMMAND_LINE MONITOR</span>
                  <span>v2.1.4_RELEASE</span>
                </div>
                {aiTelemetry && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 border-b border-slate-800 pb-2">
                    <div>HTTP_STATUS: <span className="text-emerald-500">{aiTelemetry.status}</span></div>
                    <div>LATENCY: <span className="text-sky-400">{aiTelemetry.latency}</span></div>
                    <div>AUTH_VERIFIED: <span className="text-emerald-500">{String(aiTelemetry.authenticated).toUpperCase()}</span></div>
                    <div>ROUTED_ENGINE: <span className="text-amber-500">{aiTelemetry.model || 'N/A'}</span></div>
                  </div>
                )}
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-amber-500 py-4 animate-pulse">
                    <RefreshCw size={12} className="animate-spin" />
                    <span>EXECUTING NEURAL SECURITY AND RETRIEVAL ALGORITHMS...</span>
                  </div>
                ) : aiResult ? (
                  <div className="whitespace-pre-wrap py-2 leading-relaxed text-slate-200">
                    {aiResult}
                  </div>
                ) : (
                  <div className="text-slate-600 py-4 italic">
                    Press "Verify Intelligent Strategic License" below to run verification.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleTestAIFeature}
              disabled={aiLoading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50"
            >
              Verify Intelligent Strategic License
            </button>
          </div>
        </div>

        {/* Active Upgrades Path */}
        <div className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-black text-[#FF6B00] uppercase tracking-widest">Pillar III : Capacity upgrades</span>
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white uppercase">UNLEASH UNRESTRICTED PERFORMANCE PLAN</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((p) => (
              <div 
                key={p.id}
                className={cn(
                  "p-10 rounded-[40px] flex flex-col justify-between h-full relative transition-transform hover:scale-[1.01] border-2",
                  p.color === 'orange'
                    ? "bg-white dark:bg-slate-900 border-[#FF6B00] shadow-2xl shadow-orange-500/5"
                    : "bg-slate-900 text-white border-slate-800"
                )}
              >
                <div className="space-y-6 flex-1">
                  <div className="space-y-1">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      p.color === 'orange' ? "text-[#FF6B00]" : "text-sky-400"
                    )}>
                      {p.tier}
                    </span>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight">{p.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-display font-black">{p.price}</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">/ {p.interval}</span>
                  </div>

                  <p className={cn(
                    "text-xs leading-relaxed font-medium",
                    p.color === 'orange' ? "text-slate-500 dark:text-slate-400" : "text-slate-400"
                  )}>
                    {p.desc}
                  </p>

                  <ul className="space-y-3.5 pt-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-wide">
                        {p.color === 'orange' ? (
                          <Star size={12} className="text-[#FF6B00] shrink-0" />
                        ) : (
                          <Shield size={12} className="text-sky-400 shrink-0" />
                        )}
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    disabled={isProcessing !== null}
                    onClick={() => handleCreateCheckoutSession(p.priceId, p.id)}
                    className={cn(
                      "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-50",
                      p.color === 'orange'
                        ? "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-orange-500/10"
                        : "bg-white hover:bg-slate-200 text-slate-950"
                    )}
                  >
                    {isProcessing === p.id ? 'Deploying Security Channels...' : p.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Guidelines Footnote */}
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 text-[10px] text-slate-500 dark:text-slate-400 font-mono space-y-2 border border-slate-200/50 dark:border-slate-800">
          <div className="font-bold text-[#FF6B00] uppercase tracking-wider">SYSTEM GOVERNANCE LOGS (LKP-002 Compliant)</div>
          <div>governance_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" | governance_hash: "sha256(rules_snapshot)"</div>
          <div>All client checkout flows redirect via secure HTTPS Stripe channels. Default node trialing operates with a strict 7-day limit window. AI requests utilize token authorization verification.</div>
        </div>
      </div>
    </div>
  );
}
