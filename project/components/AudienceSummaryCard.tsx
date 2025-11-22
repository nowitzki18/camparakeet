'use client';

import React from 'react';
import { AudiencePreset } from '@/types';

interface AudienceSummaryCardProps {
  location: string;
  radius: string;
  preset: AudiencePreset | '';
  customDescription: string;
}

export default function AudienceSummaryCard({
  location,
  radius,
  preset,
  customDescription,
}: AudienceSummaryCardProps) {
  const getPresetDescription = (preset: AudiencePreset | '') => {
    switch (preset) {
      case 'Broad – all adults':
        return 'All adults aged 18+';
      case 'Local families':
        return 'Families with children, ages 25-45';
      case 'Young professionals':
        return 'Professionals aged 22-35, higher income';
      case 'Custom description':
        return customDescription || 'Custom audience';
      default:
        return 'Not specified';
    }
  };

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Summary</h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">Location: </span>
          <span className="text-gray-600">{location || 'Not specified'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Radius: </span>
          <span className="text-gray-600">{radius || 'Not specified'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Target Audience: </span>
          <span className="text-gray-600">{getPresetDescription(preset)}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-primary-200">
        <p className="text-xs text-gray-500">
          This summary will help you understand who will see your campaign.
        </p>
      </div>
    </div>
  );
}

