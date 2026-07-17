
export interface CopyTemplate {
  id: string;
  name: string;
  formula: string;
  structure: string[];
  category: 'Ads' | 'Emails' | 'Social' | 'Blog' | 'Foundations';
}

export const adHeadlineFormulas: CopyTemplate[] = [
  { 
    id: 'aida', 
    name: 'AIDA (Attention, Interest, Desire, Action)', 
    formula: 'Standard funnel progression', 
    structure: ['Stop scrolling', 'What if you could...', 'Imagine {Result}', 'Click to initialize'],
    category: 'Ads' 
  },
  { 
    id: 'pas', 
    name: 'PAS (Problem, Agitation, Solution)', 
    formula: 'Pain point amplification', 
    structure: ['Frustrated by {Problem}?', 'It only gets worse if {Agitation}', 'Solve it today with {Solution}', 'Start now'],
    category: 'Ads' 
  },
  { 
    id: 'fab', 
    name: 'FAB (Features, Advantages, Benefits)', 
    formula: 'Value-based selling', 
    structure: ['{Feature} built-in', 'Allowing you to {Advantage}', 'Which means {Benefit}', 'Claim yours'],
    category: 'Ads' 
  }
];

export const seoChecklist = [
  { item: 'Primary Keyword in H1', category: 'On-Page', required: true },
  { item: 'Keyword in first 100 words', category: 'On-Page', required: true },
  { item: 'LSI / Semantic Keywords included', category: 'On-Page', required: false },
  { item: 'Internal Links to target nodes', category: 'Link Building', required: true },
  { item: 'Alt text for all system assets', category: 'Technical', required: true },
  { item: 'Meta Description (Max 155 chars)', category: 'Metadata', required: true },
  { item: 'Schema.org JSON-LD deployed', category: 'Technical', required: false }
];

export const socialMediaStrategy = {
  postingTimes: [
    { platform: 'LinkedIn', bestTime: 'Tue-Thu, 9 AM - 11 AM EST', reason: 'High professional engagement' },
    { platform: 'Instagram', bestTime: 'Mon-Fri, 11 AM - 1 PM EST', reason: 'Lunchtime scrolling peak' },
    { platform: 'TikTok', bestTime: 'Daily, 7 PM - 10 PM EST', reason: 'Maximum viral potential' }
  ],
  crisisProtocol: [
    { stage: 'Identify', action: 'Monitor sentiment drop > 15%.' },
    { stage: 'Acknowledge', action: 'Draft holding statement within 2h.' },
    { stage: 'Analyze', action: 'Identify root cause (Tech/Creative/PR).' },
    { stage: 'Resolution', action: 'Deploy correction and 24h follow-up.' }
  ]
};

export const toneDefinitions = [
  { 
    style: 'Neural / Technical', 
    keywords: 'Precise, Futuristic, Clean', 
    example: 'Initialize your D2C architecture with sub-1s LCP performance benchmarks.' 
  },
  { 
    style: 'Bold / Agency', 
    keywords: 'Aggressive, Results-Driven, High-Impact', 
    example: 'We don\'t just scale brands. We engineer algorithmic dominance.' 
  },
  { 
    style: 'Minimalist / Premium', 
    keywords: 'Quiet, Refined, Quality', 
    example: 'The intersection of commerce and craftsmanship. Uncompromising design.' 
  },
  { 
    style: 'Playful / Viral', 
    keywords: 'Energetic, Relatable, Fast', 
    example: 'Stop scrolling. Start winning. The growth hack you didn\'t see coming.' 
  }
];

export const shopifySetupWizard = [
  { step: 1, title: 'Identity & Domain', description: 'Configure .myshopify.com or connect custom domain.', tags: ['Setup', 'Branding'] },
  { step: 2, title: 'Payment Gateways', description: 'Enable Shopify Payments and alternative providers.', tags: ['FinOps', 'Conversion'] },
  { step: 3, title: 'Shipping Logistics', description: 'Define zones, rates, and carrier integrations.', tags: ['Operations'] },
  { step: 4, title: 'Tax Nexus', description: 'Configure automated tax calculations based on location.', tags: ['Legal'] },
  { step: 5, title: 'Market Localization', description: 'Set up Shopify Markets for international selling.', tags: ['Global'] }
];

export const shopifyThemes = [
  { name: 'Dawn', vibe: 'Minimalist / Lightweight', bestFor: 'Direct selling / Content focused' },
  { name: 'Impulse', vibe: 'High Volume / Modern', bestFor: 'Large catalogs / Visual storytelling' },
  { name: 'Prestige', vibe: 'Luxury / Premium', bestFor: 'High-end brands / Editorial style' },
  { name: 'Warehouse', vibe: 'Commercial / Functional', bestFor: 'Extensive inventory / Search focused' }
];

export const shopifyAppStack = [
  { category: 'Conversion', apps: ['Klaviyo (Email/SMS)', 'Rebuy (Personalization)', 'Okendo (Reviews)'] },
  { category: 'Operations', apps: ['Matrixify (Bulk Edit)', 'ShipStation (Logistics)', 'Gorgias (Support)'] },
  { category: 'Social', apps: ['Triple Whale (Attribution)', 'Postscript (SMS)', 'Loox (Visual Reviews)'] }
];

export const conversionOptimization = {
  checkoutAudit: [
    'One-page checkout enabled',
    'Guest checkout available (reduce friction)',
    'Shop Pay / Apple Pay buttons active',
    'Trust badges visible on payment page',
    'Progress bar for multi-step checkout'
  ],
  productCopyFormulas: [
    { name: 'Benefit-First', formula: '[Key Benefit] + [Feature] + [The "So What?"]' },
    { name: 'Scarcity/Urgency', formula: '[Limited Status] + [Unique Proof] + [Immediate CTA]' }
  ],
  abandonedCartFlow: [
    { email: 1, delay: '1 hour', focus: 'Helpfulness (Technical issue?)' },
    { email: 2, delay: '12 hours', focus: 'Social Proof + Bonus (Limited Discount)' },
    { email: 3, delay: '24 hours', focus: 'Urgency + Expiring Offer' }
  ],
  trustBadgeGuide: [
    'Header: Free Shipping / Sustainability icons',
    'Product Page: "Verified Results" or "Money Back Guarantee"',
    'Cart: Secure Checkout / PCI Compliance badges'
  ]
};

export const shopifyAdsData = {
  feedSetup: [
    'Enable Content API in Merchant Center',
    'Sync all variations with GTINs',
    'Optimize titles: [Brand] + [Product Type] + [Attributes]'
  ],
  pixelGuide: [
    'Deploy Shopify Facebook/Instagram App',
    'Enable Maximum tracking (CAPI)',
    'Verify domain in Meta Business Suite'
  ],
  roasCalculator: {
    baseline: 4.5,
    inputs: ['Spend', 'AOV', 'Conversion Rate'],
    target: '(Target ROAS) = (Revenue / Spend)'
  },
  creativeBriefTemplate: {
    hook: '3-second visual scroll-stopper',
    body: 'Problem/Solution narrative',
    cta: 'D2C Direct-to-Cart link'
  }
};

export const googleAdsCampaignBuilder = {
  structureTemplates: [
    { name: 'Alpha-Beta (SKAGs)', description: 'Single Keyword Ad Groups for maximum control.', useCase: 'High-budget, precise targeting' },
    { name: 'Hagakure', description: 'Smart bidding focused structure with generic ad groups.', useCase: 'Automated bidding / Large data' },
    { name: 'Product-Type STAGs', description: 'Single Topic Ad Groups based on product categories.', useCase: 'E-commerce / Retail' }
  ],
  matchTypeGuide: [
    { type: 'Broad Match', syntax: 'keyword', usage: 'Discovery & AI-powered scaling' },
    { type: 'Phrase Match', syntax: '"keyword"', usage: 'Balance of reach and precision' },
    { type: 'Exact Match', syntax: '[keyword]', usage: 'Maximum intent control' }
  ],
  negativeKeywords: ['Free', 'Cheap', 'Manual', 'Job', 'Salary', 'Internship', 'Course', 'Definition'],
  budgetFormulas: [
    { label: 'Target Spend', formula: '(Daily Budget) = (Monthly Target) / 30.4' },
    { label: 'CPA Efficiency', formula: '(Max CPC) = (Target CPA) * (Conv. Rate)' }
  ]
};

export const adCopyLibrary = {
  rsaTemplates: [
    { headline: 'Shop the Latest {Product}', type: 'Benefit' },
    { headline: 'Get 20% Off Your First Order', type: 'Offer' },
    { headline: 'Over 10k Happy Customers', type: 'Social Proof' }
  ],
  youtubeScripts: [
    { duration: '15s', hook: 'The "Immediate Problem" Hook', body: 'The 5-second solution demo', cta: 'Shop Now overlay' },
    { duration: '30s', hook: 'Pattern Interrupt', body: 'Emotional benefits + Feature list', cta: 'Click the Link' }
  ],
  abTesting: [
    'Test: Benefit vs. Feature Headlines',
    'Test: Questions vs. Statements',
    'Test: Static vs. Dynamic Values',
    'Test: Urgency vs. Lifestyle imagery'
  ]
};

export const ppcPerformanceTracking = {
  qualityScoreChecklist: [
    'Landing Page Relevance (Keyword Depth)',
    'Expected CTR (Ad Copy vs. Intent)',
    'Ad Relevance (Negative Keyword pruning)',
    'Page Load Speed (< 2s)'
  ],
  ctrBenchmarks: [
    { channel: 'Search (Brand)', benchmark: '10% - 20%' },
    { channel: 'Search (Generic)', benchmark: '3% - 5%' },
    { channel: 'Display', benchmark: '0.5% - 1%' },
    { channel: 'YouTube', benchmark: '1.5% - 2.5%' }
  ],
  optimizationChecklist: {
    weekly: ['Search term review', 'Bid adjustments', 'Budget pacing'],
    monthly: ['Ad copy A/B test analysis', 'Landing page audit', 'Competitor insights']
  }
};

export const webDesignDevData = {
  designSystem: {
    wireframeComponents: ['Header (Navigation)', 'Hero Section', 'Feature Grid', 'Testimonials', 'Pricing Table', 'Footer'],
    colorPsychology: [
      { color: 'Blue', mood: 'Trust, Intelligence, Efficiency', useCase: 'Corporate / Tech' },
      { color: 'Orange', mood: 'Energy, Playful, Friendly', useCase: 'Startups / DTC' },
      { color: 'Black', mood: 'Luxury, Sophistication, Authority', useCase: 'High-end / Fashion' }
    ],
    typographyPairing: [
      { heading: 'Space Grotesk', body: 'Inter', vibe: 'Modern Tech' },
      { heading: 'Playfair Display', body: 'Source Sans Pro', vibe: 'Editorial Luxury' },
      { heading: 'Outfit', body: 'Plus Jakarta Sans', vibe: 'Soft / Friendly' }
    ],
    accessibilityChecklist: [
      'Contrast ratio > 4.5:1 for normal text',
      'Focus indicators visible (Keyboard nav)',
      'Alt text on all functional images',
      'Aria-labels for complex components'
    ]
  },
  developmentSpecs: {
    techStacks: [
      { name: 'Headless / Performance', stack: 'Next.js + Sanity + Tailwind', score: '99/100 LCP' },
      { name: 'SaaS / App', stack: 'React + Node.js + PostgreSQL', score: 'Enterprise Ready' },
      { name: 'Marketing / Content', stack: 'Astro + Strapi / Ghost', score: 'SEO Optimized' }
    ],
    speedOptimization: [
      'Image optimization (WebP/AVIF)',
      'Critical CSS inlining',
      'Lazy loading on non-fold assets',
      'Edge delivery (Cloudflare/Vercel)'
    ],
    securityHardening: [
      'SSL/TLS 1.3 encryption',
      'Content Security Policy (CSP)',
      'XSS & CSRF protection active',
      'Rate limiting on API endpoints'
    ],
    launchChecklist: ['SSL Active', 'Sitemap.xml', 'Robots.txt', 'Favicons', '404 Page', 'OpenGraph Meta']
  },
  maintenancePlans: {
    updateSchedule: 'Bi-weekly core updates / Weekly package audits',
    backupProtocol: 'Daily automated cloud snapshots (30-day retention)',
    securityScan: 'Vulnerability scans every 24 hours via automated bot',
    uptimeMonitoring: 'Instant Slack/Email alerts via UptimeRobot'
  }
};
