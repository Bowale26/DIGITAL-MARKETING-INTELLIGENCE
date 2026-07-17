
export interface LeadActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'score_change' | 'stage_change';
  title: string;
  description: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: string;
  stage: string;
  time: string;
  score: number;
  source: string;
  recentActivity: LeadActivity[];
}

export const stages = ['New Leads', 'In Review', 'Engagement', 'Proposal', 'Closing'];

export const initialLeadsData: Lead[] = [
  { 
    id: 'L1', 
    name: 'James Wilson', 
    email: 'james@bluecoffee.com',
    phone: '+1 (555) 123-4567',
    company: 'Blue Coffee D2C', 
    value: '$12,400', 
    stage: 'New Leads', 
    time: '2h ago', 
    score: 92, 
    source: 'Strategy Lab',
    recentActivity: [
      { id: 'a1', type: 'score_change', title: 'Lead Scored', description: 'Score increased by 15 points after Strategy Lab interaction.', timestamp: '2h ago' },
      { id: 'a2', type: 'email', title: 'Welcome Email', description: 'Sent initial intake questionnaire.', timestamp: '3h ago' }
    ]
  },
  { 
    id: 'L2', 
    name: 'Sarah Chen', 
    email: 'sarah@nextauth.io',
    phone: '+1 (555) 987-6543',
    company: 'NextAuth SaaS', 
    value: '$8,500', 
    stage: 'In Review', 
    time: '5h ago', 
    score: 78, 
    source: 'Shopify Audit',
    recentActivity: [
      { id: 'a3', type: 'stage_change', title: 'Stage Updated', description: 'Moved from New Leads to In Review.', timestamp: '5h ago' },
      { id: 'a4', type: 'note', title: 'Initial Audit', description: 'Identified checkout friction points.', timestamp: '1d ago' }
    ]
  },
  { 
    id: 'L3', 
    name: 'Mike Ross', 
    email: 'mike@rosslaw.com',
    phone: '+1 (555) 246-8135',
    company: 'Ross & Co Legal', 
    value: '$25,000', 
    stage: 'Engagement', 
    time: '1d ago', 
    score: 85, 
    source: 'Search Ads',
    recentActivity: [
      { id: 'a5', type: 'call', title: 'Discovery Call', description: 'Discussed legal niche acquisition strategies.', timestamp: '1d ago' }
    ]
  },
  { 
    id: 'L4', 
    name: 'Elena Gilbert', 
    email: 'elena@mystichealth.com',
    phone: '+1 (555) 369-1215',
    company: 'Mystic Health', 
    value: '$15,000', 
    stage: 'Proposal', 
    time: '2d ago', 
    score: 95, 
    source: 'Direct Inbound',
    recentActivity: [
      { id: 'a6', type: 'meeting', title: 'Proposal Review', description: 'Walked through the Q3 growth roadmap.', timestamp: '2d ago' }
    ]
  },
  { 
    id: 'L5', 
    name: 'Harvey Specter', 
    email: 'harvey@pearsonhardman.com',
    phone: '+1 (555) 777-8888',
    company: 'Pearson Hardman', 
    value: '$50,000', 
    stage: 'Closing', 
    time: '3d ago', 
    score: 88, 
    source: 'Referral',
    recentActivity: [
      { id: 'a7', type: 'note', title: 'Contract Draft', description: 'Sent to legal for final review.', timestamp: '3d ago' }
    ]
  },
];
