import React from 'react';
import RiskCard from './RiskCard';

export default function MessageBubble({ message }) {
  const { role, text, triageResult, error } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-nepal-blue flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
          AI
        </div>
      )}

      <div className={`max-w-[80%] space-y-2`}>
        {/* Text bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : error
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
              : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
          }`}
        >
          {text}
        </div>

        {/* Triage result card (AI only) */}
        {triageResult && (
          <RiskCard
            risk={triageResult.risk}
            advice={triageResult.brief_advice || triageResult.advice}
            action={triageResult.action}
            nepaliAdvice={triageResult.nepali_advice}
            nearestPost={triageResult.recommended_facilities?.[0] || triageResult.nearest_post}
            recommendedFacilityType={triageResult.recommended_facility_type}
            triageResult={triageResult}
          />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold ml-2 flex-shrink-0 mt-0.5">
          You
        </div>
      )}
    </div>
  );
}
