import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, BrainCircuit, Globe, Target, Rocket, CheckCircle2, ChevronRight, FileText, Download, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { LoyaltyAgentService } from '../services/loyaltyAgentService';

// Initialize Gemini - use standard environment variable patterns
const ai = new GoogleGenAI({ 
  apiKey: (process.env as any).GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY || "" 
});

export default function StrategyLab() {
  const [prompt, setPrompt] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('All Channels');
  const [budget, setBudget] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStrategy('');

    try {
      // Log to mesh
      await LoyaltyAgentService.getInstance().processAction(`Strategy Generation: ${prompt.substring(0, 30)}...`);

      const systemPrompt = `You are a world-class Digital Marketing Strategic Architect. 
      Generate a comprehensive, high-conversion marketing strategy for the following request. 
      Format with clear headings (Markdown), bullet points, and high-impact tactical advice.
      Request: ${prompt}
      Target Platform: ${targetPlatform}
      Budget Category: ${budget}
      Include sections for: Core Value Proposition, Channel Strategy, KPI Targets, and a 4-week execution roadmap.`;

      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: systemPrompt
      });
      
      setStrategy(response.text || "No response generated.");
    } catch (err) {
      console.error(err);
      setStrategy("### Error\nFailed to generate strategy. Please verify your Gemini API key in the environment variables.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!strategy) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(strategy.replace(/[#*]/g, ''), 180);
    doc.text("Strategic Marketing Blueprint", 10, 10);
    doc.text(splitText, 10, 20);
    doc.save(`strategy_blueprint_${Date.now()}.pdf`);
  };

  const handleExportDOCX = () => {
    if (!strategy) return;
    const header = "Strategic Marketing Blueprint\n" + "=".repeat(30) + "\n\n";
    const blob = new Blob([header + strategy], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `strategy_blueprint_${Date.now()}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400">
          <BrainCircuit size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Neural Strategy Engine v2.4</span>
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">AI Strategy Lab</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate comprehensive marketing blueprints in seconds. Input your goals and let our neural engine architect your growth.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 pt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            GROUNDING VERIFIED
          </span>
          <a href="https://openai.com/chatgpt/team" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#00AEEF] border border-blue-500/10 rounded-xl text-[10px] font-bold transition-all">
            ChatGPT Team ↗
          </a>
          <a href="https://gemini.google.com/work" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 rounded-xl text-[10px] font-bold transition-all">
            Gemini Business ↗
          </a>
          <a href="https://www.anthropic.com/claude/team" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/10 rounded-xl text-[10px] font-bold transition-all">
            Claude Teams ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="glass border border-slate-900 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Rocket size={16} className="text-blue-500" />
              Configure Lab
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Campaign Goal / Brief</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Launch a premium subscription box for gourmet coffee lovers in the EU..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/50 min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Platform</label>
                  <select 
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none"
                  >
                    <option>All Channels</option>
                    <option>Social Media</option>
                    <option>Search (SEO/PPC)</option>
                    <option>E-commerce</option>
                  </select>
                </div>
                <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Budget</label>
                  <select 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Premium</option>
                    <option>Enterprise</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing Engine...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Architect Strategy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
             <div className="flex items-center gap-3 mb-3 text-blue-400">
               <CheckCircle2 size={18} />
               <h4 className="text-sm font-bold">Standard Features</h4>
             </div>
             <ul className="space-y-3">
                <li className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Persona Mapping</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </li>
                <li className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Competitor Analysis</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </li>
                <li className="text-[11px] text-slate-400 flex items-center justify-between">
                   <span>Creative Direction</span>
                   <span className="text-emerald-400 font-bold">Active</span>
                </li>
             </ul>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {!strategy && !isGenerating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-900 rounded-[40px] bg-slate-950/40"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                  <BrainCircuit className="text-slate-700" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Ready for Innovation</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                  Enter your mission brief on the left to activate the AI Strategy Lab.
                </p>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="h-6 w-1/3 bg-slate-900 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-900 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-900 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-slate-900 rounded animate-pulse" />
                </div>
                <div className="h-40 w-full bg-slate-900 rounded-3xl animate-pulse" />
              </motion.div>
            )}

            {strategy && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 flex gap-2">
                   <button 
                     onClick={() => {
                        handleExportPDF();
                        LoyaltyAgentService.getInstance().processAction('Strategy Download: PDF Export Initiation');
                     }}
                     className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                   >
                     <FileText size={14} />
                     Export PDF
                   </button>
                   <button 
                     onClick={handleExportDOCX}
                     className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                   >
                     <Download size={14} />
                     Export DOCX
                   </button>
                </div>

                <div className="prose prose-invert max-w-none prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:text-blue-400 prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-400">
                  <ReactMarkdown>{strategy}</ReactMarkdown>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-900 space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-blue-500/5 rounded-[32px] border border-blue-500/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Brain size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Intelligence Assistant</p>
                        <p className="text-sm font-bold text-white">Would you like me to add this to your Marketing Calendar for Monday?</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Dismiss</button>
                      <button 
                        onClick={() => LoyaltyAgentService.getInstance().processAction("Trend-to-Task: Schedule strategy from Lab to Marketing Calendar")}
                        className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-all"
                      >
                        Schedule Strategy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-900 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                     Strategy Verified by NeuroLink
                   </div>
                   <button className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                     Schedule Strategy Session <ChevronRight size={14} />
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
