import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, Building2, Briefcase, Globe, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkout } from '../lib/stripe';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        // After successful sign up, link to the 7-day trial (Stage 1: Protocol)
        await checkout('price_1TSOJLBMbxh6jv0C9aEJBKRt', {
          email: email,
          serviceId: 'PROTOCOL'
        });
      } else {
        await signIn(email, password);
        const redirect = searchParams.get('redirect') || '/';
        navigate(redirect === 'pricing' ? '/pricing' : '/');
      }
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  const handleFederatedSync = async () => {
    try {
      await signIn();
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect === 'pricing' ? '/pricing' : '/');
    } catch (error) {
      console.error("Federated sync failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617] font-sans overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {isSignUp ? 'Initialize Instance' : 'Resume Command'}
          </h1>
          <p className="text-slate-500 font-medium">Access your autonomous growth node infrastructure.</p>
        </div>

        <div className="card-agency p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Command Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="architect@agency.os"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                  <button type="button" className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest hover:underline">Forgot Key?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-[#FF6B00] dark:hover:bg-slate-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl">
              {isSignUp ? 'Launch Protocol' : 'Initial Sync'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400">Or Federated Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleFederatedSync}
              className="flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400"
            >
              <Globe size={18} className="text-blue-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">
              <Users size={18} className="text-slate-900 dark:text-white" /> Github
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-500 hover:text-[#FF6B00] transition-colors"
          >
            {isSignUp ? 'Already have an instance? Resume Command' : "Don't have a node yet? Initialize Instance"}
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
            <Building2 size={12} /> SSO Ready
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
            <Briefcase size={12} /> Compliance V4
          </div>
        </div>
      </motion.div>
    </div>
  );
}
