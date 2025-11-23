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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-medium animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.137M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.137M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Audience Summary</h3>
      </div>
      <div className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900">{location || 'Not specified'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Radius</p>
              <p className="text-sm font-medium text-gray-900">{radius || 'Not specified'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Target Audience</p>
              <p className="text-sm font-medium text-gray-900">{getPresetDescription(preset)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          This summary will help you understand who will see your campaign.
        </p>
      </div>
    </div>
  );
}

