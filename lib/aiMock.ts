/**
 * AI Mock Functions
 * 
 * These functions simulate AI-powered features. Replace with real API calls
 * when integrating with OpenAI or other AI services.
 */

import { AdCopySuggestion, CampaignGoal } from '@/types';

export interface GenerateAdCopyInput {
  businessName: string;
  offer: string;
  goal: CampaignGoal;
  businessType?: string;
}

export function generateAdCopy(input: GenerateAdCopyInput): AdCopySuggestion[] {
  const { businessName, offer, goal, businessType } = input;
  
  const suggestions: AdCopySuggestion[] = [];
  
  if (goal === 'Website visits') {
    suggestions.push(
      {
        headline: `Discover ${businessName} - Your Solution Awaits`,
        primaryText: `${offer}. Visit us today and explore what we have to offer.`,
        ctaLabel: 'Visit Website',
      },
      {
        headline: `Transform Your Experience with ${businessName}`,
        primaryText: `${offer}. Click to learn more and get started.`,
        ctaLabel: 'Learn More',
      },
      {
        headline: `${businessName}: Where Quality Meets Value`,
        primaryText: `${offer}. Browse our website and see why customers choose us.`,
        ctaLabel: 'Explore Now',
      },
    );
  } else if (goal === 'Calls / enquiries') {
    suggestions.push(
      {
        headline: `Get in Touch with ${businessName} Today`,
        primaryText: `${offer}. Call us now for a free consultation and see how we can help.`,
        ctaLabel: 'Call Now',
      },
      {
        headline: `Ready to Get Started? Contact ${businessName}`,
        primaryText: `${offer}. Speak with our team and discover the perfect solution for you.`,
        ctaLabel: 'Contact Us',
      },
      {
        headline: `${businessName} - Your Trusted Partner`,
        primaryText: `${offer}. Reach out today and let's discuss your needs.`,
        ctaLabel: 'Get Quote',
      },
    );
  } else if (goal === 'Store visits') {
    suggestions.push(
      {
        headline: `Visit ${businessName} - Your Local Favorite`,
        primaryText: `${offer}. Stop by our store and experience the difference.`,
        ctaLabel: 'Get Directions',
      },
      {
        headline: `Come See Us at ${businessName}`,
        primaryText: `${offer}. Visit our location and discover what makes us special.`,
        ctaLabel: 'Visit Store',
      },
      {
        headline: `${businessName} - Open Now, Come In!`,
        primaryText: `${offer}. We're here to serve you. Drop by today!`,
        ctaLabel: 'Find Us',
      },
    );
  } else if (goal === 'Online sales') {
    suggestions.push(
      {
        headline: `Shop ${businessName} - Limited Time Offer`,
        primaryText: `${offer}. Add to cart now and enjoy fast, secure checkout.`,
        ctaLabel: 'Shop Now',
      },
      {
        headline: `${businessName}: Your One-Stop Shop`,
        primaryText: `${offer}. Browse our collection and find exactly what you need.`,
        ctaLabel: 'Buy Now',
      },
      {
        headline: `Exclusive Deal at ${businessName}`,
        primaryText: `${offer}. Don't miss out - shop now and save!`,
        ctaLabel: 'Shop Today',
      },
    );
  }
  
  return suggestions.slice(0, 3);
}

export function generateInsights(metrics: {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend: number;
  budget: number;
}): string[] {
  const insights: string[] = [];
  
  const avgCTR = 2.0;
  if (metrics.ctr > avgCTR * 1.2) {
    insights.push(`Your CTR of ${metrics.ctr.toFixed(2)}% is above average for your industry. Consider increasing budget by 20% to scale successful campaigns.`);
  } else if (metrics.ctr < avgCTR * 0.8) {
    insights.push(`Your CTR is below average. Try A/B testing different ad copy or adjusting your audience targeting.`);
  }
  
  const budgetUtilization = (metrics.spend / metrics.budget) * 100;
  if (budgetUtilization < 50) {
    insights.push(`You're only using ${budgetUtilization.toFixed(0)}% of your budget. Consider increasing daily spend to reach more potential customers.`);
  } else if (budgetUtilization > 90) {
    insights.push(`Your budget is nearly exhausted. Campaign is performing well - consider extending the duration or increasing budget.`);
  }
  
  if (metrics.conversions > 0) {
    const conversionRate = (metrics.conversions / metrics.clicks) * 100;
    insights.push(`Your conversion rate is ${conversionRate.toFixed(1)}%. Most engagement happens on weekdays; think about scheduling heavier spend Mon–Fri.`);
  }
  
  if (insights.length === 0) {
    insights.push('Your campaign is performing steadily. Monitor metrics closely and adjust targeting or creative based on performance trends.');
  }
  
  return insights.slice(0, 3);
}


