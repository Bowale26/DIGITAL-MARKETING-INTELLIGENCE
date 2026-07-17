import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Folder, ShieldCheck, FileText, CornerDownLeft, Sparkles } from 'lucide-react';

interface SearchItem {
  id: string;
  name: string;
  category: 'Project' | 'Protocol' | 'Vault File';
  description: string;
  path: string;
  icon: React.ComponentType<any>;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  // Agency Projects
  {
    id: 'PROJ-META-01',
    name: 'Meta Campaign Pro',
    category: 'Project',
    description: 'Ad orchestration engine for high-performance Facebook/Instagram campaigns.',
    path: '/campaigns',
    icon: Folder,
  },
  {
    id: 'PROJ-SHOP-02',
    name: 'Shopify Automation Sync',
    category: 'Project',
    description: 'Autonomous sync pipelines and revenue workflows for e-commerce brands.',
    path: '/automations',
    icon: Folder,
  },
  {
    id: 'PROJ-AD-03',
    name: 'Neural Ad Optimizer',
    category: 'Project',
    description: 'AI decision engine matching campaign targets with real-time web trends.',
    path: '/services/leads',
    icon: Folder,
  },
  {
    id: 'PROJ-SEO-04',
    name: 'Google SEO Sprint',
    category: 'Project',
    description: 'Organic search performance optimization and deep content mapping.',
    path: '/services/seo/lab',
    icon: Folder,
  },
  {
    id: 'PROJ-ROI-05',
    name: 'ROI Attribution Tracker',
    category: 'Project',
    description: 'Multi-touch revenue attribution dashboard and marketing mix modeling.',
    path: '/analytics',
    icon: Folder,
  },

  // Governance Protocols
  {
    id: 'RULE-TONE-001',
    name: 'General Communication Tone',
    category: 'Protocol',
    description: 'System Governance rule enforcing a warm, conversational, and highly verified voice.',
    path: '/governance',
    icon: ShieldCheck,
  },
  {
    id: 'RULE-CTA-002',
    name: 'Conversion Optimization (CTA)',
    category: 'Protocol',
    description: 'Mandatory standard requiring clear call-to-actions across all ad and copy nodes.',
    path: '/governance',
    icon: ShieldCheck,
  },
  {
    id: 'RULE-BRAND-003',
    name: 'Brand Consistency Standard',
    category: 'Protocol',
    description: 'System governance rule securing consistent high-performance Flux brand styles.',
    path: '/governance',
    icon: ShieldCheck,
  },
  {
    id: 'RULE-COMPLIANCE-004',
    name: 'Platform Ad Compliance',
    category: 'Protocol',
    description: 'Automated policy compliance auditing for Meta, Google, and LinkedIn channels.',
    path: '/governance',
    icon: ShieldCheck,
  },
  {
    id: 'RULE-DATA-005',
    name: 'Data Grounding Rule',
    category: 'Protocol',
    description: 'Neural grounding protocols ensuring all claims are verified by search engines.',
    path: '/governance',
    icon: ShieldCheck,
  },

  // Vault Files
  {
    id: 'FILE-BLUE-01',
    name: 'lead_gen_blueprint_rev4.pdf',
    category: 'Vault File',
    description: 'Strategic lead generation and flow chart documentation blueprint.',
    path: '/vault',
    icon: FileText,
  },
  {
    id: 'FILE-ASSET-02',
    name: 'brand_assets_vector.zip',
    category: 'Vault File',
    description: 'Compressed vector icons, logo files, and typographic design assets.',
    path: '/vault',
    icon: FileText,
  },
  {
    id: 'FILE-CODE-03',
    name: 'checkout_flow_logic.js',
    category: 'Vault File',
    description: 'Custom payment handling and secure stripe-proxy redirect scripts.',
    path: '/vault',
    icon: FileText,
  },
  {
    id: 'FILE-IMG-04',
    name: 'hero_banner_preview.png',
    category: 'Vault File',
    description: 'Landing page creative concept mockups and high-fidelity wireframes.',
    path: '/vault',
    icon: FileText,
  },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = query.trim() === ''
    ? []
    : SEARCHABLE_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside clicks to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectItem = (item: SearchItem) => {
    navigate(item.path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl z-50">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects, protocols, files by name or ID... (Press '/' to search)"
          className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-12 py-2.5 text-sm outline-none focus:border-[#FF6B00]/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[9px]">/</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-3 bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800/80 rounded-[24px] shadow-2xl overflow-hidden max-h-[480px] overflow-y-auto custom-scrollbar"
          >
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-600">
                  <Search size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No results found</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                  We couldn't find any projects, protocols, or files matching "<span className="text-orange-500 font-semibold">{query}</span>".
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                <div className="px-3 py-2 text-[10px] font-mono font-black text-[#FF6B00] uppercase tracking-widest flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span>FOUND {filteredItems.length} INTEGRATED ASSETS</span>
                  <span className="flex items-center gap-1 text-slate-400"><CornerDownLeft size={10} /> ENTER TO NAVIGATE</span>
                </div>

                {filteredItems.map((item, idx) => {
                  const IconComponent = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl flex items-start gap-4 transition-all duration-150 relative ${
                        isSelected
                          ? 'bg-slate-50 dark:bg-slate-900/60 border-l-2 border-[#FF6B00] pl-2.5'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/20 border-l-2 border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                      }`}>
                        <IconComponent size={16} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">
                            {item.name}
                          </h4>
                          <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                            item.category === 'Project'
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              : item.category === 'Protocol'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-slate-400 font-bold">
                          <span className="text-slate-300 dark:text-slate-600">ID:</span>
                          <span className="text-[#FF6B00]">{item.id}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-slate-400">PATH: {item.path}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          layoutId="active-search-indicator"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-orange-500 shrink-0"
                        >
                          <Sparkles size={12} className="animate-pulse" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
