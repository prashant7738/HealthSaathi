import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RISK_CONFIG = {
  HIGH:   { bg: 'bg-red-50',    border: 'border-red-400',  badge: 'bg-red-500',   icon: '🚨' },
  MEDIUM: { bg: 'bg-amber-50',  border: 'border-amber-400', badge: 'bg-amber-500',  icon: '⚠️' },
  LOW:    { bg: 'bg-green-50',  border: 'border-green-400', badge: 'bg-green-500',  icon: '✅' },
};

export default function RiskCard({ risk, advice, action, nepaliAdvice, nearestPost, recommendedFacilityType, triageResult }) {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.MEDIUM;
  
  
  const handleHospitalClick = () => {
    
    const hasDirectCoords = nearestPost?.lat && nearestPost?.lng;
    const hasCentroidCoords = nearestPost?.centroid;
    
    if (hasDirectCoords || hasCentroidCoords) {
      navigate('/map', { state: { targetHospital: nearestPost } });
    }
  };
  
  
  const briefAdvice = triageResult?.brief_advice || advice;
  const detailedAdvice = triageResult?.detailed_advice;
  const foodEat = triageResult?.food_eat?.split('|').map(f => f.trim()).filter(Boolean) || [];
  const foodAvoid = triageResult?.food_avoid?.split('|').map(f => f.trim()).filter(Boolean) || [];
  const dos = triageResult?.dos?.split('|').map(d => d.trim()).filter(Boolean) || [];
  const donts = triageResult?.donts?.split('|').map(d => d.trim()).filter(Boolean) || [];

  return (
    <div className={`rounded-xl border-2 ${cfg.border} ${cfg.bg} p-4 space-y-3`}>
      {/* Risk badge */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{cfg.icon}</span>
        <span className={`${cfg.badge} text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide`}>
          {t.risk[risk]}
        </span>
      </div>

      {/* Brief Advice */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t.chat.advice}</p>
        <p className="text-gray-800 font-medium">{briefAdvice}</p>
      </div>

      {/* Detailed Advice */}
      {detailedAdvice && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Detailed Guidance</p>
          <p className="text-sm text-gray-700 leading-relaxed">{detailedAdvice}</p>
        </div>
      )}

      {/* Foods to Eat */}
      {foodEat.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">🍎 Foods to Eat</p>
          <p className="text-sm text-gray-700">{foodEat.join(', ')}</p>
        </div>
      )}

      {/* Foods to Avoid */}
      {foodAvoid.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">🚫 Foods to Avoid</p>
          <p className="text-sm text-gray-700">{foodAvoid.join(', ')}</p>
        </div>
      )}

      {/* Do's */}
      {dos.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">✅ Do These</p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {dos.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* Don'ts */}
      {donts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">❌ Do NOT Do</p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {donts.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      )}

      {recommendedFacilityType && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t.chat.suggestedSector}</p>
          <p className="text-gray-700 capitalize font-semibold">{recommendedFacilityType}</p>
        </div>
      )}

      {/* Nearest health post (COMBINED FEATURES) */}
      {nearestPost && (
        <div 
          onClick={handleHospitalClick}
          className="bg-white/70 rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{t.chat.nearestPost}</p>
            <span className="text-xs text-blue-500 font-medium">View on Map ↗</span>
          </div>
          <p className="font-semibold text-gray-800">{nearestPost.name}</p>
          {nearestPost.address && <p className="text-sm text-gray-600">{nearestPost.address}</p>}
          <div className="flex flex-col gap-2 mt-1.5 text-sm text-gray-600">
            {nearestPost.type && (
              <span className="capitalize">🏥 {nearestPost.type.replace('_', ' ')}</span>
            )}
            {nearestPost.tags && (
              <span className="break-words whitespace-normal text-xs text-gray-500">🏷️ {String(nearestPost.tags)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
