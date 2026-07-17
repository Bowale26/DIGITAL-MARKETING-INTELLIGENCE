
export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Technical' | 'Billing' | 'Support';
}

export const faqDatabase: FAQItem[] = [
  // General
  { question: "What is Digital Marketing Intelligence?", answer: "We are a full-stack digital marketing engine that uses proprietary AI to scale businesses through high-performance Shopify development, PPC, SEO, and lead generation.", category: "General" },
  { question: "How do I get started?", answer: "Simply select a service from our dashboard or contact our strategy lab for a custom growth blueprint.", category: "General" },
  { question: "Where is your team located?", answer: "We operate as a decentralized global agency with strategic hubs in London, New York, and Singapore.", category: "General" },
  { question: "Do you offer a free consultation?", answer: "Yes, every new client is entitled to a 30-minute AI Strategy audit.", category: "General" },
  { question: "Can I manage multiple businesses under one account?", answer: "Yes, our Master Command Center allows you to switch between different business entities seamlessly.", category: "General" },
  { question: "Is my data secure?", answer: "We use military-grade encryption (AES-256) for all client data and project files.", category: "General" },
  { question: "How do you use AI in your process?", answer: "AI powers our research, copywriting drafting, and predictive analytics, while human experts handle final strategy and precision execution.", category: "General" },
  { question: "What industries do you specialize in?", answer: "We excel in E-commerce (Shopify), SaaS, Professional Services, and High-Ticket B2B Lead Gen.", category: "General" },
  { question: "Do you have a referral program?", answer: "Yes, partners receive 10% lifetime commission on any referred client retainers.", category: "General" },
  { question: "How do I contact my account manager?", answer: "You can message them directly through the Project Dashboard communication thread.", category: "General" },

  // Services
  { question: "How long does a Shopify build take?", answer: "Standard builds take 4-6 weeks; complex headless Hydrogen projects take 12+ weeks.", category: "Services" },
  { question: "What SEO results can I expect in 3 months?", answer: "SEO is a long-term play. In 3 months, we focus on technical remediation and initial ranking improvements for long-tail keywords.", category: "Services" },
  { question: "How do you guarantee lead quality?", answer: "We use multi-step verification including automated LinkedIn checks and intent-based filtering.", category: "Services" },
  { question: "Can you manage my existing Google Ads account?", answer: "Yes, we prefer to audit and optimize existing accounts to leverage historical data.", category: "Services" },
  { question: "Do you provide video production for social media?", answer: "Yes, our Social Media Empire plan includes full short-form video production.", category: "Services" },
  { question: "What is 'Headless' Web Design?", answer: "It is separating the frontend (what you see) from the backend (data), resulting in lightning-fast speeds and infinite scalability.", category: "Services" },
  { question: "Do you offer content in multiple languages?", answer: "Yes, we support English, Spanish, French, German, and Mandarin content creation.", category: "Services" },
  { question: "What is your revision policy?", answer: "We provide two rounds of major revisions for all creative deliverables.", category: "Services" },
  { question: "Can you help with brand identity?", answer: "Logo and brand system design are included in our Custom and Platform Web Design tiers.", category: "Services" },
  { question: "Do you provide hosting for non-agency clients?", answer: "Our hosting infrastructure is reserved for clients who manage their web projects through our portal.", category: "Services" },

  // Technical
  { question: "What tech stack do you use for web dev?", answer: "We primarily build with React, Next.js, Tailwind CSS, and headless Shopify (Hydrogen).", category: "Technical" },
  { question: "How often are backups performed?", answer: "All projects are backed up every 24 hours to geographically redundant servers.", category: "Technical" },
  { question: "Do you provide API access to my lead data?", answer: "Yes, we provide webhooks and a REST API for Enterprise Lead Gen clients.", category: "Technical" },
  { question: "What CDN do you use?", answer: "We utilize Google Cloud CDN and Cloudflare for global asset delivery.", category: "Technical" },
  { question: "Is my site ADA compliant?", answer: "Our Web Design tiers include Level AA WCAG 2.1 compliance audits.", category: "Technical" },
  { question: "Do you monitor for malware?", answer: "Yes, we have 24/7 real-time monitoring and automated threat mitigation in place.", category: "Technical" },
  { question: "Can I use my own domain registrar?", answer: "Yes, you can manage your domain at your preferred registrar and point DNS to our nodes.", category: "Technical" },
  { question: "Do you support WordPress?", answer: "We occasionally support headless WordPress, but we prefer modern JS frameworks for performance.", category: "Technical" },
  { question: "What is your server uptime guarantee?", answer: "We maintain a 99.9% uptime SLA for all managed hosting clients.", category: "Technical" },
  { question: "How do I report a bug?", answer: "Submit a Technical Ticket through the Support Center for immediate triaging.", category: "Technical" },

  // Billing
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, Stripe, PayPal, and Wire Transfers for Enterprise accounts.", category: "Billing" },
  { question: "Are your retainers month-to-month?", answer: "Yes, most of our services are on a flexible monthly rolling basis, unless otherwise specified in a custom contract.", category: "Billing" },
  { question: "How do I update my billing info?", answer: "Go to Billing System > Subscription Management in your portal.", category: "Billing" },
  { question: "What happens if a payment is late?", answer: "Services may be paused after 7 days of non-payment. We send reminders at 1, 3, and 5 days late.", category: "Billing" },
  { question: "Do you offer refunds?", answer: "We do not offer refunds once work has commenced or service hours have been allocated.", category: "Billing" },
  { question: "Can I pause my subscription?", answer: "Yes, with 15 days notice, you can pause your retainer for up to 3 months.", category: "Billing" },
  { question: "Are there any hidden setup fees?", answer: "All setup fees are clearly outlined in your initial proposal.", category: "Billing" },
  { question: "How do I download my invoices?", answer: "Accessible under Billing > Invoices in your Project Dashboard.", category: "Billing" },
  { question: "Do prices include taxes?", answer: "Pricing is exclusive of VAT/Sales Tax which will be calculated based on your location.", category: "Billing" },
  { question: "Can I pay annually for a discount?", answer: "Yes, we offer a 15% discount for annual upfront payments on all retainers.", category: "Billing" },

  // Support
  { question: "What are your support hours?", answer: "Standard support is 9 AM - 6 PM (EST). Enterprise clients have 24/7 emergency access.", category: "Support" },
  { question: "How long is the ticket response time?", answer: "We aim to respond to all tickets within 4 hours during business hours.", category: "Support" },
  { question: "What is the escalation path?", answer: "Ticket > Account Manager > Head of Strategy > Executive Support.", category: "Support" },
  { question: "Do you have a live chat?", answer: "Yes, available for logged-in clients during business hours.", category: "Support" },
  { question: "Can I request a video call?", answer: "Yes, meetings can be scheduled through your Account Manager through the dashboard.", category: "Support" },
  { question: "How do I delete my account?", answer: "Please contact Privacy Support to initiate the account deletion and data scrubbing process.", category: "Support" },
  { question: "Where do I find my contract?", answer: "Stored under Project Dashboard > Legal in your portal.", category: "Support" },
  { question: "Can I change my account manager?", answer: "If you feel your current manager isn't a fit, please contact support for a re-assignment review.", category: "Support" },
  { question: "Do you provide training for the portal?", answer: "Yes, we offer a 1-on-1 walkthrough during your onboarding phase.", category: "Support" },
  { question: "How do I suggest a new feature?", answer: "We love feedback! Submit a 'Feature Request' ticket in the Support Center.", category: "Support" },
];

export const escalationPaths = [
  { level: 1, name: "Support Tier I", time: "< 4 Hours", description: "General inquiries and basic technical troubleshooting." },
  { level: 2, name: "Account Strategist", time: "< 12 Hours", description: "Project-specific questions, timeline changes, and strategy pivots." },
  { level: 3, name: "Technical Lead / Creative Director", time: "< 24 Hours", description: "Complex code issues or high-level design revisions." },
  { level: 4, name: "Executive Support", time: "< 48 Hours", description: "Contract disputes, major complaints, or partnership discussions." }
];
