import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { triageService } from '../services/triageService';

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 ${color} flex flex-col gap-1`}>
      <p className="text-4xl font-bold">{value ?? '—'}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useApp();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    triageService.getStats()
      .then(setStats)
      .catch(() => setError(t.errors.fetchFailed));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm">{error}</div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <span className="animate-pulse">{t.dashboard.loading}</span>
      </div>
    );
  }

  const dist = stats.risk_distribution || {};

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      <h2 className="text-xl font-bold text-gray-800">{t.dashboard.title}</h2>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <StatCard
            label={t.dashboard.total}
            value={stats.total_sessions}
            color="bg-blue-50 text-blue-800"
          />
        </div>
        <StatCard label={t.dashboard.high}   value={dist.HIGH}   color="bg-red-50 text-red-700" />
        <StatCard label={t.dashboard.medium} value={dist.MEDIUM} color="bg-amber-50 text-amber-700" />
        <StatCard label={t.dashboard.low}    value={dist.LOW}    color="bg-green-50 text-green-700" />
      </div>

      {/* Risk bar */}
      {stats.total_sessions > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Risk Distribution</p>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            {dist.HIGH > 0 && (
              <div
                className="bg-red-400 transition-all"
                style={{ width: `${(dist.HIGH / stats.total_sessions) * 100}%` }}
                title={`High: ${dist.HIGH}`}
              />
            )}
            {dist.MEDIUM > 0 && (
              <div
                className="bg-amber-400 transition-all"
                style={{ width: `${(dist.MEDIUM / stats.total_sessions) * 100}%` }}
                title={`Medium: ${dist.MEDIUM}`}
              />
            )}
            {dist.LOW > 0 && (
              <div
                className="bg-green-400 transition-all"
                style={{ width: `${(dist.LOW / stats.total_sessions) * 100}%` }}
                title={`Low: ${dist.LOW}`}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>High {dist.HIGH > 0 ? Math.round((dist.HIGH / stats.total_sessions) * 100) : 0}%</span>
            <span>Med {dist.MEDIUM > 0 ? Math.round((dist.MEDIUM / stats.total_sessions) * 100) : 0}%</span>
            <span>Low {dist.LOW > 0 ? Math.round((dist.LOW / stats.total_sessions) * 100) : 0}%</span>
          </div>
        </div>
      )}

      {/* Districts */}
      {stats.districts && stats.districts.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.districts}</p>
          <div className="space-y-2">
            {stats.districts.slice(0, 8).map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="text-sm text-gray-700 w-32 truncate">{d.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(d.count / stats.total_sessions) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
