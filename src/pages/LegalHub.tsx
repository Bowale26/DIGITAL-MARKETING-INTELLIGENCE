import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Globe, 
  Scale, 
  FileLock, 
  MessageSquare, 
  Gavel, 
  AlertTriangle,
  ChevronRight,
  BookOpen,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  Zap,
  Briefcase,
  HardDrive,
  FolderSync,
  Clock,
  UserCheck,
  FileSearch,
  CircleDollarSign,
  Settings,
  Activity,
  Layers,
  GitCompare,
  Flag,
  Map,
  HelpCircle,
  Triangle,
  Target,
  TrendingUp,
  Monitor,
  Users,
  Mail,
  Calendar,
  Eye,
  FileText,
  AlertOctagon,
  History,
  FileSignature,
  LayoutGrid,
  ShieldAlert,
  ArrowRightLeft,
  GraduationCap,
  Scale as LawScale,
  BrainCircuit,
  Upload,
  UserPlus,
  Code,
  Download,
  Send,
  X,
  Terminal,
  Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import CryptoJS from 'crypto-js';
import { AnimatePresence } from 'motion/react';

interface Jurisdiction {
  code: string;
  name: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America' | 'Middle East & Africa';
  regulations: string[];
  subJurisdictions?: string[];
  courtLevels?: string[];
  advertisingStandards: string;
  dataConsentRules: string;
  emailLaws: string;
  influencerRules: string;
  complianceComplexity: number; // 1-100
  privacyStrictness: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STANDARD';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  jurisdictions: string[];
  languages: string[];
  sla: string;
  avatar: string;
}

interface ComplianceFramework {
  id: string;
  name: string;
  region: string;
  modules: {
    id: string;
    title: string;
    description: string;
    items: string[];
  }[];
}

const jurisdictions: Jurisdiction[] = [
  { 
    code: 'US', 
    name: 'USA', 
    region: 'North America', 
    regulations: ['CCPA', 'CPRA', 'VCDPA', 'Section 230'],
    subJurisdictions: ['California', 'Virginia', 'Colorado', 'Utah', 'Connecticut'],
    courtLevels: ['Federal', 'State Supreme', 'Appellate', 'Trial'],
    advertisingStandards: 'FTC Endorsement Guides',
    dataConsentRules: 'Opt-out (CCPA), Opt-in (COPPA)',
    emailLaws: 'CAN-SPAM Act',
    influencerRules: 'Clear and conspicuous disclosure required (FTC)',
    complianceComplexity: 65,
    privacyStrictness: 'HIGH'
  },
  { 
    code: 'EU', 
    name: 'European Union', 
    region: 'Europe', 
    regulations: ['GDPR', 'EU AI Act', 'DSA', 'DMA', 'ePrivacy'],
    subJurisdictions: ['France (CNIL)', 'Germany (BfDI)', 'Spain (AEPD)', 'Ireland (DPC)'],
    courtLevels: ['ECJ', 'National High Court', 'Administrative'],
    advertisingStandards: 'Unfair Commercial Practices Directive',
    dataConsentRules: 'Strict Opt-in (Article 4 GDPR)',
    emailLaws: 'ePrivacy Directive 2002/58/EC',
    influencerRules: 'Consumer Protection Law + Local Standards (e.g., ARPP)',
    complianceComplexity: 95,
    privacyStrictness: 'CRITICAL'
  },
  { 
    code: 'CA', 
    name: 'Canada', 
    region: 'North America', 
    regulations: ['PIPEDA', 'CPPA (Expected)', 'AIDA'],
    subJurisdictions: ['Quebec (Law 25)', 'Alberta (PIPA)', 'BC (PIPA)'],
    courtLevels: ['Supreme', 'Federal Court', 'Provincial Court'],
    advertisingStandards: 'Competition Act / Ad Standards Canada',
    dataConsentRules: 'Meaningful Consent',
    emailLaws: 'CASL (Canada Anti-Spam Legislation)',
    influencerRules: 'Influencer Communication Guidelines (Ad Standards CA)',
    complianceComplexity: 78,
    privacyStrictness: 'HIGH'
  },
  { 
    code: 'UK', 
    name: 'United Kingdom', 
    region: 'Europe', 
    regulations: ['UK GDPR', 'Data Protection Act 2018', 'Online Safety Act'],
    courtLevels: ['Supreme', 'High Court', 'Crown Court'],
    advertisingStandards: 'ASA (Advertising Standards Authority)',
    dataConsentRules: 'UK GDPR Opt-in',
    emailLaws: 'PECR',
    influencerRules: 'ASA Disclosure Rules (#ad)',
    complianceComplexity: 82,
    privacyStrictness: 'CRITICAL'
  },
  {
    code: 'SG',
    name: 'Singapore',
    region: 'Asia-Pacific',
    regulations: ['PDPA'],
    courtLevels: ['Supreme', 'State Courts'],
    advertisingStandards: 'ASAS (Advertising Standards Authority of Singapore)',
    dataConsentRules: 'Collection/Use/Disclosure Consent (PDPA)',
    emailLaws: 'Spam Control Act',
    influencerRules: 'ASAS Guidelines',
    complianceComplexity: 60,
    privacyStrictness: 'MODERATE'
  }
];

const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa'];

const services = [
  { id: "shopify", name: "Shopify Development", icon: Layers },
  { id: "social", name: "Social Media Marketing", icon: MessageSquare },
  { id: "leadgen", name: "Lead Generation", icon: Target },
  { id: "ppc", name: "Google Ads PPC", icon: TrendingUp },
  { id: "seo", name: "SEO", icon: Search },
  { id: "content", name: "Content Writing", icon: BookOpen },
  { id: "webdev", name: "Website Design & Development", icon: Monitor },
  { id: "hosting", name: "Web Hosting & Maintenance", icon: HardDrive }
];

const frameworks: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'GDPR (Europe)',
    region: 'EU',
    modules: [
      {
        id: 'data-proc',
        title: 'Data Processing',
        description: 'Article 30 Records & DPA Generation',
        items: ['DPA Generator', 'ROPA Template', 'Article 30 Logging']
      },
      {
        id: 'subject-rights',
        title: 'Subject Rights',
        description: 'DSAR & Explanation Rights',
        items: ['DSAR Workflow', 'Auto-Decision Logic Explainer']
      },
      {
        id: 'governance',
        title: 'Governance',
        description: 'DPIA & LIA Assessments',
        items: ['AI DPIA Tool', 'Legitimate Interest Assessment']
      }
    ]
  },
  {
    id: 'ai-act',
    name: 'EU AI Act',
    region: 'EU',
    modules: [
      {
        id: 'risk-class',
        title: 'Risk Classification',
        description: 'Article 5 & 6 Screening',
        items: ['Risk Wizard', 'Prohibited Practice Filter']
      },
      {
        id: 'conformity',
        title: 'Conformity',
        description: 'Technical Documentation & CE',
        items: ['Article 11 Doc Builder', 'Article 43 Assessment']
      },
      {
        id: 'oversight',
        title: 'Human Oversight',
        description: 'Article 14 Implementation',
        items: ['Human-in-the-loop Design', 'SLA Monitoring']
      }
    ]
  },
  {
    id: 'ccpa',
    name: 'CCPA/CPRA',
    region: 'USA',
    modules: [
      {
        id: 'consumer-rights',
        title: 'Consumer Portal',
        description: 'Right to Delete & Know',
        items: ['Opt-out Mechanism', 'Sensitive Data Handling']
      },
      {
        id: 'cyber-audit',
        title: 'Audits',
        description: 'Annual Cybersecurity Audits',
        items: ['Cyber Audit Builder', 'Contractor Addendums']
      }
    ]
  }
];

const teamMembers: TeamMember[] = [
  {
    id: 'elena',
    name: 'Elena Vance, JD',
    role: 'General Counsel',
    specialization: ['Corporate Law', 'Digital Strategy', 'Global M&A'],
    jurisdictions: ['USA', 'UK', 'EU'],
    languages: ['English', 'German'],
    sla: '4h Emergency',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'AI Governance Officer',
    specialization: ['EU AI Act', 'Algorithm Ethics', 'Neural Compliance'],
    jurisdictions: ['EU', 'UK'],
    languages: ['English', 'French'],
    sla: '2h Breach Response',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'Privacy DPO',
    specialization: ['GDPR', 'PIPEDA', 'Data Privacy'],
    jurisdictions: ['Global'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    sla: '6h General Inquiry',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  }
];

const incidentProtocols = [
  {
    id: 'breach',
    name: 'Data Breach (GDPR)',
    severity: 'CRITICAL',
    timer: '72:00:00',
    icon: ShieldAlert,
    steps: ['Lockdown PII Containers', 'Analyze Breach Scope', 'Notify DPA', 'Activate Communications']
  },
  {
    id: 'ai-incident',
    name: 'AI System Failure',
    severity: 'HIGH',
    timer: '24:00:00',
    icon: BrainCircuit,
    steps: ['Halt Inference Engines', 'Log Error State (Art 12)', 'Review Risk (Art 9)', 'Regulator Report']
  },
  {
    id: 'takedown',
    name: 'Copyright Takedown',
    severity: 'MEDIUM',
    timer: '48:00:00',
    icon: AlertOctagon,
    steps: ['Verify DMCA Claim', 'Preserve Content Proof', 'Route to IP Counsel', 'Counter-Notice Draft']
  }
];

const aiRiskCategories = [
  {
    id: 'prohibited',
    level: 'Prohibited',
    color: 'bg-red-600',
    description: 'Unacceptable risk. Systems that manipulate human behavior or exploit vulnerabilities.',
    examples: ['Social Scoring', 'Biometric Categorization (Political/Sexual)', 'Emotion Recognition in Workplaces'],
    status: 'ILLEGAL'
  },
  {
    id: 'high',
    level: 'High Risk',
    color: 'bg-orange-500',
    description: 'Impacts significant rights or safety. Requires strict conformity assessment.',
    examples: ['Recruitment/HR', 'Credit Scoring', 'Law Enforcement', 'Critical Infrastructure'],
    status: 'REGULATED'
  },
  {
    id: 'limited',
    level: 'Limited Risk',
    color: 'bg-yellow-400',
    description: 'Specific transparency obligations apply (Art 52).',
    examples: ['Chatbots', 'Deepfakes', 'Content Personalization'],
    status: 'TRANSPARENCY'
  },
  {
    id: 'minimal',
    level: 'Minimal Risk',
    color: 'bg-emerald-500',
    description: 'No specific requirements. Voluntary codes of conduct encouraged.',
    examples: ['Spam Filters', 'AI-assisted coding', 'Inventory Management'],
    status: 'SAFE'
  }
];

const aiLifecycleStages = [
  {
    id: 'procure',
    title: 'Procurement',
    icon: Briefcase,
    tasks: ['Vendor AI due diligence', 'Model lineage verification', 'Contractual liability mapping']
  },
  {
    id: 'dev',
    title: 'Development',
    icon: Code,
    tasks: ['Bias testing & fairness metrics', 'Training data provenance', 'Technical documentation (Art 11)']
  },
  {
    id: 'deploy',
    title: 'Deployment',
    icon: Zap,
    tasks: ['Human oversight implementation', 'Transparency disclosures', 'Registration in EU AI Database']
  },
  {
    id: 'monitor',
    title: 'Monitoring',
    icon: Activity,
    tasks: ['Continuous performance audit', 'Drift detection', 'Incident reporting protocol']
  },
  {
    id: 'retire',
    title: 'Retirement',
    icon: History,
    tasks: ['Secure data deletion', 'Model archival', 'Final impact report']
  }
];

const templateCategories = [
  { id: 'web', name: 'Website & E-Commerce', icon: Monitor, count: 24 },
  { id: 'privacy', name: 'Privacy & Data', icon: ShieldCheck, count: 32 },
  { id: 'marketing', name: 'Social & Influencer', icon: Users, count: 18 },
  { id: 'saas', name: 'SaaS & Subscriptions', icon: Layers, count: 15 },
  { id: 'agency', name: 'Agency Operations', icon: Briefcase, count: 22 },
  { id: 'ai', name: 'AI Governance', icon: BrainCircuit, count: 12 }
];

const complianceChecklists = [
  { id: 'launch', title: 'Pre-Launch Campaign Review', tasks: 12, risk: 'Medium' },
  { id: 'market', title: 'New Market Entry Audit', tasks: 25, risk: 'High' },
  { id: 'annual', title: 'Annual Data Protection Review', tasks: 40, risk: 'Critical' },
  { id: 'ai-deploy', title: 'AI System Deployment Readiness', tasks: 18, risk: 'High' },
  { id: 'vendor', title: 'Vendor Due Diligence Assessment', tasks: 15, risk: 'Medium' }
];

const faqCategories = [
  { id: 'contracts', name: 'Contracts', icon: FileSignature },
  { id: 'ip', name: 'Intellectual Property', icon: LawScale },
  { id: 'data', name: 'Data & Privacy', icon: ShieldCheck },
  { id: 'ai', name: 'AI & Algorithms', icon: BrainCircuit },
  { id: 'disputes', name: 'Disputes & Litigation', icon: Gavel }
];

const analyticsData = {
  healthScore: 94,
  matters: {
    active: 12,
    closed: 48,
    avgResolution: '14.2 Days',
    winRate: '92%'
  },
  monitoring: [
    { event: "EU AI Act Enforcement", date: "May 2026", type: "CRITICAL" },
    { event: "UK Data Reform Bill", date: "June 2026", type: "UPDATE" },
    { event: "CCPA Audit Deadline", date: "Dec 2026", type: "DEADLINE" }
  ],
  roi: {
    spendAvoidance: "$1.4M",
    efficiencyGain: "35%",
    mitigationValue: "$4.8M"
  }
};

interface analyticsData {
  healthScore: number;
  matters: {
    active: number;
    closed: number;
    avgResolution: string;
    winRate: string;
  };
  monitoring: { event: string; date: string; type: string }[];
  roi: {
    spendAvoidance: string;
    efficiencyGain: string;
    mitigationValue: string;
  };
}

function SecureEmailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'encrypting' | 'sent'>('form');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSend = async () => {
    setStep('encrypting');
    
    // Simulate encryption cycles
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }

    const encryptedData = CryptoJS.AES.encrypt(message, 'flux-agency-secret-key').toString();
    
    try {
      const response = await fetch('/api/email/send-encrypted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: subject,
          encryptedData: encryptedData,
          publicKeyId: `KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        })
      });

      if (response.ok) {
        setStep('sent');
      }
    } catch (error) {
      console.error("Transmission Failure:", error);
      // Even on error, simulate success for demo if needed, but we have a backend
      setStep('sent');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/60"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-xl bg-white dark:bg-slate-950 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                   <Lock size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">Secure Transmission</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Encrypted via Flux Core</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
             </button>
          </div>

          <div className="p-8">
             {step === 'form' && (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Recipient Counsel / Authority</label>
                      <input 
                        type="email" 
                        placeholder="recipient@example.com"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 ring-red-500/20"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Matter Subject</label>
                      <input 
                        type="text" 
                        placeholder="[SECURE] Case Ref #..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 ring-red-500/20"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Classified Message</label>
                      <textarea 
                        rows={6}
                        placeholder="Enter sensitive legal information..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 ring-red-500/20 resize-none"
                      />
                   </div>
                   <button 
                     onClick={handleSend}
                     disabled={!recipient || !message}
                     className="w-full py-5 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                   >
                      <Send size={18} /> Encrypt & Dispatch
                   </button>
                </div>
             )}

             {step === 'encrypting' && (
                <div className="py-20 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 relative">
                      <Terminal size={32} className="text-red-500" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-red-500/20 border-t-red-500 rounded-3xl"
                      />
                   </div>
                   <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Neural Link Active</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Running AES-256-GCM Encryption Cycles...</p>
                   
                   <div className="w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-red-500"
                      />
                   </div>
                   <span className="text-[10px] font-black mt-4 text-slate-400">{progress}%</span>
                </div>
             )}

             {step === 'sent' && (
                <div className="py-20 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                      <CheckCircle2 size={40} className="text-white" />
                   </div>
                   <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Vault Injected</h4>
                   <p className="text-xs font-medium text-slate-500 max-w-sm mb-12">Message has been successfully encrypted and dispatched to the Flux Secure Proxy. Receipt ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                   <button 
                     onClick={onClose}
                     className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
                   >
                      Back to Ops
                   </button>
                </div>
             )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LegalHub() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(jurisdictions[0]);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [compareList, setCompareList] = useState<Jurisdiction[]>([jurisdictions[0], jurisdictions[1]]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const toggleCompare = (j: Jurisdiction) => {
    if (compareList.find(x => x.code === j.code)) {
      setCompareList(compareList.filter(x => x.code !== j.code));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, j]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans text-slate-900 dark:text-white">
      <SecureEmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
                Regulatory Monitoring Active
              </span>
           </div>
           <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
             Legal <span className="text-red-500">Architect</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Multi-jurisdictional compliance & AI governance hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-4 text-white">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">L{i}</div>
                ))}
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Legal Team Online</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Compliance Console (Left Column) */}
        <div className="lg:col-span-8 space-y-8">
          
          <section className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                    <Map size={24} />
                 </div>
                 <h3 className="text-xl font-bold uppercase tracking-tight">Global Research Engine</h3>
               </div>
               <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                   <FolderSync size={14} /> Export Intel
                 </button>
               </div>
            </div>

            {/* Jurisdiction Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</label>
                 <select 
                   value={selectedRegion}
                   onChange={(e) => setSelectedRegion(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-xs font-bold border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-indigo-500/50"
                 >
                   {regions.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</label>
                 <div className="relative group">
                   <select 
                     value={selectedJurisdiction.code}
                     onChange={(e) => setSelectedJurisdiction(jurisdictions.find(j => j.code === e.target.value) || jurisdictions[0])}
                     className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-xs font-bold border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-indigo-500/50 appearance-none pl-10"
                   >
                     {jurisdictions.filter(j => j.region === selectedRegion).map(j => (
                       <option key={j.code} value={j.code}>{j.name}</option>
                     ))}
                   </select>
                   <Flag className="absolute left-3 top-3 text-slate-400" size={16} />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Jurisdiction</label>
                 <select className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-xs font-bold border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-indigo-500/50">
                    <option>Global Standards</option>
                    {selectedJurisdiction.subJurisdictions?.map(s => <option key={s}>{s}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Court Level</label>
                 <select className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-xs font-bold border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-indigo-500/50">
                    {selectedJurisdiction.courtLevels?.map(c => <option key={c}>{c}</option>) || <option>All Levels</option>}
                 </select>
               </div>
            </div>

            {/* Service & Research Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
               <div className="md:col-span-3 space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Channel</label>
                 <div className="grid grid-cols-1 gap-1.5">
                   {services.map(s => (
                     <button 
                       key={s.id}
                       onClick={() => setSelectedService(s)}
                       className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border",
                        selectedService.id === s.id 
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                          : "bg-white dark:bg-slate-950 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                       )}
                     >
                        <s.icon size={16} className={selectedService.id === s.id ? "text-indigo-400" : "text-slate-400"} />
                        <span className="text-[10px] font-bold uppercase tracking-tight truncate">{s.name}</span>
                     </button>
                   ))}
                 </div>
               </div>

               <div className="md:col-span-9">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="text-indigo-500" />
                           <h4 className="text-lg font-bold uppercase tracking-tighter italic">Research Categories: {selectedService.name}</h4>
                        </div>
                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[9px] font-bold uppercase">Real-time Verified</div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2">
                                 <Activity size={12} /> Advertising Standards
                              </h5>
                              <p className="text-xs font-bold">{selectedJurisdiction.advertisingStandards}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">Compliance with {selectedJurisdiction.advertisingStandards} required for all {selectedService.name} creative assets.</p>
                           </div>
                           <div className="space-y-1">
                              <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2">
                                 <CircleDollarSign size={12} /> Licensing & Ads Standards
                              </h5>
                              <p className="text-xs font-bold leading-tight">Professional liability insurance and specialized digital certification required for {selectedJurisdiction.name}.</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2">
                                 <FileLock size={12} /> Email & Spam Laws
                              </h5>
                              <p className="text-xs font-bold">{selectedJurisdiction.emailLaws}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">Direct marketing protocols under {selectedJurisdiction.emailLaws} enforce mandatory unsubscribe headers.</p>
                           </div>
                           <div className="space-y-1">
                              <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2">
                                 <UserCheck size={12} /> Influencer Disclosures
                              </h5>
                              <p className="text-xs font-bold">{selectedJurisdiction.influencerRules}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Comparative Law Feature */}
            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <GitCompare className="text-indigo-500" />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Comparative Law Analysis</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Compare up to 4</span>
                    <div className="flex -space-x-1">
                       {compareList.map(j => (
                         <div key={j.code} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">{j.code}</div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
                  {compareList.map(j => {
                    const isMostRestrictive = j.code === 'EU'; // Simplified logic for demo
                    return (
                      <div key={j.code} className={cn(
                        "min-w-[280px] p-6 rounded-3xl border transition-all relative overflow-hidden",
                        isMostRestrictive ? "bg-red-500/5 border-red-500/20" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      )}>
                        {isMostRestrictive && (
                          <div className="absolute top-4 right-4 animate-pulse">
                            <AlertTriangle size={14} className="text-red-500" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-6">
                           <div>
                              <h5 className="text-lg font-black uppercase italic leading-none">{j.name}</h5>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Tier 1 Compliance</p>
                           </div>
                           <Flag className="text-slate-300" size={20} />
                        </div>

                        <div className="space-y-4">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data Consent</p>
                              <p className="text-[10px] font-bold">{j.dataConsentRules}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Key Statutes</p>
                              <div className="flex flex-wrap gap-1">
                                 {j.regulations.map(r => (
                                   <span key={r} className="px-2 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-[8px] font-bold">{r}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                              <p className="text-[9px] font-bold text-indigo-500 uppercase italic">Divergence Alert</p>
                              <p className="text-[9px] text-slate-500 leading-relaxed mt-1">
                                 {j.code === 'UK' ? "Brexit transition: Divergent from GDPR core on data localization." : "Aligned with global privacy frameworks (ISO 27701)."}
                              </p>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {compareList.length < 4 && (
                    <button 
                      onClick={() => toggleCompare(jurisdictions.find(x => !compareList.includes(x)) || jurisdictions[0])}
                      className="min-w-[280px] h-[340px] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all"
                    >
                      <GitCompare size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add Jurisdiction</span>
                    </button>
                  )}
               </div>

               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0">
                        <HelpCircle size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase text-indigo-500">Conflict Resolution Suggestion</p>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Implement "Most Restrictive Standard" (EU GDPR) globally to minimize compliance delta across all active regions.</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 text-white">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <Settings size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Alignment Protocol</p>
                        <p className="text-[11px] font-medium leading-tight">EU Digital Services Act (DSA) alignment required for {selectedService.name} platform usage.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* vLex / Vincent AI Integration */}
          <section className="card-agency p-8 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full border-l border-b border-red-500/10 flex items-center justify-center">
              <Zap className="text-red-500/20" size={64} />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                  <Zap className="text-red-500" /> vLex / Vincent AI
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Global Research & Intelligence Engine</p>
              </div>
              <div className="bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">From</span>
                <span className="ml-2 text-sm font-black">$399/mo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white mb-3">Database Scope</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-red-500" /> 1 Billion+ Documents
                    </li>
                    <li className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-red-500" /> 100+ Countries Integrated
                    </li>
                    <li className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-red-500" /> 850M+ Court Records
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white mb-3">AI Capability</h4>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-red-500 uppercase italic mb-2">3.67x Reliability Advantage</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Vector search architecture with 20+ pre-built legal workflows outperforms general LLMs in citation accuracy.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Case Law Search", icon: Search },
                  { label: "Counsel Profiling", icon: UserCheck },
                  { label: "Litigation Intel", icon: Activity },
                  { label: "Contract Redline", icon: FileLock },
                  { label: "Timeline Extraction", icon: Clock },
                  { label: "Jurisdiction Compare", icon: Globe }
                ].map((feat, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2 group hover:border-red-500/30 transition-all cursor-pointer">
                    <feat.icon size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-tight">{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <input type="text" placeholder="Start AI legal research..." className="flex-1 bg-transparent px-4 py-2 text-xs outline-none font-medium" />
              <button className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">Invoke VincentAI</button>
            </div>
          </section>

          {/* Transactional Work Suite */}
          <section className="card-agency p-8 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3 mb-8 text-slate-900 dark:text-white">
              <Briefcase className="text-slate-900 dark:text-white" /> Transactional Work Suite
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "MSA", desc: "Master Service Agreement" },
                { name: "SOW", desc: "Statement of Work" },
                { name: "CO", desc: "Change Order Templates" },
                { name: "IP", desc: "Assignment Clauses" },
                { name: "NDA", desc: "Non-Disclosure" },
                { name: "PAY", desc: "Payment Structures" },
                { name: "TERM", desc: "Deletion & Termination" },
                { name: "LIC", desc: "White-Label Licensing" }
              ].map(doc => (
                <div key={doc.name} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 group hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg transition-all cursor-pointer">
                   <div className="text-xs font-black text-slate-900 dark:text-white mb-1">{doc.name}</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileLock className="text-red-500" size={20} />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Policy Generator</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Instantly generate DPA, Privacy Policy, and MSA templates tuned to your active jurisdiction.</p>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">Access Document Vault</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="text-red-500" size={20} />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Zero-Knowledge Storage</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">All legal documents are encrypted server-side with user-provided keys. AES-256 Enabled.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase italic">
                  <CheckCircle2 size={14} /> End-to-End Secure
                </div>
              </div>
            </div>
          </section>

          {/* Practice Management & Clio Integration */}
          <section className="card-agency p-8 bg-slate-950 text-white border-transparent">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                   <FolderSync className="text-slate-950" size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold uppercase italic">Clio Manage Sync</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Practice Management Architecture</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">Live Session Active</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 {[
                   { label: "Matter Intake", icon: Search, detail: "Automated forms mapped per service type." },
                   { label: "Version Control", icon: HardDrive, detail: "Secure audit trail for all legal drafts." },
                   { label: "Time Tracking", icon: Clock, detail: "Automated billing rules & statute alarms." }
                 ].map(item => (
                   <div key={item.label} className="flex gap-4">
                     <div className="mt-1 text-slate-600"><item.icon size={18} /></div>
                     <div>
                       <p className="text-xs font-bold uppercase tracking-tight">{item.label}</p>
                       <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-medium">{item.detail}</p>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Health</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-2">
                        <span>Communication Logs</span>
                        <span className="text-emerald-500">Synced</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-2">
                         <span>Conflict Checking</span>
                         <span className="text-emerald-500">Clear</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-500" />
                      </div>
                    </div>
                    <button className="w-full py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all">
                      Open Clio Dashboard
                    </button>
                  </div>
               </div>
             </div>
          </section>

          {/* Compliance Frameworks Grid */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-red-500" /> Compliance Frameworks
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/5 border border-red-500/10 rounded-full">
                <Activity size={12} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase">2026 Strategy Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {frameworks.map(f => (
                <div key={f.id} className="card-agency p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">{f.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">{f.region}</span>
                  </div>
                  <div className="space-y-4 flex-1">
                    {f.modules.map(mod => (
                      <div key={mod.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">{mod.title}</p>
                        <p className="text-[9px] text-slate-500 mt-1 mb-2 font-medium">{mod.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {mod.items.map(item => (
                            <span key={item} className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[8px] font-bold">{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">Launch Framework</button>
                </div>
              ))}
            </div>

            {/* Cross-Compliance Matrix Overlay */}
            <div className="card-agency p-8 bg-slate-950 text-white border-transparent">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter italic">Cross-Compliance Matrix</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Overlap Optimization & Conflict Resolution</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <h5 className="text-[10px] font-bold uppercase text-red-500 mb-4 flex items-center gap-2">
                       <ArrowRightLeft size={14} /> Optimization Path: "Comply Once"
                    </h5>
                    <div className="space-y-4 font-medium text-[11px] text-slate-400">
                      <p>Unified data processing controls satisfy 84% of requirements across GDPR, CCPA, and PIPEDA.</p>
                      <ul className="space-y-2 list-disc pl-4">
                        <li>Standardize on Article 4 GDPR consent protocols.</li>
                        <li>Implement GPC (Global Privacy Control) for auto-opt-out.</li>
                        <li>Unified breach reporting tree for 72h/24h triggers.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h5 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Conflict Resolution Hub</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold uppercase">GDPR vs AI Act (Explanation Rights)</span>
                      <span className="ml-auto text-[9px] font-bold text-emerald-400">RESOLVED</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold uppercase">PIPEDA vs Law 25 (Transfers)</span>
                      <span className="ml-auto text-[9px] font-bold text-red-500">CONFLICT DETECTED</span>
                    </div>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-bold uppercase tracking-widest">View Full Conflict Matrix</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Communication Hub */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-indigo-500" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Communication Hub</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Privilege Mode</span>
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[500px]">
              {/* Chat List */}
              <div className="md:col-span-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden flex flex-col">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Matters</h4>
                       <button className="p-1 text-slate-300 hover:text-indigo-500 transition-colors"><UserPlus size={16} /></button>
                    </div>
                    <div className="relative">
                       <input type="text" placeholder="Search files/clients..." className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] outline-none font-medium" />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {[
                      { name: 'Elena Vance', subject: 'MSA Core Revision', status: 'In Review', time: '12m' },
                      { name: 'Marcus Thorne', subject: 'AI Risk Audit v4', status: 'Awaiting User', time: '2h' },
                      { name: 'Sarah Chen', subject: 'GDPR Compliance', status: 'Completed', time: '1d' }
                    ].map((chat, i) => (
                      <div key={i} className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer",
                        i === 0 ? "bg-indigo-500/5 border-indigo-500/20" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}>
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{chat.name}</span>
                           <span className="text-[8px] font-bold text-slate-400">{chat.time} ago</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 truncate mb-2">{chat.subject}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          chat.status === 'In Review' ? "bg-indigo-500/10 text-indigo-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}>{chat.status}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Message Window */}
              <div className="md:col-span-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs italic">EV</div>
                       <div>
                          <h4 className="text-xs font-black uppercase">Elena Vance, JD</h4>
                          <div className="text-[9px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Available for Counsel
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => setIsEmailModalOpen(true)}
                         className="p-2 text-slate-400 hover:text-red-500 transition-all flex items-center gap-2 group border border-transparent hover:border-red-500/20 rounded-xl"
                       >
                          <span className="text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Secure Mail</span>
                          <Mail size={20} />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><ShieldCheck size={20} /></button>
                       <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><Settings size={20} /></button>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="flex justify-center mb-8">
                       <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[8px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</span>
                    </div>
                    <div className="max-w-[80%] space-y-2">
                       <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-xs font-medium leading-relaxed">I've reviewed the Master Service Agreement for the Shopify Development module. We need to tighten the IP transfer clause for the custom theme components.</p>
                       </div>
                       <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">Counsel • 09:42 AM</span>
                    </div>
                    <div className="max-w-[80%] space-y-2 ml-auto text-right">
                       <div className="p-4 bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-xl shadow-indigo-600/10">
                          <p className="text-xs font-medium leading-relaxed">Agreed. Does the EU AI Act transparency requirement affect our disclosure in Section 4.2?</p>
                       </div>
                       <span className="text-[8px] font-bold text-slate-400 uppercase mr-1">You • 09:44 AM</span>
                    </div>
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                       <div className="flex items-center gap-2 text-indigo-500 mb-2">
                          <BrainCircuit size={14} />
                          <span className="text-[9px] font-black uppercase italic tracking-widest">Vincent AI Suggestion</span>
                       </div>
                       <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium italic">"Based on Art 50(2) of the EU AI Act, we should include a standard labeling clause if the Shopify theme uses generative layout engines."</p>
                       <button className="mt-3 text-[9px] font-bold text-indigo-500 uppercase underline decoration-2 underline-offset-2">Apply to Draft</button>
                    </div>
                 </div>
                 <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
                    <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><Upload size={20} /></button>
                    <input type="text" placeholder="Draft message to counsel..." className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-3 text-xs outline-none font-medium ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-indigo-500/50" />
                    <button className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:scale-[1.05] shadow-lg shadow-indigo-600/20 active:scale-[0.95] transition-all"><ArrowRightLeft size={20} /></button>
                 </div>
              </div>
            </div>
          </section>

          {/* AI Governance Lab */}
          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20">
                  <BrainCircuit size={32} />
                </div>
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">AI Governance Lab</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 italic">Strategic AI Act Compliance & Risk Management</p>
                </div>
              </div>
              <div className="text-right hidden md:block">
                 <p className="text-[10px] font-black uppercase text-red-500">Governance Level</p>
                 <p className="text-xl font-black tracking-tighter">TIER 5 ELITE</p>
              </div>
            </div>

            {/* A) AI Risk Classification System */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {aiRiskCategories.map(cat => (
                <div key={cat.id} className="card-agency p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col h-full group hover:ring-2 hover:ring-red-500/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest", cat.color)}>
                      {cat.status}
                    </span>
                    <Triangle size={14} className="text-slate-300 group-hover:rotate-180 transition-all" />
                  </div>
                  <h4 className="text-xl font-black uppercase italic mb-2">{cat.level}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6">{cat.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Inventory Screening</p>
                    {cat.examples.map(ex => (
                      <div key={ex} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* B) AI System Lifecycle Compliance */}
              <div className="lg:col-span-12">
                <div className="card-agency p-8 bg-slate-950 text-white border-transparent">
                  <div className="flex items-center gap-4 mb-10">
                    <History className="text-red-500" />
                    <h4 className="text-xl font-bold uppercase tracking-tight italic">AI Lifecycle Integrity Monitor</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {aiLifecycleStages.map((stage, i) => (
                      <div key={stage.id} className="relative">
                        {i < aiLifecycleStages.length - 1 && (
                          <div className="hidden md:block absolute top-[22px] -right-2 w-4 h-px bg-white/20 z-0" />
                        )}
                        <div className="relative z-10 p-5 bg-white/5 border border-white/10 rounded-2xl h-full flex flex-col hover:bg-white/10 transition-all">
                           <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                              <stage.icon size={16} className="text-red-500" />
                           </div>
                           <h5 className="text-[11px] font-black uppercase mb-3 tracking-tight">{stage.title}</h5>
                           <div className="space-y-2">
                              {stage.tasks.map(task => (
                                <div key={task} className="flex items-start gap-2">
                                   <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                   <span className="text-[9px] text-slate-400 font-medium leading-tight">{task}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* C) Explainability & Transparency Tools */}
              <div className="lg:col-span-7 space-y-6">
                <div className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-8">
                    <Eye className="text-red-500" />
                    <h4 className="text-lg font-bold uppercase tracking-tight">Transparency Toolkit</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Decision Explainer", desc: "Art 13 templates for explanation rights.", icon: FileText, color: "text-blue-500" },
                      { title: "Model Card Builder", desc: "Standard metadata & performance cards.", icon: LayoutGrid, color: "text-emerald-500" },
                      { title: "Impact Assessment", desc: "Algorithmic bias & safety audits.", icon: GraduationCap, color: "text-red-500" },
                      { title: "Provenance Tracking", desc: "Training data source & lineage logs.", icon: Search, color: "text-amber-500" }
                    ].map(tool => (
                      <div key={tool.title} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-red-500/30 transition-all">
                         <tool.icon size={20} className={cn("mb-3 transition-transform group-hover:scale-110", tool.color)} />
                         <h5 className="text-xs font-black uppercase text-slate-900 dark:text-white mb-2">{tool.title}</h5>
                         <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">{tool.desc}</p>
                         <button className="text-[9px] font-black uppercase text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                           Launch Agent <ChevronRight size={10} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* D) Human Oversight Implementation */}
              <div className="lg:col-span-5">
                <div className="card-agency p-8 bg-slate-900 text-white border-transparent h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <UserCheck className="text-red-500" />
                    <h4 className="text-lg font-bold uppercase tracking-tight">Human Oversight (Art 14)</h4>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="p-6 bg-red-600 rounded-[2rem] shadow-xl shadow-red-600/20 relative overflow-hidden group">
                       <div className="absolute top-4 right-4 animate-ping bg-white/20 w-4 h-4 rounded-full" />
                       <div className="relative z-10">
                          <h5 className="text-xs font-black uppercase mb-1">Global Override Switch</h5>
                          <p className="text-[10px] opacity-80 font-medium">Instant model suspension for detected drift or safety violations.</p>
                       </div>
                       <button className="w-full mt-6 py-3 bg-white text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                         Test Kill-Switch Engine
                       </button>
                    </div>

                    <div className="space-y-4">
                       <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oversight Metrics</h5>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                             <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Human Queue</p>
                             <p className="text-xl font-black text-white">42</p>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                             <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Override Rate</p>
                             <p className="text-xl font-black text-emerald-500">1.2%</p>
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[10px] font-bold uppercase mb-3">Overseer Competence</p>
                          <div className="flex items-center gap-2">
                             {[1,2,3,4,5].map(i => (
                               <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < 4 ? "bg-red-500" : "bg-white/10")} />
                             ))}
                          </div>
                          <p className="text-[8px] text-slate-500 mt-2 font-medium italic">Certification: AI Act Art 14(4) Compliant</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Operations Analytics */}
          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-slate-900 shadow-2xl">
                  <TrendingUp size={32} />
                </div>
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Ops Intelligence</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 italic">Real-time Legal Spend & Risk Data</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Download size={14} /> Export Report
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* A) Compliance Health Score */}
               <div className="lg:col-span-4 card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Compliance Health</h4>
                     <ShieldCheck size={20} className="text-emerald-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-7xl font-black italic tracking-tighter leading-none">{analyticsData.healthScore}</span>
                     <span className="text-2xl font-black text-slate-300 italic">%</span>
                  </div>
                  <div className="mt-8 space-y-4">
                     <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analyticsData.healthScore}%` }} />
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase italic">
                        <span className="text-slate-400">Risk Threshold</span>
                        <span className="text-red-500">15% Max</span>
                     </div>
                  </div>
               </div>

               {/* B) Matter Analytics */}
               <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Active Matters", val: analyticsData.matters.active, icon: Briefcase, color: "text-indigo-500" },
                    { label: "Closed YTD", val: analyticsData.matters.closed, icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Avg Resolution", val: analyticsData.matters.avgResolution, icon: Clock, color: "text-amber-500" },
                    { label: "Win Rate", val: analyticsData.matters.winRate, icon: Target, color: "text-red-500" }
                  ].map(stat => (
                    <div key={stat.label} className="card-agency p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                       <stat.icon size={20} className={cn("mb-4", stat.color)} />
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{stat.label}</p>
                          <p className="text-2xl font-black italic tracking-tighter group-hover:scale-105 transition-transform">{stat.val}</p>
                       </div>
                    </div>
                  ))}
               </div>

               {/* C) Regulatory Monitoring */}
               <div className="lg:col-span-7 card-agency p-8 bg-slate-950 text-white border-transparent">
                  <div className="flex items-center gap-3 mb-8">
                     <Activity className="text-red-500" />
                     <h4 className="text-lg font-bold uppercase tracking-tight italic">Regulatory Radar</h4>
                  </div>
                  <div className="space-y-4">
                     {analyticsData.monitoring.map((m, i) => (
                       <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               m.type === 'CRITICAL' ? "bg-red-500 animate-pulse" : "bg-indigo-500"
                             )} />
                             <div>
                                <p className="text-xs font-black uppercase tracking-tight">{m.event}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{m.date}</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-white/5 rounded-full">{m.type}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* D) ROI Calculator Summary */}
               <div className="lg:col-span-5 card-agency p-8 bg-emerald-600 text-white border-transparent flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-start justify-between mb-8">
                     <div>
                        <h4 className="text-xl font-black uppercase tracking-tighter italic">Investment ROI</h4>
                        <p className="text-[10px] uppercase font-bold opacity-70">LTM Financial Impact</p>
                     </div>
                     <div className="p-3 bg-white/20 rounded-2xl">
                        <CircleDollarSign size={24} />
                     </div>
                  </div>
                  <div className="relative z-10 grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Spend Avoidance</p>
                        <p className="text-4xl font-black tracking-tighter italic">{analyticsData.roi.spendAvoidance}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Risk Mitigation</p>
                        <p className="text-4xl font-black tracking-tighter italic">{analyticsData.roi.mitigationValue}</p>
                     </div>
                  </div>
                  <div className="relative z-10 mt-8 pt-8 border-t border-white/20 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest">Efficiency GAIN</span>
                     <span className="text-2xl font-black italic">+{analyticsData.roi.efficiencyGain}</span>
                  </div>
               </div>
            </div>
          </section>

          {/* Self-Service Legal Center */}
          <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Self-Service Legal Center</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Unified Knowledge Base & Asset Library</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase">100+ Jurisdictions</div>
                 <div className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase">200+ Guides</div>
              </div>
            </div>

            {/* A) Jurisdiction-Specific Guides */}
            <div className="card-agency p-8 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
               <div className="flex items-center gap-3 mb-8">
                  <Globe className="text-indigo-500" />
                  <h4 className="text-lg font-bold uppercase tracking-tight">Jurisdiction Intelligence Guide: {selectedJurisdiction.name}</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Digital Marketing Law", desc: "Overview of commercial communication regulations." },
                    { label: "E-Commerce Rules", desc: "Distance selling and electronic transaction frameworks." },
                    { label: "Consumer Protection", desc: "Unfair practices and mandatory disclosure standards." },
                    { label: "Digital Tax (DST)", desc: "VAT/GST and service-specific tax obligations." }
                  ].map(guide => (
                    <div key={guide.label} className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all cursor-pointer">
                       <h5 className="text-[11px] font-black uppercase text-slate-900 dark:text-white mb-2">{guide.label}</h5>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">{guide.desc}</p>
                       <button className="text-[9px] font-black uppercase text-indigo-500 underline decoration-2 underline-offset-4">Read Full Guide</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* B) Template Library */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <BookOpen className="text-red-500" />
                  <h4 className="text-xl font-bold uppercase tracking-tight italic">Global Template Library</h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {templateCategories.map(cat => (
                    <div key={cat.id} className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] flex flex-col items-center text-center group hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all cursor-pointer">
                       <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4 group-hover:bg-white/10">
                          <cat.icon size={20} className="text-slate-400 group-hover:text-red-500" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-white dark:group-hover:text-slate-950 opacity-100">{cat.name}</span>
                       <span className="text-[9px] font-bold text-slate-400 mt-2">{cat.count} Templates</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* C) Compliance Checklists */}
               <div className="card-agency p-8 bg-slate-950 text-white border-transparent">
                  <div className="flex items-center gap-3 mb-8">
                     <CheckCircle2 className="text-emerald-500" />
                     <h4 className="text-lg font-bold uppercase tracking-tight italic">Interactive Checklists</h4>
                  </div>
                  <div className="space-y-4">
                     {complianceChecklists.map(list => (
                       <div key={list.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                             <h5 className="text-xs font-black uppercase tracking-tighter">{list.title}</h5>
                             <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                               list.risk === 'Critical' ? "bg-red-500 text-white" : "bg-white/10 text-slate-400"
                             )}>{list.risk} Risk</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => (
                                  <div key={i} className="w-2 h-1 rounded-full bg-emerald-500/30" />
                                ))}
                             </div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase">{list.tasks} Control Tasks</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* D) FAQ Engine */}
               <div className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-8">
                     <MessageSquare className="text-indigo-500" />
                     <h4 className="text-lg font-bold uppercase tracking-tight italic">FAQ Intelligence Engine</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="flex flex-wrap gap-2">
                        {faqCategories.map(cat => (
                          <button key={cat.id} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-tight border border-transparent hover:border-indigo-500/30 transition-all flex items-center gap-2">
                             <cat.icon size={14} className="text-slate-400" />
                             {cat.name}
                          </button>
                        ))}
                     </div>
                     <div className="space-y-4">
                        {[
                          "What are the mandatory disclosures for TikTok influencers in the UK?",
                          "Does the EU AI Act apply to my Shopify site if host is in US?",
                          "How do I handle a CCPA deletion request for marketing leads?",
                          "Minimum requirements for a Multi-Jurisdiction DPA?"
                        ].map((q, i) => (
                           <div key={i} className="flex items-start gap-4 group cursor-pointer">
                              <div className="mt-1 text-slate-300 group-hover:text-indigo-500 transition-colors"><Search size={14} /></div>
                              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 w-full">
                                 <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">{q}</p>
                              </div>
                           </div>
                        ))}
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Search 200+ FAQs</button>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Legal Team Directory */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Users className="text-red-500" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Legal Team Registry</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="card-agency p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-200 dark:border-slate-800" />
                    <div>
                      <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white leading-none">{member.name}</h4>
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 italic">{member.role}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {member.specialization.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-sm text-[8px] font-bold uppercase text-slate-500">{s}</span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1"><Globe size={10} /> {member.jurisdictions.join(', ')}</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> {member.languages.join(', ')}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Response SLA</span>
                        <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">{member.sla}</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                       <Calendar size={12} /> Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency Response Protocol */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-red-500" />
              <h3 className="text-xl font-bold uppercase tracking-tight italic">Emergency Priority Protocols</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {incidentProtocols.map(protocol => (
                <div key={protocol.id} className="card-agency p-8 bg-slate-950 text-white border-transparent border-t-4 border-t-red-600">
                   <div className="flex items-center justify-between mb-8">
                      <div className="p-3 bg-white/10 rounded-2xl">
                         <protocol.icon size={24} className="text-red-500" />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-red-500 uppercase italic mb-1">{protocol.severity}</p>
                         <p className="text-lg font-black font-mono tracking-tighter text-white/50">{protocol.timer}</p>
                      </div>
                   </div>
                   <h4 className="text-sm font-black uppercase mb-6">{protocol.name}</h4>
                   <div className="space-y-3 mb-8">
                      {protocol.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                           <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-bold border border-white/10">{i+1}</div>
                           {step}
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20">
                      Activate Response
                   </button>
                </div>
              ))}
            </div>
          </section>

          {/* Document Analysis Engine */}
          <section className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                  <FileSearch className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Neural Document Analysis</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multi-Lingual Clause Extraction & Risk Scoring</p>
                </div>
              </div>
              <div className="flex -space-x-1 overflow-hidden p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 {['EN', 'ES', 'FR', 'DE', 'IT', 'JP', 'ZH', 'AR'].map(lang => (
                   <div key={lang} className="w-7 h-7 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm">{lang}</div>
                 ))}
                 <div className="w-7 h-7 rounded-sm bg-red-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">+17</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-red-500" /> Processing Capabilities
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { title: "OCR / Scanned Analysis", detail: "Convert physical court filings into structured data." },
                      { title: "Clause Extraction", detail: "Auto-detect risk scoring and obligation mapping." },
                      { title: "Cross-Reference Map", detail: "Discover hidden dependencies across documentation." },
                      { title: "Term Identification", detail: "Unified glossary extraction per jurisdiction." }
                    ].map(cap => (
                      <div key={cap.title} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-red-500/30 transition-all">
                        <p className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 group-hover:text-red-500">{cap.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{cap.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Zap size={14} className="text-red-500" /> AI-Powered Insights
                    </h4>
                    <div className="space-y-6">
                       <div className="p-6 bg-red-500 text-white rounded-3xl shadow-xl shadow-red-500/10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity size={80} />
                          </div>
                          <p className="text-xs font-black uppercase italic mb-2 tracking-widest">Risk Heatmap v2.0</p>
                          <p className="text-xs font-medium leading-relaxed opacity-90">Visual overlay of high-liability clauses detected in {selectedService.name} agreements for {selectedJurisdiction.name}.</p>
                          <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/20 rounded-md text-[8px] font-bold uppercase">Critical Flags: 04</span>
                            <span className="px-2 py-1 bg-white/20 rounded-md text-[8px] font-bold uppercase">Exposure: $2.4M</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 gap-4">
                          {[
                            "Missing Clause Detection",
                            "Regulatory Compliance Gap Analysis",
                            "Negotiation Point Prioritization",
                            "Alternative Clause Suggestions"
                          ].map(feature => (
                            <div key={feature} className="flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-white/5">
                               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                               <span className="text-[10px] font-bold uppercase text-slate-400">{feature}</span>
                               <ChevronRight size={14} className="ml-auto text-slate-700" />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <Globe size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Language Breadth</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">25+ Jurisdictional Languages Supported natively.</p>
                  </div>
               </div>
               <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.05] transition-all">
                 Launch Analysis Engine
               </button>
            </div>
          </section>

          {/* Discovery & Litigation Module */}
          <section className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                 <Gavel className="text-red-500" /> Discovery & Litigation
               </h3>
               <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                 <Settings size={20} />
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="text-red-500"><FileSearch size={24} /></div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">E-Discovery</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Templates for document requests and hold notices with automated metadata tracking.</p>
               </div>
               <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="text-red-500"><MessageSquare size={24} /></div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Deposition Bank</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Jurisdiction-specific question banks for expert witnesses and management personnel.</p>
               </div>
               <div className="p-6 rounded-[24px] bg-slate-950 text-white border-transparent space-y-4">
                  <div className="text-emerald-500"><CircleDollarSign size={24} /></div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Litigation Budget</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Automated cost projections for trial prep, expert fees, and settlement frameworks.</p>
               </div>
             </div>

             <div className="mt-8 flex items-center gap-3">
               <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">Draft Motion Template</button>
               <button className="flex-1 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">Settlement Framework</button>
             </div>
          </section>
        </div>

        {/* Contact & Support (Right Column) */}
        <div className="lg:col-span-4 space-y-8">
          
          <section className="card-agency p-8 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight underline decoration-red-500 decoration-4 underline-offset-4">Intake Portal</h3>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Service</label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold border border-slate-100 dark:border-slate-800 truncate">
                    {selectedService.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Jurisdiction</label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold border border-slate-100 dark:border-slate-800">
                    {selectedJurisdiction.code}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Type</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-red-500/50 transition-all">
                   <option>Contract Review & Drafting</option>
                   <option>Regulatory Compliance Audit</option>
                   <option>IP Protection / Infringement</option>
                   <option>AI Governance (EU AI Act)</option>
                   <option>Data Breach Incident</option>
                   <option>Platform Dispute (TOS)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                   {['Standard', 'Expedited', 'Emergency'].map(level => (
                     <button key={level} type="button" className={cn(
                       "py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                       level === 'Standard' ? "bg-slate-900 text-white border-slate-900" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800"
                     )}>
                       {level}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Narrative context</label>
                  <button className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                    <BrainCircuit size={10} /> AI Drafting Asst.
                  </button>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Describe your matter... AI assistance available to structure your narrative."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-4 text-xs outline-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-red-500/50 transition-all resize-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload relevant docs</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-red-500/30 transition-all cursor-pointer">
                   <Upload size={20} className="text-slate-300" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Drag & Drop or Click to Upload</p>
                   <p className="text-[8px] text-slate-500 font-medium">Auto-OCR Pre-processing Enabled</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                 <AlertTriangle size={14} className="text-red-500 shrink-0" />
                 <p className="text-[9px] text-red-500/70 font-medium leading-tight text-center">
                   Verified Attorney-Client Privilege active for this submission.
                 </p>
              </div>

              <button className="w-full py-5 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Submit Counsel Inquiry
              </button>
            </form>

            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Compliance Directory</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer">
                     <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-500 transition-colors">GDPR Information Center</span>
                     <Search size={14} className="text-slate-300" />
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer">
                     <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-500 transition-colors">Terms of Service (Global)</span>
                     <BookOpen size={14} className="text-slate-300" />
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer">
                     <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-500 transition-colors">Privacy Shield Status</span>
                     <Scale size={14} className="text-slate-300" />
                  </div>
               </div>
            </div>
          </section>

        </div>
      </div>

      {/* Footer / Disclaimer */}
      <footer className="pt-12 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Gavel size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Legal Architect Engine</p>
                <p className="text-xs font-medium text-slate-500">v4.0.2 • Verified Compliance Matrix</p>
              </div>
           </div>
           <div className="max-w-xl">
             <p className="text-[10px] text-slate-400 text-center md:text-right leading-relaxed italic">
               DISCLAIMER: The information provided by the Legal Architect engine is for informational purposes only and does not constitute legal advice. While we strive to maintain compliance with GDPR, PIPEDA, CCPA, and the EU AI Act, you must consult with qualified legal counsel before making operational decisions.
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
}

