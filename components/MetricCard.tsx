'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

export default function MetricCard({ 
  label, 
  value, 
  subLabel, 
  trend,
  gradient = 'blue'
}: MetricCardProps) {
  const gradientClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500',
  };

  return (
    <div className="group bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-large transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
        {trend && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <svg 
              className={`w-5 h-5 ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {trend === 'up' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />}
              {trend === 'down' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />}
              {trend === 'neutral' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />}
            </svg>
          </div>
        )}
      </div>
      <p className={`text-4xl font-bold bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent mb-2`}>
        {value}
      </p>
      {subLabel && (
        <p className="text-xs text-gray-500 font-medium">{subLabel}</p>
      )}
      <div className={`mt-4 h-1 bg-gradient-to-r ${gradientClasses[gradient]} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
}

