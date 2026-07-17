import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside Flux Registry Node:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 dark:bg-black flex items-center justify-center p-6 text-slate-200 antialiased font-sans">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            {/* Background Accent Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-5">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-orange-500 tracking-widest bg-orange-500/5 px-2.5 py-1 rounded-md border border-orange-500/10">
                  Securitized Guardrail Locked
                </span>
                <h1 className="text-xl font-bold text-white mt-1.5 font-sans">Runtime Compliance Exception</h1>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
              The neural orchestrator has intercepted a critical exception in this rendering tree. The parent thread context has been isolated for sandbox diagnostic analysis.
            </p>

            {this.state.error && (
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 mb-6 overflow-hidden">
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>Exception Trace</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                </div>
                <div className="font-mono text-xs text-rose-400 max-h-40 overflow-y-auto whitespace-pre-wrap select-all no-scrollbar">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold font-sans uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>Re-Initialize Sandbox</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs font-bold font-sans uppercase tracking-wider transition-all border border-slate-700/80 cursor-pointer"
              >
                <span>Direct Live Refresh</span>
              </button>
            </div>

            {/* Micro Indicator */}
            <div className="mt-8 flex items-center justify-between text-[9px] font-mono text-slate-600 font-bold border-t border-slate-800/50 pt-4">
              <span>SANDBOX ENGINE: FLUX-E2E-SHIELD</span>
              <span>EST. TIME: 2026 UTC</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
