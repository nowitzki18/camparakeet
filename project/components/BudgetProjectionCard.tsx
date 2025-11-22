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
  // Simple projection calculation
  const calculateProjections = () => {
    if (budgetAmount === 0) {
      return { reach: 0, clicks: 0 };
    }

    const days = endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 7; // Default to 7 days if continuous

    const totalBudget = budgetType === 'Daily budget' ? budgetAmount * days : budgetAmount;
    const weeklyBudget = totalBudget / (days / 7);

    // Rough estimates: $0.50 per click, $0.05 per impression
    const estimatedClicks = Math.floor(weeklyBudget / 0.5);
    const estimatedReach = Math.floor(weeklyBudget / 0.05);

    return {
      reach: estimatedReach,
      clicks: estimatedClicks,
    };
  };

  const projections = calculateProjections();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated Reach</p>
          <p className="text-2xl font-bold text-blue-600">
            {projections.reach > 0 ? `${(projections.reach / 1000).toFixed(1)}k–${((projections.reach * 1.5) / 1000).toFixed(1)}k` : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">people / week</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated Clicks</p>
          <p className="text-2xl font-bold text-blue-600">
            {projections.clicks > 0 ? `${projections.clicks}–${Math.floor(projections.clicks * 1.6)}` : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">clicks / week</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-blue-200">
        * Estimates are based on industry averages and may vary based on targeting and creative quality.
      </p>
    </div>
  );
}

