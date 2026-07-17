import React from 'react';
import { motion } from 'motion/react';
import { Inbox, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: any;
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon: Icon = Inbox 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center card-agency bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2">
      <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 shadow-sm">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="btn-primary"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
