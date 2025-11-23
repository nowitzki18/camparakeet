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
    <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-large max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-300">
      {/* Image */}
      <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img
          src={imageUrl || defaultImageUrl}
          alt="Ad preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          Ad Preview
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
        <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">{adCopy.headline}</h3>
        <p className="text-gray-700 text-sm mb-5 line-clamp-2 leading-relaxed">{adCopy.primaryText}</p>
        <button className="w-full bg-gradient-primary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          {adCopy.ctaLabel}
        </button>
      </div>
    </div>
  );
}

