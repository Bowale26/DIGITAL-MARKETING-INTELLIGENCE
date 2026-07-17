import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, 
  Video, 
  Film, 
  Sparkles, 
  Download, 
  Layers, 
  Maximize2, 
  Plus, 
  Settings, 
  CheckCircle2,
  Zap,
  Layout,
  Palette,
  Type,
  Trash2,
  Copy,
  ChevronRight,
  Loader2,
  Terminal,
  History,
  Clapperboard,
  Camera,
  Scissors,
  Share2,
  AlertCircle,
  FileText,
  Monitor,
  Smartphone,
  Square,
  Scaling,
  ShieldCheck,
  Globe,
  Play,
  MonitorPlay,
  Box,
  Fingerprint
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LoyaltyAgentService, AgentRole, AgentHandoff } from '../services/loyaltyAgentService';

interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'animation';
  url: string;
  prompt: string;
  format: string;
  resolution: string;
  status: 'ready' | 'generating' | 'failed';
  timestamp: string;
  metadata?: {
    cinematography: string;
    subject: string;
    action: string;
    context: string;
    style: string;
  };
}

const initialAssets: MediaAsset[] = [
  {
    id: 'ASSET-001',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    prompt: '[00:00-00:03] Macro close-up, droplets of condensation rolling down a sleek matte-black beverage can. Neon pink and cyan light reflects off the metal surface.',
    format: 'MP4 (4K)',
    resolution: '1920x1080',
    status: 'ready',
    timestamp: '2h ago'
  }
];

export default function MediaStudio() {
  const [activeTab, setActiveTab] = useState<'create' | 'library' | 'orchestration'>('create');
  const [activeSubTab, setActiveSubTab] = useState<'text-to-video' | 'image-to-video' | 'video-to-video'>('text-to-video');
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [isGenerating, setIsGenerating] = useState(false);
  const [handoffLogs, setHandoffLogs] = useState<AgentHandoff[]>([]);
  
  // Prompt State
  const [promptData, setPromptData] = useState({
    cinematography: '',
    subject: '',
    action: '',
    context: '',
    style: ''
  });

  const [freeformPrompt, setFreeformPrompt] = useState('');
  const [isFreeform, setIsFreeform] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    model: 'Gemini 1.5 Pro',
    aspectRatio: '16:9',
    duration: '8s',
    resolution: '4K',
    jsonMode: false,
    grounding: true,
    codeExecution: false,
    safetyCheck: true,
    upscale: true,
    soundEffects: false,
    motionBrush: false,
    cameraControl: 'Default'
  });

  // Campaign Profile
  const [campaignProfile, setCampaignProfile] = useState({
    industry: 'E-commerce',
    audience: 'Gen-Z Tech Enthusiasts',
    platform: 'Instagram Reels',
    objective: 'Conversion',
    brandVoice: 'Luxury / Minimalist',
    ctaStrategy: 'Hard conversion'
  });

  const fullPrompt = useMemo(() => {
    if (isFreeform) return freeformPrompt;
    const { cinematography, subject, action, context, style } = promptData;
    if (!subject) return '';
    return `[CINEMATOGRAPHY: ${cinematography || 'Default'}] [SUBJECT: ${subject}] [ACTION: ${action}] [CONTEXT: ${context}] [STYLE: ${style}]`;
  }, [promptData, freeformPrompt, isFreeform]);

  const applyPreset = () => {
    setIsFreeform(true);
    setFreeformPrompt(`[00:00-00:04] Wide establishing shot, a modern glass office building at sunrise, camera slowly pushing in through the lobby. [00:04-00:08] Close-up of a young professional's hands typing on a laptop, holographic UI elements floating above the screen showing analytics dashboards. [00:08-00:12] Over-the-shoulder shot, the professional smiles and shares the screen with colleagues during a video call. [00:12-00:16] Aerial pull-back revealing a global network of connected offices pulsing with light. Clean, futuristic, corporate but warm, blue and white color palette, soft bokeh, premium tech commercial style, 4K.`);
  };

  const handleGenerate = async () => {
    if (!fullPrompt) return;
    setIsGenerating(true);

    // Trigger A2A Handoff
    const logs = await LoyaltyAgentService.getInstance().processAction(`Media Studio: Video Generation (Veo) - ${fullPrompt.substring(0, 50)}...`, {
      ...settings,
      profile: campaignProfile,
      prompt_type: activeSubTab
    });
    setHandoffLogs(prev => [...logs, ...prev]);
    
    // Simulate generation
    setTimeout(() => {
      const newAsset: MediaAsset = {
        id: `VEO-${Date.now()}`,
        type: 'video',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
        prompt: fullPrompt,
        format: 'MP4 (4K)',
        resolution: settings.resolution === '4K' ? '3840x2160' : '1920x1080',
        status: 'ready',
        timestamp: 'Just now',
        metadata: promptData
      };
      setAssets([newAsset, ...assets]);
      setIsGenerating(false);
      
      // Auto Safety Check
      if (settings.safetyCheck) {
        setTimeout(async () => {
          const sLogs = await LoyaltyAgentService.getInstance().processAction(`Safety Check: Verify commercial integrity for VEO-${Date.now()}`);
          setHandoffLogs(prev => [...sLogs, ...prev]);
        }, 1000);
      }
    }, 4000);
  };

  const handleExport = async (platform: string) => {
    const logs = await LoyaltyAgentService.getInstance().processAction(`Export Asset to ${platform}`, {
      platform,
      asset_id: assets[0]?.id
    });
    setHandoffLogs(prev => [...logs, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-purple-500/10 rounded-full">
                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Veo Video Engine v2.0</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 <Zap size={10} className="text-purple-500" />
                 <span>A2A Protocol: Synchronized</span>
              </div>
           </div>
           <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
             Media <span className="text-slate-200 dark:text-slate-800">Studio</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
             Professional-grade cinematic synthesis. Grounds your visual strategy in market intelligence.
           </p>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl">
           {(['create', 'library', 'orchestration'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === tab 
                   ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                   : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
               )}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Workshop Controls */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* System Activation Status */}
          <div className="card-agency p-8 bg-slate-900 border-none">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-purple-500">System Activation Status</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'New Prompt Workspace', 'Structured Prompt Builder', 'Chat Prompt Interface',
                  'Freeform Prompt Editor', 'System Instructions', 'Model Selection',
                  'JSON Mode', 'Google Grounding', 'Code Sandbox', 'Function Calling',
                  'RAG Connector', 'Evaluation Suite', 'Version Tracker', 'Collaboration'
                ].map(module => (
                  <div key={module} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase truncate">{module}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Main Prompt Workspace */}
          <div className="card-agency p-0 overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-slate-800/50">
              {(['create', 'library', 'orchestration'] as const).map(tab => (
                <button
                  key={tab}
                  className="hidden" // Just to keep reference if needed
                />
              ))}
              {(['text-to-video', 'image-to-video', 'video-to-video'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={cn(
                    "flex-1 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-r border-slate-100 dark:border-slate-800/50 last:border-r-0",
                    activeSubTab === tab ? "bg-slate-50 dark:bg-slate-900/50 text-purple-600 border-b-2 border-b-purple-500" : "text-slate-400"
                  )}
                >
                  {tab.replace(/-/g, ' ')}
                </button>
              ))}
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsFreeform(false)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      !isFreeform ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "bg-slate-100 dark:bg-slate-900 text-slate-400"
                    )}
                  >
                    Structured
                  </button>
                  <button 
                    onClick={() => setIsFreeform(true)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      isFreeform ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "bg-slate-100 dark:bg-slate-900 text-slate-400"
                    )}
                  >
                    Freeform
                  </button>
                </div>
                <button 
                  onClick={applyPreset}
                  className="text-[9px] font-black uppercase tracking-widest text-purple-500 hover:underline"
                >
                  Load High-Fidelity Preset
                </button>
              </div>

              {isFreeform ? (
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    <FileText size={14} className="text-purple-500" /> Freeform Prompt Editor
                  </label>
                  <textarea 
                    value={freeformPrompt}
                    onChange={e => setFreeformPrompt(e.target.value)}
                    placeholder="Enter your cinematic sequence [00:00-00:XX] shots..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-6 rounded-[32px] text-[13px] font-medium min-h-[200px] focus:ring-2 focus:ring-purple-500/20 leading-relaxed"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <Camera size={14} className="text-purple-500" /> Cinematography
                      </label>
                      <input 
                        type="text"
                        value={promptData.cinematography}
                        onChange={e => setPromptData({...promptData, cinematography: e.target.value})}
                        placeholder="e.g. Macro close-up, Aerial drone"
                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-4 rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <Clapperboard size={14} className="text-purple-500" /> Subject
                      </label>
                      <input 
                        type="text"
                        value={promptData.subject}
                        onChange={e => setPromptData({...promptData, subject: e.target.value})}
                        placeholder="e.g. Matte-black beverage can"
                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-4 rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <Zap size={14} className="text-purple-500" /> Action
                      </label>
                      <input 
                        type="text"
                        value={promptData.action}
                        onChange={e => setPromptData({...promptData, action: e.target.value})}
                        placeholder="e.g. Condensation rolling down the surface"
                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-4 rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <Globe size={14} className="text-purple-500" /> Context
                      </label>
                      <input 
                        type="text"
                        value={promptData.context}
                        onChange={e => setPromptData({...promptData, context: e.target.value})}
                        placeholder="e.g. Futuristic Tokyo street, neon glow"
                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-4 rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <Palette size={14} className="text-purple-500" /> Style & Ambiance
                      </label>
                      <textarea 
                        value={promptData.style}
                        onChange={e => setPromptData({...promptData, style: e.target.value})}
                        placeholder="e.g. Cinematic, premium lifestyle aesthetic, vibrant colors"
                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 p-4 rounded-2xl text-[11px] font-medium min-h-[110px] focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 mb-8">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em]">Structured Prompt Output</span>
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                       <Copy size={14} />
                    </button>
                 </div>
                 <p className="text-[12px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    {fullPrompt || "Waiting for Subject mapping..."}
                 </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !fullPrompt}
                className={cn(
                  "w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 relative overflow-hidden",
                  isGenerating 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400" 
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white shadow-2xl"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Neural Synthesis in Progress...
                  </>
                ) : (
                  <>
                    Initialize Veo Synthesis <Sparkles size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Library Grid */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <History size={16} /> Asset Archive
              </h2>
              <div className="flex gap-4">
                 <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white">View All</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {assets.map(asset => (
                <motion.div
                  layout
                  key={asset.id}
                  className="card-agency group p-0 overflow-hidden"
                >
                  <div className="aspect-video relative bg-slate-900">
                    <img 
                      src={asset.url} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 active:scale-95 transition-all">
                          <Maximize2 size={24} />
                       </button>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                         {asset.resolution}
                       </span>
                       <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                         {asset.format}
                       </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Generation metadata</p>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-6">
                      {asset.prompt}
                    </p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                       <div className="flex gap-4">
                          <button 
                            onClick={() => handleExport('YouTube')}
                            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-red-500 transition-colors"
                          >
                             <Play size={16} />
                          </button>
                          <button 
                            onClick={() => handleExport('Ads Manager')}
                            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-blue-500 transition-colors"
                          >
                             <Share2 size={16} />
                          </button>
                          <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-amber-500 transition-colors">
                             <MonitorPlay size={16} />
                          </button>
                       </div>
                       <div className="flex gap-4">
                          <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-purple-500">
                             Frames <ImageIcon size={14} />
                          </button>
                          <button className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">
                             Variations <Plus size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & A2A Console */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Campaign Framework */}
          <div className="card-agency p-8 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <Layout size={18} className="text-purple-500" /> Campaign Framework
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(campaignProfile).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <select 
                    value={value}
                    onChange={e => setCampaignProfile({...campaignProfile, [key]: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-[10px] font-bold uppercase transition-all"
                  >
                    <option>{value}</option>
                    <option>Standard Option</option>
                    <option>Alternative Tier</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* System Instructions */}
          <div className="card-agency p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <FileText size={18} className="text-purple-500" /> System Instructions
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded">Active</span>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "Maintain ultra-high luxury aesthetic. Prioritize soft bokeh and cinematic lighting transitions. Ensure all generated content adheres to the 'Technical Excellence' brand voice."
                </p>
             </div>
             <button className="w-full mt-4 py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-500 hover:border-purple-500 transition-all">
                Update Protocol
             </button>
          </div>

          {/* System Settings */}
          <div className="card-agency p-8 space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
               <Settings size={18} className="text-purple-500" /> Media Engine Config
             </h3>
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model</label>
                      <select 
                        value={settings.model} 
                        onChange={e => setSettings({...settings, model: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-[10px] font-bold"
                      >
                         <option>Gemini 1.5 Pro</option>
                         <option>Gemini 1.5 Flash</option>
                         <option>Veo Ultra (Alpha)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                      <select 
                        value={settings.aspectRatio} 
                        onChange={e => setSettings({...settings, aspectRatio: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-[10px] font-bold"
                      >
                         <option>16:9</option>
                         <option>9:16</option>
                         <option>1:1</option>
                         <option>4:3</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                     <select 
                       value={settings.duration}
                       onChange={e => setSettings({...settings, duration: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-[10px] font-bold uppercase"
                     >
                        <option>4s</option>
                        <option>8s</option>
                        <option>12s</option>
                        <option>24s</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Camera Controls</label>
                     <select 
                       value={settings.cameraControl}
                       onChange={e => setSettings({...settings, cameraControl: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-[10px] font-bold uppercase transition-all"
                     >
                        <option>Default</option>
                        <option>Drone Sweep</option>
                        <option>Dolly Zoom</option>
                        <option>Static Macro</option>
                        <option>Handheld Organic</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temperature</label>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                   </div>

                   {[
                     { id: 'jsonMode', label: 'JSON Extraction Mode', icon: Terminal },
                     { id: 'grounding', label: 'Google Search Grounding', icon: Globe },
                     { id: 'codeExecution', label: 'Python Sandbox (Sandbox)', icon: Scissors },
                     { id: 'safetyCheck', label: 'Safety & Policy Sweep', icon: ShieldCheck },
                     { id: 'motionBrush', label: 'Selective Motion Brush', icon: Box },
                     { id: 'styleTransfer', label: 'A2A Style Transfer', icon: Palette },
                     { id: 'ragConnector', label: 'Knowledge Base / RAG', icon: Fingerprint },
                     { id: 'upscale', label: 'Upscale & Enhance', icon: Scaling },
                     { id: 'soundEffects', label: 'Sound FX Generation', icon: MonitorPlay }
                   ].map(toggle => (
                      <div key={toggle.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-3">
                            <toggle.icon size={16} className="text-slate-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{toggle.label}</span>
                         </div>
                         <button 
                           onClick={() => setSettings(prev => ({...prev, [toggle.id]: !prev[toggle.id as keyof typeof prev]}))}
                           className={cn(
                             "w-10 h-5 rounded-full relative transition-all",
                             settings[toggle.id as keyof typeof settings] ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"
                           )}
                         >
                            <div className={cn(
                              "w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all",
                              settings[toggle.id as keyof typeof settings] ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* A2A Protocol Console */}
          <div className="card-agency p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-purple-500">
              <Terminal size={16} /> A2A Protocol Console
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {handoffLogs.length > 0 ? (
                handoffLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-purple-500 uppercase">{log.source} → {log.target}</span>
                      <span className="text-[8px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      {log.payload.message || `Signal: ${log.payload.context?.intent || 'MEDIA_ACTIVATE'}`}
                    </div>
                    {log.payload.status === 'EXPORT_COMPLETE' && (
                      <div className="mt-2 flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase">
                        <CheckCircle2 size={10} /> Ledger Updated
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Terminal size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiting for A2A Handshake...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
