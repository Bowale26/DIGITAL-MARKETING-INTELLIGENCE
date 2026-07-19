import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Star, Shield, ArrowRight, Clock, User, Mail, Lock, CheckCircle2, RefreshCw, KeyRound, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth, authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../lib/stripe';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail, updatePassword } from 'firebase/auth';

export default function Pricing() {
  const { user, updatePlan, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [newPassword, setNewPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleHardResetAndSignOut = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsProcessing('reset');
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      setSuccessMessage("Storage, cookies, and active session cleared completely! Proceed with signing up a brand-new account.");
    } catch (err: any) {
      setError(err.message || "Failed to clear all cookies and storage.");
    } finally {
      setIsProcessing(null);
      // Reload page to force clean state
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsProcessing('auth');

    try {
      if (isSignUp) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error("Please fill in your name, email, and password.");
        }
        
        // 1. Call Backend API for centralized registration & Stripe customer profile creation
        const response = await fetch('/api/auth/register-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to configure trial account on server.");
        }

        // 2. Sign the newly created user in on the client side using Firebase Auth
        await authService.signIn(formData.email, formData.password);
        setSuccessMessage("Account created & Free Trial configured successfully! Your 7-day trial has started.");
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Please enter your email and password.");
        }
        await authService.signIn(formData.email, formData.password);
        setSuccessMessage("Successfully signed in.");
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const emailToReset = resetEmail || formData.email;

    if (!emailToReset) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    setIsProcessing('reset');
    try {
      await sendPasswordResetEmail(auth, emailToReset);
      setSuccessMessage("A password reset link has been sent to your email. You can change your password easily using that link!");
      setShowPasswordReset(false);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setError(err.message || "Could not send reset email. Please verify your email.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleInstantPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsProcessing('change_password');
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setSuccessMessage("Your password was updated instantly! Use your new password for future sign ins.");
        setNewPassword('');
      } else {
        throw new Error("No active user session found to update password.");
      }
    } catch (err: any) {
      console.error("Instant password update failed:", err);
      setError(err.message || "Could not change password. For security reasons, you may need to Sign Out and Sign In again to re-authenticate.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSelectPlan = async (planId: 'monthly' | 'yearly') => {
    setError(null);
    setSuccessMessage(null);
    setIsProcessing(planId);

    try {
      // 1. If not authenticated, prompt user to Sign Up / Sign In first
      if (!isAuthenticated) {
        throw new Error(`Please Sign Up or Sign In above before subscribing to the ${planId === 'monthly' ? 'Monthly' : 'Yearly'} Plan.`);
      }

      // 2. Call backend Stripe Checkout session API
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceLookupKey: planId,
          customerEmail: user?.email
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Could not initialize Stripe Checkout window context.");
      }
      
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setError(err.message || "Could not initialize checkout. Please try again.");
      
      // If error occurs but user was authenticated, we can simulate updating the plan
      if (isAuthenticated) {
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
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-20 font-sans" id="pricing-page-container">
      {/* Top Banner and Headers */}
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full"
        >
          <Zap size={14} className="text-[#FF6B00]" />
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">Subscription & Billing Management</span>
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-display font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter"
          >
            SUBSCRIPTION & <span className="text-orange-500">BILLING</span> PORTAL
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Manage trial options, secure subscriptions, and command user credentials. Get unrestricted platform power with simple setups.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Clock size={16} /> All subscription setups start with a 7-day free trial limit on default nodes.
          </motion.p>
        </div>

        {/* Global Notifications Panel */}
        {(error || successMessage) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-center max-w-md mx-auto border",
              error 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            )}
          >
            {error || successMessage}
          </motion.div>
        )}

        {/* Unified Authentication & Trial Activation Section */}
        <div className="max-w-md mx-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-3xl flex gap-1 mb-6">
          <button
            onClick={() => {
              setIsSignUp(true);
              setShowPasswordReset(false);
            }}
            className={cn(
              "flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all",
              isSignUp && !isAuthenticated
                ? "bg-orange-500 text-white shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            )}
            id="btn-trial-signup"
          >
            Free Trial (Sign Up)
          </button>
          <button
            onClick={() => {
              setIsSignUp(false);
              setShowPasswordReset(false);
            }}
            className={cn(
              "flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all",
              !isSignUp && !isAuthenticated
                ? "bg-orange-500 text-white shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            )}
            id="btn-signin-nav"
          >
            Sign In
          </button>
        </div>

        {/* Dynamic Auth Container */}
        <div className="max-w-md mx-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-xl">
          {!isAuthenticated ? (
            <div>
              <AnimatePresence mode="wait">
                {showPasswordReset ? (
                  <motion.form 
                    key="password-reset"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handlePasswordReset}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Change Password Easily</h3>
                      <p className="text-xs text-slate-500 mt-1">Enter your email below to receive a secure link to reset or change your password easily.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email" 
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="your-email@domain.com"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="submit" 
                        disabled={isProcessing !== null}
                        className="flex-1 py-3 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
                      >
                        {isProcessing === 'reset' ? 'Sending Link...' : 'Send Reset Link'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowPasswordReset(false)}
                        className="px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl text-xs font-bold uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form 
                    key={isSignUp ? "signup" : "signin"}
                    id={isSignUp ? "trial-form" : "signin-form"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleAuthSubmit}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {isSignUp ? 'Initialize Free Trial Node' : 'Command Session Access'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {isSignUp 
                          ? 'Provide your details to immediately start a 7-day free trial of our growth systems.' 
                          : 'Sign in with your email and password credentials to command active parameters.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              required
                              id="fullname"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Your Full Name" 
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="email" 
                            required
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="architect@agency.ca" 
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                          {!isSignUp && (
                            <button 
                              type="button"
                              onClick={() => {
                                setResetEmail(formData.email);
                                setShowPasswordReset(true);
                              }}
                              className="text-[9px] font-mono font-black text-orange-500 uppercase tracking-widest hover:underline"
                            >
                              Forgot / Change easily?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="password" 
                            required
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Password Credentials" 
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isProcessing !== null}
                      className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500 dark:hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      id="auth-submit-btn"
                    >
                      {isProcessing === 'auth' ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>{isSignUp ? 'Sign Up & Start Free Trial' : 'Sign In Now'}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Profile</h4>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name || 'Admin User'}</p>
                  <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
                </div>
              </div>

              {/* Management Hub Section */}
              <div id="management-hub" className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Operator Console</span>
                <button
                  id="btn-manage-portal"
                  onClick={handleLaunchBillingPortal}
                  disabled={isProcessing === 'portal'}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === 'portal' ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Opening Portal...</span>
                    </>
                  ) : (
                    <span>Manage Subscription (Stripe Portal)</span>
                  )}
                </button>
              </div>

              {/* Instant password change widget */}
              <form onSubmit={handleInstantPasswordChange} className="space-y-4">
                <div>
                  <h5 className="text-[10px] font-mono font-black text-[#FF6B00] uppercase tracking-widest flex items-center gap-1.5">
                    <KeyRound size={12} /> Easy Password Management
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Need to change your password? Enter a new password credentials below to update instantly.</p>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password (min 6 chars)" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing !== null}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {isProcessing === 'change_password' ? 'Updating Credentials...' : 'Update Password Instantly'}
                </button>
              </form>

              <button
                onClick={() => signOut()}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-mono font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Sign Out / Disconnect Session
              </button>
            </div>
          )}
        </div>

        {/* Global Reset State Controller */}
        <div className="max-w-md mx-auto text-center mt-4">
          <button
            onClick={handleHardResetAndSignOut}
            disabled={isProcessing === 'reset'}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-300/30 dark:border-slate-800 rounded-full text-[9px] font-mono font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
            id="btn-hard-reset-storage"
          >
            {isProcessing === 'reset' ? (
              <>
                <RefreshCw size={10} className="animate-spin text-orange-500" />
                <span>Clearing Cookies & Cache...</span>
              </>
            ) : (
              <>
                <RefreshCw size={10} className="text-orange-500" />
                <span>Hard Reset Storage & Cookies (Fresh Sign Up)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subscription Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch" id="subscription-cards-grid">
        {/* Protocol Plan Card - $19.99/Monthly */}
        <div className="p-10 rounded-[48px] bg-white dark:bg-slate-900 border-2 border-[#FF6B00] shadow-2xl shadow-orange-500/10 space-y-12 h-full flex flex-col relative z-10 transition-transform hover:scale-[1.02]" id="card-monthly-plan">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              Standard Intelligence
           </div>
           <div className="space-y-6 flex-1">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest pl-1">Stage 1</h4>
                 <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">PROTOCOL MONTHLY</h3>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-display font-black text-slate-900 dark:text-white">
                    $19.99
                 </span>
                 <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Complete digital marketing suite. Activates unlimited strategic simulations and priority keyword extraction.</p>
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
             id="btn-monthly"
           >
              {isProcessing === 'monthly' ? 'Initializing Secure Protocol...' : 'SUBSCRIBE MONTHLY — $19.99/MO'}
           </button>
        </div>

        {/* Elite Enterprise Plan Card - $199.99/Yearly */}
        <div className="p-10 rounded-[48px] bg-slate-900 text-white space-y-12 h-full flex flex-col transition-transform hover:scale-[1.02]" id="card-yearly-plan">
           <div className="space-y-6 flex-1">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest pl-1">Stage X</h4>
                 <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">ELITE YEARLY</h3>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-display font-black text-white">
                    $199.99
                 </span>
                 <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/ Year</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Full power billing mode with absolute platform leverage. Best for high-volume corporate systems.</p>
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
             id="btn-yearly"
           >
              {isProcessing === 'yearly' ? 'Configuring Elite Tier...' : 'SUBSCRIBE YEARLY — $199.99/YR'}
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
