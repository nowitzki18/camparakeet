'use client';

import React from 'react';
import { BudgetType } from '@/types';

interface BudgetProjectionCardProps {
  budgetType: BudgetType;
  budgetAmount: number;
  startDate: string;
  endDate: string | null;
}

export default function BudgetProjectionCard({
  budgetType,
  budgetAmount,
  startDate,
  endDate,
}: BudgetProjectionCardProps) {
  const calculateProjections = () => {
    if (budgetAmount === 0) {
      return { reach: 0, clicks: 0 };
    }

    const days = endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 7;

    const totalBudget = budgetType === 'Daily budget' ? budgetAmount * days : budgetAmount;
    const weeklyBudget = totalBudget / (days / 7);

    const estimatedClicks = Math.floor(weeklyBudget / 0.5);
    const estimatedReach = Math.floor(weeklyBudget / 0.05);

    return {
      reach: estimatedReach,
      clicks: estimatedClicks,
    };
  };

  const projections = calculateProjections();

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-2 border-cyan-200 rounded-2xl p-6 mt-6 shadow-medium animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Estimated Performance</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/80 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estimated Reach</p>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
            {projections.reach > 0 ? `${(projections.reach / 1000).toFixed(1)}k–${((projections.reach * 1.5) / 1000).toFixed(1)}k` : '0'}
          </p>
          <p className="text-xs text-gray-500 font-medium">people / week</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/80 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estimated Clicks</p>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            {projections.clicks > 0 ? `${projections.clicks}–${Math.floor(projections.clicks * 1.6)}` : '0'}
          </p>
          <p className="text-xs text-gray-500 font-medium">clicks / week</p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-cyan-200">
        <p className="text-xs text-gray-600 flex items-start gap-2">
          <svg className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Estimates are based on industry averages and may vary based on targeting and creative quality.</span>
        </p>
      </div>
    </div>
  );
}

