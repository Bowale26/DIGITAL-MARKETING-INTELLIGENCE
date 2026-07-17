export const achievementSystem = {
  badges: [
    { name: 'Growth Hacker', description: 'Increased ROAS by 50% in 30 days.', icon: 'Zap' },
    { name: 'Liquid Master', description: 'Custom Liquid function deployed to production.', icon: 'Code' },
    { name: 'Ads Architect', description: 'Built a 10+ Ad Group campaign structure.', icon: 'Target' },
    { name: 'Social Ninja', description: 'Reached 100k impressions on a single post.', icon: 'Smile' },
    { name: 'Conversion King', description: 'Achieved a check-out conversion rate > 5%.', icon: 'ShoppingCart' },
    { name: 'Neural Pioneer', description: 'Generated 100+ creative assets using Cortex AI.', icon: 'BrainCircuit' },
    { name: 'SEO Titan', description: 'Ranked #1 for a high-volume keyword.', icon: 'Search' },
    { name: 'Affiliate Pro', description: 'Referred 5+ successful merchants to Flux.', icon: 'Users' }
  ],
  levels: [
    { level: 1, title: 'Seed', xpRequired: 0 },
    { level: 5, title: 'Sprout', xpRequired: 5000 },
    { level: 10, title: 'Branch', xpRequired: 15000 },
    { level: 25, title: 'Oak', xpRequired: 50000 },
    { level: 50, title: 'Forest', xpRequired: 150000 },
    { level: 100, title: 'Ecosystem', xpRequired: 500000 }
  ],
  leaderboards: ['Global ROAS', 'SEO Dominance', 'Creative Output', 'Community Impact']
};

export const educationalContent = {
  courses: [
    { id: 'tier_1', title: 'Hydrogen & Remix Basics', lessons: 12, level: 'Beginners' },
    { id: 'tier_2', title: 'Semantic SEO Mastery', lessons: 15, level: 'Intermediate' },
    { id: 'tier_3', title: 'Advanced Cortex Prompting', lessons: 8, level: 'Advanced' },
    { id: 'tier_4', title: 'Scaling to $100k/day', lessons: 20, level: 'Expert' }
  ],
  certificationTypes: ['Shopify Forge Certified', 'Ads Command Expert', 'Content Strategy Professional'],
  quizCount: 124
};

export const communityFeatures = {
  forumCategories: [
    { name: 'Growth Strategy', threads: 1240 },
    { name: 'Technical Dev', threads: 856 },
    { name: 'Design Critiques', threads: 432 },
    { name: 'General Support', threads: 2105 }
  ],
  expertQA: [
    { expert: 'Sarah J.', role: 'Head of Growth', available: true },
    { expert: 'Marcus K.', role: 'Shopify Lead', available: false }
  ],
  referralReward: '$500 Credit per active merchant signup'
};
