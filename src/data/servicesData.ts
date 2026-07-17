import { 
  ShoppingBag, 
  Share2, 
  Users, 
  Target, 
  Search, 
  PenTool, 
  Globe, 
  Server 
} from 'lucide-react';

export interface ServiceDetail {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  description: string;
  features: string[];
  pricing: {
    tier: string;
    price: string;
    features: string[];
  }[];
  timeline: string;
  clientInputs: string[];
  workflow: {
    stage: string;
    description: string;
    milestone: string;
  }[];
  deliverablesTemplates: {
    type: string;
    structure: string[];
  }[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'shopify',
    name: 'Shopify Development',
    tagline: 'Architecting High-Conversion E-commerce Ecosystems',
    icon: ShoppingBag,
    description: 'Our Shopify Development service goes beyond basic theme installation. We architect custom headless solutions using Hydrogen and Remix, alongside high-performance Liquid themes. Our approach focuses on conversion rate optimization (CRO), technical SEO, and massive scalability. We understand that an e-commerce store is a living organism; therefore, we implement robust inventory syncs, custom Shopify Functions for complex discounting, and a mobile-first UI that eliminates friction at the checkout. Whether you are migrating from Magento or launching a new D2C brand, our engineering team ensures a 90+ Lighthouse score, integrated marketing pixels, and a backend that empowers your team to manage products without needing a developer for every change. We specialize in high-growth brands that demand industrial-strength reliability and bespoke aesthetics.',
    features: [
      'Custom Hydrogen/Remix Headless Builds',
      'Advanced Liquid Theme Development',
      'Shopify Functions & App Bridge Integration',
      'One-Click Checkout Optimization',
      'ERP & Inventory Management Sync',
      '99th Percentile Performance Tuning',
      'Subscription Model Architecture'
    ],
    pricing: [
      { tier: 'Starter', price: '$5,000+', features: ['Custom Liquid Theme', 'Standard Apps', 'SEO Setup'] },
      { tier: 'Professional', price: '$12,000+', features: ['Bespoke UX Design', 'Conversion Hooks', '3rd Party Sync'] },
      { tier: 'Enterprise', price: '$35,000+', features: ['Headless Hydrogen', '24/7 Support', 'Custom Middleware'] }
    ],
    timeline: '4 - 12 Weeks',
    clientInputs: [
      'Product SKU Catalog & CSVs',
      'Brand Style Guide (Logos/Fonts)',
      'Payment Gateway Access',
      'Shipping Policy Requirements'
    ],
    workflow: [
      { stage: 'Discovery', description: 'Tech stack audit and conversion mapping.', milestone: 'Tech Spec Signed' },
      { stage: 'UX Design', description: 'Interactive wireframes and high-fidelity mockups.', milestone: 'UI Approved' },
      { stage: 'Engineering', description: 'Frontend coding and backend integration.', milestone: 'Staging Link' },
      { stage: 'QA/Audit', description: 'Cross-browser testing and speed optimization.', milestone: 'Audit Pass' },
      { stage: 'Launch', description: 'Domain cutover and live monitoring.', milestone: 'Store Live' }
    ],
    deliverablesTemplates: [
      { type: 'Development Agreement', structure: ['Scope of Work', 'IP Transfer Clause', 'Maintenance Terms'] },
      { type: 'Technical Audit', structure: ['Lighthouse Scores', 'Core Web Vitals', 'App Analysis'] }
    ]
  },
  {
    id: 'social',
    name: 'Social Media Management',
    tagline: 'Aggressive Brand Scaling through Viral Resonance',
    icon: Share2,
    description: 'The social landscape is no longer about "posting updates"; it is about platform-native storytelling and algorithmic dominance. Our Social Media Management service combines high-end creative production with analytical data-mining to ensure your brand stays at the center of the cultural conversation. We manage your end-to-end presence across Instagram, TikTok, LinkedIn, and X, creating customized content clusters for each medium. From high-energy short-form video production to deep LinkedIn thought leadership, we focus on engagement metrics that actually translate into pipeline. Our team monitors global trends in real-time, allowing your brand to react with agility. We dont just grow your follower count; we build a community of brand advocates that drives organic reach and lowers your overall customer acquisition cost (CAC).',
    features: [
      'Platform-Specific Content Strategy',
      'Short-Form Video (Reels/TikTok) Production',
      'Community Management & Growth',
      'Influencer Coordination',
      'Advanced Sentiment Analysis',
      'Unified Analytics Reporting'
    ],
    pricing: [
      { tier: 'Growth', price: '$2,500/mo', features: ['2 Platforms', '3 Posts/Week', 'Basic Growth'] },
      { tier: 'Elite', price: '$6,000/mo', features: ['4 Platforms', 'Daily Content', 'Video Production'] },
      { tier: 'Empire', price: '$12,000/mo', features: ['Full Omnichannel', 'Influencers', 'Paid Booster'] }
    ],
    timeline: 'Monthly Retainer',
    clientInputs: [
      'Access to Brand Assets',
      'Target Audience Personas',
      'Voice & Tone Guidelines',
      'Product/Service Feature List'
    ],
    workflow: [
      { stage: 'Onboarding', description: 'Account access and brand voice sync.', milestone: 'Voice Guide' },
      { stage: 'Content Calendar', description: 'Planning 30 days of platform-native posts.', milestone: 'Calendar Approval' },
      { stage: 'Production', description: 'Video editing, copywriting, and design.', milestone: 'Asset Vault Complete' },
      { stage: 'Execution', description: 'Daily posting and active engagement.', milestone: 'Live Monitoring' },
      { stage: 'Analysis', description: 'Monthly performance data and pivot strategies.', milestone: 'Performance Report' }
    ],
    deliverablesTemplates: [
      { type: 'Content Calendar', structure: ['Post Date', 'Caption', 'Asset Link', 'KPI Goal'] },
      { type: 'Monthly Report', structure: ['Reach', 'Engagement Rate', 'Inbound Leads'] }
    ]
  },
  {
    id: 'leads',
    name: 'Lead Generation',
    tagline: 'Precision-Targeted Inbound Pipeline Engines',
    icon: Users,
    description: 'Our Lead Generation engines are built for high-ticket service businesses and B2B enterprises where quality beats quantity every time. We deploy a multi-channel approach involving cold outreach automation, landing page optimization, and intent-based targeting. Unlike generic lead providers, we architect custom "Lead Magnets" and interactive funnels that pre-qualify prospects before they ever land in your CRM. We utilize advanced scraping and enrichment tools to identify key decision-makers and reach them through personalized, high-deliverability email sequences and LinkedIn automation. Our goal is to fill your calendar with appointments, not just names in a spreadsheet. We provide a real-time dashboard that tracks every touchpoint, giving you full visibility into which channels are driving the highest ROI for your sales team.',
    features: [
      'Multi-Channel Prospecting',
      'Landing Page CRO & Funnel Logic',
      'Automated Cold Outreach Architecture',
      'Lead Scoring & Qualification Systems',
      'CRM Integration (HubSpot/Salesforce)',
      'A/B Testing Content Arrays'
    ],
    pricing: [
      { tier: 'Trial', price: '$3,500/mo', features: ['1 Channel', '500 Qualified Prospects', 'Funnel Setup'] },
      { tier: 'Standard', price: '$7,500/mo', features: ['3 Channels', '1500 Prospects', 'Automation'] },
      { tier: 'Scale', price: '$15,000/mo', features: ['Global Outreach', 'Account Based Marketing', 'Dedicated SDR'] }
    ],
    timeline: 'Ongoing / Bi-Weekly Sprints',
    clientInputs: [
      'Ideal Customer Profile (ICP)',
      'Sales Deck/Case Studies',
      'CRM API Keys',
      'Internal Sales Team Capacity'
    ],
    workflow: [
      { stage: 'ICP Deep-Dive', description: 'Defining the exact target decision-maker.', milestone: 'ICP Signed' },
      { stage: 'Engine Build', description: 'Setting up outreach domains and funnel pages.', milestone: 'System Online' },
      { stage: 'Data Enrichment', description: 'Harvesting and cleaning prospect lists.', milestone: 'First 1k List' },
      { stage: 'Launch', description: 'Activating outreach and ad campaigns.', milestone: 'First Match' },
      { stage: 'Optimization', description: 'Iterating on copy and targeting based on response.', milestone: 'CPL Target Hit' }
    ],
    deliverablesTemplates: [
      { type: 'Lead Manifest', structure: ['Company', 'Contact', 'Intent Score', 'Source'] },
      { type: 'Funnel Blueprint', structure: ['User Journey', 'Conversion Triggers', 'Follow-up Logic'] }
    ]
  },
  {
    id: 'ppc',
    name: 'Google Ads PPC',
    tagline: 'High-Intent Search Dominance & Predictable ROAS',
    icon: Target,
    description: 'Google Ads is the most powerful tool for capturing demand at the exact moment of intent. Our PPC Performance service is rooted in a "Profit-First" philosophy. We don’t care about vanity metrics like impressions; we care about the efficiency of your spend and the volume of conversions. Our strategy involves deep keyword research, negative keyword management, and a focus on "Quality Score" to ensure you pay less for the top positions. We leverage Google s AI bidding models while maintaining strict human oversight to prevent budget bleeding. Whether it’s Local Service Ads, Shopping Feed optimization, or high-level Search campaigns, our focus remains on scaling the "Winning" sets and ruthlessly cutting underperformers. Every dollar is tracked, from the first click to the final purchase or lead form submission.',
    features: [
      'Search, Display & YouTube Ad Management',
      'Google Shopping Feed Optimization',
      'Advanced Remarketing Sequences',
      'Negative Keyword Guarding',
      'Smart-Bidding Algorithm Tuning',
      'Dynamic Keyword Insertion'
    ],
    pricing: [
      { tier: 'Basic', price: '$1,500/mo + spend', features: ['Up to $5k Spend', 'Weekly Reports'] },
      { tier: 'Pro', price: '$4,000/mo + spend', features: ['Up to $25k Spend', 'BI Dashboard'] },
      { tier: 'Enterprise', price: '15% of Spend', features: ['Unlimited Spend', 'Dedicated Strategist'] }
    ],
    timeline: 'Immediate Activation',
    clientInputs: [
      'Google Ads Account Access',
      'Conversion Tracking Tags',
      'Budget Monthly Allocation',
      'Competitor List'
    ],
    workflow: [
      { stage: 'Audit', description: 'Analyzing historical spend and waste.', milestone: 'Audit Report' },
      { stage: 'Keyword Research', description: 'Identifying high-intent search terms.', milestone: 'Keyword Map' },
      { stage: 'Campaign Structuring', description: 'Architecting ad groups and copy.', milestone: 'Account Setup' },
      { stage: 'Live Launch', description: 'Turning on campaigns and monitoring bids.', milestone: 'First Conversion' },
      { stage: 'Bid Optimization', description: 'Daily adjustments for maximum ROAS.', milestone: 'Target ROAS Hit' }
    ],
    deliverablesTemplates: [
      { type: 'PPC Strategy', structure: ['Keyword Groups', 'Ad Copy Variants', 'Budget Split'] },
      { type: 'Monthly ROI Audit', structure: ['Total Spend', 'Conversion Value', 'ROAS Analysis'] }
    ]
  },
  {
    id: 'seo',
    name: 'SEO Hub',
    tagline: 'Dominating Organic High-Ground for the Long Game',
    icon: Search,
    description: 'SEO in the AI era is no longer about keyword stuffing; it is about "Information Gain" and topical authority. Our SEO Hub service delivers a three-pronged attack: Technical Architecture, Content Authority, and Backlink Power. We start by ensuring your sites foundation is lightning-fast and perfectly indexable. We then engineer content clusters that prove to Google you are a master of your niche. Finally, we execute ethical, high-authority link-building campaigns that build the long-term domain trust required to rank for competitive terms. SEO is an investment in your most valuable digital asset—your own organic visibility. While PPC captures existing demand, SEO builds a moat around your brand that grows in compound value over time.',
    features: [
      'Technical SEO Audits & Remediation',
      'Topical Authority Cluster Planning',
      'White-Hat Backlink Acquisition',
      'Schema Markup & Rich Snippets',
      'Local SEO & GMB Optimization',
      'Core Web Vitals Performance'
    ],
    pricing: [
      { tier: 'Local', price: '$2,000/mo', features: ['GMB Optimization', 'Local Citations'] },
      { tier: 'Authority', price: '$5,000/mo', features: ['Technical SEO', '4 Content Assets'] },
      { tier: 'Dominator', price: '$10,000/mo', features: ['Full Content Hub', 'Link Building'] }
    ],
    timeline: '6 - 12 Months for results',
    clientInputs: [
      'Search Console Access',
      'Primary Domain Access',
      'Content Topic Suggestions',
      'Existing Content Inventory'
    ],
    workflow: [
      { stage: 'Technical Audit', description: 'Identifying crawl errors and speed issues.', milestone: 'Teal Audit Passed' },
      { stage: 'Keyword Mapping', description: 'Planning a 12-month authority roadmap.', milestone: 'Topic Clusters Signed' },
      { stage: 'Content Creation', description: 'Writing 10x content for the clusters.', milestone: 'First 5 Articles Live' },
      { stage: 'Link Building', description: 'Outreach for high-authority placements.', milestone: '5 High-DA Links' },
      { stage: 'Reporting', description: 'Tracking ranking growth and organic traffic.', milestone: 'Quarterly Ranking Win' }
    ],
    deliverablesTemplates: [
      { type: 'SEO Roadmap', structure: ['Technical fixes', 'Keyword priorities', 'Content plan'] },
      { type: 'Backlink Report', structure: ['Linking URL', 'Domain Authority', 'Anchor Text'] }
    ]
  },
  {
    id: 'content',
    name: 'Content Lab',
    tagline: 'High-Conversion Copywriting & Narrative Engineering',
    icon: PenTool,
    description: 'Content is the heartbeat of all digital marketing. In our Content Lab, we specialize in high-conversion copywriting that turns passive readers into active customers. We dont just write "blogs"; we craft narrative assets that solve problems, build trust, and drive action. Our services include multi-channel ad copy, email marketing automation, technical whitepapers, and brand messaging guides. Every piece of content is engineered for a specific stage of the buyers journey—Awareness, Consideration, or Decision. We combine the speed of AI-assisted drafting with the nuace and emotional intelligence of senior human editors. The result is content that resonates with your audience and ranks in the search engines, providing a double-win for your marketing ecosystem.',
    features: [
      'Conversion-Optimized Sales Pages',
      'Technical Blog & Article Creation',
      'Email Marketing Automation Copy',
      'Brand Voice & Messaging Frameworks',
      'Ad Creative Copywriting',
      'Waitlist & Launch Sequences'
    ],
    pricing: [
      { tier: 'Pulse', price: '$1,500/mo', features: ['4 Articles', '10 Social Captions'] },
      { tier: 'Growth', price: '$4,000/mo', features: ['8 Articles', 'Email Series', 'Ads'] },
      { tier: 'Authority', price: '$8,000/mo', features: ['Video Scripts', 'Whitepapers', 'Unlimited Prep'] }
    ],
    timeline: 'Weekly Delivery',
    clientInputs: [
      'Brand messaging goals',
      'Target reader persona',
      'Existing high-performing copy',
      'Product specifications'
    ],
    workflow: [
      { stage: 'Briefing', description: 'Alignment on core message and CTA.', milestone: 'Content Brief Approved' },
      { stage: 'Drafting', description: 'Neural-assisted high-speed writing.', milestone: 'First Draft Shared' },
      { stage: 'Editing', description: 'Senior human nuance and brand polish.', milestone: 'Final Draft' },
      { stage: 'SEO Tuning', description: 'Semantic keyword optimization.', milestone: 'SEO Score Pass' },
      { stage: 'Distribution', description: 'Formatting for CMS or email tool.', milestone: 'Content Published' }
    ],
    deliverablesTemplates: [
      { type: 'Copy Deck', structure: ['Headline Variants', 'Body Copy', 'CTA Options'] },
      { type: 'Messaging Guide', structure: ['Value Props', 'Tone Matrix', 'Keywords'] }
    ]
  },
  {
    id: 'web-design',
    name: 'Web Design & Dev',
    tagline: 'Future-Proof UX/UI & High-Performance Engineering',
    icon: Globe,
    description: 'Your website is the face of your business, and first impressions happen in milliseconds. Our Web Design & Development service builds high-performance digital homes that balance aesthetic "wow" with functional utility. We don’t use templates; we build custom components using modern frameworks like React and Next.js. Our design philosophy is rooted in "Conversion UI"—ensuring that every scroll and click leads the user closer to your desired action. We specialize in complex web applications, corporate sites, and high-tech landing pages. Every build is responsive, accessible (ADA compliant), and optimized for the highest possible search engine visibility. We build with a "Headless" mindset, separating the presentation layer from the content so you can scale without ever needing to rebuild from scratch.',
    features: [
      'Custom React/Next.js Architecture',
      'High-Fidelity Figma UX/UI Design',
      'Interaction & Motion Engineering',
      'Headless CMS (Sanity/Contentful)',
      'ADA/Accessibility Compliance',
      'Global Edge CDN Speed Optimization'
    ],
    pricing: [
      { tier: 'Essentials', price: '$8,000', features: ['5 Pages', 'Next.js Build', 'CMS'] },
      { tier: 'Custom', price: '$20,000+', features: ['Full Figma Design', 'Integrations'] },
      { tier: 'Platform', price: '$50,000+', features: ['Web App Dev', 'User Auth', 'API Build'] }
    ],
    timeline: '6 - 16 Weeks',
    clientInputs: [
      'Sitemap/Architecture requirements',
      'Competitor visual references',
      'Asset library (Images/Videos)',
      'Functional Requirements doc'
    ],
    workflow: [
      { stage: 'Wireframing', description: 'Structural layout and user flows.', milestone: 'Sitemap Signed' },
      { stage: 'Visual Identity', description: 'Color systems and UI components.', milestone: 'Design Approved' },
      { stage: 'Development', description: 'Clean-code frontend engineering.', milestone: 'Alpha Site' },
      { stage: 'Integration', description: 'Connecting CMS and external APIs.', milestone: 'Beta Site (Live Data)' },
      { stage: 'Launch', description: 'Final testing and server deployment.', milestone: 'Success Go-Live' }
    ],
    deliverablesTemplates: [
      { type: 'UI Kit', structure: ['Typography', 'Color PAL', 'Component Props'] },
      { type: 'Site Manual', structure: ['CMS Guide', 'Tech Architecture', 'Deployment Flow'] }
    ]
  },
  {
    id: 'hosting',
    name: 'Web Hosting & Maintenance',
    tagline: 'Industrial-Strength Digital Infrastructure & Security',
    icon: Server,
    description: 'A great website is useless if it’s offline or slow. Our Managed Hosting & Maintenance service provides industrial-strength digital security and uptime for high-traffic sites. We don’t use "Shared Hosting"; we deploy your application on Google Cloud or AWS with a global Content Delivery Network (CDN). We handle the boring but critical tasks: daily encrypted backups, real-time security monitoring, and regular software updates. Our goal is to make your website "Invisible"—it just works, it’s always fast, and you never have to think about it. If there’s ever a spike in traffic, our infrastructure scales automatically to handle the load. We provide a 99.9% uptime guarantee and a dedicated response team for any emergencies.',
    features: [
      'Managed Cloud Infrastructure (GCP/AWS)',
      'Global Edge CDN & Web Application Firewall',
      'Daily Encrypted Database Backups',
      '24/7 Uptime & Malware Monitoring',
      'Monthly Security & Core Patching',
      'Unlimited SSL & Dynamic Scaling'
    ],
    pricing: [
      { tier: 'Business', price: '$99/mo', features: ['Cloud Server', 'Daily Backups'] },
      { tier: 'Performance', price: '$299/mo', features: ['High Traffic', 'Advanced WAF'] },
      { tier: 'Enterprise', price: '$999/mo', features: ['Dedicated Node', 'Full Compliance'] }
    ],
    timeline: 'Always Active',
    clientInputs: [
      'Domain Registrar Access',
      'Existing Hosting Credentials',
      'Traffic Volume Projections',
      'Primary Admin Contacts'
    ],
    workflow: [
      { stage: 'Site Assessment', description: 'Analyzing current load and security.', milestone: 'Audit Report' },
      { stage: 'Migration', description: 'Zero-downtime transfer to our Cloud nodes.', milestone: 'Migration Success' },
      { stage: 'Hardening', description: 'Setting up WAF and SSL security protocols.', milestone: 'Secure Cert Issued' },
      { stage: 'Monitoring', description: 'Initial 7-day stable monitoring phase.', milestone: 'Stability Baseline' },
      { stage: 'Monthly Ops', description: 'Ongoing patches and performance reports.', milestone: 'Monthly Managed' }
    ],
    deliverablesTemplates: [
      { type: 'Security Audit', structure: ['Vulnerabilities', 'Patches', 'Attack Logs'] },
      { type: 'Uptime Report', structure: ['Availability %', 'Peak Traffic', 'Page Speed'] }
    ]
  }
];
