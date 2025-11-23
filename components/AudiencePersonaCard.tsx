'use client';

import React from 'react';
import { AudiencePersona } from '@/types';

interface AudiencePersonaCardProps {
  persona: AudiencePersona;
}

export default function AudiencePersonaCard({ persona }: AudiencePersonaCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-medium animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Audience Persona</h3>
          <p className="text-sm text-gray-600">AI-generated persona based on your inputs</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/80">
          <h4 className="text-lg font-bold text-gray-900 mb-2">{persona.title}</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{persona.demographicSummary}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/80">
            <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Interests
            </h5>
            <ul className="space-y-2">
              {persona.interests.map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  {interest}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/80">
            <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Behaviours
            </h5>
            <ul className="space-y-2">
              {persona.behaviours.map((behaviour, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  {behaviour}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          This persona helps you understand and target your ideal customer more effectively.
        </p>
      </div>
    </div>
  );
}

