import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp,
  Rocket,
  Video,
  Image as ImageIcon,
  ShieldCheck,
  Code2,
  DollarSign,
  ShoppingBag, 
  Share2, 
  Users, 
  Target, 
  Search, 
  PenTool, 
  Globe, 
  Monitor,
  Server, 
  Sparkles, 
  Layers,
  ChevronRight,
  Settings,
  X,
  CreditCard,
  LifeBuoy,
  Folder,
  BarChart3,
  Zap,
  Trophy,
  Shield,
  Calendar,
  FlaskConical,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const services = [
  { name: 'Competitor Node', icon: Users, path: '/services/leads' },
  { name: 'Trend Node', icon: TrendingUp, path: '/services/social' },
  { name: 'SEO Node', icon: Search, path: '/services/seo/lab' },
  { name: 'Crisis Node', icon: AlertTriangle, path: '/services/ppc' },
  { name: 'Content Lab', icon: PenTool, path: '/services/content/lab' },
  { name: 'Web Design', icon: Monitor, path: '/services/web/lab' },
  { name: 'Web Hosting', icon: Server, path: '/services/hosting' },
  { name: 'AI Strategy', icon: Zap, path: '/strategy' },
];

export default function Sidebar({ onNavClick, isMobile }: { onNavClick?: () => void, isMobile?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="sidebar-brand-container h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-900 overflow-hidden shrink-0 group/brand">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover/brand:rotate-[15deg] group-hover/brand:scale-105 transition-transform duration-500 ease-out">
            <Sparkles className="text-white" size={24} />
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg leading-tight uppercase tracking-tight">Digital Marketing</span>
              <span className="text-[10px] text-[#00AEEF] font-bold uppercase tracking-[0.2em]">Intelligence</span>
            </motion.div>
          )}
        </div>
        {isMobile && onNavClick && (
          <button onClick={onNavClick} className="ml-auto text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {/* Dynamic AI Button Activation Panel */}
        {(!isCollapsed || isMobile) && (
          <div className="p-3 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 dark:border-orange-500/20 rounded-2xl space-y-2 mb-4 mx-1">
            <div className="flex items-center justify-between text-[8px] font-mono font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest">
              <span>AI CALIBRATION RATE</span>
              <span className="font-bold text-[#FF6B00]">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF6B00] rounded-full transition-all duration-1000"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-100">
                100%
              </span>
            </div>
            <div className="text-[8px] font-mono text-slate-400 dark:text-slate-400 leading-normal flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              <span>All buttons activated effectively.</span>
            </div>
          </div>
        )}

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Marketing Suite</p>}
          <div className="space-y-1">
            <NavItem to="/marketing-calendar" icon={Calendar} label="Omni-Calendar" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/ecosystem" icon={Layers} label="Service Ecosystem" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/intelligence" icon={Globe} label="Market Intelligence" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/strategy" icon={Sparkles} label="Strategy AI" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/ab-testing" icon={FlaskConical} label="A/B Testing Lab" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/analytics" icon={BarChart3} label="ROI Analytics" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
          </div>
        </div>

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Growth & Revenue</p>}
          <div className="space-y-1">
            <NavItem to="/pipeline" icon={Target} label="Lead Pipeline" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/campaigns" icon={Rocket} label="Ad Orchestrator" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/revenue" icon={DollarSign} label="Revenue Studio" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/engagement" icon={Trophy} label="Engagement Hub" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
          </div>
        </div>

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Execution Lab</p>}
          <div className="space-y-1">
            <NavItem to="/build" icon={ShoppingBag} label="Build Center" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/media" icon={ImageIcon} label="Media Studio" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/stream" icon={Video} label="Stream Hub" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/automations" icon={Zap} label="Workflows" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/code" icon={Code2} label="Code Lab" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
          </div>
        </div>

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Maintenance</p>}
          <div className="space-y-1">
            <NavItem to="/governance" icon={ShieldCheck} label="AI Governance" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/vault" icon={Folder} label="Project Vault" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/training" icon={Settings} label="Training Lab" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/legal" icon={Shield} label="Legal Center" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
          </div>
        </div>

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Service Ecosystem</p>}
          <div className="space-y-1">
            {services.map((s) => (
              <NavItem key={s.path} to={s.path} icon={s.icon} label={s.name} collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            ))}
          </div>
        </div>

        <div>
          {(!isCollapsed || isMobile) && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] px-3 mb-4">Operations</p>}
          <div className="space-y-1">
            <NavItem to="/billing" icon={CreditCard} label="Billing Central" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/support" icon={LifeBuoy} label="Support Center" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
            <NavItem to="/settings" icon={Settings} label="System Config" collapsed={isCollapsed && !isMobile} onClick={onNavClick} />
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!isMobile && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-900 shrink-0">
          <div className="space-y-1">
            <motion.button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all group"
              id="compress-menu-btn"
            >
              <div className={cn("transition-transform duration-300", isCollapsed && "rotate-180")}>
                <ChevronRight size={20} />
              </div>
              {!isCollapsed && <span className="text-sm font-medium">Compress Menu</span>}
            </motion.button>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return <div className="h-full flex flex-col">{sidebarContent}</div>;
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      style={{ overflowX: 'hidden' }}
      className="h-screen bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 flex flex-col z-50 sticky top-0"
    >
      {sidebarContent}
    </motion.aside>
  );
}

function NavItem({ to, icon: Icon, label, collapsed, onClick }: { to: string, icon: any, label: string, collapsed: boolean, onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => cn(
        "sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
        isActive 
          ? "bg-orange-500/10 text-[#FF6B00]" 
          : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
      )}
    >
      <Icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-105" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-950 dark:bg-black text-white text-[9px] rounded-lg tracking-wider font-mono font-bold uppercase transition-all duration-300 transform scale-95 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 whitespace-nowrap z-50 border border-slate-800/85 shadow-2xl">
          {label}
        </div>
      )}
    </NavLink>
  );
}
