import { 
  Activity, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Zap, 
  MousePointer2, 
  Users,
  DollarSign,
  Calculator
} from 'lucide-react';

export interface KPI {
  id: string;
  name: string;
  formula: string;
  definition: string;
  target: string;
  current: string;
}

export const agencyKPIs: KPI[] = [
  { id: 'cac', name: 'CAC', formula: 'Total Spend / Total Customers', definition: 'Global Customer Acquisition Cost across all tracked ad accounts.', target: '< $45.00', current: '$42.10' },
  { id: 'roas', name: 'ROAS', formula: 'Revenue / Ad Spend', definition: 'Return on Ad Spend specifically for PPC and Social Ad channels.', target: '> 4.0x', current: '4.8x' },
  { id: 'lvt', name: 'LTV', formula: 'Avg Order Value * Purchase Frequency', definition: 'Predicted Lifetime Value of a single acquired customer over 24 months.', target: '> $450', current: '$512' },
  { id: 'mer', name: 'MER', formula: 'Total Revenue / Total Marketing Spend', definition: 'Marketing Efficiency Ratio - the broad indicator of organic + paid health.', target: '> 6.0x', current: '7.2x' }
];

export const leadScoringLogic = [
  { criteria: 'Industry Match', weight: 30, description: 'E-commerce or High-Ticket SaaS gets priority.' },
  { criteria: 'Revenue Tier', weight: 25, description: '> $1M annual revenue adds significant weight.' },
  { criteria: 'Ad Spend Intent', weight: 20, description: 'Actively spending > $5k/mo on Google/Meta.' },
  { criteria: 'Engagement', weight: 15, description: 'Number of pages visited in the Strategy Lab.' },
  { criteria: 'Lead Source', weight: 10, description: 'Inbound search leads score higher than cold outreach.' }
];

export const automationTriggers = [
  { trigger: 'New Lead Captured', action: 'Slack Alert + CRM Entry', template: '🚨 *New Elite Lead:* {company_name} just entered the funnel. Industry: {industry}. Est. Value: {value}.' },
  { trigger: 'Proposal Viewed', action: 'Account Manager SMS', template: '🔔 *Alert:* The proposal for {project_name} is being viewed right now. Ready for follow-up?' },
  { trigger: 'Payment Late 24h', action: 'Auto-Sequence Start', template: 'Subject: Friendly Reminder: {invoice_id}. Content: "Life gets busy, but we noticed..."' },
  { trigger: 'Report Ready', action: 'Email Dispatch', template: 'Hello {client_name}, your {month} Growth Audit is live in the vault.' }
];
