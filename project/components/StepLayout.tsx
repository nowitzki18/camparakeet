'use client';

import React from 'react';

interface StepLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export default function StepLayout({
  currentStep,
  totalSteps,
  children,
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextLabel = 'Next',
  backLabel = 'Back',
}: StepLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {backLabel}
              </button>
            )}
          </div>
          <div>
            {showNext && onNext && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

