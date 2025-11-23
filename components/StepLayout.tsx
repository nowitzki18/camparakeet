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
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded-full shadow-soft">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600 bg-white/80 px-4 py-2 rounded-full shadow-soft">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 mx-1 h-1 rounded-full transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? 'bg-gradient-primary shadow-glow'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 md:p-10 mb-6 border border-white/50 animate-scale-in">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <div>
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="group px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 transform hover:scale-105 shadow-soft hover:shadow-medium"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {backLabel}
                </span>
              </button>
            )}
          </div>
          <div>
            {showNext && onNext && (
              <button
                onClick={onNext}
                className="group px-8 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 shadow-medium"
              >
                <span className="flex items-center gap-2">
                  {nextLabel}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

