'use client';

import React from 'react';
import { AdCopySuggestion } from '@/types';

interface AdPreviewCardProps {
  adCopy: AdCopySuggestion;
  imageUrl: string | null;
}

export default function AdPreviewCard({ adCopy, imageUrl }: AdPreviewCardProps) {
  const defaultImageUrl = 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Ad+Preview';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md mx-auto">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 relative">
        <img
          src={imageUrl || defaultImageUrl}
          alt="Ad preview"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{adCopy.headline}</h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{adCopy.primaryText}</p>
        <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          {adCopy.ctaLabel}
        </button>
      </div>
    </div>
  );
}

