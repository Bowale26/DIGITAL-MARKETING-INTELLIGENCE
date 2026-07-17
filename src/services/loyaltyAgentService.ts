/**
 * Loyalty Agent Orchestration Service
 * Simulates an Agent-to-Agent (A2A) orchestration for the Loyalty Hub.
 */

import { GeminiService } from './geminiService';

export enum AgentRole {
  ORCHESTRATOR = 'OrchestratorAgent',
  LEDGER = 'LEDGER_AGENT',
  TIER_ANALYSIS = 'TIER_ANALYSIS_AGENT',
  OUTPUT = 'OUTPUT_AGENT',
  ACADEMY = 'AcademyAgent',
  ACHIEVEMENTS = 'AchievementsAgent',
  LOYALTY_HUB = 'LoyaltyHubAgent',
  COMMUNITY = 'CommunityAgent',
  SCALING = 'ScalingAgent',
  COMPLIANCE = 'ComplianceAgent',
  INCIDENT = 'IncidentAgent',
  CONTRACT = 'ContractAgent',
  LEGAL_CONTACT = 'LegalContactAgent',
  ROUTING = 'RoutingAgent',
  PREDICTIVE = 'PredictiveAgent',
  AUDIT = 'AuditAgent',
  SYSTEM = 'SystemAgent',
  BAYESIAN = 'BayesianAgent',
  GROUNDING = 'GroundingAgent',
  MEDIA = 'MediaAgent',
  // Flux Neural Mesh Modules
  INSIGHT = 'INSIGHT_AGENT',
  DECISIONING = 'DECISIONING_AGENT',
  CONTENT = 'CONTENT_AGENT',
  AUDIENCE = 'AUDIENCE_AGENT',
  CO_MARKETER = 'CO_MARKETER_AGENT',
  SHOPPING = 'SHOPPING_AGENT',
  SEO = 'SEO_AGENT',
  ECOMMERCE = 'ECOMMERCE_AGENT',
  CONTENT_MARKETING = 'CONTENT_MARKETING_AGENT',
  EMAIL_MARKETING = 'EMAIL_MARKETING_AGENT',
  PPC = 'PPC_AGENT',
  ONLINE_ADS = 'ONLINE_ADS_AGENT',
  CALENDAR = 'CALENDAR_AGENT',
  INTELLIGENCE = 'INTELLIGENCE_AGENT',
  TRAINING = 'TRAINING_AGENT',
  CONTENT_LAB = 'CONTENT_LAB_AGENT',
  NARRATIVE = 'NARRATIVE_AGENT',
  DESIGN_ENGINEER = 'DESIGN_ENGINEER_AGENT',
  DEVOPS = 'DEVOPS_AGENT'
}

export interface ComplianceDoc {
  id: string;
  title: string;
  standard: string;
  scope: string;
  obligation: string;
  statement: string;
  status: 'CURRENT' | 'UNDER_REVIEW';
  lastReviewed: string;
}

export const COMPLIANCE_REGISTRY: Record<string, ComplianceDoc> = {
  'DOC_01': { 
    id: 'DOC_01',
    title: 'Accessibility Statement', 
    standard: 'WCAG 2.1 Level AA',
    scope: 'All digital interfaces — web, mobile, email, and embedded content',
    obligation: 'Conformance audits conducted quarterly; non-conformances logged and remediated within 30 days.',
    statement: 'We are committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.',
    status: 'CURRENT',
    lastReviewed: '2024-01-15'
  },
  'DOC_02': { 
    id: 'DOC_02',
    title: 'Anti-Spam Policy', 
    standard: 'CAN-SPAM Act, CASL, GDPR Article 6(1)(a)',
    scope: 'All outbound communication channels — email, SMS, push notifications, retargeting',
    obligation: 'Express opt-in required prior to any commercial communication. Unsubscribe honored within 10 business days.',
    statement: 'We maintain a strict prohibition of unsolicited communication through all our channels. Recipients must provide affirmative consent before any marketing communication is initiated.',
    status: 'CURRENT',
    lastReviewed: '2024-02-10'
  },
  'DOC_03': { 
    id: 'DOC_03',
    title: 'Payment Security Disclosure', 
    standard: 'PCI-DSS Level 1 (highest tier)',
    scope: 'All card-present and card-not-present transactions',
    obligation: 'Annual QSA audit, quarterly network scans, tokenization on all stored card data.',
    statement: 'All payment processing is PCI-DSS Level 1 compliant via encrypted gateways. No raw card data is stored, transmitted, or processed outside of certified environments.',
    status: 'CURRENT',
    lastReviewed: '2024-03-05'
  },
  'DOC_04': { 
    id: 'DOC_04',
    title: 'Data Retention Policy', 
    standard: 'GDPR Article 5(1)(e), PIPEDA, applicable local legislation',
    scope: 'All client data collected during service delivery',
    obligation: 'Data held for service duration + 7 years; then securely deleted or anonymized.',
    statement: 'We retain client data for the duration of the service agreement plus 7 years for legislative compliance. Upon expiry, data is irreversibly purged in accordance with applicable law.',
    status: 'CURRENT',
    lastReviewed: '2024-01-20'
  },
  'DOC_05': { 
    id: 'DOC_05',
    title: 'Incident Response Plan', 
    standard: 'NIST SP 800-61',
    scope: 'All information systems and cloud infrastructure',
    obligation: 'Detection and analysis, containment, eradication, and recovery. Mandatory notification within 24 hours.',
    statement: 'We maintain rigid incident response protocols to ensure rapid containment and recovery. Any security breach results in immediate isolation of affected assets and notification of relevant authorities.',
    status: 'CURRENT',
    lastReviewed: '2024-04-01'
  },
  'DOC_06': { 
    id: 'DOC_06',
    title: 'Custom Service Agreement', 
    standard: 'Bespoke Legal Framework',
    scope: 'Enterprise and high-volume merchant tiers',
    obligation: 'Execution of Master Service Agreement (MSA) and Statement of Work (SOW).',
    statement: 'Our Enterprise agreements are tailored to the specific scaling needs of high-volume merchants. Each SOW defines deliverables, milestones, and technical service level agreements.',
    status: 'UNDER_REVIEW',
    lastReviewed: '2024-03-15'
  }
};

export interface AgentHandoff {
  source: string;
  target: string;
  payload: any;
  timestamp: string;
}

export interface LoyaltyStatus {
  points: number;
  tier: string;
  mappedTier: string;
  badges: string[];
  handoffLogs: AgentHandoff[];
  activeLessonId?: string;
  streak: number;
  lastActivity: string;
}

export class LoyaltyAgentService {
  private static instance: LoyaltyAgentService;
  private state: LoyaltyStatus = {
    points: 12450,
    tier: 'Expert',
    mappedTier: 'EXPERT',
    badges: ['Growth Hacker', 'Liquid Master'],
    handoffLogs: [],
    streak: 5,
    lastActivity: new Date().toISOString()
  };

  private constructor() {}

  static getInstance(): LoyaltyAgentService {
    if (!LoyaltyAgentService.instance) {
      LoyaltyAgentService.instance = new LoyaltyAgentService();
    }
    return LoyaltyAgentService.instance;
  }

  private routeSignal(signal: string): { role: AgentRole; docId: string | null; intent: string } {
    const s = signal.toLowerCase();
    
    // Explicit Document Priority
    const directDocMatch = signal.match(/DOC_\d+/);
    const directDoc = directDocMatch ? directDocMatch[0] : null;

    // Routing Logic based on User Signal
    if (['accessibility', 'wcag', 'ada', 'screen reader'].some(k => s.includes(k)) || directDoc === 'DOC_01') 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_01', intent: 'ACCESSIBILITY_COMPLIANCE' };
    
    if (['spam', 'unsolicited', 'email', 'opt-in', 'can-spam'].some(k => s.includes(k)) || directDoc === 'DOC_02') 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_02', intent: 'ANTI_SPAM_COMPLIANCE' };
    
    if (['payment', 'pci', 'card', 'gateway', 'encryption'].some(k => s.includes(k)) || directDoc === 'DOC_03') 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_03', intent: 'PAYMENT_SECURITY' };
    
    if (['data', 'retain', 'retention', 'gdpr', 'delete', '7 year'].some(k => s.includes(k)) || directDoc === 'DOC_04') 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_04', intent: 'DATA_RETENTION' };
    
    if (['breach', 'incident', 'security', 'hack', 'notification'].some(k => s.includes(k)) || directDoc === 'DOC_05') 
      return { role: AgentRole.INCIDENT, docId: 'DOC_05', intent: 'INCIDENT_RESPONSE' };
    
    if (['msa', 'sow', 'contract', 'custom', 'enterprise', 'volume'].some(k => s.includes(k)) || directDoc === 'DOC_06') 
      return { role: AgentRole.CONTRACT, docId: 'DOC_06', intent: 'CONTRACT_REVIEW' };
    
    if (['contact legal', 'speak to lawyer', 'legal team'].some(k => s.includes(k))) 
      return { role: AgentRole.LEGAL_CONTACT, docId: null, intent: 'LEGAL_CONSULTATION' };

    if (['view terms', 'terms of service', 'tos summary'].some(k => s.includes(k))) 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_06', intent: 'LEGAL_TERMS' };
    
    if (['privacy policy', 'data inventory', 'privacy summary'].some(k => s.includes(k))) 
      return { role: AgentRole.COMPLIANCE, docId: 'DOC_04', intent: 'LEGAL_PRIVACY' };
    
    if (['generate contract', 'contract template', 'custom agreement'].some(k => s.includes(k))) 
      return { role: AgentRole.CONTRACT, docId: null, intent: 'LEGAL_CONTRACT_GEN' };
    
    if (['compliance check', 'audit operations', 'regulation audit'].some(k => s.includes(k))) 
      return { role: AgentRole.AUDIT, docId: null, intent: 'LEGAL_COMPLIANCE_CHECK' };

    if (['trigger sequence', 'initiate multi-agent', 'activation', 'system settings'].some(k => s.includes(k))) 
      return { role: AgentRole.SYSTEM, docId: null, intent: 'SYS_TRIGGER' };
    
    if (['synchronize agents', 'mesh sync', 'reconcile ledger'].some(k => s.includes(k))) 
      return { role: AgentRole.LEDGER, docId: null, intent: 'SYS_SYNC' };
    
    if (['calculate uptime', 'mapping efficiency', 'system metrics', 'anomaly report'].some(k => s.includes(k))) 
      return { role: AgentRole.SYSTEM, docId: null, intent: 'SYS_METRICS' };
    
    if (['high-intensity mode', 'aggressive scaling'].some(k => s.includes(k))) 
      return { role: AgentRole.SCALING, docId: null, intent: 'SYS_TOGGLE_HIM' };
    
    if (['immutable history', 'on-chain ledger'].some(k => s.includes(k))) 
      return { role: AgentRole.LEDGER, docId: null, intent: 'SYS_TOGGLE_IH' };
    
    if (['agent hot-swapping', 'autonomous intent routing'].some(k => s.includes(k))) 
      return { role: AgentRole.ROUTING, docId: null, intent: 'SYS_TOGGLE_HS' };
    
    if (['predictive scaling', 'auto-trigger scalingagent'].some(k => s.includes(k))) 
      return { role: AgentRole.PREDICTIVE, docId: null, intent: 'SYS_TOGGLE_PS' };

    if (['achievement progress', 'milestone data', 'progress map'].some(k => s.includes(k))) 
      return { role: AgentRole.ACHIEVEMENTS, docId: null, intent: 'ACHIEVEMENT_PROGRESS' };
    
    if (['claim reward', 'claim badge', 'mint badge', 'mint nft', 'reward claim', 'unlock badge'].some(k => s.includes(k))) 
      return { role: AgentRole.LOYALTY_HUB, docId: null, intent: 'CLAIM_REWARD' };
    
    if (['leaderboard refresh', 'aggregate top performers', 'rank by engagement', 'leaderboard access'].some(k => s.includes(k))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'LEADERBOARD_REFRESH' };

    if (['browse courses', 'course catalog', 'learning path'].some(k => s.includes(k))) 
      return { role: AgentRole.ACADEMY, docId: null, intent: 'ACADEMY_BROWSE' };
    
    if (['start lesson', 'load lesson', 'lesson content', 'course init', 'initialize module'].some(k => s.includes(k))) 
      return { role: AgentRole.ACADEMY, docId: null, intent: 'ACADEMY_LESSON' };
    
    if (['take assessment', 'adaptive quiz', 'quiz module'].some(k => s.includes(k))) 
      return { role: AgentRole.ACADEMY, docId: null, intent: 'ACADEMY_ASSESS' };
    
    if (['generate certificate', 'verifiable credential', 'issue certificate', 'certification path'].some(k => s.includes(k))) 
      return { role: AgentRole.ACADEMY, docId: null, intent: 'ACADEMY_CERTIFICATE' };

    if (['join discussion', 'thread context', 'recent comments', 'forum access'].some(k => s.includes(k))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_THREAD' };
    
    if (['start topic', 'new thread', 'create discussion'].some(k => s.includes(k))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_TOPIC' };
    
    if (['find collaborators', 'partner search', 'skill match', 'expert connect'].some(k => s.includes(k))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_MATCH' };
    
    if (['event registration', 'sign up for event', 'webinar alert'].some(k => s.includes(k))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_EVENT' };

    if (['referral', 'invite link'].some(k => s.includes(k)))
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_REFERRAL' };

    if (['market intelligence', 'competitor intelligence', 'trend analysis', 'seo opportunity', 'crisis monitoring', 'grounding engine'].some(k => s.includes(k)))
      return { role: AgentRole.GROUNDING, docId: null, intent: 'GROUNDING_SYNC' };

    if (['synthesize variant', 'bayesian v4', 'svi inference', 'a/b training'].some(k => s.includes(k)))
      return { role: AgentRole.BAYESIAN, docId: null, intent: 'AB_SYNTHESIS' };

    if (['audit logs', 'ab testing audit', 'ledger audit'].some(k => s.includes(k)))
      return { role: AgentRole.AUDIT, docId: null, intent: 'AB_AUDIT' };

    if (['media studio', 'veo engine', 'video generation', 'prompt workspace', 'content generation'].some(k => s.includes(k)))
      return { role: AgentRole.MEDIA, docId: null, intent: 'MEDIA_STUDIO_ACTIVATE' };
    
    if (['export asset', 'ads manager export', 'youtube export'].some(k => s.includes(k)))
      return { role: AgentRole.MEDIA, docId: null, intent: 'MEDIA_EXPORT' };

    if (['safety check', 'policy violation', 'commercial safety'].some(k => s.includes(k)))
      return { role: AgentRole.COMPLIANCE, docId: null, intent: 'MEDIA_SAFETY_CHECK' };

    // New Marketing Modules
    if (['seo module', 'keyword research', 'on-page seo', 'technical seo', 'backlink monitor'].some(k => s.includes(k)))
      return { role: AgentRole.SEO, docId: null, intent: 'SEO_ACTIVATE' };
    
    if (['e-commerce module', 'product catalog', 'merchant center', 'inventory sync'].some(k => s.includes(k)))
      return { role: AgentRole.ECOMMERCE, docId: null, intent: 'ECOMMERCE_ACTIVATE' };

    if (['content marketing', 'content strategy', 'editorial calendar', 'blog generation'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_MARKETING, docId: null, intent: 'CONTENT_ACTIVATE' };

    if (['email marketing', 'list segmentation', 'email automation', 'deliverability'].some(k => s.includes(k)))
      return { role: AgentRole.EMAIL_MARKETING, docId: null, intent: 'EMAIL_ACTIVATE' };

    if (['ppc module', 'campaign builder', 'keyword bid', 'google ads', 'ad copy generator'].some(k => s.includes(k)))
      return { role: AgentRole.PPC, docId: null, intent: 'PPC_ACTIVATE' };

    if (['online advertising', 'display advertising', 'social media ads', 'programmatic'].some(k => s.includes(k)))
      return { role: AgentRole.ONLINE_ADS, docId: null, intent: 'ADS_ACTIVATE' };

    // Flux Neural Mesh Specifics
    if (['insight agent', 'bigquery', 'data aggregation'].some(k => s.includes(k)))
      return { role: AgentRole.INSIGHT, docId: null, intent: 'FLUX_INSIGHT_INIT' };

    if (['decisioning agent', 'budget allocation', 'channel optimization'].some(k => s.includes(k)))
      return { role: AgentRole.DECISIONING, docId: null, intent: 'FLUX_DECISIONING_INIT' };

    if (['content agent', 'veo', 'imagen', 'asset generation'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT, docId: null, intent: 'FLUX_CONTENT_INIT' };

    if (['audience agent', 'segmentation', 'behavioral insights'].some(k => s.includes(k)))
      return { role: AgentRole.AUDIENCE, docId: null, intent: 'FLUX_AUDIENCE_INIT' };

    if (['co-marketer agent', 'a/b testing', 'ad set optimization'].some(k => s.includes(k)))
      return { role: AgentRole.CO_MARKETER, docId: null, intent: 'FLUX_COMARKETER_INIT' };

    if (['shopping agent', 'e-commerce interaction', 'personalized offers'].some(k => s.includes(k)))
      return { role: AgentRole.SHOPPING, docId: null, intent: 'FLUX_SHOPPING_INIT' };

    if (['flux neural mesh', 'neural synchronization', 'workflow orchestration'].some(k => s.includes(k)))
      return { role: AgentRole.ORCHESTRATOR, docId: null, intent: 'FLUX_MESH_ACTIVATE' };

    if (['re-initialize', 're-init', 'reset mesh'].some(k => s.includes(k)))
      return { role: AgentRole.ORCHESTRATOR, docId: null, intent: 'FLUX_MESH_REINIT' };

    if (['generate report', 'audit report', 'marketing report', 'pdf report'].some(k => s.includes(k)))
      return { role: AgentRole.AUDIT, docId: null, intent: 'FLUX_REPORT_GENERATE' };

    if (['export config', 'workspace config', 'export workspace'].some(k => s.includes(k)))
      return { role: AgentRole.ORCHESTRATOR, docId: null, intent: 'FLUX_EXPORT_CONFIG' };
    
    if (['schedule event', 'create calendar', 'add task to calendar', 'marketing schedule'].some(k => s.includes(k)))
      return { role: AgentRole.CALENDAR, docId: null, intent: 'CALENDAR_EVENT_CREATE' };

    if (['trend to task', 'identify opportunity', 'marketing assistant'].some(k => s.includes(k)))
      return { role: AgentRole.INTELLIGENCE, docId: null, intent: 'INTEL_TREND_TASK' };

    if (['train model', 'fine-tune', 'learning rate', 'epochs', 'tuning lab'].some(k => s.includes(k)))
      return { role: AgentRole.TRAINING, docId: null, intent: 'TRAINING_EXECUTE' };

    if (['activate content lab', 'initialize copy engine', 'activate storybrand'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'CONTENT_LAB_ACTIVATE' };

    if (['generate_sales_page', 'sales page', 'full sales page', 'long-form sales'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'SALES_PAGE_GEN' };

    if (['generate_email_sequence', 'email sequence', 'nurture sequence', 'launch sequence'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'EMAIL_SEQ_GEN' };

    if (['generate_ad_copy', 'ad variants', 'facebook ad', 'linkedin ad'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'AD_COPY_GEN' };

    if (['rewrite_copy', 'tone transformation', 'rewrite text'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'REWRITE_COPY' };

    if (['deconstruct_competitor', 'competitor audit', 'copy audit'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'COMPETITOR_DECON' };

    if (['generate_variants', 'a/b test alternatives', 'copy variants'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'VARIANTS_GEN' };

    if (['audit_voice', 'voice consistency', 'brand voice check'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'VOICE_AUDIT' };

    if (['narrative engineering', 'hero journey', 'brand mythology', 'plot twist'].some(k => s.includes(k)))
      return { role: AgentRole.NARRATIVE, docId: null, intent: 'NARRATIVE_ENG_INIT' };

    if (['psychology trigger', 'trigger matrix', 'fomo', 'scarcity', 'authority'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'PSYCH_TRIGGER_MAP' };

    if (['voice dna', 'brand voice', 'personality traits', 'formality'].some(k => s.includes(k)))
      return { role: AgentRole.CONTENT_LAB, docId: null, intent: 'VOICE_DNA_PROFILE' };

    if (['design system', 'ui kit', 'web design', 'ux strategy', 'style guide', 'component library'].some(k => s.includes(k)))
      return { role: AgentRole.DESIGN_ENGINEER, docId: null, intent: 'DESIGN_SYSTEM_GEN' };

    if (['requirements engineer', 'user stories', 'prd', 'tech spec', 'architecture doc'].some(k => s.includes(k)))
      return { role: AgentRole.DESIGN_ENGINEER, docId: null, intent: 'REQUIREMENTS_GEN' };

    if (['assemble page', 'page template', 'template assembler', 'layout assembly'].some(k => s.includes(k)))
      return { role: AgentRole.DESIGN_ENGINEER, docId: null, intent: 'PAGE_ASSEMBLER' };

    if (['backend generator', 'api routes', 'auth setup', 'database schema'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'BACKEND_INFRA_GEN' };

    if (['performance audit', 'web vitals', 'lighthouse', 'latency', 'speed optimization'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'PERFORMANCE_AUDIT' };

    if (['portfolio', 'simple site', 'basic landing page'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'CODE_GEN_FREE' };

    if (['saas landing', 'analytics integration', 'framer motion'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'CODE_GEN_PRO' };

    if (['ecommerce', 'stripe platform', 'shopify api', 'admin dashboard'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'CODE_GEN_ENTERPRISE' };

    if (['code generation', 'custom components', 'deploy code', 'react generation', 'frontend pipeline'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'CODE_GEN_PIPELINE' };

    if (['edge deploy', 'caching strategy', 'infrastructure', 'serverless'].some(k => s.includes(k)))
      return { role: AgentRole.DEVOPS, docId: null, intent: 'EDGE_DEPLOY_STRATEGY' };

    if (['upload dataset', 'add data', 'import corpus'].some(k => s.includes(k)))
      return { role: AgentRole.TRAINING, docId: null, intent: 'TRAINING_UPLOAD' };

    if (['delete dataset', 'remove corpus'].some(k => s.includes(k)))
      return { role: AgentRole.TRAINING, docId: null, intent: 'TRAINING_DELETE' };

    if (['activate all systems', 'digital marketing workspace', 'cross-module data sync', 'integration layer'].some(k => s.includes(k)))
      return { role: AgentRole.ORCHESTRATOR, docId: null, intent: 'GLOBAL_MARKETING_INIT' };

    // Legacy Routing for existing features
    if (['lesson', 'quiz', 'progress', 'unlock'].some(keyword => s.includes(keyword))) 
      return { role: AgentRole.ACADEMY, docId: null, intent: 'ACADEMY_TRAINING' };
    if (['reward', 'badge', 'streak', 'points'].some(keyword => s.includes(keyword))) 
      return { role: AgentRole.LOYALTY_HUB, docId: null, intent: 'LOYALTY_UPDATE' };
    if (['community', 'challenge', 'leaderboard', 'collab'].some(keyword => s.includes(keyword))) 
      return { role: AgentRole.COMMUNITY, docId: null, intent: 'COMMUNITY_INTERACTION' };
    if (['revenue', 'scale', '$100k', 'growth'].some(keyword => s.includes(keyword))) 
      return { role: AgentRole.SCALING, docId: null, intent: 'SCALING_STRATEGY' };

    return { role: AgentRole.LEGAL_CONTACT, docId: null, intent: 'GENERAL_INQUIRY' };
  }

  private mapTier(tier: string): string {
    return tier.toUpperCase();
  }

  async processAction(action: string, metadata: any = {}): Promise<AgentHandoff[]> {
    const logs: AgentHandoff[] = [];
    const now = new Date();
    const timestamp = now.toISOString();

    // Check for stalled status (mock: if last activity was > 48h ago)
    const lastTime = new Date(this.state.lastActivity).getTime();
    const isStalled = (now.getTime() - lastTime) > (48 * 60 * 60 * 1000);
    this.state.lastActivity = timestamp;
    
    const s = action.toLowerCase();
    
    // AI-Powered Routing with local fallback
    let routing;
    try {
      routing = await GeminiService.getInstance().classifyIntent(action);
    } catch (e) {
      routing = this.routeSignal(action);
    }
    
    const targetAgent = routing.role as AgentRole;
    // Use real user role from AuthService if available
    const activeUser = (await import('./authService')).authService.getUser();
    const userRole = activeUser?.role || metadata.userRole || 'USER';

    // Role-based Access Control (RBAC) for Agents
    const sensitiveAgents = [AgentRole.COMPLIANCE, AgentRole.INCIDENT, AgentRole.CONTRACT, AgentRole.LEGAL_CONTACT, AgentRole.AUDIT];
    if (sensitiveAgents.includes(targetAgent) && userRole === 'USER') {
      const securityHandoff: AgentHandoff = {
        source: AgentRole.SYSTEM,
        target: AgentRole.OUTPUT,
        payload: {
          from: "SystemAgent",
          to: "OutputAgent",
          error: "PERMISSION_DENIED",
          message: "ACCESS_REVOKED: This operation requires LegalCounsel or Admin clearance. Please escalate via LegalHub."
        },
        timestamp
      };
      return [securityHandoff];
    }
    const userTier = this.mapTier(this.state.tier);
    this.state.mappedTier = userTier;
    const multiplier = userTier === 'EXPERT' ? 4 : userTier === 'ADVANCED' ? 3 : userTier === 'INTERMEDIATE' ? 2 : 1;

    // Generate specific task ID based on intent if it matches the pattern
    let taskId: string = crypto.randomUUID();
    if (routing.intent === 'ACHIEVEMENT_PROGRESS') taskId = `ach-progress-${taskId.split('-')[0]}`;
    if (routing.intent === 'CLAIM_REWARD') taskId = `ach-claim-${taskId.split('-')[0]}`;
    if (routing.intent === 'LEADERBOARD_REFRESH') taskId = `ach-leaderboard-${taskId.split('-')[0]}`;
    if (routing.intent === 'ACADEMY_BROWSE') taskId = `acad-browse-${taskId.split('-')[0]}`;
    if (routing.intent === 'ACADEMY_LESSON') taskId = `acad-lesson-${taskId.split('-')[0]}`;
    if (routing.intent === 'ACADEMY_ASSESS') taskId = `acad-assess-${taskId.split('-')[0]}`;
    if (routing.intent === 'ACADEMY_CERTIFICATE') taskId = `acad-cert-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMMUNITY_THREAD') taskId = `comm-thread-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMMUNITY_TOPIC') taskId = `comm-topic-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMMUNITY_MATCH') taskId = `comm-match-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMMUNITY_EVENT') taskId = `comm-event-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMMUNITY_REFERRAL') taskId = `comm-ref-${taskId.split('-')[0]}`;
    if (routing.intent === 'GROUNDING_SYNC') taskId = `grnd-sync-${taskId.split('-')[0]}`;
    if (routing.intent === 'AB_SYNTHESIS') taskId = `ab-sync-${taskId.split('-')[0]}`;
    if (routing.intent === 'AB_AUDIT') taskId = `ab-audit-${taskId.split('-')[0]}`;
    if (routing.intent === 'MEDIA_STUDIO_ACTIVATE') taskId = `media-init-${taskId.split('-')[0]}`;
    if (routing.intent === 'MEDIA_EXPORT') taskId = `media-export-${taskId.split('-')[0]}`;
    if (routing.intent === 'MEDIA_SAFETY_CHECK') taskId = `media-safety-${taskId.split('-')[0]}`;
    if (routing.intent === 'LEGAL_TERMS') taskId = `legal-terms-${taskId.split('-')[0]}`;
    if (routing.intent === 'LEGAL_PRIVACY') taskId = `legal-privacy-${taskId.split('-')[0]}`;
    if (routing.intent === 'LEGAL_CONTRACT_GEN') taskId = `legal-contract-${taskId.split('-')[0]}`;
    if (routing.intent === 'LEGAL_COMPLIANCE_CHECK') taskId = `legal-compliance-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_TRIGGER') taskId = `sys-trigger-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_SYNC') taskId = `sys-sync-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_METRICS') taskId = `sys-metrics-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_TOGGLE_HIM') taskId = `sys-toggle-him-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_TOGGLE_IH') taskId = `sys-toggle-ih-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_TOGGLE_HS') taskId = `sys-toggle-hs-${taskId.split('-')[0]}`;
    if (routing.intent === 'SYS_TOGGLE_PS') taskId = `sys-toggle-ps-${taskId.split('-')[0]}`;
    if (routing.intent === 'SEO_ACTIVATE') taskId = `seo-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'ECOMMERCE_ACTIVATE') taskId = `ecom-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'CONTENT_ACTIVATE') taskId = `cont-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'EMAIL_ACTIVATE') taskId = `mail-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'PPC_ACTIVATE') taskId = `ppc-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'ADS_ACTIVATE') taskId = `ads-act-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_INSIGHT_INIT') taskId = `flux-in-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_DECISIONING_INIT') taskId = `flux-dc-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_CONTENT_INIT') taskId = `flux-ct-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_AUDIENCE_INIT') taskId = `flux-au-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_COMARKETER_INIT') taskId = `flux-cm-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_SHOPPING_INIT') taskId = `flux-sh-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_MESH_ACTIVATE') taskId = `flux-mesh-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_MESH_REINIT') taskId = `flux-reinit-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_REPORT_GENERATE') taskId = `flux-rep-${taskId.split('-')[0]}`;
    if (routing.intent === 'FLUX_EXPORT_CONFIG') taskId = `flux-exp-${taskId.split('-')[0]}`;
    if (routing.intent === 'CALENDAR_EVENT_CREATE') taskId = `cal-evt-${taskId.split('-')[0]}`;
    if (routing.intent === 'INTEL_TREND_TASK') taskId = `intel-tt-${taskId.split('-')[0]}`;
    if (routing.intent === 'CONTENT_LAB_ACTIVATE') taskId = `flux-content-${taskId.split('-')[0]}`;
    if (routing.intent === 'SALES_PAGE_GEN') taskId = `sales-gen-${taskId.split('-')[0]}`;
    if (routing.intent === 'EMAIL_SEQ_GEN') taskId = `email-gen-${taskId.split('-')[0]}`;
    if (routing.intent === 'AD_COPY_GEN') taskId = `ad-gen-${taskId.split('-')[0]}`;
    if (routing.intent === 'REWRITE_COPY') taskId = `rewrite-${taskId.split('-')[0]}`;
    if (routing.intent === 'COMPETITOR_DECON') taskId = `competitor-${taskId.split('-')[0]}`;
    if (routing.intent === 'VARIANTS_GEN') taskId = `variants-${taskId.split('-')[0]}`;
    if (routing.intent === 'VOICE_AUDIT') taskId = `voice-audit-${taskId.split('-')[0]}`;
    if (routing.intent === 'NARRATIVE_ENG_INIT') taskId = `flux-narr-${taskId.split('-')[0]}`;
    if (routing.intent === 'PSYCH_TRIGGER_MAP') taskId = `flux-psych-${taskId.split('-')[0]}`;
    if (routing.intent === 'VOICE_DNA_PROFILE') taskId = `flux-voice-${taskId.split('-')[0]}`;
    if (routing.intent === 'DESIGN_SYSTEM_GEN') taskId = `design-sys-${taskId.split('-')[0]}`;
    if (routing.intent === 'CODE_GEN_FREE') taskId = `code-free-${taskId.split('-')[0]}`;
    if (routing.intent === 'CODE_GEN_PRO') taskId = `code-pro-${taskId.split('-')[0]}`;
    if (routing.intent === 'CODE_GEN_ENTERPRISE') taskId = `code-ent-${taskId.split('-')[0]}`;
    if (routing.intent === 'REQUIREMENTS_GEN') taskId = `reqs-eng-${taskId.split('-')[0]}`;
    if (routing.intent === 'PAGE_ASSEMBLER') taskId = `page-asm-${taskId.split('-')[0]}`;
    if (routing.intent === 'BACKEND_INFRA_GEN') taskId = `back-gen-${taskId.split('-')[0]}`;
    if (routing.intent === 'PERFORMANCE_AUDIT') taskId = `perf-audit-${taskId.split('-')[0]}`;
    if (routing.intent === 'CODE_GEN_PIPELINE') taskId = `code-gen-${taskId.split('-')[0]}`;
    if (routing.intent === 'EDGE_DEPLOY_STRATEGY') taskId = `edge-dep-${taskId.split('-')[0]}`;
    if (routing.intent === 'TRAINING_EXECUTE') taskId = `train-exec-${taskId.split('-')[0]}`;
    if (routing.intent === 'TRAINING_UPLOAD') taskId = `train-up-${taskId.split('-')[0]}`;
    if (routing.intent === 'TRAINING_DELETE') taskId = `train-del-${taskId.split('-')[0]}`;
    if (routing.intent === 'GLOBAL_MARKETING_INIT') taskId = `global-init-${taskId.split('-')[0]}`;

    // 1. Orchestrator Handoff
    const orchestratorHandoff: AgentHandoff = {
      source: AgentRole.ORCHESTRATOR,
      target: targetAgent,
      payload: {
        from: "OrchestratorAgent",
        to: targetAgent,
        cc: "AuditAgent",
        context: {
          session_id: taskId,
          task_id: taskId,
          client_type: userTier === 'EXPERT' ? 'HIGH_VOLUME_MERCHANT' : userTier === 'ADVANCED' ? 'ENTERPRISE' : 'STANDARD',
          jurisdiction: metadata.jurisdiction || "US-CA",
          authenticated: true,
          doc_target: routing.docId,
          intent: routing.intent,
          raw_signal: action
        },
        priority: metadata.priority || (routing.intent === 'INCIDENT_RESPONSE' ? "CRITICAL" : "NORMAL")
      },
      timestamp
    };
    logs.push(orchestratorHandoff);

    await new Promise(r => setTimeout(r, 600));

    // 2. Downstream Agent Processing (Academy, Community, Scaling, or Compliance)
    let xpDelta = 0;
    let academyHandoff: AgentHandoff | null = null;
    let communityHandoff: AgentHandoff | null = null;
    let scalingHandoff: AgentHandoff | null = null;
    let complianceHandoff: AgentHandoff | null = null;

    if (targetAgent === AgentRole.COMPLIANCE || targetAgent === AgentRole.INCIDENT) {
      const docId = routing.docId || action.match(/DOC_\d+/)?.[0];
      const jurisdiction = metadata.jurisdiction || "US-CA";
      
      const prepareResult = (id: string) => {
        const doc = COMPLIANCE_REGISTRY[id] || COMPLIANCE_REGISTRY['DOC_01'];
        return {
          doc_id: doc.id,
          policy_name: doc.title,
          standard: doc.standard,
          jurisdiction_note: jurisdiction === 'EU-GDPR' || jurisdiction === 'US-CA' ? `Addendum: Checked against ${jurisdiction} requirements.` : null,
          policy_text: doc.statement,
          status: doc.status,
          last_reviewed: doc.lastReviewed
        };
      };

      const complianceResults = [];
      if (!docId && targetAgent === AgentRole.COMPLIANCE) {
        // Return all DOC_01 to DOC_04 if null or ambiguous
        ['DOC_01', 'DOC_02', 'DOC_03', 'DOC_04'].forEach(id => {
          complianceResults.push(prepareResult(id));
        });
      } else if (docId) {
        const doc = COMPLIANCE_REGISTRY[docId];
        if (doc && doc.status === 'UNDER_REVIEW') {
           // Do not deliver stale versions
           complianceResults.push({
              doc_id: docId,
              policy_name: doc.title,
              status: 'UNDER_REVIEW',
              policy_text: "ERROR: This policy is currently UNDER_REVIEW and cannot be delivered by ComplianceAgent. Please consult LegalContactAgent for the current interim authority."
           });
        } else {
           complianceResults.push(prepareResult(docId));
        }
      }
      
      const sourceAgent = targetAgent;
      let incidentResult = null;

      if (targetAgent === AgentRole.INCIDENT) {
        const severity = s.includes('breach') || s.includes('hack') ? 'P1' : 'P2';
        const incidentId = crypto.randomUUID();
        const deadline = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
        
        incidentResult = {
          incident_id: incidentId,
          severity,
          current_phase: "1",
          phase_label: "Detection & Triage",
          next_actions: ["Confirm breach signal", "Isolate affected systems", "Preserve forensic evidence"],
          notification_deadline: deadline,
          legal_escalated: true
        };
      }

      complianceHandoff = {
        source: sourceAgent,
        target: AgentRole.OUTPUT,
        payload: {
          from: sourceAgent,
          to: "OutputAgent",
          cc: ["AuditAgent", AgentRole.LEGAL_CONTACT],
          compliance_result: complianceResults.length === 1 ? complianceResults[0] : (complianceResults.length > 0 ? complianceResults : null),
          incident_result: incidentResult,
          // Legacy fields for backward compatibility with UI if needed
          legal_content: complianceResults.map(r => r.policy_text).join('\n\n'),
          doc_title: complianceResults.length === 1 ? complianceResults[0].policy_name : (targetAgent === AgentRole.INCIDENT ? "Incident Response Protocol" : "Consolidated Legal Repository"),
          verbatim: true
        },
        timestamp: new Date().toISOString()
      };
      logs.push(complianceHandoff);

      if (targetAgent === AgentRole.INCIDENT) {
          // Parallel co-trigger for LegalContactAgent
          logs.push({
              source: AgentRole.INCIDENT,
              target: AgentRole.LEGAL_CONTACT,
              payload: {
                  from: "IncidentAgent",
                  to: "LegalContactAgent",
                  message: `INCIDENT_ESCALATION: ${incidentResult?.severity} severity breach detected. Legal counsel required for jurisdiction mapping.`,
                  incident_id: incidentResult?.incident_id
              },
              timestamp: new Date().toISOString()
          });
      }
      await new Promise(r => setTimeout(r, 400));
    } else if (targetAgent === AgentRole.CONTRACT) {
      const clientName = metadata.client_name || "Enterprise Client";
      const engagementType = metadata.engagement_type || "MSA";
      const specialTerms = metadata.special_terms || [];
      const scopeSummary = metadata.scope_summary || "Standard service provision as per merchant tier.";
      const estimatedValue = metadata.estimated_value || 50000;
      
      // Validation Check
      const missingFields = [];
      if (!metadata.client_name) missingFields.push('client_name');
      if (!metadata.scope_summary) missingFields.push('scope_summary');
      
      let requestId = crypto.randomUUID();
      let sla = 5;
      let complexity = 'LOW';

      if (missingFields.length > 0 && !action.includes('DOC_06')) {
        complianceHandoff = {
          source: AgentRole.CONTRACT,
          target: AgentRole.OUTPUT,
          payload: {
            from: "ContractAgent",
            to: "OutputAgent",
            error: "FIELD_MISSING",
            missing: missingFields,
            message: `Contract intake halted. Required fields missing: ${missingFields.join(', ')}.`
          },
          timestamp: new Date().toISOString()
        };
      } else {
        complexity = specialTerms.length > 2 ? 'HIGH' : specialTerms.length > 0 ? 'MEDIUM' : 'LOW';
        sla = complexity === 'HIGH' ? 15 : complexity === 'MEDIUM' ? 10 : 5;

        const contractRequest = {
          request_id: requestId,
          client_name: clientName,
          client_type: metadata.client_type || (userTier === 'EXPERT' ? 'HIGH_VOLUME_MERCHANT' : 'ENTERPRISE'),
          engagement_type: engagementType,
          jurisdiction: metadata.jurisdiction || "US-CA",
          scope_summary: scopeSummary,
          estimated_value: estimatedValue,
          complexity: complexity,
          sla_business_days: sla,
          special_terms: specialTerms
        };

        complianceHandoff = {
          source: AgentRole.CONTRACT,
          target: AgentRole.OUTPUT,
          payload: {
            from: "ContractAgent",
            to: "OutputAgent",
            cc: ["AuditAgent", "LegalContactAgent"],
            contract_request: contractRequest,
            message: `Contract intake brief generated for ${clientName}. Request ID: [${requestId}]. Committed SLA: ${sla} business days.`,
            verbatim: true
          },
          timestamp: new Date().toISOString()
        };
        
        // Route brief to LegalContactAgent
        logs.push({
          source: AgentRole.CONTRACT,
          target: AgentRole.LEGAL_CONTACT,
          payload: {
            from: "ContractAgent",
            to: "LegalContactAgent",
            operation: "INTAKE_BRIEF_ASSIGNMENT",
            context: contractRequest
          },
          timestamp: new Date().toISOString()
        });
      }
      
      logs.push(complianceHandoff);
      await new Promise(r => setTimeout(r, 400));
    } else if (targetAgent === AgentRole.LEGAL_CONTACT) {
      complianceHandoff = {
        source: AgentRole.LEGAL_CONTACT,
        target: AgentRole.OUTPUT,
        payload: {
          from: "LegalContactAgent",
          to: "OutputAgent",
          message: "Legal team notification protocol initiated. A merchant review will be co-triggered autonomously.",
          escalation_active: true
        },
        timestamp: new Date().toISOString()
      };
      logs.push(complianceHandoff);
      await new Promise(r => setTimeout(r, 400));
    } else if (targetAgent === AgentRole.ACADEMY) {
      const lessonId = metadata.lesson_id || "L-101";
      const isExpert = userTier === 'EXPERT';
      const lessonNum = parseInt(lessonId.split('-')[1]) || 1;
      
      const xpTable: Record<string, number> = {
        'BEGINNERS': 50,
        'INTERMEDIATE': 80,
        'ADVANCED': 120,
        'EXPERT': 200
      };
      
      const baseAcademyXp = xpTable[userTier] || 50;
      xpDelta = baseAcademyXp * multiplier;

      academyHandoff = {
        source: AgentRole.ACADEMY,
        target: AgentRole.LOYALTY_HUB,
        payload: {
          from: "AcademyAgent",
          to: "LoyaltyHubAgent",
          lesson_event: {
            lesson_id: lessonId,
            tier: userTier,
            status: "completed",
            xp_to_award: xpDelta,
            tier_complete: metadata.isLastLesson || false,
            co_trigger_community: isExpert && lessonNum >= 10
          }
        },
        timestamp: new Date().toISOString()
      };
      logs.push(academyHandoff);
      await new Promise(r => setTimeout(r, 400));
    } else if (targetAgent === AgentRole.COMMUNITY) {
      const isExpert = userTier === 'EXPERT';
      const intensityXp = isExpert ? 500 : (userTier === 'ADVANCED' ? 300 : 100);
      xpDelta = intensityXp * multiplier;

      communityHandoff = {
        source: AgentRole.COMMUNITY,
        target: AgentRole.LOYALTY_HUB,
        payload: {
          from: "CommunityAgent",
          to: "LoyaltyHubAgent",
          community_event: {
            event_type: "challenge",
            xp_delta: xpDelta,
            badge: isExpert ? "Mastermind Member" : "Sprint Winner",
            leaderboard_rank: 124,
            escalate_to_scaling: isExpert
          }
        },
        timestamp: new Date().toISOString()
      };
      logs.push(communityHandoff);
      await new Promise(r => setTimeout(r, 400));
    } else if (routing.intent === 'COMMUNITY_REFERRAL') {
      xpDelta = 500 * multiplier;
    } else if (targetAgent === AgentRole.SCALING) {
      const milestone = metadata.revenue || "$10k-$50k";
      
      scalingHandoff = {
        source: AgentRole.SCALING,
        target: AgentRole.OUTPUT,
        payload: {
          from: "ScalingAgent",
          to: "OutputAgent",
          scaling_response: {
            current_milestone: milestone,
            next_3_actions: [
              "Implement Cortex-driven ad copy for TOF traffic",
              "Optimize post-purchase upsell sequence (Phase 3)",
              "Audit high-AOV bundles via Scale Dashboard"
            ],
            phase: 3,
            badge: "Scaling Milestone: Phase 3 Complete",
            mastermind_trigger: true
          }
        },
        timestamp: new Date().toISOString()
      };
      logs.push(scalingHandoff);
      await new Promise(r => setTimeout(r, 400));
    } else if (routing.intent === 'LEADERBOARD_REFRESH') {
      communityHandoff = {
        source: AgentRole.COMMUNITY,
        target: AgentRole.LOYALTY_HUB,
        payload: {
          from: "CommunityAgent",
          to: "LoyaltyHubAgent",
          leaderboard_refresh: {
            status: "aggregated",
            logic: "Aggregate top performers across all sectors, rank by engagement score, stream updates",
            rankings: [
              { user: "isadewum", score: 14500, sector: "Growth" },
              { user: "apex_merchant", score: 12200, sector: "Scale" }
            ]
          }
        },
        timestamp: new Date().toISOString()
      };
      logs.push(communityHandoff);
      await new Promise(r => setTimeout(r, 400));
    }

    // 3. LoyaltyHubAgent Logic & Management
    let finalXpDelta = 0;
    if (targetAgent === AgentRole.ACADEMY) finalXpDelta = xpDelta;
    else if (targetAgent === AgentRole.COMMUNITY) finalXpDelta = xpDelta;
    else if (targetAgent === AgentRole.SCALING) finalXpDelta = 0; // Scaling is strategic, points come from tasks
    else if (routing.intent === 'ACHIEVEMENT_PROGRESS' || routing.intent === 'CLAIM_REWARD') finalXpDelta = 50 * multiplier;
    else finalXpDelta = (metadata.xp || 0) * multiplier;

    const oldTier = this.state.tier;
    this.state.points += finalXpDelta;
    
    const newTier = this.calculateTier(this.state.points);
    const tierUpgraded = newTier !== oldTier;
    this.state.tier = newTier;
    this.state.mappedTier = newTier.toUpperCase();

    // Detect badge eligibility
    let badgeName = null;
    if (action.includes('Assessment')) badgeName = 'Neural Scholar';
    if (action.includes('Expert')) badgeName = 'Technical Elite';
    if (academyHandoff?.payload.lesson_event.tier_complete) badgeName = `${userTier} Graduate`;
    if (communityHandoff?.payload.community_event.badge) badgeName = communityHandoff.payload.community_event.badge;
    if (scalingHandoff?.payload.scaling_response.badge) badgeName = scalingHandoff.payload.scaling_response.badge;
    
    if (badgeName && !this.state.badges.includes(badgeName)) {
      this.state.badges.push(badgeName);
    }

    const hubHandoff: AgentHandoff = {
      source: AgentRole.LOYALTY_HUB,
      target: AgentRole.OUTPUT,
      payload: {
        from: "LoyaltyHubAgent",
        to: "OutputAgent",
        reward_update: {
          xp_awarded: finalXpDelta,
          new_total_xp: this.state.points,
          badge_unlocked: badgeName,
          tier_upgraded: tierUpgraded,
          new_tier: tierUpgraded ? newTier : null,
          nudge_message: isStalled ? "Strategic momentum detected. Resume scaling operations to avoid cooldown." : null
        },
        forward_to_academy: action.includes('Assessment') || action.includes('Course')
      },
      timestamp: new Date().toISOString()
    };
    logs.push(hubHandoff);

    await new Promise(r => setTimeout(r, 400));

    // 4. Final Output Agent Confirmation (Synthesis)
    const synthesis = async () => {
      try {
        // Find the most relevant handoff for synthesis
        const mainHandoff = logs.find(l => l.target === AgentRole.OUTPUT) || orchestratorHandoff;
        return await GeminiService.getInstance().synthesizeResponse(targetAgent, mainHandoff.payload);
      } catch (e) {
        console.warn("AI synthesis failed, using local templates", e);
        // Fallback to local synthesis (existing logic)
        let hook = "Operation successfully logged.";
        if (targetAgent === AgentRole.ACADEMY) hook = "Strategic lesson verified.";
        if (targetAgent === AgentRole.COMMUNITY) hook = "Community engagement signal processed.";
        if (targetAgent === AgentRole.SCALING) hook = "Revenue scaling trajectory updated.";
        if (targetAgent === AgentRole.COMPLIANCE) hook = "Compliance standards retrieved from canonical registry.";
        if (targetAgent === AgentRole.INCIDENT) hook = "Incident response protocol activated.";
        if (targetAgent === AgentRole.CONTRACT) hook = "Contractual repository query complete.";
        if (targetAgent === AgentRole.LEGAL_CONTACT) hook = "Legal contact sequence co-triggered.";

        if (routing.intent === 'LEADERBOARD_REFRESH' && communityHandoff) {
           return `## 🏆 [LEADERBOARD_REFRESH] — Protocol Synchronized
**Task ID:** \`${orchestratorHandoff.payload.context.task_id}\`  
**Status:** success | streaming active

### 📊 Global Rankings (Top 5)
1. **isadewum** | 14,500 XP | *Growth Sector*
2. **apex_merchant** | 12,200 XP | *Scale Sector*
3. **vortex_dev** | 11,800 XP | *Tech Sector*
4. **neural_node** | 10,500 XP | *Intelligence Sector*
5. **flux_pioneer** | 9,800 XP | *Strategy Sector*

**Your Position:** #124 globally. Keep scaling to unlock "Elite Orchestrator" tier.`;
        }
        
        if (routing.intent === 'ACHIEVEMENT_PROGRESS') {
           // A2A Cascade Simulation
           logs.push({
             timestamp: new Date().toISOString(),
             source: AgentRole.ACHIEVEMENTS,
             target: AgentRole.LEDGER,
             payload: { operation: 'badge_mint', status: 'COMMITTED' }
           });

           return this.formatOutput(
             'ACHIEVEMENTS',
             'Progress Query',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Current Level:** 12 (Advanced Orchestrator)
- **Total Points:** ${this.state.points.toLocaleString()} XP
- **Next Milestone:** Level 13 (Elite Status) — 50,000 XP Required

#### 🎖️ Earned Badges
- **Mesh Captain:** Level 2 (12/15 handoffs)
- **Privacy Architect:** Level 1 (Initial Data Export)
- **Scaling Expert:** Level 4 (Hyper-Growth Trigger)`,
             [
               "Attend Advanced Webinar: Unlock the 'Cortex Master' badge.",
               "Collaborate in Mesh: Initiate 3 A2A syncs in the Community Tab."
             ],
             { uptime: '99.98%', efficiency: '0.97' }
           );
        }

        if (routing.intent === 'CLAIM_REWARD') {
           const label = action.includes(':') ? action.split(':')[1].trim() : 'Premium Asset';
           return this.formatOutput(
             'LOYALTY',
             'Reward Minting',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Asset:** "${label}"
- **Type:** Immutable Protocol Asset
- **Ledger ID:** \`audit-${crypto.randomUUID().split('-')[0]}\`
- **Status:** MINT_SUCCESS

**Success:** Reward verified via ledger. Your profile has been updated.`,
             [
               "View your new asset in the Achievement Vault.",
               "Share your progress on the Community Leaderboard."
             ]
           );
        }

        if (routing.intent === 'ACADEMY_BROWSE') {
           return this.formatOutput(
             'ACADEMY',
             'Course Catalog Browse',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Filtering Tier:** ${this.state.tier}
- **Recommended Learning Paths:**
  1. **Advanced Liquid Mastery** — Build high-performance Shopify sections.
  2. **Cortex Integration 101** — AI-powered market intelligence.
  3. **Omni-Channel Operations** — Scaling from one store to many.`,
             [
               "Select a path to initialize the lesson module.",
               "Complete a quiz to earn the 'Neural Scholar' badge."
             ]
           );
        }

        if (routing.intent === 'ACADEMY_LESSON') {
           const label = s.includes('initialize module') ? 'Module Initialization' : (action.includes(':') ? action.split(':')[1].trim() : 'Digital Marketing Mastery');
           return this.formatOutput(
             'ACADEMY',
             'Lesson Initialization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** "${label}"
- **Level:** ${metadata.lesson_level || 'Intermediate'}
- **Curriculum:** Omni-Channel Synchronization
- **Grounding:** Verified industry data (2025-2026 search trends)
- **Status:** TRACKER_INITIALIZED`,
             [
               "Complete the lesson module to trigger mesh sync.",
               "Take the adaptive assessment to verify learning."
             ]
           );
        }

        if (routing.intent === 'ACADEMY_ASSESS') {
           return this.formatOutput(
             'ACADEMY',
             'Adaptive Assessment',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Complexity:** Adaptive (matched to ${this.state.tier} level)
- **Topics:** Shopify Dev, AI Strategy, Scaling Logic
- **Grading:** Real-time feedback enabled (A2A-mesh grading).
- **Current Status:** Nodes 1-4 are verifying responses... Status: PASS.`,
             [
               "Wait for final ledger sync to confirm grade.",
               "Return to learning path for next module."
             ]
           );
        }

        if (routing.intent === 'ACADEMY_CERTIFICATE') {
           return this.formatOutput(
             'ACADEMY',
             'Credential Minting',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Grantee:** ${metadata.user_id || 'isadewum'}
- **Course:** Full-Stack Agency Orchestrator
- **Ledger ID:** \`cert-${crypto.randomUUID().split('-')[0]}\`
- **Verification:** On-chain verifiable credential active.`,
             [
               "Download your certificate in PDF format.",
               "Share your credential on LinkedIn via the Academy Hub."
             ]
           );
        }

        if (routing.intent === 'COMMUNITY_THREAD') {
           const label = action.includes(':') ? action.split(':')[1].trim() : 'Predictive scaling for Gen-Alpha markets';
           return this.formatOutput(
             'COMMUNITY',
             'Discussion Hub',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Context:** "${label}"
- **Top Contributor:** @apex_merchant (Expert Tier)
- **Active Users:** 42 synchronized
- **Engagement Signal:** Community sentiment shifting toward decentralized ad-nodes.`,
             [
               "Contribute to discussion to earn 1.5x XP.",
               "Mention a collaborator to trigger A2A pulse."
             ]
           );
        }

        if (routing.intent === 'COMMUNITY_TOPIC') {
           return this.formatOutput(
             'COMMUNITY',
             'Topic Generation',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Suggested Angle:** "The Ethics of Autonomous Arbitrage"
- **Interest Alignment:** 94% (matches recent scaling activity)
- **Search Latency:** Low (High SEO opportunity)
- **Initial Reach:** Estimated 2.4k users.`,
             [
               "Publish topic to initiate engagement cascade.",
               "Tag #Scalability to increase mesh visibility."
             ]
           );
        }

        if (routing.intent === 'COMMUNITY_MATCH') {
           const label = action.includes(':') ? action.split(':')[1].trim() : 'Expert Collaboration';
           return this.formatOutput(
             'COMMUNITY',
             'Collaboration Bridge',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Target:** "${label}"
- **Matching Algorithm:** ${metadata.match_algorithm || 'skill_complementarity'}
- **High-Fidelity Matches:**
  1. @liquid_ninja (98% Match)
  2. @vortex_dev (92% Match)
  3. @scale_master (89% Match)
- **Active Projects:** Neural Nexus v2, Flux Global SDK`,
             [
               "Initiate Bridge to connect with partners.",
               "Review specific skill needs in the Project Hub."
             ]
           );
        }

        if (routing.intent === 'COMMUNITY_EVENT') {
           return this.formatOutput(
             'COMMUNITY',
             'Event Registration',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Event:** "Flux Global Summit 2026"
- **Access Level:** VIP (Verified Orchestrator)
- **Calendar Bridge:** Triggered (Google/Outlook)
- **Reminder Sequence:** Set for T-24h.`,
             [
               "Download event itinerary from the Dashboard.",
               "Join the pre-event networking thread."
             ]
           );
        }

        if (routing.intent === 'COMMUNITY_REFERRAL') {
           return this.formatOutput(
             'COMMUNITY',
             'Referral Protocol',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Referral Status:** Link Generated
- **Invite Credit:** $500 Cash Credit (Pending Activation)
- **Tracking:** Real-time referral node synchronized
- **Reward Status:** Awaiting successful merchant integration`,
             [
               "Share your unique invite link with other brands.",
               "Monitor your 'Personal Info' for referral payout status."
             ],
             { uptime: '99.99%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'GROUNDING_SYNC') {
           const label = action.includes(':') ? action.split(':')[1].trim() : (s.includes('market') ? 'Market Intelligence' : (s.includes('competitor') ? 'Competitor Intelligence' : 'Trend Analysis'));
           return this.formatOutput(
             'GROUNDING',
             'Intelligence Orchestration',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Engine:** Orchestrator 1.0 (Live)
- **Focus:** "${label}"
- **Method:** Neural Grounding via Google Search API
- **Data Freshness:** Real-time (2026-04-29)
- **Signals Detected:** 14 High-fidelity market shifts`,
             [
               "Apply intelligence feed to A/B Training Pipeline.",
               "Monitor Crisis Monitoring node for sentiment shifts."
             ],
             { uptime: '99.998%', efficiency: '1.0', ledgerStatus: 'SYNCED' }
           );
        }

        if (routing.intent === 'AB_SYNTHESIS') {
           return this.formatOutput(
             'BAYESIAN',
             'Neural Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Model:** Bayesian-V4 Active
- **Inference Type:** Dynamic SVI (Stochastic Variational Inference)
- **Variant Generation:** High-fidelity synthesis active
- **Significance Threshold:** p > 0.95
- **Optimization Goal:** Conversion Maximum`,
             [
               "Deploy variant to Meta Ads via A2A Bridge.",
               "Perform Bayesian audit for credible interval verification."
             ],
             { uptime: '100%', efficiency: '0.999' }
           );
        }

        if (routing.intent === 'AB_AUDIT') {
           return this.formatOutput(
             'AUDIT',
             'Experiment Validation',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Audit Context:** A/B Training Pipeline
- **Validation:** SRM (Sample Ratio Mismatch) Check PASSED
- **Credible Interval:** [12.4%, 28.9%] Verified
- **Statistical Power:** 0.98
- **Ledger ID:** \`audit-${crypto.randomUUID().split('-')[0]}\``,
             [
               "Download verified audit trail for governance.",
               "Reconcile Bayesian results with manual ledger."
             ],
             { uptime: '99.99%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'MEDIA_STUDIO_ACTIVATE') {
           const isCinematic = action.includes('[00:00') || action.includes('cinematography');
           return this.formatOutput(
             'MEDIA',
             isCinematic ? 'High-Fidelity Cinematic Synthesis' : 'Video Engine Initialization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             isCinematic 
               ? `- **Engine:** Veo (Gen-2) | Cinematic Pipeline
- **Segments Detected:** 4 Paced Intervals
- **Resolution:** 4K (Upscaled)
- **Status:** SYNTHESIZING_MULTI_SHOT_SEQUENCE
- **A/B Variants:** 3 Alternatives generated
- **Brand Guard:** Commercial Integrity v4.2 CHECKING`
               : `- **Engine:** Veo (Gen-2) Active
- **Pipeline:** Text-to-Video / Image-to-Video
- **Controls:** Camera Presets / Aspect Ratio / Selective Motion
- **Status:** INITIALIZED_AND_AWAITING_PROMPT
- **Vibe:** Cinematic Marketing Suite`,
             [
               isCinematic ? "Apply 'Golden Hour' post-processing filter." : "Execute Section 3 prompted sequence for cinematic output.",
               isCinematic ? "Export A/B variants for performance testing." : "Toggle 'JSON Mode' for structured asset metadata."
             ],
             { uptime: '99.95%', efficiency: isCinematic ? '0.99' : '0.96' }
           );
        }

        if (routing.intent === 'MEDIA_EXPORT') {
           return this.formatOutput(
             'MEDIA',
             'Multi-Platform Export',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Target Distribution:** ${metadata.platform || 'Google Ads / YouTube'}
- **Resolution:** 4K (Upscaled)
- **Format:** MP4 (H.264 High Profile)
- **Metadata:** SEO tags and Captions injected
- **Status:** EXPORT_COMPLETE`,
             [
               "Review campaign performance in Ads Manager.",
               "Store static frame extractions in Archive."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'MEDIA_SAFETY_CHECK') {
           return this.formatOutput(
             'COMPLIANCE',
             'Content Safety Audit',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Audit Type:** Safety & Policy Review
- **Content Type:** AI-Generated Video
- **Filters:** Copyright, Toxicity, Brand Integrity
- **Verdict:** PASSED
- **Policy Standard:** Google Advertising Policy V4.2`,
             [
               "Apply brand watermark for final sign-off.",
               "Log safety certificate to immutable ledger."
             ],
             { uptime: '99.99%', efficiency: '0.999' }
           );
        }

        if (routing.intent === 'LEGAL_TERMS') {
           return this.formatOutput(
             'COMPLIANCE',
             'Terms Analysis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Context:** Terms of Service Summary
- **Key Clauses:**
  1. Standard agency orchestration permissions.
  2. IP Rights: User-owned under "Expert" license.
  3. Liability: Capped at monthly retainer value.`,
             [
               "View full text in the Compliance Vault.",
               "Request a custom legal consultation."
             ]
           );
        }

        if (routing.intent === 'LEGAL_PRIVACY') {
           return this.formatOutput(
             'COMPLIANCE',
             'Privacy Inventory',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **GDPR Status:** Compliant
- **PII Storage:** Encrypted at rest (AES-256)
- **Data Retention:** Anonymization active after 72h
- **Export Availability:** CSV/JSON format supported`,
             [
               "Export Data to receive a verifiable copy.",
               "Review data inventory in Private Info subcollection."
             ]
           );
        }

        if (routing.intent === 'LEGAL_CONTRACT_GEN') {
           return this.formatOutput(
             'CONTRACT',
             'Drafting Protocol',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Template:** ${metadata.contract_type || 'service_agreement'}
- **Jurisdiction:** ${metadata.jurisdiction || 'US-CA'}
- **Frameworks:** ${(metadata.compliance_frameworks as string[])?.join(', ') || 'GDPR, CCPA'}
- **Key Modules:** IP Ownership, Termination, SLA`,
             [
               "Preview Draft to examine generated clauses.",
               "Submit to LegalContactAgent for validation."
             ]
           );
        }

        if (routing.intent === 'LEGAL_COMPLIANCE_CHECK') {
           return this.formatOutput(
             'AUDIT',
             'Operations Audit',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Scan Progress:** 100% complete
- **GDPR Pass:** TRUE
- **PCI-DSS Pass:** TRUE
- **Accessibility:** 98% (WCAG compliant)
- **Vulnerabilities:** 0 Critical`,
             [
               "Download full Audit Log for regulatory evidence.",
               "Perform quarterly re-evaluation sequence."
             ]
           );
        }

        if (routing.intent === 'SALES_PAGE_GEN') {
       logs.push({
         timestamp: new Date().toISOString(),
         source: AgentRole.ORCHESTRATOR,
         target: AgentRole.NARRATIVE,
         payload: { operation: 'narrative_mapping', status: 'LOCKED' }
       });
       logs.push({
         timestamp: new Date().toISOString(),
         source: AgentRole.NARRATIVE,
         target: AgentRole.CONTENT_LAB,
         payload: { operation: 'copy_synthesis', status: 'IN_PROGRESS' }
       });
    }

    if (routing.intent === 'EMAIL_SEQ_GEN') {
       logs.push({
         timestamp: new Date().toISOString(),
         source: AgentRole.ORCHESTRATOR,
         target: AgentRole.CONTENT_LAB,
         payload: { operation: 'segment_analysis', status: 'COMPLETED' }
       });
       logs.push({
         timestamp: new Date().toISOString(),
         source: AgentRole.CONTENT_LAB,
         target: AgentRole.OUTPUT,
         payload: { operation: 'sequence_gen', status: 'READY' }
       });
    }

    if (routing.intent === 'SYS_TRIGGER') {
           // A2A Cascade Simulation
           logs.push({
             timestamp: new Date().toISOString(),
             source: AgentRole.SYSTEM,
             target: AgentRole.PREDICTIVE,
             payload: { operation: 'revenue_signal', status: 'TRIGGERED' }
           });

           logs.push({
             timestamp: new Date().toISOString(),
             source: AgentRole.COMMUNITY,
             target: AgentRole.ORCHESTRATOR,
             payload: { operation: 'match_found', status: 'ALERT' }
           });

           const label = s.includes('system settings') ? 'Settings Protocol' : (action.includes(':') ? action.split(':')[1].trim() : 'Sequence Activation');

           return this.formatOutput(
             'SYSTEM',
             label,
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Sequence Type:** ${metadata.sequence_type || 'full_activation'}
- **Agents Involved:** ${(metadata.agents_involved as string[])?.join(', ') || 'all'}
- **Ledger Sync Enforced:** ${metadata.ledger_sync ? 'TRUE' : 'FALSE'}
- **Mode Configuration:** ${metadata.mode || 'high_intensity'}
- **Predictive Scaling Status:** ${metadata.predictive_scaling ? 'ACTIVE' : 'INACTIVE'}`,
             [
               "Monitor active handoffs for sequence stabilization.",
               "Review Immutable Ledger for A2A signal verification."
             ],
             { uptime: '99.99%', efficiency: '0.998' }
           );
        }

        if (routing.intent === 'SYS_SYNC') {
           return this.formatOutput(
             'SYSTEM',
             'Mesh Synchronization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Sync Type:** ${metadata.sync_type || 'full_mesh'}
- **Target Ledger:** ${metadata.ledger_target || 'immutable'}
- **Mapping Efficiency:** 98.4%
- **Conflict Count:** 0 DETECTED
- **State Propagation:** Global [SUCCESS]`,
             [
               "Perform High-Fidelity Metrics Audit.",
               "Analyze Community matching trends."
             ],
             { uptime: '99.99%', efficiency: '0.98' }
           );
        }

        if (routing.intent === 'SYS_METRICS') {
           return this.formatOutput(
             'SYSTEM',
             'Performance Audit',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Time Window:** ${metadata.time_window || 'last_24_hours'}
- **A2A Latency:** 24ms average
- **Anomaly Detection:** 0 SIGNALS DETECTED
- **Mesh Connectivity:** Steady (100% heartbeat)
- **Routing Precision:** Improved by 1.2% since last period.`,
             [
               "Initiate full mesh synchronization.",
               "Review scaling strategy based on current efficiency."
             ],
             { uptime: '99.998%', efficiency: '0.992' }
           );
        }

        if (routing.intent === 'SYS_TOGGLE_HIM') {
           return this.formatOutput(
             'SCALING',
             'HIM Configuration',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Mode:** High-Intensity (Aggressive)
- **Scaling Threshold:** MAX_BURST
- **Alert Latency:** < 50ms
- **Resource Priority:** Elevated`,
             [
               "Monitor revenue signals for auto-scaling triggers.",
               "Review performance metrics in the System Tab."
             ]
           );
        }

        if (routing.intent === 'SYS_TOGGLE_IH') {
           return this.formatOutput(
             'LEDGER',
             'Immutable History',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Persistence Node:** Decentralized Ledger
- **Transparency Score:** 100%
- **Audit Logging:** Synchronous | On-chain: TRUE
- **Replication:** Verified across mesh nodes.`,
             [
               "Audit on-chain transactions via Ledger Explorer.",
               "Export audit trail for regulatory compliance."
             ]
           );
        }

        if (routing.intent === 'SYS_TOGGLE_HS') {
           return this.formatOutput(
             'ROUTING',
             'Agent Hot-Swapping',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Autonomous Level:** HIGH
- **Intent Failover:** Redundant Mesh Fallback
- **Self-Healing:** Protocols INITIALIZED
- **Mesh Health:** 100% Heartbeat stability`,
             [
               "Monitor orchestrator for autonomous re-allocations.",
               "Review handoff logs for routing efficiency."
             ]
           );
        }

        if (routing.intent === 'SYS_TOGGLE_PS') {
           return this.formatOutput(
             'PREDICTIVE',
             'Scaling Logic',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Monitoring Status:** ACTIVE
- **Revenue Spike Threshold:** > 15% delta
- **A2A Feedback Loop:** Real-time stream to ScalingAgent
- **Precision:** 99.1% Signal Accuracy`,
             [
               "Review revenue signal watchlist for trending spikes.",
               "Check Scaling Strategy for auto-trigger conditions."
             ]
           );
        }

        if (routing.intent === 'SEO_ACTIVATE') {
           return this.formatOutput(
             'SEO',
             'Engine Initialization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** SEO Hub (Pillar 1)
- **Engine:** Keyword Intelligence v4.0
- **Audits Active:** Technical, On-Page, Content Gap
- **Connectors:** Search Console, Ahrefs API
- **Status:** INITIALIZED_AND_READY`,
             [
               "Run full-site crawl to identify technical leaks.",
               "Analyze top 3 competitors for content gap mapping."
             ],
             { uptime: '99.98%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'ECOMMERCE_ACTIVATE') {
           return this.formatOutput(
             'ECOMMERCE',
             'Storefront Sync',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** E-commerce Optimizer (Pillar 2)
- **Engine:** Dynamic Pricing & Catalog Sync
- **Integrations:** Shopify, Google Merchant Center
- **Optimizers:** UX-Description Gen, Pricing Logic
- **Status:** SYNCED_AND_OPERATIONAL`,
             [
               "Reconcile product catalog with Merchant Center.",
               "Activate Dynamic Pricing for competitive edge."
             ],
             { uptime: '99.99%', efficiency: '0.98' }
           );
        }

        if (routing.intent === 'CONTENT_ACTIVATE') {
           return this.formatOutput(
             'CONTENT',
             'Strategy Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Content Marketing Lab (Pillar 3)
- **Engine:** Brand Voice Synthesis
- **Planning:** 90-Day Editorial Calendar
- **Repurposing:** Blog-to-Video Multi-thread
- **Status:** STRATEGY_ACTIVE`,
             [
               "Review 90-day editorial calendar for brand alignment.",
               "Export blog scripts to Media Studio for video generation."
             ],
             { uptime: '100%', efficiency: '0.96' }
           );
        }

        if (routing.intent === 'EMAIL_ACTIVATE') {
           return this.formatOutput(
             'EMAIL',
             'Automation Sequence',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Email Specialist (Pillar 4)
- **Engine:** Behavioral Segmentation Engine
- **Active Flows:** Welcome, Cart Recovery, Post-Purchase
- **Deliverability:** Warmup Protocol Active
- **Status:** FLOWS_STAGING`,
             [
               "A/B test subject lines for the Welcome Series.",
               "Verify GDPR/CAN-SPAM compliance for all segments."
             ],
             { uptime: '99.995%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'PPC_ACTIVATE') {
           return this.formatOutput(
             'PPC',
             'Campaign Architecture',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** PPC Orchestrator (Pillar 5)
- **Platforms:** Google Ads, Microsoft Ads
- **Bid Strategy:** Target CPA Optimization
- **Negative Mining:** Domain-level exclusions active
- **Status:** CAMPAIGNS_ACTIVE`,
             [
               "Review RSA variations for higher Quality scores.",
               "Deploy negative keyword master list to all ad groups."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'ADS_ACTIVATE') {
           return this.formatOutput(
             'ADVERTISING',
             'Full-Funnel Deployment',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Online Ads Hub (Pillar 6)
- **Socials:** Meta, LinkedIn, TikTok, Twitter
- **Creative:** DCO (Dynamic Creative Optimization)
- **Audiences:** Multi-layer remarketing active
- **Status:** CROSS_PLATFORM_STABILIZED`,
             [
               "Test vertical video formats for TikTok/Reels.",
               "Reallocate budget based on real-time ROAS data."
             ],
             { uptime: '99.98%', efficiency: '0.97' }
           );
        }

        if (routing.intent === 'FLUX_INSIGHT_INIT') {
           return this.formatOutput(
             'INSIGHT',
             'BigQuery Analytics Sync',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Insight Agent
- **Data Source:** BigQuery Customer Data Warehouse
- **Engine:** Gemini Pro (Reasoning)
- **Status:** AGGREGATING_REAL_TIME_BEHAVIOR_FEEDS`,
             [
               "Identify customer segments with high churn risk.",
               "Predict seasonal demand shifts for the next 30 days."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'FLUX_DECISIONING_INIT') {
           return this.formatOutput(
             'DECISIONING',
             'Strategic Optimization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Decisioning Agent
- **Engine:** Gemini Enterprise Strategic Layer
- **Core:** Budget Allocation & Channel Mix
- **Status:** OPTIMIZING_CAMPAIGN_ROAS_TARGETS`,
             [
               "Allocate 40% budget to high-intent search channels.",
               "Optimize cross-platform spend for maximum blended ROAS."
             ],
             { uptime: '99.98%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'FLUX_CONTENT_INIT') {
           return this.formatOutput(
             'CONTENT',
             'Generative Asset Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Content Agent
- **Engines:** Veo (Video) / Imagen (Image)
- **Pipeline:** Multi-format automated asset scaling
- **Status:** SYNTHESIZING_TAILORED_CAMPAIGN_CREATIVES`,
             [
               "Generate 10 video variations for A/B creative testing.",
               "Synthesize localized imagery for global market segments."
             ],
             { uptime: '99.95%', efficiency: '0.96' }
           );
        }

        if (routing.intent === 'FLUX_AUDIENCE_INIT') {
           return this.formatOutput(
             'AUDIENCE',
             'Behavioral Segmentation',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Audience Agent
- **Engine:** Neural Cluster Analysis
- **Core:** Behavioral Insights / Life-cycle Stages
- **Status:** MAPPING_HIGH_LTV_TARGET_PROFILES`,
             [
               "Create lookalike audiences based on top 5% LTV customers.",
               "Identify dormant segments for targeted win-back flows."
             ],
             { uptime: '99.99%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'FLUX_COMARKETER_INIT') {
           return this.formatOutput(
             'CO-MARKETER',
             'Performance Orchestration',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Co-Marketer Agent
- **Automation:** Automated A/B Testing / Bid Management
- **Integrations:** Google Ads / Meta Ads API
- **Status:** EXECUTING_BID_OPTIMIZATION_LOOPS`,
             [
               "Optimize ad set parameters for 48-hour performance spike.",
               "Pivot creative strategy based on real-time engagement data."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'FLUX_SHOPPING_INIT') {
           return this.formatOutput(
             'SHOPPING',
             'E-commerce Conversion Sync',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Module:** Shopping Agent
- **Commerce Hub:** Personalized Recommendation Engine
- **Core:** Real-time Offer Generation / Cart Recovery
- **Status:** OPTIMIZING_CHECKOUT_CONVERSION_PATH`,
             [
               "Deploy personalized bundles to high-intent users.",
               "Activate real-time cart recovery triggers via Gmail API."
             ],
             { uptime: '99.995%', efficiency: '0.98' }
           );
        }

        if (routing.intent === 'FLUX_MESH_ACTIVATE') {
           return this.formatOutput(
             'ORCHESTRATOR',
             'Flux Neural Mesh Synchronization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Layer:** Flux Neural Mesh (Synchronization Engine)
- **Mesh Hub:** Neural Synchronization & Workflow Orchestration
- **Logic:** Insight → Decisioning → Content Flow
- **Status:** ESTABLISHING_UNIFIED_BRAIN_MESH`,
             [
               "Connect Content Agent output to Audience Agent feedback loop.",
               "Orchestrate Zapier/Gemini chains for unified campaign execution."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'CALENDAR_EVENT_CREATE') {
           return this.formatOutput(
             'CALENDAR',
             'Marketing Schedule Sync',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Action:** CREATE_MARKETING_EVENT
- **Status:** EVENT_COMMITTED_TO_LEDGER
- **Integrity Check:** Conflict Management Passed`,
             [
               "View updated Marketing Calendar for new campaign blocks.",
               "Establish push notifications for campaign go-live."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'INTEL_TREND_TASK') {
           return this.formatOutput(
             'INTELLIGENCE',
             'Trend-to-Task Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Input:** Raw Market Intelligence Signal
- **Synthesis:** Gemini Enterprise Reasoner
- **Action:** Conversion to Scheduled Event Block
- **Status:** TRANSLATION_COMPLETE`,
             [
               "Review suggested content creation blocks in Calendar.",
               "Confirm A/B test parameters for upcoming trend peaks."
             ],
             { uptime: '99.99%', efficiency: '0.98' }
           );
        }

        if (routing.intent === 'CONTENT_LAB_ACTIVATE') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Content Lab — Full System Activation',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Protocols:** Copywriting Engine (HI-CON), Narrative Architect (V1)
- **Frameworks:** StoryBrand, PAS, AIDA, Neuro-Linguistic Programming (NLP)
- **Status:** ALL_SYSTEMS_OPERATIONAL_GREEN`,
             [
               "Initialize Psychological Trigger Matrix for multi-channel sync.",
               "Perform Brand Voice DNA crawl for consistent narrative output."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'SALES_PAGE_GEN') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Long-Form Sales Page Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Focus:** Conversion Architecture (High-Ticket)
- **Framework:** StoryBrand V2 + PAS Integration
- **Sections:** Neural Hook, Pain-Point Amplification, Transition-to-Value, Social Proof Matrix, Risk Reversal
- **Status:** SYNTHESIS_COMPLETE_READY_FOR_DEPLOYMENT`,
             [
               "A/B test the risk reversal section for higher AOV.",
               "Sync output with Media Studio for cinematic asset injection."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'EMAIL_SEQ_GEN') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Multi-Thread Email Sequence',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Sequence:** 5-Email Launch / Nurture Chain
- **Methodology:** Behavior-Based Narrative Flow
- **Hooks:** Open-Loop Curiosity, Urgency Injection, Social Consensus
- **Status:** SEGMENT_READY_FOR_WARMUP`,
             [
               "Monitor open rates to trigger automated re-send to non-openers.",
               "Schedule sequence in Email Marketing Specialist module."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'AD_COPY_GEN') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Multi-Variant Ad Creative',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Platforms:** Meta, LinkedIn, TikTok
- **Variants:** 3 Semantic variations per platform
- **Triggers:** Authority, Scarcity, Unity
- **Status:** AD_SETS_OPTIMIZED`,
             [
               "Export asset to Ads Manager for immediate campaign tracking.",
               "Sync with Bayesian-V4 for real-time significance testing."
             ],
             { uptime: '99.99%', efficiency: '0.97' }
           );
        }

        if (routing.intent === 'REWRITE_COPY') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Tone Transformation & Conversion Guard',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Transformation:** High-Performance Agency Tone
- **Security:** Conversion Guard active (no structural performance loss)
- **Grammar/Syntax:** Grade 12 Specialized refinement
- **Status:** REWRITE_STABILIZED`,
             [
               "Perform Voice DNA audit to ensure brand consistency.",
               "Generate 2 A/B alternatives based on the new transformation."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'COMPETITOR_DECON') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Competitive Copy Audit',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Deconstruction:** Psychological Hook Identification
- **Vulnerabilities:** Identification of copy gaps & logic leaks
- **Opportunities:** Narrative pivots for competitive dominance
- **Status:** AUDIT_COMPLETE_GROUNDING_ACTIVE`,
             [
               "Initialize PPC module for aggressive keyword bidding against gaps.",
               "Generate counter-narrative sequences in Narrative Engineering."
             ],
             { uptime: '99.9%' , efficiency: '0.98' }
           );
        }

        if (routing.intent === 'VARIANTS_GEN') {
           return this.formatOutput(
             'CONTENT_LAB',
             'A/B Alternative Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Element:** [Headline/CTA/Hook]
- **Variations Count:** 5 High-Conversion Alternatives
- **Logic:** Multivariable Pattern Testing
- **Status:** VARIANTS_GENERATED_READY_FOR_SVI`,
             [
               "Deploy to A/B Training Pipeline for Bayesian inference.",
               "Reconcile variants with previous campaign performance data."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'VOICE_AUDIT') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Brand Voice Consistency Check',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Alignment:** 94.2% Brand Voice DNA Match
- **Divergences:** Detected in 'Empathy/Urgency' balance
- **Remediation:** Automated tonal correction protocols suggested
- **Status:** AUDIT_STABILIZED`,
             [
               "Initialize Voice Guardian for real-time monitoring.",
               "Perform manual re-calibration of high-ticket offer voice DNA."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'NARRATIVE_ENG_INIT') {
           return this.formatOutput(
             'NARRATIVE',
             'Narrative Engineering Framework',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Arc Mapping:** Hero's Journey (12-Stage Adapted)
- **Story Architecture:** Before-After-Bridge (BAB)
- **Metaphor Engine:** Active & Grounded
- **Status:** NARRATIVE_CONSISTENCY_LOCKED`,
             [
               "Map customer pain points to Conflict-Resolution arcs.",
               "Synthesize Micro-Story sequences for high-impact resonance."
             ],
             { uptime: '100%', efficiency: '0.98' }
           );
        }

        if (routing.intent === 'PSYCH_TRIGGER_MAP') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Psychological Trigger Matrix',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Primary Triggers:** FOMO, Social Proof, Authority
- **Secondary Triggers:** Scarcity, Reciprocity, Consistency
- **Sentiment Calibration:** optimized for status-elevation
- **Status:** COGNITIVE_BIAS_SYNC_COMPLETE`,
             [
               "A/B test Scarcity vs. Urgency triggers for the upcoming launch.",
               "Rotate social proof assets across all ad variants."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'VOICE_DNA_PROFILE') {
           return this.formatOutput(
             'CONTENT_LAB',
             'Brand Voice DNA Profiler',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Traits:** Bold, Technical, High-Performance
- **Vocabulary:** Industry-Technical (Grade 12 Alignment)
- **Formality:** Luxe-Professional
- **Status:** VOICE_GUARDIAN_ACTIVE`,
             [
               "Audit current email sequence for passive voice density.",
               "Generate 5 tonal variations for the high-ticket offer."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'TRAINING_EXECUTE') {
           return this.formatOutput(
             'TRAINING',
             'Model Fine-Tuning Execution',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Method:** Low-Rank Adaptation (LoRA)
- **Base Model:** gemini-1.5-pro
- **Infrastructure:** Google TPU v4 Cluster
- **Status:** TRAINING_COMPLETED_SUCCESSFULLY`,
             [
               "Review the final Evaluation Report for perplexity scores.",
               "Deploy the fine-tuned dedicated endpoint."
             ],
             { uptime: '100%', efficiency: '0.995' }
           );
        }

        if (routing.intent === 'TRAINING_UPLOAD') {
           return this.formatOutput(
             'TRAINING',
             'Dataset Ingestion',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Operation:** RAW_DATA_UPLOAD
- **Preprocessing:** Tokenization & Deduplication Active
- **Status:** DATA_COMMITTED_TO_BUFFER`,
             [
               "Verify dataset metadata in the Model Training Data list.",
               "Initiate fine-tuning sequence using the new corpus."
             ],
             { uptime: '99.99%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'TRAINING_DELETE') {
           return this.formatOutput(
             'TRAINING',
             'Dataset Purge',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Operation:** IRREVERSIBLE_DATA_PURGE
- **Target:** Metadata & Buffer Blocks
- **Status:** PURGE_SUCCESSFUL`,
             [
               "Re-upload if data was deleted in error.",
               "Audit training buffer for remaining capacity."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'DESIGN_SYSTEM_GEN') {
           return this.formatOutput(
             'DESIGN_ENGINEER',
             'Autonomous Design System Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Focus:** Multi-Platform Design System (Atomic Architecture)
- **Framework:** Tailwind CSS v4 + React 19 Alignment
- **Components:** Design Tokens, Neural Layout Grid, Fluid Typography
- **Status:** DESIGN_SYSTEM_LOCKED_READY_FOR_ENGINEERING`,
             [
               "Audit accessibility contrast ratios for the new palette.",
               "Export style-dictionary for cross-platform consumption."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'REQUIREMENTS_GEN') {
           return this.formatOutput(
             'DESIGN_ENGINEER',
             'Requirements Engineering Engine',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Output:** User Stories, Technical PRD, Schema Architecture
- **Methodology:** Autonomous Stakeholder Simulation
- **Completeness Index:** 98%
- **Status:** REQUIREMENTS_STABILIZED`,
             [
               "Sync schema architecture with Backend Generator.",
               "Perform edge-case audit on user story acceptance criteria."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'PAGE_ASSEMBLER') {
           return this.formatOutput(
             'DESIGN_ENGINEER',
             'Page Template Assembler',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Modules:** Hero, Feature Matrix, FAQ, Pricing, Footer
- **Layout Logic:** Fluid-Responsive Containerization
- **SEO Ready:** Semantic HTML5 Structure
- **Status:** TEMPLATES_ASSEMBLED`,
             [
               "Verify mobile-fluidity on ultra-wide viewports.",
               "Inject performance-critical lazy loading attributes."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'BACKEND_INFRA_GEN') {
           return this.formatOutput(
             'DEVOPS',
             'Backend Infrastructure Architect',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Stack:** Firebase / Edge Functions / NoSQL
- **Auth:** JWT / OAuth Integration (Tier-Gated)
- **Security:** ABAC Firebase Rules Generation
- **Status:** INFRA_ACTIVE_SYNCED`,
             [
               "Verify cross-origin resource sharing policy.",
               "Deploy temporary secure sandbox for integration testing."
             ],
             { uptime: '100%', efficiency: '0.96' }
           );
        }

        if (routing.intent === 'PERFORMANCE_AUDIT') {
           return this.formatOutput(
             'DEVOPS',
             'Core Web Vitals Performance Audit',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Metrics:** LCP (0.8s), FID (12ms), CLS (0.02)
- **Bottlenecks:** Image optimization gaps & Third-party script bloat
- **Strategy:** Aggressive Code Splitting & Resource Preloading
- **Status:** PERFORMANCE_STABILIZED`,
             [
               "Enable Brotli/Zstd compression for all static assets.",
               "Establish Performance Budgets for the next commit cycle."
             ],
             { uptime: '99.99%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'CODE_GEN_FREE') {
           return this.formatOutput(
             'DEVOPS',
             'Static Asset Generation Pipeline (Free Tier)',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Stack:** HTML5 / Tailwind CSS / Vanilla JS
- **Output:** Optimized static assets ready for edge delivery
- **Extras:** Basic SEO meta-tags & static hosting config
- **Status:** GENERATION_COMPLETE_STRETCH_GOALS_LOCKED`,
             ["Upgrade to PRO for Framer Motion and analytics integration."],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'CODE_GEN_PRO') {
           return this.formatOutput(
             'DEVOPS',
             'Dynamic SaaS Generation Pipeline (Pro Tier)',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Stack:** Next.js / Framer Motion / GA4 / Meta Pixel
- **Output:** PWA-ready dynamic frontend with form handling
- **Extras:** SEO-Plus / Analytics Dashboard / Custom Domain Sync
- **Status:** GENERATION_STABILIZED_PRO_PROTOCOL_ACTIVE`,
             ["Perform conversion audit on generated landing page forms."],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'CODE_GEN_ENTERPRISE') {
           return this.formatOutput(
             'DEVOPS',
             'Full-Stack Enterprise Architecture Synthesis',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Stack:** Next.js / tRPC / PostgreSQL / Stripe / Shopify
- **Output:** Full e-commerce engine with encrypted admin dashboard
- **Extras:** A/B Testing Lab / i18n / SSO / Global Edge Cache
- **Status:** ENTERPRISE_DEPLOYMENT_READY`,
             ["Scale PostgreSQL instance to 5 nodes for global redundancy."],
             { uptime: '100%', efficiency: '0.97' }
           );
        }

        if (routing.intent === 'CODE_GEN_PIPELINE') {
           return this.formatOutput(
             'DEVOPS',
             'Custom Code Generation Pipeline',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Input:** UX Blueprint & Schema Mapping
- **Output:** Production-Ready React/TypeScript Components
- **QA:** Automated Unit Testing (Vitest) & Component Snapshotting
- **Status:** CODEBASE_READY_FOR_DEPLOYMENT`,
             [
               "Verify API endpoint integration for custom data hooks.",
               "Perform manual code review for complex business logic blocks."
             ],
             { uptime: '100%', efficiency: '0.97' }
           );
        }

        if (routing.intent === 'EDGE_DEPLOY_STRATEGY') {
           return this.formatOutput(
             'DEVOPS',
             'Global Edge Deployment Strategy',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Infrastructure:** Serverless Edge Workers (Global)
- **Caching:** Cache-Control headers optimized for 99% HIT rate
- **Routing:** Intelligent Global Traffic Steering active
- **Status:** EDGE_INFRASTRUCTURE_STABILIZED`,
             [
               "Reconcile cache-purge tokens for real-time asset updates.",
               "Monitor global latency spikes in the DevOps dashboard."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'FLUX_MESH_REINIT') {
           return this.formatOutput(
             'ORCHESTRATOR',
             'Neural Mesh Re-Initialization',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Action:** HARD_RESET_NEURAL_NODES
- **Mesh Integrity:** Verified 100%
- **Status:** RE_ESTABLISHED_CANONICAL_SYNC`,
             [
               "Clear module cache for fresh synchronization.",
               "Re-verify BigQuery connectors for Insight Agent."
             ],
             { uptime: '100%', efficiency: '0.99' }
           );
        }

        if (routing.intent === 'FLUX_REPORT_GENERATE') {
           return this.formatOutput(
             'AUDIT',
             'Marketing performance Report',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Type:** Comprehensive Performance Audit
- **Modules Covered:** All 6 Flux Pillars
- **Data Period:** Last 30 Days (Projected)
- **Status:** REPORT_READY_FOR_EXPORT`,
             [
               "Share report with stakeholders via secure vault.",
               "Schedule recurring weekly performance audits."
             ],
             { uptime: 'infallible', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'FLUX_EXPORT_CONFIG') {
           return this.formatOutput(
             'ORCHESTRATOR',
             'Workspace Configuration Export',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Format:** JSON / YAML Mesh-Native
- **Encryption:** RSA-4096
- **Status:** CONFIG_ENCRYPTED_AND_PACKAGED`,
             [
               "Store config backup in secure offline vault.",
               "Use config string for cross-instance migration."
             ],
             { uptime: '100%', efficiency: '1.0' }
           );
        }

        if (routing.intent === 'GLOBAL_MARKETING_INIT') {
           return this.formatOutput(
             'ORCHESTRATOR',
             'Global System Activation',
             orchestratorHandoff.payload.context.task_id,
             logs,
             `- **Workspace:** Digital Marketing Integration Suite
- **Pulse:** All 6 Pillars Active
- **Data Sync:** Real-time mesh established
- **Audit:** Automated version control active
- **Status:** SYSTEM_ONLINE_READY_TO_SCALE`,
             [
               "Proceed to SEO Hub for initial crawl.",
               "Initialize E-commerce sync via Shopify connector."
             ],
             { uptime: '100%', efficiency: '1.0', ledgerStatus: 'SYNCED' }
           );
        }

        if (targetAgent === AgentRole.CONTRACT && complianceHandoff && complianceHandoff.payload.contract_request) {
          const cr = complianceHandoff.payload.contract_request;
          return `[CONTRACT_INTAKE]: ${complianceHandoff.payload.message}\n\nCLIENT: ${cr.client_name}\nTYPE: ${cr.engagement_type}\nCOMPLEXITY: ${cr.complexity}\nSLA: ${cr.sla_business_days} Business Days\n\nNext: LegalContactAgent has been notified for drafter assignment.`;
        }

        if (targetAgent === AgentRole.INCIDENT && complianceHandoff && complianceHandoff.payload.incident_result) {
          const ir = complianceHandoff.payload.incident_result;
          return `[INCIDENT_RESPONSE]: ${ir.severity} BREACH DETECTED\nID: [${ir.incident_id}]\nPHASE: ${ir.current_phase} - ${ir.phase_label}\n\nNEXT STEPS:\n${ir.next_actions.map((a: string) => `• ${a}`).join('\n')}\n\nLegal escalation: ${ir.legal_escalated ? 'ACTIVE' : 'INACTIVE'}\nDeadline: ${ir.notification_deadline}`;
        }

        if ((targetAgent === AgentRole.COMPLIANCE || targetAgent === AgentRole.INCIDENT || targetAgent === AgentRole.CONTRACT) && complianceHandoff) {
          return `[LEGAL_AUTHORITY]: ${complianceHandoff.payload.doc_title}\n\n${complianceHandoff.payload.legal_content}\n\nNext: Review associated governance protocols.`;
        }

        if (targetAgent === AgentRole.LEGAL_CONTACT && complianceHandoff) {
          return `[LEGAL_ESCALATION]: ${complianceHandoff.payload.message}\n\nYour session ID for this ticket is: [${orchestratorHandoff.payload.context.session_id}]`;
        }

        let msg = `${hook} You just earned ${finalXpDelta} XP — total: ${this.state.points}.\n`;
        
        if (badgeName) {
          msg += `🎖️ BADGE UNLOCKED: ${badgeName}. Keep this momentum.\n`;
        }

        if (tierUpgraded) {
          msg = `🚀 EXCELLENCE DETECTED: UNLOCKED ${this.state.tier.toUpperCase()} TIER. 🚀\n\n` + msg;
        }

        return msg;
      }
    };

    logs.push({
      source: AgentRole.OUTPUT,
      target: AgentRole.ORCHESTRATOR,
      payload: { 
        message: await synthesis(),
        final_state: { tier: this.state.tier, points: this.state.points, badge: badgeName, streak: this.state.streak }
      },
      timestamp: new Date().toISOString()
    });

    // 5. AuditAgent receives a copy for immutable logging
    const ledgerSync = async () => {
      try {
        await fetch('/api/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'engagement.ledger_sync',
            params: {
              trace: logs.map(l => ({ s: l.source, t: l.target })),
              session_id: orchestratorHandoff.payload.context.session_id,
              action
            },
            id: Date.now()
          })
        });
      } catch (e) {
        console.warn("Ledger sync failed", e);
      }
    };
    ledgerSync();

    logs.push({
      source: AgentRole.ORCHESTRATOR,
      target: AgentRole.AUDIT,
      payload: {
        operation: 'IMMUTABLE_COMPLIANCE_LOG',
        full_trace: logs.map(l => ({ s: l.source, t: l.target })),
        verified: true
      },
      timestamp: new Date().toISOString()
    });

    this.state.handoffLogs = [...logs, ...this.state.handoffLogs].slice(0, 50);
    return logs;
  }

  private calculateTier(points: number): string {
    if (points >= 3500) return 'Expert';
    if (points >= 1500) return 'Advanced';
    if (points >= 500) return 'Intermediate';
    return 'Beginners';
  }

  private formatOutput(
    sector: string, 
    action: string, 
    taskId: string, 
    logs: AgentHandoff[], 
    sectorOutput: string, 
    recommendations: string[],
    metrics?: { uptime?: string; efficiency?: string; ledgerStatus?: string }
  ): string {
    const txHash = `0x${crypto.randomUUID().split('-').join('').substring(0, 32)}`;
    const meshActivity = logs.map(h => {
      const source = h.source.replace('Agent', '').replace('_AGENT', '').toUpperCase();
      const target = h.target.replace('Agent', '').replace('_AGENT', '').toUpperCase();
      const type = (h.payload?.context?.intent || h.payload?.operation || h.payload?.lesson_event?.lesson_id || "A2A_MESH_SIGNAL").toLowerCase();
      const status = (h.payload?.status || (h.target === 'OUTPUT_AGENT' ? "COMPLETED" : "TRIGGERED")).toLowerCase();
      return `- ${source} → ${target} | ${type} | ${status}`;
    }).join('\n');

    return `## ✅ [${sector.toUpperCase()}] — [${action.toUpperCase()}] Completed
**Task ID:** \`${taskId}\`  
**Status:** completed  
**A2A Handoffs:** ${logs.length} agents involved  
**Ledger Sync:** committed | ${txHash}

### 📊 Sector Output
${sectorOutput}

### 🔄 Agent Mesh Activity
${meshActivity}

### 🎯 Recommended Next Actions
${recommendations.map((a, i) => `${i + 1}. ${a}`).join('\n')}

### ⚙️ System Metrics
- Sync Uptime: ${metrics?.uptime || '99.99%'}
- Mapping Efficiency: ${metrics?.efficiency || '0.98'}
- Ledger Status: ${metrics?.ledgerStatus || 'OPERATIONAL'}`;
  }

  private getNextThreshold(points: number): number {
    if (points < 500) return 500;
    if (points < 1500) return 1500;
    if (points < 3500) return 3500;
    return points;
  }

  getState() {
    return this.state;
  }
}
