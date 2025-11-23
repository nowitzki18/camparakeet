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
    <div className="group relative bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex items-center justify-between mb-4 h-6 flex-shrink-0 min-w-0">
        <p 
          className="font-semibold text-gray-600 uppercase tracking-wide leading-tight flex-1 pr-2 overflow-hidden whitespace-nowrap"
          style={{ 
            fontSize: 'clamp(0.625rem, 2vw, 0.875rem)',
            textOverflow: 'ellipsis'
          }}
        >
          {label}
        </p>
        {trend ? (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
        ) : (
          <div className="w-8 h-8 flex-shrink-0"></div>
        )}
      </div>
      
      {/* Value Section - Flexible, centered */}
      <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
        <div className="mb-2 min-w-0 w-full overflow-hidden">
          <p 
            className={`font-bold bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent leading-none whitespace-nowrap overflow-hidden`}
            style={{ 
              fontSize: 'clamp(1.25rem, 3.5vw, 1.875rem)',
              textOverflow: 'ellipsis'
            }}
          >
            {value}
          </p>
        </div>
        <div className="h-5 flex items-start min-w-0 w-full overflow-hidden">
          {subLabel ? (
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{subLabel}</p>
          ) : (
            <span className="text-xs text-transparent">placeholder</span>
          )}
        </div>
      </div>
      
      {/* Footer - Fixed height */}
      <div className={`mt-4 h-1 bg-gradient-to-r ${gradientClasses[gradient]} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0`}></div>
      
      {/* Hover Tooltip - Shows full content */}
      <div className="absolute inset-0 bg-white rounded-xl shadow-2xl border-2 border-primary-300 p-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide leading-tight">
            {label}
          </p>
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
        <div className="flex-1 flex flex-col justify-center">
          <p className={`text-4xl font-bold bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent leading-none mb-2 break-all`}>
            {value}
          </p>
          {subLabel && (
            <p className="text-sm text-gray-500 font-medium break-words">{subLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

