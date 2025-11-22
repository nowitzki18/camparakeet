/**
 * Campaign Store
 * 
 * Simple in-memory store for campaigns. In production, replace with
 * a real database or API calls.
 */

import { Campaign } from '@/types';

// In-memory store
let campaigns: Campaign[] = [];

/**
 * Generate mock performance metrics for a campaign
 */
function generateMockMetrics(budget: number, daysActive: number): Campaign['metrics'] {
  const impressions = Math.floor(1000 + Math.random() * 2000) * daysActive;
  const clicks = Math.floor(50 + Math.random() * 100) * daysActive;
  const ctr = (clicks / impressions) * 100;
  const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.1));
  const spend = Math.min(budget * 0.7 + Math.random() * budget * 0.3, budget);
  
  // Generate daily performance data
  const dailyPerformance = [];
  const today = new Date();
  for (let i = daysActive - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyPerformance.push({
      date: date.toISOString().split('T')[0],
      clicks: Math.floor(clicks / daysActive + (Math.random() - 0.5) * 20),
      impressions: Math.floor(impressions / daysActive + (Math.random() - 0.5) * 200),
    });
  }
  
  return {
    impressions,
    clicks,
    ctr: parseFloat(ctr.toFixed(2)),
    conversions,
    spend: parseFloat(spend.toFixed(2)),
    dailyPerformance,
  };
}

/**
 * Save a new campaign
 */
export function saveCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'metrics'>): Campaign {
  const campaign: Campaign = {
    ...campaignData,
    id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    metrics: generateMockMetrics(
      campaignData.budgetAmount,
      campaignData.endDate 
        ? Math.ceil((new Date(campaignData.endDate).getTime() - new Date(campaignData.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 7 // Default to 7 days if running continuously
    ),
  };
  
  campaigns.push(campaign);
  return campaign;
}

/**
 * Get all campaigns
 */
export function getAllCampaigns(): Campaign[] {
  return [...campaigns];
}

/**
 * Get a campaign by ID
 */
export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id);
}

/**
 * Update campaign status
 */
export function updateCampaignStatus(id: string, status: 'Active' | 'Draft'): Campaign | null {
  const campaign = campaigns.find(c => c.id === id);
  if (campaign) {
    campaign.status = status;
    return campaign;
  }
  return null;
}

