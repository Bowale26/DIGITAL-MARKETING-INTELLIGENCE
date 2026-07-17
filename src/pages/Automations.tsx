import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Workflow, 
  MessageSquare, 
  Mail, 
  Upload, 
  Plus, 
  ChevronRight,
  PlayCircle,
  Settings,
  BellRing,
  Activity,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  FileText,
  User,
  Clock,
  ExternalLink,
  Loader2,
  ListTodo
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIService } from '../services/aiService';

interface WorkflowSection {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  buttons: string[];
  icon: any;
  color: string;
}

const workflows: WorkflowSection[] = [
  {
    id: 'MEETING',
    name: "Meeting Notes to Action Items",
    trigger: "Meeting recording upload or transcript paste",
    steps: [
      "Transcribe audio if needed",
      "Extract key discussion points",
      "Identify action items",
      "Assign owners and priorities",
      "Create calendar events",
      "Update project management tool",
      "Send summary email"
    ],
    buttons: [
      "Upload Meeting Recording",
      "Paste Transcript",
      "Extract Action Items",
      "Assign Owners",
      "Create Calendar Events",
      "Update Project Board",
      "Send Team Summary"
    ],
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  {
    id: 'EMAIL',
    name: "Auto-Label Priority Marketing Emails",
    trigger: "Email ingestion from connected inbox",
    steps: [
      "Scan incoming emails",
      "Classify by urgency and topic",
      "Apply priority labels",
      "Draft response suggestions",
      "Escalate critical items"
    ],
    buttons: [
      "Connect Email Inbox",
      "Set Classification Rules",
      "Auto-Apply Labels",
      "Generate Response Drafts",
      "Escalate Critical Emails",
      "Weekly Email Analytics"
    ],
    icon: Mail,
    color: 'text-orange-500'
  }
];

export default function Automations() {
  const [activeWorkflow, setActiveWorkflow] = useState(workflows[0].id);
  const [inputData, setInputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunWorkflow = async (workflowId: string, action: string) => {
    if (!inputData.trim() && action !== "Connect Email Inbox") return;
    
    setIsProcessing(true);
    setResults(null);

    const ai = AIService.getInstance();
    try {
      if (workflowId === 'MEETING') {
        const data = await ai.processMeetingTranscript(inputData);
        setResults({ type: 'MEETING', data });
      } else if (workflowId === 'EMAIL') {
        const data = await ai.classifyEmail(inputData);
        setResults({ type: 'EMAIL', data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 font-sans text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-blue-500/10 rounded-full">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Automation Level: FULL</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Zap size={10} className="text-orange-500" />
            <span>Intelligent Workflow Engine V3.2</span>
          </div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight uppercase leading-[0.9]">
          Workflow <span className="text-slate-300 dark:text-slate-800">Automation</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl mt-6 font-medium max-w-2xl">
          Connect your stack and let the neural orchestrator handle the busy work. Multi-step reasoning across all your tools.
        </p>
      </div>

      {/* Workflow Tabs */}
      <div className="flex flex-wrap gap-4 mb-12">
        {workflows.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setActiveWorkflow(w.id);
              setResults(null);
              setInputData('');
            }}
            className={cn(
              "px-8 py-5 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-4",
              activeWorkflow === w.id 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                : "bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <w.icon size={18} className={cn(activeWorkflow === w.id ? "text-blue-400" : w.color)} />
            {w.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input & Config */}
        <div className="lg:col-span-12">
           <div className="p-10 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] flex items-center justify-center">
                      <Workflow size={28} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter">Trigger: {workflows.find(w => w.id === activeWorkflow)?.trigger}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Awaiting Payload for Neural Processing</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-blue-500 transition-all border border-slate-100 dark:border-slate-800">
                      <Settings size={20} />
                   </button>
                   <button className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-blue-500 transition-all border border-slate-100 dark:border-slate-800">
                      <Activity size={20} />
                   </button>
                </div>
              </div>

              <div className="relative mb-8">
                <textarea 
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={
                    activeWorkflow === 'MEETING' ? "Paste meeting transcript here... Or upload recording above." :
                    "Paste email content here... Or connect your inbox below."
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-lg min-h-[160px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                 {workflows.find(w => w.id === activeWorkflow)?.buttons.map(btn => (
                   <button
                     key={btn}
                     onClick={() => handleRunWorkflow(activeWorkflow, btn)}
                     disabled={isProcessing}
                     className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                   >
                      {btn === "Upload Meeting Recording" ? <Upload size={14} /> : 
                       btn === "Connect Email Inbox" ? <Mail size={14} /> : 
                       <PlayCircle size={14} />}
                      {btn}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Pipeline & Results */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-20 bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center"
                >
                   <Loader2 size={48} className="animate-spin text-blue-500 mb-6" />
                   <h4 className="text-2xl font-bold uppercase tracking-tighter mb-2">Executing Intelligence Loop...</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bridging API Endpoints & Neural Nodes</p>
                </motion.div>
              ) : results ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                   {results.type === 'MEETING' && (
                     <div className="space-y-6">
                        <div className="p-10 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-sm">
                           <div className="flex items-center justify-between mb-8">
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Meeting Intelligence Report</h4>
                              <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
                                 <CheckCircle2 size={12} className="text-emerald-500" />
                                 <span className="text-[8px] font-black text-emerald-500 uppercase">Analysis Complete</span>
                              </div>
                           </div>
                           <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">Neural Summary</h3>
                           <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10 italic">
                             "{results.data.summary}"
                           </p>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <ListTodo size={14} /> Action Items
                                 </h5>
                                 <div className="space-y-3">
                                    {results.data.action_items.map((item: any, i: number) => (
                                       <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                          <div className="flex justify-between items-center mb-2">
                                             <span className={cn(
                                               "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                               item.priority === 'High' ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                             )}>{item.priority}</span>
                                             <span className="text-[10px] font-bold text-blue-500">{item.owner}</span>
                                          </div>
                                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.task}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <Calendar size={14} /> Scheduled Events
                                 </h5>
                                 <div className="space-y-3">
                                    {results.data.calendar_events.map((event: any, i: number) => (
                                       <div key={i} className="p-4 bg-blue-500/5 dark:bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-4">
                                          <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center text-[10px] font-black leading-none border border-slate-100 dark:border-slate-800">
                                             <span className="text-blue-500">OCT</span>
                                             <span>24</span>
                                          </div>
                                          <div>
                                             <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</p>
                                             <p className="text-[8px] font-bold text-slate-400 uppercase">{event.date} • {event.duration}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {results.type === 'EMAIL' && (
                     <div className="p-10 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "px-4 py-2 rounded-xl flex items-center gap-2",
                                results.data.urgency === 'Critical' ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                              )}>
                                 <AlertCircle size={16} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{results.data.urgency} Priority</span>
                              </div>
                              {results.data.escalation_required && (
                                <div className="px-4 py-2 bg-purple-500/10 rounded-xl flex items-center gap-2 text-purple-500">
                                   <Zap size={16} />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Escalation Triggered</span>
                                </div>
                              )}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classified as: {results.data.topic}</span>
                        </div>

                        <div className="mb-10">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Neural Labels Applied</h4>
                           <div className="flex flex-wrap gap-2">
                              {results.data.labels.map((l: string) => (
                                <span key={l} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tight">#{l}</span>
                              ))}
                           </div>
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-800">
                           <div className="flex items-center justify-between mb-6">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Context-Aware Draft</h4>
                              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Apply Template</button>
                           </div>
                           <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                              "{results.data.response_draft}"
                           </p>
                           <div className="mt-8 flex gap-3">
                              <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Send Draft to Gmail</button>
                              <button className="flex-1 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all">Edit Manually</button>
                           </div>
                        </div>
                     </div>
                   )}
                </motion.div>
              ) : (
                <div className="p-24 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800">
                   <div className="w-32 h-32 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <PlayCircle size={48} className="text-slate-200" />
                   </div>
                   <h4 className="text-2xl font-bold uppercase tracking-tighter mb-2 text-slate-300 dark:text-slate-800">No Active Data Pipeline</h4>
                   <p className="text-slate-400 max-w-sm">
                      Select a workflow and provide input data to bridge the neural execution layer.
                   </p>
                </div>
              )}
           </AnimatePresence>
        </div>

        {/* Integration Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 bg-slate-900 dark:bg-slate-950 border border-white/5 rounded-[40px] shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-8">Ecosystem Sync</h3>
              <div className="space-y-4">
                 {[
                   { name: 'Slack', status: 'Connected', icon: MessageSquare },
                   { name: 'Google Calendar', status: 'Standby', icon: Calendar },
                   { name: 'Asana / Jira', status: 'Ready', icon: Layers },
                   { name: 'Gmail / Outlook', status: 'Connected', icon: Mail },
                   { name: 'Notion', status: 'Standby', icon: FileText }
                 ].map(stack => (
                   <div key={stack.name} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                         <stack.icon size={16} className="text-slate-500 group-hover:text-blue-500" />
                         <span className="text-[10px] font-black uppercase text-white/80">{stack.name}</span>
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase",
                        stack.status === 'Connected' ? "text-emerald-500" : "text-slate-500"
                      )}>{stack.status}</span>
                   </div>
                 ))}
              </div>
              <button className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                 Configure Integrations
              </button>
           </div>

           <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Workflow Telemetry</h3>
              <div className="space-y-4">
                 {[
                   { t: '11:45', msg: 'Email Classifer: Label "Partnership" Applied', type: 'info' },
                   { t: '11:32', msg: 'Action Item Synced to Asana #MARK-22', type: 'success' },
                   { t: '10:15', msg: 'Meeting Transcript Normalized (v3.1)', type: 'info' }
                 ].map((log, i) => (
                   <div key={i} className="flex gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500')} />
                      <div className="flex-1">
                         <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">{log.msg}</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase mt-1">{log.t} UTC</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
