import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Target, 
  Search, 
  FileText, 
  Mail, 
  Loader2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIService } from '../services/aiService';

type ChatMode = 'general' | 'ad_copy' | 'seo' | 'blog' | 'email';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: ChatMode;
  data?: any;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Welcome to the Flux Marketing Copilot. How can I assist your campaign today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>('general');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      mode: currentMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      const ai = AIService.getInstance();

      if (currentMode === 'ad_copy') {
        response = await ai.generateAdCopy(input);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Ad creative generated for ${response.platform}.`,
          data: response,
          mode: 'ad_copy'
        }]);
      } else if (currentMode === 'seo') {
        response = await ai.generateSEOKeywords(input);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `SEO Keyword cluster synthesized for "${response.primary_keyword}".`,
          data: response,
          mode: 'seo'
        }]);
      } else if (currentMode === 'blog') {
        response = await ai.generateBlogScript(input);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Blog outline and draft segment created: ${response.title}`,
          data: response,
          mode: 'blog'
        }]);
      } else if (currentMode === 'email') {
        response = await ai.generateEmailSequence(input);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Email campaign sequence architected: ${response.campaign_name}`,
          data: response,
          mode: 'email'
        }]);
      } else {
        const gen = await ai.generateContent(input, "You are a friendly and professional marketing expert. Always provide a Call to Action.");
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: gen.text
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please check your credentials or try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const modeConfigs: Record<ChatMode, { name: string; icon: any; color: string; desc: string }> = {
    general: { name: 'Expert Chat', icon: Sparkles, color: 'text-slate-500', desc: 'General marketing advice' },
    ad_copy: { name: 'Ad Gen', icon: Target, color: 'text-orange-500', desc: 'Platform specific variations' },
    seo: { name: 'Keyword Engine', icon: Search, color: 'text-blue-500', desc: 'Search intent clusters' },
    blog: { name: 'Writer', icon: FileText, color: 'text-emerald-500', desc: 'Scripts & blog outlines' },
    email: { name: 'Sequencer', icon: Mail, color: 'text-purple-500', desc: 'Multi-touch automation' }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
        <Bot size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isExpanded ? '800px' : '400px',
              height: isExpanded ? '90vh' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 shadow-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-tight text-sm">Flux Copilot</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Mode Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="p-2 flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-900">
              {(Object.keys(modeConfigs) as ChatMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCurrentMode(mode)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                    currentMode === mode 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  {React.createElement(modeConfigs[mode].icon, { size: 12 })}
                  {modeConfigs[mode].name}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30 no-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-[#FF6B00] text-white rounded-br-none" 
                      : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-sm"
                  )}>
                    {msg.content}
                  </div>

                  {/* Render Data if available */}
                  {msg.data && msg.mode === 'ad_copy' && (
                    <div className="mt-4 w-full max-w-[90%] p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-500/20 text-emerald-900 dark:text-emerald-400">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Validated Ad Variant</span>
                      </div>
                      <h4 className="text-lg font-bold tracking-tight mb-1">{msg.data.headline}</h4>
                      <p className="text-xs dark:text-emerald-300 opacity-80 mb-4">{msg.data.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.data.keywords?.map((k: string) => (
                          <span key={k} className="px-2 py-0.5 bg-emerald-500/10 rounded text-[9px] font-bold uppercase">{k}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => alert(`Pushing to ${msg.data.platform}...`)}
                        className="mt-6 w-full py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Push to {msg.data.platform}
                      </button>
                    </div>
                  )}

                  {msg.data && msg.mode === 'seo' && (
                    <div className="mt-4 w-full max-w-[90%] p-6 bg-blue-50 dark:bg-blue-500/5 rounded-3xl border border-blue-500/20 text-blue-900 dark:text-blue-400">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                          <p className="text-[8px] font-black opacity-50 uppercase tracking-widest mb-1">Impact Score</p>
                          <p className="text-xl font-black">{Math.floor(msg.data.search_volume / 1000)}K+</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                          <p className="text-[8px] font-black opacity-50 uppercase tracking-widest mb-1">Difficulty</p>
                          <p className="text-xl font-black">{msg.data.difficulty_score}/100</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Recommended Variants</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.data.long_tail_variants?.map((v: string) => (
                            <span key={v} className="px-2 py-1 bg-blue-500/10 rounded-lg text-[9px] font-bold">{v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.data && msg.mode === 'blog' && (
                    <div className="mt-4 w-full max-w-[90%] p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-500/20 text-emerald-900 dark:text-emerald-400">
                      <h4 className="text-sm font-black uppercase tracking-tight mb-4 border-b border-emerald-500/20 pb-2">Article Strategy</h4>
                      <div className="space-y-3">
                         {msg.data.outline?.map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <span className="opacity-40 font-mono text-[10px]">{i+1}.</span>
                              <span className="text-xs font-bold leading-tight">{item}</span>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                         <p className="text-[8px] font-black opacity-50 uppercase tracking-widest mb-1">Snippet Optimization (Meta)</p>
                         <p className="text-[10px] italic leading-relaxed">"{msg.data.meta_description}"</p>
                      </div>
                    </div>
                  )}

                  {msg.data && msg.mode === 'email' && (
                    <div className="mt-4 w-full max-w-[90%] p-6 bg-purple-50 dark:bg-purple-500/5 rounded-3xl border border-purple-500/20 text-purple-900 dark:text-purple-400">
                       <h4 className="text-sm font-black uppercase tracking-tight mb-4 border-b border-purple-500/20 pb-2">Campaign Pipeline</h4>
                       <div className="space-y-4">
                          {msg.data.emails?.slice(0, 2).map((email: any, i: number) => (
                             <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest opacity-60">
                                   <span>Step {email.step}</span>
                                   <span>Forecast: {email.forecasted_metrics?.open_rate} OR</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-purple-100 dark:border-purple-900/40 text-[10px] font-bold">
                                   {email.subject_variants?.[0]}
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Analyzing Patterns...</span>
                </div>
              )}
            </div>

            {/* InputArea */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-3 mb-3">
                 <div className={cn("w-2 h-2 rounded-full", modeConfigs[currentMode].color.replace('text', 'bg'))} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                   Active: {modeConfigs[currentMode].name}
                 </span>
              </div>
              <form onSubmit={handleSend} className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Speak to the Flux AI Agent...`}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <p className="mt-3 text-[8px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
                Flux Agency Neural Infrastructure // Build 2.0.4
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
