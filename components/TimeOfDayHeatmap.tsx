'use client';

import React from 'react';

export interface HourlyEngagement {
  hour: number; // 0-23
  clicks: number;
  impressions: number;
  engagement: number; // engagement rate (clicks/impressions)
}

interface TimeOfDayHeatmapProps {
  hourlyData: HourlyEngagement[];
}

/**
 * Generates mock hourly engagement data
 * Simulates typical engagement patterns: higher during business hours, lower at night
 */
export function generateHourlyEngagement(totalClicks: number, totalImpressions: number): HourlyEngagement[] {
  const hourlyData: HourlyEngagement[] = [];
  
  // Typical engagement pattern: peaks during 9-11am, 1-3pm, 7-9pm
  const engagementPattern = [
    0.02, 0.01, 0.01, 0.01, 0.01, 0.02, // 12am-5am: very low
    0.03, 0.04, 0.05, 0.07, 0.08, 0.09, // 6am-11am: increasing
    0.10, 0.11, 0.12, 0.11, 0.10, 0.09, // 12pm-5pm: peak hours
    0.08, 0.09, 0.10, 0.08, 0.05, 0.03, // 6pm-11pm: evening engagement
  ];
  
  // Normalize pattern to sum to 1
  const patternSum = engagementPattern.reduce((a, b) => a + b, 0);
  const normalizedPattern = engagementPattern.map(p => p / patternSum);
  
  for (let hour = 0; hour < 24; hour++) {
    const clicks = Math.floor(totalClicks * normalizedPattern[hour] + (Math.random() - 0.5) * totalClicks * 0.1);
    const impressions = Math.floor(totalImpressions * normalizedPattern[hour] + (Math.random() - 0.5) * totalImpressions * 0.1);
    const engagement = impressions > 0 ? (clicks / impressions) * 100 : 0;
    
    hourlyData.push({
      hour,
      clicks: Math.max(0, clicks),
      impressions: Math.max(0, impressions),
      engagement: parseFloat(engagement.toFixed(2)),
    });
  }
  
  return hourlyData;
}

export default function TimeOfDayHeatmap({ hourlyData }: TimeOfDayHeatmapProps) {
  // Find max engagement for color scaling
  const maxEngagement = Math.max(...hourlyData.map(d => d.engagement), 1);
  const maxClicks = Math.max(...hourlyData.map(d => d.clicks), 1);
  
  // Group hours into time periods for better visualization
  const timePeriods = [
    { label: 'Early Morning', hours: [0, 1, 2, 3, 4, 5] },
    { label: 'Morning', hours: [6, 7, 8, 9, 10, 11] },
    { label: 'Afternoon', hours: [12, 13, 14, 15, 16, 17] },
    { label: 'Evening', hours: [18, 19, 20, 21, 22, 23] },
  ];
  
  const getIntensityColor = (engagement: number, maxEngagement: number) => {
    const intensity = Math.min(engagement / maxEngagement, 1);
    
    if (intensity < 0.2) {
      return 'bg-blue-100';
    } else if (intensity < 0.4) {
      return 'bg-blue-200';
    } else if (intensity < 0.6) {
      return 'bg-blue-400';
    } else if (intensity < 0.8) {
      return 'bg-blue-600';
    } else {
      return 'bg-blue-800';
    }
  };
  
  const getTextColor = (engagement: number, maxEngagement: number) => {
    const intensity = Math.min(engagement / maxEngagement, 1);
    return intensity > 0.5 ? 'text-white' : 'text-gray-700';
  };
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  };
  
  // Find peak hours
  const sortedByEngagement = [...hourlyData].sort((a, b) => b.engagement - a.engagement);
  const topHours = sortedByEngagement.slice(0, 3);
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">Time-of-Day Engagement Heatmap</h3>
          <p className="text-sm text-gray-500 mt-1">Engagement patterns throughout the day</p>
        </div>
      </div>
      
      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
          {hourlyData.map((data) => {
            const intensity = Math.min(data.engagement / maxEngagement, 1);
            const bgColor = getIntensityColor(data.engagement, maxEngagement);
            const textColor = getTextColor(data.engagement, maxEngagement);
            
            return (
              <div
                key={data.hour}
                className={`${bgColor} ${textColor} rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer group relative`}
                style={{
                  opacity: intensity < 0.1 ? 0.5 : 1,
                }}
                title={`${formatHour(data.hour)}: ${data.clicks} clicks, ${data.impressions.toLocaleString()} impressions, ${data.engagement.toFixed(2)}% engagement`}
              >
                <div className="text-center">
                  <div className="text-xs font-bold mb-1">{formatHour(data.hour)}</div>
                  <div className="text-xs font-semibold">{data.clicks}</div>
                  <div className="text-[10px] opacity-75">clicks</div>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                    <div className="font-bold mb-1">{formatHour(data.hour)}</div>
                    <div>Clicks: {data.clicks.toLocaleString()}</div>
                    <div>Impressions: {data.impressions.toLocaleString()}</div>
                    <div>Engagement: {data.engagement.toFixed(2)}%</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <div className="w-4 h-4 bg-blue-800 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
      
      {/* Peak Hours Summary */}
      {topHours.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Peak Engagement Hours</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topHours.map((data, index) => (
              <div
                key={data.hour}
                className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase">#{index + 1}</span>
                  <span className="text-lg font-bold text-orange-700">{formatHour(data.hour)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Engagement:</span>
                    <span className="font-bold text-gray-900">{data.engagement.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Clicks:</span>
                    <span className="font-bold text-gray-900">{data.clicks.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Time Period Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Engagement by Time Period</h4>
        <div className="space-y-3">
          {timePeriods.map((period) => {
            const periodData = hourlyData.filter(d => period.hours.includes(d.hour));
            const totalClicks = periodData.reduce((sum, d) => sum + d.clicks, 0);
            const totalImpressions = periodData.reduce((sum, d) => sum + d.impressions, 0);
            const avgEngagement = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
            const percentage = hourlyData.reduce((sum, d) => sum + d.clicks, 0) > 0
              ? (totalClicks / hourlyData.reduce((sum, d) => sum + d.clicks, 0)) * 100
              : 0;
            
            return (
              <div key={period.label} className="flex items-center gap-4">
                <div className="w-24 text-xs font-semibold text-gray-600">{period.label}</div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden shadow-inner">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 10 && (
                        <span className="text-xs text-white font-bold">
                          {totalClicks.toLocaleString()} clicks
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-32 text-xs text-gray-500 text-right font-medium">
                  {avgEngagement.toFixed(2)}% avg
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

