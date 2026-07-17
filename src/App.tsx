import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Shell from './components/Shell';
import Dashboard from './pages/Dashboard';
import StrategyLab from './pages/StrategyLab';
import LeadPipeline from './pages/LeadPipeline';
import SEOHub from './pages/SEOHub';
import ShopifyDev from './pages/ShopifyDev';
import AdsPerformance from './pages/AdsPerformance';
import ContentLab from './pages/ContentLab';
import SocialMedia from './pages/SocialMedia';
import WebDesignLab from './pages/WebDesignLab';
import EngagementHub from './pages/EngagementHub';
import LegalHub from './pages/LegalHub';
import Onboarding from './pages/Onboarding';
import EmptyState from './components/EmptyState';
import ServiceDetail from './pages/ServiceDetail';
import RegistrationFlow from './components/RegistrationFlow';
import SupportCenter from './pages/SupportCenter';
import BillingSystem from './pages/BillingSystem';
import ProjectVault from './pages/ProjectVault';
import Analytics from './pages/Analytics';
import Automations from './pages/Automations';
import BuildCenter from './pages/BuildCenter';
import StreamHub from './pages/StreamHub';
import MediaStudio from './pages/MediaStudio';
import AdOrchestrator from './pages/AdOrchestrator';
import MonetizationStudio from './pages/MonetizationStudio';
import Governance from './pages/Governance';
import MarketIntelligence from './pages/MarketIntelligence';
import Leads from './pages/Leads';
import ABTestingLab from './pages/ABTestingLab';
import MarketingSuite from './pages/MarketingSuite';
import MarketingCalendar from './pages/MarketingCalendar';
import ServiceEcosystem from './pages/ServiceEcosystem';
import TrainingLab from './pages/TrainingLab';
import CodeLab from './pages/CodeLab';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import { Globe, Server, Palette, Layers, ShoppingBag, Share2, Users, Target, Search, PenTool, BarChart3, Zap, Folder, CreditCard, LifeBuoy, Star, Smartphone, Award, Circle } from 'lucide-react';
import AuthPage from './pages/AuthPage';
import Pricing from './pages/Pricing';
import LeadDetails from './pages/LeadDetails';
import SystemConfig from './pages/SystemConfig';
import { LeadProvider } from './context/LeadContext';
import ErrorBoundary from './components/ErrorBoundary';

const ServicePlaceholder = ({ title, desc, icon }: { title: string, desc: string, icon: any }) => (
  <div className="space-y-6">
    <div className="px-2">
      <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="text-slate-500 mt-2 font-medium">{desc}</p>
    </div>
    <EmptyState 
      title={`No Active ${title} Projects`}
      description="It looks like you haven't initialized any projects for this module yet. Connect your infrastructure or start a new campaign to begin."
      actionLabel="Initialize Module"
      icon={icon}
    />
  </div>
);

export default function App() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    localStorage.setItem('onboarded', 'true');
    setNeedsOnboarding(false);
  }, []);

  return (
    <ErrorBoundary>
      <LeadProvider>
        <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<Pricing />} />
        {needsOnboarding ? (
          <Route path="*" element={<Navigate to="/onboarding" />} />
        ) : (
          <Route element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="strategy" element={<StrategyLab />} />
            <Route path="pipeline" element={<Leads />} />
            <Route path="pipeline/:id" element={<LeadDetails />} />
            
            {/* Detailed Service Views */}
            <Route path="services/:id" element={<ServiceDetail />} />
            
            {/* Legacy Tool Routes (Optional: can keep these if you want specific tools) */}
            <Route path="services/shopify/lab" element={<ShopifyDev />} />
            <Route path="services/social/lab" element={<SocialMedia />} />
            <Route path="services/ppc/lab" element={<AdsPerformance />} />
            <Route path="services/seo/lab" element={<SEOHub />} />
            <Route path="services/content/lab" element={<ContentLab />} />
            <Route path="services/web/lab" element={<WebDesignLab />} />
            <Route path="engagement" element={<EngagementHub />} />
            <Route path="legal" element={<LegalHub />} />
            
            <Route path="support" element={<SupportCenter />} />
            <Route path="billing" element={<BillingSystem />} />
            <Route path="vault" element={<ProjectVault />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="marketing-suite" element={<MarketingSuite />} />
            <Route path="marketing-calendar" element={<MarketingCalendar />} />
            <Route path="build" element={<BuildCenter />} />
            <Route path="stream" element={<StreamHub />} />
            <Route path="campaigns" element={<AdOrchestrator />} />
            <Route path="revenue" element={<MonetizationStudio />} />
            <Route path="media" element={<MediaStudio />} />
            <Route path="governance" element={<Governance />} />
            <Route path="intelligence" element={<MarketIntelligence />} />
            <Route path="ecosystem" element={<ServiceEcosystem />} />
            <Route path="ab-testing" element={<ABTestingLab />} />
            <Route path="training" element={<TrainingLab />} />
            <Route path="code" element={<CodeLab />} />
            <Route path="automations" element={<Automations />} />
            <Route path="success" element={<Success />} />
            <Route path="cancel" element={<Cancel />} />
            <Route path="register" element={<RegistrationFlow onComplete={() => window.location.href = '/'} />} />
            
            <Route path="settings" element={<SystemConfig />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
      </LeadProvider>
    </ErrorBoundary>
  );
}
