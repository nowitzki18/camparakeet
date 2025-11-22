// Campaign and wizard types

export type BusinessType = 'Retail / D2C' | 'Local Service' | 'Online SaaS' | 'Other';

export type CampaignGoal = 'Website visits' | 'Calls / enquiries' | 'Store visits' | 'Online sales';

export type AudiencePreset = 'Broad – all adults' | 'Local families' | 'Young professionals' | 'Custom description';

export type BudgetType = 'Daily budget' | 'Total budget';

export interface AdCopySuggestion {
  headline: string;
  primaryText: string;
  ctaLabel: string;
}

export interface CampaignWizardData {
  // Step 1
  campaignName: string;
  businessName: string;
  businessType: BusinessType | '';
  goal: CampaignGoal | '';
  
  // Step 2
  location: string;
  radius: string;
  audiencePreset: AudiencePreset | '';
  customAudienceDescription: string;
  
  // Step 3
  budgetType: BudgetType;
  budgetAmount: number;
  startDate: string;
  endDate: string | null; // null means "Run continuously"
  
  // Step 4
  offerDescription: string;
  selectedAdCopy: AdCopySuggestion | null;
  editedAdCopy: AdCopySuggestion | null; // User's edited version
  imageUrl: string | null; // Data URL or placeholder URL
}

export interface Campaign extends CampaignWizardData {
  id: string;
  status: 'Active' | 'Draft';
  createdAt: string;
  // Mock performance metrics
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    spend: number;
    dailyPerformance: Array<{ date: string; clicks: number; impressions: number }>;
  };
}

