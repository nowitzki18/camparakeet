'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllCampaigns, getCampaignById } from '@/lib/campaignStore';
import { generateInsights } from '@/lib/aiMock';
import MetricCard from '@/components/MetricCard';
import TimeOfDayHeatmap, { generateHourlyEngagement } from '@/components/TimeOfDayHeatmap';
import { Campaign } from '@/types';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const allCampaigns = getAllCampaigns();
    setCampaigns(allCampaigns);

    // Check if campaign ID is in URL
    const campaignId = searchParams.get('campaign');
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    } else if (allCampaigns.length > 0) {
      setSelectedCampaignId(allCampaigns[0].id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCampaignId) {
      const campaign = getCampaignById(selectedCampaignId);
      if (campaign) {
        const generatedInsights = generateInsights({
          impressions: campaign.metrics.impressions,
          clicks: campaign.metrics.clicks,
          ctr: campaign.metrics.ctr,
          conversions: campaign.metrics.conversions,
          spend: campaign.metrics.spend,
          budget: campaign.budgetAmount,
        });
        setInsights(generatedInsights);
      }
    }
  }, [selectedCampaignId]);

  const selectedCampaign = selectedCampaignId
    ? getCampaignById(selectedCampaignId)
    : null;

  const maxClicks = selectedCampaign
    ? Math.max(...selectedCampaign.metrics.dailyPerformance.map((d) => d.clicks), 1)
    : 1;

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Campaigns Yet</h1>
            <p className="text-gray-600 mb-8">
              Create your first campaign to get started with Camparakeet.
            </p>
            <Link
              href="/wizard"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Create New Campaign
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
          <Link
            href="/wizard"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Create New Campaign
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Campaigns</h2>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => {
                      setSelectedCampaignId(campaign.id);
                      router.push(`/dashboard?campaign=${campaign.id}`);
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedCampaignId === campaign.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{campaign.campaignName}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{campaign.goal}</p>
                    <p className="text-xs text-gray-500">
                      Budget: ${campaign.budgetAmount.toFixed(2)} • {campaign.businessName}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="lg:col-span-2">
            {selectedCampaign ? (
              <div className="space-y-6">
                {/* Campaign Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.campaignName}</h2>
                      <p className="text-gray-600 mt-1">{selectedCampaign.businessName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded ${
                        selectedCampaign.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedCampaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Goal:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedCampaign.goal}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        ${selectedCampaign.budgetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Start:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(selectedCampaign.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">End:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedCampaign.endDate
                          ? new Date(selectedCampaign.endDate).toLocaleDateString()
                          : 'Continuous'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <MetricCard
                    label="Impressions"
                    value={selectedCampaign.metrics.impressions.toLocaleString()}
                  />
                  <MetricCard
                    label="Clicks"
                    value={selectedCampaign.metrics.clicks.toLocaleString()}
                  />
                  <MetricCard
                    label="CTR"
                    value={`${selectedCampaign.metrics.ctr}%`}
                    subLabel="Click-through rate"
                  />
                  <MetricCard
                    label="Conversions"
                    value={selectedCampaign.metrics.conversions.toLocaleString()}
                  />
                  <MetricCard
                    label="Spend"
                    value={`$${selectedCampaign.metrics.spend.toFixed(2)}`}
                    subLabel={`of $${selectedCampaign.budgetAmount.toFixed(2)}`}
                  />
                </div>

                {/* Performance Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
                  <div className="space-y-3">
                    {selectedCampaign.metrics.dailyPerformance.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 text-xs text-gray-600">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                            <div
                              className="bg-primary-600 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{
                                width: `${(day.clicks / maxClicks) * 100}%`,
                              }}
                            >
                              <span className="text-xs text-white font-medium">
                                {day.clicks} clicks
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-20 text-xs text-gray-500 text-right">
                          {day.impressions.toLocaleString()} views
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time-of-Day Engagement Heatmap */}
                {selectedCampaign && (
                  <TimeOfDayHeatmap
                    hourlyData={generateHourlyEngagement(
                      selectedCampaign.metrics.clicks,
                      selectedCampaign.metrics.impressions
                    )}
                  />
                )}

                {/* Insights */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">Select a campaign to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

