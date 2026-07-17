import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-agency p-12 text-center max-w-md"
      >
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-4">Command Verified</h1>
        <p className="text-slate-500 mb-10 font-medium">Your service activation is now processing. Our technical team is spinning up your dedicated growth environment.</p>
        
        <div className="space-y-4">
          <Link to="/" className="btn-primary w-full justify-center">
            Return to Command Center <ArrowRight size={18} />
          </Link>
          <Link to="/vault" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors py-4">
            <Layers size={14} /> View Project Vault
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
