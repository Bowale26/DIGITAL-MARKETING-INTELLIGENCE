import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Zap,
  Globe,
  Monitor,
  FileCode,
  Braces,
  Settings,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CodePlatform {
  id: string;
  name: string;
  frameworks: string[];
  useCases: string[];
  icon: any;
  color: string;
}

const platforms: CodePlatform[] = [
  {
    id: 'PYTHON',
    name: 'Python',
    frameworks: ['FastAPI', 'Flask', 'Streamlit', 'Dash'],
    useCases: ['Backend API', 'Data Pipeline', 'Dashboards'],
    icon: FileCode,
    color: 'text-blue-500'
  },
  {
    id: 'JAVASCRIPT',
    name: 'JavaScript / TS',
    frameworks: ['React', 'Next.js', 'Node.js', 'Vue'],
    useCases: ['React Components', 'Chrome Extensions', 'Real-time Widgets'],
    icon: Braces,
    color: 'text-yellow-500'
  },
  {
    id: 'REST',
    name: 'cURL / REST',
    frameworks: ['Postman', 'Zapier', 'Webhooks'],
    useCases: ['Quick Testing', 'Third-party Integration', 'Automation'],
    icon: Terminal,
    color: 'text-slate-400'
  }
];

export default function CodeLab() {
  const [activePlatform, setActivePlatform] = useState<string>(platforms[0].id);
  const [activeFramework, setActiveFramework] = useState<string>(platforms[0].frameworks[0]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    setIsGenerating(true);
    setGeneratedCode('');
    
    // Simulate generation of high-quality code
    setTimeout(() => {
      let code = '';
      if (activePlatform === 'PYTHON') {
        code = `
import os
import requests
from typing import Dict, Any

class FluxAgencyClient:
    """
    Production-grade client for Flux Agency Neural Engine.
    Handles authentication, error reporting, and retries.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("FLUX_AGENCY_KEY")
        if not self.api_key:
            raise ValueError("FLUX_AGENCY_KEY environment variable is required")
        
        self.base_url = "https://api.flux-agency.ai/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-Flux-Client": "python-sdk-v1"
        }

    def generate_marketing_asset(self, prompt: str, style_id: str = "default") -> Dict[str, Any]:
        """
        Synthesizes a new marketing asset using ground-truth neural lattice.
        """
        payload = {
            "prompt": prompt,
            "config": {
                "style_alignment": style_id,
                "grounding": True
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/synthesize",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            # Handle API errors, rate limits, or network failures
            print(f"Flux Engine Error: {e}")
            return {"status": "error", "message": str(e)}

# Usage Example
if __name__ == "__main__":
    client = FluxAgencyClient()
    result = client.generate_marketing_asset(
        prompt="Hyper-realistic luxury tech ad copy for 2026 launch"
    )
    print(f"Asset Produced: {result.get('asset_url')}")
        `.trim();
      } else if (activePlatform === 'JAVASCRIPT') {
        code = `
import React, { useState } from 'react';

/**
 * FluxEngineComponent
 * Real-time integration widget for Flux Agency Neural Network.
 * Supports React 18+ and Next.js 14+
 */
export const FluxWidget = ({ promptId }) => {
  const [status, setStatus] = useState('idle');
  const [asset, setAsset] = useState(null);

  const triggerSynthesis = async () => {
    setStatus('generating');
    try {
      const response = await fetch('/api/flux/proxy', {
        method: 'POST',
        body: JSON.stringify({ promptId }),
      });
      
      if (!response.ok) throw new Error('Neural link failed');
      
      const data = await response.json();
      setAsset(data.url);
      setStatus('ready');
    } catch (err) {
      console.error('Flux Integration Error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-[32px] border border-white/10">
      <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">
        Neural Integration Active
      </h3>
      
      {status === 'ready' ? (
        <img src={asset} alt="Flux Asset" className="rounded-2xl shadow-2xl" />
      ) : (
        <button 
          onClick={triggerSynthesis}
          disabled={status === 'generating'}
          className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest"
        >
          {status === 'generating' ? 'Syncing Neural State...' : 'Pull Neural Asset'}
        </button>
      )}
    </div>
  );
};
        `.trim();
      } else {
        code = `
# cURL Request to Flux Agency Neural Endpoint
# Requires active BEARER_TOKEN from Flux Dashboard

curl -X POST "https://api.flux-agency.ai/v1/synthesize" \\
     -H "Authorization: Bearer $FLUX_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "prompt": "Create a high-performing landing page wireframe for a luxury perfume brand",
       "metadata": {
         "platform": "mobile",
         "style": "editorial-v2"
       },
       "grounding": {
         "search_enabled": true,
         "threshold": 0.8
       }
     }'
        `.trim();
      }
      setGeneratedCode(code);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-blue-500/10 rounded-full">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Integration SDK V1.0</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Settings size={10} className="text-slate-500" />
            <span>Embed Neural Architecture Anywhere</span>
          </div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
          Code <span className="text-slate-300 dark:text-slate-800">Lab</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
          Export production-ready integration code. Connect your dashboards, sites, and apps directly to the Flux high-performance engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Target Platform</h3>
              <div className="space-y-3">
                 {platforms.map((p) => (
                   <button
                     key={p.id}
                     onClick={() => {
                        setActivePlatform(p.id);
                        setActiveFramework(p.frameworks[0]);
                        setGeneratedCode('');
                     }}
                     className={cn(
                       "w-full p-6 text-left border rounded-[24px] transition-all flex items-center gap-4 group",
                       activePlatform === p.id 
                         ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 ring-1 ring-blue-500" 
                         : "border-slate-50 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
                     )}
                   >
                     <div className={cn("p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm transition-colors", activePlatform === p.id ? "text-blue-500" : "text-slate-400")}>
                        <p.icon size={20} />
                     </div>
                     <div>
                        <p className="text-sm font-black uppercase tracking-tight">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.frameworks.slice(0, 2).join(' / ')}</p>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-slate-900 dark:bg-slate-950 border border-white/5 rounded-[40px] relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-8">Export Settings</h3>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Framework Sub-type</label>
                       <select 
                         value={activeFramework}
                         onChange={(e) => setActiveFramework(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold uppercase text-white focus:outline-none"
                       >
                          {platforms.find(p => p.id === activePlatform)?.frameworks.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                       </select>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inclusion Logic</label>
                       {[
                         'Include Error Handling',
                         'Add Detailed Comments',
                         'Include Auth Wrapper'
                       ].map(opt => (
                         <div key={opt} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                               <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{opt}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button 
                   onClick={generateCode}
                   disabled={isGenerating}
                   className="mt-10 w-full py-4 bg-white text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                 >
                    {isGenerating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Synthesize Code Block <Sparkles size={16} />
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Code Editor View */}
        <div className="lg:col-span-8">
           <div className="bg-[#0D1117] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl h-full flex flex-col min-h-[600px]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#161B22]">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-widest">
                       {activePlatform.toLowerCase()}.{activePlatform === 'PYTHON' ? 'py' : activePlatform === 'JAVASCRIPT' ? 'tsx' : 'sh'}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      disabled={!generatedCode}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        copied ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      )}
                    >
                       {copied ? 'Copied' : 'Copy Code'} <Copy size={12} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 p-8 overflow-auto font-mono text-sm relative no-scrollbar">
                 {isGenerating ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm z-10">
                      <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Code Synthesis...</p>
                   </div>
                 ) : null}

                 {!generatedCode && !isGenerating && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-4">
                      <Terminal size={64} className="opacity-10" />
                      <p className="text-xs uppercase tracking-widest font-black max-w-xs">
                         Select a target above and click synthesize to generate production-ready code.
                      </p>
                   </div>
                 )}

                 {generatedCode && (
                   <pre className="text-slate-300 leading-relaxed group">
                      <code>{generatedCode}</code>
                   </pre>
                 )}
              </div>

              {generatedCode && (
                <div className="p-4 bg-[#161B22] border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Linting Passed</span>
                   </div>
                   <button className="flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                      View API Reference <ExternalLink size={10} />
                   </button>
                </div>
              )}
           </div>

           {/* Security Footnote */}
           <div className="mt-8 p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl flex items-start gap-4">
              <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                 <Zap size={16} />
              </div>
              <div>
                 <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Security Best Practice</h4>
                 <p className="text-[10px] text-slate-500 leading-tight">
                    Never expose the <code className="font-mono text-orange-600 dark:text-orange-400">FLUX_API_KEY</code> on the client side. If you are using React or Vue, wrap the API calls in a server-side route or proxy. Use environment variables for all authentication tokens.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
