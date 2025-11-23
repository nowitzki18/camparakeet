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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-12 text-center border border-white/50">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Campaigns Yet</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Create your first campaign to get started with Camparakeet.
            </p>
            <Link
              href="/wizard"
              className="inline-block bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Create New Campaign
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaign Dashboard</h1>
            <p className="text-gray-600">Monitor and manage all your campaigns</p>
          </div>
          <Link
            href="/wizard"
            className="group bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Campaign
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 border border-white/50 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Campaigns
              </h2>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => {
                      setSelectedCampaignId(campaign.id);
                      router.push(`/dashboard?campaign=${campaign.id}`);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedCampaignId === campaign.id
                        ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-medium'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{campaign.campaignName}</h3>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{campaign.goal}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {campaign.channels?.map((channel) => (
                        <span
                          key={channel}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>${campaign.budgetAmount.toFixed(2)}</span>
                      <span>{campaign.businessName}</span>
                    </div>
                    {campaign.locations && campaign.locations.filter(loc => loc.name.trim()).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {campaign.locations.filter(loc => loc.name.trim()).length} location{campaign.locations.filter(loc => loc.name.trim()).length > 1 ? 's' : ''} · {
                          campaign.locations.filter(loc => loc.name.trim()).length > 0
                            ? `${Math.min(...campaign.locations.filter(loc => loc.name.trim()).map(loc => loc.radiusKm))}–${Math.max(...campaign.locations.filter(loc => loc.name.trim()).map(loc => loc.radiusKm))} km`
                            : ''
                        }
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCampaign ? (
              <>
                {/* Campaign Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 border border-white/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedCampaign.campaignName}</h2>
                      <p className="text-gray-600 mt-1">{selectedCampaign.businessName}</p>
                    </div>
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-xl ${
                        selectedCampaign.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedCampaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Goal</p>
                      <p className="text-sm font-bold text-gray-900 break-words">{selectedCampaign.goal}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Budget</p>
                      <p className="text-sm font-bold text-gray-900">
                        ${selectedCampaign.budgetAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Start</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedCampaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">End</p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedCampaign.endDate
                          ? new Date(selectedCampaign.endDate).toLocaleDateString()
                          : 'Continuous'}
                      </p>
                    </div>
                  </div>
                  {selectedCampaign.channels && selectedCampaign.channels.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Channels</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaign.channels.map((channel) => (
                          <span
                            key={channel}
                            className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch w-full">
                  <div className="min-w-0">
                    <MetricCard
                      label="Impressions"
                      value={selectedCampaign.metrics.impressions.toLocaleString()}
                      gradient="blue"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="Clicks"
                      value={selectedCampaign.metrics.clicks.toLocaleString()}
                      gradient="purple"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="CTR"
                      value={`${selectedCampaign.metrics.ctr}%`}
                      subLabel="Click-through rate"
                      gradient="green"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="Conversions"
                      value={selectedCampaign.metrics.conversions.toLocaleString()}
                      gradient="orange"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="Spend"
                      value={`$${selectedCampaign.metrics.spend.toFixed(2)}`}
                      subLabel={`of $${selectedCampaign.budgetAmount.toFixed(2)}`}
                      gradient="pink"
                    />
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-medium">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Performance Over Time</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedCampaign.metrics.dailyPerformance.map((day, index) => {
                      const percentage = (day.clicks / maxClicks) * 100;
                      const minWidth = Math.max(percentage, 8); // Minimum 8% width for visibility
                      const showTextInside = percentage >= 15; // Show text inside bar if wide enough
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-24 text-xs font-semibold text-gray-600">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex-1 flex items-center gap-3 relative">
                            <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-visible shadow-inner">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${minWidth}%`, minWidth: '8%' }}
                              >
                                {showTextInside && (
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white font-bold whitespace-nowrap">
                                    {day.clicks} clicks
                                  </span>
                                )}
                              </div>
                            </div>
                            {!showTextInside && (
                              <span className="text-xs text-cyan-600 font-bold whitespace-nowrap ml-2 flex-shrink-0">
                                {day.clicks} clicks
                              </span>
                            )}
                          </div>
                          <div className="w-24 text-xs text-gray-500 text-right font-medium flex-shrink-0">
                            {day.impressions.toLocaleString()} views
                          </div>
                        </div>
                      );
                    })}
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
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-medium">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                  </div>
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-12 text-center border border-white/50">
                <p className="text-gray-600 text-lg">Select a campaign to view details</p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

