import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-agency p-12 text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-4">Command Aborted</h1>
        <p className="text-slate-500 mb-10 font-medium">The payment sequence was cancelled. No charges were made to your account. If you experienced an error, contact technical support.</p>
        
        <div className="space-y-4">
          <Link to="/" className="btn-primary w-full justify-center bg-slate-900 border-none">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <Link to="/support" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors py-4">
            <LifeBuoy size={14} /> Open Support Ticket
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
