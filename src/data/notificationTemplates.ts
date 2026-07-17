
export interface NotificationScenario {
  id: string;
  category: 'Project' | 'Billing' | 'Security' | 'System';
  title: string;
  message: string;
  action?: string;
}

export const notificationTemplates: NotificationScenario[] = [
  { id: 'proj-01', category: 'Project', title: "Milestone Reached", message: "Stage 2 (UX Design) is now complete for your Shopify build. Please review mockups.", action: "Review Design" },
  { id: 'proj-02', category: 'Project', title: "Feedback Required", message: "Your Account Manager has left 3 comments on the latest SEO Hub report.", action: "View Comments" },
  { id: 'proj-03', category: 'Project', title: "New File Uploaded", message: "Technical Lead uploaded 'Sitemap_v4.pdf' to your project vault.", action: "Download File" },
  { id: 'proj-04', category: 'Project', title: "Sprint Started", message: "Weekly sprint for Lead Gen has commenced. Tracking 500+ new prospects.", action: "View Progress" },
  { id: 'proj-05', category: 'Project', title: "Approval Granted", message: "Your approval for 'PPC Budget Shift' has been logged. Changes live in 1h.", action: "View History" },
  
  { id: 'bill-01', category: 'Billing', title: "Invoice Generated", message: "Your invoice for May 2026 retainers is ready for payment.", action: "Pay Now" },
  { id: 'bill-02', category: 'Billing', title: "Payment Successful", message: "Thank you! Your payment of $4,500 has been processed successfully.", action: "View Receipt" },
  { id: 'bill-03', category: 'Billing', title: "Payment Failed", message: "Urgent: Your last payment attempt was declined. Please verify billing info.", action: "Update Billing" },
  { id: 'bill-04', category: 'Billing', title: "Upcoming Renewal", message: "Your 'SEOHub Dominator' plan renews in 3 days. Total: $10,000.", action: "Manage Subscription" },
  { id: 'bill-05', category: 'Billing', title: "Subscription Paused", message: "Your request to pause Social Media management has been confirmed.", action: "Resume Anytime" },

  { id: 'sec-01', category: 'Security', title: "New Login Detected", message: "A login was detected from a new device in London, UK. Was this you?", action: "Secure Account" },
  { id: 'sec-02', category: 'Security', title: "Password Changed", message: "Your portal password was successfully updated 5 minutes ago.", action: "Contact Support" },
  { id: 'sec-03', category: 'Security', title: "API Key Generated", message: "A new Lead Gen API key has been created for your enterprise dashboard.", action: "Manage Keys" },

  { id: 'sys-01', category: 'System', title: "Maintenance Alert", message: "Portal will be undergoing scheduled maintenance tonight at 02:00 AM EST.", action: "Learn More" },
  { id: 'sys-02', category: 'System', title: "New Feature: AI Chat", message: "You can now chat directly with your project data using our new AI interface.", action: "Try It Now" },
  { id: 'sys-03', category: 'System', title: "Terms Updated", message: "We have updated our Master Services Agreement. Please review.", action: "Review Terms" }
];

export const emailSequences = {
  welcome: [
    { subject: "Welcome to the Machine - Initializing Your Agency Portal", body: "Hello {name}, your account is live. Here is how we start..." },
    { subject: "Phase 1: Setting Your Strategic North Star", body: "Data shows that businesses with clear KPIs scale 3x faster. Let's set yours." },
    { subject: "Deep Dive: Meeting Your Dedicated Strategist", body: "Schedule your kickoff call with our Technical Director to finalize your roadmap." }
  ],
  latePayment: [
    { tier: "Gentle", subject: "Friendly Reminder: Invoice {id} is Overdue", body: "Life gets busy. We noticed your payment is 24h past due..." },
    { tier: "Urgent", subject: "Action Required: Avoiding Service Suspension", body: "Your account is now 5 days overdue. Please update your billing info today." },
    { tier: "Final", subject: "Immediate Notice: Services Paused", body: "As per our late payment policy, active work has been paused until payment is received." }
  ]
};
